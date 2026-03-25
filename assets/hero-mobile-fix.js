/**
 * Mobile Hero Diamond Expand Animation
 * Properly implements the desktop diamond animation for mobile devices
 */

(function() {
  'use strict';

  let mobileTimeline = null;
  let isInitialized = false;

  // Wait for GSAP to be available
  function initMobileHeroAnimation() {
    try {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(initMobileHeroAnimation, 100);
        return;
      }

      // Register plugins
      gsap.registerPlugin(ScrollTrigger);

      // Wait for main script to initialize first
      setTimeout(() => {
        try {
          // Check if we're on mobile portrait
          const isMobile = window.matchMedia("(max-width: 991px)").matches;
          const isPortrait = window.matchMedia("(orientation: portrait)").matches;

          if (isMobile && isPortrait && !isInitialized) {
            console.log('🚀 Initializing mobile hero diamond animation...');
            killExistingAnimations();
            setupMobileAnimation();
            isInitialized = true;
          }
        } catch (error) {
          console.error('❌ Error during mobile animation setup:', error);
        }
      }, 800); // Give main script time to initialize
    } catch (error) {
      console.error('❌ Error initializing GSAP:', error);
    }
  }

  // Kill any existing hero animations
  function killExistingAnimations() {
    const heroElement = document.querySelector('.hero');

    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars && trigger.vars.trigger) {
        const triggerEl = trigger.vars.trigger;

        // Check if trigger is the hero element (can be string or DOM element)
        const isHeroTrigger =
          triggerEl === '.hero' ||
          triggerEl === heroElement ||
          (typeof triggerEl === 'string' && triggerEl.includes('hero')) ||
          (triggerEl instanceof Element && triggerEl.classList && triggerEl.classList.contains('hero'));

        if (isHeroTrigger) {
          console.log('Removing existing hero trigger');
          trigger.kill();
        }
      }
    });

    // Kill any existing timelines affecting hero elements
    gsap.killTweensOf([
      '.hero',
      '.hero__screen-1',
      '.hero__screen-2',
      '.hero__background-clip',
      '.hero__heading',
      '.hero__subheading'
    ]);
  }

  function setupMobileAnimation() {
    try {
      // Set up initial states for all elements
      setupInitialStates();

      // Create the main mobile timeline
      createMobileTimeline();

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();

      console.log('✅ Mobile diamond animation ready');
    } catch (error) {
      console.error('❌ Error setting up mobile animation:', error);
    }
  }

  function setupInitialStates() {
    // Hero container
    gsap.set('.hero', {
      height: '100vh',
      minHeight: '100vh',
      overflow: 'hidden'
    });

    // Screen 1 - visible initially
    gsap.set('.hero__screen-1', {
      autoAlpha: 1,
      zIndex: 10
    });

    // Screen 2 container - hidden initially
    gsap.set('.hero__screen-2', {
      autoAlpha: 1,
      visibility: 'visible',
      zIndex: 5,
      pointerEvents: 'none'
    });

    // Diamond clip - start small and rotated
    gsap.set('.hero__screen-2 .hero__background-clip', {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '8rem',
      height: '8rem',
      rotate: '45deg',
      scale: 0.5,
      autoAlpha: 0
    });

    // Image wrappers inside diamond
    gsap.set('.hero__screen-2 .hero__image-wrapper-1', {
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '200%',
      height: '200%',
      scale: 1.5,
      rotate: '0deg'
    });

    gsap.set('.hero__screen-2 .hero__image-wrapper-2', {
      autoAlpha: 0
    });

    // Content elements - hidden initially
    gsap.set([
      '.hero__screen-2 .hero__tagline',
      '.hero__screen-2 .hero__heading',
      '.hero__screen-2 .hero__description',
      '.hero__screen-2 .hero__media',
      '.hero__screen-2 .hero__cta',
      '.hero__screen-2 .hero__rotating-line',
      '.hero__screen-2 .hero__screen-2__lines'
    ], {
      autoAlpha: 0
    });

    // Flex blocks
    gsap.set('.hero__screen-2 .hero__flex-block-1', {
      autoAlpha: 1,
      yPercent: 0
    });

    gsap.set('.hero__screen-2 .hero__flex-block-2', {
      autoAlpha: 0,
      yPercent: 110
    });
  }

  function createMobileTimeline() {
    mobileTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom+=80% top',
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false, // Set to true for debugging
        onUpdate: (self) => {
          // Debug progress
          // console.log('Scroll progress:', self.progress.toFixed(2));
        }
      }
    });

    // Timeline duration markers
    const TOTAL_DURATION = 100;

    mobileTimeline
      // Create a base duration
      .to({}, { duration: TOTAL_DURATION })

      // ========== PHASE 1: FADE OUT SCREEN 1 (0-25%) ==========
      .to('.hero__screen-1 .hero__heading span', {
        xPercent: 120,
        autoAlpha: 0,
        duration: 25,
        ease: 'power2.inOut'
      }, 0)

      .to('.hero__screen-1 .hero__subheading span', {
        xPercent: -120,
        autoAlpha: 0,
        duration: 25,
        ease: 'power2.inOut'
      }, 0)

      .to([
        '.hero__screen-1 .hero__tagline',
        '.hero__screen-1 .hero__button',
        '.hero__screen-1 .hero__text',
        '.hero__screen-1 .hero__shadow'
      ], {
        autoAlpha: 0,
        y: -30,
        duration: 20,
        ease: 'power2.in'
      }, 0)

      .to('.hero__line', {
        scaleX: 0,
        duration: 20,
        ease: 'power2.in'
      }, 0)

      .to('.hero__screen-1 .hero__scroll-wrapper', {
        autoAlpha: 0,
        yPercent: -50,
        duration: 15,
        ease: 'power2.in'
      }, 0)

      // Fade screen 1 background
      .to('.hero__screen-1', {
        autoAlpha: 0,
        duration: 10,
        ease: 'power2.in'
      }, 15)

      // ========== PHASE 2: DIAMOND APPEARS & GROWS (20-60%) ==========

      // Diamond appears
      .to('.hero__screen-2 .hero__background-clip', {
        autoAlpha: 1,
        scale: 1,
        duration: 15,
        ease: 'power1.out'
      }, 20)

      // Diamond expands and rotates to full screen
      .to('.hero__screen-2 .hero__background-clip', {
        width: '100vw',
        height: '100vh',
        rotate: '0deg',
        duration: 35,
        ease: 'power2.inOut',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
      }, 30)

      // Image inside diamond scales properly
      .to('.hero__screen-2 .hero__image-wrapper-1', {
        scale: 1,
        width: '100%',
        height: '100%',
        duration: 35,
        ease: 'power2.inOut'
      }, 30)

      // Second image wrapper fades in
      .to('.hero__screen-2 .hero__image-wrapper-2', {
        autoAlpha: 1,
        duration: 15,
        ease: 'power1.inOut'
      }, 50)

      // ========== PHASE 3: CONTENT APPEARS (55-80%) ==========

      // Tagline appears
      .to('.hero__screen-2 .hero__tagline span:nth-child(1)', {
        autoAlpha: 1,
        yPercent: 0,
        duration: 12,
        ease: 'power2.out'
      }, 55)

      // Heading appears
      .to('.hero__screen-2 .hero__heading span', {
        autoAlpha: 1,
        xPercent: 0,
        stagger: 0.5,
        duration: 15,
        ease: 'power2.out'
      }, 58)

      // Rotating line animates
      .to('.hero__screen-2 .hero__rotating-line', {
        autoAlpha: 0.3,
        rotate: '-180deg',
        duration: 15,
        ease: 'none'
      }, 60)

      // Lines background appears
      .to('.hero__screen-2 .hero__screen-2__lines', {
        autoAlpha: 1,
        duration: 15,
        ease: 'power1.in'
      }, 60)

      // Media (video) appears
      .to('.hero__screen-2 .hero__media', {
        autoAlpha: 1,
        y: 0,
        duration: 12,
        ease: 'power2.out'
      }, 65)

      // Media text 1 appears
      .to('.hero__screen-2 .hero__media-text-1', {
        autoAlpha: 1,
        duration: 10,
        ease: 'power1.out'
      }, 67)

      // Description block 1 appears
      .to('.hero__screen-2 .hero__description', {
        autoAlpha: 1,
        yPercent: 0,
        stagger: 0.3,
        duration: 12,
        ease: 'power2.out'
      }, 68)

      // CTA button appears
      .to('.hero__screen-2 .hero__cta', {
        autoAlpha: 1,
        yPercent: 0,
        duration: 10,
        ease: 'back.out(1.2)'
      }, 70)

      // Enable pointer events
      .set('.hero__screen-2', {
        pointerEvents: 'all'
      }, 75)

      // ========== PHASE 4: CONTENT TRANSITION (80-100%) ==========

      // Tagline transition
      .to('.hero__screen-2 .hero__tagline span:nth-child(1)', {
        autoAlpha: 0,
        duration: 8,
        ease: 'power2.in'
      }, 82)

      .to('.hero__screen-2 .hero__tagline span:nth-child(2)', {
        yPercent: -100,
        duration: 8,
        ease: 'power2.inOut'
      }, 82)

      // Media text transition
      .to('.hero__screen-2 .hero__media-text-1', {
        autoAlpha: 0,
        duration: 8,
        ease: 'power2.in'
      }, 83)

      .to('.hero__screen-2 .hero__media-text-2', {
        autoAlpha: 1,
        duration: 8,
        ease: 'power2.out'
      }, 85)

      // Description blocks transition
      .to('.hero__screen-2 .hero__flex-block-1', {
        autoAlpha: 0,
        yPercent: -100,
        duration: 12,
        ease: 'power2.inOut'
      }, 84)

      .to('.hero__screen-2 .hero__flex-block-2', {
        autoAlpha: 1,
        yPercent: 0,
        duration: 12,
        ease: 'power2.out'
      }, 86);

    console.log('📱 Mobile timeline created with', TOTAL_DURATION, 'duration units');
  }

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const isMobile = window.matchMedia("(max-width: 991px)").matches;
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;

      if (isMobile && isPortrait) {
        if (!isInitialized) {
          console.log('Reinitializing on resize...');
          killExistingAnimations();
          setupMobileAnimation();
          isInitialized = true;
        } else {
          ScrollTrigger.refresh();
        }
      } else {
        // Not mobile portrait - clean up
        if (mobileTimeline) {
          mobileTimeline.kill();
          mobileTimeline = null;
        }
        isInitialized = false;
        ScrollTrigger.refresh();
      }
    }, 300);
  });

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileHeroAnimation);
  } else {
    initMobileHeroAnimation();
  }

  // Also try on window load for extra safety
  window.addEventListener('load', () => {
    if (!isInitialized) {
      const isMobile = window.matchMedia("(max-width: 991px)").matches;
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      if (isMobile && isPortrait) {
        setTimeout(initMobileHeroAnimation, 500);
      }
    }
  });

})();
