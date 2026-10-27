# Install and use Hello World

## Browser app

Extract the browser ZIP and upload all its files together to a static HTTP/HTTPS host. Open the deployed index.html. Relative asset URLs support deployment under a subdirectory. This is a deployable static application: users do not need Node.js, npm, a backend or a development server.

The message starts red. Select red, blue or green to change its color immediately. The settings panel is on the right in wide windows and below the message in narrow windows. Radio controls support standard keyboard arrows and Space, with visible focus. Reloading starts a new red session; separate app tabs are independent.

Keep index.html, app.js, style.css, build-info.json and LICENSE together. The archive is a browser deployment package, not an Electron installer or browser extension.

## Verify the download

SHA256SUMS lists SHA-256 hashes of the actual archive and companion documents. Compare the downloaded file's hash before extracting. VERIFICATION.md identifies the source and the performed and excluded checks. Development builds may identify uncommitted source; published releases must be rebuilt from the clean release commit.
