---
title: Setup Guide
date: 2025-10-21
tags:
  - guides
readingTime: 5
draft: false
---

# Setup Guide

A GitHub account is required to use Quartz and Quartz Syncer.

## Set up Quartz first

Quartz Syncer manages Quartz content from Obsidian. Make sure you have Quartz configured before enabling the plugin.

### 1. Create the Quartz repository

If you have not already, create a new repository based on the official Quartz template:

```
https://github.com/jackyzha0/quartz/generate
```

Name the repository after the site you want to publish. If you want the site to live at `https://smrik.github.io`, create the repository `smrik/smrik.github.io`. If you prefer a project page (for example `https://smrik.github.io/quartz`), name the repository `smrik/quartz`.

### 2. Configure Quartz

Open `quartz.config.ts` and update the core settings. The example below shows only the relevant portion—do not remove other settings.

```ts
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Quartz 4",
    baseUrl: "smrik.github.io",
    defaultDateType: "modified",
    // … keep remaining options unchanged
  },
  plugins: {
    transformers: [
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      // … keep remaining plugins unchanged
    ],
  },
}
```

- `pageTitle`: Controls the browser tab title.
- `baseUrl`: Use `smrik.github.io` for a user site, or `smrik.github.io/repository-name` for a project site.
- `defaultDateType`: Set to `created`, `modified`, or `published` depending on which date you want displayed on notes.
- `markdownLinkResolution`: Match this to the way Obsidian resolves links (`shortest`, `relative`, or `absolute`).

### 3. Configure automatic deployment

Enable GitHub Pages for the repository: **Settings → Pages → Source → GitHub Actions**.

Add `.github/workflows/deploy.yaml` with one of the templates below.

#### Option 1: Default Quartz

```yaml
name: Deploy Quartz site to GitHub Pages

on:
  push:
    branches:
      - v4

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx quartz build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### Option 2: Quartz with Quartz Themes

Use this if you want to pull an Obsidian theme during the build. Replace `THEME_NAME` with the desired theme.

```yaml
name: Deploy Quartz site to GitHub Pages

on:
  push:
    branches:
      - v4

env:
  THEME_NAME: tokyo-night

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: curl -s -S https://raw.githubusercontent.com/saberzero1/quartz-themes/master/action.sh | bash -s -- $THEME_NAME
      - run: npx quartz build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Run `npx quartz build` locally to confirm the markdown in your vault generates HTML in `public/`. If notes do not render, check that each file has front matter (see troubleshooting below).

## Generate a fine-grained access token

1. Go to `https://github.com/settings/tokens?type=beta`.
2. Set **Token name** to something descriptive, e.g. `Quartz Syncer token`.
3. Choose an **Expiration** date (GitHub emails you before it expires).
4. Under **Repository access**, select *Only select repositories* and pick your Quartz repository.
5. In **Repository permissions → Contents**, change **Access** from *No access* to *Read and write*.
6. Click **Generate token**, confirm the settings, and copy the token.

## Set up Quartz Syncer

1. Open Obsidian → **Settings → Community Plugins → Quartz Syncer → Options**.
2. Fill in the fields:
   - **GitHub repo name**: e.g. `smrik.github.io` or `quartz`.
   - **GitHub username**: `smrik`.
   - **GitHub token**: paste the fine-grained token (starts with `github_pat_` or `ghp_`).
3. You should see a green check mark once connection succeeds. If not, review the troubleshooting docs.

## Troubleshooting: Markdown not converting to HTML

- Ensure each note has YAML front matter:

  ```md
  ---
  title: My Note
  draft: false
  ---
  ```

  Notes without front matter may be skipped.

- Verify the note lives inside the `content` directory Quartz reads from. In this setup, `content` is a symlink to `Patrik's Vault/Zettelkasten`.
- Run `npx quartz build --verbose` to check for parser warnings. Fix any reported issues, then redeploy.

## All set

Once the workflow succeeds, your site publishes automatically at `https://smrik.github.io`. Trigger a deployment by pushing to the `v4` branch (or the branch you configured) or by running Quartz Syncer from Obsidian.

For additional options, refer to the Quartz documentation: `https://quartz.jzhao.xyz`.
