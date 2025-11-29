document.addEventListener('DOMContentLoaded', () => {
    // 1. REGISTER GSAP PLUGINS
    gsap.registerPlugin(ScrollTrigger);

    // 2. INITIALIZE LENIS (Smooth Scroll)
    const lenis = new Lenis({
        lerp: 0.08, // Smoothness (lower = smoother/slower)
        wheelMultiplier: 1.1 // Responsiveness
    });

    // Sync Lenis and GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 3. HERO ANIMATIONS (Parallax & Intro)
    // Parallax effect for Hero Content
    gsap.to('.hero-content', {
        y: 100, // Moves down slightly as you scroll
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Hide the "Intro Box" smoothly after scrolling 100px
    const introBox = document.querySelector('.intro-box');
    if (introBox) {
        ScrollTrigger.create({
            start: 100, // Pixel value
            onEnter: () => introBox.classList.add('hidden'),
            onLeaveBack: () => introBox.classList.remove('hidden')
        });
    }

    // 4. GLOBAL FADE-UP ANIMATION (Replaces your old Observer)
    // Selects all sections and content blocks automatically
    const revealElements = document.querySelectorAll('.section h2, .content-block, .gallery-card, .form-section');

    revealElements.forEach((element) => {
        gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%', // Triggers when top of element hits 85% of viewport
                    toggleActions: 'play none none reverse' // Replays on scroll back up
                }
            }
        );
    });

    // 5. SMOOTH ANCHOR LINKS (Connecting Menu to Lenis)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                lenis.scrollTo(0); // Scroll to top
            } else {
                const target = document.querySelector(targetId);
                if (target) lenis.scrollTo(target);
            }
        });
    });

    // 6. FORM FIELD FOCUS STYLING
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


