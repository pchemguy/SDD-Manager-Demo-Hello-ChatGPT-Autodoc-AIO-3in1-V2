/** Keep each sidebar bound to its own window and one acknowledged document nonce. */
import { mountColorControls } from '../../ui/color-controls.js';
import { request, validResponse, TIMEOUT_MS } from '../protocol.js';
export function createSidebar(root, adapter) {
  let disposed = false, generation = 0, windowId = null, currentTabId = null, binding = null;
  const status = root.ownerDocument.createElement('p');
  status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const controls = mountColorControls(root, { disabled: true, onChange: select }); root.append(status);
  const live = target => !disposed && binding === target && target.generation === generation;
  function unavailable(text = 'Unavailable. Use the toolbar on a supported webpage to activate.') {
    binding = null; controls.setState('red', true); status.textContent = text;
  }
  function bounded(promise) {
    let timer;
    return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error('Timeout')), TIMEOUT_MS); })]).finally(() => clearTimeout(timer));
  }
  async function exchange(tabId, message) {
    const response = await bounded(adapter.send(tabId, message));
    if (!validResponse(response, message.requestId) || !response.ok) throw Error('Unavailable response');
    return response;
  }
  function acknowledge(target, response) {
    target.color = response.color; controls.setState(target.color, false); status.textContent = 'Page connected.';
  }
  async function refresh() {
    const mine = ++generation;
    unavailable('Connecting to active page. Controls are not page state yet.');
    try {
      if (windowId === null) return;
      const tab = await bounded(adapter.getActiveTab(windowId));
      if (disposed || mine !== generation) return;
      currentTabId = tab?.id ?? null;
      if (!tab || tab.windowId !== windowId || tab.incognito || (tab.url && !/^https?:\/\//.test(tab.url))) { unavailable(); return; }
      const response = await exchange(tab.id, request('GET_STATE'));
      if (disposed || mine !== generation) return;
      binding = { windowId, tabId: tab.id, documentId: response.documentId, color: response.color, generation: mine, busy: false, queued: null };
      acknowledge(binding, response);
    } catch { if (!disposed && mine === generation) unavailable(); }
  }
  function select(color) {
    const target = binding; if (!target || !live(target)) return;
    target.queued = color; controls.setState(target.color, false); pump(target);
  }
  async function pump(target) {
    if (!live(target) || target.busy || target.queued === null) return;
    const color = target.queued; target.queued = null; target.busy = true;
    status.textContent = 'Applying color...';
    try {
      const response = await exchange(target.tabId, request('SET_COLOR', { documentId: target.documentId, color }));
      if (!live(target)) return;
      if (response.documentId !== target.documentId) throw Error('Document changed');
      acknowledge(target, response);
    } catch {
      if (!live(target)) return;
      target.queued = null; controls.setState(target.color, true);
      status.textContent = 'Checking page after interrupted update...';
      try {
        const response = await exchange(target.tabId, request('GET_STATE'));
        if (!live(target)) return;
        if (response.documentId !== target.documentId) { unavailable('Unavailable. Document changed; activate the new page with the toolbar.'); return; }
        acknowledge(target, response);
      } catch { if (live(target)) unavailable(); }
    } finally {
      if (live(target)) { target.busy = false; if (target.queued !== null) pump(target); }
    }
  }
  const unsubscribe = adapter.subscribe(event => {
    if (disposed || event.windowId !== windowId) return;
    if (event.type === 'activated') { refresh(); return; }
    if (event.tabId !== currentTabId) return;
    if (event.type === 'loading' || event.type === 'removed') {
      ++generation; unavailable('Unavailable. Page is navigating or closed; activate the new page with the toolbar.');
    } else if (event.type === 'complete' || event.type === 'activation') refresh();
  });
  const ready = (async () => {
    try { windowId = await bounded(adapter.getWindowId()); await refresh(); }
    catch { if (!disposed) unavailable('Unavailable. This sidebar could not resolve its own browser window.'); }
  })();
  return { ready, refresh, dispose() {
    disposed = true; ++generation; binding = null; unsubscribe(); controls.dispose(); status.remove();
  } };
}
