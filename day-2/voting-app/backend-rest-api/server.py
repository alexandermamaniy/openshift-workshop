#!/usr/bin/env python3
"""Voting API: a minimal HTTP server (no web framework) backed by PostgreSQL.

Uses the standard library HTTP server and the psycopg driver.

Endpoints (GET only):
  /health                              process is alive (no database access)
  /ready                               database is reachable
  /api/candidates                      active candidates
  /api/vote?voter=NAME&candidate_id=N  cast a vote (one vote per voter)
  /api/results                         votes per candidate

Configuration (environment variables):
  POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD   required (same keys as the database Secret/ConfigMap)
  DB_HOST (default voting-db), DB_PORT (default 5432)
  BIND_ADDRESS (default 127.0.0.1), PORT (default 8080)

The database enforces the rules (unique voter, existing candidate), so any number of
API replicas can run side by side.
"""
import json
import logging
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

import psycopg
from psycopg import errors

BIND_ADDRESS = os.environ.get("BIND_ADDRESS", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8080"))
POD_NAME = os.environ.get("HOSTNAME", "local")
MAX_VOTER_LENGTH = 50
MAX_INT4 = 2**31 - 1  # candidate.id is a 32-bit integer

logger = logging.getLogger("voting-api")
DB = {}


class JsonFormatter(logging.Formatter):
    def format(self, record):
        entry = {
            "time": self.formatTime(record),
            "level": record.levelname,
            "message": record.getMessage(),
        }
        if record.exc_info:
            entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(entry)


def db_settings():
    try:
        return {
            "host": os.environ.get("DB_HOST", "voting-db"),
            "port": int(os.environ.get("DB_PORT", "5432")),
            "dbname": os.environ["POSTGRES_DB"],
            "user": os.environ["POSTGRES_USER"],
            "password": os.environ["POSTGRES_PASSWORD"],
            "connect_timeout": 5,
        }
    except KeyError as missing:
        sys.exit(f"Missing required environment variable: {missing.args[0]}")


def connect():
    return psycopg.connect(**DB)


def list_candidates():
    with connect() as conn, conn.cursor() as cur:
        cur.execute("SELECT id, name FROM candidate WHERE active ORDER BY id")
        return 200, {"candidates": [{"id": i, "name": n} for i, n in cur.fetchall()]}


def get_results():
    with connect() as conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT c.id, c.name, COUNT(v.id) AS votes
            FROM candidate c
            LEFT JOIN vote v ON v.candidate_id = c.id
            GROUP BY c.id, c.name
            ORDER BY votes DESC, c.name
            """
        )
        rows = cur.fetchall()
    results = [{"candidate_id": i, "name": n, "votes": v} for i, n, v in rows]
    return 200, {"results": results, "total": sum(r["votes"] for r in results)}


def cast_vote(query):
    # The database also checks this (voter = lower(btrim(voter))): same name, same voter.
    voter = query.get("voter", [""])[0].strip().lower()
    candidate = query.get("candidate_id", [""])[0]

    if not voter or len(voter) > MAX_VOTER_LENGTH or not voter.isprintable():
        return 400, {"error": f"voter must be 1-{MAX_VOTER_LENGTH} printable characters"}
    if not (candidate.isascii() and candidate.isdigit()) or int(candidate) > MAX_INT4:
        return 400, {"error": "candidate_id must be a number"}
    candidate_id = int(candidate)

    try:
        with connect() as conn, conn.cursor() as cur:
            cur.execute("SELECT 1 FROM candidate WHERE id = %s AND active", (candidate_id,))
            if cur.fetchone() is None:
                return 404, {"error": "candidate not found"}
            cur.execute(
                "INSERT INTO vote (voter, candidate_id) VALUES (%s, %s) "
                "ON CONFLICT (voter) DO NOTHING RETURNING id",
                (voter, candidate_id),
            )
            if cur.fetchone() is None:
                return 409, {"error": "this voter has already voted"}
    except errors.CheckViolation:
        return 400, {"error": "voter name is not valid"}
    return 201, {"status": "voted", "voter": voter, "candidate_id": candidate_id}


def check_ready():
    with connect() as conn, conn.cursor() as cur:
        cur.execute("SELECT 1")
    return 200, {"status": "ready"}


class Handler(BaseHTTPRequestHandler):
    server_version = "VotingAPI"
    sys_version = ""

    def send_json(self, status, body):
        payload = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Pod-Name", POD_NAME)  # shows which replica answered
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        url = urlsplit(self.path)
        try:
            if url.path == "/health":
                status, body = 200, {"status": "ok"}
            elif url.path == "/ready":
                status, body = check_ready()
            elif url.path == "/api/candidates":
                status, body = list_candidates()
            elif url.path == "/api/results":
                status, body = get_results()
            elif url.path == "/api/vote":
                status, body = cast_vote(parse_qs(url.query))
            else:
                status, body = 404, {"error": "not found"}
        except psycopg.OperationalError:
            logger.exception("database unavailable")
            status, body = 503, {"error": "service unavailable"}
        except Exception:
            logger.exception("unexpected error")
            status, body = 500, {"error": "internal error"}
        self.send_json(status, body)

    def method_not_allowed(self):
        self.send_json(405, {"error": "only GET is supported"})

    do_POST = do_PUT = do_PATCH = do_DELETE = method_not_allowed

    def log_request(self, code="-", size="-"):
        # Log the path only: the query string contains the voter name.
        logger.info("%s %s %s", self.command, urlsplit(self.path).path, code)

    def log_message(self, fmt, *args):
        logger.info(fmt, *args)


def main():
    global DB
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    logging.basicConfig(level=logging.INFO, handlers=[handler])

    DB = db_settings()
    server = ThreadingHTTPServer((BIND_ADDRESS, PORT), Handler)
    logger.info("listening on %s:%s", BIND_ADDRESS, PORT)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
