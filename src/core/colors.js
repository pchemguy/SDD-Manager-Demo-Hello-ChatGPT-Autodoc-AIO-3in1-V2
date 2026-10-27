/** Canonical, document-local color state with no platform or DOM dependency. */
export const COLORS = Object.freeze(['red', 'blue', 'green']);
export const isColor = value => COLORS.includes(value);
export function createColorModel() {
  let color = 'red';
  return {
    get color() { return color; },
    select(value) {
      if (!isColor(value)) return false;
      color = value;
      return true;
    },
  };
}
