document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.getElementById('main-header');
    const navMenu = document.getElementById('header-nav');
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const progressBar = document.getElementById('progress-bar');
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
    const navLinks = document.querySelectorAll('.header-nav a[href^="#"], .logo-link[href^="#"]');
    const revealElements = document.querySelectorAll('.reveal');
    const welcomeTextElement = document.getElementById('hero-welcome-text');
    const datetimeElement = document.getElementById('current-datetime');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let vcardTimer = null;
    let typeTimer = null;

    function closeMobileMenu() {
        if (!navMenu || !hamburgerBtn) return;
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        body.classList.remove('no-scroll', 'nav-open');
    }

    function openMobileMenu() {
        if (!navMenu || !hamburgerBtn) return;
        navMenu.classList.add('active');
        hamburgerBtn.classList.add('active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        body.classList.add('no-scroll', 'nav-open');
    }

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        document.addEventListener('click', (event) => {
            const clickedInsideMenu = navMenu.contains(event.target);
            const clickedHamburger = hamburgerBtn.contains(event.target);

            if (!clickedInsideMenu && !clickedHamburger && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();

            const headerOffset = header ? header.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset + 1;

            window.scrollTo({
                top: targetTop,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });

            closeMobileMenu();
        });
    });

    function updateDateTime() {
        if (!datetimeElement) return;

        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        datetimeElement.textContent = formatter.format(now);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    function typeWelcomeText() {
        if (!welcomeTextElement) return;
        if (prefersReducedMotion) {
            welcomeTextElement.textContent = 'Welcome';
            return;
        }

        const word = 'Welcome';
        let index = 0;
        let deleting = false;

        function runTyping() {
            if (!welcomeTextElement) return;

            if (!deleting) {
                welcomeTextElement.textContent = word.slice(0, index + 1);
                index += 1;

                if (index === word.length) {
                    deleting = true;
                    typeTimer = setTimeout(runTyping, 1500);
                    return;
                }

                typeTimer = setTimeout(runTyping, 110);
            } else {
                welcomeTextElement.textContent = word.slice(0, index - 1);
                index -= 1;

                if (index === 0) {
                    deleting = false;
                    typeTimer = setTimeout(runTyping, 500);
                    return;
                }

                typeTimer = setTimeout(runTyping, 70);
            }
        }

        runTyping();
    }

    typeWelcomeText();

    function initRevealObserver() {
        if (!revealElements.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealElements.forEach((element) => element.classList.add('reveal-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('reveal-visible');
                obs.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach((element) => observer.observe(element));
    }

    initRevealObserver();

    const sections = document.querySelectorAll('main section[id]');
    const navBtns = document.querySelectorAll('.header-nav a[href^="#"]');

    function updateActiveNavLink() {
        const headerOffset = header ? header.offsetHeight + 40 : 120;
        let currentSectionId = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - headerOffset;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSectionId = section.id;
            }
        });

        navBtns.forEach((btn) => {
            const href = btn.getAttribute('href');
            btn.classList.toggle('active', href === `#${currentSectionId}`);
        });
    }

    function updateProgressBar() {
        if (!progressBar) return;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    }

    function updateHeaderState() {
        if (!header) return;
        header.classList.toggle('header-scrolled', window.scrollY > 20);
    }

    function updateScrollButtons() {
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', window.scrollY > 500);
        }

        if (scrollDownArrow) {
            if (window.scrollY > 140) {
                scrollDownArrow.style.opacity = '0';
                scrollDownArrow.style.visibility = 'hidden';
                scrollDownArrow.style.pointerEvents = 'none';
            } else {
                scrollDownArrow.style.opacity = '1';
                scrollDownArrow.style.visibility = 'visible';
                scrollDownArrow.style.pointerEvents = 'auto';
            }
        }
    }

    function handleScrollState() {
        updateHeaderState();
        updateProgressBar();
        updateScrollButtons();
        updateActiveNavLink();
    }

    window.addEventListener('scroll', handleScrollState, { passive: true });
    handleScrollState();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    function initVCardAnimation() {
        const vcard1Container = document.getElementById('vcard-1-container');
        const vcard2Container = document.getElementById('vcard-2-container');
        const vcard1Inner = document.getElementById('vcard-1-inner');
        const vcard2Inner = document.getElementById('vcard-2-inner');

        if (!vcard1Container || !vcard2Container || !vcard1Inner || !vcard2Inner) return;

        if (prefersReducedMotion) {
            vcard1Container.classList.add('active');
            vcard2Container.classList.remove('active');
            return;
        }

        let cards = [
            { container: vcard1Container, inner: vcard1Inner },
            { container: vcard2Container, inner: vcard2Inner }
        ];

        cards.forEach(({ container, inner }, index) => {
            container.classList.toggle('active', index === 0);
            inner.style.transform = 'rotateY(0deg)';
        });

        function setCardState(activeCard, inactiveCard) {
            activeCard.container.classList.add('active');
            inactiveCard.container.classList.remove('active');
            inactiveCard.inner.style.transition = 'none';
            inactiveCard.inner.style.transform = 'rotateY(0deg)';
        }

        function cycleCards() {
            const current = cards[0];
            const next = cards[1];

            current.container.classList.add('active');
            next.container.classList.remove('active');

            current.inner.style.transition = 'transform 1.15s cubic-bezier(0.22, 1, 0.36, 1)';
            current.inner.style.transform = 'rotateY(180deg)';

            vcardTimer = setTimeout(() => {
                next.container.classList.add('active');
                current.container.classList.remove('active');

                next.inner.style.transition = 'none';
                next.inner.style.transform = 'rotateY(0deg)';

                cards = [next, current];
                vcardTimer = setTimeout(cycleCards, 2600);
            }, 1900);
        }

        setCardState(cards[0], cards[1]);
        vcardTimer = setTimeout(cycleCards, 1800);
    }

    initVCardAnimation();

    document.querySelectorAll('.faq-item summary').forEach((summary) => {
        summary.addEventListener('click', () => {
            const detail = summary.parentElement;
            if (!detail) return;

            setTimeout(() => {
                if (!detail.open) return;
                const rect = detail.getBoundingClientRect();
                const headerHeight = header ? header.offsetHeight : 0;

                if (rect.top < headerHeight + 10) {
                    window.scrollBy({
                        top: rect.top - headerHeight - 16,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            }, 120);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMobileMenu();
        }
    });

    window.addEventListener('beforeunload', () => {
        if (vcardTimer) clearTimeout(vcardTimer);
        if (typeTimer) clearTimeout(typeTimer);
    });
});