// כפתור "העתקת המייל", למבקרים שהלחיצה על המייל לא פותחת אצלם אפליקציית מייל
(function () {
  const RESET_AFTER_MS = 2500;

  // גיבוי לדפדפנים ישנים שאין בהם navigator.clipboard
  function legacyCopy(text) {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('copy failed');
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      legacyCopy(text);
    }
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    // הודעה לקוראי מסך. הכפתור עצמו מציג רק סמל
    const label = button.querySelector('[data-copy-label]');
    let resetTimer;

    function showResult(text, isCopied) {
      label.textContent = text;
      button.toggleAttribute('data-copied', isCopied);
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        label.textContent = '';
        button.removeAttribute('data-copied');
      }, RESET_AFTER_MS);
    }

    button.addEventListener('click', async function () {
      try {
        await copyText(button.dataset.copy);
        showResult('המייל הועתק', true);
      } catch (error) {
        console.error('העתקת המייל נכשלה:', error);
        showResult('לא הצלחנו להעתיק', false);
      }
    });

    // הכפתור מוסתר כברירת מחדל ומופיע רק כשה-JS פעיל
    button.hidden = false;
  });
})();
