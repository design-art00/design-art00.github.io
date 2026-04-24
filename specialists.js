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
  const resetBtn = root.querySelector('#resetBtn');
  const cards = Array.from(root.querySelectorAll('.card'));
  const paginationContainer = root.querySelector('#pagination');

  let currentPage = 1;
  const itemsPerPage = 12;

  const checkedValues = (selector) => Array.from(root.querySelectorAll(selector))
    .filter((el) => el.checked)
    .map((el) => el.value);

  function renderPaginationButtons(totalPages) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.textContent = '←';
    prev.className = 'page-btn';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', () => {
      currentPage = Math.max(1, currentPage - 1);
      applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationContainer.appendChild(prev);

    for (let i = 1; i <= totalPages; i += 1) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = i;
      btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      btn.addEventListener('click', () => {
        currentPage = i;
        applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(btn);
    }

    const next = document.createElement('button');
    next.type = 'button';
    next.textContent = '→';
    next.className = 'page-btn';
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', () => {
      currentPage = Math.min(totalPages, currentPage + 1);
      applyFilters();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationContainer.appendChild(next);
  }

  function applyFilters() {
    const activeTypes = checkedValues('[data-filter="type"]:checked');
    const activeTherapy = checkedValues('[data-filter="therapy"]:checked');
    const activeTopics = checkedValues('[data-filter="topic"]:checked');
    const activeMethods = checkedValues('[data-filter="method"]:checked');
    const activeSex = root.querySelector('[data-filter="sex"]:checked')?.value || 'all';
    const minAge = Number.parseInt(ageSlider?.value || '25', 10);
    const minPrice = Number.parseInt(priceMinInput?.value || '0', 10);
    const maxPrice = Number.parseInt(priceMaxInput?.value || '0', 10);
    const searchValue = (searchInput?.value || '').trim().toLowerCase();
    const mainTopics = ['find_self', 'sleep', 'insecure', 'emotions', 'burnout'];

    const filtered = cards.filter((card) => {
      const cardTherapy = (card.dataset.therapy || '').split(' ');
      const cardPrice = Number.parseInt(card.dataset.price || '0', 10);
      const cardText = card.innerText.toLowerCase();
      const matchType = activeTypes.length === 0 || activeTypes.includes(card.dataset.type);
      const matchTherapy = activeTherapy.length === 0 || activeTherapy.some((value) => cardTherapy.includes(value));
      const matchTopic = activeTopics.length === 0
        || activeTopics.includes(card.dataset.topic)
        || (activeTopics.includes('other') && !mainTopics.includes(card.dataset.topic));
      const matchMethod = activeMethods.length === 0 || activeMethods.includes(card.dataset.method);
      const matchSex = activeSex === 'all' || card.dataset.sex === activeSex;
      const matchAge = Number.parseInt(card.dataset.age || '0', 10) >= minAge;
      const matchMinPrice = !minPrice || cardPrice >= minPrice;
      const matchMaxPrice = !maxPrice || cardPrice <= maxPrice;
      const matchSearch = !searchValue || cardText.includes(searchValue);
      return matchType && matchTherapy && matchTopic && matchMethod && matchSex && matchAge && matchMinPrice && matchMaxPrice && matchSearch;
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
    currentPage = 1;
    applyFilters();
  });

  applyFilters();
});
