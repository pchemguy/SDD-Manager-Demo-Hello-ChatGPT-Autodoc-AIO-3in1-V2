# Application architecture

## Structure and dependency direction

[PROJECT](PROJECT.md) defines the intended experience. The system uses shared native DOM components and a small pure color model, with platform adapters around them. A full UI framework adds runtime/build weight without helping this three-control interaction. Separate platform implementations would duplicate behavior and make regressions more likely.

| Block | Responsibility | Permitted dependencies |
| --- | --- | --- |
| Shared color model | Valid colors, initial state and color transitions | JavaScript language only |
| Shared DOM UI | Message view and accessible color controls | Color model and DOM; no platform globals |
| Browser composition | Mount both shared views in responsive application layout | Shared model/UI |
| Electron host | Create a constrained desktop window loading packaged browser assets | Electron main-process APIs and packaged browser composition |
| Extension integration | Activate pages, open native sidebar, route document-bound commands and adapt native APIs | Shared model/UI, browser extension APIs and protocol definitions |
| Build and verification tooling | Produce static/desktop/extension artifacts and assess their actual contents/behavior | Source entry points, locked development dependencies and isolated test environments |

Platform code depends inward on shared behavior. The shared layer imports no Electron or extension APIs. The browser build has no Electron dependency. Extension packages contain only their needed shared views and adapters, not the full application layout or Electron runtime. DECOMPOSITION defines the downstream logical boundaries.

## State ownership

Browser application composition owns one in-memory color model per loaded document. Electron reuses that composition per window; the main process owns window lifecycle, not color. No storage or server participates.

In extensions, the injected top-frame content controller owns the active document's color and message view. The sidebar is a synchronized editor, never the source of durable color state. Each sidebar resolves its owning window once, follows active-tab events within that window, probes the selected document and renders acknowledged state. Background suspension/recreation requires no state restoration because the document can answer a fresh probe.

Commands capture a specific tab and opaque document-session nonce. They are never redirected to whichever tab becomes active later. The sidebar invalidates obsolete bindings on tab/navigation changes and discards outdated replies. The content controller rejects an incorrect nonce, malformed operation or invalid color. This separates document identity from transient tab activation and protects against asynchronous stale responses without cross-tab shared color.

## Extension integration and lifecycle

Use Manifest V3 packages with distinct manifests and thin API adapters: Chromium service worker plus native Side Panel API; Firefox nonpersistent background scripts plus sidebar_action/sidebarAction. The two background entry forms are deliberately distinct rather than assuming Firefox uses Chromium's worker manifest.

A toolbar click opens the native sidebar within its user-gesture handler, before awaited work can consume activation eligibility. Page activation injects a locally bundled content entry into frame zero using temporary activeTab access and scripting. Injection is idempotent within an isolated content-script world: repeated activation reuses the controller and color. After activation, a notification lets open sidebars refresh their binding; reopening also probes directly, so missed notifications do not lose state.

The content entry mounts an isolated Shadow DOM message panel over the page without changing existing element styles or geometry. Shared message rendering operates inside that root. Sidebar settings use the shared color-control component in the extension document. No page-origin event bridge or window.postMessage channel exposes extension commands to webpage scripts. Only extension runtime messages participate.

Permissions are activeTab and scripting, plus sidePanel on Chromium. No permanent host grants, tabs-sensitive-metadata permission or storage permission is needed. Tab identifiers, activation/update events and window association are used without collecting browsing history. Restricted URLs and rejected injection/probes produce an unavailable sidebar state, not fallback injection into another tab. Full-document navigation requires explicit reactivation even if temporary same-origin access remains.

## Desktop boundary

The Electron main process creates one application window per launch and loads local bundled HTML/assets. Set nodeIntegration false, contextIsolation true and sandbox true. No preload, IPC bridge, native add-on or remote content is required. Deny unexpected navigation, new windows and permission requests. Package the renderer, runtime, licenses and native resources in a Windows x64 portable distribution.

## Build, platform targets and evidence

Use JavaScript ES modules and CSS with Node.js development/build scripts. Browser assets remain static and relocatable. Bundle injected extension content as a classic script with esbuild; sidebar/background output must match each browser's supported execution context. Use Electron with @electron/packager for the desktop directory and ZIP distribution. Pin selected dependency versions in lockfiles when provisioning; dependency installation is implementation work.

Use pytest as the test orchestrator. Browser automation follows the repository browser policy with isolated Chromium and Firefox profiles; Playwright probes may execute through Node where a platform-specific API requires it. Tests exercise production built artifacts, alongside pure-model and adapter/protocol checks. Development tools are not end-user dependencies.

The extension API floor is Chromium 116 (Side Panel open) and Firefox 128 for the selected desktop MV3 sidebar adapter. These are design compatibility targets, not a promise that historical versions were tested. Record exact exercised versions in reports. Desktop targets Windows 10/11 x64 subject to the selected Electron runtime's supported OS range; choose a current supported runtime rather than pinning an obsolete binary for compatibility. Concrete package verification distinguishes feasible static/runtime checks from unavailable Windows-native or browser-chrome interaction.

Release tooling assembles cumulative artifacts from the same pinned source/version, adds installation and verification records, creates checksums and verifies downloaded published bytes. Build isolation and inspection exclude credentials, development caches and repository/plugin internals. Feasible checks cannot be replaced by an unavailable-native disclaimer.

## External references and invariants

Native API forms and restrictions follow the official [Chromium Side Panel](https://developer.chrome.com/docs/extensions/reference/api/sidePanel), [Firefox background](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background) and [Electron security](https://www.electronjs.org/docs/latest/tutorial/security) documentation. Actual compatibility remains a verification result.

Invariants: one canonical color rule; one authoritative model per document; no persistent preferences; no platform privilege in shared UI; no runtime remote assets; no retargeting a captured command; and no claim of verification beyond actual evidence. Detailed behavior belongs in SPEC, physical placement in layout, and delivery order in PLAN.
