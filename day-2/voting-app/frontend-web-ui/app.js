"use strict";

// The browser only talks to this web server. nginx forwards /api/ to the
// voting-api Service (see api-proxy.conf).

const candidatesEl = document.getElementById("candidates");
const resultsEl = document.getElementById("results");
const totalEl = document.getElementById("total");
const messageEl = document.getElementById("message");
const podEl = document.getElementById("pod");
const form = document.getElementById("vote-form");

function showMessage(text, isError) {
  messageEl.textContent = text;
  messageEl.className = isError ? "error" : "ok";
}

async function callApi(path) {
  const response = await fetch(path);
  const pod = response.headers.get("X-Pod-Name");
  if (pod) {
    podEl.textContent = pod;
  }
  const body = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, body };
}

async function loadCandidates() {
  try {
    const { ok, body } = await callApi("/api/candidates");
    if (!ok) {
      candidatesEl.textContent = "Could not load the candidates.";
      return;
    }
    candidatesEl.textContent = "";
    body.candidates.forEach((candidate, index) => {
      const id = "candidate-" + candidate.id;
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "candidate_id";
      input.id = id;
      input.value = candidate.id;
      input.required = true;
      input.checked = index === 0;
      const label = document.createElement("label");
      label.htmlFor = id;
      label.textContent = candidate.name;
      const row = document.createElement("div");
      row.append(input, label);
      candidatesEl.append(row);
    });
  } catch (error) {
    candidatesEl.textContent = "The API is not reachable.";
  }
}

async function loadResults() {
  try {
    const { ok, body } = await callApi("/api/results");
    if (!ok) {
      return;
    }
    resultsEl.textContent = "";
    body.results.forEach((result) => {
      const name = document.createElement("span");
      name.textContent = result.name;
      const votes = document.createElement("strong");
      votes.textContent = result.votes;
      const item = document.createElement("li");
      item.append(name, votes);
      resultsEl.append(item);
    });
    totalEl.textContent = "Total votes: " + body.total;
  } catch (error) {
    totalEl.textContent = "The API is not reachable.";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const voter = document.getElementById("voter").value;
  const selected = form.querySelector("input[name=candidate_id]:checked");
  if (!selected) {
    showMessage("Choose a candidate.", true);
    return;
  }
  const query = new URLSearchParams({ voter: voter, candidate_id: selected.value });
  try {
    const { ok, body } = await callApi("/api/vote?" + query.toString());
    if (ok) {
      showMessage("Thanks " + body.voter + ", your vote was recorded.", false);
      form.reset();
      loadResults();
    } else {
      showMessage(body.error || "The vote could not be recorded.", true);
    }
  } catch (error) {
    showMessage("The API is not reachable.", true);
  }
});

document.getElementById("refresh").addEventListener("click", loadResults);

loadCandidates();
loadResults();
