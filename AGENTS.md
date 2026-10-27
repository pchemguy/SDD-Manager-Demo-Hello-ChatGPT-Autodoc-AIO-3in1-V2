# Agent instructions

## Specification-driven development

This project uses the SDD Manager plugin for specification-driven development. If not already in the context, load `PLUGIN.md` from installed location or from `.agents/plugins/sdd-manager/PLUGIN.md` and the coordinator skill entry it references. If neither source is available, report the missing plugin before dependent workflow work.

**Follow the applicable SDD Manager workflows, including human checkpoints, Git publication and integration, and the tracking policy below.**

## Initialization

Execute the [skill and plugin discovery protocol](SKILL_DISCOVERY_PROTOCOL.md).

## Windows shell

On **Windows execution hosts only**, follow [WINDOWS_SHELL_POLICY.md](.agents/plugins/sdd-manager/assets/WINDOWS_SHELL_POLICY.md): CMD syntax, unavailable PowerShell/pwsh, temporary files for script text and shell operations, and the documented tool probe/recovery. This repository policy is independent of the plugin.

## Browser development

When developing or testing browser-based applications or browser extensions, follow [BROWSER_DEV_POLICY.md](.agents/plugins/sdd-manager/assets/BROWSER_DEV_POLICY.md). Prioritize Chromium and include Firefox by default; project documents may specify other choices. Use dedicated, isolated environments.

## Environment diagnostics

When Playwright is selected, follow [Playwright environment guidance](.agents/plugins/sdd-manager/assets/playwright.md) before dependent setup and execution, and when provisioning or browser runtime blocks required checks.

When a Vite-served module worker fails to start, especially from a linked Windows checkout or with an HTML entry response, follow [Vite worker-loading diagnostics](.agents/plugins/sdd-manager/assets/vite-worker-loading.md). Diagnose the loading stage before applying a workaround; this guidance does not apply to every SQLite or worker failure.

## Workflow continuity

For continuation, read `docs/dev/HANDOFF.md` and use `sdd-manage`'s continuity subworkflow to reconstruct later work from current development records and Git. The handoff describes a checkpoint, not necessarily the branch tip. At startup, inspect unfinished workflow branches against their recorded parents and request the continuation branch unless already selected. Preserve the recovered scope, approvals and stopping boundary.

## Human checkpoints

Present each necessary new development document with concise substantive analysis and pause for acceptance before dependent work. Honor the user's requested implementation range and stop when it is complete.

The user may explicitly preapprove future checkpoints at any time. Retain the scope and conditions of that decision, including after interruption; do not repeat a covered approval request. Preapproval does not waive QC, resolve blockers or expand the authorized implementation range.

## Commits and publication

Keep each task's verified result, required evidence and completion checkbox in the same commit. Push every owned commit and verify remote containment before further work or another commit, unless the user explicitly directs local-only or deferred publication.

Use SDD Manager's integration procedure at the authorized complete boundary.

## GitHub tracking

Enable and maintain GitHub tracking for documentation preparation and implementation **by default**. The user may disable tracking, select local-only work or choose another supported backend. Preserve an established choice through interruptions and access failures; copying this template does not reset it.

Follow `sdd-manage`'s preparation and phase-activation workflows for required tracking readiness and lifecycle updates. Reconcile uncertain effects before retrying and report unmet prerequisites before dependent work.

## Project guidance

Maintain project-specific navigation and validated setup/check commands here as they become established. Do not invent commands, paths, requirements or completion claims.

## Current project navigation

The [PROJECT brief](docs/dev/PROJECT.md) describes the accepted Hello World application. [DOCS_TASKS](docs/dev/DOCS_TASKS.md) owns preparation checkboxes and [DOCS_PREPARATION](docs/dev/DOCS_PREPARATION.md) owns decisions, approvals and QC evidence. Recover later state through [HANDOFF](docs/dev/HANDOFF.md) and Git before continuing. Validated browser build/check commands are listed below; future-platform commands remain planned.

## Design and implementation locations

The intended system is defined by [ARCHITECTURE](docs/dev/ARCHITECTURE.md), [DECOMPOSITION](docs/dev/DECOMPOSITION.md), [SPEC](docs/dev/SPEC.md), [PLAN](docs/dev/PLAN.md) and [layout](docs/dev/layout.md). Layout owns proposed source/test/tool paths and future command interfaces; none of those commands is validated merely by appearing in documentation. Tests use pytest orchestration and ASCII-only script sources. Follow browser policy and its unavailable-native/full-browser scope without substituting personal browser installations.

## Task ownership

[TASKS](docs/dev/TASKS.md) owns the 18 planned implementation tasks and their phase/milestone hierarchy. [TASKS review](docs/dev/TASKS-REVIEW-REPORT.md) records scoped derivation readiness; whole-package QC and published preparation integration are separate prerequisites. Planned setup/build/check commands in layout are not validated until their implementation tasks run.

## Validated browser commands

The browser phase implements npm ci, npm run build:browser, npm run package:browser and npm run package:all. Pytest suites model, ui (--browser chromium or firefox), browser-package and release (--version 0.1.0) are validated through python tools/check.py. Install Python dependencies into .tools/python from requirements-dev.txt; browser binaries remain under the absolute project .tools/browsers path. The diagnosed Firefox process-local override and official OCI Chromium provenance are in reports/phases/1/T-001.md; do not apply those environment settings to untrusted external browsing. Packaging future platforms remains gated by their tasks.

## Desktop development

Electron development dependencies require Node.js 22.12+. The internal node tools/build.mjs --platform electron command stages host plus local renderer. python tools/check.py electron currently verifies real host logic against a modeled Electron API boundary and staged assets; native Windows execution is not implied. npm run package:electron and npm run package:all produce the complete unsigned Windows x64 runtime. The electron suite additionally checks the actual PE/resources/renderer and upstream runtime preservation; Windows-native execution remains excluded on Linux.
