# Hello World across three platform groups

## Purpose and outcome

Provide a small, self-contained application that displays “Hello World” and lets the user change its text color immediately using three radio buttons. Deliver the same behavior as a browser app, a Windows Electron app, and desktop Chromium and Firefox sidebar extensions. Reuse application logic and UI components while isolating each platform's integration code.

## Core experience

The message is exactly “Hello World”. A single radio group contains vertically stacked controls labeled “red”, “blue” and “green”, in that order. Exactly one color is selected; a new session starts with red selected and the message in red. Selecting another color changes the message immediately, without an Apply button. Native radio semantics support pointer and keyboard operation with visible focus and readable labels.

No color preference is saved between application sessions. Browser reload and desktop restart initialize red. Separate browser app tabs and desktop launches have independent state. No account, backend, telemetry, file operations or additional application settings are required.

## Browser and desktop layout

On sufficiently wide viewports, the settings panel is to the right of the main panel. The main panel is centered in the application viewport independently of the settings panel's width. On narrow viewports, stack the main panel above the settings panel and permit scrolling when needed, keeping both accessible without overlap. Exact dimensions and the responsive breakpoint belong to the detailed specification.

The browser app is a deployable static build. The Windows desktop app loads bundled assets and includes Electron's runtime; end users need neither Node.js nor a development server. The initial desktop target is Windows x64, distributed as an unsigned portable archive with an executable and its required runtime files. Windows ARM64, an installer and code signing are outside the initial delivery scope.

## Sidebar extensions

The extension toolbar action activates the current ordinary HTTP or HTTPS top-level webpage and opens the extension sidebar. Activation adds a compact, centered message panel over the webpage without reflowing or restyling existing page content. The panel uses isolated styling and contains the message; the three color controls reside in the narrow, resizable sidebar. There is no dedicated application tab, runtime backend or separately installed Node.js dependency.

Each sidebar follows the active tab in its own browser window. Each activated page document owns its independent color, initially red. Switching between activated tabs shows that page's selected color rather than copying a color from the previous tab. Closing and reopening the sidebar preserves the color while that document remains loaded. Repeated activation of the same document does not duplicate the panel or reset its selection.

A full navigation or reload ends the document session and removes its state. The new document requires another toolbar activation and starts red; same-document navigation preserves state. Closing a tab or restarting the browser ends its state. Opening the sidebar through the browser's own sidebar menu does not itself activate an unactivated page.

Controls are disabled with a clear explanation when there is no activated supported page, access is denied, or page communication is unavailable. Browser-internal pages, extension stores, other privileged pages, extension pages, local files and built-in document viewers are unsupported. Only the top-level document is controlled, not embedded frames. Private/incognito browsing is outside the initial supported scope.

Use temporary active-tab access and script-injection capability, plus Chromium's side-panel permission, rather than permanent access to all websites. Sidebar commands must remain bound to the intended window, tab and document so that delayed messages cannot affect a newly selected or navigated page. Background lifecycle changes must not reset a still-loaded page's color. The detailed design defines message validation, synchronization and browser-specific adapters. No persistent extension data is required.

## Delivery and evidence

Deliver three useful increments in order: browser app; Windows Electron app; Chromium and Firefox extensions together. Preserve previously delivered platforms and publish a GitHub release after each completed, verified and integrated phase. Each release includes deployable or installable artifacts for every platform delivered so far, installation instructions, checksums and release notes identifying actual checks and remaining limits.

Chromium uses the native Side Panel API; Firefox uses its native sidebar API. Target desktop browsers that support the selected APIs, with concrete versions and test environments recorded in the detailed design and verification evidence. Browser-specific extension packages contain their own runtime assets. Chromium unpacked/development installation and Firefox temporary/development installation must be clearly distinguished from signed, persistent or store-distributed installation; signing and store submission are outside scope.

Verification follows the repository's browser and environment policies, including Chromium and Firefox coverage. Check actual packaged outputs rather than relying only on source tests. Unavailable Windows-native execution or browser integration checks must be reported as unverified behavior, never inferred from package creation or other platforms' results. Feasible package checks and remaining platform delivery work continue under those declared limits.

## Design direction and boundaries

Prefer a small shared color model and reusable native DOM components over a full UI framework for this three-control application. Share the message and settings components; compose them into a browser/desktop layout or separate page/sidebar surfaces. Keep Electron startup and browser-extension permissions, messaging and lifecycle handling in platform adapters. Detailed module boundaries, tooling and dependency versions remain for ARCHITECTURE and DECOMPOSITION.

The project adds no persistence, theme selection, page-content editing, configuration import/export, automatic update system, mobile extension support or extra gameplay/application features.
