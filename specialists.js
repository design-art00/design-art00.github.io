document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-specialists-page]');
  if (!root) return;

  root.querySelectorAll('.filter-header').forEach((button) => {
    button.addEventListener('click', () => {
      button.parentElement.classList.toggle('active');
    });
  });

  const ageSlider = root.querySelector('#ageRange');
  const ageVal = root.querySelector('#ageVal');
  const priceMinInput = root.querySelector('#priceMin');
  const priceMaxInput = root.querySelector('#priceMax');
  const searchInput = root.querySelector('#specialistsSearchInput');
  const citySelect = root.querySelector('#citySelect');
  const cityFilterWrap = root.querySelector('#cityFilterWrap');
  const resetBtn = root.querySelector('#resetBtn');
  const cardsGrid = root.querySelector('#specsGrid');
  const cards = Array.from(root.querySelectorAll('.card')).sort((first, second) => {
    const firstName = first.querySelector('.spec-title')?.textContent.trim() || '';
    const secondName = second.querySelector('.spec-title')?.textContent.trim() || '';
    return firstName.localeCompare(secondName, 'ru');
  });
  const paginationContainer = root.querySelector('#pagination');

  let currentPage = 1;
  const itemsPerPage = 12;

  cards.forEach((card) => cardsGrid?.appendChild(card));

  const checkedValues = (selector) => Array.from(root.querySelectorAll(selector))
    .filter((el) => el.checked)
    .map((el) => el.value);

  const normalizeCity = (value) => value.replace(/^г\.\s*/i, '').trim();
  const cardCity = (card) => normalizeCity(card.querySelector('.spec-city')?.textContent || '');

  if (citySelect) {
    const cities = [...new Set(cards.map(cardCity).filter(Boolean))]
      .sort((first, second) => first.localeCompare(second, 'ru'));
    cities.forEach((city) => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }

  function syncCityFilterVisibility() {
    const isOfflineSelected = root.querySelector('[data-filter="format"][value="offline"]')?.checked;
    cityFilterWrap?.classList.toggle('is-hidden', !isOfflineSelected);
    if (!isOfflineSelected && citySelect) citySelect.value = '';
  }

  function renderPaginationButtons(totalPages) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    const createButton = (label, page, options = {}) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.className = `page-btn ${options.active ? 'active' : ''}`;
      button.disabled = Boolean(options.disabled);
      button.addEventListener('click', () => {
        if (button.disabled) return;
        currentPage = page;
        applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(button);
    };

    const createDots = () => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'page-dots page-dots-button';
      button.textContent = '...';
      button.setAttribute('aria-label', 'Перейти к странице');

      button.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.max = String(totalPages);
        input.value = String(currentPage);
        input.className = 'page-jump-input';
        input.setAttribute('aria-label', 'Введите номер страницы');

        const submitJump = () => {
          const nextPage = Number.parseInt(input.value, 10);
          if (!Number.isNaN(nextPage)) {
            currentPage = Math.min(totalPages, Math.max(1, nextPage));
            applyFilters();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            paginationContainer.replaceChild(button, input);
          }
        };

        input.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') submitJump();
          if (event.key === 'Escape') paginationContainer.replaceChild(button, input);
        });

        input.addEventListener('blur', submitJump, { once: true });
        paginationContainer.replaceChild(input, button);
        input.focus();
        input.select();
      });

      paginationContainer.appendChild(button);
    };

    const getVisiblePages = () => {
      if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

      const pages = new Set([1, 2, 3, 4, totalPages - 1, totalPages]);
      if (currentPage > 4 && currentPage < totalPages - 1) pages.add(currentPage);
      return [...pages].sort((first, second) => first - second);
    };

    createButton('‹', Math.max(1, currentPage - 1), { disabled: currentPage === 1 });
    getVisiblePages().forEach((page, index, pages) => {
      if (index > 0 && page - pages[index - 1] > 1) createDots();
      createButton(String(page), page, { active: page === currentPage });
    });
    createButton('›', Math.min(totalPages, currentPage + 1), { disabled: currentPage === totalPages });
  }

  function applyFilters() {
    const activeTypes = checkedValues('[data-filter="type"]:checked');
    const activeTherapy = checkedValues('[data-filter="therapy"]:checked');
    const activeFormats = checkedValues('[data-filter="format"]:checked');
    const activeTopics = checkedValues('[data-filter="topic"]:checked');
    const activeMethods = checkedValues('[data-filter="method"]:checked');
    const activeSex = root.querySelector('[data-filter="sex"]:checked')?.value || 'all';
    const minAge = Number.parseInt(ageSlider?.value || '25', 10);
    const minPrice = Number.parseInt(priceMinInput?.value || '0', 10);
    const maxPrice = Number.parseInt(priceMaxInput?.value || '0', 10);
    const searchValue = (searchInput?.value || '').trim().toLowerCase();
    const mainTopics = ['find_self', 'sleep', 'insecure', 'emotions', 'burnout'];
    syncCityFilterVisibility();
    const activeCity = normalizeCity(citySelect?.value || '');

    const filtered = cards.filter((card) => {
      const cardTherapy = (card.dataset.therapy || '').split(' ');
      const cardFormats = (card.dataset.format || 'online offline').split(' ');
      const cardPrice = Number.parseInt(card.dataset.price || '0', 10);
      const cardText = card.innerText.toLowerCase();
      const matchType = activeTypes.length === 0 || activeTypes.includes(card.dataset.type);
      const matchTherapy = activeTherapy.length === 0 || activeTherapy.some((value) => cardTherapy.includes(value));
      const matchFormat = activeFormats.length === 0 || activeFormats.some((value) => {
        if (!cardFormats.includes(value)) return false;
        return value !== 'offline' || !activeCity || cardCity(card) === activeCity;
      });
      const matchTopic = activeTopics.length === 0
        || activeTopics.includes(card.dataset.topic)
        || (activeTopics.includes('other') && !mainTopics.includes(card.dataset.topic));
      const matchMethod = activeMethods.length === 0 || activeMethods.includes(card.dataset.method);
      const matchSex = activeSex === 'all' || card.dataset.sex === activeSex;
      const matchAge = Number.parseInt(card.dataset.age || '0', 10) >= minAge;
      const matchMinPrice = !minPrice || cardPrice >= minPrice;
      const matchMaxPrice = !maxPrice || cardPrice <= maxPrice;
      const matchSearch = !searchValue || cardText.includes(searchValue);
      return matchType && matchTherapy && matchFormat && matchTopic && matchMethod && matchSex && matchAge && matchMinPrice && matchMaxPrice && matchSearch;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;

    cards.forEach((card) => { card.style.display = 'none'; });
    filtered
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .forEach((card) => { card.style.display = 'flex'; });

    renderPaginationButtons(totalPages);

    const isFiltered = activeTypes.length > 0
      || activeTherapy.length > 0
      || activeFormats.length > 0
      || activeCity.length > 0
      || activeTopics.length > 0
      || activeMethods.length > 0
      || activeSex !== 'all'
      || minAge > 25
      || minPrice > 0
      || maxPrice > 0
      || searchValue.length > 0;

    if (resetBtn) resetBtn.style.display = isFiltered ? 'flex' : 'none';
  }

  root.querySelectorAll('input').forEach((el) => {
    el.addEventListener('change', () => {
      currentPage = 1;
      applyFilters();
    });
  });

  citySelect?.addEventListener('change', () => {
    currentPage = 1;
    applyFilters();
  });

  root.querySelectorAll('.price-input').forEach((el) => {
    el.addEventListener('input', () => {
      currentPage = 1;
      applyFilters();
    });
  });

  searchInput?.addEventListener('input', () => {
    currentPage = 1;
    applyFilters();
  });

  if (ageSlider && ageVal) {
    ageSlider.addEventListener('input', (e) => {
      ageVal.textContent = e.target.value;
      currentPage = 1;
      applyFilters();
    });
  }

  resetBtn?.addEventListener('click', () => {
    root.querySelectorAll('.f-check').forEach((i) => { i.checked = false; });
    root.querySelectorAll('.f-radio').forEach((i) => { i.checked = i.value === 'all'; });
    if (ageSlider && ageVal) {
      ageSlider.value = 25;
      ageVal.textContent = '25';
    }
    if (priceMinInput) priceMinInput.value = '';
    if (priceMaxInput) priceMaxInput.value = '';
    if (searchInput) searchInput.value = '';
    if (citySelect) citySelect.value = '';
    syncCityFilterVisibility();
    currentPage = 1;
    applyFilters();
  });

  applyFilters();
});
