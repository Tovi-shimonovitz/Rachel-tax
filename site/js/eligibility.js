// הבדיקה המהירה: סופרת סימונים ומציירת את הגרף בהתאם.
// הכול נשאר בדפדפן של המבקר. שום מידע מכאן לא נשלח לשום מקום.
(function () {
  const options = document.querySelector('[data-eligibility]');
  const result = document.querySelector('[data-eligibility-result]');
  const count = document.querySelector('[data-eligibility-count]');
  const message = document.querySelector('[data-eligibility-message]');
  const chart = result.querySelector('.check__chart');

  // כמה סימונים מציירים את הגרף עד הסוף
  const FULL_CHART_AT = 5;

  function getMessage(checkedCount) {
    if (checkedCount === 0) return 'סמנו את מה שקרה לכם ונראה אם שווה לבדוק.';
    if (checkedCount === 1) return 'יש כאן סיבה לבדוק. לפעמים אירוע אחד מספיק.';
    if (checkedCount < 4) return 'זה כבר נראה מעניין. שווה לעבור על השנים האלה.';
    return 'סימנתם לא מעט. כדאי מאוד לבדוק את התיק שלכם.';
  }

  function update() {
    const checkedCount = options.querySelectorAll('input:checked').length;
    const progress = Math.min(checkedCount / FULL_CHART_AT, 1) * 100;

    count.textContent = checkedCount;
    message.textContent = getMessage(checkedCount);
    chart.style.setProperty('--progress', progress + '%');
  }

  options.addEventListener('change', update);
  update();
})();
