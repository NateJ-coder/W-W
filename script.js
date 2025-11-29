document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    let scrollInstance = null;
    let hasScrolled = false;

    // -----------------------------
    // Locomotive Scroll
    // -----------------------------
    if (!prefersReducedMotion) {
        scrollInstance = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            smoothMobile: false,
            lerp: 0.08,          // slightly higher than 0.05 = smoother **and** snappier
            multiplier: 1.05     // a tiny bit more "oomph" without feeling floaty
        });

        window.addEventListener('resize', () => {
            scrollInstance.update();
        });

        scrollInstance.on('scroll', (args) => {
            const introBox = document.querySelector('.intro-box');

            // One-time hide of intro box after user starts scrolling
            if (!hasScrolled && args.scroll.y > 100 && introBox) {
                introBox.classList.add('hidden');
                hasScrolled = true;
            }

            // Hero parallax (requires data-scroll-id="hero" on the hero section)
            const heroElement =
                args.currentElements && args.currentElements.hero;

            if (heroElement) {
                const progress = heroElement.progress; // 0 → 1 as we scroll past hero
                const heroContent = document.querySelector('.hero-content');

                if (heroContent) {
                    heroContent.style.transform =
                        `translateY(${progress * 40}px)`;
                    heroContent.style.opacity = 1 - progress * 0.5;
                }
            }
        });
    }

    // Helper for scrolling (falls back to native scroll when Locomotive is off)
    function scrollToTarget(target) {
        if (!target) return;

        if (scrollInstance) {
            scrollInstance.scrollTo(target);
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // -----------------------------
    // Scroll-reveal animations
    // -----------------------------
    const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealTargets = document.querySelectorAll(
        '.section, .content-block, .form-section, .offer-details'
    );

    revealTargets.forEach(el => {
        el.classList.add('animate-on-scroll');
        fadeInObserver.observe(el);
    });

    // -----------------------------
    // Smooth in-page anchors
    // -----------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');

            // Handle "#" (logo link) as "scroll to top"
            if (href === '#') {
                e.preventDefault();

                const introBox = document.querySelector('.intro-box');
                if (introBox) introBox.classList.add('hidden');

                if (scrollInstance) {
                    scrollInstance.scrollTo(0);
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                return;
            }

            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            if (!target) return;

            e.preventDefault();

            // Hide intro when leaving hero via its button
            if (anchor.closest('.hero')) {
                const introBox = document.querySelector('.intro-box');
                if (introBox) introBox.classList.add('hidden');
            }

            scrollToTarget(target);
        });
    });

    // -----------------------------
    // Form field focus styling
    // -----------------------------
    document
        .querySelectorAll('.form-group input, .form-group select, .form-group textarea')
        .forEach(field => {
            field.addEventListener('focus', () => {
                field.parentElement.classList.add('is-focused');
            });

            field.addEventListener('blur', () => {
                field.parentElement.classList.remove('is-focused');
            });
        });
});


