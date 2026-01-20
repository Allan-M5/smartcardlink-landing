/*
 * SmartCardLink Landing Page JavaScript
 *
 * This script handles all the dynamic functionality and animations for the website.
 * It has been updated to be more robust and cross-browser compatible.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==================== */
    /* === Mobile Navigation (Hamburger Menu) === */
    /* ==================== */
    const navMenu = document.querySelector('.header-nav');
    const hamburgerBtn = document.querySelector('.hamburger-menu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close the menu if a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                const icon = hamburgerBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    /* ==================== */
    /* === Footer Real-time Clock === */
    /* ==================== */
    const datetimeElement = document.getElementById('current-datetime');
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
            const formattedDate = now.toLocaleDateString('en-US', options);
            datetimeElement.textContent = formattedDate;
        }

        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    /* ==================== */
    /* === Hero Section Animations === */
    /* ==================== */

    // 1. "Welcome" Typewriter Animation (with endless loop)
    const welcomeTextElement = document.getElementById('hero-welcome-text');
    const textToType = "Welcome";
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    function typeWelcomeText() {
        if (!welcomeTextElement) return;

        if (!isDeleting && charIndex < textToType.length) {
            welcomeTextElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWelcomeText, typingSpeed);
        } else if (!isDeleting && charIndex === textToType.length) {
            isDeleting = true;
            setTimeout(typeWelcomeText, 2000);
        } else if (isDeleting && charIndex > 0) {
            welcomeTextElement.textContent = textToType.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeWelcomeText, typingSpeed / 2);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            setTimeout(typeWelcomeText, 500);
        }
    }
    if (welcomeTextElement) {
        typeWelcomeText();
    }


    // 2. VCard 3D Animation Loop (Refined and controlled)
    const vcard1Container = document.getElementById('vcard-1-container');
    const vcard2Container = document.getElementById('vcard-2-container');
    const vcard1Inner = document.getElementById('vcard-1-inner');
    const vcard2Inner = document.getElementById('vcard-2-inner');

    let currentVcardContainer = vcard1Container;
    let currentVcardInner = vcard1Inner;
    let nextVcardContainer = vcard2Container;
    let nextVcardInner = vcard2Inner;

    function animateVcard() {
        // Reset transform for a clean slate, and prepare for the intro animation
        currentVcardContainer.style.transition = 'none';
        currentVcardContainer.style.transform = 'scale(0.1) translateY(0)';
        currentVcardInner.style.transition = 'none';
        currentVcardInner.style.transform = 'rotateY(0deg)';
        currentVcardContainer.classList.add('active');

        // Step 1: Smooth zoom-in effect from far back
        setTimeout(() => {
            currentVcardContainer.style.transition = 'transform 1s ease-out';
            currentVcardContainer.style.transform = 'scale(1)';

            // Step 2: After zoom-in, smooth flip to the back
            setTimeout(() => {
                currentVcardInner.style.transition = 'transform 1s ease-in-out';
                currentVcardInner.style.transform = 'rotateY(180deg)';

                // Step 3: Rapid 3x 360° spin
                setTimeout(() => {
                    currentVcardInner.style.transition = 'transform 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
                    currentVcardInner.style.transform = 'rotateY(1080deg)';

                    // Step 4: After spin, smoothly zoom out back to origin
                    setTimeout(() => {
                        currentVcardContainer.style.transition = 'transform 1s ease-in';
                        currentVcardContainer.style.transform = 'scale(0.1)';

                        // Transition to the next vcard
                        setTimeout(() => {
                            currentVcardContainer.classList.remove('active');
                            nextVcardContainer.classList.add('active');

                            // Swap cards for the next iteration
                            [currentVcardContainer, nextVcardContainer] = [nextVcardContainer, currentVcardContainer];
                            [currentVcardInner, nextVcardInner] = [nextVcardInner, currentVcardInner];

                            // Start the next animation cycle
                            setTimeout(animateVcard, 500); // Wait 0.5s before the next animation starts
                        }, 1000); // Duration of the smooth zoom out
                    }, 1500); // Duration of the rapid spin
                }, 1000); // Duration of the flip to back
            }, 1000); // Duration of the initial zoom-in
        }, 50); // Small delay to ensure CSS reset is applied before starting
    }

    if (vcard1Container && vcard2Container) {
        animateVcard();
    }


    /* ==================== */
    /* === Scroll-based Animations === */
    /* ==================== */

    // Observer for "About SmartCardLink Kenya" section text
    const aboutText = document.getElementById('about-text-content');
    if (aboutText) {
        const aboutObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        });
        aboutObserver.observe(aboutText);
    }
    
    // Observer for glowing & pop-up effect on content cards
    const animatedElements = document.querySelectorAll('.animated-on-scroll');
    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    animatedElements.forEach(el => {
        animateObserver.observe(el);
    });

    // Observer for Back-to-Top button and Scroll-Down button
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollDownArrow = document.querySelector('.scroll-down-arrow');
    const contactSection = document.getElementById('contact');

    function checkScrollButtons() {
        const lastSection = document.querySelector('main > section:last-of-type');
        const isAtLastSection = (window.innerHeight + window.scrollY) >= lastSection.offsetTop;

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

        // Show back to top button on desktop when scrolled
        if (window.innerWidth > 768 && window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', checkScrollButtons);
    checkScrollButtons(); // Initial check on page load

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
                const icon = hamburgerBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

});