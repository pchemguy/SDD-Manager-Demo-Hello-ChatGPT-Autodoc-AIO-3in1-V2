# Implementation tasks

[PLAN](PLAN.md) owns delivery boundaries; [SPEC](SPEC.md) owns R-01–R-11; [layout](layout.md) owns expected paths. All work below is planned and unchecked. Commands are the implementation interfaces defined in layout, not presently available or previously validated commands.

Each task includes focused test-first behavior checks where meaningful, implementation and user/module documentation, actual verification evidence, exactly one owning task commit with its initial checkbox, per-commit push/readback, then verified issue closure. Preserve the available-policy verification scope: excluded unavailable native/full-browser checks are reported, not marked passed or left as blocking native-only tasks. Failed feasible checks remain blockers. Report paths below are planned evidence destinations, not existing files.

## Phase 1 — Browser app

- [x] Phase 1 — Browser app
    - [x] Milestone 1.1 — Usable browser experience
        - [x] T-001 — Establish isolated tooling and representative browser execution
            Depends on: none, after accepted preparation integration and Phase 1 tracking activation.
            Scope: package/lockfiles, contained pytest support requirements, tools/check.py dispatcher, tests/test_environment.py and bounded Node probes; ignore owned generated paths. Establish version 0.1.0 and planned command interfaces, selecting pinned supported dependency versions without implementing future platform runtime.
            Acceptance: dedicated absolute browser/Python paths and isolated profiles; Chromium shell and managed Firefox each assessed with two context/page interaction/render/teardown cycles. Provisioning and mode diagnosis evidence is separate from app acceptance. Follow policy recovery for full Chromium and Firefox EPERM; do not treat an unavailable full mode as failure of working headless coverage.
            Verification: npm ci; python tools/check.py environment --browser chromium; python tools/check.py environment --browser firefox. Record versions, commands, effective binaries/modes, source/integrity and actual exclusions in task evidence.
            Evidence: Provisioned locked Playwright 1.64.1/esbuild 0.28.2 and project-local pytest 9.1.1 support; npm ci passed. Chromium shell 156.0.8078.4 and Firefox 157.0 each passed a pytest capability check with two isolated interaction/render/teardown cycles and inspected screenshots. CDN returned invalid HTML; matching official OCI layer size/digests verified before Chromium/FFmpeg extraction. Firefox uid_map EPERM diagnosed and process-local local-fixture override verified. No product acceptance or Windows/native-sidebar compatibility claimed. Detailed evidence: docs/dev/reports/phases/1/T-001.md. Phase 1 tracking and published preparation baseline verified.
        - [x] T-002 — Implement shared color views and browser composition
            Depends on: T-001.
            Scope: src/core/colors.js, src/ui/message.js, src/ui/color-controls.js, src/browser entry/composition and initial tools/build.mjs browser staging; tests/test_model.py and initial tests/test_ui.py/probes.
            Acceptance: R-01 and R-03 core behavior; exact text, initial red, ordered native radio group, all immediate colors and exclusive selection; invalid model input unchanged; independent memory state and reload reset. Shared modules contain no platform APIs or persistence.
            Verification: npm run build:browser; python tools/check.py model; python tools/check.py ui --browser chromium; python tools/check.py ui --browser firefox. Exercise real rendered interaction and DOM/component disposal; document module interfaces and actual limitations.
            Evidence: Implemented the pure red/blue/green model, reusable DOM message/radio controls, document-local composition and initial production browser build. RED: model suite failed two behavioral expectations against the public seam; built-UI suite failed messageCount 0 versus 1. GREEN: model 2 passed; built UI 1 passed in each Chromium and Firefox, including exact text/labels/colors, exclusivity, independent page state, reload reset and component disposal. Build and ASCII checks passed. Responsive layout is T-003 scope; no package/native-platform acceptance claimed.
        - [x] T-003 — Complete responsive and accessible browser behavior
            Depends on: T-001, T-002.
            Scope: src/ui/app.css and composition styling, tests/test_ui.py and screenshots/probes; concise browser usage guidance.
            Acceptance: R-02 at wide/narrow/short viewports and 200% zoom; independently centered main panel, right settings, narrow stacking, no overlap/clipping; native keyboard/labels and visible focus. Browser R-01–03 remain satisfied.
            Verification: python tools/check.py ui --browser chromium; python tools/check.py ui --browser firefox. Inspect screenshots and numeric geometry/color assertions, not text alone.
            Milestone exit: review all 1.1 code, rerun applicable browser/model checks, fix blockers, retain actual environment versus product evidence and report limits. Commit milestone report docs/dev/reports/phases/1/1.1.md and refreshed HANDOFF with this result/checkbox. Report TODOs as None or justified eligible findings.
    - [x] Milestone 1.2 — Deployable browser package
            Evidence: Completed responsive browser layout and native keyboard/focus accessibility. RED: geometry gap -1264 before CSS; GREEN: final built UI suite 2 passed in each Chromium and Firefox, model regression 2 passed. Main center stays 640 at width 1280 despite settings-width changes; right gap24; 768/767 breakpoint, 320px stack, short-window access and CSS200% zoom pass. Screenshots inspected. Whole milestone1.1 code reviewed separately; no blocker/TODO. Report docs/dev/reports/phases/1/1.1.md and HANDOFF included. CSS-zoom/headless evidence is not native browser-chrome or OS-focus verification.
        - [x] T-004 — Build and verify a relocatable browser distribution
            Depends on: T-003 and milestone 1.1 completion/closure.
            Scope: tools/build.mjs, browser staging, tools/package.mjs browser allowlist/archive/licenses, tests/test_browser_package.py.
            Acceptance: static runtime loads from an extracted archive under a non-root HTTP subpath, with local assets and no Node/server dependency for end users beyond static hosting. R-03 and browser R-10 archive root/version/exclusion rules hold.
            Verification: npm run build:browser; npm run package:browser; python tools/check.py browser-package. Exercise extracted assets in both usable browsers and validate ZIP paths, local references, notices and forbidden-file absence.
            Evidence: Implemented clean explicit browser staging, version/source/development metadata, runtime/license allowlist and deterministic safe ZIP construction. RED: three archive tests failed for an empty artifact and missing entry point. GREEN: browser-package suite 3 passed, including actual extracted files under /nested/app in Chromium and Firefox with correct red-to-blue interaction and no asset/page errors. Archive contains exactly index.html, app.js, style.css, build-info.json and LICENSE; CRC check passed. Uncommitted builds are marked developmentBuild rather than falsely pinned to clean release source. README build guidance updated; final cumulative instructions/checksums are T-005.
        - [x] T-005 — Complete browser installation and package evidence
            Depends on: T-004.
            Scope: docs/INSTALL.md, README, package metadata/checksum/evidence generation and tests/test_release.py browser subset.
            Acceptance: release-ready 0.1.0 browser ZIP, INSTALL.md, VERIFICATION.md and SHA256SUMS agree with pinned source/version; installation and performed/excluded checks are truthful. Package documentation contains no future-platform delivery claim.
            Verification: npm run package:all; python tools/check.py release --version 0.1.0. Recompute hashes and inspect actual output; publication download checks occur after integration in the release transition.
            Milestone exit: whole 1.2 code/package review, extracted-package regressions and blocker repair; commit docs/dev/reports/phases/1/1.2.md, TODO dispositions and HANDOFF with this result/checkbox.
    - [x] Milestone 1.3 — Phase review
            Evidence: Completed browser install/verification records, cumulative package:all and exact SHA256SUMS. RED: release inventory failed for three missing companion documents; GREEN: release 2 passed, browser-package 3 passed, strengthened UI 2 passed per browser. Repeat same-input builds produced identical artifact hashes and removed synthetic stale staging material. Separate read-only reviewer found no Critical/Important defect; minor BR-01 companion provenance and BR-02 bidirectional page-independence test gaps were verified and resolved. Whole milestone1.2 code/package review, report docs/dev/reports/phases/1/1.2.md, TODO None and HANDOFF included. Release integration/download verification remain pending.
        - [x] T-006 — Review, test and report the browser phase
            Depends on: T-003, T-005 and milestones 1.1/1.2 completion/closure.
            Scope: full Phase 1 code review and applicable model/UI/package regressions; prepare complete release notes and source/artifact coverage, docs/dev/reports/phases/1/PHASE-REPORT.md and HANDOFF.
            Acceptance: scoped R-01–03/R-10–11 exits, task persistence audit and required findings resolved; clearly separate observed checks and unavailable evidence. No extension/Electron requirement is pulled into browser acceptance.
            Verification: python tools/check.py model; both browser ui suites; python tools/check.py browser-package; python tools/check.py release --version 0.1.0. Review code separately from test execution. Persist report/notes/HANDOFF and this checkbox together.
            Transition: after issue/review milestone closure, coordinator verifies and explicitly integrates/publishes the complete phase, then finalizes default-branch release commit/tag and publishes verified cumulative assets with download readback. No phase 2 activation before that transition completes.
            Evidence: Reviewed complete browser phase source, tests, packages and public claims; no remaining blocker/TODO. Clean candidate package:all built; model2 + Chromium UI2 + Firefox UI2 + extracted browser-package3 + clean-source release2 = 11 passing test executions. Independent review minor BR-01/BR-02 resolved. T-001–T-005 single-task result/evidence/checkbox commits audited and published. Phase report, HANDOFF, exact 0.1.0 notes and ignored highlights coverage prepared. Source/tag/asset publication is a pending postintegration transition, not claimed complete; native evidence limits retained.

## Phase 2 — Windows Electron app

- [x] Phase 2 — Windows Electron app
    - [x] Milestone 2.1 — Portable desktop delivery
        - [x] T-007 — Host the shared browser UI in constrained Electron
            Depends on: T-006, Phase 1 published integration/release and Phase 2 activation.
            Scope: src/electron/main.cjs, desktop local entry wiring and tests/test_electron.py/probes; version 0.2.0 and required pinned desktop dependencies.
            Acceptance: R-09 local window composition; nodeIntegration false, contextIsolation/sandbox true, no preload bridge, denied unexpected navigation/new windows/permissions and correct close lifecycle. R-01–03 remain shared, without a forked desktop color model.
            Verification: npm run build:browser; python tools/check.py electron. Check host configuration and local entry/asset resolution, plus available runtime behavior; native Windows exclusions must be explicit and do not block feasible work.
            Evidence: Implemented the local Electron host with retained single-window ownership, no renderer Node/preload/IPC bridge, context isolation/sandbox/web security, denied unexpected navigation/popups/permissions, no default menu and close/error lifecycle. Staged the same browser UI without a server; version0.2.0 and pinned Electron45/packager20.3 dependencies. RED3 behavioral failures; GREEN Electron API-boundary suite3 passed; UI2 passed in each Chromium/Firefox. Host checks are modeled, not native Windows execution. Detailed evidence docs/dev/reports/phases/2/T-007.md; complete runtime packaging remains T-008.
        - [x] T-008 — Package the complete Windows x64 runtime
            Depends on: T-007.
            Scope: tools/package.mjs Electron assembly with @electron/packager, runtime/licenses/resources and Windows archive inspection in tests/test_electron.py.
            Acceptance: R-09 complete portable ZIP with executable/native runtime/app resources and notices; safe relocatable extraction, no source checkout, separate Node installation, server or elevation needed. Report unsigned status.
            Verification: npm run package:electron; python tools/check.py electron. Validate actual archive/PE architecture/resource and relative entry contents, integrity and feasible extracted launch. Unavailable native launch is excluded and reported; inability to produce the artifact is a real build blocker.
            Evidence: Complete unsigned Windows x64 portable archive produced with Electron45 runtime. RED missing archive; GREEN electron5 passed, including actual AMD64 PE, CRC, local renderer/version and byte equality for all unchanged upstream SDK resources/licenses. Default checksum validation retained. Native Windows launch unavailable/excluded; see docs/dev/reports/phases/2/T-008.md.
        - [x] T-009 — Verify cumulative browser and desktop distribution
            Depends on: T-007, T-008.
            Scope: docs/INSTALL.md, README, cumulative package selection/metadata, tests/test_release.py and earlier-platform regressions.
            Acceptance: rebuilt version 0.2.0 browser/Windows archives, consistent source/version/hashes, correct static/portable instructions and candid evidence. Browser behavior and relocatable deployment remain intact.
            Verification: npm run package:all; python tools/check.py release --version 0.2.0; python tools/check.py browser-package; both browser ui suites and feasible electron suite.
            Milestone exit: review all 2.1 host/package/cumulative code, applicable tests and blocker repairs; commit docs/dev/reports/phases/2/2.1.md, TODO dispositions and refreshed HANDOFF with this result/checkbox.
    - [x] Milestone 2.2 — Phase review
            Evidence: Cumulative0.2 browser/Windows packages and unsigned/static instructions verified. release2, browser-package3, electron5, Chromium UI2, Firefox UI2, model2 passed (16). Whole milestone source/package/doc review Ready; independent minor host-byte provenance gap fixed, no required defect/TODO. Milestone report docs/dev/reports/phases/2/2.1.md and refreshed HANDOFF included. Native Windows checks unavailable/excluded.
        - [x] T-010 — Review, test and report the desktop phase
            Depends on: T-009 and milestone 2.1 completion/closure.
            Scope: Phase 2 cross-platform code review/regressions, complete release notes, docs/dev/reports/phases/2/PHASE-REPORT.md and HANDOFF.
            Acceptance: R-09 plus preserved R-01–03 and cumulative R-10–11; complete artifact/source coverage and task persistence evidence, required defects resolved and native limits explicit.
            Verification: electron, browser-package, both browser ui and release --version 0.2.0 suites via tools/check.py. Prepare report/notes/HANDOFF and this checkbox in the same commit; tests do not replace code review.
            Transition: coordinator integrates/verifies/publishes the complete phase, then publishes the default-branch 0.2.0 release with both current artifacts and matching downloaded-byte checks before Phase 3 activation.

## Phase 3 — Sidebar extensions

- [ ] Phase 3 — Sidebar extensions
    - [ ] Milestone 3.1 — Paired sidebar integration
            Evidence: Phase2 whole-code review Ready with no required defect/TODO; independent review minor host-byte provenance gap resolved. Sixteen scoped model/browser/UI/extracted-package/electron/release test executions passed. Reports/notes/HANDOFF prepared; native Windows exclusions explicit. T007-009 single-task publication/issues confirmed; integration and source-pinned0.2 release remain coordinator transitions.
        - [ ] T-011 — Implement document-owned page state and validated messages
            Depends on: T-010, Phase 2 published integration/release and Phase 3 activation.
            Scope: src/extensions/protocol.js and page.js, isolated shared message mounting, tests/test_extension_protocol.py and ordinary-page fixtures/probes; version 0.3.0.
            Acceptance: R-04–06 page-side contracts: one isolated noninteractive overlay, red initial state, idempotent activation, validated own-extension messages, wrong-document/invalid inputs unchanged, full/cached navigation teardown and same-document preservation. No persistent storage or page-origin command bridge.
            Verification: python tools/check.py model; python tools/check.py extension-protocol. Exercise real page controller/DOM and modeled extension transport separately; confirm fixture geometry/focus unchanged and cleanup safe.
        - [ ] T-012 — Implement window-bound sidebar synchronization and failures
            Depends on: T-011.
            Scope: src/extensions/sidebar HTML/JS/CSS, controls composition, tests/test_extension_sidebar.py and bounded adapter probes.
            Acceptance: R-05–07 own-window active-tab binding, independent page colors, reopen/probe synchronization, captured-target dispatch, queued latest-choice convergence, stale-reply/nonce rejection, 2-second timeout handling and disabled explanatory status. Narrow sidebar remains accessible.
            Verification: python tools/check.py extension-sidebar. Deterministic delayed/reordered reply, switching, navigation, denied/absent receiver and rapid selection tests exercise the controller through its adapter seam. Label these modeled transport checks, not native browser sidebar evidence.
        - [ ] T-013 — Integrate Chromium toolbar activation and native side panel
            Depends on: T-011, T-012.
            Scope: src/extensions/activation.js, Chromium manifest/worker/API adapter, extension build entry points and Chromium tests/probes.
            Acceptance: R-04–08 explicit toolbar activation/open timing, frame-zero temporary access, correct minimal permissions and bundled native sidebar/content entries. Sidebar-menu opening does not activate a page. Errors cannot redirect into another tab/window.
            Verification: node tools/build.mjs --platform chromium; python tools/check.py extensions --browser chromium. The intermediate Chromium build command is an internal build interface; final paired package completeness is assessed after T-014. Exercise actual full Chromium where available (including headless full mode); preserve working-shell controller checks and report excluded native behavior under policy.
        - [ ] T-014 — Integrate Firefox toolbar activation and native sidebar
            Depends on: T-011, T-012, T-013.
            Scope: Firefox manifest/nonpersistent-background/API adapter, paired extension build selection and Firefox tests/probes.
            Acceptance: same R-04–08 experience through Firefox-native APIs and correct MV3 background form; no forked model/UI/protocol, no permanent host grants or runtime dependencies. Both browsers' build entries are complete.
            Verification: npm run package:extensions; python tools/check.py extensions --browser firefox; regress Chromium adapter/protocol/sidebar suites. Use a compliant isolated Firefox environment, distinguishing available native integration from modeled tests and stating any excluded browser-chrome behavior.
        - [ ] T-015 — Review, test and report paired sidebar integration
            Depends on: T-011, T-012, T-013, T-014.
            Scope: whole 3.1 code review, cross-adapter interaction/lifecycle/race/error checks and blocker repairs; docs/dev/reports/phases/3/3.1.md and HANDOFF.
            Acceptance: page and sidebar responsibility split is coherent; all feasible R-04–08 evidence passes, no wrong-document mutation or persistence, actual native/modeled/excluded coverage separated. Record TODO dispositions.
            Verification: extension-protocol, extension-sidebar and both browser extensions suites via tools/check.py; inspect native fixtures/screenshots where supported. Commit milestone report/HANDOFF with this checkbox; close the milestone only after all its issues close.
    - [ ] Milestone 3.2 — Cumulative platform distribution
        - [ ] T-016 — Assemble all four versioned platform packages
            Depends on: T-015 and milestone 3.1 completion/closure.
            Scope: final extension ZIP/XPI allowlists and runtime staging, cumulative browser/Windows packages, docs/INSTALL.md, README, checksums/evidence and tests/test_release.py.
            Acceptance: R-08–10 manifest-at-root packages and bundled assets, current 0.3.0 source/version across all four artifacts, complete licenses and no secrets/tests/plugin/caches. Chromium unpacked and Firefox temporary installation limitations and unsigned Windows status are explicit.
            Verification: npm run package:all; python tools/check.py release --version 0.3.0. Extract and inspect every package and local reference, independently recompute checksums, validate completeness and distribution instructions.
        - [ ] T-017 — Verify packaged lifecycle matrix and preserved platforms
            Depends on: T-016.
            Scope: tests/test_extensions.py/package fixtures, missing integration coverage and package evidence; cumulative browser/desktop regressions and installation checks where available.
            Acceptance: actual extracted package paths used for feasible native extension scenarios: two tabs/windows, reopen, background suspension, full/cached/SPA navigation, unsupported page, stale/invalid messages and timeout recovery; no application-tab substitute. Earlier platform behavior and package integrity remain satisfied. Unavailable native/full-browser checks explicitly excluded after diagnosis, with remaining feasible checks passed.
            Verification: both browser extensions suites, extension-protocol/sidebar, browser-package, electron and release --version 0.3.0 suites via tools/check.py. Inspect screenshots/computed state and actual archive evidence; separate modeled from native coverage.
            Milestone exit: whole 3.2 package/test/documentation review and blocker repair; commit docs/dev/reports/phases/3/3.2.md, TODO dispositions and refreshed HANDOFF with this result/checkbox.
    - [ ] Milestone 3.3 — Phase review
        - [ ] T-018 — Review, test and report complete platform delivery
            Depends on: T-015, T-017 and milestones 3.1/3.2 completion/closure.
            Scope: full Phase 3 and preserved-platform code review/regressions, complete release notes, docs/dev/reports/phases/3/PHASE-REPORT.md, docs/dev/reports/IMPLEMENTATION-REPORT.md and HANDOFF.
            Acceptance: complete R-01–11 coverage with no unresolved required defect; all platform artifacts/source/version agree; task persistence verified. Aggregate all remaining eligible milestone/phase TODOs with provenance, options, impact and owner, or None. State exact native/browser-mode limits without claiming unobserved compatibility.
            Verification: all applicable tools/check.py suites and both usable browsers, including release --version 0.3.0. Persist reports/notes/HANDOFF and this checkbox together; no code-review substitution by test results.
            Transition: coordinator explicitly integrates/verifies/publishes the complete phase, finalizes default-branch release commit/tag, publishes all four artifacts and shared documents, verifies downloaded hashes and reports final hosted state. Stop after the authorized complete release outcome.
