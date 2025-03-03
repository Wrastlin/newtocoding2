// Global variables
let isMobile = false;

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded - initializing scripts");
    
    // Check if using mobile device
    isMobile = window.innerWidth <= 768;
    
    // Mobile menu toggle - Critical functionality, keep at top
    initMobileMenu();
    
    // Initialize only critical components immediately
    initScrollHandlers();
    
    // Force immediate animations for content that's in the viewport
    setTimeout(() => {
        console.log("Forcing initial animations for visible content");
        document.querySelectorAll('.animated, .animated-block, .slide-in-text, .fade-in-words, .highlight-animation, .typing-animation, .typewriter, .fade-in').forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                console.log(`Activating element on load:`, element);
                element.classList.add('in-view');
                element.classList.add('fadeInUp');
            }
        });
    }, 100);
    
    // Defer non-critical initializations
    if (document.getElementById('particles-js')) {
        // Load particles.js only if the element exists and after a small delay
        setTimeout(() => initParticles(), 1000);
    }
    
    // Defer other non-critical features
    window.addEventListener('load', function() {
        console.log("Window fully loaded - initializing deferred components");
        
        // Initialize components only if their elements exist in the page
        if (document.querySelector('.typing-container')) {
            setTimeout(() => typeEffect(), 500);
        }
        
        if (document.querySelector('.stories-slider')) {
            setTimeout(() => initStorySlider(), 1000);
        }
        
        if (document.querySelector('.floating-icons')) {
            setTimeout(() => initTechIcons(), 1500);
        }
        
        if (document.querySelector('.community-stats')) {
            initIntersectionObserver('.stat-number', animateCountUp);
        }
        
        if (document.querySelector('.animated')) {
            initIntersectionObserver('.animated', element => element.classList.add('fadeInUp'));
        }
        
        if (document.querySelector('.topics-scrollwheel')) {
            setTimeout(() => initTopicsScrollwheel(), 2000);
        }
        
        if (document.querySelector('.posts-grid')) {
            setTimeout(() => initBlogPosts(), 1000);
        }
        
        // Force animations in about section
        forceInitialAnimations();
        
        // Initialize other components as needed
        setTimeout(() => {
            setupFeatureTooltips();
            initBuilderBotAnimations();
            optimizeAnimations();
        }, 2000);
    });
});

// Helper function to initialize intersection observer for lazy loading elements
function initIntersectionObserver(selector, callback) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
}

// Initialize mobile menu - Critical functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// Initialize scroll handlers - Critical functionality
function initScrollHandlers() {
    // Use optimized scroll handler with throttling
    let lastScrollTop = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Handle header scroll effect
                const header = document.querySelector('header');
                if (header) {
                    if (currentScrollTop > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }
                
                // Handle back to top button 
                const backToTop = document.querySelector('.back-to-top');
                if (backToTop) {
                    if (currentScrollTop > 300) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                }
                
                lastScrollTop = currentScrollTop;
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    // Back to top button click handler
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize particles.js with highly optimized settings
function initParticles() {
    const isMobile = window.innerWidth <= 768;
    
    if (window.particlesJS && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": isMobile ? 10 : 20, // Significantly reduced particle count
                    "density": {
                        "enable": true,
                        "value_area": 1000
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
                    "value": isMobile ? 0.1 : 0.2, // Reduced opacity
                    "random": false
                },
                "size": {
                    "value": 3,
                    "random": true,
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#4361ee",
                    "opacity": 0.1, // Reduced opacity for links
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1, // Reduced speed for better performance
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": false, // Disabled hover effects for better performance
                    },
                    "onclick": {
                        "enable": false, // Disabled click effects for better performance
                    },
                    "resize": true
                }
            },
            "retina_detect": false // Disabled retina detection for better performance
        });
    }
}

// Typing effect in hero section
const phrasesToType = [
    'AI-powered websites',
    'Chatbots that solve problems',
    'Automation tools',
    'Data visualizations',
    'Personal assistants',
    'Custom workflow solutions'
];

let phraseIndex = 0;
let charIndex = 0;
let isTyping = true;
let typingInterval;

function typeEffect() {
    console.log("Starting type effect");
    const typingTextElement = document.getElementById('typing-text');
    const typingCursor = document.querySelector('.typing-cursor');
    
    if (!typingTextElement) {
        console.error("Typing text element not found!");
        return;
    }
    
    // Make sure the typing container is visible
    const typingContainer = document.querySelector('.typing-container');
    if (typingContainer) {
        typingContainer.style.opacity = '1';
        typingContainer.style.visibility = 'visible';
    }
    
    clearInterval(typingInterval); // Clear any existing intervals
    
    const currentPhrase = phrasesToType[phraseIndex];
    
    // Function to handle typing
    const handleTyping = () => {
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
                    typingInterval = setInterval(handleTyping, 100);
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
    };
    
    // Start the typing effect
    typingTextElement.textContent = '';
    charIndex = 0;
    isTyping = true;
    typingInterval = setInterval(handleTyping, 100);
}

// Ensure we run typeEffect even if the typing container wasn't immediately available
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.typing-container')) {
        setTimeout(typeEffect, 500);
    }
});

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

// Function to load YouTube video
function loadLatestYouTubeVideo() {
    // This would typically fetch from an API or CMS
    // For now, we'll use a placeholder or a hardcoded video ID
    const videoContainer = document.querySelector('.video-container');
    const placeholderMessage = document.querySelector('.placeholder-message');
    
    // Example: Replace with your actual video when available
    const videoId = ''; // Empty for now
    
    if (videoId) {
        placeholderMessage.style.display = 'none';
        
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
        iframe.title = "Latest YouTube Video";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        
        videoContainer.appendChild(iframe);
        
        // Update video title and description
        const videoTitle = document.querySelector('.video-info h3');
        const videoDescription = document.querySelector('.video-description');
        
        // This would come from an API in a real implementation
        videoTitle.textContent = "Getting Started with NewToCoding";
        videoDescription.textContent = "Learn how our platform can help you start your coding journey and solve real problems fast.";
    }
}

// Handle missing features with explanatory tooltips
function setupFeatureTooltips() {
    const futureLinks = document.querySelectorAll('a[href="#"]');
    
    futureLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if it's in a section marked as future
            const isInFuture = link.closest('.future-feature') !== null;
            
            if (isInFuture) {
                alert('This feature is coming soon! We\'re working hard to build our community.');
            } else {
                alert('This feature is under development and will be available soon.');
            }
        });
    });
}

// Initialize new features
loadLatestYouTubeVideo();
setupFeatureTooltips();

// Add passive event listeners for better performance on touch devices
const passiveEventSettings = { passive: true };
document.addEventListener('touchstart', function(){}, passiveEventSettings);
document.addEventListener('touchmove', function(){}, passiveEventSettings);

// Optimize animations based on device capabilities
function optimizeAnimations() {
    if (isMobile) {
        // Reduce or disable complex animations on mobile
        const animatedElements = document.querySelectorAll('.animated, .fade-in, .reveal-text');
        animatedElements.forEach(el => {
            el.style.animationDuration = '0.3s';
        });
        
        // Disable floating animations on mobile
        const floatingElements = document.querySelectorAll('.floating-icons, .tech-icon');
        floatingElements.forEach(el => {
            el.style.animation = 'none';
        });
    }
}

// Call optimization function
optimizeAnimations();

// Handle resize events for responsive design
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Re-check device type
        const wasIsMobile = isMobile;
        const newIsMobile = window.innerWidth <= 768;
        
        // Only re-optimize if device type changed
        if (wasIsMobile !== newIsMobile) {
            optimizeAnimations();
        }
    }, 250);
});

// Initialize animations for Builder Bot section
function initBuilderBotAnimations() {
    // Add animation to feature items
    const featureItems = document.querySelectorAll('.builder-bot-features .feature-item');
    if (featureItems.length) {
        featureItems.forEach((item, index) => {
            // Add staggered animation delay
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in');
            
            // Add tilt effect if available
            if (typeof VanillaTilt !== 'undefined') {
                VanillaTilt.init(item, {
                    max: 10,
                    speed: 400,
                    glare: true,
                    'max-glare': 0.1,
                    scale: 1.03
                });
            }
        });
    }
    
    // Add scroll reveal for chatbox container
    const chatboxContainer = document.querySelector('.chatbox-container');
    if (chatboxContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(chatboxContainer);
    }
    
    // Initialize the topics scrollwheel functionality
    initTopicsScrollwheel();
}

// Initialize the build topics scrollwheel
function initTopicsScrollwheel() {
    const scrollwheelContent = document.querySelector('.scrollwheel-content');
    const topicsContainer = document.querySelector('.topics-scrollwheel');
    const scrollwheelContent2 = document.querySelector('.scrollwheel-content-2');
    const topicsContainer2 = document.querySelector('.topics-scrollwheel-2');
    
    if (scrollwheelContent && topicsContainer) {
        // Create a true endless scroll by cloning the content
        const createEndlessScroll = (container, content, startIndex, endIndex) => {
            // Remove any existing animations and clone elements
            content.style.animation = 'none';
            content.innerHTML = '';
            
            // Get original topic items from HTML template
            const topicElements = Array.from(document.querySelectorAll('template#scroll-topics-template')[0]?.content.querySelectorAll('.topic-item') || []);
            
            // If no template exists, get the topics from the original HTML
            if (topicElements.length === 0) {
                // Clone from the current DOM if needed
                const allTopics = [
                    "Innovate your business to accomplish far more",
                    "Predict trends to dominate your market",
                    "Optimize operations with smart tools",
                    "Personalize marketing to win every customer",
                    "Forecast finances like a pro",
                    "Hire top talent with ease",
                    "Master inventory with zero headaches",
                    "Automate reports to save your time",
                    "Price products perfectly with insights",
                    "Grow leads effortlessly with automation",
                    "Create jaw-dropping art",
                    "Compose music that moves the world",
                    "Write epic stories",
                    "Design products everyone will want",
                    "Make videos that go viral fast",
                    "Craft social posts that stand out",
                    "Build virtual worlds anyone can explore",
                    "Edit videos like a pro instantly",
                    "Generate 3D models with ease",
                    "Tell interactive tales that captivate",
                    "Automate nearly any business task",
                    "Streamline workflows with powerful automation",
                    "Manage projects like a superstar",
                    "Schedule meetings without the hassle",
                    "Master your time like a boss",
                    "Tame your inbox with automation",
                    "Organize notes smarter",
                    "Turn data into stunning visuals",
                    "Allocate resources like a genius",
                    "Create docs in record time",
                    "Grow massive influence through creative content",
                    "Boost SEO to rule search engines",
                    "Send emails that win hearts",
                    "Craft marketing content that sells",
                    "Segment customers with precision",
                    "Test campaigns faster",
                    "Target ads like a marketing pro",
                    "Connect with influencers effortlessly",
                    "Map customer journeys that convert",
                    "Analyze rivals in a snap",
                    "Generate code for your next big idea",
                    "Debug apps like a coding ninja",
                    "Test software without breaking a sweat",
                    "Streamline coding with powerful tools",
                    "Write docs that explain themselves",
                    "Collaborate on code with ease",
                    "Deploy apps faster with automation",
                    "Manage databases like a pro",
                    "Build APIs in record time",
                    "Secure your apps with modern solutions",
                    "Build real robots to simplify life",
                    "Automate tasks with robotic helpers",
                    "Assist doctors with robotic tools",
                    "Farm smarter with robotic solutions",
                    "Rescue lives with robotic heroes",
                    "Drive the future with smart vehicles",
                    "Teach kids with robotic tutors",
                    "Clean homes with robotic ease",
                    "Explore new worlds with robots",
                    "Run warehouses with robotic efficiency",
                    "Complete market research in no time",
                    "Analyze data to uncover secrets",
                    "Design experiments with brilliance",
                    "Generate ideas that change science",
                    "Share knowledge smarter",
                    "Win funding with better proposals",
                    "Manage research like a pro",
                    "Search patents faster",
                    "Visualize science in stunning ways",
                    "Publish breakthroughs with automated help",
                    "Recommend products everyone will love",
                    "Translate languages in real time",
                    "Guard your digital life",
                    "Spot fraud before it hits",
                    "Save energy with smart systems",
                    "Fix machines before they break",
                    "Diagnose health issues",
                    "Analyze medical scans in seconds",
                    "Build assistants that run your life",
                    "Understand speech with ease",
                    "Make the hottest new web game",
                    "Moderate content with top-notch smarts",
                    "Make tech accessible to all",
                    "Read emotions with deeper insight",
                    "Boost sales with smart recommendations",
                    "Spot problems before they grow",
                    "Support customers like never before",
                    "Turn speech into text instantly",
                    "Create VR adventures anyone can enjoy",
                    "Recognize images in a flash",
                    "Fly drones that think for themselves",
                    "Ease traffic with brilliant solutions",
                    "Monitor nature with smart tools",
                    "Protect wildlife with innovative solutions",
                    "Build the ultimate smart home",
                    "Plan cities with visionary approaches",
                    "Predict disasters to save lives",
                    "Grow food smarter",
                    "Design wearables that wow everyone",
                    "Explore space with pioneering methods"
                ];
                
                // Select topics based on the range
                const selectedTopics = allTopics.slice(startIndex, endIndex);
                
                // Create HTML for the topics
                let topicsHTML = '';
                selectedTopics.forEach(topic => {
                    topicsHTML += `<span class="topic-item">${topic}</span>`;
                });
                
                // Add all topics to the container
                content.innerHTML = topicsHTML;
                // Create a duplicate set for seamless scrolling
                content.innerHTML += topicsHTML;
            } else {
                // Use the template items
                topicElements.forEach(item => {
                    const newItem = item.cloneNode(true);
                    content.appendChild(newItem);
                });
                // Duplicate for seamless scrolling
                topicElements.forEach(item => {
                    const newItem = item.cloneNode(true);
                    content.appendChild(newItem);
                });
            }
            
            // Set all topics to be non-interactive
            const allTopics = content.querySelectorAll('.topic-item');
            allTopics.forEach(item => {
                item.style.pointerEvents = 'none';
                item.style.cursor = 'default';
                
                // Center the text and make it more prominent
                item.style.textAlign = 'center';
                item.style.fontWeight = '600';
                
                // Add a slight random offset for a more natural look
                // Smaller offset range for two-row layout
                const randomOffset = Math.floor(Math.random() * 6) - 3; // -3 to +3 pixels
                item.style.transform = `translateY(${randomOffset}px)`;
            });
            
            // Trigger reflow before starting animation
            content.offsetHeight;
            
            // Slower animation for better readability
            let duration = 200; // Increased duration to slow down the animation significantly
            if (window.innerWidth < 768) {
                duration = 180; // Slower but still appropriate for mobile
            }
            
            // Apply the animation
            content.style.animation = `scrollTopics ${duration}s linear infinite`;
        };
        
        // Initialize endless scroll for first container (topics 1-50)
        createEndlessScroll(topicsContainer, scrollwheelContent, 0, 50);
        
        // Initialize endless scroll for second container (topics 51-100) if it exists
        if (scrollwheelContent2 && topicsContainer2) {
            createEndlessScroll(topicsContainer2, scrollwheelContent2, 50, 100);
        }
        
        // Prevent any interaction from stopping the animation
        topicsContainer.addEventListener('mouseenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
        
        topicsContainer.addEventListener('mouseleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, { passive: false });
        
        // Add the same event listeners to the second container if it exists
        if (topicsContainer2) {
            topicsContainer2.addEventListener('mouseenter', (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, { passive: false });
            
            topicsContainer2.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, { passive: false });
        }
    }
}

// Call the function when DOM is loaded
initBuilderBotAnimations();

// Blog post functionality
function initBlogPosts() {
    const postLinks = document.querySelectorAll('.post-link:not(.disabled)');
    const postDetail = document.getElementById('post-detail');
    const backToPostsBtn = document.querySelector('.back-to-posts');
    
    if (postLinks.length > 0 && postDetail) {
        // Initially hide the post detail section
        postDetail.style.display = 'none';
        
        // Add click event to all post links
        postLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Scroll to top of page
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Hide posts grid section
                const postsSection = document.querySelector('.posts-section');
                if (postsSection) {
                    postsSection.style.display = 'none';
                }
                
                // Show post detail
                postDetail.style.display = 'block';
                
                // Add animation class
                postDetail.classList.add('animated', 'fadeInUp');
            });
        });
        
        // Back to posts button functionality
        if (backToPostsBtn) {
            backToPostsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Hide post detail
                postDetail.style.display = 'none';
                
                // Show posts grid section
                const postsSection = document.querySelector('.posts-section');
                if (postsSection) {
                    postsSection.style.display = 'block';
                }
                
                // Scroll to top of posts section
                postsSection.scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
        
        // Post filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        const postCards = document.querySelectorAll('.post-card');
        
        if (filterButtons.length > 0 && postCards.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Get filter value
                    const filterValue = this.getAttribute('data-filter');
                    
                    // Filter posts
                    postCards.forEach(card => {
                        if (filterValue === 'all') {
                            card.style.display = 'block';
                        } else {
                            if (card.getAttribute('data-category').includes(filterValue)) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                });
            });
        }
    }
}

// Call blog post initialization
initBlogPosts();

// Animation for mission story section - detect when elements enter viewport
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - initializing animations");
    
    // Set up the Intersection Observer
    const animatedBlocks = document.querySelectorAll('.animated-block');
    const slideInTexts = document.querySelectorAll('.slide-in-text');
    const fadeInWords = document.querySelectorAll('.fade-in-words');
    const highlightElements = document.querySelectorAll('.highlight-animation');
    const typingElements = document.querySelectorAll('.typing-animation');
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    console.log(`Found elements: ${animatedBlocks.length} blocks, ${slideInTexts.length} slide texts, ${fadeInWords.length} fade words, ${highlightElements.length} highlights, ${typingElements.length} typing, ${typewriterElements.length} typewriter`);
    
    // Force initial animations if About section is in view at page load
    function forceInitialAnimations() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            console.log("Forcing initial animations in about section");
            
            // Get elements in the about section
            const animations = aboutSection.querySelectorAll('.animated-block, .slide-in-text, .fade-in-words, .highlight-animation, .typing-animation, .typewriter');
            
            // Apply animations with sequential delays
            animations.forEach((element, index) => {
                setTimeout(() => {
                    console.log(`Forcing animation on: ${element.dataset.animation || 'unnamed element'}`);
                    element.classList.add('in-view');
                }, 300 + (index * 200));
            });
        }
    }
    
    // Trigger initial animations after a short delay
    setTimeout(forceInitialAnimations, 1000);
    
    // Force-activate animations if they're already in viewport on page load
    function activateElementsInView() {
        // Add immediate animation to elements that are already in viewport
        animatedBlocks.forEach(block => {
            const rect = block.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                console.log("Activating block on load:", block);
                block.classList.add('in-view');
                block.classList.add('was-in-view'); // Mark as having been seen
            }
        });
        
        slideInTexts.forEach(text => {
            const rect = text.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                text.classList.add('in-view');
                text.classList.add('was-in-view'); // Mark as having been seen
            }
        });
        
        fadeInWords.forEach(word => {
            const rect = word.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                word.classList.add('in-view');
                word.classList.add('was-in-view'); // Mark as having been seen
            }
        });
        
        highlightElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                element.classList.add('in-view');
                element.classList.add('was-in-view'); // Mark as having been seen
            }
        });
        
        typingElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                element.classList.add('in-view');
                element.classList.add('was-in-view'); // Mark as having been seen
            }
        });
        
        typewriterElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                element.classList.add('in-view');
                element.classList.add('was-in-view'); // Mark as having been seen
            }
        });
    }
    
    // Activate elements that are already visible on page load
    setTimeout(activateElementsInView, 500);
    
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when just 10% of the element is visible
    };
    
    // Observer for main blocks
    const blockObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log("Block entering viewport:", entry.target);
                entry.target.classList.add('in-view');
                entry.target.classList.add('was-in-view'); // Mark as having been seen
                // Only need to observe each element once
                blockObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer for text elements with sequential delay
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                console.log("Text entering viewport:", entry.target);
                // Add delay based on the element's position
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                    entry.target.classList.add('was-in-view'); // Mark as having been seen
                }, 200 * index);
                textObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe each element
    animatedBlocks.forEach(block => blockObserver.observe(block));
    slideInTexts.forEach(text => textObserver.observe(text));
    fadeInWords.forEach(word => blockObserver.observe(word));
    highlightElements.forEach(element => blockObserver.observe(element));
    typingElements.forEach(element => blockObserver.observe(element));
    typewriterElements.forEach(element => blockObserver.observe(element));
    
    // Add text animation effect to description paragraphs - SIMPLIFIED VERSION
    const storyParagraphs = document.querySelectorAll('.slide-in-text');
    storyParagraphs.forEach((paragraph, pIndex) => {
        // Apply simpler animation that's more reliable
        paragraph.style.transitionDelay = `${pIndex * 200}ms`;
    });
});

// Animation trigger on scroll for all animations
window.addEventListener('scroll', function() {
    const animatedElements = document.querySelectorAll('.animated-block:not(.in-view), .slide-in-text:not(.in-view), .fade-in-words:not(.in-view), .highlight-animation:not(.in-view), .typing-animation:not(.in-view), .typewriter:not(.in-view)');
    
    // Elements that should come into view
    animatedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        // If element is in viewport
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
            element.classList.add('in-view');
            element.classList.add('was-in-view'); // Mark as having been seen
        }
    });
    
    // Elements that should slide out of view when scrolled away
    const viewedElements = document.querySelectorAll('.animated-block.was-in-view, .slide-in-text.was-in-view, .story-block.was-in-view');
    viewedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        
        // If element is no longer in viewport (scrolled past or scrolled too far up)
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
            element.classList.remove('in-view');
        } else {
            element.classList.add('in-view');
        }
    });
}, { passive: true });

function initRoadmapTabs() {
    const roadmapTabs = document.querySelectorAll('.roadmap-tab');
    const roadmapContents = document.querySelectorAll('.roadmap-content');
    
    if (roadmapTabs.length > 0) {
        roadmapTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                roadmapTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all content sections
                roadmapContents.forEach(content => content.classList.remove('active'));
                
                // Show the corresponding content
                const targetPath = tab.getAttribute('data-path');
                const targetContent = document.getElementById(`${targetPath}-path`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    
                    // Animate timeline items
                    const timelineItems = targetContent.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            
                            // Trigger reflow
                            void item.offsetWidth;
                            
                            // Animate in
                            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        });
        
        // Initialize timeline animations for the default active tab
        const activeContent = document.querySelector('.roadmap-content.active');
        if (activeContent) {
            const timelineItems = activeContent.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 500 + (index * 100));
            });
        }
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Get the href attribute
        const href = link.getAttribute('href');
        
        // Check if this link corresponds to the current page
        if (href === currentPage || 
            (currentPage === '' || currentPage === 'index.html') && href === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Add to document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize scroll handlers
    initScrollHandlers();
    
    // Initialize particles background
    initParticles();
    
    // Initialize typing effect
    typeEffect();
    
    // Initialize animations on scroll
    animateOnScroll();
    
    // Initialize story slider
    initStorySlider();
    
    // Initialize tech icons
    initTechIcons();
    
    // Initialize YouTube video loader
    loadLatestYouTubeVideo();
    
    // Initialize feature tooltips
    setupFeatureTooltips();
    
    // Optimize animations
    optimizeAnimations();
    
    // Initialize builder bot animations
    initBuilderBotAnimations();
    
    // Initialize topics scrollwheel
    initTopicsScrollwheel();
    
    // Initialize blog posts
    initBlogPosts();
    
    // Initialize roadmap tabs
    initRoadmapTabs();
    
    // Set active navigation link
    setActiveNavLink();
    
    // Force initial animations
    forceInitialAnimations();
    
    // Check if stats are in viewport
    checkStatsVisibility();
    
    // Activate elements in view
    activateElementsInView();
}); 