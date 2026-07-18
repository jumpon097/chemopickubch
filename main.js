(() => {
  'use strict';

  const config = window.AYA_PWA_CONFIG || {};
  const frame = document.getElementById('ayaFrame');
  const loader = document.getElementById('loader');
  const frameError = document.getElementById('frameError');
  const installButton = document.getElementById('installButton');
  const directLink = document.getElementById('directLink');
  const errorDirectLink = document.getElementById('errorDirectLink');
  const connectionStatus = document.getElementById('connectionStatus');
  let deferredInstallPrompt = null;
  let loadTimer = null;

  function validGasUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'script.google.com' && /\/macros\/s\/.+\/exec$/.test(url.pathname);
    } catch (_) {
      return false;
    }
  }

  function setDirectLinks(url) {
    directLink.href = url;
    errorDirectLink.href = url;
  }

  function openGasApp() {
    const gasUrl = config.gasWebAppUrl;
    if (!validGasUrl(gasUrl)) {
      loader.hidden = true;
      frameError.hidden = false;
      frameError.querySelector('p').textContent = 'GAS Web App URL ใน config.js ไม่ถูกต้อง';
      return;
    }

    setDirectLinks(gasUrl);
    frame.src = gasUrl;
    loadTimer = window.setTimeout(() => {
      if (!loader.hidden) {
        loader.hidden = true;
        frameError.hidden = false;
      }
    }, Number(config.frameTimeoutMs) || 15000);
  }

  frame.addEventListener('load', () => {
    window.clearTimeout(loadTimer);
    loader.hidden = true;
    frameError.hidden = true;
  });

  document.getElementById('reloadButton').addEventListener('click', () => {
    if (!validGasUrl(config.gasWebAppUrl)) return;
    loader.hidden = false;
    frameError.hidden = true;
    const separator = config.gasWebAppUrl.includes('?') ? '&' : '?';
    frame.src = config.gasWebAppUrl + separator + 'pwaReload=' + Date.now();
  });

  function updateConnectionState() {
    const online = navigator.onLine;
    connectionStatus.textContent = online ? 'ออนไลน์' : 'ออฟไลน์';
    connectionStatus.classList.toggle('online', online);
    connectionStatus.classList.toggle('offline', !online);
    if (!online) {
      loader.hidden = true;
      frameError.hidden = false;
      frameError.querySelector('h1').textContent = 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต';
      frameError.querySelector('p').textContent = 'ระบบรับ–คืนยาต้องออนไลน์ กรุณาตรวจสอบ Wi‑Fi หรือเครือข่ายมือถือ';
    } else if (frameError.querySelector('h1').textContent === 'ไม่มีการเชื่อมต่ออินเทอร์เน็ต') {
      frameError.querySelector('h1').textContent = 'เปิดระบบในกรอบไม่สำเร็จ';
      frameError.querySelector('p').textContent = 'กดรีเฟรช หรือเปิด GAS Web App โดยตรง';
      frameError.hidden = true;
      frame.src = config.gasWebAppUrl;
    }
  }

  window.addEventListener('online', updateConnectionState);
  window.addEventListener('offline', updateConnectionState);

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installButton.hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installButton.hidden = true;
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(error => {
        console.warn('Service worker registration failed', error);
      });
    });
  }

  updateConnectionState();
  openGasApp();
})();
