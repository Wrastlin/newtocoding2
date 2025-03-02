// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Initialize particles.js if available
    if (window.particlesJS && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#4361ee"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false
                },
                "size": {
                    "value": 3,
                    "random": true
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#4361ee",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "out_mode": "out"
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                }
            },
            "retina_detect": true
        });
    }
    
    // Typing effect in hero section
    const typingTextElement = document.getElementById('typing-text');
    const typingCursor = document.querySelector('.typing-cursor');
    const phrasesToType = [
        'HTML & CSS',
        'JavaScript',
        'Python',
        'React',
        'Data Science',
        'Web Development',
        'App Development'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isTyping = true;
    let typingInterval;
    
    function typeEffect() {
        const currentPhrase = phrasesToType[phraseIndex];
        
        if (isTyping) {
            // Typing forward
            if (charIndex < currentPhrase.length) {
                typingTextElement.textContent += currentPhrase.charAt(charIndex);
                charIndex++;
            } else {
                // Done typing current phrase
                isTyping = false;
                // Pause at the end of the phrase before deleting
                clearInterval(typingInterval);
                setTimeout(function() {
                    typingInterval = setInterval(typeEffect, 100);
                }, 1500);
            }
        } else {
            // Deleting
            if (charIndex > 0) {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Done deleting
                isTyping = true;
                // Move to next phrase
                phraseIndex = (phraseIndex + 1) % phrasesToType.length;
            }
        }
        
        // Blink cursor effect
        typingCursor.style.opacity = typingCursor.style.opacity === '0' ? '1' : '0';
    }
    
    // Start typing effect if element exists
    if (typingTextElement && typingCursor) {
        typingInterval = setInterval(typeEffect, 100);
        // Fix cursor blinking independent of typing
        setInterval(function() {
            if (document.hasFocus()) {
                typingCursor.style.opacity = typingCursor.style.opacity === '0' ? '1' : '0';
            }
        }, 500);
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('header nav a, .hero-buttons a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply to hash links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        menuToggle.classList.remove('active');
                    }
                    
                    // Calculate header height for offset
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    // Scroll to element with offset for header
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Simple form validation
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const experience = document.getElementById('experience').value;
            
            // Very basic validation
            if (name === '' || email === '') {
                alert('Please fill out all required fields.');
                return;
            }
            
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Success message - in a real app, you would submit this data to a server
            alert(`Thank you for subscribing, ${name}! We'll send updates to ${email}.`);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.benefit-card, .resource-card, .feature, .contact-form, .social-links');
        
        elements.forEach(element => {
            // Get element position relative to viewport
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // If element is in viewport
            if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run on scroll and initially
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
    
    // Interactive code window
    const codeWindow = document.querySelector('.code-window');
    const consoleOutput = document.getElementById('console-output');
    
    if (codeWindow) {
        // Animate code execution when user hovers or clicks on code window
        codeWindow.addEventListener('mouseenter', function() {
            this.classList.add('active');
            // Don't auto-run on hover to avoid overwhelming the user
        });
        
        codeWindow.addEventListener('click', function() {
            animateCodeExecution();
        });
        
        codeWindow.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
        
        // Function to animate code execution and output
        function animateCodeExecution() {
            // Clear previous output
            if (consoleOutput) {
                consoleOutput.innerHTML = '';
                consoleOutput.classList.remove('complete');
                
                // Typing effect for console output
                const message = "Hello, World! Welcome to NewToCoding!";
                const successReturn = "Beginning your coding journey...";
                
                // First show "running..." message
                const runningMsg = document.createElement('div');
                runningMsg.className = 'console-line running';
                runningMsg.textContent = '> Running code...';
                consoleOutput.appendChild(runningMsg);
                
                // Then show output after delay
                setTimeout(() => {
                    const outputLine = document.createElement('div');
                    outputLine.className = 'console-line output';
                    outputLine.textContent = '> ' + message;
                    consoleOutput.appendChild(outputLine);
                    
                    // Then show return value
                    setTimeout(() => {
                        const returnLine = document.createElement('div');
                        returnLine.className = 'console-line return';
                        returnLine.textContent = '< ' + successReturn;
                        consoleOutput.appendChild(returnLine);
                        
                        consoleOutput.classList.add('complete');
                    }, 800);
                }, 600);
            }
        }
        
        // Run once on page load after a slight delay
        setTimeout(animateCodeExecution, 2000);
    }
    
    // Theme toggle (dark mode) functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use device preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && 
                       localStorage.getItem('darkMode') === null);
    
    // Apply initial theme
    if (isDarkMode) {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Toggle theme when clicking the theme button
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Toggle icon
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'true');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'false');
        }
    });
    
    // Add scroll to top functionality
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show button when scrolling down
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicking button
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Success Stories Slider
    const initStorySlider = function() {
        const slider = document.querySelector('.stories-slider');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dots = document.querySelectorAll('.dot');
        
        if (!slider || !prevBtn || !nextBtn) return;
        
        let currentIndex = 0;
        const storyCards = document.querySelectorAll('.story-card');
        const totalStories = storyCards.length;
        
        // Set initial position
        updateSlider();
        
        // Event listeners for navigation
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + totalStories) % totalStories;
            updateSlider();
        });
        
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % totalStories;
            updateSlider();
        });
        
        // Dot navigation
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                currentIndex = parseInt(this.getAttribute('data-index'));
                updateSlider();
            });
        });
        
        // Auto-advance every 6 seconds
        let autoAdvance = setInterval(startAutoAdvance, 6000);
        
        function startAutoAdvance() {
            currentIndex = (currentIndex + 1) % totalStories;
            updateSlider();
        }
        
        // Stop auto-advance when user interacts with slider
        slider.addEventListener('mouseenter', function() {
            clearInterval(autoAdvance);
        });
        
        // Resume auto-advance when user leaves slider
        slider.addEventListener('mouseleave', function() {
            clearInterval(autoAdvance);
            autoAdvance = setInterval(startAutoAdvance, 6000);
        });
        
        // Function to update slider position and active dot
        function updateSlider() {
            // Update slider position with translateX (fix for transform not working properly)
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Add transition class to create smooth slide effect
            slider.classList.add('sliding');
            
            // Remove transition class after animation completes
            setTimeout(() => {
                slider.classList.remove('sliding');
            }, 600);
            
            // Update active dot
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // Add active class to current slide and remove from others
            storyCards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active-slide');
                } else {
                    card.classList.remove('active-slide');
                }
            });
        }
        
        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoAdvance);
        }, { passive: true });
        
        slider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            // Resume auto advance after swipe
            autoAdvance = setInterval(startAutoAdvance, 6000);
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, go to next slide
                currentIndex = (currentIndex + 1) % totalStories;
                updateSlider();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go to previous slide
                currentIndex = (currentIndex - 1 + totalStories) % totalStories;
                updateSlider();
            }
        }
    };
    
    // Initialize slider if it exists
    initStorySlider();
    
    // Animate floating icons on mouse movement
    const floatingIcons = document.querySelectorAll('.tech-icon');
    const hero = document.querySelector('.hero');
    
    if (floatingIcons.length > 0 && hero) {
        // Set data-speed attribute for each icon if not already set
        floatingIcons.forEach((icon, index) => {
            if (!icon.hasAttribute('data-speed')) {
                // Assign different speeds to create depth effect
                const speeds = [0.01, 0.02, 0.015, 0.025, 0.018, 0.012];
                icon.setAttribute('data-speed', speeds[index % speeds.length]);
            }
        });
        
        hero.addEventListener('mousemove', function(e) {
            // Get mouse position relative to hero section
            const mouseX = e.clientX;
            const mouseY = e.clientY - hero.getBoundingClientRect().top;
            
            // Move icons slightly based on mouse position
            floatingIcons.forEach(icon => {
                const speed = parseFloat(icon.getAttribute('data-speed'));
                const x = (window.innerWidth - mouseX * speed) / 100;
                const y = (window.innerHeight - mouseY * speed) / 100;
                
                // Apply transform with different speeds based on data-speed
                // Use translate3d for smoother performance
                icon.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
        });
        
        // Reset position when mouse leaves with a smooth transition
        hero.addEventListener('mouseleave', function() {
            floatingIcons.forEach(icon => {
                icon.style.transition = 'transform 1s ease-out';
                icon.style.transform = 'translate3d(0, 0, 0)';
                
                // Remove transition after animation completes to avoid affecting the float animation
                setTimeout(() => {
                    icon.style.transition = '';
                }, 1000);
            });
        });
    }
    
    // Animate count-up for statistics
    function animateCountUp() {
        const statsElements = document.querySelectorAll('.stat-number');
        
        if (statsElements.length > 0) {
            statsElements.forEach(element => {
                // Get target value from data attribute or default to 0
                const target = parseInt(element.getAttribute('data-count') || '0', 10);
                
                // If stat is already counted or target is 0, skip
                if (element.classList.contains('counted') || target === 0) return;
                
                // Start from 0
                let count = 0;
                
                // Determine step size and duration based on target value
                const duration = 2000; // ms
                const steps = 60;
                const interval = duration / steps;
                const increment = Math.ceil(target / steps);
                
                // Animate count up
                const timer = setInterval(() => {
                    count += increment;
                    
                    // If reached or exceeded target, set final value and clear interval
                    if (count >= target) {
                        element.textContent = target.toLocaleString();
                        element.classList.add('counted');
                        clearInterval(timer);
                    } else {
                        element.textContent = count.toLocaleString();
                    }
                }, interval);
            });
        }
    }
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Run count-up animation when stats come into view
    function checkStatsVisibility() {
        const statsSection = document.querySelector('.community-stats');
        if (statsSection && isInViewport(statsSection)) {
            animateCountUp();
            // Remove scroll listener once animation has started
            window.removeEventListener('scroll', checkStatsVisibility);
        }
    }
    
    // Add scroll event listener for stats
    window.addEventListener('scroll', checkStatsVisibility);
    // Check on initial load as well
    window.addEventListener('load', checkStatsVisibility);
    
    // Ensure tech icons are properly handled
    function initTechIcons() {
        // Add tech icon classes to match specific icons
        const techIcons = document.querySelectorAll('.tech-icon');
        
        if (techIcons.length > 0) {
            // Define icon types to cycle through if not explicitly set
            const iconTypes = ['html-icon', 'css-icon', 'js-icon', 'react-icon', 'python-icon', 'node-icon'];
            
            techIcons.forEach((icon, index) => {
                // If icon doesn't have a specific type class, assign one
                if (!icon.classList.contains('html-icon') && 
                    !icon.classList.contains('css-icon') && 
                    !icon.classList.contains('js-icon') && 
                    !icon.classList.contains('react-icon') && 
                    !icon.classList.contains('python-icon') && 
                    !icon.classList.contains('node-icon')) {
                    
                    // Add class based on index (cycling through available types)
                    icon.classList.add(iconTypes[index % iconTypes.length]);
                    
                    // If icon doesn't have an i element with a class, add the appropriate one
                    if (!icon.querySelector('i')) {
                        const iconElement = document.createElement('i');
                        
                        // Set the appropriate font awesome classes based on technology
                        if (icon.classList.contains('html-icon')) {
                            iconElement.className = 'fab fa-html5';
                        } else if (icon.classList.contains('css-icon')) {
                            iconElement.className = 'fab fa-css3-alt';
                        } else if (icon.classList.contains('js-icon')) {
                            iconElement.className = 'fab fa-js';
                        } else if (icon.classList.contains('react-icon')) {
                            iconElement.className = 'fab fa-react';
                        } else if (icon.classList.contains('python-icon')) {
                            iconElement.className = 'fab fa-python';
                        } else if (icon.classList.contains('node-icon')) {
                            iconElement.className = 'fab fa-node-js';
                        }
                        
                        icon.appendChild(iconElement);
                    }
                }
            });
        }
    }
    
    // Call tech icons initialization on page load
    window.addEventListener('load', initTechIcons);
}); 