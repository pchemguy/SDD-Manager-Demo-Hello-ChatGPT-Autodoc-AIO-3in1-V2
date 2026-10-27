/** Mount the reusable exact message without taking ownership of its container. */
import { isColor } from '../core/colors.js';
export function mountMessage(root, initialColor = 'red') {
  const element = root.ownerDocument.createElement('p');
  element.className = 'hello-message';
  element.dataset.helloMessage = '';
  element.textContent = 'Hello World';
  root.append(element);
  const setColor = color => {
    if (!isColor(color)) return false;
    element.style.color = color;
    return true;
  };
  setColor(initialColor);
  return { element, setColor, dispose: () => element.remove() };
}
