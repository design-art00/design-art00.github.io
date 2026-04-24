document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('.author-tabs a'));
  const sections = tabs
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const fixedOffset = () => {
    const headerOffset = document.querySelector('.site-header')?.offsetHeight || 82;
    const tabsHeight = document.querySelector('.author-tabs')?.offsetHeight || 0;
    return headerOffset + tabsHeight + 12;
  };

  function setActiveTab() {
    const currentY = window.scrollY + fixedOffset();
    let activeId = null;

    sections.forEach((section) => {
      if (section.offsetTop <= currentY) activeId = section.id;
    });

    tabs.forEach((link) => {
      link.classList.toggle('is-active', activeId !== null && link.getAttribute('href') === `#${activeId}`);
    });
  }

  tabs.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      window.scrollTo({
        top: target.offsetTop - fixedOffset() + 2,
        behavior: 'smooth'
      });
    });
  });

  function setupSlider(name) {
    const viewport = document.querySelector(`[data-slider="${name}"]`);
    const track = viewport?.querySelector('.author-slider-track');
    const controls = document.querySelector(`[data-slider-controls="${name}"]`);
    const prev = controls?.querySelector('[data-slider-prev]');
    const next = controls?.querySelector('[data-slider-next]');
    const items = track ? Array.from(track.children) : [];

    if (!viewport || !track || !prev || !next || items.length === 0) return;

    let index = 0;
    let startX = 0;
    let startTransform = 0;
    let isDragging = false;

    function visibleCount() {
      const first = items[0];
      const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      const itemWidth = first.getBoundingClientRect().width + gap;
      return Math.max(1, Math.floor((viewport.getBoundingClientRect().width + gap) / itemWidth));
    }

    function update() {
      const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      const itemWidth = items[0].getBoundingClientRect().width + gap;
      const maxIndex = Math.max(0, items.length - visibleCount());
      index = Math.min(index, maxIndex);
      track.style.transform = `translateX(${-index * itemWidth}px)`;
      prev.disabled = index === 0;
      next.disabled = index === maxIndex;
    }

    function maxIndex() {
      return Math.max(0, items.length - visibleCount());
    }

    function go(delta) {
      index = Math.max(0, Math.min(maxIndex(), index + delta));
      update();
    }

    prev.addEventListener('click', () => {
      go(-1);
    });

    next.addEventListener('click', () => {
      go(1);
    });

    viewport.addEventListener('pointerdown', (event) => {
      isDragging = true;
      startX = event.clientX;
      const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
      startTransform = matrix.m41;
      viewport.setPointerCapture(event.pointerId);
      track.style.transition = 'none';
    });

    viewport.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      track.style.transform = `translateX(${startTransform + event.clientX - startX}px)`;
    });

    viewport.addEventListener('pointerup', (event) => {
      if (!isDragging) return;
      isDragging = false;
      viewport.releasePointerCapture(event.pointerId);
      track.style.transition = '';
      const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      const itemWidth = items[0].getBoundingClientRect().width + gap;
      const shift = event.clientX - startX;
      if (Math.abs(shift) > itemWidth * 0.18) {
        go(shift < 0 ? 1 : -1);
      } else {
        update();
      }
    });

    viewport.addEventListener('pointercancel', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = '';
      update();
    });

    window.addEventListener('resize', update);
    update();
  }

  setupSlider('projects');
  setupSlider('reviews');

  window.addEventListener('scroll', setActiveTab, { passive: true });
  window.addEventListener('resize', setActiveTab);
  setActiveTab();

  const diplomaModal = document.querySelector('#diplomaModal');
  const openDiplomaButtons = document.querySelectorAll('[data-diploma-open]');
  const closeDiplomaButtons = document.querySelectorAll('[data-diploma-close]');
  const diplomaImage = document.querySelector('#diplomaModalImage');
  const diplomaTitle = document.querySelector('#diplomaModalTitle');

  function closeDiploma() {
    if (!diplomaModal) return;
    diplomaModal.classList.remove('is-open');
    diplomaModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  function openDiploma(button) {
    if (!diplomaModal) return;
    if (diplomaImage && button?.dataset.diplomaSrc) {
      diplomaImage.src = button.dataset.diplomaSrc;
      diplomaImage.alt = button.dataset.diplomaTitle || 'Документ об образовании';
    }
    if (diplomaTitle && button?.dataset.diplomaTitle) {
      diplomaTitle.textContent = button.dataset.diplomaTitle;
    }
    diplomaModal.classList.add('is-open');
    diplomaModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  openDiplomaButtons.forEach((button) => {
    button.addEventListener('click', () => openDiploma(button));
  });

  closeDiplomaButtons.forEach((button) => {
    button.addEventListener('click', closeDiploma);
  });

  const specialistContactModal = document.querySelector('#specialistContactModal');

  function closeSpecialistContact() {
    if (!specialistContactModal) return;
    specialistContactModal.classList.remove('is-open');
    specialistContactModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  function openSpecialistContact(event) {
    event.preventDefault();
    if (!specialistContactModal) return;
    specialistContactModal.classList.add('is-open');
    specialistContactModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  document.querySelectorAll('[data-specialist-contact-open]').forEach((button) => {
    button.addEventListener('click', openSpecialistContact);
  });

  document.querySelectorAll('[data-specialist-contact-close]').forEach((button) => {
    button.addEventListener('click', closeSpecialistContact);
  });

  const reviewModal = document.querySelector('#reviewModal');
  const reviewText = document.querySelector('#reviewModalText');
  const reviewYear = document.querySelector('#reviewModalYear');
  const reviewImageWrap = document.querySelector('#reviewModalImageWrap');
  const reviewImage = document.querySelector('#reviewModalImage');

  function closeReviewModal() {
    if (!reviewModal) return;
    reviewModal.classList.remove('is-open');
    reviewModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  function openReviewModal(button) {
    if (!reviewModal) return;
    reviewText.textContent = button.dataset.reviewText || '';
    reviewYear.textContent = button.dataset.reviewYear || '';

    if (button.dataset.reviewImage) {
      reviewImage.src = button.dataset.reviewImage;
      reviewImageWrap.hidden = false;
    } else {
      reviewImage.removeAttribute('src');
      reviewImageWrap.hidden = true;
    }

    reviewModal.classList.add('is-open');
    reviewModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  document.querySelectorAll('[data-review-open]').forEach((button) => {
    button.addEventListener('click', () => openReviewModal(button));
  });

  document.querySelectorAll('[data-review-close]').forEach((button) => {
    button.addEventListener('click', closeReviewModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDiploma();
      closeReviewModal();
      closeSpecialistContact();
    }
  });
});
