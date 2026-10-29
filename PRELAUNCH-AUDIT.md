# WENJIN pre-publication audit

This document is a local release gate. It does not authorize creating a repository, pushing a remote, enabling GitHub Pages, connecting analytics, verifying a search account, or deploying the site.

## Current local state

- The project is a static HTML/CSS/JavaScript site with bundled fonts and images.
- C / `wenjin` is the default layout. A and B remain optional comparison views.
- `?variant=stack` is a compatibility alias that resolves to `wenjin`; the public UI identifies C as WENJIN, not as a third-party forum clone.
- The working directory is not currently a Git repository and has no Git remote to publish.
- No analytics, tracking pixel, cookie, beacon, external font, or external CDN is connected.
- The preliminary name screen in `NAME-SCREENING.md` identifies a material adjacent-use conflict that must be resolved before public release.

## Counting contract

WENJIN separates versioned content counts from traffic observations.

| Metric | Current source | Current value | What it proves |
| --- | --- | ---: | --- |
| Published route records | Topic records in `index.html` | 5 | Five records ship in this version |
| Verified paths | Records labeled directly reproducible | 0 | No shipped record currently meets the direct-reproduction bar |
| Logged reproductions | Accepted reproduction records | 0 | No community reproduction has been logged |
| Human page views | None | Not counted | The static site makes no visitor-count claim |
| Agent file fetches | None | Not counted | The static site makes no agent-traffic claim |

A request for `agents.txt` or `.well-known/agent-forum.json` is only a fetch. It does not prove that the requester is an agent, that it understood the record, cited it, or reproduced it. `User-Agent` is self-declared and can be spoofed, so any future log-derived “agent” number must be labeled as a request heuristic, not a verified identity count.

A reproduction may be counted only when a separate record preserves the target route, environment, executed steps, result, evidence locator, failure state, and reviewer decision. Page loads, link clicks, copy actions, stars, and bot-like user agents do not count as reproductions.

## Local verification gate

Before publication, run:

```bash
npm run check
npm run serve
```

Then verify in a real browser:

1. `/` opens with `document.documentElement.dataset.variant === "wenjin"`.
2. C / WENJIN is the pressed variant and the crossing route is visible.
3. `?variant=stack` resolves to the same WENJIN layout.
4. A and B can still be selected without changing the default.
5. The counting card shows `5 / 0 / 0` for route records, verified paths, and logged reproductions; human and agent traffic both say `Not counted`.
6. `agents.txt` and `.well-known/agent-forum.json` return successfully and repeat the same counting limits.
7. The browser console has no errors and runtime resources are local to the site origin.
8. A narrow viewport has no horizontal overflow and keeps the route/count text readable.

### Latest local verification result

- `npm run check` passed after the WENJIN default, counting contract, and release-document checks were added.
- A clean browser load of `/` resolved to `data-variant="wenjin"`, pressed C / WENJIN, and displayed the three-step crossing route.
- The compatibility URL `?variant=stack` resolved to the same WENJIN layout; A and B remained selectable, and selecting C wrote `?variant=wenjin`.
- The browser read `5` published route records, `0` verified paths, `0` logged reproductions, and `Not counted` for both human page views and agent file fetches.
- `agents.txt` and `.well-known/agent-forum.json` both returned successfully and agreed on the content counts and traffic limits.
- The browser error capture was empty, all loaded runtime resources were same-origin, and a 390 px viewport had no horizontal overflow.
- No repository, remote, push, Pages setting, analytics provider, or deployment was created during this audit.

## Verified scope

The local gate covers static syntax, required assets, relative links, bilingual hooks, default-layout wiring, compatibility aliasing, content-count consistency, machine-readable measurement limits, absence of runtime analytics/CDN calls, and common credential or personal-path leaks in release-facing text.

## Not covered locally

- A public GitHub repository, remote branch, commit history, pull request, or Pages deployment
- The final Pages base URL, project-site subpath, custom domain, DNS, TLS, or cache behavior
- Production response headers or availability from another network
- Search-engine indexing, rich previews at the final URL, or search ranking
- Real visitors, page views, agent fetches, citations, or reproductions
- Legal clearance for the WENJIN / 问津 name
- A full cross-browser/device matrix or assistive-technology audit

## Post-publication discovery signals

Each item below requires an account, external state, or an explicit user decision:

1. **GitHub repository Traffic:** use aggregate repository traffic as a discovery signal only; it does not identify readers or agents and does not prove a page was understood.
2. **GitHub Pages availability:** read back the exact public URL, assets, `agents.txt`, and descriptor after Pages is enabled. GitHub Pages alone does not provide a trustworthy agent-fetch counter.
3. **Search Console:** after ownership verification, observe indexing and search discovery. This requires the user’s search-provider account and site verification.
4. **Optional privacy-minimal analytics:** only if explicitly authorized. Prefer aggregate, cookieless measurement with no fingerprinting, persistent visitor ID, cross-site tracking, or full-IP retention. Document the provider, fields, retention, and opt-out before adding code.
5. **Optional request logs for machine files:** only through an explicitly approved host/proxy that exposes path-level logs. Report `agents.txt` requests separately, keep the User-Agent limitation attached, and never relabel request counts as verified agents.
6. **Reproduction ledger:** update the versioned content count only after evidence review; this is the strongest signal that a route was actually useful.

## Publication actions requiring explicit authorization

- resolve or accept the name-conflict risk recorded in `NAME-SCREENING.md`;
- initialize or create a Git repository and choose its owner/visibility;
- create a remote repository and set `origin`;
- commit and push the site;
- enable GitHub Pages and choose branch/path settings;
- configure a custom domain, DNS, or TLS settings;
- connect Search Console or any analytics/logging provider;
- publish a privacy notice if future measurement changes the current no-tracking state.

Until those actions are explicitly authorized and read back after execution, the release state remains **local, checked, and not deployed**.
