document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const header = document.getElementById('main-header');
  const navMenu = document.getElementById('header-nav');
  const hamburgerBtn = document.getElementById('hamburger-menu');
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const scrollDownArrow = document.querySelector('.scroll-down-arrow');
  const navLinks = document.querySelectorAll('.header-nav a[href^="#"], .logo-link[href^="#"]');
  const revealElements = document.querySelectorAll('.reveal');
  const welcomeTextElement = document.getElementById('hero-welcome-text');
  const datetimeElement = document.getElementById('current-datetime');
  const splitWordTargets = document.querySelectorAll('.split-words');
  const splitLineTargets = document.querySelectorAll('.split-lines');
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  const parallaxBlobs = document.querySelectorAll('.bg-blob');
  const tiltTarget = document.getElementById('vcard-tilt-target');
  const sections = document.querySelectorAll('main section[id]');
  const navBtns = document.querySelectorAll('.header-nav a[href^="#"]');
  const priceElements = document.querySelectorAll('.rolling-price');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let vcardTimer = null;
  let typeTimer = null;

  function splitWords(element) {
    const text = element.textContent.trim().replace(/\s+/g, ' ');
    const words = text.split(' ');
    element.innerHTML = words
      .map((word, index) => `<span class="word" style="transition-delay:${index * 0.05}s">${word}&nbsp;</span>`)
      .join('');
  }

  function splitLines(element) {
    const html = element.innerHTML
      .split('<br>')
      .map(part => part.trim())
      .join('\n');

    const textNodes = html
      .replace(/\n/g, '|||')
      .split('|||')
      .map(line => line.trim())
      .filter(Boolean);

    if (!textNodes.length) return;

    const built = textNodes.map((line, index) => {
      const delay = index * 0.09;
      return `<span class="line"><span class="line-inner" style="transition-delay:${delay}s">${line}</span></span>`;
    }).join('');

    element.innerHTML = built;
  }

  splitWordTargets.forEach(splitWords);
  splitLineTargets.forEach(splitLines);

  function closeMobileMenu() {
    if (!navMenu || !hamburgerBtn) return;
    navMenu.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    body.classList.remove('no-scroll');
  }

  function openMobileMenu() {
    if (!navMenu || !hamburgerBtn) return;
    navMenu.classList.add('active');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    body.classList.add('no-scroll');
  }

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
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
      minute: '2-digit'
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
        typeTimer = setTimeout(runTyping, 115);
      } else {
        welcomeTextElement.textContent = word.slice(0, index - 1);
        index -= 1;

        if (index === 0) {
          deleting = false;
          typeTimer = setTimeout(runTyping, 450);
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
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((element) => observer.observe(element));
  }

  initRevealObserver();

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

    function cycleCards() {
      const current = cards[0];
      const next = cards[1];

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

    vcardTimer = setTimeout(cycleCards, 1800);
  }

  initVCardAnimation();

  if (tiltTarget && !prefersReducedMotion) {
    tiltTarget.addEventListener('mousemove', (event) => {
      const rect = tiltTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 10;
      const rotateX = ((centerY - y) / centerY) * 8;

      tiltTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    tiltTarget.addEventListener('mouseleave', () => {
      tiltTarget.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  if (!prefersReducedMotion && parallaxBlobs.length) {
    window.addEventListener('mousemove', (event) => {
      const xRatio = (event.clientX / window.innerWidth - 0.5) * 2;
      const yRatio = (event.clientY / window.innerHeight - 0.5) * 2;

      parallaxBlobs.forEach((blob) => {
        const speed = parseFloat(blob.dataset.parallax || '0.02');
        const moveX = xRatio * 60 * speed * 10;
        const moveY = yRatio * 60 * speed * 10;
        blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }

  magneticButtons.forEach((button) => {
    button.addEventListener('mousemove', (event) => {
      if (prefersReducedMotion) return;

      const rect = button.getBoundingClientRect();
      const relX = event.clientX - rect.left;
      const relY = event.clientY - rect.top;
      const moveX = (relX - rect.width / 2) * 0.12;
      const moveY = (relY - rect.height / 2) * 0.12;

      button.style.transform = `translate(${moveX}px, ${moveY}px)`;
      button.style.setProperty('--mx', `${relX}px`);
      button.style.setProperty('--my', `${relY}px`);
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
      button.style.setProperty('--mx', '50%');
      button.style.setProperty('--my', '50%');
    });

    button.addEventListener('mousedown', () => {
      button.style.transform += ' scale(0.97)';
    });

    button.addEventListener('mouseup', () => {
      button.style.transform = '';
    });
  });

  function animatePrice(el) {
    const target = parseInt(el.dataset.target || '0', 10);
    if (!target || Number.isNaN(target)) return;

    const duration = 1300;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  if (priceElements.length) {
    const priceObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animatePrice(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    priceElements.forEach((price) => priceObserver.observe(price));
  }

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