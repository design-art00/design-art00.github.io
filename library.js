document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-library-page]');
  if (!root) return;

  const cards = Array.from(root.querySelectorAll('.card'));
  const cardsGrid = root.querySelector('#itemsGrid');
  const pagination = root.querySelector('#pagination');
  const input = root.querySelector('#searchInput');
  const topicChecks = root.querySelectorAll('.topic-check');
  const yearChecks = root.querySelectorAll('.year-check');
  const topicBtn = root.querySelector('#topicFilterBtn');
  const yearBtn = root.querySelector('#yearFilterBtn');
  const clearTopicBtn = root.querySelector('#clearTopicBtn');
  const clearYearBtn = root.querySelector('#clearYearBtn');
  const letterBtns = root.querySelectorAll('.letter-btn');
  const miniPlayer = document.querySelector('#miniPlayer');
  const audio = document.querySelector('#podcastAudio');
  const miniTitle = document.querySelector('#miniPlayerTitle');
  const miniAuthor = document.querySelector('#miniPlayerAuthor');
  const miniClose = document.querySelector('#miniPlayerClose');
  const podcastButtons = root.querySelectorAll('.podcast-btn');

  const topToolbar = root.querySelector('.top-toolbar');
  if (topToolbar && cards.length > 1 && !root.querySelector('#sortFilter')) {
    const sortFilter = document.createElement('div');
    sortFilter.className = 'mini-filter sort-filter';
    sortFilter.id = 'sortFilter';
    sortFilter.innerHTML = `
      <button type="button" class="mini-filter-btn" id="sortFilterBtn">По умолчанию</button>
      <div class="mini-filter-dropdown">
        <label class="mini-checkbox-item"><input type="radio" class="sort-radio" name="librarySort" value="title-asc" checked>По умолчанию</label>
        <label class="mini-checkbox-item"><input type="radio" class="sort-radio" name="librarySort" value="title-desc">От Я до А</label>
        <label class="mini-checkbox-item"><input type="radio" class="sort-radio" name="librarySort" value="date-desc">По дате публикации</label>
      </div>`;

    const search = root.querySelector('.search-wrapper');
    topToolbar.insertBefore(sortFilter, search || null);
  }

  const sortRadios = root.querySelectorAll('.sort-radio');
  const sortBtn = root.querySelector('#sortFilterBtn');

  let currentPage = 1;
  let activeLetter = 'all';
  let currentPodcastButton = null;
  const itemsPerPage = 10;

  const labels = {
    psychology: 'Психология',
    philosophy: 'Философия',
    analysis: 'Психоанализ',
    psychoanalysis: 'Психоанализ',
    subjectivity: 'Философия и субъектность',
    emotions: 'Эмоции и саморегуляция',
    practice: 'Терапевтическая практика',
    relationships: 'Отношения и границы',
    stress: 'Тревога и стресс',
    selfworth: 'Самооценка и опора',
    therapy: 'Терапия и психоанализ',
    therapy_process: 'Терапевтический процесс',
    attachment: 'Отношения и привязанность',
    'title-asc': 'По умолчанию',
    'title-desc': 'От Я до А',
    'date-desc': 'По дате публикации',
    2026: '2026',
    2025: '2025',
    2024: '2024',
    2023: '2023',
    2022: '2022',
    2021: '2021'
  };

  const checkedValues = (nodes) => Array.from(nodes).filter((node) => node.checked).map((node) => node.value);
  const collator = new Intl.Collator('ru', { sensitivity: 'base' });

  const getCardTitle = (card) => card.querySelector('.item-title')?.textContent.trim() || '';

  const getCardDate = (card) => {
    const dateText = card.querySelector('.publish-date')?.textContent.trim() || '';
    const match = dateText.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (match) {
      const [, day, month, year] = match;
      return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    }
    if (card.dataset.year) return new Date(Number(card.dataset.year), 0, 1).getTime();
    return Number.NEGATIVE_INFINITY;
  };

  const getSortValue = () => root.querySelector('.sort-radio:checked')?.value || 'title-asc';

  const sortCards = (items) => {
    const sortValue = getSortValue();
    return [...items].sort((first, second) => {
      const firstTitle = getCardTitle(first);
      const secondTitle = getCardTitle(second);
      if (sortValue === 'title-desc') return collator.compare(secondTitle, firstTitle);
      if (sortValue === 'date-desc') {
        const dateDiff = getCardDate(second) - getCardDate(first);
        if (dateDiff !== 0) return dateDiff;
      }
      return collator.compare(firstTitle, secondTitle);
    });
  };

  const updateButtonText = (button, values, fallback) => {
    if (!button) return;
    if (values.length === 0) button.textContent = fallback;
    else if (values.length === 1) button.textContent = labels[values[0]];
    else button.textContent = `${fallback}: ${values.length}`;
  };

  const renderPagination = (totalPages) => {
    if (!pagination) return;
    pagination.innerHTML = '';
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
        updateUI();
      });
      pagination.appendChild(button);
    };

    createButton('‹', Math.max(1, currentPage - 1), { disabled: currentPage === 1 });
    for (let i = 1; i <= totalPages; i += 1) {
      createButton(String(i), i, { active: i === currentPage });
    }
    createButton('›', Math.min(totalPages, currentPage + 1), { disabled: currentPage === totalPages });
  };

  function updateUI() {
    const searchValue = input ? input.value.toLowerCase() : '';
    const topics = checkedValues(topicChecks);
    const years = checkedValues(yearChecks);

    const filtered = sortCards(cards.filter((card) => {
      const title = card.querySelector('.item-title')?.textContent.trim().toLowerCase() || '';
      const matchesSearch = card.innerText.toLowerCase().includes(searchValue);
      const matchesTopic = topics.length === 0 || topics.includes(card.dataset.topic);
      const matchesYear = years.length === 0 || years.includes(card.dataset.year);
      const matchesLetter = activeLetter === 'all' || title.charAt(0) === activeLetter;
      return matchesSearch && matchesTopic && matchesYear && matchesLetter;
    }));

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;

    cards.forEach((card) => { card.style.display = 'none'; });
    filtered.forEach((card) => cardsGrid?.appendChild(card));
    filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).forEach((card) => {
      card.style.display = 'flex';
    });

    updateButtonText(topicBtn, topics, 'Тема');
    updateButtonText(yearBtn, years, 'Год');
    updateButtonText(sortBtn, [getSortValue()], 'Сортировка');
    renderPagination(totalPages);
  }

  root.querySelectorAll('.mini-filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.closest('.mini-filter');
      const isOpen = filter.classList.contains('open');
      root.querySelectorAll('.mini-filter').forEach((node) => node.classList.remove('open'));
      if (!isOpen) filter.classList.add('open');
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.mini-filter')) {
      root.querySelectorAll('.mini-filter').forEach((node) => node.classList.remove('open'));
    }
  });

  topicChecks.forEach((check) => check.addEventListener('change', () => { currentPage = 1; updateUI(); }));
  yearChecks.forEach((check) => check.addEventListener('change', () => { currentPage = 1; updateUI(); }));
  sortRadios.forEach((radio) => radio.addEventListener('change', () => { currentPage = 1; updateUI(); }));
  input?.addEventListener('input', () => { currentPage = 1; updateUI(); });
  clearTopicBtn?.addEventListener('click', () => {
    topicChecks.forEach((check) => { check.checked = false; });
    currentPage = 1;
    updateUI();
  });
  clearYearBtn?.addEventListener('click', () => {
    yearChecks.forEach((check) => { check.checked = false; });
    currentPage = 1;
    updateUI();
  });

  letterBtns.forEach((button) => {
    button.addEventListener('click', () => {
      const clickedLetter = button.dataset.letter;
      const shouldReset = activeLetter === clickedLetter && clickedLetter !== 'all';
      activeLetter = shouldReset ? 'all' : clickedLetter;

      letterBtns.forEach((node) => node.classList.remove('active'));
      const activeButton = shouldReset ? root.querySelector('.letter-btn[data-letter="all"]') : button;
      activeButton?.classList.add('active');

      currentPage = 1;
      updateUI();
    });
  });

  const resetPodcastButtons = () => {
    podcastButtons.forEach((button) => {
      button.innerHTML = '<svg viewBox="0 0 16 16"><path d="M4 2.7v10.6c0 .6.6.9 1.1.6l8.2-5.3c.5-.3.5-1 0-1.3L5.1 2.1C4.6 1.8 4 2.1 4 2.7z"></path></svg>Слушать';
    });
  };

  podcastButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!audio || !miniPlayer) return;
      const audioSrc = button.dataset.audio;
      if (currentPodcastButton === button && !audio.paused) {
        audio.pause();
        resetPodcastButtons();
        currentPodcastButton = null;
        return;
      }
      if (audio.getAttribute('src') !== audioSrc) audio.src = audioSrc;
      audio.play();
      currentPodcastButton = button;
      resetPodcastButtons();
      button.innerHTML = '<svg viewBox="0 0 16 16"><path d="M4 2h3v12H4zM9 2h3v12H9z"></path></svg>Пауза';
      miniTitle.textContent = button.dataset.title;
      miniAuthor.textContent = button.dataset.author;
      miniPlayer.classList.add('visible');
    });
  });

  miniClose?.addEventListener('click', () => {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    resetPodcastButtons();
    currentPodcastButton = null;
    miniPlayer.classList.remove('visible');
  });

  const glossaryModal = document.querySelector('#glossaryModal');
  const glossaryTitle = document.querySelector('#glossaryModalTitle');
  const glossaryText = document.querySelector('#glossaryModalText');
  const glossarySource = document.querySelector('#glossaryModalSource');
  const glossaryArticles = document.querySelector('#glossaryModalArticles');

  const closeGlossaryModal = () => {
    if (!glossaryModal) return;
    glossaryModal.classList.remove('is-open');
    glossaryModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('glossary-modal-open');
  };

  const openGlossaryModal = (card) => {
    if (!glossaryModal || !glossaryTitle || !glossaryText || !glossarySource || !glossaryArticles) return;

    const title = card.querySelector('.item-title')?.textContent.trim() || 'Термин';
    glossaryTitle.textContent = title;
    glossaryText.textContent = card.dataset.full || card.querySelector('.item-description')?.textContent.trim() || '';
    glossarySource.textContent = card.dataset.source || 'Источник будет добавлен позже.';
    glossaryArticles.innerHTML = '';

    const articleLinks = (card.dataset.articles || '').split(';').filter(Boolean);
    if (articleLinks.length) {
      articleLinks.forEach((item) => {
        const [label, href] = item.split('|');
        const link = document.createElement('a');
        link.href = href || 'articles.html';
        link.textContent = label || 'Статья';
        glossaryArticles.appendChild(link);
      });
    } else {
      const empty = document.createElement('span');
      empty.textContent = 'Пока нет связанных статей';
      glossaryArticles.appendChild(empty);
    }

    glossaryModal.classList.add('is-open');
    glossaryModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('glossary-modal-open');
  };

  root.querySelectorAll('.glossary-open').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      openGlossaryModal(button.closest('.glossary-card'));
    });
  });

  document.querySelectorAll('[data-glossary-close]').forEach((button) => {
    button.addEventListener('click', closeGlossaryModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeGlossaryModal();
  });

  updateUI();
});
