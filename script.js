/* ================================================
   PORTFOLIO — script.js
   Francisco Calvo Rodriguez
================================================ */

/* ---------- 1. THEME TOGGLE ---------- */
(function () {
  const html = document.documentElement;
  const btnToggle = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;

  function applyTheme(dark) {
    if (dark) {
      html.classList.remove('light');
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
    } else {
      html.classList.add('light');
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  applyTheme(isDark);

  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      applyTheme(html.classList.contains('light'));
    });
  }
})();


/* ---------- 2. MOBILE MENU ---------- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconMenu = document.getElementById('icon-menu');
  const iconClose = document.getElementById('icon-close');

  function openMenu() {
    mobileMenu.classList.add('open');
    iconMenu.style.display = 'none';
    iconClose.style.display = 'block';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    iconMenu.style.display = 'block';
    iconClose.style.display = 'none';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  window.closeMobile = closeMenu;

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
})();


/* ---------- 3. NAVBAR SCROLL EFFECT ---------- */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,.45)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });
})();


/* ---------- 4. ACTIVE NAV LINK ---------- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ---------- 5. SCROLL REVEAL ---------- */
(function () {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
})();


/* ---------- 6. FOOTER YEAR ---------- */
(function () {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ---------- 7. EMAILJS CONTACT FORM ----------
   INSTRUCCIONES:
   a) Crea cuenta en https://www.emailjs.com (plan gratuito = 200 emails/mes)
   b) Crea un Service (Gmail/Outlook) → copia el SERVICE_ID
   c) Crea Email Template con variables: {{user_name}}, {{user_email}}, {{message}}
      Destinatario: calvorodriguez.francisco99@gmail.com → copia el TEMPLATE_ID
   d) Account → API Keys → copia tu PUBLIC_KEY
   e) Reemplaza los 3 valores abajo
-------------------------------------------------*/
(function () {
  // ✏️ REEMPLAZA ESTOS 3 VALORES:
  const PUBLIC_KEY = 'TU_PUBLIC_KEY_AQUI';
  const SERVICE_ID = 'TU_SERVICE_ID_AQUI';
  const TEMPLATE_ID = 'TU_TEMPLATE_ID_AQUI';

  const configured = PUBLIC_KEY !== 'TU_PUBLIC_KEY_AQUI';

  if (configured) {
    emailjs.init({ publicKey: PUBLIC_KEY });
  }

  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const msg = document.getElementById('form-msg');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const name = form.user_name.value.trim();
    const email = form.user_email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showMsg('Por favor completa todos los campos.', 'var(--accent)');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg('Ingresa un correo válido.', '#f87171');
      return;
    }

    btn.disabled = true;
    btnText.textContent = 'Enviando…';
    msg.textContent = '';

    if (!configured) {
      // Demo mode — simulates success when EmailJS not configured
      setTimeout(() => {
        showMsg('⚠️ EmailJS no configurado. Configura PUBLIC_KEY, SERVICE_ID y TEMPLATE_ID en script.js.', '#f59e0b');
        btn.disabled = false;
        btnText.textContent = 'Enviar Mensaje';
      }, 1200);
      return;
    }

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
      .then(() => {
        showMsg('✅ ¡Mensaje enviado! Te contactaré pronto.', '#4ade80');
        form.reset();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        showMsg('❌ Error al enviar. Escríbeme a calvorodriguez.francisco99@gmail.com', '#f87171');
      })
      .finally(() => {
        btn.disabled = false;
        btnText.textContent = 'Enviar Mensaje';
      });
  });

  function showMsg(text, color) {
    msg.textContent = text;
    msg.style.color = color;
  }
})();
