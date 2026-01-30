/**
 * AI Corp Website - Main JavaScript
 * Handles header, scroll animations, mobile menu, and language switching
 */

// ========================================
// Configuration
// ========================================
const CONFIG = {
    headerScrollThreshold: 50,
    animationRootMargin: '0px 0px -50px 0px',
    animationThreshold: 0.1
};

// ========================================
// Header Functionality
// ========================================
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = 0;
        this.init();
    }

    init() {
        if (!this.header) return;

        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

        // Initial check
        this.handleScroll();
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class
        if (currentScrollY > CONFIG.headerScrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        this.lastScrollY = currentScrollY;
    }
}

// ========================================
// Mobile Menu
// ========================================
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileMenuToggle');
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        if (!this.toggle || !this.nav) return;

        // Toggle menu
        this.toggle.addEventListener('click', () => this.toggleMenu());

        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.nav.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.nav.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.nav.classList.toggle('active');
        this.toggle.classList.toggle('active');
        document.body.style.overflow = this.nav.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.nav.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// Language Switcher
// ========================================
class LanguageSwitcher {
    constructor() {
        this.toggle = document.getElementById('languageToggle');
        this.dropdown = document.getElementById('languageDropdown');
        this.langButtons = document.querySelectorAll('.language-option');
        this.currentLangSpan = document.querySelector('.current-lang');
        this.init();
    }

    init() {
        if (!this.toggle || !this.dropdown) return;

        // Toggle dropdown
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close dropdown on outside click
        document.addEventListener('click', () => this.closeDropdown());

        // Language selection
        this.langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.changeLanguage(lang);
            });
        });

        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        this.toggle.parentElement.classList.toggle('active');
    }

    closeDropdown() {
        this.toggle.parentElement.classList.remove('active');
    }

    changeLanguage(lang) {
        // Update current language display
        const langMap = {
            'ja': 'JA',
            'en': 'EN',
            'zh': 'ZH'
        };

        if (this.currentLangSpan) {
            this.currentLangSpan.textContent = langMap[lang] || lang.toUpperCase();
        }

        // Save to localStorage (for future use with i18n)
        localStorage.setItem('preferredLanguage', lang);

        // Close dropdown
        this.closeDropdown();

        // i18n translation will be handled by Worker2's implementation
        console.log(`Language changed to: ${lang}`);
    }
}

// ========================================
// Scroll Animations
// ========================================
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.init();
    }

    init() {
        if (this.animatedElements.length === 0) return;

        // Set up Intersection Observer
        const observerOptions = {
            root: null,
            rootMargin: CONFIG.animationRootMargin,
            threshold: CONFIG.animationThreshold
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements
        this.animatedElements.forEach(el => {
            // Apply delay from attribute
            const delay = el.dataset.animateDelay;
            if (delay) {
                el.style.setProperty('--delay', delay);
            }
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        // Add visible class to trigger animation
        element.classList.add('animate-visible');

        // Stop observing once animated (optional - remove if you want re-animation)
        this.observer.unobserve(element);
    }
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    this.scrollTo(target);
                }
            });
        });
    }

    scrollTo(target) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ========================================
// Form Validation (Basic)
// ========================================
class FormValidation {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        // Basic validation
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        // Email validation
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
            }
        }

        // Privacy checkbox
        const privacyCheckbox = this.form.querySelector('input[type="checkbox"][required]');
        if (privacyCheckbox && !privacyCheckbox.checked) {
            isValid = false;
        }

        if (isValid) {
            // Show success message (in real implementation, send to server)
            alert('お問い合わせありがとうございます。\n内容を確認次第、ご連絡いたします。');
            this.form.reset();
        } else {
            // Show error message
            alert('必須項目を入力してください。');
        }
    }
}

// ========================================
// Initialize All Features
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Header functionality
    new HeaderManager();

    // Mobile menu
    new MobileMenu();

    // Language switcher
    new LanguageSwitcher();

    // Scroll animations
    new ScrollAnimations();

    // Smooth scroll
    new SmoothScroll();

    // Form validation
    new FormValidation();

    console.log('AI Corp Website initialized');
});

// ========================================
// Utility Functions
// ========================================

// Debounce function for performance
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};
