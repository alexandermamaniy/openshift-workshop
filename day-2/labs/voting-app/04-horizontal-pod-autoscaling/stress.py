"""
Stress test for the voting API.
Seeds random votes using a thread pool, then reports results.

Environment variables:
  API_URL      base URL of the voting API  (default: http://voting-api:8080)
  NUM_VOTES    total votes to cast          (default: 20000)
  NUM_THREADS  concurrent threads           (default: 50)
"""

import os
import random
import string
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

API         = os.environ.get("API_URL",     "http://voting-api:8080")
NUM_VOTES   = int(os.environ.get("NUM_VOTES",   20000))
NUM_THREADS = int(os.environ.get("NUM_THREADS", 50))


def random_voter():
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"voter-{suffix}"


def cast_vote(_):
    voter     = random_voter()
    candidate = random.randint(1, 3)
    url       = f"{API}/api/vote?voter={voter}&candidate_id={candidate}"
    try:
        with urllib.request.urlopen(url, timeout=5) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:
        return str(e)


def main():
    print(f"Casting {NUM_VOTES} votes with {NUM_THREADS} threads → {API}")
    ok = fail = 0

    with ThreadPoolExecutor(max_workers=NUM_THREADS) as pool:
        futures = [pool.submit(cast_vote, i) for i in range(NUM_VOTES)]
        for i, f in enumerate(as_completed(futures), 1):
            status = f.result()
            if status == 201:
                ok += 1
            else:
                fail += 1
            if i % 1000 == 0:
                print(f"  {i}/{NUM_VOTES}  ok={ok}  errors={fail}", flush=True)

    print(f"\nDone. votes={ok}  errors={fail}")


if __name__ == "__main__":
    main()
