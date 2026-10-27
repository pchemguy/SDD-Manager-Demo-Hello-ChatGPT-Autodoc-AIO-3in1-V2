# Hello World 0.1.0

The first platform delivery is a deployable browser app.

## Changes

- Display Hello World with native red, blue and green radio buttons; red is initially selected and changes apply immediately.
- Keep the message centered independently of the right settings panel in wide windows; stack panels in narrow windows with keyboard access and visible focus.
- Keep each page session independent and reset to red on reload.
- Ship a relocatable static browser ZIP with local assets, license, source/version metadata, installation instructions and SHA-256 checksums.

## Install

Download hello-world-0.1.0-browser.zip, extract it and deploy all files together to a static HTTP/HTTPS host. Users need no Node.js, backend or development server. INSTALL.md and VERIFICATION.md accompany the archive; verify SHA256SUMS against the downloaded bytes.

## Verification and limits

The browser phase passed 11 test executions across the model, Chromium/Firefox UI, extracted-package and clean-candidate release suites. Screenshots were inspected; repeated same-input candidate builds produced identical bytes. Independent code review found no blocking product defect; two minor verification gaps were resolved.

Tests used managed Chromium headless shell 156.0.8078.4 and Firefox 157.0 through Playwright 1.64.1 on Ubuntu 24.04 x64. Firefox needed a diagnosed process-local content-sandbox override for controlled local tests. Native browser-toolbar zoom and OS-window focus were not tested; CSS zoom, viewport geometry and headless native keyboard interaction were exercised.

This release contains the browser platform only. Windows Electron and Chromium/Firefox sidebar extensions belong to subsequent deliveries. No native Windows or sidebar compatibility is claimed here.
