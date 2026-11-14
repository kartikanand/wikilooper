import { fetchArticle, findNextTitle, WikiError } from "./wikipedia.js";
import { wikiUrl } from "./links.js";

const TARGET = "Philosophy";
const MAX_HOPS = 100;

const form = document.querySelector("#form");
const input = document.querySelector("#start");
const button = form.querySelector("button[type=submit]");
const list = document.querySelector("#path");
const status = document.querySelector("#status");

let controller = null;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const start = input.value.trim();
  if (!start) return say("Enter an article title to start.", "error");

  controller?.abort();
  controller = new AbortController();
  await run(start, controller.signal);
});

async function run(start, signal) {
  list.replaceChildren();
  document.querySelector("#about").open = false;
  button.disabled = true;
  say("Looping…");

  const visited = new Set();
  let title = start;
  try {
    for (let hop = 0; hop < MAX_HOPS; hop++) {
      const article = await fetchArticle(title, { signal });
      title = article.title; // canonical, after redirects
      if (visited.has(title)) return say(`Stuck in a loop at “${title}”.`, "error");
      visited.add(title);
      addItem(title);

      if (title === TARGET) return say(`Reached ${TARGET} in ${visited.size - 1} step${visited.size === 2 ? "" : "s"}.`, "done");

      const next = findNextTitle(article.doc, visited);
      if (!next) return say(`Dead end: “${title}” has no usable links.`, "error");
      title = next;
    }
    say(`Gave up after ${MAX_HOPS} hops.`, "error");
  } catch (err) {
    if (err.name === "AbortError") return;
    say(err instanceof WikiError ? err.message : "Something went wrong.", "error");
  } finally {
    if (!signal.aborted) button.disabled = false;
    list.lastElementChild?.setAttribute("aria-current", "step");
  }
}

function addItem(title) {
  const a = document.createElement("a");
  a.textContent = title;
  a.href = wikiUrl(title);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  const li = document.createElement("li");
  li.append(a);
  list.append(li);
}

function say(message, state = "") {
  status.textContent = message;
  status.dataset.state = state;
}
