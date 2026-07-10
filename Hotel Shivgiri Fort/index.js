/*
   SHIVGIRI RESORT - Luxury Nature Retreat Interactive Scripts
   Features: Lenis Smooth Scroll, GSAP ScrollTrigger, Experiences pinned storyteller,
             WebGL Canvas Leaves/Rays/Fog particles, Ripple clicks, 3D room card tilts.
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Page Loader ---
    window.addEventListener('load', () => {
        const loader = document.getElementById('pageLoader');
        gsap.to(loader, {
            opacity: 0,
            duration: 1,
            delay: 1,
            ease: 'power3.inOut',
            onComplete: () => {
                loader.style.display = 'none';
                animateHeroContent();
            }
        });
    });

    // Fallback if load event takes too long
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader && loader.style.display !== 'none') {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                ease: 'power3.inOut',
                onComplete: () => {
                    loader.style.display = 'none';
                    animateHeroContent();
                }
            });
        }
    }, 4000);

    // --- 2. Initialize Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- 3. Scroll Progress Bar & Nav Blur on Scroll ---
    const scrollProgress = document.getElementById('scrollProgress');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';

        // Sticky Nav styling
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }

        // Active Nav link based on current section
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 120)) {
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

    // Nav Links smooth anchor scroll (integrates with Lenis)
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            
            // Close mobile menu if open
            const menuBtn = document.getElementById('menuBtn');
            const navLinksList = document.getElementById('navLinks');
            menuBtn.classList.remove('active');
            navLinksList.classList.remove('active');
            
            if (targetEl) {
                lenis.scrollTo(targetEl, {
                    offset: -80,
                    duration: 1.2
                });
            }
        });
    });

    // --- 4. Custom Cursor & Glow ---
    const cursor = document.getElementById('customCursor');
    const glow = document.getElementById('cursorGlow');
    
    // Only enable custom cursor on non-touch devices
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.05 });
            gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.15 });
        });

        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .gallery-item, .filter-btn, .dining-tab-btn, .insta-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                glow.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                glow.classList.remove('hovered');
            });
        });
    }

    // --- 5. Mobile Menu Toggle ---
    const menuBtn = document.getElementById('menuBtn');
    const navLinksList = document.getElementById('navLinks');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinksList.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navLinksList.contains(e.target)) {
            menuBtn.classList.remove('active');
            navLinksList.classList.remove('active');
        }
    });

    // --- 6. Hero Cinematic Slideshow ---
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlideIndex = 0;

    function playNextHeroSlide() {
        const currentSlide = slides[currentSlideIndex];
        const nextSlideIndex = (currentSlideIndex + 1) % slides.length;
        const nextSlide = slides[nextSlideIndex];

        // Reset all other slides to default scale and opacity
        slides.forEach((slide, idx) => {
            if (idx !== currentSlideIndex && idx !== nextSlideIndex) {
                gsap.set(slide, { opacity: 0, scale: 1 });
            }
        });

        // Cross-fade animation
        gsap.to(currentSlide, { opacity: 0, duration: 1.5, ease: 'power2.inOut' });
        gsap.fromTo(nextSlide, 
            { opacity: 0, scale: 1 }, 
            { opacity: 1, scale: 1.08, duration: 2, ease: 'power2.inOut' }
        );

        currentSlideIndex = nextSlideIndex;
    }

    // Set initial scale/opacity on first slide
    gsap.set(slides[0], { opacity: 1, scale: 1.08 });
    setInterval(playNextHeroSlide, 5000);

    // --- 7. High-Performance Canvas Particles / Rays / Leaves ---
    function initHeroCanvas() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        
        window.addEventListener('resize', () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        });
        
        // Particles (Gold dust sparks)
        const particles = [];
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height + height,
                size: Math.random() * 2 + 1,
                speedY: -(Math.random() * 0.8 + 0.4),
                speedX: Math.random() * 0.4 - 0.2,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Floating Leaves
        const leaves = [];
        for (let i = 0; i < 15; i++) {
            leaves.push({
                x: Math.random() * width,
                y: Math.random() * -height,
                size: Math.random() * 15 + 10,
                speedY: Math.random() * 0.8 + 0.4,
                speedX: Math.random() * 0.6 - 0.3,
                angle: Math.random() * Math.PI * 2,
                spin: Math.random() * 0.02 - 0.01
            });
        }
        
        function drawLeaf(ctx, x, y, size, angle) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.quadraticCurveTo(size / 3, 0, 0, size / 2);
            ctx.quadraticCurveTo(-size / 3, 0, 0, -size / 2);
            ctx.fillStyle = 'rgba(47, 122, 87, 0.15)'; // Emerald Green Leaf
            ctx.fill();
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.1)'; // Gold Vein Highlight
            ctx.stroke();
            ctx.restore();
        }
        
        let tick = 0;
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // 1. Draw soft pulsing Light Rays from top-left
            const rayGrad = ctx.createRadialGradient(0, 0, 50, 0, 0, width * 0.8);
            const alphaRay = 0.06 + Math.sin(tick * 0.005) * 0.02;
            rayGrad.addColorStop(0, `rgba(212, 175, 55, ${alphaRay})`);
            rayGrad.addColorStop(0.5, `rgba(253, 251, 248, ${alphaRay * 0.3})`);
            rayGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = rayGrad;
            ctx.fillRect(0, 0, width, height);
            
            // 2. Animate and draw Gold Dust
            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
                ctx.fill();
            });
            
            // 3. Animate and draw Leaves
            leaves.forEach(l => {
                l.y += l.speedY;
                l.x += l.speedX;
                l.angle += l.spin;
                
                if (l.y > height + 20) {
                    l.y = -20;
                    l.x = Math.random() * width;
                }
                drawLeaf(ctx, l.x, l.y, l.size, l.angle);
            });
            
            // 4. Soft Fog Wave at the bottom
            const fogGrad = ctx.createLinearGradient(0, height - 120, 0, height);
            fogGrad.addColorStop(0, 'rgba(247, 244, 238, 0)');
            fogGrad.addColorStop(1, 'rgba(247, 244, 238, 0.45)');
            ctx.fillStyle = fogGrad;
            ctx.fillRect(0, height - 120, width, 120);
            
            tick++;
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    initHeroCanvas();

    // --- 8. GSAP Text Reveal & Hero Entry Animations ---
    function animateHeroContent() {
        gsap.from('.hero-tagline', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.from('.hero-title', {
            opacity: 0,
            y: 40,
            duration: 1.2,
            delay: 0.2,
            ease: 'power4.out'
        });

        gsap.from('.hero-desc', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.4,
            ease: 'power3.out'
        });

        gsap.from('.hero-cta a', {
            opacity: 0,
            x: -20,
            duration: 0.8,
            delay: 0.6,
            stagger: 0.15,
            ease: 'power3.out'
        });

        gsap.from('.hero-booking-card', {
            opacity: 0,
            y: 50,
            duration: 1.2,
            delay: 0.7,
            ease: 'power3.out'
        });
    }

    // --- 9. GSAP Scroll Trigger Animations ---
    // General section reveals
    const revealUps = document.querySelectorAll('.reveal-up');
    revealUps.forEach(el => {
        const delay = el.getAttribute('data-delay') || 0;
        gsap.from(el, {
            opacity: 0,
            y: 60,
            duration: 1,
            delay: parseFloat(delay),
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });

    const revealLefts = document.querySelectorAll('.reveal-left');
    revealLefts.forEach(el => {
        gsap.from(el, {
            opacity: 0,
            x: -80,
            duration: 1.2,
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    const revealRights = document.querySelectorAll('.reveal-right');
    revealRights.forEach(el => {
        gsap.from(el, {
            opacity: 0,
            x: 80,
            duration: 1.2,
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Parallax Image Effect
    const parallaxImgs = document.querySelectorAll('.parallax-img');
    parallaxImgs.forEach(img => {
        gsap.to(img, {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
                trigger: img,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // --- 10. GSAP Experiences Storytelling Pin Timeline ---
    const expSection = document.querySelector('.experience-section');
    const expBlocks = document.querySelectorAll('.experience-block');
    const expImgs = document.querySelectorAll('.exp-img');

    if (expSection && expBlocks.length > 0) {
        const isMobile = window.innerWidth <= 991;
        
        const expTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".experience-section",
                start: "top top",
                end: () => isMobile ? "+=380%" : "+=600%",
                scrub: true,
                pin: true,
                anticipatePin: 1
            }
        });

        for (let i = 1; i < expBlocks.length; i++) {
            // Text block translate
            expTimeline.to(".experience-right-inner", {
                y: () => {
                    const blockHeight = document.querySelector('.experience-block').offsetHeight;
                    return -blockHeight * i;
                },
                ease: "power1.inOut"
            }, `step-${i}`);
            
            // Image swap opacity
            expTimeline.to(expImgs[i - 1], {
                opacity: 0,
                duration: 0.5,
                ease: "power1.inOut"
            }, `step-${i}`);
            
            expTimeline.to(expImgs[i], {
                opacity: 1,
                duration: 0.5,
                ease: "power1.inOut"
            }, `step-${i}`);
        }
    }

    // --- 11. Stats Counter Animation ---
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const decimals = parseInt(stat.getAttribute('data-decimals')) || 0;
        const obj = { val: 0 };
        
        gsap.to(obj, {
            val: target,
            duration: 2.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: stat,
                start: 'top 88%',
                once: true
            },
            onUpdate: () => {
                stat.textContent = obj.val.toFixed(decimals);
            }
        });
    });

    // --- 12. Dining Category Tabs & Main Image Swap ---
    const diningBtns = document.querySelectorAll('.dining-tab-btn');
    const diningPanels = document.querySelectorAll('.dining-panel');
    const diningImgMain = document.getElementById('diningImgMain');
    const diningOverlayTitle = document.getElementById('diningOverlayTitle');
    const diningOverlayDesc = document.getElementById('diningOverlayDesc');

    const diningData = {
        buffet: {
            img: 'https://shivgiriresort.com/images/facilities/dhara.jpg',
            title: 'Dhara Breakfast Buffet',
            desc: 'Lavish global spreads'
        },
        lunch: {
            img: 'https://shivgiriresort.com/images/facilities/anant-vayu.jpg',
            title: 'Traditional Lunch Platters',
            desc: 'Sumptuous Indian cuisine'
        },
        dinner: {
            img: 'https://shivgiriresort.com/images/facilities/Kailasha.jpg',
            title: 'Gourmet Dinner Buffets',
            desc: 'Fine continental cuisine'
        },
        local: {
            img: 'https://shivgiriresort.com/images/facilities/bhumi01.jpg',
            title: 'Dharani Indigenous Spices',
            desc: 'Local tribal specialties'
        },
        family: {
            img: 'https://shivgiriresort.com/images/facilities/pool.jpg',
            title: 'Warm Family Dining Circles',
            desc: 'Comforting shared dishes'
        },
        bbq: {
            img: 'https://shivgiriresort.com/images/background/2.jpg',
            title: 'Smoky Poolside BBQ Grills',
            desc: 'Charcoal skewers & local marinades'
        }
    };

    diningBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            diningBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const key = btn.getAttribute('data-dining');
            
            // Switch tabs
            diningPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === key) {
                    panel.classList.add('active');
                }
            });
            
            // Image reveal transition
            gsap.to(diningImgMain, { 
                opacity: 0, 
                scale: 0.95, 
                duration: 0.3, 
                onComplete: () => {
                    diningImgMain.src = diningData[key].img;
                    diningOverlayTitle.textContent = diningData[key].title;
                    diningOverlayDesc.textContent = diningData[key].desc;
                    
                    gsap.to(diningImgMain, { 
                        opacity: 1, 
                        scale: 1, 
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        });
    });

    // --- 13. Swiper Sliders Initialization ---
    // Activities Swiper
    new Swiper('.activities-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        }
    });

    // Testimonials Swiper
    new Swiper('.reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination-reviews',
            clickable: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });

    // --- 14. Gallery Filter & Lightbox Zoom ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let visibleItems = [];
    let currentGalleryIndex = 0;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    // Show item
                    item.style.display = 'block';
                    gsap.fromTo(item, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 });
                } else {
                    // Hide item
                    item.style.display = 'none';
                }
            });
            ScrollTrigger.refresh();
        });
    });

    // Lightbox triggers
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            visibleItems = Array.from(galleryItems).filter(i => i.style.display !== 'none');
            currentGalleryIndex = visibleItems.indexOf(item);
            openLightbox(item);
        });
    });

    function openLightbox(item) {
        const img = item.querySelector('.gallery-img');
        const cap = item.querySelector('h4').textContent;
        
        lightboxImg.src = img.src;
        lightboxCaption.textContent = cap;
        
        lightbox.style.display = 'flex';
        gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(lightboxImg, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' });
        
        lenis.stop();
    }

    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        gsap.to(lightbox, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
                lightbox.style.display = 'none';
                lenis.start();
            }
        });
    }

    lightboxPrev.addEventListener('click', () => {
        if (visibleItems.length === 0) return;
        currentGalleryIndex = (currentGalleryIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightboxContent();
    });

    lightboxNext.addEventListener('click', () => {
        if (visibleItems.length === 0) return;
        currentGalleryIndex = (currentGalleryIndex + 1) % visibleItems.length;
        updateLightboxContent();
    });

    function updateLightboxContent() {
        const item = visibleItems[currentGalleryIndex];
        const img = item.querySelector('.gallery-img');
        const cap = item.querySelector('h4').textContent;

        gsap.to(lightboxImg, { 
            opacity: 0, 
            scale: 0.95, 
            duration: 0.25, 
            onComplete: () => {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = cap;
                gsap.to(lightboxImg, { 
                    opacity: 1, 
                    scale: 1, 
                    duration: 0.35,
                    ease: 'power2.out'
                });
            }
        });
    }

    // Keyboard support for Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') lightboxNext.click();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
        }
    });

    // --- 15. Dynamic Room Booking Modal Trigger ---
    const roomModal = document.getElementById('roomModal');
    const roomModalClose = document.getElementById('roomModalClose');
    const modalRoomName = document.getElementById('modalRoomName');
    const roomBookingButtons = document.querySelectorAll('.book-room-trigger');

    roomBookingButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const roomName = btn.getAttribute('data-room');
            modalRoomName.textContent = roomName;
            roomModal.style.display = 'flex';
            gsap.fromTo(roomModal, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            lenis.stop();
        });
    });

    roomModalClose.addEventListener('click', closeRoomModal);
    roomModal.addEventListener('click', (e) => {
        if (e.target === roomModal) {
            closeRoomModal();
        }
    });

    function closeRoomModal() {
        gsap.to(roomModal, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
                roomModal.style.display = 'none';
                lenis.start();
            }
        });
    }

    // --- 16. Form Submissions & Validations ---
    const today = new Date().toISOString().split('T')[0];
    const checkInInputs = [
        document.getElementById('heroCheckIn'),
        document.getElementById('bookingCheckIn'),
        document.getElementById('modalCheckIn')
    ];
    const checkOutInputs = [
        document.getElementById('heroCheckOut'),
        document.getElementById('bookingCheckOut'),
        document.getElementById('modalCheckOut')
    ];

    checkInInputs.forEach(input => {
        if (input) input.min = today;
    });

    const setupDateDependency = (checkInId, checkOutId) => {
        const ci = document.getElementById(checkInId);
        const co = document.getElementById(checkOutId);
        if (ci && co) {
            ci.addEventListener('change', () => {
                co.min = ci.value;
            });
        }
    };
    setupDateDependency('heroCheckIn', 'heroCheckOut');
    setupDateDependency('bookingCheckIn', 'bookingCheckOut');
    setupDateDependency('modalCheckIn', 'modalCheckOut');

    // Detail Booking Form Validation & Simulation
    const detailedBookingForm = document.getElementById('detailedBookingForm');
    const bookingSubmitBtn = document.getElementById('bookingSubmitBtn');
    const bookingSpinner = document.getElementById('bookingSpinner');
    const bookingResponse = document.getElementById('bookingResponse');

    if (detailedBookingForm) {
        detailedBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const checkInVal = document.getElementById('bookingCheckIn').value;
            const checkOutVal = document.getElementById('bookingCheckOut').value;
            const phoneVal = document.getElementById('bookingPhone').value;

            if (new Date(checkOutVal) <= new Date(checkInVal)) {
                showFormResponse(bookingResponse, "Checkout date must be after check-in date.", false);
                return;
            }

            if (!/^[0-9]{10}$/.test(phoneVal)) {
                showFormResponse(bookingResponse, "Please enter a valid 10-digit mobile number.", false);
                return;
            }

            bookingSubmitBtn.disabled = true;
            bookingSpinner.style.display = 'inline-block';
            bookingResponse.style.display = 'none';

            setTimeout(() => {
                bookingSubmitBtn.disabled = false;
                bookingSpinner.style.display = 'none';
                
                showFormResponse(bookingResponse, "Booking request submitted successfully! Our reservations team will call you within 15 minutes.", true);
                detailedBookingForm.reset();
            }, 2000);
        });
    }

    // Modal Room Booking Form Simulation
    const modalBookingForm = document.getElementById('modalBookingForm');
    const modalResponse = document.getElementById('modalResponse');

    if (modalBookingForm) {
        modalBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const ci = document.getElementById('modalCheckIn').value;
            const co = document.getElementById('modalCheckOut').value;
            
            if (new Date(co) <= new Date(ci)) {
                showFormResponse(modalResponse, "Checkout date must be after check-in date.", false);
                return;
            }

            const btn = modalBookingForm.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = "Processing Request...";

            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = "Submit Booking Enquiry";
                showFormResponse(modalResponse, "Request sent! We will connect shortly.", true);
                
                setTimeout(() => {
                    closeRoomModal();
                    modalBookingForm.reset();
                    modalResponse.style.display = 'none';
                }, 2000);
            }, 1800);
        });
    }

    // Contact Form Simulation
    const contactForm = document.getElementById('contactForm');
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');
    const contactResponse = document.getElementById('contactResponse');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = "Sending Message...";

            setTimeout(() => {
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.textContent = "Submit Enquiry";
                showFormResponse(contactResponse, "Message sent successfully! Our guest relationship officer will email you.", true);
                contactForm.reset();
            }, 1500);
        });
    }

    function showFormResponse(element, message, isSuccess) {
        element.textContent = message;
        element.className = isSuccess ? 'booking-response success' : 'booking-response error';
        if (element.id === 'contactResponse') {
            element.className = isSuccess ? 'contact-response success' : 'contact-response error';
        }
        if (element.id === 'modalResponse') {
            element.className = isSuccess ? 'modal-response success' : 'modal-response error';
        }
        
        element.style.display = 'block';
        gsap.fromTo(element, { opacity: 0, y: -5 }, { opacity: 1, y: 0, duration: 0.3 });
    }

    // Newsletter Submission Simulation
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterResponse = document.getElementById('newsletterResponse');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input').value;
            
            newsletterResponse.textContent = "Subscribing...";
            newsletterResponse.style.color = 'var(--color-gold)';
            
            setTimeout(() => {
                newsletterResponse.textContent = "Subscribed successfully! Thank you.";
                newsletterResponse.style.color = '#8be0a4';
                newsletterForm.reset();
                setTimeout(() => {
                    newsletterResponse.textContent = "";
                }, 3000);
            }, 1200);
        });
    }

    // --- 17. Button Ripples Effect ---
    function initRipples() {
        const rippleButtons = document.querySelectorAll('.btn-gold, .btn-outline, .btn-gold-sm');
        rippleButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'btn-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                btn.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    initRipples();

    // --- 18. Card 3D Tilt Hover effect ---
    function initTilts() {
        if (window.innerWidth > 768) {
            const roomCards = document.querySelectorAll('.room-card');
            roomCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const xc = rect.width / 2;
                    const yc = rect.height / 2;
                    const dx = x - xc;
                    const dy = y - yc;
                    
                    const tiltX = -(dy / yc) * 8; // Max 8 degrees
                    const tiltY = (dx / xc) * 8;
                    
                    gsap.to(card, {
                        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
                        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                        boxShadow: 'none',
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });
            });
        }
    }
    initTilts();

    // --- 19. Magnetic Button Hovers ---
    function initMagnetics() {
        if (window.innerWidth > 768) {
            const magnetics = document.querySelectorAll('.magnetic');
            magnetics.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    gsap.to(btn, {
                        x: x * 0.35,
                        y: y * 0.35,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                
                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });
            });
        }
    }
    initMagnetics();
});
