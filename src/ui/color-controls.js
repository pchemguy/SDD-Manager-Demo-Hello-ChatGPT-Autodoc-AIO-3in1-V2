/** Native exclusive radios shared by app composition and extension sidebars. */
import { COLORS, isColor } from '../core/colors.js';
export function mountColorControls(root, { color = 'red', onChange, onReselect, disabled = false } = {}) {
  const doc = root.ownerDocument;
  const group = doc.createElement('fieldset');
  group.className = 'hello-colors';
  const legend = doc.createElement('legend'); legend.textContent = 'Text color'; group.append(legend);
  const radios = COLORS.map(value => {
    const label = doc.createElement('label'); label.style.display = 'block';
    const input = doc.createElement('input'); input.type = 'radio'; input.name = 'hello-color'; input.value = value;
    label.append(input, doc.createTextNode(value)); group.append(label);
    return input;
  });
  let renderedColor = color;
  // A checked radio emits no change event; preserve an explicit latest choice while pending.
  const click = event => {
    if (!group.disabled && radios.includes(event.target) && event.target.value === renderedColor) onReselect?.(renderedColor);
  };
  group.addEventListener('click', click);
  const change = event => { if (event.target.checked && !group.disabled) onChange?.(event.target.value); };
  group.addEventListener('change', change); root.append(group);
  function setState(nextColor, unavailable = false) {
    if (!isColor(nextColor)) return false;
    renderedColor = nextColor;
    for (const radio of radios) radio.checked = radio.value === nextColor;
    group.disabled = unavailable;
    return true;
  }
  setState(color, disabled);
  return { element: group, setState, dispose() { group.removeEventListener('change', change); group.removeEventListener('click', click); group.remove(); } };
}
