// 1. Simple Push-Down Mobile Dropdown
window.openMobileDropdown = function() {
  const dropdown = document.getElementById('mobile-dropdown');
  const menuIcon = document.getElementById('menu-icon');
  const mainContent = document.querySelector('main');
  if (!dropdown) return;
  dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
  if (menuIcon) menuIcon.textContent = 'close';
  // Push main content down
  if (mainContent) {
    mainContent.style.transition = 'padding-top 0.3s ease';
    mainContent.style.paddingTop = (44 + dropdown.scrollHeight) + 'px';
  }
};

window.closeMobileDropdown = function() {
  const dropdown = document.getElementById('mobile-dropdown');
  const menuIcon = document.getElementById('menu-icon');
  const mainContent = document.querySelector('main');
  if (!dropdown) return;
  dropdown.style.maxHeight = '0';
  if (menuIcon) menuIcon.textContent = 'menu';
  // Reset main content padding
  if (mainContent) {
    mainContent.style.transition = 'padding-top 0.3s ease';
    mainContent.style.paddingTop = '';
  }
};

window.toggleMobileDropdown = function() {
  const dropdown = document.getElementById('mobile-dropdown');
  if (!dropdown) return;
  if (parseInt(dropdown.style.maxHeight) > 0) {
    window.closeMobileDropdown();
  } else {
    window.openMobileDropdown();
  }
};

document.addEventListener('DOMContentLoaded', () => {

  // 0. Navbar Scroll Background & Active Link Highlight
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('#main-nav nav a');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    if (!mainNav) return;
    if (window.scrollY > 20) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Back to Top Button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (window.scrollY > 350) {
        backToTopBtn.classList.remove('translate-y-16', 'opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.add('translate-y-16', 'opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
      }
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Back to Top Click Action
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobile Menu Button
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.toggleMobileDropdown();
    });
  }

  // Close dropdown when clicking a link inside it
  const dropdown = document.getElementById('mobile-dropdown');
  if (dropdown) {
    const links = dropdown.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        window.closeMobileDropdown();
      });
    });
  }

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) window.closeMobileDropdown();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeMobileDropdown();
  });

  // 2. Portfolio Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category') || '';
        const categories = category.split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 3. Lightbox Modal Preview
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCat = document.getElementById('lightbox-cat');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(mediaSrc, title, cat, isVideo = false) {
    if (!lightboxModal) return;
    if (isVideo) {
      if (lightboxImg) lightboxImg.classList.add('hidden');
      if (lightboxVideo) {
        lightboxVideo.classList.remove('hidden');
        lightboxVideo.src = mediaSrc;
        lightboxVideo.play().catch(() => {});
      }
    } else {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.classList.add('hidden');
        lightboxVideo.removeAttribute('src');
      }
      if (lightboxImg) {
        lightboxImg.classList.remove('hidden');
        lightboxImg.src = mediaSrc;
      }
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCat) lightboxCat.textContent = cat;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
    }
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgEl = item.querySelector('img');
      const videoEl = item.querySelector('video');
      const title = item.querySelector('h3') ? item.querySelector('h3').textContent : '';
      const cat = item.querySelector('span') ? item.querySelector('span').textContent : '';

      if (videoEl) {
        const sourceEl = videoEl.querySelector('source');
        const videoSrc = sourceEl ? sourceEl.getAttribute('src') : (videoEl.getAttribute('src') || 'videos/motion_logo.webm');
        openLightbox(videoSrc, title, cat, true);
      } else if (imgEl) {
        const imgSrc = imgEl.getAttribute('src');
        openLightbox(imgSrc, title, cat, false);
      }
    });
  });

  // Certificate Items Click to Lightbox
  const certItems = document.querySelectorAll('.certificate-item');
  certItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgEl = item.querySelector('img');
      const title = item.querySelector('h3') ? item.querySelector('h3').textContent : 'Professional Certification';
      const cat = item.querySelector('.cert-category') ? item.querySelector('.cert-category').textContent : 'Credentials';

      if (imgEl) {
        const imgSrc = imgEl.getAttribute('src');
        openLightbox(imgSrc, title, cat, false);
      }
    });
  });

  const featuredWorkBox = document.getElementById('featured-work-box');
  if (featuredWorkBox) {
    featuredWorkBox.addEventListener('click', () => {
      const img = featuredWorkBox.querySelector('img').getAttribute('src');
      openLightbox(img, 'Special Digital Illustration', 'Featured Masterpiece Spotlight');
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // 4. Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) return;
    const toastText = document.getElementById('toast-text');
    if (toastText) toastText.textContent = msg;
    toast.classList.remove('translate-y-32', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-32', 'opacity-0');
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-base">progress_activity</span> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        contactForm.reset();
        showToast('Thank you! Your message has been sent to Khoiruman.');
      }, 1000);
    });
  }

});
