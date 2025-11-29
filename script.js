document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    let scrollInstance = null;
    let hasScrolled = false;

    // -----------------------------
    // GSAP Logo Animation
    // -----------------------------
    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
        // Initialize GSAP Timeline for a sleek, cohesive entrance
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1. Fade in the short text (W&W)
        tl.fromTo("#short-text", 
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8 }
        );

        // 2. On Hover: Sleekly swap to long text (No pencil drawing)
        const logo = document.querySelector('.ww-logo');
        const shortText = document.querySelector('#short-text');
        const longText = document.querySelector('#long-text');

        // Ensure initial states in CSS or via GSAP set
        gsap.set(longText, { opacity: 0, x: -10 });

        logo.addEventListener('mouseenter', () => {
            gsap.to(shortText, { opacity: 0, x: 10, duration: 0.4 });
            gsap.to(longText, { opacity: 1, x: 0, duration: 0.5, delay: 0.1 });
        });

        logo.addEventListener('mouseleave', () => {
            gsap.to(longText, { opacity: 0, x: -10, duration: 0.4 });
            gsap.to(shortText, { opacity: 1, x: 0, duration: 0.5, delay: 0.1 });
        });
    }

    // -----------------------------
    // Lenis Smooth Scroll
    // -----------------------------
    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
        scrollInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 2
        });

        function raf(time) {
            scrollInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        scrollInstance.on('scroll', ({ scroll }) => {
            const introBox = document.querySelector('.intro-box');

            // One-time hide of intro box after user starts scrolling
            if (!hasScrolled && scroll > 100 && introBox) {
                introBox.classList.add('hidden');
                hasScrolled = true;
            }

            // Hero parallax effect
            const hero = document.querySelector('.hero');
            const heroContent = document.querySelector('.hero-content');
            
            if (hero && heroContent) {
                const heroRect = hero.getBoundingClientRect();
                const heroHeight = hero.offsetHeight;
                const progress = Math.max(0, Math.min(1, -heroRect.top / heroHeight));
                
                heroContent.style.transform = `translateY(${progress * 40}px)`;
                heroContent.style.opacity = 1 - progress * 0.5;
            }
        });
    }

    // Helper for scrolling (falls back to native scroll when Lenis is off)
    function scrollToTarget(target) {
        if (!target) return;

        if (scrollInstance) {
            scrollInstance.scrollTo(target, { offset: 0, duration: 1.2 });
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
                    scrollInstance.scrollTo(0, { duration: 1.2 });
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


