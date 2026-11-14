// Pure helpers (no DOM) so they can be unit-tested with `node --test`.

const NAMESPACE =
  /^(file|image|help|wikipedia|category|template|special|portal|talk|draft|module|mediawiki|user|book|timedtext|topic)(\s+talk)?:/i;

/** Net change in parenthesis depth contributed by a run of text. */
export function parenDelta(text) {
  let delta = 0;
  for (const ch of text) {
    if (ch === "(") delta++;
    else if (ch === ")") delta--;
  }
  return delta;
}

/**
 * Turn an href like "/wiki/Foo_(bar)#baz" into an article title ("Foo (bar)").
 * Returns null for anything that is not a plain main-namespace article link.
 */
export function titleFromHref(href) {
  if (typeof href !== "string" || !href.startsWith("/wiki/")) return null;
  const raw = href.slice("/wiki/".length).split("#")[0].split("?")[0];
  let title;
  try {
    title = decodeURIComponent(raw).replaceAll("_", " ").trim();
  } catch {
    return null;
  }
  if (!title || NAMESPACE.test(title)) return null;
  return title;
}

export const wikiUrl = (title) =>
  `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
