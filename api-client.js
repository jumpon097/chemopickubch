(() => {
  'use strict';

  const config = window.AYA_APP_CONFIG || {};

  function validApiUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.pathname.replace(/\/$/, '').endsWith('/api') &&
        !/YOUR_|REPLACE_|example/i.test(value);
    } catch (_) {
      return false;
    }
  }

  async function call(action, payload) {
    if (!validApiUrl(config.apiUrl)) {
      throw new Error('ยังไม่ได้ตั้ง Worker API URL ในไฟล์ config.js');
    }
    if (!navigator.onLine) {
      throw new Error('อุปกรณ์ออฟไลน์ ระบบรับ–คืนยาต้องเชื่อมต่ออินเทอร์เน็ต');
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      Number(config.apiTimeoutMs) || 60000
    );

    let response;
    try {
      response = await fetch(config.apiUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({action, payload: typeof payload === 'undefined' ? null : payload}),
        signal: controller.signal
      });
    } catch (error) {
      if (error && error.name === 'AbortError') {
        throw new Error('ระบบตอบสนองช้าเกินกำหนด กรุณาตรวจสอบเครือข่ายแล้วลองใหม่');
      }
      throw new Error('เชื่อมต่อ AYA API ไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตหรือ Worker');
    } finally {
      window.clearTimeout(timeout);
    }

    let body;
    try {
      body = await response.json();
    } catch (_) {
      throw new Error('AYA API ส่งข้อมูลกลับมาในรูปแบบที่อ่านไม่ได้');
    }

    if (!response.ok || !body.ok) {
      const message = body && body.error && body.error.message
        ? body.error.message
        : 'AYA API ทำรายการไม่สำเร็จ';
      throw new Error(message + (body.requestId ? ' [' + body.requestId + ']' : ''));
    }
    return body.data;
  }

  window.AyaApi = Object.freeze({call});
})();
