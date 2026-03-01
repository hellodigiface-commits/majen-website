// Initialize all event listeners - called after partials load
function initApp() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        });
    }

    // Scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add scroll-animate class to elements and observe them
    const animateElements = document.querySelectorAll(
        '.feature-card, .phone-mockup, .clients-content, .clients-images, ' +
        '.designers-content, .designers-images, .step, .team-member, .faq-item'
    );

    animateElements.forEach((el, index) => {
        el.classList.add('scroll-animate');
        el.style.transitionDelay = `${index % 4 * 0.1}s`;
        observer.observe(el);
    });

    // Impact accordion
    const impactItems = document.querySelectorAll('.impact-accordion-item');

    impactItems.forEach(item => {
        const question = item.querySelector('.impact-accordion-question');
        if (!question) return;

        question.addEventListener('click', () => {
            impactItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // Add active state to navigation based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const navHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Waitlist form handler
    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm) {
        const submitBtn = document.getElementById('waitlist-submit-btn');
        const successMsg = document.getElementById('form-success');
        const errorMsg = document.getElementById('form-error');

        // Conditional field: show ease of ordering when "Yes" is selected
        const customClothingRadios = waitlistForm.querySelectorAll('input[name="custom_clothing_africa"]');
        const easeGroup = document.getElementById('ease-of-ordering-group');
        customClothingRadios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                easeGroup.style.display = this.value === 'Yes' ? 'flex' : 'none';
            });
        });

        // Range slider value display
        var rangeInput = document.getElementById('ease_of_ordering');
        var scaleValue = document.getElementById('scale-value');
        if (rangeInput && scaleValue) {
            rangeInput.addEventListener('input', function() {
                scaleValue.textContent = this.value;
            });
        }

        // Form submit via Web3Forms
        waitlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            // Build JSON payload for Web3Forms
            var formData = new FormData(waitlistForm);
            var data = { access_key: '4117fc94-34a3-498d-b2e7-4fb7ff9a411c', subject: 'New Waitlist Signup' };

            formData.forEach(function(value, key) {
                if (key === 'shopping_habits' || key === 'likes_about_african_brands' || key === 'improvements') return;
                data[key] = value;
            });

            // Gather checkbox values into comma-separated strings
            var checkboxFields = ['shopping_habits', 'likes_about_african_brands', 'improvements'];
            checkboxFields.forEach(function(field) {
                var checked = waitlistForm.querySelectorAll('input[name="' + field + '"]:checked');
                var values = [];
                checked.forEach(function(cb) { values.push(cb.value); });
                data[field] = values.join(', ');
            });

            // If custom clothing is "No", clear ease_of_ordering
            if (data.custom_clothing_africa !== 'Yes') {
                data.ease_of_ordering = '';
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(function(response) { return response.json(); })
                .then(function(result) {
                    if (result.success) {
                        successMsg.style.display = 'block';
                        waitlistForm.reset();
                        easeGroup.style.display = 'none';
                        if (scaleValue) scaleValue.textContent = '5';
                    } else {
                        errorMsg.style.display = 'block';
                    }
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Join the Waitlist';
                })
                .catch(function() {
                    errorMsg.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Join the Waitlist';
                });
        });
    }

    // Contact form handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const contactSubmitBtn = document.getElementById('contact-submit-btn');
        const contactSuccess = document.getElementById('contact-success');
        const contactError = document.getElementById('contact-error');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            contactSuccess.style.display = 'none';
            contactError.style.display = 'none';
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = 'Submitting...';

            var formData = new FormData(contactForm);
            var data = { access_key: 'c031706e-32f2-4053-b530-9646bef72ac5', subject: 'New Contact Form Message' };
            formData.forEach(function(value, key) {
                data[key] = value;
            });

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(function(response) { return response.json(); })
                .then(function(result) {
                    if (result.success) {
                        contactSuccess.style.display = 'block';
                        contactForm.reset();
                    } else {
                        contactError.style.display = 'block';
                    }
                    contactSubmitBtn.disabled = false;
                    contactSubmitBtn.textContent = 'Submit';
                })
                .catch(function() {
                    contactError.style.display = 'block';
                    contactSubmitBtn.disabled = false;
                    contactSubmitBtn.textContent = 'Submit';
                });
        });
    }

    // Order form handler
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        // Populate US states dropdown
        var stateSelect = document.getElementById('order-state');
        if (stateSelect) {
            var states = [
                'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
                'Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois',
                'Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
                'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
                'New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota',
                'Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
                'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington',
                'West Virginia','Wisconsin','Wyoming'
            ];
            states.forEach(function(s) {
                var opt = document.createElement('option');
                opt.value = s;
                opt.textContent = s;
                stateSelect.appendChild(opt);
            });
        }

        var orderSubmitBtn = document.getElementById('order-submit-btn');
        var orderSuccess = document.getElementById('order-success');
        var orderError = document.getElementById('order-error');

        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            orderSuccess.style.display = 'none';
            orderError.style.display = 'none';
            orderSubmitBtn.disabled = true;
            orderSubmitBtn.textContent = 'Submitting...';

            var formData = new FormData(orderForm);
            var data = { access_key: '20f29323-f2b0-4b0a-838b-84c3f761fdf3', subject: 'New Order Request' };
            formData.forEach(function(value, key) {
                data[key] = value;
            });

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(function(response) { return response.json(); })
                .then(function(result) {
                    if (result.success) {
                        orderSuccess.style.display = 'block';
                        orderForm.reset();
                    } else {
                        orderError.style.display = 'block';
                    }
                    orderSubmitBtn.disabled = false;
                    orderSubmitBtn.textContent = 'Submit Order';
                })
                .catch(function() {
                    orderError.style.display = 'block';
                    orderSubmitBtn.disabled = false;
                    orderSubmitBtn.textContent = 'Submit Order';
                });
        });
    }

}

// Load partials (nav and footer) then initialize
function loadPartials() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    const promises = [];

    if (navPlaceholder) {
        promises.push(
            fetch('partials/nav.html')
                .then(r => r.text())
                .then(html => { navPlaceholder.innerHTML = html; })
        );
    }

    if (footerPlaceholder) {
        promises.push(
            fetch('partials/footer.html')
                .then(r => r.text())
                .then(html => { footerPlaceholder.innerHTML = html; })
        );
    }

    if (promises.length > 0) {
        Promise.all(promises).then(() => {
            initApp();
        });
    } else {
        // No partials to load, init directly
        initApp();
    }
}

// Responsive hero video source switching
function setHeroVideoSource() {
    const video = document.getElementById('hero-video');
    if (!video) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const newSrc = isMobile ? 'images/hero-video-mobile.mp4' : 'images/hero-video-desktop.mp4';

    const currentSource = video.querySelector('source');
    if (currentSource && currentSource.getAttribute('src') === newSrc) return;

    // Remove existing source if any
    if (currentSource) currentSource.remove();

    const source = document.createElement('source');
    source.src = newSrc;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();
    video.play();
}

// Page load animation
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for any initial animations
    document.body.classList.add('loaded');

    // Set responsive hero video before loading partials
    setHeroVideoSource();

    // Debounced resize handler for orientation changes
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setHeroVideoSource, 300);
    });

    // Load partials then init
    loadPartials();

    // Animate hero content on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('fade-in-up');
    }
});

// Preloader removal — wait for all assets to finish loading
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Wait a moment for the spin animation to finish (1.4s) then fade out
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.remove();
            }, 600);
        }, 1600);
    }
});
