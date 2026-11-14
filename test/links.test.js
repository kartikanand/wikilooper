import test from "node:test";
import assert from "node:assert/strict";
import { parenDelta, titleFromHref, wikiUrl } from "../src/links.js";

test("parenDelta", () => {
  assert.equal(parenDelta("a (b"), 1);
  assert.equal(parenDelta("c) d"), -1);
  assert.equal(parenDelta("(x) y"), 0);
});

test("titleFromHref accepts article links", () => {
  assert.equal(titleFromHref("/wiki/Foo_Bar#History"), "Foo Bar");
  assert.equal(titleFromHref("/wiki/Mercury_(planet)"), "Mercury (planet)");
  assert.equal(titleFromHref("/wiki/Caf%C3%A9"), "Café");
  assert.equal(titleFromHref("/wiki/Star_Trek:_Voyager"), "Star Trek: Voyager");
});

test("titleFromHref rejects non-articles", () => {
  for (const h of ["/wiki/File:X.png", "/wiki/Help:Foo", "/wiki/Category:A", "https://example.com", "//evil.com/wiki/x", "/w/index.php?title=X", "#cite", null, "/wiki/%E0%A4%A"]) {
    assert.equal(titleFromHref(h), null, String(h));
  }
});

test("wikiUrl encodes titles", () => {
  assert.equal(wikiUrl("A & B/C"), "https://en.wikipedia.org/wiki/A_%26_B%2FC");
});
