document.addEventListener('DOMContentLoaded', () => {
    const navMenu = document.getElementById('header-nav');
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const header = document.getElementById('main-header');
    const progressBar = document.getElementById('scroll-progress');
    const datetimeElement = document.getElementById('current-datetime');
    const animatedElements = document.querySelectorAll('.animated-on-scroll');
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    const tiltTarget = document.getElementById('hero-media-stage');
    const navLinks = document.querySelectorAll('.header-nav a[href^="#"], .logo-link[href^="#"]');
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('main section[id]');
    const blobs = document.querySelectorAll('.bg-blob');
    const bubbleLayer = document.getElementById('featureBubbleLayer');
    const typeTargets = document.querySelectorAll('.type-target');
    const toggleVideos = document.querySelectorAll('.tap-toggle-video');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let bubbleInterval = null;
    const typedElements = new WeakSet();

    const featurePool = [
        'Save Contact',
        'QR Access',
        'NFC Tap',
        'WhatsApp',
        'Call Now',
        'Email',
        'Book Appointment',
        'Portfolio URL',
        'Business Website',
        'Google Maps',
        'Working Hours',
        'Resume Access',
        'Analytics',
        'Theme Color',
        'Reminder Tool'
    ];

    const closeMobileMenu = () => {
        if (!navMenu || !hamburgerBtn) return;

        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');

        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    };

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');

            const icon = hamburgerBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    if (datetimeElement) {
        const updateDateTime = () => {
            const now = new Date();
            datetimeElement.textContent = now.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        };

        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    const createFeatureBubble = () => {
        if (!bubbleLayer || prefersReducedMotion) return;

        const bubble = document.createElement('div');
        bubble.className = `feature-bubble ${Math.random() > 0.5 ? 'gold' : 'blue'}`;
        bubble.textContent = featurePool[Math.floor(Math.random() * featurePool.length)];

        const layerRect = bubbleLayer.getBoundingClientRect();
        const maxX = Math.max(layerRect.width - 150, 30);
        const maxY = Math.max(layerRect.height - 60, 30);

        bubble.style.left = `${Math.random() * maxX}px`;
        bubble.style.top = `${Math.random() * maxY}px`;

        bubbleLayer.appendChild(bubble);
        bubble.addEventListener('animationend', () => bubble.remove(), { once: true });
    };

    if (bubbleLayer && !prefersReducedMotion) {
        bubbleInterval = setInterval(() => {
            const burstCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < burstCount; i += 1) {
                setTimeout(createFeatureBubble, i * 180);
            }
        }, 900);
    }

    const typeParagraph = (element) => {
        if (!element || typedElements.has(element)) return;

        typedElements.add(element);

        const fullText = element.dataset.fullText || element.textContent.trim();
        const speed = Number(element.dataset.typeSpeed || 14);

        if (prefersReducedMotion) {
            element.textContent = fullText;
            return;
        }

        element.textContent = '';
        let index = 0;

        const typeNext = () => {
            if (index >= fullText.length) return;
            element.textContent += fullText.charAt(index);
            index += 1;
            window.setTimeout(typeNext, speed);
        };

        typeNext();
    };

    if (typeTargets.length) {
        const typeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                typeParagraph(entry.target);
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.28
        });

        typeTargets.forEach((target) => typeObserver.observe(target));
    }

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('scroll-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16
    });

    animatedElements.forEach((el) => animateObserver.observe(el));

    const updateProgressBar = () => {
        if (!progressBar) return;

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    };

    const updateHeaderState = () => {
        if (!header) return;
        header.classList.toggle('header-scrolled', window.scrollY > 15);
    };

    const updateActiveNavLink = () => {
        if (!sections.length) return;

        const headerOffset = header ? header.offsetHeight + 30 : 100;
        let currentSectionId = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - headerOffset;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSectionId = section.id;
            }
        });

        if (!currentSectionId && sections.length) {
            currentSectionId = sections[0].id;
        }

        navBtns.forEach((btn) => {
            const href = btn.getAttribute('href');
            btn.classList.toggle('active', href === `#${currentSectionId}`);
        });
    };

    const checkScrollButtons = () => {
        if (!scrollDownArrow || !backToTopBtn) return;

        const lastSection = document.querySelector('main > section:last-of-type');
        const nearBottom = lastSection
            ? (window.innerHeight + window.scrollY) >= (lastSection.offsetTop + 80)
            : false;

        if (nearBottom) {
            scrollDownArrow.style.opacity = '0';
            scrollDownArrow.style.visibility = 'hidden';
        } else {
            scrollDownArrow.style.opacity = '1';
            scrollDownArrow.style.visibility = 'visible';
        }

        if (window.scrollY > 320) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    const handleScrollState = () => {
        updateProgressBar();
        updateHeaderState();
        updateActiveNavLink();
        checkScrollButtons();
    };

    window.addEventListener('scroll', handleScrollState, { passive: true });
    window.addEventListener('resize', handleScrollState);
    handleScrollState();

    navLinks.forEach((anchor) => {
        anchor.addEventListener('click', function (event) {
            const href = this.getAttribute('href');
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

            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    magneticButtons.forEach((button) => {
        button.addEventListener('mousemove', (event) => {
            if (prefersReducedMotion) return;

            const rect = button.getBoundingClientRect();
            const relX = event.clientX - rect.left;
            const relY = event.clientY - rect.top;
            const moveX = (relX - rect.width / 2) * 0.08;
            const moveY = (relY - rect.height / 2) * 0.08;

            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });

        button.addEventListener('mousedown', () => {
            if (prefersReducedMotion) return;
            button.style.transform += ' scale(0.97)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
    });

    if (tiltTarget && !prefersReducedMotion) {
        tiltTarget.addEventListener('mousemove', (event) => {
            const rect = tiltTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateY = ((x - centerX) / centerX) * 7;
            const rotateX = ((centerY - y) / centerY) * 6;

            document.documentElement.style.setProperty('--hero-tilt-x', `${rotateX}deg`);
            document.documentElement.style.setProperty('--hero-tilt-y', `${rotateY}deg`);
        });

        tiltTarget.addEventListener('mouseleave', () => {
            document.documentElement.style.setProperty('--hero-tilt-x', '0deg');
            document.documentElement.style.setProperty('--hero-tilt-y', '0deg');
        });
    }

    if (blobs.length && !prefersReducedMotion) {
        window.addEventListener('mousemove', (event) => {
            const xRatio = (event.clientX / window.innerWidth - 0.5) * 2;
            const yRatio = (event.clientY / window.innerHeight - 0.5) * 2;

            blobs.forEach((blob, index) => {
                const speed = 8 + (index * 3);
                blob.style.transform = `translate(${xRatio * speed}px, ${yRatio * speed}px)`;
            });
        });
    }

    toggleVideos.forEach((video) => {
        const mediaWrap = video.closest('.how-step-media');

        const togglePlayback = async () => {
            try {
                if (video.paused) {
                    await video.play();
                    if (mediaWrap) mediaWrap.classList.remove('is-paused');
                } else {
                    video.pause();
                    if (mediaWrap) mediaWrap.classList.add('is-paused');
                }
            } catch (error) {
                console.error('Video toggle failed:', error);
            }
        };

        if (mediaWrap) {
            mediaWrap.classList.remove('is-paused');
            mediaWrap.setAttribute('role', 'button');
            mediaWrap.setAttribute('tabindex', '0');
            mediaWrap.setAttribute('aria-label', 'Toggle video playback');

            mediaWrap.addEventListener('click', togglePlayback);

            mediaWrap.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    togglePlayback();
                }
            });
        }

        video.addEventListener('pause', () => {
            if (mediaWrap) mediaWrap.classList.add('is-paused');
        });

        video.addEventListener('play', () => {
            if (mediaWrap) mediaWrap.classList.remove('is-paused');
        });
    });

    window.addEventListener('beforeunload', () => {
        if (bubbleInterval) clearInterval(bubbleInterval);
    });
});