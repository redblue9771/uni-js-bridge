import { webView } from "@dcloudio/uni-webview-js";

window.UniBridgeReady = false;

const UniBridgeWebViewAPIs = [
  "navigateTo",
  "getEnv",
  "redirectTo",
  "switchTab",
  "reLaunch",
];

const UniBridgeSyncAPIs = [
  "navigateBack",
  "href",
  "setBadgeNumber",
  "previewImage",
  "openDocument",
  "downloadFile",
  "setNavBarStyle",
  "resetNavBarButtons",
  "setNavBarButtons",
  "resetNavBarStyles",
];

const UniBridgeAsyncAPIs = [
  "getAppInfo",
  "openLabelPrinter",
  "scanCode",
  "getLocation",
  "chooseLocation",
  "getNavBarStyle",
];

const showFnList = {};
const hideFnList = {};

const UniBridge = {
  __version: "1.0.0",
  eventManager: document.createElement("div"),
  receiveResult(dataObj = {}) {
    if (dataObj.eventId) {
      const event = new CustomEvent(dataObj.eventId, {
        detail: dataObj,
      });
      this.eventManager.dispatchEvent(event);
    } else {
      throw new Error(`没有找到对应的API实例!`);
    }
  },
  onNavBarButtonTap() {},
  tapMenu() {},
  onShow() {
    for (const eventId in showFnList) {
      showFnList[eventId]();
    }
  },
  onHide() {
    for (const eventId in hideFnList) {
      hideFnList[eventId]();
    }
  },
  addShowListener(fn) {
    const eventId = new Date().getTime();
    showFnList[eventId] = fn;
    return eventId;
  },
  removeShowListener(eventId) {
    delete showFnList[eventId];
  },
  addHideListener(fn) {
    const eventId = new Date().getTime();
    hideFnList[eventId] = fn;
    return eventId;
  },
  removeHideListener(eventId) {
    delete hideFnList[eventId];
  },
  APIReady() {
    window.UniBridgeReady = true;
    const event = new CustomEvent("UniBridgeReady", {
      detail: {},
      bubbles: true,
    });
    document.dispatchEvent(event);
  },
};

UniBridgeWebViewAPIs.forEach((property) => {
  UniBridge[property] = webView[property];
});

UniBridgeSyncAPIs.forEach((property) => {
  UniBridge[property] = function (config) {
    const eventId = property + Date.now();
    webView.postMessage({
      data: {
        eventId,
        action: property,
        payload: config,
      },
    });
  };
});

UniBridgeAsyncAPIs.forEach((property) => {
  UniBridge[property] = function (config) {
    return new Promise((resolve, reject) => {
      const eventId = property + Date.now();
      const handleResult = (e) => {
        this.eventManager.removeEventListener(eventId, handleResult);
        const {
          eventId: currEventId,
          message,
          code: currCode,
          payload: currPayload,
        } = e.detail;
        if (currEventId !== eventId) {
          reject(new Error("系统错误"));
        }
        resolve({
          message,
          code: currCode,
          payload: currPayload,
        });
      };

      this.eventManager.addEventListener(eventId, handleResult);
      const handlePostMessageToApp = () => {
        webView.postMessage({
          data: {
            eventId,
            action: property,
            payload: config,
          },
        });
      };

      if (window.UniBridgeReady) {
        handlePostMessageToApp();
      } else {
        document.addEventListener("UniBridgeReady", handlePostMessageToApp);
      }
    });
  };
});

function initUniBridge() {
  try {
    webView.postMessage({
      data: {
        eventId: "ready-" + Date.now(),
        action: "initUniBridgeFinished",
        payload: {},
      },
    });
  } catch (e) {
    console.error(e);
    //TODO handle the exception
  }
}

window.UniBridge = UniBridge;

document.addEventListener("UniAppJSBridgeReady", initUniBridge);
