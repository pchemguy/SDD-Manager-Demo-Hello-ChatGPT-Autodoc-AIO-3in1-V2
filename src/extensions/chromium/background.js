/** Chromium service-worker entry; toolbar activation has no durable background state. */
import { installActivation } from '../activation.js';
import { createNativeAdapter } from '../native-adapter.js';
installActivation(createNativeAdapter(chrome, 'chromium'));
