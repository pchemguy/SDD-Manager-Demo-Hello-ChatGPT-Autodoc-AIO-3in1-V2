/** Native sidebar document entry, reusing the same controller and radio components. */
import { createSidebar } from './controller.js';
import { createNativeAdapter } from '../native-adapter.js';
const platform = typeof browser === 'undefined' ? 'chromium' : 'firefox';
const controller = createSidebar(document.querySelector('#settings'), createNativeAdapter(globalThis.browser ?? globalThis.chrome, platform));
window.addEventListener('pagehide', controller.dispose, { once: true });
