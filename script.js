document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // CONSTANTS & ELEMENT SELECTIONS
    // ----------------------------------------------------
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const backToTopBtn = document.getElementById('back-to-top');
    const currentYearSpan = document.getElementById('current-year');
    
    // Typing Animation Elements
    const typingText = document.getElementById('typing-text');
    const roles = [
        "AI & Machine Learning Student",
        "Python Developer",
        "Data Analyst",
        "Tech Enthusiast"
    ];
    
    // Skill Animation Elements
    const skillCards = document.querySelectorAll('.skill-card');
    
    // Project Filtering Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Gallery Modal Elements
    const galleryModal = document.getElementById('gallery-modal');
    const galleryImg = document.getElementById('gallery-img');
    const galleryCaption = document.getElementById('gallery-caption');
    const galleryClose = document.getElementById('gallery-close');
    const viewGalleryButtons = document.querySelectorAll('.view-gallery-btn');
    
    // Contact Form Elements
    const contactForm = document.getElementById('contact-form');
    const formName = document.getElementById('form-name');
    const formEmail = document.getElementById('form-email');
    const formMessage = document.getElementById('form-message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formSuccessBox = document.getElementById('form-success-box');

    // Set Current Year in Footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ----------------------------------------------------
    // DARK / LIGHT THEME MANAGEMENT
    // ----------------------------------------------------
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        } else if (systemPrefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            updateThemeIcon('light');
        }
    };

    const updateThemeIcon = (theme) => {
        if (theme === 'dark') {
            themeToggleIcon.className = 'fas fa-sun';
        } else {
            themeToggleIcon.className = 'fas fa-moon';
        }
    };

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    initTheme();
    initLetterGlitch();
    initScrollReveal();
    initCardTilt();

    // ----------------------------------------------------
    // MOBILE MENU TOGGLE
    // ----------------------------------------------------
    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    const closeMobileMenu = () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside of nav area
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ----------------------------------------------------
    // SCROLL EFFECTS & PAGE SCROLL PROGRESS
    // ----------------------------------------------------
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Header transparency and size adjustment
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        if (scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        
        // Scroll Progress Bar calculation
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const scrollPercentage = (scrollY / totalHeight) * 100;
            scrollProgressBar.style.width = `${scrollPercentage}%`;
        }
        
        // Active link indicator highlights on scroll
        highlightActiveSection();
    };

    const highlightActiveSection = () => {
        const sections = document.querySelectorAll('section');
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset header height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Trigger scroll handler once on load to initialize states
    handleScroll();

    // Scroll to Top action
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ----------------------------------------------------
    // HERO TYPING ANIMATION
    // ----------------------------------------------------
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;
    
    const type = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Remove characters
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50; // faster backspacing
        } else {
            // Add characters
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 100; // standard typing speed
        }
        
        // If word is finished typing
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeDelay = 2000; // pause at end of word
        } 
        // If word is completely deleted
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeDelay = 500; // brief pause before next word
        }
        
        setTimeout(type, typeDelay);
    };
    
    // Start typing animation
    if (typingText) {
        setTimeout(type, 1000);
    }

    // ----------------------------------------------------
    // ANIMATED SKILL BARS ON SCROLL
    // ----------------------------------------------------
    const animateSkillBars = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const percentage = card.getAttribute('data-skill');
                const fillBar = card.querySelector('.skill-bar-fill');
                
                if (fillBar) {
                    fillBar.style.width = `${percentage}%`;
                }
                
                // Stop observing card once animated
                observer.unobserve(card);
            }
        });
    };

    const skillObserverOptions = {
        threshold: 0.1, // Trigger when 10% of card is visible
        rootMargin: "0px 0px -50px 0px" // bottom offset to trigger slightly early
    };

    const skillObserver = new IntersectionObserver(animateSkillBars, skillObserverOptions);

    skillCards.forEach(card => {
        skillObserver.observe(card);
    });

    // ----------------------------------------------------
    // PROJECT FILTERING
    // ----------------------------------------------------
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show item
                    card.classList.remove('hide');
                    // Simple entrance animation
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    }, 50);
                } else {
                    // Hide item
                    card.classList.add('hide');
                }
            });
        });
    });

    // ----------------------------------------------------
    // IMAGE GALLERY MODAL
    // ----------------------------------------------------
    const openModal = (imgSrc, imgTitle) => {
        galleryImg.src = imgSrc;
        galleryCaption.textContent = imgTitle;
        galleryModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Disable page scrolling
    };

    const closeModal = () => {
        galleryModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Enable page scrolling
        setTimeout(() => {
            galleryImg.src = '';
            galleryCaption.textContent = '';
        }, 300);
    };

    viewGalleryButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const imgSrc = btn.getAttribute('data-img-src');
            const imgTitle = btn.getAttribute('data-img-title');
            openModal(imgSrc, imgTitle);
        });
    });

    galleryClose.addEventListener('click', closeModal);

    // Close modal when clicking outside the content image
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal || e.target.classList.contains('gallery-content-wrapper')) {
            closeModal();
        }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && galleryModal.classList.contains('show')) {
            closeModal();
        }
    });

    // ----------------------------------------------------
    // CONTACT FORM VALIDATION & SIMULATION
    // ----------------------------------------------------
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const setFieldError = (inputElement, errorElement, message) => {
        const formGroup = inputElement.parentElement;
        formGroup.classList.add('error');
        errorElement.textContent = message;
    };

    const clearFieldError = (inputElement, errorElement) => {
        const formGroup = inputElement.parentElement;
        formGroup.classList.remove('error');
        errorElement.textContent = '';
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Name Validation
        if (formName.value.trim() === '') {
            setFieldError(formName, nameError, 'Full Name is required.');
            isValid = false;
        } else {
            clearFieldError(formName, nameError);
        }
        
        // Email Validation
        if (formEmail.value.trim() === '') {
            setFieldError(formEmail, emailError, 'Email address is required.');
            isValid = false;
        } else if (!validateEmail(formEmail.value.trim())) {
            setFieldError(formEmail, emailError, 'Please enter a valid email address.');
            isValid = false;
        } else {
            clearFieldError(formEmail, emailError);
        }
        
        // Message Validation
        if (formMessage.value.trim() === '') {
            setFieldError(formMessage, messageError, 'Message content cannot be empty.');
            isValid = false;
        } else {
            clearFieldError(formMessage, messageError);
        }
        
        // If all fields are valid, simulate submission
        if (isValid) {
            const submitBtn = document.getElementById('btn-submit-form');
            const originalBtnText = submitBtn.innerHTML;
            
            // Set Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                // Success actions
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Display success box
                formSuccessBox.classList.add('show');
                
                // Clear Form Fields
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccessBox.classList.remove('show');
                }, 5000);
                
            }, 1500); // 1.5 seconds loading simulation
        }
    });

    // Clear error tags dynamically when user types
    formName.addEventListener('input', () => {
        if (formName.value.trim() !== '') {
            clearFieldError(formName, nameError);
        }
    });

    formEmail.addEventListener('input', () => {
        if (formEmail.value.trim() !== '' && validateEmail(formEmail.value.trim())) {
            clearFieldError(formEmail, emailError);
        }
    });

    formMessage.addEventListener('input', () => {
        if (formMessage.value.trim() !== '') {
            clearFieldError(formMessage, messageError);
        }
    });

    // ----------------------------------------------------
    // SCROLL REVEAL ANIMATIONS (STAGGERED)
    // ----------------------------------------------------
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.05,
            rootMargin: "0px 0px -30px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ----------------------------------------------------
    // 3D TILT EFFECT FOR INTERACTIVE CARDS
    // ----------------------------------------------------
    function initCardTilt() {
        const tiltCards = document.querySelectorAll('.skill-card, .stat-card, .project-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((centerY - y) / centerY) * 6;
                const rotateY = ((x - centerX) / centerX) * 6;
                
                card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            card.style.transition = 'transform 0.1s ease-out, border-color var(--transition-normal), box-shadow var(--transition-normal)';
            
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color var(--transition-normal), box-shadow var(--transition-normal)';
                card.style.transform = 'perspective(1000px) translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });
    }



    // ----------------------------------------------------
    // MATRIX LETTER GLITCH BACKGROUND ANIMATION
    // ----------------------------------------------------
    function initLetterGlitch() {
        const canvas = document.getElementById('letter-glitch-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let letters = [];
        let grid = { columns: 0, rows: 0 };
        let lastGlitchTime = Date.now();
        let animationId = null;

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';
        const lettersAndSymbols = Array.from(characters);

        const fontSize = 16;
        const charWidth = 10;
        const charHeight = 20;
        const glitchSpeed = 50;
        const smooth = true;

        // Dynamic colors based on theme (Minimalist Slate & Silver)
        const getThemeColors = () => {
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            return theme === 'dark' 
                ? ['#1e293b', '#475569', '#94a3b8'] 
                : ['#cbd5e1', '#94a3b8', '#64748b']; 
        };

        let glitchColors = getThemeColors();

        const getRandomChar = () => {
            return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
        };

        const getRandomColor = () => {
            return glitchColors[Math.floor(Math.random() * glitchColors.length)];
        };

        const hexToRgb = (hex) => {
            // Check if it's already an rgb/rgba string (e.g. from transition interpolation)
            if (hex.startsWith('rgb')) {
                const parts = hex.match(/\d+/g);
                return parts ? { r: parseInt(parts[0]), g: parseInt(parts[1]), b: parseInt(parts[2]) } : null;
            }
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        const interpolateColor = (start, end, factor) => {
            const result = {
                r: Math.round(start.r + (end.r - start.r) * factor),
                g: Math.round(start.g + (end.g - start.g) * factor),
                b: Math.round(start.b + (end.b - start.b) * factor)
            };
            return `rgb(${result.r}, ${result.g}, ${result.b})`;
        };

        const calculateGrid = (width, height) => {
            const columns = Math.ceil(width / charWidth);
            const rows = Math.ceil(height / charHeight);
            return { columns, rows };
        };

        const initializeLetters = (columns, rows) => {
            grid = { columns, rows };
            const totalLetters = columns * rows;
            letters = Array.from({ length: totalLetters }, () => ({
                char: getRandomChar(),
                color: getRandomColor(),
                targetColor: getRandomColor(),
                colorProgress: 1
            }));
        };

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            const dpr = window.devicePixelRatio || 1;
            const rect = parent.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const { columns, rows } = calculateGrid(rect.width, rect.height);
            initializeLetters(columns, rows);

            drawLetters();
        };

        const drawLetters = () => {
            if (letters.length === 0) return;
            const rect = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.font = `${fontSize}px monospace`;
            ctx.textBaseline = 'top';

            letters.forEach((letter, index) => {
                const x = (index % grid.columns) * charWidth;
                const y = Math.floor(index / grid.columns) * charHeight;
                ctx.fillStyle = letter.color;
                ctx.fillText(letter.char, x, y);
            });
        };

        const updateLetters = () => {
            if (letters.length === 0) return;

            const updateCount = Math.max(1, Math.floor(letters.length * 0.05));

            for (let i = 0; i < updateCount; i++) {
                const index = Math.floor(Math.random() * letters.length);
                if (!letters[index]) continue;

                letters[index].char = getRandomChar();
                letters[index].targetColor = getRandomColor();

                if (!smooth) {
                    letters[index].color = letters[index].targetColor;
                    letters[index].colorProgress = 1;
                } else {
                    letters[index].colorProgress = 0;
                }
            }
        };

        const handleSmoothTransitions = () => {
            let needsRedraw = false;
            letters.forEach(letter => {
                if (letter.colorProgress < 1) {
                    letter.colorProgress += 0.05;
                    if (letter.colorProgress > 1) letter.colorProgress = 1;

                    const startRgb = hexToRgb(letter.color);
                    const endRgb = hexToRgb(letter.targetColor);
                    if (startRgb && endRgb) {
                        letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
                        needsRedraw = true;
                    }
                }
            });

            if (needsRedraw) {
                drawLetters();
            }
        };

        const animate = () => {
            const now = Date.now();
            if (now - lastGlitchTime >= glitchSpeed) {
                updateLetters();
                drawLetters();
                lastGlitchTime = now;
            }

            if (smooth) {
                handleSmoothTransitions();
            }

            animationId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();

        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                cancelAnimationFrame(animationId);
                resizeCanvas();
                animate();
            }, 100);
        };

        window.addEventListener('resize', handleResize);

        // Update colors when theme switches
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                setTimeout(() => {
                    glitchColors = getThemeColors();
                    // Reset all letters target color
                    letters.forEach(l => {
                        l.targetColor = getRandomColor();
                        l.colorProgress = 0;
                    });
                }, 50);
            });
        }
    }
});
