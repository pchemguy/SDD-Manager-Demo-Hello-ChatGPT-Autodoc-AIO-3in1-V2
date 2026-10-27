# Delivery plan

## Strategy and completion model

Deliver the complete [SPEC](SPEC.md) through three platform increments, preserving each predecessor. The first phase is the usable browser product with its static deployment package. The second adds a self-contained Windows runtime without extension scope. The third adds both sidebar extensions together; they share one phase and release because the user explicitly groups them.

Shared model/UI boundaries in [ARCHITECTURE](ARCHITECTURE.md) and [DECOMPOSITION](DECOMPOSITION.md) are established with the browser baseline, without prematurely implementing extension protocols or Electron privileges. Every delivery milestone reaches an integrated capability or usable distributable boundary. Environment readiness is enabling evidence, not delivered application functionality.

## Phase 1 — Browser app

Outcome: a usable static Hello World application satisfying R-01–03 and browser-app portions of R-10–11. Version 0.1.0. Electron and extension runtime behavior are excluded from this phase's exits.

| Milestone | Outcome and dependency | Exit evidence |
| --- | --- | --- |
| 1.1 — Usable browser experience | Establish isolated tooling and compatible browser execution, then shared model/views and responsive composition | Initial/all colors, pointer/keyboard operation, wide centering, narrow/short/zoom access, independent sessions and reload reset exercised in available Chromium/Firefox; screenshots inspected |
| 1.2 — Deployable browser package | Depends on 1.1; produce a relocatable static build/archive with deployment and verification records | Extracted build served from a subpath, local assets resolved, no development runtime requirement, notices/instructions and archive exclusions/checksums verified |
| 1.3 — Phase review | Depends on both delivery milestones completing/closing | Full browser scope code review, available regressions, report, release-source/package readiness and no unresolved required defect |

At 1.1, the working browser UI demonstrates the central interaction and responsive arrangement; evidence can inform human direction to amend or continue. At 1.2, an extracted deployment demonstrates distribution independently of source checkout. Two delivery milestones preserve that meaningful distinction without padding this small UI into artificial subsystems.

## Phase 2 — Windows Electron app

Predecessor: verified, integrated and published Phase 1 plus its release. Outcome: the same UI in a complete unsigned Windows x64 portable package, preserving the browser app. Version 0.2.0. Adds R-09 and cumulative R-10–11; no sidebar integration.

| Milestone | Outcome and dependency | Exit evidence |
| --- | --- | --- |
| 2.1 — Portable desktop delivery | Compose the existing browser assets into a constrained Electron host; package Windows runtime, then validate cumulative browser/desktop distribution | Host restrictions and local loading checked; Windows archive entry/runtime/resources/licenses inspected; feasible extracted runtime checks performed; browser package rebuilt and regressed at 0.2.0; install/evidence documents complete |
| 2.2 — Phase review | Depends on 2.1 completing/closing | Cross-platform preservation review, applicable artifact/regression checks, native exclusions recorded, report and cumulative release readiness |

One delivery milestone is appropriate: the window host has little user value without its portable runtime, and an independent installation/configuration subsystem is not requested. Bounded tasks separate host, archive construction and cumulative verification inside this cohesive outcome. Demonstrate extracted launch when an eligible native environment is available; otherwise inspection demonstrates artifact completeness while explicitly withholding launch/OS-compatibility claims.

## Phase 3 — Sidebar extensions

Predecessor: verified, integrated and published Phase 2 plus its release. Outcome: ordinary-page Hello World panels controlled by native Chromium and Firefox sidebars, preserving browser and Electron apps. Version 0.3.0. Adds R-04–08 and full cumulative R-10–11.

| Milestone | Outcome and dependency | Exit evidence |
| --- | --- | --- |
| 3.1 — Paired sidebar integration | Build validated page protocol/controller, window-bound sidebar controller and both native activation/API adapters | Core page/sidebar interaction, isolation and idempotent activation, two-tab/two-window association, reopen, background suspension, full/cached/SPA navigation, invalid/stale messages and unavailable targets assessed with modeled and available native evidence distinguished |
| 3.2 — Cumulative platform distribution | Depends on 3.1; package both extensions and rebuild earlier platforms at 0.3.0 | Extracted Chromium/Firefox manifests and local assets verified; development/temporary installation documented; feasible packaged integration matrix and earlier-platform regressions run; all four distributions, instructions, checksums and evidence complete |
| 3.3 — Phase review | Depends on both delivery milestones completing/closing | Full cross-platform code review/regressions, final implementation/TODO aggregation, artifact/source consistency and complete release readiness |

Two delivery milestones separate the paired working browser integrations from cumulative artifact validation. The protocol/page boundary, sidebar binding/race boundary and two native adapters have distinct failure seams; their task decomposition must not hide the entire extension subsystem in one unit. Both native sidebars belong to the same delivery phase and release. Demonstrations in 3.1 show ordinary-page behavior, not a dedicated application tab; 3.2 demonstrates actual development package routes where facilities permit.

## Reviews and lifecycle

Every delivery milestone exits with whole-capability code review, applicable tests and blocker repair, committed milestone report and refreshed HANDOFF. TASKS assigns these to its final implementation task unless the milestone has at least four delivery tasks and the phase has at least two delivery milestones; only then use a standalone milestone review task. Each final phase-review milestone contains exactly one review/testing/report task and is excluded from delivery counts.

Required defects, SPEC/PLAN violations and failed feasible checks block their affected boundary. Code review and tests are separate obligations. Reports retain findings, resolutions and a TODO section, explicitly None when empty; only eligible noncritical issues may be deferred with impact, options, rationale and owner. Final phase review also produces the final implementation report and carries unresolved eligible TODOs forward.

## Environment and evidence gates

Follow [browser policy](../../.agents/plugins/sdd-manager/assets/BROWSER_DEV_POLICY.md) and [Playwright recovery guidance](../../.agents/plugins/sdd-manager/assets/playwright.md). Establish pinned tooling, dedicated binaries/profiles and representative repeated execution early. Browser-only UI acceptance uses working Chromium headless shell and managed Firefox. Native extension sidebars require separate full-browser capability assessment; full Chromium may run headlessly. No global/personal browser substitution or silent coverage loss is allowed.

Unavailable native Windows execution and unavailable full-browser checks after bounded policy-compliant diagnosis are excluded, with exact failed operation/mode and remaining gaps reported. They are not unchecked native-only tasks or phase/release dependencies. Required deliverables remain in scope; a real artifact build failure or feasible required check failure still blocks. Cross-built package inspection does not establish native launch or installation success.

## Integration and releases

After a phase review and its hosted closures, verify task persistence and the complete phase, explicitly merge into the actual default branch, verify the merged state and publish/read back. Release publication then follows as a coordinator/forge transition after phase integration, not an impossible preintegration delivery-task prerequisite. Prepare/finalize exact release notes, create the eligible default-branch release commit, publish its tag, upload cumulative verified assets, and read back the published release and downloaded bytes under R-10. Release publication failure retains that transition and blocks starting the next phase; it does not erase implementation evidence.
