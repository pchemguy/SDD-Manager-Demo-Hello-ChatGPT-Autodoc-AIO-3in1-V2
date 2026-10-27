# Install and use Hello World

## Browser app

Extract the browser ZIP and upload all its files together to a static HTTP/HTTPS host. Open the deployed index.html. Relative asset URLs support deployment under a subdirectory. This is a deployable static application: users do not need Node.js, npm, a backend or a development server.

The message starts red. Select red, blue or green to change its color immediately. The settings panel is on the right in wide windows and below the message in narrow windows. Radio controls support standard keyboard arrows and Space, with visible focus. Reloading starts a new red session; separate app tabs are independent.

Keep index.html, app.js, style.css, build-info.json and LICENSE together. The archive is a browser deployment package, not an Electron installer or browser extension.

## Windows portable app

Extract the entire win32-x64 ZIP into a writable folder, then launch HelloWorld.exe. Keep the bundled libraries, locales and resources beside the executable. Windows 10/11 x64 is the upstream Electron 45 target; native launch has not been verified on the Linux build host. No separate Node.js installation, development server, backend or elevation is required. Moving the complete extracted folder preserves relative asset loading.

This is an unsigned development portable package, not a signed installer or Microsoft Store distribution. Windows may display an unknown-publisher/SmartScreen warning. The application starts red on every launch and does not save preferences. Closing its window ends the application.

## Chromium sidebar extension (development)

Extract the chromium ZIP to a persistent folder. Open chrome://extensions (or the Chromium browser's extensions page), enable Developer mode, choose Load unpacked and select the extracted folder containing manifest.json. Pin the action if needed. This is a development unpacked extension, not a signed/store-distributed package. Browser or enterprise policy can restrict developer loading.

## Firefox sidebar extension (development)

Open about:debugging#/runtime/this-firefox, choose Load Temporary Add-on and select the firefox XPI (or manifest.json in its extracted folder). This is an unsigned temporary development extension. It is removed when Firefox restarts; repeat temporary loading to use it again. Normal signed-addon installation and Mozilla Add-ons distribution are not provided.

The compatibility targets are desktop Chromium 116+ and Firefox 128+ API floors. These are not a claim that all versions were tested. Native Firefox 157 temporary loading was observed; older Firefox handling of the newer no-data manifest metadata is unverified and produces validator compatibility advisories. Android/mobile browsers are not delivered. Read VERIFICATION.md for exact native limitations.

## Use either sidebar extension

1. Visit an ordinary top-level HTTP/HTTPS HTML/XHTML webpage and click the extension toolbar action. It opens the native sidebar and activates one centered Hello World overlay in that webpage. The overlay does not take focus, reflow the page or intercept pointer input.
2. Select red, blue or green in the sidebar. The associated webpage updates immediately when the command is processed. Controls show acknowledged page state; rapid choices converge to the latest choice. There is no Apply action.
3. The sidebar follows its own window's active tab. Switching tabs or opening a sidebar from its menu does not activate a page. Use the toolbar on each page that needs a message. Unactivated/restricted/unavailable pages show disabled controls and an explanation; the checked red placeholder is not actual page state.

Each activated document owns its session color. Switching away/back, closing/reopening the sidebar or background suspension preserves a still-loaded document. Repeated toolbar activation preserves its color. Full navigation, reload, cached-document return, tab closure or browser restart ends that session; explicit activation starts a new red session. Same-document history/hash navigation preserves state. Commands already dispatched retain their captured document; queued commands never migrate to a newly selected tab.

Internal/browser/extension/store/protected pages, file URLs, non-HTML documents/viewers, subframes and private/incognito sessions are unsupported. Browser restrictions take precedence over URL shape. Only temporary activeTab access and scripting are requested, plus Chromium sidePanel. No permanent host permission, storage, backend, Node.js or development server is required. Preferences are not persisted, and no data is collected/transmitted outside the browser.

## Verify the download

SHA256SUMS lists SHA-256 hashes of the actual archive and companion documents. Compare the downloaded file's hash before extracting. VERIFICATION.md identifies the source and the performed and excluded checks. Development builds may identify uncommitted source; published releases must be rebuilt from the clean release commit.
