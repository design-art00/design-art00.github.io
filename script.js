document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-button');
const menuPanel = document.querySelector('.menu-panel');
const menuLinks = document.querySelectorAll('.menu-panel a');
const dropdown = document.querySelector('.nav-dropdown');
const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
const form = document.querySelector('.contact-form');
const statusNode = document.querySelector('.form-status');
const quoteSlider = document.querySelector('.quote-slider');
const parallaxSections = Array.from(document.querySelectorAll('[data-parallax-section]'));

const initSitePreloader = () => {
  if (!document.body || document.querySelector('.site-preloader')) return;

  const preloader = document.createElement('div');
  preloader.className = 'site-preloader';
  preloader.setAttribute('aria-live', 'polite');
  preloader.innerHTML = `
    <div class="site-preloader__inner">
      <div class="newtons-cradle" aria-hidden="true">
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
        <div class="newtons-cradle__dot"></div>
      </div>
      <div class="site-preloader__text">Загружаем сайт...</div>
    </div>
  `;
  document.body.prepend(preloader);

  const startedAt = Date.now();
  const minDuration = 650;

  const hidePreloader = () => {
    const rest = Math.max(minDuration - (Date.now() - startedAt), 0);
    window.setTimeout(() => {
      preloader.classList.add('is-hidden');
      preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
      window.setTimeout(() => preloader.remove(), 700);
    }, rest);
  };

  if (document.readyState === 'complete') hidePreloader();
  else window.addEventListener('load', hidePreloader, { once: true });

  window.setTimeout(hidePreloader, 3500);
};

initSitePreloader();

const markReady = () => {
  // Double rAF gives the browser a moment to apply initial styles before transitioning in.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.classList.add('is-ready');
  }));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', markReady, { once: true });
} else {
  markReady();
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) markReady();
});

const closeMenu = () => {
  if (!menuButton || !menuPanel) return;
  document.body.classList.remove('menu-open');
  menuPanel.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
};

if (menuButton && menuPanel) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuPanel.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

menuLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    if (dropdown) {
      dropdown.classList.remove('is-open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

if (dropdown && dropdownToggle) {
  dropdownToggle.addEventListener('click', () => {
    const isOpen = dropdown.classList.toggle('is-open');
    dropdownToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-dropdown')) {
      dropdown.classList.remove('is-open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (quoteSlider) {
  const track = quoteSlider.querySelector('.quote-track');
  if (track) {
    const quotes = [
      '«Когда мы начинаем лучше понимать себя, у нас появляется выбор»',
      '«Когда мы учимся слышать себя, у нас появляется возможность выбирать»',
      '«Когда есть диалог и поддержка, становится проще удерживать практику»',
      '«Когда знания разделяют с коллегами, они становятся частью общего процесса»'
    ];
    let quoteIndex = 0;

    const nextQuote = () => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      const next = document.createElement('span');
      next.className = 'quote-slide';
      next.textContent = quotes[quoteIndex];
      quoteSlider.classList.toggle('quote-slider--alt', quoteIndex % 2 === 1);
      track.appendChild(next);

      // Slide the track left by one "page".
      track.classList.add('is-animating');
      track.style.transform = 'translateX(-100%)';

      const onDone = () => {
        track.removeEventListener('transitionend', onDone);
        // Remove the previous slide and reset without animation.
        track.firstElementChild?.remove();
        track.classList.remove('is-animating');
        track.style.transform = 'translateX(0)';
      };

      track.addEventListener('transitionend', onDone);
    };

    setInterval(nextQuote, 4500);
  }
}

if (parallaxSections.length > 0) {
  let parallaxFrame = null;

  const updateParallax = () => {
    parallaxFrame = null;
    const viewportCenter = window.innerHeight / 2;

    parallaxSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const progress = (viewportCenter - sectionCenter) / Math.max(window.innerHeight, 1);

      section.querySelectorAll('[data-parallax-layer]').forEach((layer) => {
        const speed = Number.parseFloat(layer.dataset.speed || '0.08');
        const offset = progress * speed * 360;
        const scale = layer.classList.contains("photo-invite__bg") ? " scale(1.08)" : "";
        layer.style.transform = `translate3d(0, ${offset}px, 0)${scale}`;
      });
    });
  };

  const requestParallaxUpdate = () => {
    if (parallaxFrame) return;
    parallaxFrame = requestAnimationFrame(updateParallax);
  };

  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate);
  requestParallaxUpdate();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14
});

document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

const initContactMethodFields = () => {
  document.querySelectorAll('.contacts-page-form').forEach((formNode) => {
    const radios = Array.from(formNode.querySelectorAll('input[name="contactMethod"]'));
    const fields = Array.from(formNode.querySelectorAll('[data-contact-channel]'));
    if (radios.length === 0 || fields.length === 0) return;

    const sync = () => {
      const active = radios.find((radio) => radio.checked)?.value || 'phone';
      fields.forEach((field) => {
        const input = field.querySelector('input, textarea');
        const isActive = field.dataset.contactChannel === active;
        field.hidden = !isActive;
        if (input) {
          input.required = isActive;
          if (!isActive) input.value = '';
        }
      });
    };

    radios.forEach((radio) => radio.addEventListener('change', sync));
    formNode.addEventListener('reset', () => requestAnimationFrame(sync));
    sync();
  });
};

initContactMethodFields();

if (form && statusNode) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      statusNode.textContent = 'Заполните поля и подтвердите согласие на обработку данных.';
      form.reportValidity();
      return;
    }

    form.reset();
    statusNode.textContent = 'Спасибо! Форма готова к подключению к серверу.';
  });
}

// Global noise overlay: subtle texture layer across all pages.
(() => {
  let noiseInterval = null;

  const ensureNoiseLayer = () => {
    const existingNode = document.querySelector('.page__noise');
    if (existingNode) {
      existingNode.classList.add('page__noise--visible');
      return;
    }
    document.body.insertAdjacentHTML('beforeend', '<div class="page__noise" aria-hidden="true"></div>');
    requestAnimationFrame(() => {
      document.querySelector('.page__noise')?.classList.add('page__noise--visible');
    });
  };

  const updateNoisePosition = () => {
    const node = document.querySelector('.page__noise');
    if (!node) return;
    node.style.backgroundPosition = `${Math.floor(Math.random() * 100)}% ${Math.floor(Math.random() * 100)}%`;
  };

  const setAppHeight = () => {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureNoiseLayer();
      setAppHeight();
      if (!noiseInterval) noiseInterval = window.setInterval(updateNoisePosition, 100);
    });
  } else {
    ensureNoiseLayer();
    setAppHeight();
    if (!noiseInterval) noiseInterval = window.setInterval(updateNoisePosition, 100);
  }

  window.addEventListener('load', () => {
    document.querySelector('.page__noise')?.classList.add('page__noise--visible');
  });

  window.addEventListener('resize', setAppHeight);
})();

// Account modal. No backend: login is Анна Воронина / 1111.
(() => {
  const accountKey = 'lecollectif-user';
  const legacyKey = 'lecollectif-demo-user';
  const accountName = 'Анна Воронина';
  const accountShortName = 'Анна В.';
  const accountAvatar = 'assets/expert-anna.jpg';

  const markup = `
    <div class="auth-modal" id="authModal" aria-hidden="true">
      <div class="auth-modal__backdrop" data-auth-close></div>
      <section class="auth-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
        <button class="auth-modal__close" type="button" data-auth-close aria-label="Закрыть">×</button>
        <h2 id="authModalTitle">Личный кабинет</h2>
        <div class="auth-tabs" role="tablist" aria-label="Вход или регистрация">
          <button class="is-active" type="button" role="tab" aria-selected="true" data-auth-tab="login">Войти</button>
          <button type="button" role="tab" aria-selected="false" data-auth-tab="register">Зарегистрироваться</button>
        </div>
        <form class="auth-modal-form is-active" data-auth-form="login">
          <label><span>Логин</span><input type="text" id="accountLoginName" autocomplete="username" placeholder="Анна Воронина"></label>
          <label><span>Пароль</span><input type="password" id="accountLoginPassword" autocomplete="current-password" placeholder="1111"></label>
          <p class="auth-modal-message" data-auth-message="login" aria-live="polite"></p>
          <button class="button primary wide" type="submit">Войти</button>
        </form>
        <form class="auth-modal-form" data-auth-form="register">
          <label><span>Имя</span><input type="text" placeholder="Анна"></label>
          <label><span>Email</span><input type="email" placeholder="mail@example.com"></label>
          <label><span>Пароль</span><input type="password" placeholder="Придумайте пароль"></label>
          <label class="auth-modal-checkbox"><input type="checkbox"><span>Согласен(на) с правилами сообщества</span></label>
          <p class="auth-modal-message" data-auth-message="register" aria-live="polite"></p>
          <button class="button ghost wide" type="submit">Создать аккаунт</button>
        </form>
      </section>
    </div>`;

  const isLoggedIn = () => localStorage.getItem(accountKey) === accountName;

  const migrateLegacyLogin = () => {
    if (localStorage.getItem(legacyKey)) {
      localStorage.removeItem(legacyKey);
      localStorage.setItem(accountKey, accountName);
    }
  };

  const ensureModal = () => {
    if (!document.querySelector('#authModal')) document.body.insertAdjacentHTML('beforeend', markup);
    return document.querySelector('#authModal');
  };

  const accountMenuMarkup = () => `
    <div class="account-menu-panel" data-account-menu>
      <a href="account.html#publications">Мои публикации</a>
      <a href="account.html#profile">Мой профиль</a>
      <span class="account-menu-panel__line" aria-hidden="true"></span>
      <button type="button" data-auth-logout><span aria-hidden="true">↗</span>Выйти</button>
    </div>`;

  const setAuthTab = (name) => {
    const modal = ensureModal();
    modal.querySelectorAll('[data-auth-tab]').forEach((tab) => {
      const isActive = tab.dataset.authTab === name;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
    modal.querySelectorAll('[data-auth-form]').forEach((formNode) => {
      formNode.classList.toggle('is-active', formNode.dataset.authForm === name);
    });
  };

  const openAuthModal = (tab = 'login') => {
    const modal = ensureModal();
    setAuthTab(tab);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('auth-modal-open');
    requestAnimationFrame(() => modal.querySelector('input')?.focus());
  };

  const closeAuthModal = () => {
    const modal = document.querySelector('#authModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('auth-modal-open');
  };

  const refreshAccountButtons = () => {
    migrateLegacyLogin();
    const loggedIn = isLoggedIn();
    document.querySelectorAll('[data-auth-open].account-button').forEach((button) => {
      const existingMenu = button.parentElement?.querySelector('[data-account-menu]');
      if (existingMenu) existingMenu.remove();

      button.classList.toggle('account-button--user', loggedIn);
      button.setAttribute('href', loggedIn ? 'account.html' : '#');
      button.innerHTML = loggedIn
        ? `<img src="${accountAvatar}" alt="${accountName}"><span>${accountShortName}</span>`
        : 'Личный кабинет';

      if (loggedIn) button.insertAdjacentHTML('afterend', accountMenuMarkup());
    });
  };

  document.addEventListener('click', (event) => {
    const logout = event.target.closest('[data-auth-logout]');
    if (logout) {
      event.preventDefault();
      localStorage.removeItem(accountKey);
      refreshAccountButtons();
      if (document.body.classList.contains('account-body')) window.location.href = 'index.html#top';
      return;
    }

    const opener = event.target.closest('[data-auth-open]');
    if (opener) {
      if (isLoggedIn() && opener.classList.contains('account-button')) return;
      event.preventDefault();
      openAuthModal(opener.dataset.authOpen || 'login');
      return;
    }

    if (event.target.closest('[data-auth-close]')) closeAuthModal();

    const tab = event.target.closest('[data-auth-tab]');
    if (tab) setAuthTab(tab.dataset.authTab);
  });

  document.addEventListener('submit', (event) => {
    const loginForm = event.target.closest('[data-auth-form="login"]');
    const registerForm = event.target.closest('[data-auth-form="register"]');
    if (!loginForm && !registerForm) return;

    event.preventDefault();
    const modal = ensureModal();

    if (loginForm) {
      const login = modal.querySelector('#accountLoginName')?.value.trim().toLowerCase();
      const password = modal.querySelector('#accountLoginPassword')?.value.trim();
      const message = modal.querySelector('[data-auth-message="login"]');
      const allowedNames = ['анна воронина', 'anna voronina'];
      if (allowedNames.includes(login) && password === '1111') {
        localStorage.setItem(accountKey, accountName);
        message.textContent = 'Вы вошли в личный кабинет.';
        message.classList.remove('is-error');
        refreshAccountButtons();
        closeAuthModal();
      } else {
        message.textContent = 'Введите Анна Воронина и пароль 1111.';
        message.classList.add('is-error');
      }
    }

    if (registerForm) {
      const message = modal.querySelector('[data-auth-message="register"]');
      message.textContent = 'Регистрация пока не подключена. Это кликабельный прототип формы.';
      message.classList.remove('is-error');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAuthModal();
  });

  refreshAccountButtons();
})();

// Header search available on every page.
(() => {
  const headerActions = document.querySelector('.header-actions');
  if (!headerActions || document.querySelector('.site-search')) return;

  const searchIndex = [
    { title: 'Главная', url: 'index.html#top', excerpt: 'Профессиональное сообщество психологов, психотерапевтов и психоаналитиков.', keywords: 'главная сообщество проект le collectif' },
    { title: 'Специалисты', url: 'specialists.html', excerpt: 'Подбор специалиста по теме, подходу, стоимости и формату терапии.', keywords: 'психолог психотерапевт психоаналитик терапия консультация' },
    { title: 'Календарь мероприятий', url: 'calendar.html', excerpt: 'Лекции, супервизии, семинары и воркшопы профессионального сообщества.', keywords: 'календарь мероприятия события лекции супервизии семинары воркшопы афиша' },
    { title: 'Анна Воронина', url: 'anna-voronina.html', excerpt: 'Психолог-терапевт, гештальт, арт-терапия, экзистенциальная терапия.', keywords: 'анна воронина специалист психолог образование отзывы' },
    { title: 'Статьи', url: 'articles.html', excerpt: 'Авторские материалы, исследования и профессиональные размышления.', keywords: 'статьи публикации библиотека знания' },
    { title: 'Психосоматика стресса', url: 'psychosomatics-stress.html', excerpt: 'Как тело говорит то, что молчит разум. Статья Натальи Строк.', keywords: 'стресс психосоматика тело тревога статья наталья строк' },
    { title: 'Глоссарий', url: 'glossary.html', excerpt: 'Термины психологии и психоанализа с подробными описаниями.', keywords: 'глоссарий термины понятия психология психоанализ' },
    { title: 'Подборки литературы', url: 'literature.html', excerpt: 'Книги и материалы для профессионального развития.', keywords: 'книги литература подборки чтение' },
    { title: 'Подкасты', url: 'podcasts.html', excerpt: 'Аудиоматериалы и выпуски о психологии, философии и психоанализе.', keywords: 'подкасты аудио слушать' },
    { title: 'Банк тестов', url: 'tests.html', excerpt: 'Психологические тесты и опросники.', keywords: 'тесты шкала бека тревога опросник' },
    { title: 'Шкала тревоги Бека', url: 'anxiety-test.html', excerpt: 'Методика Аарона Т. Бека для оценки симптомов тревоги.', keywords: 'beck бека тревога тест шкала' },
    { title: 'Личный кабинет', url: 'account.html', excerpt: 'Публикации, профиль и комментарии пользователя.', keywords: 'личный кабинет профиль комментарии публикации' },
    { title: 'Контакты', url: 'contacts.html', excerpt: 'Почта по общим вопросам, сотрудничество, социальные сети и форма связи.', keywords: 'контакты почта сотрудничество форма связь telegram вконтакте' }
  ];

  const markup = `
    <form class="site-search" role="search" data-site-search-form>
      <input type="search" id="siteSearchInput" placeholder="Поиск.." autocomplete="off" aria-label="Поиск по сайту">
      <button type="submit" aria-label="Найти">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.8 5.2a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2Zm0-1.7a7.3 7.3 0 1 0 4.44 13.1l3.83 3.83 1.2-1.2-3.83-3.83A7.3 7.3 0 0 0 10.8 3.5Z"/></svg>
      </button>
      <div class="site-search-dropdown" id="siteSearchResults" aria-live="polite"></div>
    </form>`;

  const accountButton = headerActions.querySelector('.account-button');
  if (accountButton) accountButton.insertAdjacentHTML('beforebegin', markup);
  else headerActions.insertAdjacentHTML('afterbegin', markup);

  const search = headerActions.querySelector('.site-search');
  const input = search.querySelector('#siteSearchInput');
  const results = search.querySelector('#siteSearchResults');
  const normalize = (value) => value.toLowerCase().trim();

  function getMatches(query) {
    const normalized = normalize(query);
    if (!normalized) return searchIndex.slice(0, 5);
    return searchIndex
      .map((item) => {
        const haystack = normalize(`${item.title} ${item.excerpt} ${item.keywords}`);
        const title = normalize(item.title);
        let score = 0;
        if (title.includes(normalized)) score += 4;
        if (haystack.includes(normalized)) score += 2;
        normalized.split(/\s+/).forEach((word) => {
          if (word && haystack.includes(word)) score += 1;
        });
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }

  function renderResults(query = '') {
    const matches = getMatches(query);
    search.classList.add('is-open');
    if (matches.length === 0) {
      results.innerHTML = '<p class="site-search-empty">Ничего не найдено</p>';
      return;
    }
    results.innerHTML = matches.map((item) => `
      <a class="site-search-result" href="${item.url}">
        <strong>${item.title}</strong>
        <span>${item.excerpt}</span>
      </a>
    `).join('');
  }

  function closeSearch() {
    search.classList.remove('is-open');
  }

  input.addEventListener('focus', () => renderResults(input.value));
  input.addEventListener('input', () => renderResults(input.value));

  search.addEventListener('submit', (event) => {
    event.preventDefault();
    const first = getMatches(input.value)[0];
    if (first) window.location.href = first.url;
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-search')) closeSearch();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSearch();
  });
})();
