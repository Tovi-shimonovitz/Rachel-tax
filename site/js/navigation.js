// תפריט המובייל, הופעת הלוגו הקטן בכותרת, וסרגל הפעולה התחתון
(function () {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const heroLogo = document.querySelector('[data-hero-logo]');
  const mobileBar = document.querySelector('[data-mobile-bar]');
  const contactSection = document.querySelector('#contact');

  function setMenuOpen(isOpen) {
    menu.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'סגירת תפריט' : 'פתיחת תפריט');
  }

  toggle.addEventListener('click', function () {
    setMenuOpen(!menu.classList.contains('is-open'));
  });

  // לחיצה על קישור סוגרת את התפריט
  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenuOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  // הלוגו הקטן נכנס לכותרת כשהלוגו הגדול יוצא מהמסך
  new IntersectionObserver(function (entries) {
    header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
  }, { rootMargin: '-72px 0px 0px 0px' }).observe(heroLogo);

  // באזור יצירת הקשר הסרגל כבר לא נחוץ ומסתיר את הטופס
  new IntersectionObserver(function (entries) {
    mobileBar.classList.toggle('is-hidden', entries[0].isIntersecting);
  }).observe(contactSection);
})();
