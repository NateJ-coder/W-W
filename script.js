// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    smoothMobile: false,
    lerp: 0.05, // Lower = smoother but slower
});

// Update scroll on window resize
window.addEventListener('resize', () => {
    scroll.update();
});

// Scroll Reveal Animation using Intersection Observer
const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optionally stop observing after animation
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animate-on-scroll class to sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
        fadeInObserver.observe(section);
    });

    // Also observe content blocks and form sections
    const contentBlocks = document.querySelectorAll('.content-block, .form-section, .offer-details');
    contentBlocks.forEach(block => {
        block.classList.add('animate-on-scroll');
        fadeInObserver.observe(block);
    });
});

// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
            scroll.scrollTo(target);
        }
    });
});

// Enhanced form field interactions
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    // Add focus class to parent for additional styling options
    field.addEventListener('focus', function() {
        this.parentElement.classList.add('is-focused');
    });
    
    field.addEventListener('blur', function() {
        this.parentElement.classList.remove('is-focused');
    });
});

// Add subtle parallax effect to hero content
scroll.on('scroll', (args) => {
    if (typeof args.currentElements['hero'] === 'object') {
        const progress = args.currentElements['hero'].progress;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${progress * 50}px)`;
            heroContent.style.opacity = 1 - progress;
        }
    }
});
