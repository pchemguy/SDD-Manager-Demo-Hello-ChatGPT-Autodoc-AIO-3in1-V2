# System specification

## Context and ownership

The complete product follows [PROJECT](PROJECT.md), [ARCHITECTURE](ARCHITECTURE.md) and [DECOMPOSITION](DECOMPOSITION.md). Requirements below are canonical observable contracts; the component names refer to DECOMPOSITION. Each platform release satisfies its included requirements and preserves earlier delivered platforms.

## R-01 — Color interaction

Display exactly `Hello World`. Controls are three native radio inputs in one labeled group, ordered and labeled `red`, `blue`, `green`, stacked vertically. Exactly one is checked. Initial color is red. The model accepts only these three lowercase strings; invalid values leave state unchanged. CSS colors resolve to red rgb(255, 0, 0), blue rgb(0, 0, 255) and green rgb(0, 128, 0).

A radio change updates the model and message without another action. Local application updates complete synchronously before the next render; extension updates occur as soon as the page processes the valid command. There is no Apply button. Connected controls reflect page-acknowledged state, with pending selections handled under R-06. Labels activate inputs; keyboard arrows and Space follow native radio behavior. Focus remains visible. Do not communicate the selected value by text color alone: checked controls and text labels provide that information.

Owner: color model, message view and color controls.

## R-02 — Application layout

For viewport widths at least 768 CSS pixels, the main panel's horizontal center is within 2 CSS pixels of the application viewport center, independent of the settings panel's width. Center the main panel vertically where height permits. Put settings to its right, with a minimum 16-pixel gap and no overlap. Size the message panel and settings so that this is feasible at the breakpoint.

Below 768 pixels, put the main panel above settings in normal document flow. Both remain accessible at 320-pixel width and 200% browser zoom; allow vertical scrolling in short windows rather than clipping controls. Use a message font at least 32 CSS pixels at normal zoom, readable control labels, and visible focus. The extension sidebar keeps its radio stack accessible at panel widths from 200 pixels; narrower browser-imposed widths may wrap labels and scroll, without overlapping inputs.

Owner: application composition and sidebar view.

## R-03 — Application sessions and runtime assets

Every browser-app document and Electron launch starts red and owns independent memory state. Reload/restart resets it. Write no preferences to cookies, local storage, IndexedDB or extension storage. No backend, remote fonts/scripts, account, analytics or file operations are required. The browser build serves from an arbitrary static-host subpath using relative local assets. Its deployed runtime has no Node.js requirement.

Owner: application composition and build tooling.

## R-04 — Supported pages and explicit activation

Extensions support ordinary top-level HTTP/HTTPS HTML or XHTML documents where the browser permits injection. Toolbar activation targets the clicked tab and its window, opens the native sidebar through the user-gesture handler and injects locally packaged code into frame zero. Neither sidebar-menu opening nor tab switching injects into an unactivated page. Repeated activation in the same document preserves its color and exactly one message panel/listener.

Browser/extension/internal pages, extension stores and other protected origins, local files, built-in document viewers, non-HTML resources, embedded frames and private/incognito sessions are unsupported. Browser restrictions take precedence over an HTTP/HTTPS URL. Injection denial produces R-07 availability behavior.

The page panel is a compact fixed overlay centered in the webpage's layout viewport. It contains the message, uses isolated styles, and does not change existing element styles, geometry, scroll position or focus. The message overlay does not consume pointer events intended for underlying content. Supporting arbitrary page DOM tampering or hostile extensions is outside scope.

Owner: activation coordinator, native adapter, page controller and shared message view.

## R-05 — Sidebar association and lifecycle

A sidebar resolves its own browser window, queries that window's active tab, then probes that tab's top-frame page controller. It must never use the last-focused window as a substitute. Activated tabs retain independent colors while their documents remain loaded. Switching tabs refreshes the sidebar from the selected document; it does not copy the previous tab's color. Closing/reopening the sidebar and background suspension preserve a still-loaded page's color.

Full navigation, reload, tab closure and browser restart end the affected document session. A new document needs explicit activation and starts red. Same-document URL/hash/history navigation preserves state. A page restored from a document cache is treated as a new activation session when returned by full navigation; clear its prior panel/session on nonpersisted or persisted page exit so cached restoration cannot restore an old color implicitly. Reopening a closed tab does not restore its color.

Owner: page controller and sidebar controller.

## R-06 — Messaging and asynchronous selection

Use extension-runtime messaging, not a page-origin event bridge. Requests have version `v: 1`, a nonempty string `requestId` of at most 128 characters and recognized type. `GET_STATE` returns that document's opaque nonempty `documentId` and canonical color. `SET_COLOR` additionally requires the bound `documentId` and valid color. Successful responses echo version/request identity and current document/color; errors identify `INVALID_MESSAGE`, `STALE_DOCUMENT` or `UNAVAILABLE`. Native API rejections map to availability failure. No invalid request mutates state. Reject senders outside the extension's own runtime identity.

A selection captures its current window/tab/document binding. Dispatch only to that tab's frame zero; never retarget queued work to a subsequent active tab. Serialize commands per live binding and coalesce unsent choices to the latest selected color. Responses apply only to the matching request and current sidebar generation. A tab/full-document transition invalidates the sidebar binding and cancels unsent choices. A command already dispatched may finish on its captured document, but must never change another document. A stale nonce is rejected even if the tab ID is unchanged.

Probe and command requests time out after 2 seconds. On uncertain command outcome, re-probe the same still-current binding rather than resending a mutation blindly; use the returned actual color or R-07. No operation is allowed to leave controls permanently pending.

Owner: protocol validation, page controller, sidebar controller and native adapter.

## R-07 — Availability and failure presentation

During binding and on absent/unsupported/denied/disconnected targets, disable all three controls and show a concise status explaining the condition and, where useful, the need for toolbar activation. Preserve exactly one checked input, using red as the placeholder when no page state is known; status must not present that placeholder as actual page state. Do not color a different page or create an app tab as recovery. A fresh activation, selected-tab event or sidebar reopening can recover by probing. Lost/late replies must not overwrite a newer binding or its status.

Owner: sidebar controller and color controls.

## R-08 — Extension packaging and privileges

Produce distinct Chromium and Firefox Manifest V3 packages with bundled runtime code. Chromium uses `side_panel`, `sidePanel` permission and a service worker; Firefox uses `sidebar_action` and nonpersistent background scripts. Both use only `activeTab` and `scripting` in addition to Chromium's sidePanel permission. No permanent host, storage or sensitive tab-metadata permission is required. No Node.js, development server, remote code or backend is an extension runtime dependency.

Compatibility targets are Chromium 116+ with Side Panel open support and Firefox 128+ with the chosen MV3 sidebar APIs. Record exact tested browser versions; do not imply every version above the API floor was exercised. Store submission and signing are excluded; Chromium development unpacked installation and Firefox temporary development installation are the supported distribution routes for these unsigned packages.

Owner: native adapter and build/package tooling.

## R-09 — Electron boundary

The Windows x64 portable archive contains the executable, Electron runtime, app resources and required notices. Extraction followed by executable launch requires no separate Node.js, server or elevation. Load bundled application assets with renderer `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`; expose no preload/IPC bridge. Deny unexpected navigation, new windows and permission requests. Closing the window ends the app. The UI follows R-01 through R-03. Windows 10/11 x64 support is bounded by the selected current Electron runtime's documented OS support.

Owner: Electron host and packaging.

## R-10 — Versions and cumulative releases

Use semantic versions 0.1.0 for browser, 0.2.0 for Electron, 0.3.0 for both extensions. Every release uses its verified integrated source on the actual default branch. Rebuild/repackage previously delivered platforms at that release's version and source; do not attach stale prior-version artifacts as current builds.

| Release | Required assets |
| --- | --- |
| 0.1.0 | `hello-world-0.1.0-browser.zip` |
| 0.2.0 | Browser ZIP and `hello-world-0.2.0-win32-x64.zip` |
| 0.3.0 | Browser ZIP, Windows ZIP, `hello-world-0.3.0-chromium.zip`, `hello-world-0.3.0-firefox.xpi` |

Every release also includes `INSTALL.md`, `VERIFICATION.md` and `SHA256SUMS`. Substitute the release version consistently in browser ZIP names. Archives contain deployment/runtime resources and applicable licenses; browser archive has index.html at its root, Chromium archive has manifest.json at its root, and Firefox XPI is a ZIP with manifest.json at its root. Package no tokens, repository metadata, plugin source, tests or development caches. Windows includes its required native libraries/resources rather than the executable alone.

Instructions cover static deployment, portable extraction/launch and development extension loading as applicable, with signing/store/temporary-installation limitations. Verification records identify source commit, tool/runtime/browser versions, host, artifact hashes, performed checks, excluded checks and remaining unverified behavior. Verify published downloads against expected hashes and archive contents before reporting release publication complete.

## R-11 — Verification scope and environment

Follow the repository [browser policy](../../.agents/plugins/sdd-manager/assets/BROWSER_DEV_POLICY.md) and [Playwright guidance](../../.agents/plugins/sdd-manager/assets/playwright.md). Use pinned compatible tooling and dedicated browser binaries/profiles/cache locations; use Chromium headless shell for ordinary app checks and managed Firefox. When native extension integration requires full Chromium, test that mode separately, including headless full Chromium where suitable. Do not treat headless-shell simulation as native sidebar evidence.

Provisioning requires two isolated context/page interaction/render/teardown cycles per usable browser mode before application acceptance. Exercise production built/extracted assets, screenshots/computed color, responsive layout, keyboard controls and lifecycle errors. Downloads or synthetic fixtures alone prove no product acceptance.

Unavailable Windows-native execution and unavailable full-browser checks after policy-compliant diagnosis are excluded for that execution; retain target artifacts and perform all feasible package, protocol, adapter and working-headless checks. A feasible required build/check failure remains blocking. Report exclusions plainly, without marking them passed or demanding a new waiver.

## Acceptance scenarios and traceability

| Scenario group | Objective outcome | Requirements / components |
| --- | --- | --- |
| Core UI | Initial red, exact text/labels/order, all color changes, exclusive selection, keyboard/focus; invalid model value unchanged | R-01; model/views |
| Layout/session | Wide center/gap, narrow/short/zoom accessibility, independent tabs, reload reset, static subpath assets | R-02–03; composition |
| Activation/page | Supported ordinary page gains exactly one isolated panel; repeated action preserves color; no host-page reflow/focus change | R-04; activation/page |
| Binding/lifecycle | Two tabs and two windows remain independent; switch/reopen/background restart synchronize; full and cached navigation reset; SPA preserves | R-05; page/sidebar |
| Races/errors | Delayed replies, queued choices, same-tab navigation, stale nonce, invalid sender/payload, timeout and denied injection cause no wrong-document mutation and recoverable status | R-06–07; protocol/adapters/controllers |
| Extension artifact | Correct manifests, minimal privileges, bundled assets and actual supported installation route; native sidebar integration assessed separately from modeled checks | R-08; adapter/package |
| Desktop artifact | Extracted complete Windows package, local entry/runtime resources, constrained renderer and feasible launch checks; exclusions recorded | R-09; host/package |
| Cumulative release | Correct versions/source, all applicable packages/instructions/licenses, no secrets, valid checksums and matching published downloads | R-10–11; build/verification |
