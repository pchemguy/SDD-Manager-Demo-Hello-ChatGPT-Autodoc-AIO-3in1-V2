# Main documentation preparation record

## Current control

- Mode and decision source: autodoc/onepass, explicitly requested by the user on 2026-10-27.
- Current pass and scope: onepass; complete Hello World application across browser, Windows Electron, and Chromium/Firefox sidebar extensions.
- Approval/delegation basis: first PROJECT approval remains active. ARCHITECTURE through TASKS are preapproved by autodoc. The user delegates unspecified behavior/platform adaptations to document preparation, with material choices presented at applicable review checkpoints.
- Tracking/publication selection: enabled for documentation and implementation by existing root AGENTS.md. Publish and verify each commit. Repository operations and three cumulative platform releases are within the development request.
- Next boundary: initialize and close DOCS-001 after verified publication, then publish PROJECT and pause for its first approval. After approval, continue through DOCS-008 and stop before DOCS-009 package QC and implementation.
- Reporting: Standard; concise progress and consequential decisions.

## Scope sequence

One document pass covers the entire user request. The three platform delivery phases are implementation phases, not separate documentation passes. Scope: Hello World, exactly one of red/blue/green selected, initial red, immediate color changes, browser/Electron main and settings panels, page-side message and sidebar settings for ordinary webpages, reuse across platforms, cumulative packaged release assets and honest verification limits.

## Decisions and document evidence

| Task | Current evidence / decision basis |
| --- | --- |
| DOCS-001 | Existing four root files preserved byte for byte against initial commit f7bbec9bb22184bba19ed84097a7387aecd8e9c2; no copies needed. Provenance seed and merge verified below. Local task/control/handoff records created. Publication and issue closure must be confirmed from Git/provider. |
| DOCS-002 | Onepass PROJECT proposal: `PROJECT.md`, SHA-256 `7e0d00117f35fe45c3b2893aaf2876ef344b53cda1c5e0573ba48c0fb54645e6`. User acceptance pending; DOCS-002 remains unchecked. Reviewed against full seed, principal-scope boundaries, material lifecycle/permission/layout decisions and delivery requirements. |
| DOCS-003 | Pending PROJECT acceptance; later checkpoint preapproved by autodoc. |
| DOCS-004 | Pending architecture; checkpoint preapproved by autodoc. |
| DOCS-005 | Pending design and SPEC QC; checkpoint preapproved by autodoc. |
| DOCS-006 | Pending SPEC and strategy QC; checkpoint preapproved by autodoc. |
| DOCS-007 | Pending PLAN and combined layout QC; checkpoint preapproved by autodoc. |
| DOCS-008 | Pending preceding inputs and task QC; checkpoint preapproved by autodoc. |
| DOCS-009 | Not selected at autodoc stop; package QC remains pending. |

Material proposals are in [PROJECT](PROJECT.md): session-only color; narrow-window stacking; Windows x64 unsigned portable archive; toolbar activation with temporary access; isolated page overlay; per-window active-tab following and per-document state; explicit reactivation after full navigation; unsupported-page disabled controls; no signing/store delivery. These are agent proposals under the user's clarification request, not accepted human decisions. A shared native DOM approach is recommended over a full framework for the limited UI. Precise module and API contracts remain for downstream design.

## Initialization and current reset

- Original root-file presence: all four present; retained AGENTS.md, AI_DISCLOSURE.md, SDD-MANAGER.md and SKILL_DISCOVERY_PROTOCOL.md unchanged. Copied root files: none.
- Preservation verification: exact byte comparison against initial Git blobs passed for all four files. No mixed-initialization continuation pause applies.
- Tracking: sdd-docs-main native milestone 1 and DOCS-001 through DOCS-009 issues 1 through 9, respectively. Full definition/body/milestone association readback completed before any preparation modification. Definitions and outgoing preview came from bundled 0.15.4 assets, not generated replacements.
- Manual provenance setup: default enabled; user informed that recording remains manual. Two unchanged bundled files seeded on design-docs/ai-logs at 34e5eff6c5ed9cfdd4c1021aff4c25ea7255d721 from main at f7bbec9bb22184bba19ed84097a7387aecd8e9c2. Explicit two-parent merge a1fbc4d57d95eddeb2653b94504b1ee02718bd6d published and exact-ref readback verified. Both template copies matched packaged bytes. No transcript recorded.
- Current reset: none.
- Orientation: clean main at initial commit, no product code or development documents, no unfinished workflow refs. Linux host with Git, Node and Python available. Windows-native execution has not been established. The bundled and installed SDD Manager sources declare 0.15.4.
- Discovery: repository standalone Technical Writing Assistant and bundled SDD Manager entries inspected; capabilities reported in chat. No discovery report file or product scaffold created.

## Pending transitions

Initialization commit 83278d9756e616bbe7a6327246cf5b782e59ade0 was pushed with exact-ref readback; issue 1 evidence and completed closure verified through the supplied-token API. The GitHub app connection returned 403 Resource not accessible by integration for comment/update; it remains suitable for reads, while the supplied token successfully performs the required writes. No credential value is retained here.

Publish/read back the PROJECT proposal, then present it and pause for human acceptance. Issue 2 and DOCS-002 remain open/unchecked. The documentation milestone remains open. Do not begin ARCHITECTURE, package QC or implementation before their applicable gates.

## Platform evidence consulted

Official [Chromium activeTab](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab), [Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel), [Firefox sidebar opening](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sidebarAction/open) and [Firefox permissions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions) documentation was consulted on 2026-10-27. Temporary access and native sidebar support are documented capabilities, not tested project compatibility. The proposed reset/reactivation policy intentionally applies at every full document navigation even where the browser retains a same-origin activeTab grant.
