/* ============================================================
   ROCK — Decoration & Event Styling
   Pure JavaScript — No Framework
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     YEAR
  ────────────────────────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ──────────────────────────────────────────────────────────
     NAVBAR — scroll effect + hamburger
  ────────────────────────────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────────────────────────
     HERO PARALLAX
  ────────────────────────────────────────────────────────── */
  const heroBg = document.getElementById('heroBg');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────────────────
     SCROLL REVEAL — Intersection Observer
  ────────────────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-hero').forEach(el => {
    revealObserver.observe(el);
  });

  /* ──────────────────────────────────────────────────────────
     GALLERY FILTER + LIGHTBOX
  ────────────────────────────────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Gallery image';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ──────────────────────────────────────────────────────────
     STAR RATINGS (render + fill)
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.stars[data-rating]').forEach(el => {
    const rating = parseInt(el.dataset.rating, 10);
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star' + (i <= rating ? ' filled' : '');
      star.textContent = '★';
      el.appendChild(star);
    }
  });

  /* ──────────────────────────────────────────────────────────
     REVIEWS CAROUSEL
  ────────────────────────────────────────────────────────── */
  const track   = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  let currentSlide = 0;
  let autoPlayTimer;

  const getSlideCount = () => track ? track.querySelectorAll('.carousel-slide').length : 0;

  const goToSlide = (index) => {
    const total = getSlideCount();
    if (!total) return;
    currentSlide = ((index % total) + total) % total;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  };

  const startAutoPlay = () => {
    autoPlayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  };

  if (track) {
    prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoPlay(); });
    nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoPlay(); });
    startAutoPlay();
  }

  /* ──────────────────────────────────────────────────────────
     ADD REVIEW FORM
  ────────────────────────────────────────────────────────── */
  const starPicker   = document.getElementById('starPicker');
  const reviewForm   = document.getElementById('reviewForm');
  const reviewSuccess = document.getElementById('reviewSuccess');
  let selectedRating = 5;

  // Init star picker to 5
  const updateStars = (val) => {
    starPicker.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.star, 10) <= val);
    });
    selectedRating = val;
    starPicker.dataset.value = val;
  };
  updateStars(5);

  if (starPicker) {
    const stars = starPicker.querySelectorAll('button');
    stars.forEach(btn => {
      btn.addEventListener('click', () => updateStars(parseInt(btn.dataset.star, 10)));
      btn.addEventListener('mouseenter', () => {
        stars.forEach(b => b.classList.toggle('active', parseInt(b.dataset.star, 10) <= parseInt(btn.dataset.star, 10)));
      });
    });
    starPicker.addEventListener('mouseleave', () => updateStars(selectedRating));
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const name    = document.getElementById('reviewName');
      const comment = document.getElementById('reviewComment');

      clearError('reviewName'); clearError('reviewComment');

      if (!name.value.trim() || name.value.trim().length < 2) {
        showError('reviewName', 'Name must be at least 2 characters.'); valid = false;
      }
      if (!comment.value.trim() || comment.value.trim().length < 10) {
        showError('reviewComment', 'Review must be at least 10 characters.'); valid = false;
      }

      if (!valid) return;

      // Append new review slide to carousel
      addReviewToCarousel(name.value.trim(), selectedRating, comment.value.trim());

      reviewForm.reset();
      updateStars(5);
      reviewSuccess.classList.add('visible');
      setTimeout(() => reviewSuccess.classList.remove('visible'), 5000);
    });
  }

  const addReviewToCarousel = (name, rating, comment) => {
    if (!track) return;
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
      <div class="review-card">
        <div class="stars">
          ${[1,2,3,4,5].map(i => `<span class="star${i <= rating ? ' filled' : ''}">★</span>`).join('')}
        </div>
        <p class="review-quote">"${escapeHTML(comment)}"</p>
        <p class="review-author">— ${escapeHTML(name)}</p>
      </div>`;
    track.appendChild(slide);
    // Jump to new review
    clearInterval(autoPlayTimer);
    goToSlide(getSlideCount() - 1);
    startAutoPlay();
  };

  /* ──────────────────────────────────────────────────────────
     CONTACT FORM
  ────────────────────────────────────────────────────────── */
  const contactForm    = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const name    = document.getElementById('contactName');
      const email   = document.getElementById('contactEmail');
      const message = document.getElementById('contactMessage');

      clearError('contactName'); clearError('contactEmail'); clearError('contactMessage');

      if (!name.value.trim() || name.value.trim().length < 2) {
        showError('contactName', 'Please enter your name.'); valid = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        showError('contactEmail', 'Please enter a valid email address.'); valid = false;
      }
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError('contactMessage', 'Please provide more details (at least 10 characters).'); valid = false;
      }

      if (!valid) return;

      contactForm.reset();
      contactSuccess.classList.add('visible');
      setTimeout(() => contactSuccess.classList.remove('visible'), 6000);
    });
  }

  /* ──────────────────────────────────────────────────────────
     FAQ ACCORDION
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer   = btn.nextElementSibling;
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.style.maxHeight = '0';
      });

      // Open clicked if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ──────────────────────────────────────────────────────────
     HELPERS
  ────────────────────────────────────────────────────────── */
  const showError = (inputId, message) => {
    const errorEl = document.getElementById(inputId + 'Error');
    if (errorEl) errorEl.textContent = message;
    const input = document.getElementById(inputId);
    if (input) input.style.borderBottomColor = '#b94f3f';
  };

  const clearError = (inputId) => {
    const errorEl = document.getElementById(inputId + 'Error');
    if (errorEl) errorEl.textContent = '';
    const input = document.getElementById(inputId);
    if (input) input.style.borderBottomColor = '';
  };

  const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Clear errors on input focus
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', () => {
      if (input.id) clearError(input.id);
    });
  });

});
