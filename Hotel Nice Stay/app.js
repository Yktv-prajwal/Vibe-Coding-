/**
 * JavaScript interactions for Hotel Nice Stay Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. STICKY HEADER & SCROLL PROGRESS
    // -------------------------------------------------------------
    const header = document.getElementById('main-header');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');

    const handleScrollEffects = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Sticky Header Transition
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Progress Bar Update
        if (docHeight > 0) {
            const scrolledPercent = (scrollTop / docHeight) * 100;
            scrollProgressBar.style.width = `${scrolledPercent}%`;
        }

        // Back-to-Top Button Visibility
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (scrollTop > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Run on load in case of page refresh

    // Back to Top functionality
    const backToTopBtn = document.getElementById('back-to-top-btn');
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // -------------------------------------------------------------
    // 2. MOBILE MENU NAVIGATION
    // -------------------------------------------------------------
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    };

    const closeMenu = () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile menu
            closeMenu();

            // Set active class on menu items
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Highlight menu items on scroll
    const sections = document.querySelectorAll('section[id]');
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 120; // offset

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.nav-list a[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-list a[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    };
    window.addEventListener('scroll', scrollSpy);

    // -------------------------------------------------------------
    // 3. DARK MODE TOGGLE & PERSISTENCE
    // -------------------------------------------------------------
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const sunIcon = darkModeToggle.querySelector('.sun-icon');
    const moonIcon = darkModeToggle.querySelector('.moon-icon');

    const enableDarkMode = () => {
        document.body.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        localStorage.setItem('darkMode', 'enabled');
    };

    const disableDarkMode = () => {
        document.body.classList.remove('dark-mode');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        localStorage.setItem('darkMode', 'disabled');
    };

    // Check localStorage on load
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'enabled') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    darkModeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // -------------------------------------------------------------
    // 4. SCROLL ENTRANCE ANIMATIONS (REVEAL ON SCROLL)
    // -------------------------------------------------------------
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once animated
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollRevealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // -------------------------------------------------------------
    // 5. ANIMATED STATISTICS COUNTERS
    // -------------------------------------------------------------
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // Animation duration in ms
        const stepTime = 20; // Step updates in ms
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let currentNum = 0;

        const counterTimer = setInterval(() => {
            currentNum += increment;
            if (currentNum >= target) {
                element.textContent = target + (target === 100 ? '%' : '+');
                clearInterval(counterTimer);
            } else {
                element.textContent = Math.floor(currentNum) + (target === 100 ? '%' : '+');
            }
        }, stepTime);
    };

    const statsSection = document.querySelector('.stats-section');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(num => animateCounter(num));
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // -------------------------------------------------------------
    // 6. GALLERY LIGHTBOX
    // -------------------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const imagesList = Array.from(galleryItems).map(item => ({
        src: item.getAttribute('data-src'),
        caption: item.querySelector('img').getAttribute('alt')
    }));

    const showLightboxImage = (index) => {
        if (index < 0) index = imagesList.length - 1;
        if (index >= imagesList.length) index = 0;
        
        currentImageIndex = index;
        lightboxImg.src = imagesList[index].src;
        lightboxCaption.textContent = imagesList[index].caption;
    };

    const openLightbox = (index) => {
        showLightboxImage(index);
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeLightbox = () => {
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Release background scroll
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showLightboxImage(currentImageIndex - 1));
    lightboxNext.addEventListener('click', () => showLightboxImage(currentImageIndex + 1));

    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showLightboxImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showLightboxImage(currentImageIndex + 1);
        }
    });

    // -------------------------------------------------------------
    // 7. TESTIMONIALS SLIDER
    // -------------------------------------------------------------
    const reviewSlides = document.querySelectorAll('.review-slide');
    const prevReviewBtn = document.getElementById('prev-review');
    const nextReviewBtn = document.getElementById('next-review');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    let currentReviewIndex = 0;
    let reviewInterval;

    const showReview = (index) => {
        reviewSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentReviewIndex = index;
        reviewSlides[currentReviewIndex].classList.add('active');
        dots[currentReviewIndex].classList.add('active');
    };

    const nextReview = () => {
        let index = currentReviewIndex + 1;
        if (index >= reviewSlides.length) index = 0;
        showReview(index);
    };

    const prevReview = () => {
        let index = currentReviewIndex - 1;
        if (index < 0) index = reviewSlides.length - 1;
        showReview(index);
    };

    // Click controls
    nextReviewBtn.addEventListener('click', () => {
        nextReview();
        resetReviewTimer();
    });
    prevReviewBtn.addEventListener('click', () => {
        prevReview();
        resetReviewTimer();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showReview(index);
            resetReviewTimer();
        });
    });

    // Auto rotate timer
    const startReviewTimer = () => {
        reviewInterval = setInterval(nextReview, 5000);
    };

    const resetReviewTimer = () => {
        clearInterval(reviewInterval);
        startReviewTimer();
    };

    startReviewTimer();

    // Pause on hover
    const sliderContainer = document.querySelector('.reviews-slider-container');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(reviewInterval));
    sliderContainer.addEventListener('mouseleave', startReviewTimer);

    // -------------------------------------------------------------
    // 8. FAQS ACCORDION
    // -------------------------------------------------------------
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const isOpen = faqItem.classList.contains('open');
            
            // Close all open FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle selected FAQ
            if (!isOpen) {
                faqItem.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // -------------------------------------------------------------
    // 9. FORM SUBMISSIONS & WHATSAPP INTEGRATION
    // -------------------------------------------------------------
    const bookingForm = document.getElementById('booking-form');
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');

    // WhatsApp Direct Reservation Form Handler
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const adults = document.getElementById('adults').value;
        const children = document.getElementById('children').value;
        const roomType = document.getElementById('room-type').value;
        const requests = document.getElementById('special-requests').value;

        // Perform date validation
        const d1 = new Date(checkin);
        const d2 = new Date(checkout);
        if (d2 <= d1) {
            alert('Error: Check-out date must be after Check-in date.');
            return;
        }

        // WhatsApp Phone Number (International Format without '+')
        const phoneNumber = '919107867861';

        // Preformatted Booking Message
        const message = `Hello Hotel Nice Stay, I would like to reserve a room.

Here are my details:
🏨 Room Category: ${roomType}
📅 Check-in Date: ${checkin}
📅 Check-out Date: ${checkout}
👥 Guests: ${adults} Adults, ${children} Children
✉️ Special Requests: ${requests ? requests : 'None'}`;

        // Create WhatsApp URI
        const whatsappUri = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp chat in a new tab
        window.open(whatsappUri, '_blank');
        
        // Clear form
        bookingForm.reset();
        alert('Thank you! Redirecting you to our WhatsApp reservation desk to complete your booking.');
    });

    // Contact Form Handler
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('c-name').value;
        const email = document.getElementById('c-email').value;
        const subject = document.getElementById('c-subject').value;
        const message = document.getElementById('c-message').value;

        // Simulate successful submission (could connect to mailto or standard server in production)
        alert(`Thank you, ${name}! Your inquiry has been submitted. We will get back to you at ${email} shortly.`);
        contactForm.reset();
    });

    // Newsletter Handler
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('news-email').value;
        alert(`Thank you! The email address ${email} has been subscribed to the Hotel Nice Stay newsletter.`);
        newsletterForm.reset();
    });
});

// -------------------------------------------------------------
// 10. EXTERNAL INTERACTION: SELECT ROOM FROM ROOM CARD
// -------------------------------------------------------------
window.selectRoom = (roomName) => {
    const roomSelect = document.getElementById('room-type');
    const bookingSection = document.getElementById('booking');

    if (roomSelect && bookingSection) {
        // Set the value in dropdown
        roomSelect.value = roomName;
        
        // Scroll smoothly to booking form
        bookingSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
};
