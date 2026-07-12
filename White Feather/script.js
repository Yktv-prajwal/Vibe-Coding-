/* ==========================================================================
   White Feather Glamping Resort - Ultra-Premium Interactions & Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Lenis Smooth Scroll Engine
    // ==========================================================================
    // Initialize Lenis smooth scroll for a premium web narrative feel
    const lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential out
        smoothWheel: true,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis scroll with GSAP's ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // ==========================================================================
    // 2. Custom Morphing Cursor & Magnetic Effects
    // ==========================================================================
    const cursor = document.getElementById('customCursor');
    const cursorGlow = document.getElementById('customCursorGlow');
    const body = document.body;
    
    let mouseX = -100;
    let mouseY = -100;
    let glowX = -100;
    let glowY = -100;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor dot
        gsap.to(cursor, {
            x: mouseX,
            y: mouseY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // Smooth follower glow (lag effect)
    function animateCursorGlow() {
        glowX += (mouseX - glowX) * 0.14;
        glowY += (mouseY - glowY) * 0.14;
        
        gsap.to(cursorGlow, {
            x: glowX,
            y: glowY,
            duration: 0.1,
            ease: "power2.out"
        });
        requestAnimationFrame(animateCursorGlow);
    }
    animateCursorGlow();

    // Mouse over interactive elements -> Cursor Morphs
    const interactiveElements = document.querySelectorAll('a, button, .gallery-pinterest-item, .stay-card, select, input, textarea, .play-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            body.classList.add('hovering-link');
        });
        el.addEventListener('mouseleave', () => {
            body.classList.remove('hovering-link');
        });
    });

    // Magnetic Button Effect (GSAP pull)
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const dist = parseFloat(el.getAttribute('data-dist')) || 15;
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            
            gsap.to(el, {
                x: x * 0.35,
                y: y * 0.35,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // ==========================================================================
    // 3. Canvas Ambient Particles (Hero Section)
    // ==========================================================================
    const canvas = document.getElementById('heroParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 50; // spawn slightly below view
                this.size = Math.random() * 2 + 0.5;
                this.speedY = -(Math.random() * 0.5 + 0.2); // floating up
                this.speedX = Math.random() * 0.4 - 0.2; // slight sway
                this.opacity = Math.random() * 0.4 + 0.1;
                this.fadeRate = Math.random() * 0.002 + 0.0005;
            }
            
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                
                // Sway oscillation
                this.speedX += Math.sin(this.y * 0.02) * 0.01;
                
                // Out of screen bounds or fully transparent
                if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 168, 107, ${this.opacity})`; // gold color dust
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(200, 168, 107, 0.4)';
                ctx.fill();
            }
        }
        
        // Spawn particles
        const particleCount = 45;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
            // Pre-randomize positions to prevent clustering at startup
            particles[i].y = Math.random() * canvas.height;
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Turn off shadows for next drawing operations
            ctx.shadowBlur = 0;
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================================================
    // 4. Loading Screen & Percentage Animate
    // ==========================================================================
    const loaderPercent = document.getElementById('loaderPercent');
    const loaderProgress = document.getElementById('loaderProgress');
    const loaderWrapper = document.getElementById('loader-wrapper');
    
    // Split hero headline into characters for staggered timeline entrance
    const heroHeadline = document.getElementById('heroHeadline');
    if (heroHeadline) {
        const text = heroHeadline.innerText;
        heroHeadline.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            heroHeadline.appendChild(span);
        });
    }

    let progress = 0;
    const progressDuration = 1800; // 1.8 seconds loading bar animation
    const increment = 100 / (progressDuration / 16);
    
    const progressTimer = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressTimer);
            
            // Trigger exit timeline animation
            const tl = gsap.timeline();
            tl.to(loaderWrapper, {
                opacity: 0,
                visibility: 'hidden',
                duration: 0.8,
                ease: "power3.inOut"
            })
            // Reveal Hero Elements
            .to("#heroCard", {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.3")
            .to(".hero-title .char", {
                opacity: 1,
                y: 0,
                stagger: 0.02,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=0.8")
            .to(".hero-subtitle", {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.4")
            .to(".hero-buttons", {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.4");
        }
        
        if (loaderPercent) loaderPercent.innerText = Math.floor(progress);
        if (loaderProgress) loaderProgress.style.width = progress + '%';
    }, 16);

    // ==========================================================================
    // 5. Sticky Smart Navigation bar
    // ==========================================================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    let lastScrollY = window.pageYOffset;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        
        // Sticky bg trigger
        if (currentScrollY > 50) {
            body.classList.add('scrolled');
        } else {
            body.classList.remove('scrolled');
        }
        
        // Smart show/hide logic
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
            body.classList.add('scroll-down');
            body.classList.remove('scroll-up');
        } else {
            body.classList.add('scroll-up');
            body.classList.remove('scroll-down');
        }
        
        // Update scroll progress bar width
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (currentScrollY / scrollHeight) * 100;
        const progressLine = document.getElementById('scrollProgressLine');
        if (progressLine) progressLine.style.width = scrollPercent + '%';
        
        lastScrollY = currentScrollY;
    });

    // Mobile Hamburger Menu Bindings
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            const bars = navToggle.querySelectorAll('.bar');
            if (navToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close when clicking nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                const bars = navToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // ==========================================================================
    // 6. Interactive 3D Element Tilt
    // ==========================================================================
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            // Maximum tilt angle (configured inside parameters)
            const maxTilt = parseFloat(el.getAttribute('data-tilt-max')) || 10;
            const tiltX = ((yc - y) / yc) * maxTilt;
            const tiltY = ((x - xc) / xc) * maxTilt;
            
            gsap.to(el, {
                rotateX: tiltX,
                rotateY: tiltY,
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out",
                transformPerspective: 1000
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                duration: 0.6,
                ease: "power2.out"
            });
        });
    });

    // ==========================================================================
    // 7. GSAP ScrollTrigger Animations
    // ==========================================================================
    // Register scrolltrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Staggered reveal animations
    gsap.utils.toArray(".reveal-up").forEach(el => {
        gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none"
            }
        });
    });

    // Left/Right split reveals
    gsap.utils.toArray(".reveal-left").forEach(el => {
        gsap.from(el, {
            x: -60,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none"
            }
        });
    });

    gsap.utils.toArray(".reveal-right").forEach(el => {
        gsap.from(el, {
            x: 60,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none"
            }
        });
    });

    // About section statistics counter timeline
    const statsSection = document.querySelector('.about-stats-grid');
    const counterElements = document.querySelectorAll('.about-stats-grid .stat-number');
    let statsTriggered = false;

    if (statsSection) {
        ScrollTrigger.create({
            trigger: statsSection,
            start: "top 85%",
            onEnter: () => {
                if (!statsTriggered) {
                    counterElements.forEach(counter => {
                        const target = parseFloat(counter.getAttribute('data-target'));
                        const isFloat = target % 1 !== 0;
                        let current = 0;
                        const duration = 2000;
                        const interval = 16;
                        const steps = duration / interval;
                        const stepVal = target / steps;
                        
                        const timer = setInterval(() => {
                            current += stepVal;
                            if (current >= target) {
                                current = target;
                                clearInterval(timer);
                            }
                            counter.innerText = isFloat ? current.toFixed(1) : Math.floor(current);
                        }, interval);
                    });
                    statsTriggered = true;
                }
            }
        });
    }

    // ==========================================================================
    // 8. GSAP Horizontal Scroll narrative (Resort Experience)
    // ==========================================================================
    const horizontalContainer = document.getElementById("experience-horizontal-container");
    const scrollWrapper = document.getElementById("experience-scroll-wrapper");
    
    if (horizontalContainer && scrollWrapper && window.innerWidth > 768) {
        // Compute horizontal scroll range
        const scrollWidthVal = horizontalContainer.scrollWidth - window.innerWidth;
        
        gsap.to(horizontalContainer, {
            x: -scrollWidthVal,
            ease: "none",
            scrollTrigger: {
                trigger: "#experience",
                pin: true,
                scrub: 1.2,
                start: "top top",
                end: () => "+=" + scrollWidthVal,
                invalidateOnRefresh: true
            }
        });
    }

    // ==========================================================================
    // 9. YouTube API Autoplay (Hero Background)
    // ==========================================================================
    // Video ID: k5_d60p73rI
    const videoBgContainer = document.getElementById('videoBgContainer');
    
    if (videoBgContainer && !isMobileDevice()) {
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://www.youtube.com/iframe_api';
        const firstTag = document.getElementsByTagName('script')[0];
        firstTag.parentNode.insertBefore(scriptTag, firstTag);
        
        window.onYouTubeIframeAPIReady = function() {
            new YT.Player('youtubePlayer', {
                videoId: 'k5_d60p73rI',
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    loop: 1,
                    playlist: 'k5_d60p73rI',
                    controls: 0,
                    showinfo: 0,
                    rel: 0,
                    modestbranding: 1,
                    iv_load_policy: 3,
                    wmode: 'transparent',
                    origin: window.location.origin
                },
                events: {
                    onReady: (event) => {
                        event.target.playVideo();
                        event.target.setPlaybackQuality('hd1080');
                        videoBgContainer.classList.add('loaded');
                    },
                    onStateChange: (event) => {
                        if (event.data === YT.PlayerState.ENDED) {
                            event.target.playVideo();
                        }
                    }
                }
            });
        };
    } else if (videoBgContainer) {
        // Mobile fallback -> slideshow handles it
        videoBgContainer.remove();
    }
    
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Hero Slideshow cycles every 5.5 seconds
    const heroSlides = document.querySelectorAll('#heroSlideshow .slide');
    let activeHeroSlide = 0;
    
    function rotateHeroSlideshow() {
        if (heroSlides.length <= 1) return;
        heroSlides[activeHeroSlide].classList.remove('active');
        activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
        heroSlides[activeHeroSlide].classList.add('active');
    }
    setInterval(rotateHeroSlideshow, 5500);

    // ==========================================================================
    // 10. Pinterest Masonry Filtering
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn-premium');
    const pinterestItems = document.querySelectorAll('.gallery-pinterest-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');
            
            const filterCategory = btn.getAttribute('data-filter');
            
            pinterestItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filterCategory === 'all' || categories.includes(filterCategory)) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.remove('filtered-out'), 50);
                } else {
                    item.classList.add('filtered-out');
                    setTimeout(() => item.style.display = 'none', 500);
                }
            });
            
            // Recalculate ScrollTrigger parameters on grid structure shift
            setTimeout(() => ScrollTrigger.refresh(), 550);
        });
    });

    // ==========================================================================
    // 11. Testimonials Auto Sliding Slider
    // ==========================================================================
    const testimonialSlides = document.querySelectorAll('.testimonial-glass-card');
    const prevBtn = document.querySelector('.prev-review-btn');
    const nextBtn = document.querySelector('.next-review-btn');
    
    let activeTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.display = 'none';
        });
        
        activeTestimonial = index;
        if (activeTestimonial >= testimonialSlides.length) activeTestimonial = 0;
        if (activeTestimonial < 0) activeTestimonial = testimonialSlides.length - 1;
        
        testimonialSlides[activeTestimonial].style.display = 'block';
        setTimeout(() => {
            testimonialSlides[activeTestimonial].classList.add('active');
        }, 50);
    }

    function rotateTestimonial() {
        showTestimonial(activeTestimonial + 1);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            showTestimonial(activeTestimonial + 1);
            startTestimonialAutoplay();
        });
        
        prevBtn.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            showTestimonial(activeTestimonial - 1);
            startTestimonialAutoplay();
        });
    }

    function startTestimonialAutoplay() {
        testimonialInterval = setInterval(rotateTestimonial, 7000);
    }

    if (testimonialSlides.length > 0) {
        showTestimonial(0);
        startTestimonialAutoplay();
    }

    // ==========================================================================
    // 12. Fullscreen Lightboxes (Image & Video walk modal)
    // ==========================================================================
    const imageLightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeImageLightbox = document.getElementById('closeImageLightbox');
    const prevImageBtn = document.getElementById('prevLightboxImage');
    const nextImageBtn = document.getElementById('nextLightboxImage');
    
    let activeImageIndex = 0;
    let visibleGalleryItems = [];

    // Image Modal Open
    pinterestItems.forEach(item => {
        item.addEventListener('click', () => {
            visibleGalleryItems = Array.from(pinterestItems).filter(el => el.style.display !== 'none');
            activeImageIndex = visibleGalleryItems.indexOf(item);
            
            openImageAtIndex(activeImageIndex);
        });
    });

    function openImageAtIndex(index) {
        if (index < 0 || index >= visibleGalleryItems.length) return;
        
        const targetItem = visibleGalleryItems[index];
        const imgEl = targetItem.querySelector('img');
        const captionText = targetItem.querySelector('.pinterest-item-details span').innerText;
        
        if (lightboxImage && imageLightbox) {
            lightboxImage.src = imgEl.src;
            if (lightboxCaption) lightboxCaption.innerText = captionText;
            imageLightbox.classList.add('active');
        }
    }

    if (prevImageBtn) {
        prevImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            activeImageIndex--;
            if (activeImageIndex < 0) activeImageIndex = visibleGalleryItems.length - 1;
            openImageAtIndex(activeImageIndex);
        });
    }

    if (nextImageBtn) {
        nextImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            activeImageIndex++;
            if (activeImageIndex >= visibleGalleryItems.length) activeImageIndex = 0;
            openImageAtIndex(activeImageIndex);
        });
    }

    if (closeImageLightbox) {
        closeImageLightbox.addEventListener('click', () => {
            if (imageLightbox) imageLightbox.classList.remove('active');
        });
    }

    if (imageLightbox) {
        imageLightbox.addEventListener('click', (e) => {
            if (e.target === imageLightbox) {
                imageLightbox.classList.remove('active');
            }
        });
    }

    // Video modal binds (experience)
    const videoLightbox = document.getElementById('videoLightbox');
    const lightboxIframe = document.getElementById('lightboxIframe');
    const closeVideoLightbox = document.getElementById('closeVideoLightbox');
    
    // We bind any trigger to video modal overlay
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const ytVideoId = btn.getAttribute('data-video-id');
            if (lightboxIframe && videoLightbox) {
                lightboxIframe.src = `https://www.youtube.com/embed/${ytVideoId}?autoplay=1&rel=0`;
                videoLightbox.classList.add('active');
            }
        });
    });

    if (closeVideoLightbox) {
        closeVideoLightbox.addEventListener('click', () => {
            if (videoLightbox && lightboxIframe) {
                videoLightbox.classList.remove('active');
                lightboxIframe.src = '';
            }
        });
    }

    if (videoLightbox) {
        videoLightbox.addEventListener('click', (e) => {
            if (e.target === videoLightbox) {
                videoLightbox.classList.remove('active');
                lightboxIframe.src = '';
            }
        });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (imageLightbox) imageLightbox.classList.remove('active');
            if (videoLightbox) {
                videoLightbox.classList.remove('active');
                if (lightboxIframe) lightboxIframe.src = '';
            }
        } else if (e.key === 'ArrowLeft' && imageLightbox && imageLightbox.classList.contains('active')) {
            activeImageIndex--;
            if (activeImageIndex < 0) activeImageIndex = visibleGalleryItems.length - 1;
            openImageAtIndex(activeImageIndex);
        } else if (e.key === 'ArrowRight' && imageLightbox && imageLightbox.classList.contains('active')) {
            activeImageIndex++;
            if (activeImageIndex >= visibleGalleryItems.length) activeImageIndex = 0;
            openImageAtIndex(activeImageIndex);
        }
    });

    // Date pickers setups
    const checkin = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    
    if (checkin && checkout) {
        const todayStr = new Date().toISOString().split('T')[0];
        checkin.min = todayStr;
        checkin.value = todayStr;
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        checkout.min = tomorrowStr;
        checkout.value = tomorrowStr;
        
        checkin.addEventListener('change', () => {
            const checkinVal = new Date(checkin.value);
            checkinVal.setDate(checkinVal.getDate() + 1);
            const minCheckout = checkinVal.toISOString().split('T')[0];
            checkout.min = minCheckout;
            if (checkout.value < minCheckout) {
                checkout.value = minCheckout;
            }
        });
    }
});
