# Repository layout and ownership

This map allocates [DECOMPOSITION](DECOMPOSITION.md) components to intended physical paths under the [PLAN](PLAN.md). Source/test/tool paths below are planned until implemented; existing root guidance and bundled plugin files are retained.

## Production source

| Path | Owner and scope | Dependency rule |
| --- | --- | --- |
| `src/core/colors.js` | Canonical colors and pure state transitions | JavaScript only |
| `src/ui/message.js` | Shared message mount/update/dispose | Core and DOM only |
| `src/ui/color-controls.js` | Shared labeled radio group and availability rendering | Core and DOM only |
| `src/ui/app.css` | Browser/desktop layout and shared visual primitives | No remote assets |
| `src/browser/index.html`, `src/browser/main.js` | Application composition and local entry | Shared core/UI; no platform APIs |
| `src/electron/main.cjs` | Constrained main-process host, local entry resolution and window lifecycle | Electron/Node main APIs; consumes built browser assets, no color policy |
| `src/extensions/protocol.js` | Runtime message schemas and validation | Core only; no page-origin bridge |
| `src/extensions/page.js` | Isolated top-frame controller, document state/lifecycle and message root | Core, message view and protocol |
| `src/extensions/sidebar.html`, `src/extensions/sidebar.js`, `src/extensions/sidebar.css` | Sidebar composition, per-window binding, queues and availability | Color controls, protocol and native adapter |
| `src/extensions/activation.js` | Shared toolbar activation flow and completion notification | Adapter operations and protocol; no color cache |
| `src/extensions/chromium/` | Manifest, worker entry and Chromium API adapter | Shared extension controllers and Chromium APIs |
| `src/extensions/firefox/` | Manifest, event-background entry and Firefox API adapter | Shared extension controllers and Firefox APIs |

Native adapter directories own API differences; do not fork core color or UI rules. The Electron host is not included in browser/extension output. Injected content is bundled into a self-contained classic-script artifact; manifest/sidebar/background entry forms are selected by each browser build.

## Build and verification tooling

| Path | Responsibility |
| --- | --- |
| `package.json`, `package-lock.json` | Development dependencies, project version and named build/package commands; dependencies pinned by lockfile |
| `requirements-dev.txt` | Pinned pytest support dependencies for contained installation; no global/venv mutation required |
| `tools/build.mjs` | Platform entry builds, asset copying and extension bundling |
| `tools/package.mjs` | Runtime archive assembly, licenses, version metadata, cumulative package selection and checksums |
| `tools/check.py` | Pytest suite dispatcher, absolute dedicated environment paths and bounded probe lifecycle |
| `tests/test_environment.py` | Two-cycle representative provisioning/launch/render/teardown evidence |
| `tests/test_model.py`, `tests/test_ui.py` | Shared contracts and browser/desktop composition |
| `tests/test_browser_package.py`, `tests/test_electron.py` | Extracted static distribution and Electron host/package checks |
| `tests/test_extension_protocol.py`, `tests/test_extension_sidebar.py` | Pure validation/page lifecycle and binding/queue/race/availability contracts |
| `tests/test_extensions.py`, `tests/test_release.py` | Native integration where available; all actual archive/version/asset/evidence checks |
| `tests/probes/` | ASCII JavaScript probes invoked by pytest for Node/Playwright/Electron operations; no second test runner |
| `tests/fixtures/pages/` | Controlled ordinary HTTP pages, style-collision/iframe/navigation fixtures; no dedicated app-tab substitute |
| `.github/workflows/` | Reproducible checks and authorized release packaging if useful; native jobs are used only when actually available |

No fixture, probe or build script contains credentials. Scripts are ASCII-only; human documentation may use Unicode. Each behavior's test remains with its owning suite; integration tests assess collaboration and actual outputs rather than duplicating helper implementation.

## Generated and ignored paths

| Path | Content and lifetime |
| --- | --- |
| `node_modules/`, `.tools/python/` | Dedicated development dependencies, excluded from source/distributions |
| `.tools/browsers/` | Dedicated Playwright-managed binaries; use its absolute path consistently for setup and execution |
| `.tools/profiles/`, `.tools/cache/`, `.tools/downloads/` | Isolated owned state; no personal/system browser reuse |
| `build/browser/`, `build/electron/`, `build/extensions/{chromium,firefox}/` | Clean platform runtime staging only |
| `dist/<version>/` | Cumulative release archives, INSTALL.md, VERIFICATION.md and SHA256SUMS |
| `.test-results/` | Temporary extracted packages, screenshots, bounded probe output and test evidence |
| `*.tkn` | Protected credential input; never tracked, copied into artifacts or reported |

Add required ignore rules with the task that introduces a generated path. Package allowlists select runtime resources; broad repository archiving is prohibited. The current small `.gitignore` is preserved until that implementation work.

## Documentation and evidence

Current governing roots and adjacent scoped review reports live under `docs/dev/`. DOCS_TASKS owns preparation checkboxes; DOCS_PREPARATION owns approvals/control evidence; HANDOFF is a periodic checkpoint. These records are not product modules.

User guidance goes in root `README.md` and `docs/INSTALL.md`. Root `RELEASE-NOTES.md` is the finalized complete release message; versioned `dist` documentation describes actual shipped artifacts. Browser provisioning/diagnosis evidence belongs in the relevant task/milestone report and referenced `.test-results` outputs, without introducing a second workflow registry.

Milestone reports use `docs/dev/reports/phases/<phase>/<milestone>.md`; phase reports use that phase directory's `PHASE-REPORT.md`. The full-list completion report is `docs/dev/reports/IMPLEMENTATION-REPORT.md`. Link them from the assigned boundary tasks. Existing `docs/ai-logs/` manual scaffolding and `.agents/` skill/plugin source stay outside routine product builds and test scope.

## Command interface ownership

Implementation establishes the following root command interface before tasks consume it; these are planned commands, not a claim that executable scripts already exist. Node scripts resolve repository-relative paths internally, and the Python dispatcher supplies dedicated absolute browser/Python paths without requiring shell-specific environment syntax.

- `npm ci` installs the locked Node development dependencies.
- `npm run build:browser` and `npm run package:browser` produce static runtime and its archive.
- `npm run package:electron` includes a complete Windows x64 runtime.
- `npm run package:extensions` produces both extension distributions.
- `npm run package:all` selects all platforms delivered in the current version; it does not require future-phase source.
- `python tools/check.py <suite>` runs pytest with a named suite: `environment`, `model`, `ui`, `browser-package`, `electron`, `extension-protocol`, `extension-sidebar`, `extensions` or `release`. `--browser chromium|firefox` selects the corresponding browser where applicable; `release` accepts `--version`. Unsupported suites/options fail clearly.

The browser-policy recovery modules govern unavailable modes and native scope. Missing required build/check implementations are task defects; do not relabel them as unavailable native facilities.
