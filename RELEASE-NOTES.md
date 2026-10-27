# Hello World 0.2.0

Adds an unsigned portable Windows x64 Electron app and preserves the browser app.

## Changes

- Run the same session-only Hello World UI locally in a constrained Electron window, with immediate red/blue/green selection and responsive layout.
- Bundle Electron 45.0.0, native libraries, locales, notices and renderer assets; users need no separate Node.js installation or development server.
- Deny renderer Node integration, unexpected navigation, popups and permissions; close the window to quit.
- Rebuild both browser and Windows packages at version 0.2.0 from the same release source, with installation instructions, evidence and SHA-256 checksums.

## Install

For Windows, extract the complete hello-world-0.2.0-win32-x64.zip and run HelloWorld.exe. This is an unsigned development portable package, not a signed installer or store distribution; Windows may show an unknown-publisher warning. Windows 10/11 x64 is the upstream runtime target.

For the browser, deploy all files from hello-world-0.2.0-browser.zip together to a static HTTP/HTTPS host. Both packages run without a backend. Read INSTALL.md and VERIFICATION.md and compare SHA256SUMS against the downloaded bytes.

## Verification and limits

Sixteen test executions passed across the shared model, Chromium/Firefox UI, extracted browser package, Electron modeled-host/actual-package and cumulative release suites. Independent source review found no blocking defect; a minor packaged-host provenance gap was fixed. Actual archive checks cover AMD64 PE, local renderer/host bytes, CRC, matching metadata and preservation of upstream runtime resources/licenses.

Build host: Ubuntu 24.04 x64, Node 24.22.1; @electron/packager 20.3.0. Managed Chromium headless shell 156.0.8078.4 and Firefox 157.0 run via Playwright 1.64.1. Firefox uses a diagnosed process-local sandbox override only for trusted local tests.

Native Windows launch, Windows Explorer extraction, SmartScreen/signature presentation and actual Electron security enforcement were unavailable and remain unverified. Modeled host checks are not native Windows execution. Browser-toolbar zoom and OS-window focus remain untested. Sidebar extensions are delivered in the next phase.
