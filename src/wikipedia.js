import { parenDelta, titleFromHref } from "./links.js";

const API = "https://en.wikipedia.org/w/api.php";

// Links inside these are never "the first link in the main text".
const IGNORED = "i, em, sup, table, style, .hatnote, .thumb, .infobox, .navbox, .noprint, .reference, .mw-ref";

export class WikiError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind; // "missing" | "network" | "rate-limit" | "dead-end"
  }
}

/** Fetch an article's rendered HTML through the Action API (CORS via origin=*). */
export async function fetchArticle(title, { signal } = {}) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: "parse",
    page: title,
    prop: "text",
    redirects: "1",
    disableeditsection: "1",
    format: "json",
    formatversion: "2",
    origin: "*",
  });

  let res;
  try {
    res = await fetch(url, { signal, headers: { "Api-User-Agent": "wikilooper (github.com/kartikanand/wikilooper)" } });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new WikiError("network", "Couldn't reach Wikipedia. Check your connection.");
  }
  if (res.status === 429) throw new WikiError("rate-limit", "Wikipedia is rate limiting us. Try again shortly.");
  if (!res.ok) throw new WikiError("network", `Wikipedia returned HTTP ${res.status}.`);

  const data = await res.json();
  if (data.error) {
    throw new WikiError("missing", `"${title}" isn't a Wikipedia article.`);
  }
  // DOMParser yields an inert document: no scripts run, nothing is loaded.
  const doc = new DOMParser().parseFromString(data.parse.text, "text/html");
  return { title: data.parse.title, doc };
}

/**
 * First valid article link in the lead text that isn't in parentheses/italics
 * and isn't in `visited`. Falls back to the first list item, like the original.
 */
export function findNextTitle(doc, visited) {
  const root = doc.querySelector(".mw-parser-output") ?? doc.body;

  for (const p of root.querySelectorAll(":scope > p")) {
    let depth = 0;
    const walker = doc.createTreeWalker(p, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.parentElement.closest(IGNORED)) depth += parenDelta(node.data);
        continue;
      }
      if (node.localName !== "a" || depth > 0 || node.closest(IGNORED)) continue;
      const title = candidate(node, visited);
      if (title) return title;
    }
  }

  for (const a of root.querySelectorAll(":scope > ul > li a")) {
    const title = candidate(a, visited);
    if (title) return title;
  }
  return null;
}

function candidate(a, visited) {
  if (a.classList.contains("new") || a.classList.contains("mw-selflink")) return null;
  const title = titleFromHref(a.getAttribute("href"));
  return title && !visited.has(title) ? title : null;
}
