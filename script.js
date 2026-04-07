document.addEventListener('DOMContentLoaded', () => {

    // 1. CUSTOM CURSOR
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    // Only initialized if it's not a touch device to avoid glitches
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with slight delay based on transition in CSS
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
        });

        // Add hover effects for clickable items
        const clickables = document.querySelectorAll('a, button, input, textarea, .project-card, .hamburger');

        clickables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hover');
            });

            item.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hover');
            });
        });
    }

    // 2. MOBILE NAVIGATION
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-links li');
    const navIcon = hamburger.querySelector('i');

    hamburger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');

        // Change Icon (Lucide handles custom SVG, so we just toggle name)
        if (navLinks.classList.contains('nav-active')) {
            navIcon.setAttribute('data-lucide', 'x');
        } else {
            navIcon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons(); // Re-render the icon
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                navIcon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });

    // 3. NAVBAR SCROLL EFFECT & ACTIVE STATE
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset;

        // Add shadow/background to navbar when scrolled
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/Show navbar on scroll down/up
        if (currentScroll > lastScroll && currentScroll > 200) {
            // Scroll down
            navbar.classList.add('hidden');
        } else {
            // Scroll up
            navbar.classList.remove('hidden');
        }
        lastScroll = currentScroll;

        // Active Link Highlighting based on scroll position
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjustment factor (header height)
            if (pageYOffset >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    });

    // 4. SCROLL REVEAL ANIMATION
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Observers element only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 5. CONTACT FORM HANDLING
    const contactForm = document.getElementById('contact-form');
    const formMsg = document.getElementById('form-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic UI feedback for the placeholder form
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Enviando... <i data-lucide="loader"></i>';
            lucide.createIcons();

            setTimeout(() => {
                btn.innerHTML = 'Enviado con éxito <i data-lucide="check"></i>';
                btn.style.background = '#10b981'; // Green
                btn.style.borderColor = '#10b981';
                lucide.createIcons();

                formMsg.textContent = 'Mensaje de prueba enviado. Para producción, enlaza a Formspree o un backend real.';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    formMsg.textContent = '';
                    lucide.createIcons();
                }, 4000);
            }, 1500);
        });
    }

});
