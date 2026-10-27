# Main documentation preparation record

## Current control

- Mode and decision source: autodoc/onepass, explicitly requested by the user on 2026-10-27.
- Current pass and scope: onepass; complete Hello World application across browser, Windows Electron, and Chromium/Firefox sidebar extensions.
- Approval/delegation basis: PROJECT approved by the user's “k” response to the published proposal at 9106f4c05408c07feff7e0a3680b353a963b30ed. ARCHITECTURE through TASKS are preapproved by autodoc. The user delegates unspecified behavior/platform adaptations to document preparation, with material choices presented at applicable review checkpoints.
- Tracking/publication selection: enabled for documentation and implementation by existing root AGENTS.md. Publish and verify each commit. Repository operations and three cumulative platform releases are within the development request.
- Next boundary: publish/read back DOCS-008 and verify issue #8 completed closure, then stop after DOCS-008 before package QC and implementation.
- Reporting: Standard; concise progress and consequential decisions.

## Scope sequence

One document pass covers the entire user request. The three platform delivery phases are implementation phases, not separate documentation passes. Scope: Hello World, exactly one of red/blue/green selected, initial red, immediate color changes, browser/Electron main and settings panels, page-side message and sidebar settings for ordinary webpages, reuse across platforms, cumulative packaged release assets and honest verification limits.

## Decisions and document evidence

| Task | Current evidence / decision basis |
| --- | --- |
| DOCS-001 | Existing four root files preserved byte for byte against initial commit f7bbec9bb22184bba19ed84097a7387aecd8e9c2; no copies needed. Provenance seed and merge verified below. Local task/control/handoff records created. Publication and issue closure must be confirmed from Git/provider. |
| DOCS-002 | Onepass PROJECT proposal: `PROJECT.md`, SHA-256 `7e0d00117f35fe45c3b2893aaf2876ef344b53cda1c5e0573ba48c0fb54645e6`. Accepted unchanged by the user's “k” on 2026-10-27; DOCS-002 closes with this approval checkpoint. Reviewed against full seed, principal-scope boundaries, material lifecycle/permission/layout decisions and delivery requirements. |
| DOCS-003 | Onepass; autodoc preapproval from user request and PROJECT approval applies. Architecture reviewed against approved PROJECT: inward dependencies, page-owned state, least required privileges, browser-specific background adapters, static packaging and native-verification limits; no unresolved scope conflict. `docs/dev/ARCHITECTURE.md` SHA-256 `6a82ed8ff4d94257c16a5e4ed9afbdc90ce1b2c3a70e6ff6297fbb66aa603cbc`. Publication and issue closure follow this commit and require actual readback. |
| DOCS-004 | Onepass; autodoc preapproval from user request and PROJECT approval applies. Decomposition reviewed against PROJECT/ARCHITECTURE: single state owners, reusable views, explicit adapter/protocol seams, lifecycle cleanup and packaging/test responsibilities; no cycles or unresolved material decisions. `docs/dev/DECOMPOSITION.md` SHA-256 `7a341532ef2efb3bd4d5c27170241e49eeebf8e3275af61dc2c78bb97da90f6b`. Publication and issue closure follow this commit and require actual readback. |
| DOCS-005 | Onepass; autodoc preapproval from user request and PROJECT approval applies. SPEC/design conformance Ready; R-01–R-11 and grouped acceptance cover model/UI, layout, activation, document lifecycle, messaging/errors, complete artifacts and scoped verification. See SPEC-REVIEW-REPORT. `docs/dev/SPEC.md` SHA-256 `8739d95179473fed5f9e49917d150122c615ece31d15e756f509e0aaff39f23a`; `docs/dev/SPEC-REVIEW-REPORT.md` SHA-256 `3a4ee9b4f252a55721adafc3edb191d47ae393ba3388e9382ca80b9e4e9d039b`. Publication and issue closure follow this commit and require actual readback. |
| DOCS-006 | Onepass; autodoc preapproval from user request and PROJECT approval applies. PLAN/SPEC strategy Ready for layout; three ordered platform phases, delivery milestone counts 2/1/2 justified for small cohesive outcomes, mandatory phase reviews and postintegration cumulative releases. TASKS awaits combined layout review. `docs/dev/PLAN.md` SHA-256 `c7b6d4b6c0a5a975dd1f8303ed3e4a2bb0c72cb8928f34e8f18c499459b8b872`; `docs/dev/PLAN-REVIEW-REPORT.md` SHA-256 `121d018358f3bc5de71d40ee4afa41fdb0e2f8f3beb83474822c36cfc5c9774b`. Publication and issue closure follow this commit and require actual readback. |
| DOCS-007 | Onepass; autodoc preapproval from user request and PROJECT approval applies. Combined PLAN/layout conformance Ready; component-to-source/test/build/document ownership, isolated ignored generated paths and planned command interfaces assessed. PLAN-REVIEW-REPORT Revision 1 preserves initial strategy evidence. `docs/dev/layout.md` SHA-256 `fa5cbc5d3b77c72ea102006f41ff44b436e8044d85da0ec3b4fdbbc70339ec72`; `docs/dev/PLAN-REVIEW-REPORT.md` SHA-256 `e05efd1e7e15934ebd7f60c8619fbeb3ce627dfbc32eb8b6485adb4149a37d21`. Publication and issue closure follow this commit and require actual readback. |
| DOCS-008 | Onepass; autodoc preapproval from user request and PROJECT approval applies. TASKS/PLAN conformance Ready after TASKS-01 correction/recheck; 18 tasks across three phases (14 delivery, four review), all dependencies and review thresholds validated. Autodoc onepass ends here; package QC/implementation await advance. `docs/dev/TASKS.md` SHA-256 `637aebed34d991190c6cc899f8a2ce4401a70f0c2cfe6130af2fdc568761b56c`; `docs/dev/TASKS-REVIEW-REPORT.md` SHA-256 `3816133146b8a45f0cd17bb61e6c8e317eed339dc410a4a67d847fbfec7ea4cd`. Publication and issue closure follow this commit and require actual readback. |
| DOCS-009 | Not selected at autodoc stop; package QC remains pending. |

Material proposals are in [PROJECT](PROJECT.md): session-only color; narrow-window stacking; Windows x64 unsigned portable archive; toolbar activation with temporary access; isolated page overlay; per-window active-tab following and per-document state; explicit reactivation after full navigation; unsupported-page disabled controls; no signing/store delivery. These agent proposals were presented in the brief and accepted through the user's approval of that published PROJECT state. A shared native DOM approach is recommended over a full framework for the limited UI. Precise module and API contracts remain for downstream design.

## Initialization and current reset

- Original root-file presence: all four present; retained AGENTS.md, AI_DISCLOSURE.md, SDD-MANAGER.md and SKILL_DISCOVERY_PROTOCOL.md unchanged. Copied root files: none.
- Preservation verification: exact byte comparison against initial Git blobs passed for all four files. No mixed-initialization continuation pause applies.
- Tracking: sdd-docs-main native milestone 1 and DOCS-001 through DOCS-009 issues 1 through 9, respectively. Full definition/body/milestone association readback completed before any preparation modification. Definitions and outgoing preview came from bundled 0.15.4 assets, not generated replacements.
- Manual provenance setup: default enabled; user informed that recording remains manual. Two unchanged bundled files seeded on design-docs/ai-logs at 34e5eff6c5ed9cfdd4c1021aff4c25ea7255d721 from main at f7bbec9bb22184bba19ed84097a7387aecd8e9c2. Explicit two-parent merge a1fbc4d57d95eddeb2653b94504b1ee02718bd6d published and exact-ref readback verified. Both template copies matched packaged bytes. No transcript recorded.
- Current reset: none.
- Orientation: clean main at initial commit, no product code or development documents, no unfinished workflow refs. Linux host with Git, Node and Python available. Windows-native execution has not been established. The bundled and installed SDD Manager sources declare 0.15.4.
- Discovery: repository standalone Technical Writing Assistant and bundled SDD Manager entries inspected; capabilities reported in chat. No discovery report file or product scaffold created.

## Pending transitions

DOCS-001 through DOCS-007 publication and completed issue closures have been verified before this document was authored. Publish/read back this DOCS-008 checkpoint, then verify its completed issue closure. The documentation milestone and DOCS-009 remain open. No implementation phase is activated. Autodoc is at its DOCS-008 stopping boundary; await explicit advance to whole-package QC and implementation.

## Platform evidence consulted

Official [Chromium activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab), [Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel), [Firefox sidebar opening](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sidebarAction/open) and [Firefox permissions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions) documentation was consulted on 2026-10-27. Temporary access and native sidebar support are documented capabilities, not tested project compatibility. The proposed reset/reactivation policy intentionally applies at every full document navigation even where the browser retains a same-origin activeTab grant.
