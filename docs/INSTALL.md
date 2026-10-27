# Install and use Hello World

## Browser app

Extract the browser ZIP and upload all its files together to a static HTTP/HTTPS host. Open the deployed index.html. Relative asset URLs support deployment under a subdirectory. This is a deployable static application: users do not need Node.js, npm, a backend or a development server.

The message starts red. Select red, blue or green to change its color immediately. The settings panel is on the right in wide windows and below the message in narrow windows. Radio controls support standard keyboard arrows and Space, with visible focus. Reloading starts a new red session; separate app tabs are independent.

Keep index.html, app.js, style.css, build-info.json and LICENSE together. The archive is a browser deployment package, not an Electron installer or browser extension.

## Windows portable app

Extract the entire win32-x64 ZIP into a writable folder, then launch HelloWorld.exe. Keep the bundled libraries, locales and resources beside the executable. Windows 10/11 x64 is the upstream Electron 45 target; native launch has not been verified on the Linux build host. No separate Node.js installation, development server, backend or elevation is required. Moving the complete extracted folder preserves relative asset loading.

This is an unsigned development portable package, not a signed installer or Microsoft Store distribution. Windows may display an unknown-publisher/SmartScreen warning. The application starts red on every launch and does not save preferences. Closing its window ends the application.

## Verify the download

SHA256SUMS lists SHA-256 hashes of the actual archive and companion documents. Compare the downloaded file's hash before extracting. VERIFICATION.md identifies the source and the performed and excluded checks. Development builds may identify uncommitted source; published releases must be rebuilt from the clean release commit.
