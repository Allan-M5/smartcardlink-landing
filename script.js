document.addEventListener('DOMContentLoaded', () => {
    const navMenu = document.querySelector('.header-nav');
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const header = document.getElementById('main-header');
    const progressBar = document.getElementById('scroll-progress');
    const datetimeElement = document.getElementById('current-datetime');
    const vcard1Container = document.getElementById('vcard-1-container');
    const vcard2Container = document.getElementById('vcard-2-container');
    const vcard1Inner = document.getElementById('vcard-1-inner');
    const vcard2Inner = document.getElementById('vcard-2-inner');
    const aboutText = document.getElementById('about-text-content');
    const animatedElements = document.querySelectorAll('.animated-on-scroll');
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    const tiltTarget = document.getElementById('vcard-tilt-target');
    const navLinks = document.querySelectorAll('.header-nav a[href^="#"], .logo-link[href^="#"]');
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('main section[id]');
    const blobs = document.querySelectorAll('.bg-blob');
    const bubbleLayer = document.getElementById('featureBubbleLayer');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentVcardContainer = vcard1Container;
    let currentVcardInner = vcard1Inner;
    let nextVcardContainer = vcard2Container;
    let nextVcardInner = vcard2Inner;
    let vcardTimeout = null;
    let bubbleInterval = null;
    let typingStarted = false;

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

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                const icon = hamburgerBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    if (datetimeElement) {
        function updateDateTime() {
            const now = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            datetimeElement.textContent = now.toLocaleDateString('en-US', options);
        }

        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    function animateVcard() {
        if (!currentVcardContainer || !nextVcardContainer || !currentVcardInner || !nextVcardInner) return;

        currentVcardContainer.style.transition = 'none';
        currentVcardContainer.style.transform = 'scale(0.18) translateY(0)';
        currentVcardInner.style.transition = 'none';
        currentVcardInner.style.transform = 'rotateY(0deg)';
        currentVcardContainer.classList.add('active');

        setTimeout(() => {
            currentVcardContainer.style.transition = 'transform 1s ease-out';
            currentVcardContainer.style.transform = 'scale(1)';

            setTimeout(() => {
                currentVcardInner.style.transition = 'transform 1s ease-in-out';
                currentVcardInner.style.transform = 'rotateY(180deg)';

                setTimeout(() => {
                    currentVcardContainer.style.transition = 'transform 0.9s ease-in';
                    currentVcardContainer.style.transform = 'scale(0.18)';

                    setTimeout(() => {
                        currentVcardContainer.classList.remove('active');
                        nextVcardContainer.classList.add('active');

                        [currentVcardContainer, nextVcardContainer] = [nextVcardContainer, currentVcardContainer];
                        [currentVcardInner, nextVcardInner] = [nextVcardInner, currentVcardInner];

                        vcardTimeout = setTimeout(animateVcard, 500);
                    }, 900);
                }, 1100);
            }, 900);
        }, 60);
    }

    if (vcard1Container && vcard2Container && !prefersReducedMotion) {
        animateVcard();
    } else if (vcard1Container) {
        vcard1Container.classList.add('active');
    }

    function createFeatureBubble() {
        if (!bubbleLayer || prefersReducedMotion) return;

        const bubble = document.createElement('div');
        bubble.className = `feature-bubble ${Math.random() > 0.5 ? 'gold' : 'blue'}`;
        bubble.textContent = featurePool[Math.floor(Math.random() * featurePool.length)];

        const layerRect = bubbleLayer.getBoundingClientRect();
        const x = Math.random() * Math.max(layerRect.width - 120, 40);
        const y = Math.random() * Math.max(layerRect.height - 40, 40);

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        bubbleLayer.appendChild(bubble);

        bubble.addEventListener('animationend', () => {
            bubble.remove();
        });
    }

    if (bubbleLayer && !prefersReducedMotion) {
        bubbleInterval = setInterval(() => {
            const burstCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < burstCount; i++) {
                setTimeout(createFeatureBubble, i * 180);
            }
        }, 850);
    }

    function typeParagraph(element, speed = 15) {
        if (!element || typingStarted || prefersReducedMotion) return;
        typingStarted = true;

        const fullText = element.textContent.trim();
        element.textContent = '';
        let index = 0;

        function typeNext() {
            if (index < fullText.length) {
                element.textContent += fullText.charAt(index);
                index += 1;
                setTimeout(typeNext, speed);
            }
        }

        typeNext();
    }

    if (aboutText) {
        const aboutObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeParagraph(entry.target, 12);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.35
        });
        aboutObserver.observe(aboutText);
    }

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18
    });

    animatedElements.forEach(el => {
        animateObserver.observe(el);
    });

    function checkScrollButtons() {
        const lastSection = document.querySelector('main > section:last-of-type');
        if (!lastSection || !scrollDownArrow || !backToTopBtn) return;

        const isAtLastSection = (window.innerHeight + window.scrollY) >= (lastSection.offsetTop + 40);

        if (isAtLastSection) {
            scrollDownArrow.style.opacity = '0';
            scrollDownArrow.style.visibility = 'hidden';
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            scrollDownArrow.style.opacity = '1';
            scrollDownArrow.style.visibility = 'visible';
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }

        if (window.innerWidth > 768 && window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else if (window.innerWidth > 768 && !isAtLastSection) {
            backToTopBtn.classList.remove('visible');
        }
    }

    function updateProgressBar() {
        if (!progressBar) return;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    }

    function updateHeaderState() {
        if (!header) return;
        header.classList.toggle('header-scrolled', window.scrollY > 15);
    }

    function updateActiveNavLink() {
        const headerOffset = header ? header.offsetHeight + 30 : 100;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSectionId = section.id;
            }
        });

        navBtns.forEach(btn => {
            const href = btn.getAttribute('href');
            btn.classList.toggle('active', href === `#${currentSectionId}`);
        });
    }

    function handleScrollState() {
        checkScrollButtons();
        updateProgressBar();
        updateHeaderState();
        updateActiveNavLink();
    }

    window.addEventListener('scroll', handleScrollState, { passive: true });
    handleScrollState();

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const headerOffset = header ? header.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset + 1;

            window.scrollTo({
                top: targetTop,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });

            if (window.innerWidth <= 768 && navMenu && hamburgerBtn) {
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                const icon = hamburgerBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    magneticButtons.forEach(button => {
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
            button.style.transform += ' scale(0.96)';
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
            const rotateY = ((x - centerX) / centerX) * 8;
            const rotateX = ((centerY - y) / centerY) * 7;

            document.documentElement.style.setProperty('--hero-tilt-x', `${rotateX}deg`);
            document.documentElement.style.setProperty('--hero-tilt-y', `${rotateY}deg`);
        });

        tiltTarget.addEventListener('mouseleave', () => {
            document.documentElement.style.setProperty('--hero-tilt-x', `0deg`);
            document.documentElement.style.setProperty('--hero-tilt-y', `0deg`);
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

    window.addEventListener('beforeunload', () => {
        if (vcardTimeout) clearTimeout(vcardTimeout);
        if (bubbleInterval) clearInterval(bubbleInterval);
    });
});