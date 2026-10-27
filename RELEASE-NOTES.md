# Hello World 0.3.0

Adds Chromium and Firefox sidebar extensions together, with rebuilt browser and Windows packages.

## Changes

- Activate one centered Hello World message on an ordinary HTTP/HTTPS webpage using the extension toolbar. Its native sidebar provides stacked red, blue and green radios; red is initial and changes apply without an Apply action.
- Keep each activated document's session independent. Sidebars follow their own window's active tab, preserve loaded-page color across reopen/background restart, and require reactivation after full navigation/reload. Same-document navigation preserves color.
- Keep page layout/focus unchanged with an isolated, noninteractive overlay. Use temporary activeTab/scripting access, plus Chromium sidePanel; no permanent host access, saved preferences, backend or remote runtime code.
- Bind asynchronous choices to their captured tab/document, coalesce unsent choices, reject stale/invalid messages and recover from two-second timeouts without blindly resending mutations. Unavailable pages show disabled controls and an explanation.
- Rebuild all four version 0.3.0 runtime packages from the same release source, with local assets/licenses, installation instructions, verification evidence and SHA-256 checksums.

## Install and distribution status

- Browser: extract hello-world-0.3.0-browser.zip and deploy all files together to a static HTTP/HTTPS host.
- Windows x64: extract the complete hello-world-0.3.0-win32-x64.zip and run HelloWorld.exe. Electron 45 runtime assets are included. This is an unsigned development portable package, not a signed installer or store distribution.
- Chromium: extract hello-world-0.3.0-chromium.zip and use Developer mode / Load unpacked on the extensions page.
- Firefox: use Load Temporary Add-on at about:debugging#/runtime/this-firefox with hello-world-0.3.0-firefox.xpi. The unsigned temporary extension is removed on browser restart. Signed/AMO installation is not provided.

No package requires a separate Node.js installation, backend or development server at runtime. The extension toolbar activates the ordinary webpage; opening a sidebar alone does not activate it. Internal/protected/store/file/non-HTML/private pages and embedded frames are unsupported. Read INSTALL.md and VERIFICATION.md and compare SHA256SUMS against downloaded bytes.

## Verification and remaining limits

The final campaign passed 41 test executions: model 2, browser UI2 per engine, extracted browser-package 3, Electron 5, extension protocol3/sidebar4/extracted-bundle5 per engine and release3. Screenshots and actual archives were inspected. Independent reviews found two integration defects during development; both were reproduced, repaired and rechecked, with no remaining required finding.

Tests used Ubuntu 24.04 x64, Node 24.22.1, Electron 45.0.0/@electron/packager20.3.0, Playwright 1.64.1, managed Chromium headless shell 156.0.8078.4 and Firefox 157.0. Firefox needed a diagnosed process-local sandbox override only for trusted local tests. The extracted extension matrix executes real bundled page/sidebar/background code with modeled native transport/window IDs/grants/cache signals; it is not native sidebar compatibility evidence.

Actual extracted Firefox temporary installation succeeded in a disposable managed Firefox 157 profile through web-ext 10.8.0. Mozilla lint reports 0errors and2minimum-version advisories for newer no-data metadata; API floors Chromium 116/Firefox 128 and older Firefox metadata handling were not fully exercised. Android is not delivered.

Full Chromium cannot launch here because its process-singleton Unix socket is denied (EPERM). Native Chromium/Firefox toolbar/sidebar interaction, permission/isolation enforcement, actual cached restoration and service-worker suspension remain unverified. Native Windows launch/security/Explorer/SmartScreen, native browser-toolbar zoom and OS-window focus also remain untested. Windows artifacts were cross-built and inspected; host logic was checked against modeled Electron APIs. These unavailable native checks were excluded under the project environment policy, not marked passed.
