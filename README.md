# Projekt Gizmo

Official Project Gizmo website.

## Project structure

This is a static, GitHub Pages-compatible website. Pages are generated from
shared templates and language-specific content. The root `index.html` remains
as the GitHub Pages entry point.

```text
.
├── pl/index.html           # Generated Polish home page
├── pl/*.html               # Generated Polish pages
├── en/index.html           # Reserved English output
├── index.html              # GitHub Pages entry point
├── public/
│   └── external/           # Images and other static assets
└── src/
    ├── content/             # Homepage content for each language
    ├── templates/           # Shared and Polish page templates
    ├── scripts/             # Shared browser JavaScript
    └── styles/              # Shared and 404-page stylesheets
```

The Polish site is currently the maintained version. Its pages use the source
templates in `src/templates/pl/` and are generated under `/pl/`. The root
`index.html` is retained as the GitHub Pages entry point. English output is
reserved under `/en/` and will be completed when its content is updated.

Homepage translations live in `src/content/*.json`; do not duplicate the
homepage markup. Shared behavior belongs in `src/scripts`, shared
presentation belongs in `src/styles`, and reusable assets belong in
`public/external`.

Run `npm run build` after content or template changes. Deploy the repository
to GitHub Pages after building.
