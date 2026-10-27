/** Versioned, extension-only messages; validation never changes application state. */
import { isColor } from '../core/colors.js';
export const VERSION = 1;
export const TIMEOUT_MS = 2000;
const nonempty = value => typeof value === 'string' && value.length > 0;
export function validRequest(value) {
  return Boolean(value && value.v === VERSION && nonempty(value.requestId) && value.requestId.length <= 128 &&
    (value.type === 'GET_STATE' || (value.type === 'SET_COLOR' && nonempty(value.documentId) && isColor(value.color))));
}
export function validResponse(value, requestId) {
  return Boolean(value && value.v === VERSION && value.requestId === requestId &&
    (value.ok === true ? nonempty(value.documentId) && isColor(value.color) :
      value.ok === false && ['INVALID_MESSAGE', 'STALE_DOCUMENT', 'UNAVAILABLE'].includes(value.error)));
}
export function failure(request, error) {
  return { v: VERSION, requestId: typeof request?.requestId === 'string' && request.requestId.length <= 128 ? request.requestId : null, ok: false, error };
}
export function request(type, data = {}) {
  return { v: VERSION, requestId: crypto.randomUUID(), type, ...data };
}
