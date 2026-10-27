/** Evaluate the public model in its real Node module context. */
import { createColorModel } from '../../src/core/colors.js';
const model = createColorModel();
const initial = model.color ?? null;
const colors = [];
for (const color of ['blue', 'green', 'red']) { model.select?.(color); colors.push(model.color ?? null); }
const invalidAccepted = model.select?.('purple') ?? null;
console.log(JSON.stringify({ initial, colors, invalidAccepted, afterInvalid: model.color ?? null, fresh: createColorModel().color ?? null }));
