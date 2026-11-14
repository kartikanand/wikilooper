# WikiLooper

Follow the first link in the main text of a Wikipedia article, then repeat on each new article. You'll usually end up at **Philosophy**, unless you hit a dead end or a loop. See [xkcd 903](https://xkcd.com/903/).

**Live:** https://kartikanand.github.io/wikilooper/

A static, framework-free site (native ES modules, modern CSS). It runs entirely in the browser and uses the Wikimedia Action API (`action=parse`, CORS via `origin=*`). There is no backend or build step.

## Develop

```sh
npm start   # serves on http://localhost:8000
npm test    # unit tests for the pure link helpers (node --test)
```

Pushes to `main` deploy to GitHub Pages.
