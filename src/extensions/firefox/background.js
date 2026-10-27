/** Firefox nonpersistent background entry; loaded documents own every color session. */
import { installActivation } from '../activation.js';
import { createNativeAdapter } from '../native-adapter.js';
installActivation(createNativeAdapter(browser, 'firefox'));
