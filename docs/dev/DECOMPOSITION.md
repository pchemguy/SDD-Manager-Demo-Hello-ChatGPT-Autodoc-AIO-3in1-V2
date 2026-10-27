# Logical component decomposition

[ARCHITECTURE](ARCHITECTURE.md) owns the block structure and platform boundaries. Components below describe intended responsibilities and verification seams, not an implementation status or file inventory.

## Shared application components

| Component | Provides and owns | Requires / excludes | Verification seam |
| --- | --- | --- | --- |
| Color model | Canonical ordered colors, initial red state, validated selection | No DOM, storage, framework or platform API | Deterministic initial/valid/invalid transition checks |
| Message view | Mount/update/dispose of the exact Hello World text with selected CSS color | Validated color; owns only its element | DOM text, computed color, cleanup and duplicate-mount checks |
| Color controls | Labeled native radio group, selected state, availability and selection callbacks | Model colors and supplied callback; does not decide persistence or target page | Pointer/keyboard selection, exclusivity, focus and disabled-state checks |
| Application composition | One model, shared message and controls, responsive two-panel layout and teardown | Shared components and local document; no platform privilege | Built browser app interaction, centering, narrow layout, reload and independent sessions |

The same message view is composed into the browser/desktop main panel and injected page panel. The same controls serve the browser/desktop settings panel and extension sidebar. Callbacks connect UI with the owning model/controller without platform-specific behavior in shared components.

## Desktop components

The Electron host owns window creation, local entry loading, permission/navigation restrictions and application termination. It consumes the built browser composition, not its source-development server. It never owns color, exposes privileged APIs or adds settings. Package construction owns the runtime directory and relocatable archive; verification inspects and, when facilities exist, launches the extracted archive rather than substituting the source application.

## Extension components

| Component | Responsibility and state | Collaboration / failure boundary |
| --- | --- | --- |
| Native API adapter | Normalize Chromium/Firefox action, sidebar-open, injection, tab and runtime operations | Browser-specific manifest/background form; return explicit failures to caller |
| Activation coordinator | Handle toolbar gesture, initiate sidebar opening, inject only the selected top frame and announce successful activation | Captures action tab/window; no persistent color cache and no automatic site injection |
| Page controller | Own one document nonce, color model, isolated message root and runtime listener | Idempotent initialization; validate requests; reject stale document identity; lifetime ends with document |
| Sidebar controller | Own window identity, current tab/document binding, request generation and pending selections | Probe page on open/tab/activation/navigation events; render acknowledged state; invalidate stale replies and unavailable targets |
| Protocol validation | Define recognized operation, payload and response validation shared by communicating adapters | Reject malformed messages and unsupported versions; carries color/document identity, not browsing history |

The page controller uses only the model and message view. The sidebar controller uses controls and the API adapter. The activation coordinator never becomes a state broker. A missing receiver, restricted page or injection denial is an availability failure surfaced in the sidebar, not a reason to create a separate app tab or redirect a selection.

The sidebar serializes/coalesces pending selections within a live binding so that the latest user selection wins despite delayed acknowledgments. A tab/document change cancels unsent work and advances a local generation; outstanding commands stay bound to their captured document and responses cannot overwrite a newer sidebar binding. Exact protocol fields, error codes and observable timing are owned by SPEC.

## Tooling and documentation boundaries

Build tooling consumes selected platform entries and locked dependencies, emits only distributable runtime resources and preserves relative asset references. Packaging adds licenses, instructions, checksums and evidence per platform; publication verifies the pinned release source and downloaded assets. It does not decide whether missing native evidence passed.

Pytest orchestration owns tests and fixtures; Node probes are test support where JavaScript runtime or browser tooling requires them. Ordinary HTTP fixtures exercise page integration without treating an application tab as the extension product. Shared-model checks, DOM checks, native adapter checks, packaged-runtime checks and browser-chrome interaction are distinct evidence categories.

User installation instructions explain each actual package and its unsigned/development status. Implementation reports own observed environments, failures, exclusions and review findings. Detailed acceptance belongs to SPEC; delivery strategy belongs to PLAN; physical module and test allocation belongs to layout.

## Boundary review

Each stateful runtime has one owner: composition in app documents, page controller in extension documents, binding only in sidebars, window only in Electron. Dependencies flow to shared model/UI or platform adapters without a reverse import. No generic persistence service, state synchronization server, preload bridge or global shared color is needed. Invalid messages and unavailable page access remain local failures. Component seams support independent tests and integrated checks without duplicating the canonical color rule.
