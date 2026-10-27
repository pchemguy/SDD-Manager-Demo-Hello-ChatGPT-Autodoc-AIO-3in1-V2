/** Own one activated top-level document session in the extension's isolated world. */
import { createColorModel } from '../core/colors.js';
import { mountMessage } from '../ui/message.js';
import { validRequest, failure, VERSION } from './protocol.js';
const KEY = '__helloWorldPageV1';
export function activatePage(runtime, doc = document) {
  const win = doc.defaultView;
  if (win.top !== win || !/^https?:$/.test(win.location.protocol) ||
      !['text/html', 'application/xhtml+xml'].includes(doc.contentType)) return null;
  if (win[KEY]) return win[KEY];
  const model = createColorModel();
  const documentId = Array.from(crypto.getRandomValues(new Uint32Array(4)), x => x.toString(16).padStart(8, '0')).join('');
  const host = doc.createElement('div');
  host.dataset.helloWorldOverlay = '';
  host.style.cssText = 'all:initial!important;position:fixed!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;z-index:2147483647!important;pointer-events:none!important;display:block!important;max-width:calc(100vw - 24px)!important;';
  const shadow = host.attachShadow({ mode: 'open' });
  const style = doc.createElement('style');
  style.textContent = ':host{pointer-events:none}p{margin:0;padding:20px 28px;background:white;border:1px solid #ccd3df;border-radius:12px;box-shadow:0 4px 20px #0002;font:700 36px/1.3 system-ui,sans-serif;white-space:nowrap}';
  shadow.append(style);
  const message = mountMessage(shadow);
  doc.documentElement.append(host);
  const state = req => ({ v: VERSION, requestId: req.requestId, ok: true, documentId, color: model.color });
  const listener = (req, sender, respond) => {
    if (sender?.id !== runtime.id || !validRequest(req)) { respond(failure(req, 'INVALID_MESSAGE')); return false; }
    if (req.type === 'SET_COLOR') {
      if (req.documentId !== documentId) { respond(failure(req, 'STALE_DOCUMENT')); return false; }
      model.select(req.color); message.setColor(model.color);
    }
    respond(state(req)); return false;
  };
  const controller = { dispose() {
    runtime.onMessage.removeListener(listener); win.removeEventListener('pagehide', controller.dispose);
    message.dispose(); host.remove(); delete win[KEY];
  } };
  runtime.onMessage.addListener(listener);
  win.addEventListener('pagehide', controller.dispose);
  win[KEY] = controller;
  return controller;
}
