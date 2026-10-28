---
url: https://chatgpt.com/c/6ae0d571-4b8c-83ea-b0ca-844213369ea9
note: SDD Manager - docs/demo/hello_world/prompts/Autodoc 3in1.md
---

> [!IMPORTANT]
>
> **Historical exploration transcript.** This document is retained for provenance and is not authoritative for current behavior or agent instructions.

## Seed Prompt

> [!NOTE] Prompt
>
> Help me develop the following project using $sdd-manager in autodoc mode.
> 
> ### Project repo and credentials
> 
> GitHub repository: https://github.com/{OWNER}/{REPO}
> 
> GitHub token: {FINE_GRAINED_GH_TOKEN}
> 
> ### Versioning and releases
> 
> Manage the project's versioning, choosing an appropriate initial version and increasing it to reflect delivered changes. After each implementation phase is completed, verified and integrated, create and publish a new GitHub release with the corresponding version tag and release notes.
> 
> Each GitHub release must include the installable or deployable artifacts for every platform delivered by that phase. Include installation instructions and clearly distinguish development packages from signed or store-distributed packages. Verify packaged artifacts using the applicable checks under the project's environment policies. Report the checks performed, unavailable checks and remaining unverified behavior.
> 
> ### Project
> 
> Treat this description as the complete target scope. Deliver the baseline functionality across the platforms specified below.
> 
> #### Baseline MVP scope
> 
> Display the message "Hello World" and a group of three vertically stacked radio buttons labeled "red", "blue" and "green". Selecting a radio button immediately changes the message's text color to the selected color, without a separate apply action. Exactly one radio button is selected at a time; initially select "red" and display the message in red.
> 
> ##### Browser and Electron layout
> 
> Place the settings panel containing the three stacked color radio buttons to the right of the main panel displaying "Hello World". Where space permits, center the main panel in the application viewport independently of the settings panel's width. For narrower windows, retain access to both panels without overlap; resolve the arrangement during document preparation.
> 
> ##### Browser extension layout
> 
> Display the main panel containing "Hello World" within the active webpage. Place the settings panel containing the three stacked color radio buttons in the extension sidebar. Selecting a color in the sidebar must immediately update the message on the associated webpage.
> 
> #### Platforms
> 
> Deliver three platform groups in separate phases, in this order: browser app, Windows Electron app, then sidebar extensions. Deliver the Chromium and Firefox extensions together in the same phase and release. Publish a release after each platform group is added.
> 
> Design for reuse from the outset: share application logic and reusable UI components, and isolate platform-specific integration code. Preserve previously delivered platforms when adding another. Adapt layout, lifecycle and any in-scope persistence or file operations without introducing additional application capabilities. Preserve session-only behavior where specified.
> 
> ##### Browser app - baseline delivery
> 
> Deliver the baseline as a browser app.
> 
> ##### Windows Electron delivery
> 
> Deliver an Electron packaged app for Windows. Bundle all required desktop runtime assets; users must not need a separate Node.js installation or development server.
> 
> ##### Browser extension delivery
> 
> Deliver extensions for desktop Chromium and Firefox whose sidebars control or interact with the active webpage. Define page-side and sidebar responsibilities according to the application scope, without assuming that page interaction requires adding UI or changing the page layout. The extension must work with ordinary webpages rather than require a dedicated application tab. Adapt sidebar controls to a narrow, resizable panel.
> 
> Bundle all required extension runtime assets. Users must not need a separate Node.js installation, local development server or backend. Use extension-local storage where persistent data is required.
> 
> During document preparation, define supported pages, activation, required permissions and sidebar-to-page communication. Define which page each sidebar instance controls and how application state is initialized and synchronized when switching tabs, navigating, or closing and reopening the sidebar. Define behavior when page interaction is unavailable, and keep sidebar actions associated with the intended page.
> 
> ### Design clarification
> 
> During document preparation, resolve unspecified behavior and platform adaptations within the stated scope. Surface decisions that materially affect application behavior or delivery at the applicable document-review checkpoints before implementation.
