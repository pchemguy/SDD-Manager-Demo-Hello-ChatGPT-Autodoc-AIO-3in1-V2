/** Compose one in-memory model with shared message and radio views. */
import { createColorModel } from '../core/colors.js';
import { mountMessage } from '../ui/message.js';
import { mountColorControls } from '../ui/color-controls.js';
export function mountApplication(root) {
  const doc = root.ownerDocument;
  const app = doc.createElement('div'); app.className = 'hello-app';
  const main = doc.createElement('main'); main.className = 'hello-main'; main.setAttribute('aria-label', 'Main panel');
  const settings = doc.createElement('aside'); settings.className = 'hello-settings'; settings.setAttribute('aria-label', 'Settings');
  app.append(main, settings); root.append(app);
  const model = createColorModel();
  const message = mountMessage(main, model.color);
  const controls = mountColorControls(settings, { color: model.color, onChange(color) {
    if (model.select(color)) { message.setColor(model.color); controls.setState(model.color); }
  } });
  return { dispose() { controls.dispose(); message.dispose(); app.remove(); } };
}
mountApplication(document.body);
