# Hello World

Hello World with three vertically stacked native radio buttons: red, blue and green. Selecting a color updates the message immediately. Each session starts red; preferences are not saved.

## Platforms

- Browser: deploy the static ZIP at any HTTP/HTTPS subpath. Wide windows center the message independently of the right settings panel; narrow windows stack both panels.
- Windows x64: extract the complete unsigned portable Electron 45 ZIP and run HelloWorld.exe. Runtime libraries/assets are included; no separate Node.js or server is needed. Native Windows execution is unverified on the Linux build host.
- Desktop Chromium/Firefox: load the development unpacked/temporary package and use its toolbar on an ordinary webpage. The native sidebar controls that window's active activated document. No dedicated application tab/backend is needed. Reload/navigation requires reactivation and starts red.

Read [installation and lifecycle instructions](docs/INSTALL.md) and [verification scope](docs/VERIFICATION.md). Development packages are unsigned and not store-distributed. Native Firefox 157 temporary loading is observed; native toolbar/sidebar interaction is unverified. Full Chromium is blocked by the host's Unix-socket restriction. Minimum-version metadata validator advisories are disclosed.

## Build and verify

Use Node.js 22.12+ and Python 3.11+. For packaging-only setup, set ELECTRON_SKIP_BINARY_DOWNLOAD=1 in your shell before npm ci; the packager separately downloads the requested Windows runtime. Install Python dependencies with python -m pip install --target .tools/python -r requirements-dev.txt. Use the pinned runner's dedicated .tools/browsers location; [environment evidence](docs/dev/reports/phases/1/T-001.md) records provisioning and the trusted-local Firefox override.

npm run package:all creates four current-version archives, INSTALL.md, VERIFICATION.md and SHA256SUMS under dist/0.3.0. Individual package:browser, package:electron and package:extensions commands replace that version's output with their selected variants. Full releases always use package:all.

Run python tools/check.py with suites model, ui, browser-package, electron, extension-protocol, extension-sidebar, extensions and release. Use --browser chromium or firefox for browser-specific suites and --version 0.3.0 for release. The dispatcher owns dedicated browser/dependency paths and deadlines. Mozilla validation uses isolated web-ext 10.8.0, installed with npm install --prefix .tools/web-ext --save-exact web-ext@10.8.0; run its bin/web-ext.js lint on the Firefox build/extracted package. Native/modelled evidence remains distinct.

## Project documents

Accepted [brief](docs/dev/PROJECT.md), [architecture](docs/dev/ARCHITECTURE.md), [specification](docs/dev/SPEC.md), [plan](docs/dev/PLAN.md) and [tasks](docs/dev/TASKS.md) define the scope. Document QC passed before implementation. [HANDOFF](docs/dev/HANDOFF.md) owns the current checkpoint. Development uses [SDD Manager](SDD-MANAGER.md); see [AI-assisted disclosure](AI_DISCLOSURE.md).


Latest delivered release at this checkpoint: [v0.3.0](https://github.com/pchemguy/SDD-Manager-Demo-Hello-ChatGPT-Autodoc-AIO-3in1-V2/releases/tag/v0.3.0). All listed release assets were downloaded and checksum-verified through the release-asset API.
