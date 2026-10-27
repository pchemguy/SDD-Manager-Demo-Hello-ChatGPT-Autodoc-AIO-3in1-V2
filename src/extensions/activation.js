/** Open the native sidebar in the toolbar gesture, then activate only its captured tab. */
export function installActivation(adapter) {
  return adapter.onAction(tab => {
    if (!Number.isInteger(tab?.id) || !Number.isInteger(tab.windowId)) return;
    let opening;
    try { opening = adapter.openSidebar(tab); } catch { opening = Promise.reject(Error('Sidebar unavailable')); }
    let injection;
    if (!tab.incognito && /^https?:\/\//.test(tab.url || '')) {
      try { injection = adapter.activate(tab); } catch { injection = Promise.reject(Error('Injection unavailable')); }
    }
    return Promise.allSettled([opening, injection]).then(() => adapter.notify(tab)).catch(() => {});
  });
}
