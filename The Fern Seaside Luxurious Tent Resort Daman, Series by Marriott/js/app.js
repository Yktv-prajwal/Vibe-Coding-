/* 
========================================================================
   THE FERN SEASIDE LUXURIOUS TENT RESORT DAMAN - SERIES BY MARRIOTT
   Advanced Interactive Logic & Animations (GSAP + Lenis)
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INITIALIZE LENIS SMOOTH SCROLL ---
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easeOutExpo
            smoothWheel: true,
            smoothTouch: false,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Keep GSAP ScrollTrigger in sync with Lenis
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }


    // --- 2. CUSTOM CURSOR & AMBIENT SPOTLIGHT ---
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    const spotlight = document.getElementById('ambient-glow');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    // Track mouse coordinates
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Ambient Spotlight tracking (uses pageX/Y to scroll with content)
        if (spotlight) {
            spotlight.style.opacity = 1;
            spotlight.style.left = `${e.pageX}px`;
            spotlight.style.top = `${e.pageY}px`;
        }
    });

    // Custom Cursor smooth lerping (linear interpolation)
    function animateCursor() {
        // Cursor Circle lerping
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;
        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }

        // Inner Dot lerping (slightly faster for lag effect)
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;
        if (cursorDot) {
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover interactions
    const interactiveElements = document.querySelectorAll('a, button, select, input, textarea, .gallery-item, .room-card, .attraction-card, .dining-tab-btn, .gallery-filter-btn');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hovered');
        });
    });


    // --- 3. MARRIOTT LUXURY LOADER SIMULATION ---
    const loader = document.getElementById('loader');
    const loaderProgress = document.getElementById('loader-progress');
    const loaderBar = document.getElementById('loader-bar');
    const loaderStatus = document.getElementById('loader-status');

    const loaderStates = [
        "Arriving at Jampore Beach...",
        "Preparing Beachfront Tents...",
        "Setting Up Arabian Sea Views...",
        "Polishing Silverware...",
        "Welcome to The Fern Seaside..."
    ];

    let progress = 0;

    function updateLoader() {
        progress += Math.floor(Math.random() * 4) + 1; // Increment randomly
        if (progress > 100) progress = 100;

        // Update progress counter
        if (loaderProgress) {
            loaderProgress.textContent = progress < 10 ? `0${progress}` : progress;
        }

        // Update loader bar width
        if (loaderBar) {
            loaderBar.style.width = `${progress}%`;
        }

        // Update loader status messages
        if (loaderStatus) {
            const index = Math.min(Math.floor(progress / 20), loaderStates.length - 1);
            loaderStatus.textContent = loaderStates[index];
        }

        if (progress < 100) {
            setTimeout(updateLoader, Math.random() * 120 + 30);
        } else {
            // Loading Finished
            setTimeout(finishLoading, 800);
        }
    }

    function finishLoading() {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }
        
        // Remove scroll lock
        document.body.classList.remove('is-loading');

        // Trigger Hero Animations
        triggerHeroIntro();
    }

    // Start loading simulation
    updateLoader();


    // --- 4. GSAP ENTRANCE & SCROLLTRIGGER ANIMATIONS ---
    function triggerHeroIntro() {
        if (typeof gsap === 'undefined') return;

        // Hero Content reveals
        const tl = gsap.timeline();
        
        tl.fromTo('#hero-sub-reveal', 
            { opacity: 0, y: 15 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        )
        .fromTo('#hero-title-reveal', 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
            '-=0.5'
        )
        .fromTo('#hero-desc-reveal', 
            { opacity: 0, y: 15 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.6'
        )
        .fromTo('#hero-btns-reveal', 
            { opacity: 0, y: 15 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.6'
        )
        .fromTo('#quick-booking-bar', 
            { opacity: 0, y: 40 }, 
            { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.2)' },
            '-=0.4'
        );
    }

    // Scroll Trigger Elements
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Header Background Transition
        ScrollTrigger.create({
            start: "top -50px",
            onEnter: () => document.getElementById('site-header').classList.add('scrolled'),
            onLeaveBack: () => document.getElementById('site-header').classList.remove('scrolled'),
        });

        // About Section: Visuals
        gsap.from('#about-reveal-img1', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -80,
            duration: 1.2,
            ease: 'power3.out'
        });

        gsap.from('#about-reveal-img2', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 60%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 80,
            duration: 1.2,
            ease: 'power3.out'
        });

        gsap.from('#about-reveal-badge', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 50%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'back.out(1.5)'
        });

        // About Section: Text Content
        gsap.from('#about-sub, #about-title, #about-desc-1, #about-desc-2', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 35,
            stagger: 0.2,
            duration: 1,
            ease: 'power3.out'
        });

        // About Stats Counter Increment Animation
        gsap.from('#about-stats-grid', {
            scrollTrigger: {
                trigger: '#about-stats-grid',
                start: 'top 85%',
                onEnter: () => {
                    const stats = document.querySelectorAll('.stat-num');
                    stats.forEach((stat) => {
                        const target = parseFloat(stat.getAttribute('data-target'));
                        const isFloat = target % 1 !== 0;
                        const obj = { value: 0 };
                        
                        gsap.to(obj, {
                            value: target,
                            duration: 2,
                            ease: 'power2.out',
                            onUpdate: () => {
                                stat.textContent = isFloat ? obj.value.toFixed(1) : Math.floor(obj.value);
                            }
                        });
                    });
                }
            }
        });

        // Rooms Grid Stagger
        gsap.from('#room-card-1, #room-card-2, #room-card-3', {
            scrollTrigger: {
                trigger: '#rooms',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 60,
            stagger: 0.25,
            duration: 1,
            ease: 'power3.out'
        });

        // Amenities Grid Stagger
        gsap.from('.amenity-card', {
            scrollTrigger: {
                trigger: '#amenities',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Dining Tabs & Pane Reveal
        gsap.from('.dining-tabs, .dining-showcase', {
            scrollTrigger: {
                trigger: '#dining',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            stagger: 0.2,
            duration: 1,
            ease: 'power3.out'
        });

        // Experience Timeline Card Slide In
        const timelineCards = document.querySelectorAll('.timeline-item');
        timelineCards.forEach((item) => {
            const card = item.querySelector('.timeline-card');
            const time = item.querySelector('.timeline-time');
            const marker = item.querySelector('.timeline-marker');
            const alignLeft = item.style.justifyContent === 'flex-start' || item.classList.contains('timeline-left'); // Wait, default timeline card left/right checks

            gsap.from([marker, time], {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                scale: 0.5,
                duration: 0.8,
                stagger: 0.15,
                ease: 'back.out(2)'
            });

            gsap.from(card, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Gallery Masonry Grid Stagger
        gsap.from('.gallery-item', {
            scrollTrigger: {
                trigger: '#gallery',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            stagger: 0.12,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Attractions Layout reveals
        gsap.from('#attract-card-1, #attract-card-2, #attract-card-3', {
            scrollTrigger: {
                trigger: '#attractions',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -40,
            stagger: 0.2,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('#attractions-map-reveal', {
            scrollTrigger: {
                trigger: '#attractions',
                start: 'top 65%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 40,
            duration: 1.2,
            ease: 'power3.out'
        });

        // Active Navigation Highlighter on Scroll
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            ScrollTrigger.create({
                trigger: current,
                start: `top 120px`,
                end: `bottom 120px`,
                onToggle: (self) => {
                    if (self.isActive) {
                        document.querySelectorAll('.nav-link').forEach((link) => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                }
            });
        });

        // --- 5. MAGNETIC BUTTONS ---
        const magneticButtons = document.querySelectorAll('.btn, .social-icon, .testimonial-arrow');
        magneticButtons.forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const bounding = btn.getBoundingClientRect();
                const mouseXRelative = e.clientX - bounding.left - bounding.width / 2;
                const mouseYRelative = e.clientY - bounding.top - bounding.height / 2;
                
                // Move button slightly towards mouse
                gsap.to(btn, {
                    x: mouseXRelative * 0.35,
                    y: mouseYRelative * 0.35,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                // Snap back to center
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }


    // --- 6. INTERACTIVE TABS (Dining Section) ---
    const diningTabBtns = document.querySelectorAll('.dining-tab-btn');
    const diningPanes = document.querySelectorAll('.dining-pane');

    diningTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const paneId = btn.getAttribute('data-pane');
            
            // Remove active classes
            diningTabBtns.forEach((b) => b.classList.remove('active'));
            diningPanes.forEach((p) => p.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            
            const targetPane = document.getElementById(`pane-${paneId}`);
            if (targetPane) {
                targetPane.classList.add('active');
                
                // Animate entry of components in selected pane
                if (typeof gsap !== 'undefined') {
                    gsap.from(targetPane.querySelector('.dining-media'), {
                        opacity: 0,
                        x: -30,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                    gsap.from(targetPane.querySelector('.dining-info'), {
                        opacity: 0,
                        x: 30,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                }
            }
        });
    });


    // --- 7. GALLERY CATEGORY FILTER & LIGHTBOX ---
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close-btn');

    // Filter Logic
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            galleryItems.forEach((item) => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(item, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 });
                    }
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Recalculate ScrollTrigger positions
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
    });

    // Lightbox Logic
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4').textContent;
            
            if (lightbox && lightboxImg && lightboxCaption) {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = title;
                lightbox.classList.add('active');
                
                // Pause scrolling
                if (lenis) lenis.stop();
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
        // Resume scrolling
        if (lenis) lenis.start();
    }


    // --- 8. GUEST TESTIMONIALS SLIDER ---
    const track = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const btnPrev = document.getElementById('test-prev');
    const btnNext = document.getElementById('test-next');

    let currentSlide = 0;
    const slideCount = slides.length;
    let autoPlayInterval;

    function updateSlider() {
        if (track) {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
    }

    function showNextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    }

    function showPrevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider();
    }

    // Event listeners
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            showNextSlide();
            resetAutoplay();
        });
    }
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            showPrevSlide();
            resetAutoplay();
        });
    }

    // Autoplay
    function startAutoplay() {
        autoPlayInterval = setInterval(showNextSlide, 7000); // Shift every 7s
    }

    function resetAutoplay() {
        clearInterval(autoPlayInterval);
        startAutoplay();
    }

    if (slideCount > 0) {
        startAutoplay();
    }


    // --- 9. MOBILE NAVIGATION OVERLAY ---
    const mobileToggle = document.getElementById('mobile-toggle-btn');
    const mobileNav = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Toggle hamburger animation in CSS
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
                if (lenis) lenis.stop();
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                if (lenis) lenis.start();
            }
        });

        // Close when clicking links
        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileToggle.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                if (lenis) lenis.start();
            });
        });
    }


    // --- 10. INTERACTIVE BOOKING DRAWER ---
    const bookDrawer = document.getElementById('booking-drawer');
    const drawerOverlay = document.getElementById('booking-drawer-overlay');
    const btnBookNow = document.getElementById('hero-book-now');
    const btnNavBook = document.getElementById('nav-book-btn');
    const btnMobileBook = document.getElementById('mobile-book-btn');
    const btnRoomTriggers = document.querySelectorAll('.book-room-trigger');
    const btnDiningTriggers = document.querySelectorAll('.book-dining-trigger');
    const drawerCloseBtn = document.getElementById('booking-drawer-close-btn');
    const bookingForm = document.getElementById('booking-drawer-form');
    const successOverlay = document.getElementById('booking-success');
    const successCloseBtn = document.getElementById('success-close-btn');

    // Quick booking form submit redirects to drawer
    const quickForm = document.getElementById('booking-quick-form');
    if (quickForm) {
        quickForm.addEventListener('submit', () => {
            const checkin = document.getElementById('quick-checkin').value;
            const checkout = document.getElementById('quick-checkout').value;
            const guests = document.getElementById('quick-guests').value;
            const room = document.getElementById('quick-room').value;

            // Pre-fill drawer elements
            const drawerRoomSelect = document.getElementById('book-room-type');
            if (drawerRoomSelect) {
                if (room === 'tent') drawerRoomSelect.value = "Winter Green Premium Tent";
                else if (room === 'room') drawerRoomSelect.value = "Winter Green Room";
                else if (room === 'suite') drawerRoomSelect.value = "Hazel Suite";
            }
            if (checkin) document.getElementById('book-checkin').value = checkin;
            if (checkout) document.getElementById('book-checkout').value = checkout;
            if (guests) document.getElementById('book-guests').value = guests;

            openDrawer();
        });
    }

    // Click triggers
    if (btnBookNow) btnBookNow.addEventListener('click', openDrawer);
    if (btnNavBook) btnNavBook.addEventListener('click', openDrawer);
    if (btnMobileBook) btnMobileBook.addEventListener('click', openDrawer);
    
    btnRoomTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const roomName = trigger.getAttribute('data-room');
            const roomSelect = document.getElementById('book-room-type');
            if (roomSelect) roomSelect.value = roomName;
            openDrawer();
        });
    });

    btnDiningTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const notesField = document.getElementById('book-requests');
            const diningName = trigger.getAttribute('data-dining');
            if (notesField) notesField.value = `Table reservation requested for: ${diningName}`;
            openDrawer();
        });
    });

    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    function openDrawer() {
        if (bookDrawer && drawerOverlay) {
            bookDrawer.classList.add('active');
            drawerOverlay.classList.add('active');
            if (lenis) lenis.stop();
        }
    }

    function closeDrawer() {
        if (bookDrawer && drawerOverlay) {
            bookDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
            
            // Reset success screen after close transitions complete
            setTimeout(() => {
                if (successOverlay) successOverlay.classList.remove('active');
            }, 600);
            
            if (lenis) lenis.start();
        }
    }

    // Submit Validation Animation
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Animate submit button loader state
            const submitBtn = document.getElementById('book-form-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "VALIDATING...";
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = "SECURING ROOM...";
                
                setTimeout(() => {
                    // Show success screen with custom validation animation
                    if (successOverlay) {
                        successOverlay.classList.add('active');
                    }
                    bookingForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1200);
            }, 1000);
        });
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', () => {
            closeDrawer();
        });
    }

});
