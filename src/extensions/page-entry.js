/** Injected classic-script entry; the default isolated world owns its singleton. */
import { activatePage } from './page.js';
activatePage(globalThis.browser ?? globalThis.chrome);
