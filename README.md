# Hello World

A planned Hello World color-selector app for the browser, Windows Electron, and Chromium/Firefox sidebars.

The accepted [project brief](docs/dev/PROJECT.md), [architecture](docs/dev/ARCHITECTURE.md), [specification](docs/dev/SPEC.md), [delivery plan](docs/dev/PLAN.md) and [implementation tasks](docs/dev/TASKS.md) define the intended product. Document preparation has reached TASKS; whole-package QC and implementation remain pending. The browser core is implemented; responsive completion, deployable packages and releases are pending.

Development uses [SDD Manager](SDD-MANAGER.md). See the [AI-assisted development disclosure](AI_DISCLOSURE.md).

## Development setup

Use Node.js 22+ and Python 3.11+ with npm ci and python -m pip install --target .tools/python -r requirements-dev.txt. Set PLAYWRIGHT_BROWSERS_PATH to the absolute .tools/browsers directory and use the pinned local Playwright CLI to install the selected managed browsers. [Environment evidence](docs/dev/reports/phases/1/T-001.md) records this host's download recovery and scoped Firefox override.

Run python tools/check.py environment --browser chromium and the corresponding firefox command. Other suites and build/package commands become available through the implementation tasks; missing suites fail rather than claim a pass.
