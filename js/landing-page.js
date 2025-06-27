document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Mobile menu toggle
    initializeMobileNavigation();

    function initializeMobileNavigation() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.querySelector('nav ul');
        const mobileNavOverlay = document.getElementById('mobileNavOverlay');
        const body = document.body;
        let isMenuOpen = false;

        if (!mobileMenuToggle || !navMenu) return;

        // Toggle mobile menu
        function toggleMobileMenu() {
            isMenuOpen = !isMenuOpen;

            // Update button state
            mobileMenuToggle.classList.toggle('active', isMenuOpen);
            mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen.toString());

            // Update menu visibility
            navMenu.classList.toggle('show', isMenuOpen);

            // Update overlay
            if (mobileNavOverlay) {
                mobileNavOverlay.classList.toggle('show', isMenuOpen);
            }

            // Prevent body scroll when menu is open
            body.style.overflow = isMenuOpen ? 'hidden' : '';

            // Focus management
            if (isMenuOpen) {
                // Focus first menu item when opening
                const firstMenuItem = navMenu.querySelector('a');
                if (firstMenuItem) {
                    setTimeout(() => firstMenuItem.focus(), 100);
                }
            } else {
                // Return focus to toggle button when closing
                mobileMenuToggle.focus();
            }
        }

        // Close mobile menu
        function closeMobileMenu() {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        }

        // Event listeners
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);

        // Close menu when clicking overlay
        if (mobileNavOverlay) {
            mobileNavOverlay.addEventListener('click', closeMobileMenu);
        }

        // Close menu when clicking menu links
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Small delay to allow navigation to complete
                setTimeout(closeMobileMenu, 100);
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });

        // Close menu on window resize if screen becomes larger
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMobileMenu();
            }
        });

        // Trap focus within mobile menu when open
        document.addEventListener('keydown', function(e) {
            if (!isMenuOpen || e.key !== 'Tab') return;

            const focusableElements = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    // Language selector functionality
    const languageSelector = document.getElementById('languageSelector');

    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const selectedLanguage = this.value;

            if (selectedLanguage === 'fr') {
                alert('Changing language to French. This feature is coming soon!');
                // Reset to English for now
                this.value = 'en';
            }
        });
    }

    // Hero Section Functionality
    initializeHeroSection();

    // Features Section Functionality
    initializeFeaturesSection();

    // How It Works Section Functionality
    initializeHowItWorksSection();

    // Testimonials Section Functionality
    initializeTestimonialsSection();

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                }
            }
        });
    });

    // Enhanced scroll animations
    initializeScrollAnimations();
});

// Hero Section Initialization
function initializeHeroSection() {
    // Handle CTA button clicks
    const ctaButtons = document.querySelectorAll('.hero__cta-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            handleGetStarted(role);
        });
    });

    // Handle scroll indicator click
    const scrollIndicator = document.querySelector('.hero__scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                window.scrollTo({
                    top: featuresSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Trigger initial animations
    setTimeout(() => {
        triggerHeroAnimations();
    }, 300);
}

// Handle Get Started button clicks
function handleGetStarted(role) {
    const routes = {
        farmer: 'Farmer/signupfarmer.html',
        buyer: 'Buyer/signupbuyer.html'
    };

    const targetUrl = routes[role];
    if (targetUrl) {
        // Add a small delay for better UX
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 150);
    }
}

// Trigger hero animations on load
function triggerHeroAnimations() {
    const animatedElements = document.querySelectorAll('.hero-animate-fade-up, .hero-animate-slide-left');

    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate');
        }, index * 200);
    });
}

// Features Section Initialization
function initializeFeaturesSection() {
    // Handle CTA button clicks
    const ctaButtons = document.querySelectorAll('.features__cta-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            handleGetStarted(role);
        });
    });

    // Initialize staggered animations
    initializeStaggeredAnimations();
}

// Initialize staggered animations for features
function initializeStaggeredAnimations() {
    const staggeredElements = document.querySelectorAll('.features-animate-stagger');

    function triggerStaggeredAnimations() {
        staggeredElements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                const staggerIndex = parseInt(element.getAttribute('data-stagger-index')) || index;
                setTimeout(() => {
                    element.classList.add('animate');
                }, staggerIndex * 150);
            }
        });
    }

    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(triggerStaggeredAnimations);
            ticking = true;
            setTimeout(() => {
                ticking = false;
            }, 16);
        }
    }

    // Check on scroll
    window.addEventListener('scroll', requestTick);

    // Check on initial load
    triggerStaggeredAnimations();
}

// How It Works Section Initialization
function initializeHowItWorksSection() {
    // Handle tab switching
    const tabs = document.querySelectorAll('.how-it-works__tab');
    const stepContainers = document.querySelectorAll('.how-it-works__steps');
    const ctaButton = document.querySelector('.how-it-works__cta-button');

    let activeTab = 'farmer';

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            switchTab(tabType);
        });
    });

    function switchTab(tabType) {
        if (tabType === activeTab) return;

        activeTab = tabType;

        // Update tab appearance
        tabs.forEach(tab => {
            tab.classList.remove('how-it-works__tab--active');
            if (tab.getAttribute('data-tab') === tabType) {
                tab.classList.add('how-it-works__tab--active');
            }
        });

        // Switch step containers
        stepContainers.forEach(container => {
            const containerType = container.getAttribute('data-steps');
            if (containerType === tabType) {
                container.style.display = 'grid';
                // Trigger animation
                setTimeout(() => {
                    container.classList.add('animate');
                }, 50);
            } else {
                container.style.display = 'none';
                container.classList.remove('animate');
            }
        });

        // Update CTA button
        if (ctaButton) {
            ctaButton.setAttribute('data-role', tabType);
            ctaButton.textContent = `Get Started as ${tabType === 'farmer' ? 'Farmer' : 'Buyer'}`;
        }
    }

    // Handle CTA button click
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            handleGetStarted(role);
        });
    }

    // Initialize with farmer tab active
    switchTab('farmer');
}

// Testimonials Section Initialization
function initializeTestimonialsSection() {
    // Testimonials data
    const testimonials = [
        {
            id: '1',
            name: 'Marie Ngozi',
            role: 'Vegetable Farmer',
            location: 'Douala, Littoral',
            avatar: 'https://ui-avatars.com/api/?name=Marie%20Ngozi&background=16a34a&color=fff&size=80',
            content: 'Farm2Market has transformed my business! I now sell directly to restaurants and hotels in Douala. My income has increased by 60% and I have built lasting relationships with my customers.',
            rating: 5,
            type: 'farmer'
        },
        {
            id: '2',
            name: 'Jean-Baptiste Foka',
            role: 'Restaurant Owner',
            location: 'Yaoundé, Centre',
            avatar: 'https://ui-avatars.com/api/?name=Jean-Baptiste%20Foka&background=16a34a&color=fff&size=80',
            content: 'The quality of produce I get through Farm2Market is exceptional. Fresh vegetables delivered the same day they are harvested. My customers notice the difference in taste!',
            rating: 5,
            type: 'buyer'
        },
        {
            id: '3',
            name: 'Aminata Sow',
            role: 'Fruit Farmer',
            location: 'Bafoussam, West',
            avatar: 'https://ui-avatars.com/api/?name=Aminata%20Sow&background=16a34a&color=fff&size=80',
            content: 'Before Farm2Market, I struggled to find buyers for my mangoes and avocados. Now I have regular customers and can plan my harvests better. The messaging system is so helpful!',
            rating: 5,
            type: 'farmer'
        },
        {
            id: '4',
            name: 'Paul Mbarga',
            role: 'Grocery Store Owner',
            location: 'Bamenda, Northwest',
            avatar: 'https://ui-avatars.com/api/?name=Paul%20Mbarga&background=16a34a&color=fff&size=80',
            content: 'I love being able to source fresh produce directly from local farmers. The prices are fair, the quality is great, and I am supporting my community. Win-win!',
            rating: 5,
            type: 'buyer'
        },
        {
            id: '5',
            name: 'Grace Tabi',
            role: 'Organic Farmer',
            location: 'Limbe, Southwest',
            avatar: 'https://ui-avatars.com/api/?name=Grace%20Tabi&background=16a34a&color=fff&size=80',
            content: 'As an organic farmer, finding customers who appreciate quality was difficult. Farm2Market connected me with health-conscious buyers who value what I grow.',
            rating: 5,
            type: 'farmer'
        },
        {
            id: '6',
            name: 'Samuel Njoya',
            role: 'Hotel Manager',
            location: 'Kribi, South',
            avatar: 'https://ui-avatars.com/api/?name=Samuel%20Njoya&background=16a34a&color=fff&size=80',
            content: 'Our hotel guests love the fresh, local ingredients in our meals. Farm2Market makes it easy to source quality produce and support local farmers at the same time.',
            rating: 5,
            type: 'buyer'
        }
    ];

    let activeIndex = 0;
    let autoRotateInterval;

    // Get DOM elements
    const indicators = document.querySelectorAll('.testimonials__indicator');
    const contentElement = document.querySelector('[data-testimonial="content"]');
    const nameElement = document.querySelector('[data-testimonial="name"]');
    const roleElement = document.querySelector('[data-testimonial="role"]');
    const locationElement = document.querySelector('[data-testimonial="location"]');
    const avatarElement = document.querySelector('[data-testimonial="avatar"]');
    const badgeElement = document.querySelector('[data-testimonial="badge"]');

    // Update featured testimonial
    function updateFeaturedTestimonial(index) {
        const testimonial = testimonials[index];

        if (contentElement) contentElement.textContent = testimonial.content;
        if (nameElement) nameElement.textContent = testimonial.name;
        if (roleElement) roleElement.textContent = testimonial.role;
        if (locationElement) locationElement.textContent = testimonial.location;
        if (avatarElement) {
            avatarElement.src = testimonial.avatar;
            avatarElement.alt = testimonial.name;
        }
        if (badgeElement) {
            badgeElement.textContent = testimonial.type === 'farmer' ? '🌱 Farmer' : '🛒 Buyer';
            badgeElement.className = `testimonials__badge testimonials__badge--${testimonial.type}`;
        }

        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('testimonials__indicator--active', i === index);
        });
    }

    // Set active testimonial
    function setActiveTestimonial(index) {
        activeIndex = index;
        updateFeaturedTestimonial(index);
        resetAutoRotate();
    }

    // Auto-rotate testimonials
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            activeIndex = (activeIndex + 1) % testimonials.length;
            updateFeaturedTestimonial(activeIndex);
        }, 5000);
    }

    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    // Handle indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            setActiveTestimonial(index);
        });
    });

    // Initialize
    updateFeaturedTestimonial(0);
    startAutoRotate();

    // Pause auto-rotate on hover
    const carousel = document.querySelector('.testimonials__carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            startAutoRotate();
        });
    }
}

// Enhanced scroll animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .step, .features-animate-fade-up, .how-it-works-animate-fade-up, .how-it-works-animate-slide-right, .how-it-works-animate-slide-left, .testimonials-animate-fade-up, .testimonials-animate-scale-up');

    function checkScroll() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
                element.classList.add('animate');
            }
        });
    }

    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(checkScroll);
            ticking = true;
            setTimeout(() => {
                ticking = false;
            }, 16);
        }
    }

    // Check on scroll
    window.addEventListener('scroll', requestTick);

    // Check on initial load
    checkScroll();
}



