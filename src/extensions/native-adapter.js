/** Thin Promise-based Chromium 116+/Firefox 128+ API boundary; no page state lives here. */
export function createNativeAdapter(api, platform) {
  return {
    onAction(handler) { api.action.onClicked.addListener(handler); return () => api.action.onClicked.removeListener(handler); },
    openSidebar(tab) { return platform === 'chromium' ? api.sidePanel.open({ windowId: tab.windowId }) : api.sidebarAction.open(); },
    activate(tab) { return api.scripting.executeScript({ target: { tabId: tab.id, frameIds: [0] }, world: 'ISOLATED', files: ['page.js'] }); },
    async notify(tab) { try { await api.runtime.sendMessage({ type: 'HELLO_ACTIVATED', tabId: tab.id, windowId: tab.windowId }); } catch { /* A closed sidebar needs no notification. */ } },
    async getWindowId() { const window = await api.windows.getCurrent(); if (window.incognito) throw Error('Private window unsupported'); return window.id; },
    async getActiveTab(windowId) { return (await api.tabs.query({ active: true, windowId }))[0]; },
    send(tabId, message) { return api.tabs.sendMessage(tabId, message, { frameId: 0 }); },
    subscribe(handler) {
      const activated = info => handler({ type: 'activated', ...info });
      const updated = (tabId, change, tab) => { if (change.status) handler({ type: change.status, tabId, windowId: tab.windowId }); };
      const removed = (tabId, info) => handler({ type: 'removed', tabId, windowId: info.windowId });
      const message = (value, sender) => {
        if (sender?.id === api.runtime.id && value?.type === 'HELLO_ACTIVATED' && Number.isInteger(value.tabId) && Number.isInteger(value.windowId)) {
          handler({ type: 'activation', tabId: value.tabId, windowId: value.windowId });
        }
        return false;
      };
      api.tabs.onActivated.addListener(activated); api.tabs.onUpdated.addListener(updated);
      api.tabs.onRemoved.addListener(removed); api.runtime.onMessage.addListener(message);
      return () => {
        api.tabs.onActivated.removeListener(activated); api.tabs.onUpdated.removeListener(updated);
        api.tabs.onRemoved.removeListener(removed); api.runtime.onMessage.removeListener(message);
      };
    }
  };
}
