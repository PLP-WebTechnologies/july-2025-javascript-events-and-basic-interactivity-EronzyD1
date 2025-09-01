
/* ========== THEME TOGGLE (Feature #1) ==========
   - Toggles between dark and light themes.
   - Persists the choice to localStorage.
*/
(function setupThemeToggle(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const next = root.classList.contains('light') ? 'dark' : 'light';
    applyTheme(next);
  });

  function applyTheme(mode){
    if(mode === 'light'){ root.classList.add('light'); btn.setAttribute('aria-pressed', 'true'); }
    else { root.classList.remove('light'); btn.setAttribute('aria-pressed', 'false'); }
    localStorage.setItem('theme', mode);
  }
})();


/* ========== UTILITIES ========== */
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ========== CUSTOM FORM VALIDATION (Core Requirement) ==========
*/
(function setupFormValidation(){
  const form = $('#contactForm');
  const els = {
    name: $('#fullName'),
    email: $('#email'),
    password: $('#password'),
    confirm: $('#confirmPassword'),
    tos: $('#tos'),
    message: $('#message'),
    errors: {
      name: $('#nameError'),
      email: $('#emailError'),
      password: $('#passwordError'),
      confirm: $('#confirmPasswordError'),
      tos: $('#tosError')
    },
    success: $('#formSuccess'),
    submitBtn: $('#submitBtn')
  };

  // Live character counter (Feature #2 - interactive)
  const charCount = $('#charCount');
  els.message.addEventListener('input', () => {
    charCount.textContent = els.message.value.length.toString();
  });

  $('#password').addEventListener('input', () => {
    validatePassword(false);
  });

  ['name','email','password','confirm'].forEach(key => {
    els[key].addEventListener('blur', () => validateField(key));
  });

  $('#resetBtn').addEventListener('click', () => {
    Object.values(els.errors).forEach(e => e.textContent = '');
    els.success.hidden = true;
    charCount.textContent = '0';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = [
      validateName(),
      validateEmail(),
      validatePassword(true),
      validateConfirm(),
      validateTOS(),
      validateMessage()
    ].every(Boolean);

    if(allValid){
      // Demo submit success
      els.success.hidden = false;
      form.reset();
      charCount.textContent = '0';
    } else {
      els.success.hidden = true;
    }
  });

  // --- Individual field validators ---
  function validateField(key){
    switch(key){
      case 'name': return validateName();
      case 'email': return validateEmail();
      case 'password': return validatePassword(false);
      case 'confirm': return validateConfirm();
    }
  }

  function validateName(){
    const v = els.name.value.trim();
    if(v.length < 2){
      els.errors.name.textContent = 'Please enter your full name (min 2 characters).';
      return false;
    }
    els.errors.name.textContent = '';
    return true;
  }

  function validateEmail(){
    const v = els.email.value.trim();
    if(!EMAIL_RE.test(v)){
      els.errors.email.textContent = 'Enter a valid email like name@example.com.';
      return false;
    }
    els.errors.email.textContent = '';
    return true;
  }

  function validatePassword(showEmptyError){
    const v = els.password.value;
    const hasLen = v.length >= 8;
    const hasNum = /\d/.test(v);
    const hasAlpha = /[A-Za-z]/.test(v);

    if(!v && !showEmptyError){
      
      els.errors.password.textContent = '';
      return false;
    }

    if(!(hasLen && hasNum && hasAlpha)){
      els.errors.password.textContent = 'Password must be at least 8 chars and include letters and numbers.';
      return false;
    }
    els.errors.password.textContent = '';
    return true;
  }

  function validateConfirm(){
    if(els.confirm.value !== els.password.value || !els.confirm.value){
      els.errors.confirm.textContent = 'Passwords do not match.';
      return false;
    }
    els.errors.confirm.textContent = '';
    return true;
  }

  function validateTOS(){
    if(!els.tos.checked){
      els.errors.tos.textContent = 'You must agree to the Terms of Service.';
      return false;
    }
    els.errors.tos.textContent = '';
    return true;
  }

  function validateMessage(){
    if(els.message.value.trim().length === 0){
      const after = els.message.nextElementSibling?.nextElementSibling; 
      if(after && after.classList.contains('muted')){
        
      }
      return true; 
    }
    return true;
  }
})();


/* ========== LIVE SEARCH FILTER (Feature #3) ==========
*/
(function setupLiveSearch(){
  const input = document.getElementById('searchInput');
  const list = document.getElementById('resourceList');
  const items = Array.from(list.querySelectorAll('li'));
  const noResults = document.getElementById('noResults');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let visibleCount = 0;

    items.forEach(li => {
      const hay = (li.textContent + ' ' + (li.getAttribute('data-tags') || '')).toLowerCase();
      const match = q === '' || hay.includes(q);
      li.hidden = !match;
      if(match) visibleCount++;
    });

    noResults.hidden = visibleCount !== 0;
  });
})();


/* ========== ACCESSIBLE ACCORDION (Feature #4) ==========
   - Toggles FAQ panels open/closed.
   - Manages aria-expanded and simple show/hide state.
*/
(function setupAccordion(){
  const triggers = $$('.accordion__trigger');
  triggers.forEach(btn => {
    const panelId = btn.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.classList.toggle('open', !expanded);
    });
  });
})();


/* ========== FOOTER YEAR (small utility) ========== */
document.getElementById('year').textContent = String(new Date().getFullYear());
