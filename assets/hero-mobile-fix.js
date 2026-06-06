/**
 * Mobile Hero Diamond Expand Animation
 * Mirrors the desktop landscape diamond→fullscreen animation for mobile portrait.
 *
 * Desktop approach (landscape):
 *   – 130 vw × 130 vw container, clip-path polygon from tiny centre square → full rect
 *   – Container rotated 45 deg → 25 deg → 0 deg
 *   – Image wrapper counter-rotated
 *
 * Mobile approach (portrait ≤ 991 px):
 *   – 150 vw × 150 vh container centred, clip-path polygon from tiny diamond → full rect
 *   – Same rotation + counter-rotation pattern, scaled for portrait viewports
 */

(function () {
  'use strict';

  let mobileTimeline = null;
  let isInitialized = false;

  function initMobileHeroAnimation() {
    try {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(initMobileHeroAnimation, 100);
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      setTimeout(function () {
        try {
          var isMobile = window.matchMedia('(max-width: 991px)').matches;
          var isPortrait = window.matchMedia('(orientation: portrait)').matches;

          if (isMobile && isPortrait && !isInitialized) {
            killExistingAnimations();
            setupMobileAnimation();
            isInitialized = true;
          }
        } catch (e) {
          console.error('Mobile hero init error:', e);
        }
      }, 800);
    } catch (e) {
      console.error('GSAP not ready:', e);
    }
  }

  function killExistingAnimations() {
    var heroEl = document.querySelector('.hero');

    ScrollTrigger.getAll().forEach(function (trigger) {
      if (trigger.vars && trigger.vars.trigger) {
        var t = trigger.vars.trigger;
        var isHero =
          t === '.hero' ||
          t === heroEl ||
          (typeof t === 'string' && t.includes('hero')) ||
          (t instanceof Element && t.classList && t.classList.contains('hero'));
        if (isHero) trigger.kill();
      }
    });

    gsap.killTweensOf([
      '.hero',
      '.hero__screen-1',
      '.hero__screen-2',
      '.hero__background-clip',
      '.hero__image-wrapper',
      '.hero__image-wrapper-1',
      '.hero__image-wrapper-2',
      '.hero__heading',
      '.hero__subheading'
    ]);
  }

  /* ------------------------------------------------------------------ */
  /*  Initial states                                                     */
  /* ------------------------------------------------------------------ */
  function setupInitialStates() {
    // Hero container
    gsap.set('.hero', {
      height: '100vh',
      minHeight: '100vh',
      overflow: 'hidden'
    });

    // Screen 1 – visible
    gsap.set('.hero__screen-1', { autoAlpha: 1, zIndex: 10 });

    // Screen 2 – behind screen 1, visible but no pointer events yet
    gsap.set('.hero__screen-2', {
      autoAlpha: 1,
      visibility: 'visible',
      zIndex: 5,
      pointerEvents: 'none'
    });

    // --- Diamond clip container ---
    // Use a large fixed-size box (like desktop's 130 vw) so it always covers
    // the viewport once the clip-path opens up.
    gsap.set('.hero__screen-2 .hero__background-clip', {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '150vw',
      height: '150vh',
      rotate: '45deg',
      autoAlpha: 1,
      // Start as a tiny diamond in the centre (same idea as desktop)
      clipPath: 'polygon(48% 48%, 52% 48%, 52% 52%, 48% 52%)'
    });

    // Image wrapper 1 – counter-rotated so the image stays upright
    gsap.set('.hero__screen-2 .hero__image-wrapper-1', {
      position: 'absolute',
      top: '50%',
      left: '50%',
      xPercent: -50,
      yPercent: -50,
      width: '100%',
      height: '100%',
      rotate: '-45deg',
      scale: 1.5
    });

    // Image wrapper 2 – hidden initially
    gsap.set('.hero__screen-2 .hero__image-wrapper-2', { autoAlpha: 0 });

    // Content elements hidden
    gsap.set(
      [
        '.hero__screen-2 .hero__tagline',
        '.hero__screen-2 .hero__heading',
        '.hero__screen-2 .hero__description',
        '.hero__screen-2 .hero__media',
        '.hero__screen-2 .hero__cta',
        '.hero__screen-2 .hero__rotating-line',
        '.hero__screen-2 .hero__screen-2__lines'
      ],
      { autoAlpha: 0 }
    );

    // Flex blocks
    gsap.set('.hero__screen-2 .hero__flex-block-1', { autoAlpha: 1, yPercent: 0 });
    gsap.set('.hero__screen-2 .hero__flex-block-2', { autoAlpha: 0, yPercent: 110 });
  }

  /* ------------------------------------------------------------------ */
  /*  Timeline                                                           */
  /* ------------------------------------------------------------------ */
  function createMobileTimeline() {
    mobileTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom+=100% top',
        scrub: 1.1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Base duration (timeline is scrub-driven, so absolute numbers are ratios)
    var D = 12;

    mobileTimeline
      .to({}, { duration: D })

      /* ========== PHASE 1 (0 – 4): Fade out screen 1 ========== */
      .to('.hero__screen-1 .hero__heading span', {
        xPercent: 100,
        autoAlpha: 0,
        duration: 4
      }, '0')

      .to('.hero__screen-1 .hero__subheading span', {
        xPercent: -100,
        autoAlpha: 0,
        duration: 4
      }, '0')

      .to(
        [
          '.hero__screen-1 .hero__tagline',
          '.hero__screen-1 .hero__button',
          '.hero__screen-1 .hero__shadow'
        ],
        { autoAlpha: 0, duration: 4 },
        '0'
      )

      .to('.hero__line', { scaleX: 0, duration: 4 }, '0')

      .to(
        ['.hero__screen-1 .hero__text', '.hero__screen-1 .hero__scroll-wrapper'],
        { autoAlpha: 0, y: 50, stagger: 0.1, duration: 4 },
        '0'
      )

      /* ========== PHASE 2 (0 – 5): Diamond expands ========== */
      // Clip-path opens from tiny square to full rectangle while container
      // rotates from 45° toward 0° (via 25°).
      .to('.hero__screen-2 .hero__background-clip', {
        duration: 5,
        rotate: '25deg',
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ease: 'power2.inOut'
      }, '0')

      // Image wrapper counter-rotates and scales to fill
      .to('.hero__screen-2 .hero__image-wrapper-1', {
        duration: 5,
        scale: 1,
        rotate: '-25deg',
        ease: 'power2.inOut'
      }, '0')

      .to('.hero__screen-2 .hero__image-wrapper-2', {
        duration: 5,
        scale: 1,
        ease: 'power2.inOut'
      }, '0')

      // Second image fades in
      .to('.hero__screen-2 .hero__image-wrapper-2', {
        opacity: 1,
        duration: 4,
        ease: 'power1.inOut'
      }, '1')

      /* ========== PHASE 3 (2.5 – 3.5): Content appears ========== */
      // Reveal parent containers so child span animations are visible
      .to('.hero__screen-2 .hero__tagline', { autoAlpha: 1, duration: 0.5 }, '2.5')
      .to('.hero__screen-2 .hero__heading', { autoAlpha: 1, duration: 0.5 }, '2.5')

      .fromTo(
        '.hero__screen-2 .hero__tagline span:nth-child(1)',
        { autoAlpha: 0, yPercent: 100 },
        { autoAlpha: 1, yPercent: 0, duration: 3 },
        '2.5'
      )

      .fromTo(
        '.hero__screen-2 .hero__heading span',
        { autoAlpha: 0, xPercent: -50 },
        { autoAlpha: 1, xPercent: 1, stagger: 0.1, duration: 3 },
        '2.5'
      )

      .fromTo(
        '.hero__screen-2 .hero__rotating-line',
        { autoAlpha: 0, rotate: '0deg' },
        { autoAlpha: 1, rotate: '-180deg', duration: 3 },
        '3'
      )

      // Reveal media parent container
      .to('.hero__screen-2 .hero__media', { autoAlpha: 1, duration: 0.5 }, '3')

      .fromTo(
        ['.hero__screen-2 .hero__media video', '.hero__screen-2 .hero__media-text'],
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, stagger: 0.3, duration: 3 },
        '3'
      )

      .to('.hero__screen-2 .hero__screen-2__lines', {
        duration: 3,
        autoAlpha: 1
      }, '3')

      .set('.hero__screen-2', { pointerEvents: 'all' }, '3.5')

      .fromTo(
        '.hero__screen-2 .hero__cta',
        { autoAlpha: 0, yPercent: 50 },
        { autoAlpha: 1, yPercent: 0, duration: 3 },
        '3.5'
      )

      .fromTo(
        '.hero__screen-2 .hero__description',
        { autoAlpha: 0, yPercent: 50 },
        { autoAlpha: 1, yPercent: 0, stagger: 0.1, duration: 3 },
        '3.5'
      )

      /* ========== PHASE 4 (7 – end): Content transition ========== */
      .fromTo(
        '.hero__screen-2 .hero__image-2',
        { yPercent: 100, scale: 1.5 },
        { scale: 1.2, yPercent: 0, duration: 4 },
        '7'
      )

      .fromTo(
        '.hero__screen-2 .hero__tagline span:nth-child(1)',
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 4 },
        '7'
      )

      .fromTo(
        '.hero__screen-2 .hero__tagline span:nth-child(2)',
        { yPercent: 0 },
        { yPercent: -100, duration: 4 },
        '7'
      )

      .fromTo(
        '.hero__screen-2 .hero__media-text-1',
        { autoAlpha: 1 },
        { autoAlpha: 0, duration: 3 },
        '7'
      )

      .fromTo(
        '.hero__screen-2 .hero__media-text-2',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 4 },
        '7'
      )

      .fromTo(
        '.hero__screen-2 .hero__flex-block-1',
        { autoAlpha: 1, yPercent: 0 },
        { autoAlpha: 0, yPercent: -100, duration: 4 },
        '7'
      )

      .fromTo(
        '.hero__screen-2 .hero__flex-block-2',
        { yPercent: 110 },
        { yPercent: 0, duration: 5 },
        '7'
      );
  }

  /* ------------------------------------------------------------------ */
  /*  Setup                                                              */
  /* ------------------------------------------------------------------ */
  function setupMobileAnimation() {
    try {
      setupInitialStates();
      createMobileTimeline();
      ScrollTrigger.refresh();
    } catch (e) {
      console.error('Mobile animation setup error:', e);
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Resize handling                                                     */
  /* ------------------------------------------------------------------ */
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      var isMobile = window.matchMedia('(max-width: 991px)').matches;
      var isPortrait = window.matchMedia('(orientation: portrait)').matches;

      if (isMobile && isPortrait) {
        if (!isInitialized) {
          killExistingAnimations();
          setupMobileAnimation();
          isInitialized = true;
        } else {
          ScrollTrigger.refresh();
        }
      } else {
        if (mobileTimeline) {
          mobileTimeline.kill();
          mobileTimeline = null;
        }
        isInitialized = false;
        ScrollTrigger.refresh();
      }
    }, 300);
  });

  /* ------------------------------------------------------------------ */
  /*  Init                                                               */
  /* ------------------------------------------------------------------ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileHeroAnimation);
  } else {
    initMobileHeroAnimation();
  }

  window.addEventListener('load', function () {
    if (!isInitialized) {
      var isMobile = window.matchMedia('(max-width: 991px)').matches;
      var isPortrait = window.matchMedia('(orientation: portrait)').matches;
      if (isMobile && isPortrait) {
        setTimeout(initMobileHeroAnimation, 500);
      }
    }
  });
})();
