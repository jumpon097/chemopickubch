(() => {
  'use strict';

  let installPrompt = null;
  const installButton = document.getElementById('installPwaButton');

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    installButton.hidden = true;
  });

  window.addEventListener('offline', () => {
    if (typeof showToast === 'function') {
      showToast('อุปกรณ์ออฟไลน์ ระบบจะไม่บันทึกรายการจนกว่าจะเชื่อมต่ออินเทอร์เน็ต', 'error', 8000);
    }
  });

  window.addEventListener('online', () => {
    if (typeof showToast === 'function') showToast('กลับมาออนไลน์แล้ว', 'success');
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(error => {
        console.warn('Service worker registration failed', error);
      });
    });
  }
})();
