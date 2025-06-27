document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('nav ul');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Account for fixed header and guide navigation
                const headerHeight = document.querySelector('header').offsetHeight;
                const guideNavHeight = document.querySelector('.guide-nav').offsetHeight;
                const totalOffset = headerHeight + guideNavHeight + 20; // Extra padding
                
                window.scrollTo({
                    top: targetElement.offsetTop - totalOffset,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                }
            }
        });
    });

    // Highlight active section in navigation
    const sections = document.querySelectorAll('.guide-section');
    const navLinks = document.querySelectorAll('.guide-nav a');

    function highlightActiveSection() {
        const scrollPosition = window.scrollY;
        
        // Get header and nav heights for offset calculation
        const headerHeight = document.querySelector('header').offsetHeight;
        const guideNavHeight = document.querySelector('.guide-nav').offsetHeight;
        const totalOffset = headerHeight + guideNavHeight + 50; // Extra padding
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - totalOffset;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const id = section.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection(); // Run once on page load
});