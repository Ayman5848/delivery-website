// وصّلها PWA: تسجيل الـ Service Worker + زر التثبيت
(function () {
  // تسجيل الـ Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('PWA ready:', reg.scope))
        .catch((err) => console.log('SW failed:', err));
    });
  }

  // التعامل مع حدث التثبيت
  let deferredPrompt = null;
  const banner = document.getElementById('installBanner');
  const installBtn = document.getElementById('installBtn');
  const dismissBtn = document.getElementById('dismissInstall');

  // إخفاء البانر إذا كان التطبيق مثبتاً أصلاً
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (isStandalone && banner) banner.hidden = true;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (banner && !localStorage.getItem('pwa-dismissed')) banner.hidden = false;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (banner) banner.hidden = true;
    if (typeof toast === 'function') toast('تم تثبيت تطبيق وصّلها بنجاح 🎉');
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        // إرشاد يدوي لأجهزة iOS
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        if (typeof toast === 'function') {
          toast(isIOS ? 'على آيفون: اضغط مشاركة ثم أضف إلى الشاشة الرئيسية' : 'من متصفح كروم: القائمة ⋮ ثم تثبيت التطبيق', 'error');
        }
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (banner) banner.hidden = true;
    });
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      if (banner) banner.hidden = true;
      try { localStorage.setItem('pwa-dismissed', '1'); } catch (_) {}
    });
  }
})();
