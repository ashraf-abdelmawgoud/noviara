/**
 * NOVIARA - Consultation Booking Form Handler
 * Robust Vanilla JS form validation with dynamic multilingual messages,
 * state management, and modular API endpoint integration readiness.
 */

(function () {
  'use strict';

  const form = document.getElementById('consultation-form');
  const formSuccessBox = document.getElementById('form-success-box');
  const submitBtn = document.getElementById('submit-consult-btn');
  const resetBtn = document.getElementById('reset-form-btn');

  if (!form) return;

  // Helper to fetch translated string
  function t(key, fallback) {
    if (window.NoviaraI18n && typeof window.NoviaraI18n.t === 'function') {
      return window.NoviaraI18n.t(key, fallback);
    }
    return fallback;
  }

  // Prepopulate solution if query parameter is provided (Solution #2)
  const urlParams = new URLSearchParams(window.location.search);
  const solutionParam = urlParams.get('solution');
  if (solutionParam) {
    const solutionSelect = document.getElementById('solutionType');
    if (solutionSelect) {
      const cleanParam = decodeURIComponent(solutionParam).trim().toLowerCase();
      let matchedIndex = -1;

      // 1. Direct value exact match
      for (let i = 0; i < solutionSelect.options.length; i++) {
        const optVal = solutionSelect.options[i].value.toLowerCase();
        if (optVal && (optVal === cleanParam || cleanParam.includes(optVal) || optVal.includes(cleanParam))) {
          matchedIndex = i;
          break;
        }
      }

      // 2. Fuzzy text fallback match
      if (matchedIndex === -1) {
        for (let i = 0; i < solutionSelect.options.length; i++) {
          const optText = solutionSelect.options[i].text.toLowerCase();
          if (optText.includes(cleanParam) || cleanParam.includes(optText)) {
            matchedIndex = i;
            break;
          }
        }
      }

      if (matchedIndex !== -1) {
        solutionSelect.selectedIndex = matchedIndex;
      }
    }
  }

  // --- Validation Rules & Message Providers ---
  const validators = {
    fullName: {
      validate: (val) => val.trim().length >= 3,
      getErrorMsg: () => t('form_name_error', 'يرجى إدخال اسمك الكامل بشكل صحيح (3 أحرف على الأقل).')
    },
    email: {
      validate: (val) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(val.trim());
      },
      getErrorMsg: () => t('form_email_error', 'يرجى إدخال بريد إلكتروني صحيح (مثال: name@company.com).')
    },
    phone: {
      validate: (val) => {
        // Accepts international formats, arab gulf formats (+966, 05, +20, etc.)
        const cleaned = val.replace(/[\s\-\(\)]/g, '');
        return /^[+]?[0-9]{8,16}$/.test(cleaned);
      },
      getErrorMsg: () => t('form_phone_error', 'يرجى إدخال رقم هاتف صحيح مع مفتاح الدولة أو كود الاتصال.')
    },
    projectDetails: {
      validate: (val) => val.trim().length >= 10,
      getErrorMsg: () => t('form_details_error', 'يرجى كتابة تفاصيل مشروعك (على الأقل 10 أحرف).')
    },
    termsAgreement: {
      validate: (el) => el.checked,
      getErrorMsg: () => t('form_terms_error', 'يرجى الموافقة على شروط التواصل للمتابعة.')
    }
  };

  // Helper to show/hide errors
  function setFieldError(fieldId, errorMsg) {
    const group = document.querySelector(`[data-field="${fieldId}"]`);
    if (!group) return;

    const input = group.querySelector('input, textarea, select');
    const errorEl = group.querySelector('.form-error-msg');

    group.classList.add('has-error');
    if (input) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
    if (errorEl) {
      errorEl.textContent = errorMsg;
    }
  }

  function clearFieldError(fieldId) {
    const group = document.querySelector(`[data-field="${fieldId}"]`);
    if (!group) return;

    const input = group.querySelector('input, textarea, select');
    group.classList.remove('has-error');
    if (input) {
      input.classList.remove('is-invalid');
      if (input.value.trim().length > 0) {
        input.classList.add('is-valid');
      }
    }
  }

  // Live input validation on blur & input
  const fieldsToValidate = ['fullName', 'email', 'phone', 'projectDetails'];
  fieldsToValidate.forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    if (!input) return;

    input.addEventListener('input', () => {
      const validator = validators[fieldId];
      if (validator && validator.validate(input.value)) {
        clearFieldError(fieldId);
      }
    });

    input.addEventListener('blur', () => {
      const validator = validators[fieldId];
      if (validator && !validator.validate(input.value)) {
        setFieldError(fieldId, validator.getErrorMsg());
      } else {
        clearFieldError(fieldId);
      }
    });
  });

  const termsCheck = document.getElementById('termsAgreement');
  if (termsCheck) {
    termsCheck.addEventListener('change', () => {
      if (termsCheck.checked) {
        clearFieldError('termsAgreement');
      } else {
        setFieldError('termsAgreement', validators.termsAgreement.getErrorMsg());
      }
    });
  }

  // --- Form Submission Handler ---
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    let hasErrors = false;
    let firstInvalidInput = null;

    // 1. Validate Full Name
    const nameInput = document.getElementById('fullName');
    if (!validators.fullName.validate(nameInput.value)) {
      setFieldError('fullName', validators.fullName.getErrorMsg());
      hasErrors = true;
      if (!firstInvalidInput) firstInvalidInput = nameInput;
    } else {
      clearFieldError('fullName');
    }

    // 2. Validate Email
    const emailInput = document.getElementById('email');
    if (!validators.email.validate(emailInput.value)) {
      setFieldError('email', validators.email.getErrorMsg());
      hasErrors = true;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    } else {
      clearFieldError('email');
    }

    // 3. Validate Phone
    const phoneInput = document.getElementById('phone');
    if (!validators.phone.validate(phoneInput.value)) {
      setFieldError('phone', validators.phone.getErrorMsg());
      hasErrors = true;
      if (!firstInvalidInput) firstInvalidInput = phoneInput;
    } else {
      clearFieldError('phone');
    }

    // 4. Validate Project Details
    const detailsInput = document.getElementById('projectDetails');
    if (!validators.projectDetails.validate(detailsInput.value)) {
      setFieldError('projectDetails', validators.projectDetails.getErrorMsg());
      hasErrors = true;
      if (!firstInvalidInput) firstInvalidInput = detailsInput;
    } else {
      clearFieldError('projectDetails');
    }

    // 5. Validate Terms Checkbox
    if (!termsCheck.checked) {
      setFieldError('termsAgreement', validators.termsAgreement.getErrorMsg());
      hasErrors = true;
      if (!firstInvalidInput) firstInvalidInput = termsCheck;
    } else {
      clearFieldError('termsAgreement');
    }

    if (hasErrors) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Prepare payload
    const formData = {
      fullName: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      companyName: document.getElementById('companyName')?.value.trim() || '',
      businessType: document.getElementById('businessType')?.value.trim() || '',
      solutionType: document.getElementById('solutionType')?.value || '',
      projectDetails: detailsInput.value.trim(),
      termsAgreed: termsCheck.checked,
      submittedAt: new Date().toISOString()
    };

    // Button loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span style="display:inline-block; animation: spin-clockwise 1s linear infinite; margin-inline-end: 8px;">⟳</span>
      ${t('form_submitting_btn', 'جاري معالجة الطلب...')}
    `;

    try {
      // Simulated processing latency (ready for fetch API)
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Generate realistic reference ID
      const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
      const referenceCode = `NOV-2026-${randomTicketNum}`;
      formData.referenceCode = referenceCode;

      const refCodeEl = document.getElementById('ticket-ref-code');
      if (refCodeEl) {
        refCodeEl.textContent = referenceCode;
      }

      // 1. Save lead to localStorage as resilient backup (Solution #5)
      try {
        const existingLeads = JSON.parse(localStorage.getItem('noviara_consultation_leads') || '[]');
        existingLeads.unshift(formData);
        localStorage.setItem('noviara_consultation_leads', JSON.stringify(existingLeads.slice(0, 50)));
        sessionStorage.setItem('noviara_last_ticket', referenceCode);
      } catch (storageErr) {
        console.warn('[Noviara Form] LocalStorage backup warning:', storageErr);
      }

      // 2. Configure instant WhatsApp confirmation button (Solution #5)
      const whatsappBtn = document.getElementById('whatsapp-confirm-btn');
      if (whatsappBtn) {
        const selectedSolutionText = document.getElementById('solutionType')?.selectedOptions[0]?.text || formData.solutionType;
        const isEn = (window.NoviaraI18n && window.NoviaraI18n.getLanguage() === 'en');

        const waText = isEn 
          ? `Hello Noviara,\nI just submitted a consultation request on noviara.dev.\n*Ticket:* ${referenceCode}\n*Name:* ${formData.fullName}\n*Solution:* ${selectedSolutionText}\n*Details:* ${formData.projectDetails}`
          : `مرحباً فريق Noviara،\nقمت للتو بطلب استشارة عبر الموقع.\n*رقم التذكرة:* ${referenceCode}\n*الاسم:* ${formData.fullName}\n*الحل المطلوب:* ${selectedSolutionText}\n*تفاصيل المشروع:* ${formData.projectDetails}`;

        whatsappBtn.href = `https://wa.me/966500000000?text=${encodeURIComponent(waText)}`;
      }

      // Hide form & show success view
      form.style.display = 'none';
      if (formSuccessBox) {
        formSuccessBox.style.display = 'block';
        formSuccessBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      console.info('[Noviara Consultation Form] Payload processed & backed up successfully:', formData);
    } catch (error) {
      console.error('[Noviara Consultation Form] Submission error:', error);
      alert(t('form_error_alert', 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى أو مراسلتنا على hello@noviara.dev'));
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  // Handle "إرسال طلب استشارة آخر"
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      // Clear all validity classes
      document.querySelectorAll('.form-control').forEach((ctrl) => {
        ctrl.classList.remove('is-valid', 'is-invalid');
      });
      document.querySelectorAll('.form-group').forEach((grp) => {
        grp.classList.remove('has-error');
      });

      if (formSuccessBox) formSuccessBox.style.display = 'none';
      form.style.display = 'block';
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Refresh error messages on language change
  window.addEventListener('languageChanged', () => {
    fieldsToValidate.forEach((fieldId) => {
      const group = document.querySelector(`[data-field="${fieldId}"]`);
      if (group && group.classList.contains('has-error')) {
        const validator = validators[fieldId];
        const errorEl = group.querySelector('.form-error-msg');
        if (validator && errorEl) {
          errorEl.textContent = validator.getErrorMsg();
        }
      }
    });
    const termsGroup = document.querySelector('[data-field="termsAgreement"]');
    if (termsGroup && termsGroup.classList.contains('has-error')) {
      const errorEl = termsGroup.querySelector('.form-error-msg');
      if (errorEl) {
        errorEl.textContent = validators.termsAgreement.getErrorMsg();
      }
    }
  });

})();
