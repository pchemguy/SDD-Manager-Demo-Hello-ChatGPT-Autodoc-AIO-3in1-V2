# Hello World

Hello World with three vertically stacked radio buttons: red, blue and green. Selecting a color updates the message immediately. Each session starts red; selections are not saved.

## Browser app

The browser application is implemented and tested in isolated Chromium and Firefox. The main message stays centered independently of the settings panel in wide windows; narrow windows stack both panels. Keyboard arrows/Space and visible focus are supported.

Run npm ci and npm run package:all to create the current browser deployment candidate under dist/0.1.0. Extract its browser ZIP and deploy all files together to a static HTTP/HTTPS host. See [installation instructions](docs/INSTALL.md) and [verification scope](docs/VERIFICATION.md). Published release availability is reported separately; no release is claimed from local candidate generation.

Windows Electron and paired Chromium/Firefox sidebar extensions are the planned next platform groups. Their runtime packages are not delivered by the browser phase.

## Development setup

Use Node.js 22.12+ and Python 3.11+. Run npm ci and python -m pip install --target .tools/python -r requirements-dev.txt. Set PLAYWRIGHT_BROWSERS_PATH to the absolute .tools/browsers directory when installing the pinned runner's managed browsers. [Provisioning evidence](docs/dev/reports/phases/1/T-001.md) records this host's official-download recovery and scoped Firefox override.

The Python dispatcher uses the dedicated dependency/browser locations. Validated commands include python tools/check.py model, python tools/check.py ui --browser chromium, the corresponding firefox UI command, python tools/check.py browser-package and python tools/check.py release --version 0.1.0. Native/other-platform suites become available with their implementation tasks; absent suites fail explicitly.

## Project documents

The accepted [brief](docs/dev/PROJECT.md), [architecture](docs/dev/ARCHITECTURE.md), [specification](docs/dev/SPEC.md), [plan](docs/dev/PLAN.md) and [tasks](docs/dev/TASKS.md) define the complete intended product. Whole-package documentation QC passed before implementation. Current progress and pending effects are recoverable through [HANDOFF](docs/dev/HANDOFF.md).

Development uses [SDD Manager](SDD-MANAGER.md). See the [AI-assisted development disclosure](AI_DISCLOSURE.md).

Latest delivered release at this checkpoint: [v0.1.0](https://github.com/pchemguy/SDD-Manager-Demo-Hello-ChatGPT-Autodoc-AIO-3in1-V2/releases/tag/v0.1.0). All listed release assets were downloaded and checksum-verified through the release-asset API.
