// وصّلها - تفاعلات الموقع
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// القائمة الجوال
const menuBtn = $('#menuBtn'), navMenu = $('#navMenu');
menuBtn.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
$$('#navMenu a').forEach(a => a.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

// ظل الهيدر + زر الصعود
const header = $('#header'), toTop = $('#toTop');
window.addEventListener('scroll', () => {
  header.classList.toggle('shadow', scrollY > 10);
  toTop.classList.toggle('show', scrollY > 600);
});
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

// عدّادات
const counters = $$('[data-count]');
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, target = +el.dataset.count;
  const t0 = performance.now(), dur = 1500;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en');
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
  io.unobserve(el);
}), { threshold: .5 });
counters.forEach(c => io.observe(c));

// حاسبة السعر
let basePrice = 12;
const dist = $('#distance'), distVal = $('#distVal'), priceOut = $('#priceOut'), timeOut = $('#timeOut');
function calcPrice() {
  const d = +dist.value;
  distVal.textContent = d;
  const price = Math.round(basePrice + Math.max(0, d - 3) * 1.5);
  priceOut.textContent = price;
  timeOut.textContent = d <= 5 ? '25-35' : d <= 12 ? '35-50' : '50-70';
}
dist.addEventListener('input', calcPrice);
$$('#typeChips .chip').forEach(ch => ch.addEventListener('click', () => {
  $$('#typeChips .chip').forEach(c => c.classList.remove('active'));
  ch.classList.add('active');
  basePrice = +ch.dataset.price;
  calcPrice();
}));
calcPrice();

// توست
function toast(msg, type = 'success') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 3200);
}

// تأكيد الطلب
$('#orderBtn').addEventListener('click', () => {
  const phone = $('#phoneInput').value.trim();
  if (!/^05\d{8}$/.test(phone)) return toast('فضلاً أدخل رقم جوال سعودي صحيح يبدأ بـ 05 (10 أرقام)', 'error');
  const num = 'WS-' + Math.floor(10000 + Math.random() * 90000);
  toast(`تم استلام طلبك بنجاح! رقم التتبع: ${num} — المندوب في الطريق إليك 🛵`);
  $('#trackInput').value = num;
  $('#phoneInput').value = '';
});

// تتبع وهمي
const stages = ['تم استلام طلبك ✅', 'المندوب استلم الطلب 🛵', 'الطلب في الطريق إليك 📍', 'تم التوصيل بنجاح 🎉'];
$('#trackBtn').addEventListener('click', () => {
  const v = $('#trackInput').value.trim(), box = $('#trackResult');
  if (!v) { box.className = 'track-result err'; box.textContent = 'أدخل رقم التتبع أولاً'; return; }
  const i = Math.floor(Math.random() * stages.length);
  box.className = 'track-result ok';
  box.textContent = `الشحنة ${v}: ${stages[i]} — الوصول المتوقع خلال ${10 + i * 8} دقيقة`;
});

// نسخ الكوبون
$('#copyCoupon').addEventListener('click', (e) => {
  e.stopPropagation();
  navigator.clipboard?.writeText('AHLAN50').then(() => toast('تم نسخ كود الخصم: AHLAN50 🎉'));
});

// حاسبة أرباح المناديب
const oR = $('#ordersRange');
oR.addEventListener('input', () => {
  const n = +oR.value;
  $('#ordersVal').textContent = n;
  $('#earnOut').textContent = (n * 15 * 30).toLocaleString('en');
});
$('#earnOut').textContent = (15 * 15 * 30).toLocaleString('en');

// الأسئلة الشائعة
$$('.faq-item button').forEach(b => b.addEventListener('click', () => {
  const item = b.parentElement, wasOpen = item.classList.contains('open');
  $$('.faq-item').forEach(f => f.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}));

// سلايدر العملاء (نقاط للجوال)
const slider = $('#slider'), dotsBox = $('#sliderDots');
if (slider && dotsBox) {
  const cards = slider.children.length;
  for (let i = 0; i < cards; i++) {
    const d = document.createElement('span');
    if (i === 0) d.classList.add('active');
    d.addEventListener('click', () => slider.children[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }));
    dotsBox.appendChild(d);
  }
  slider.addEventListener('scroll', () => {
    const i = Math.round(slider.scrollLeft / (slider.children[0].offsetWidth + 16));
    // RTL: scrollLeft سالب في بعض المتصفحات
    const idx = Math.abs(i);
    dotsBox.querySelectorAll('span').forEach((d, j) => d.classList.toggle('active', j === Math.min(idx, cards - 1)));
  });
}

// نموذج التواصل
$('#contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#cName').value.trim(), phone = $('#cPhone').value.trim(), msg = $('#cMsg').value.trim();
  if (name.length < 2) return toast('فضلاً أدخل الاسم', 'error');
  if (!/^05\d{8}$/.test(phone)) return toast('رقم الجوال غير صحيح', 'error');
  if (msg.length < 5) return toast('فضلاً اكتب رسالتك', 'error');
  toast(`شكراً ${name}! وصلتنا رسالتك وسنتواصل معك قريباً 💚`);
  e.target.reset();
});

// تمييز القسم النشط
const sections = ['home', 'services', 'how', 'pricing', 'cities', 'contact'];
window.addEventListener('scroll', () => {
  let cur = 'home';
  sections.forEach(id => { const s = document.getElementById(id); if (s && scrollY >= s.offsetTop - 160) cur = id; });
  $$('#navMenu a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  $$('.mobile-bar a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur || (cur === 'home' && a.getAttribute('href') === '#home')));
});
