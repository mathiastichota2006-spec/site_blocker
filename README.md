# Site Blocker

Doplněk do prohlížeče Firefoxu na blokování surfování na nechtěních stránkách pro lepší produktivitu.

## Features

- [x] Přidat jádro — core blocking engine using `webRequest` to intercept and redirect matching navigations
- [x] Přidat menu — modern popup UI with tabbed navigation (Sites / Keywords / Settings)
- [x] Přidat možnost přidávat blokované stránky — add/remove blocked sites and URL keywords
- [x] Přidat možnost změnit si světlý režim na tmavý — light/dark theme toggle, persisted in storage

## What it does

- Blocks full sites (e.g. `youtube.com`) and any of their subdomains.
- Blocks pages whose URL contains a user-defined keyword (e.g. `porn`, `game`).
- When a blocked page is visited, the tab is **not** closed. Instead it is redirected to a
  built-in page that reads `"[url] was blocked!"`.
- Settings (blocked sites, blocked keywords, theme) are stored with `browser.storage.local` and
  apply instantly, no restart required.

## Loading the extension in Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select the `manifest.json` file in this repository.
4. Click the toolbar icon to open the Site Blocker popup and start adding sites/keywords.

## Project structure

```
manifest.json        Manifest V3 config targeting recent Firefox versions
background.js         Core blocking logic (webRequest listener + storage sync)
popup/                Extension popup UI (Sites / Keywords / Settings tabs)
blocked/              The "blocked" page shown instead of the requested site
icons/                Toolbar/extension icons
```

## Linting

The extension can be validated with [`web-ext`](https://github.com/mozilla/web-ext):

```
npx web-ext lint --source-dir=.
```
