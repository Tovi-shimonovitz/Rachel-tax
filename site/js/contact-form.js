// טופס יצירת הקשר: בדיקת שדות ושליחה למייל של רחל דרך Web3Forms
(function () {
  const form = document.querySelector('[data-contact-form]');
  const submitButton = form.querySelector('[data-submit]');
  const status = form.querySelector('[data-status]');
  const config = window.SITE_CONFIG;

  const REQUEST_TIMEOUT_MS = 15000;

  const validators = {
    name: function (value) {
      return value.length >= 2 ? '' : 'נא למלא שם מלא';
    },
    phone: function (value) {
      // מספר ישראלי, עם קידומת 0 או 972 ועם מקפים או רווחים לפי הרצון
      const digits = value.replace(/[\s()+-]/g, '').replace(/^972/, '0');
      return /^0\d{8,9}$/.test(digits) ? '' : 'נא למלא מספר טלפון תקין';
    },
    email: function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'נא למלא כתובת מייל תקינה';
    },
  };

  function validateField(name) {
    const input = form.elements[name];
    const error = validators[name](input.value.trim());

    document.getElementById(input.id + '-error').textContent = error;
    if (error) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
    return !error;
  }

  function validateForm() {
    const fieldNames = Object.keys(validators);
    const firstInvalid = fieldNames.filter(function (name) {
      return !validateField(name);
    })[0];

    if (firstInvalid) form.elements[firstInvalid].focus();
    return !firstInvalid;
  }

  function setStatus(state, text) {
    status.dataset.state = state;
    status.textContent = text;
  }

  function setSending(isSending) {
    submitButton.disabled = isSending;
    submitButton.textContent = isSending ? 'שולחים...' : 'שלחו לרחל';
  }

  function buildPayload() {
    const payload = {
      access_key: config.web3formsAccessKey,
      subject: config.emailSubject,
      from_name: config.emailFromName,
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
    };

    // Web3Forms חוסם פנייה רק אם השדה הזה קיים בה
    if (form.elements.botcheck.checked) payload.botcheck = true;
    return payload;
  }

  async function sendEmail(payload) {
    const response = await fetch(config.web3formsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message);
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    setStatus('', '');
    if (!validateForm()) return;

    const failureMessage = 'השליחה לא הצליחה. אפשר לנסות שוב או להתקשר ל-' + config.fallbackPhone;

    if (!config.web3formsAccessKey) {
      console.error('חסר מפתח Web3Forms בקובץ js/config.js');
      setStatus('error', failureMessage);
      return;
    }

    setSending(true);
    try {
      await sendEmail(buildPayload());
      form.reset();
      setStatus('success', 'הפרטים נשלחו. רחל תחזור אליכם בהקדם.');
    } catch (error) {
      console.error('שליחת הטופס נכשלה:', error);
      setStatus('error', failureMessage);
    } finally {
      setSending(false);
    }
  });

  // אחרי שגיאה, השדה נבדק מחדש כשהמבקר עוזב אותו
  Object.keys(validators).forEach(function (name) {
    form.elements[name].addEventListener('blur', function () {
      if (form.elements[name].hasAttribute('aria-invalid')) validateField(name);
    });
  });
})();
