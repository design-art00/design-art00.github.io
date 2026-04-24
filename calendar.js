(() => {
  const root = document.querySelector('.calendar-page');
  if (!root) return;

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  const weekdayShort = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  const categories = ['Лекция', 'Супервизия', 'Вебинар', 'Воркшоп', 'Конференция'];
  const events = [
    {
      id: 'supervision-cases',
      title: 'Разбор сложных случаев в практике',
      category: 'Супервизия',
      date: new Date(2026, 3, 25, 18, 30),
      endTime: '20:30',
      format: 'Онлайн',
      speaker: 'Анна Воронина',
      speakerRole: 'психолог, арт-терапевт',
      description: 'Групповая супервизия для специалистов, которые хотят обсудить динамику контакта, границы и терапевтические гипотезы.',
      location: 'Zoom, закрытая группа',
      seatsLeft: 6
    },
    {
      id: 'anxiety-body',
      title: 'Тревога и тело: как работать с симптомом',
      category: 'Лекция',
      date: new Date(2026, 3, 28, 19, 0),
      endTime: '20:30',
      format: 'Онлайн',
      speaker: 'Дмитрий Соколов',
      speakerRole: 'психотерапевт',
      description: 'Встреча о том, как телесные реакции становятся языком внутреннего напряжения и как мягко возвращать клиенту опору.',
      location: 'Онлайн-трансляция',
      seatsLeft: 12
    },
    {
      id: 'burnout-workshop',
      title: 'Профилактика выгорания у помогающих специалистов',
      category: 'Воркшоп',
      date: new Date(2026, 4, 5, 17, 0),
      endTime: '20:00',
      format: 'Очно',
      speaker: 'Елена Майер',
      speakerRole: 'клинический психолог',
      description: 'Практический воркшоп о ритме работы, восстановлении и профессиональных границах без ухода в жесткость.',
      location: 'Санкт-Петербург, пространство Le Collectif',
      seatsLeft: 8
    },
    {
      id: 'ethics-dialogue',
      title: 'Этические решения в терапевтическом процессе',
      category: 'Вебинар',
      date: new Date(2026, 4, 12, 18, 0),
      endTime: '21:00',
      format: 'Гибрид',
      speaker: 'Марина Петрова',
      speakerRole: 'психоаналитик',
      description: 'Вебинар о конфиденциальности, двойных отношениях, оплате и сложных моментах профессионального выбора.',
      location: 'Москва + онлайн',
      seatsLeft: 9
    },
    {
      id: 'symbolic-order',
      title: 'Символический порядок и речь клиента',
      category: 'Лекция',
      date: new Date(2026, 4, 16, 16, 0),
      endTime: '17:30',
      format: 'Онлайн',
      speaker: 'Сергей Волков',
      speakerRole: 'психоаналитик',
      description: 'Лекция о том, как повторяющиеся формулировки и паузы помогают специалисту слышать структуру переживания.',
      location: 'Онлайн-трансляция'
    },
    {
      id: 'first-session',
      title: 'Первая встреча: как формируется рабочий альянс',
      category: 'Вебинар',
      date: new Date(2026, 4, 16, 19, 0),
      endTime: '21:00',
      format: 'Онлайн',
      speaker: 'Анна Воронина',
      speakerRole: 'психолог, арт-терапевт',
      description: 'Обсудим начало работы: запрос, контракт, тревогу первого контакта и способы не торопить процесс.',
      location: 'Zoom, запись будет доступна участникам',
      seatsLeft: 5
    },
    {
      id: 'dialogical-hermeneutic-gestalt',
      title: 'Диалого-герменевтический подход в гештальт-терапии',
      category: 'Вебинар',
      date: new Date(2026, 4, 18, 18, 30),
      endTime: '20:30',
      format: 'Онлайн',
      speaker: 'Александров Сергей',
      speakerRole: 'гештальт-терапевт',
      description: 'Вебинар о диалоге, интерпретации опыта и способах оставаться в живом контакте с клиентом без давления готовых объяснений.',
      price: '1500 р.',
      location: 'Онлайн-трансляция, запись доступна участникам',
      seatsLeft: 7
    },
    {
      id: 'identity-group',
      title: 'Идентичность специалиста и профессиональная опора',
      category: 'Воркшоп',
      date: new Date(2026, 4, 21, 18, 30),
      endTime: '20:30',
      format: 'Онлайн',
      speaker: 'Ольга Иванова',
      speakerRole: 'психолог',
      description: 'Практика для начинающих и продолжающих специалистов: как находить свой голос и не растворяться в ожиданиях среды.',
      location: 'Онлайн-группа',
      seatsLeft: 10
    },
    {
      id: 'transfer-supervision',
      title: 'Перенос и контрперенос в длительной терапии',
      category: 'Супервизия',
      date: new Date(2026, 4, 27, 18, 0),
      endTime: '20:00',
      format: 'Онлайн',
      speaker: 'Наталья Колесникова',
      speakerRole: 'психотерапевт',
      description: 'Супервизионная встреча о сильных чувствах в кабинете и способах использовать их как материал для понимания.',
      location: 'Zoom, малая группа',
      seatsLeft: 4
    },
    {
      id: 'dreams-seminar',
      title: 'Сновидения как материал терапевтической работы',
      category: 'Вебинар',
      date: new Date(2026, 5, 4, 19, 0),
      endTime: '21:00',
      format: 'Онлайн',
      speaker: 'Дмитрий Соколов',
      speakerRole: 'психотерапевт',
      description: 'Поговорим о том, как работать со снами бережно: без готовых расшифровок и с вниманием к субъективному смыслу.',
      location: 'Онлайн-трансляция'
    }
  ];

  const state = {
    cursor: new Date(events[0].date.getFullYear(), events[0].date.getMonth(), 1),
    activeCategories: new Set(),
    selectedDate: null
  };

  const gridNode = document.getElementById('calendarGrid');
  const categoriesNode = document.getElementById('calendarCategories');
  const monthNameNode = document.getElementById('calendarMonthName');
  const yearNode = document.getElementById('calendarYear');
  const eventsListNode = document.getElementById('calendarEventsList');
  const eventsCountNode = document.getElementById('calendarEventsCount');
  const selectedDateNode = document.getElementById('calendarSelectedDate');
  const resetDateButton = document.getElementById('calendarResetDate');
  const prevButton = document.getElementById('calendarPrev');
  const nextButton = document.getElementById('calendarNext');
  let activeRegistrationEvent = null;

  const pad = (value) => String(value).padStart(2, '0');
  const getDayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const isSameDay = (a, b) => a && b && getDayKey(a) === getDayKey(b);
  const formatTime = (date) => date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  function buildMonthGrid(year, month) {
    const first = new Date(year, month, 1);
    const startWeekday = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = startWeekday - 1; i >= 0; i -= 1) {
      cells.push({ date: new Date(year, month, -i), inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ date: new Date(year, month, day), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date;
      const next = new Date(last);
      next.setDate(last.getDate() + 1);
      cells.push({ date: next, inMonth: false });
    }
    return cells;
  }

  function getFilteredEvents() {
    return events.filter((event) => {
      if (state.activeCategories.size > 0 && !state.activeCategories.has(event.category)) return false;
      return true;
    });
  }

  function getVisibleEvents(filtered) {
    if (state.selectedDate) {
      return filtered.filter((event) => isSameDay(event.date, state.selectedDate));
    }
    return filtered.filter((event) => (
      event.date.getFullYear() === state.cursor.getFullYear() &&
      event.date.getMonth() === state.cursor.getMonth()
    ));
  }


  function ensureRegistrationModal() {
    let modal = document.getElementById('calendarRegistrationModal');
    if (modal) return modal;

    document.body.insertAdjacentHTML('beforeend', `
      <div class="calendar-modal" id="calendarRegistrationModal" aria-hidden="true">
        <div class="calendar-modal__backdrop" data-calendar-modal-close></div>
        <section class="calendar-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="calendarModalTitle">
          <button class="calendar-modal__close" type="button" data-calendar-modal-close aria-label="Закрыть">×</button>
          <p class="calendar-modal__label">Регистрация</p>
          <h2 id="calendarModalTitle">Записаться на мероприятие</h2>
          <p class="calendar-modal__event" data-calendar-modal-event></p>
          <form class="calendar-modal__form" data-calendar-registration-form>
            <label><input name="name" type="text" autocomplete="name" placeholder="Ваше имя" required></label>
            <label><input name="contact" type="text" autocomplete="email" placeholder="Телефон или почта" required></label>
            <label><textarea name="comment" rows="4" placeholder="Комментарий, если нужно"></textarea></label>
            <label class="calendar-modal__checkbox"><input name="policy" type="checkbox" required><span>Я даю согласие на обработку персональных данных</span></label>
            <button class="button primary" type="submit">Отправить заявку</button>
            <p class="calendar-modal__status" data-calendar-modal-status aria-live="polite"></p>
          </form>
        </section>
      </div>
    `);

    modal = document.getElementById('calendarRegistrationModal');
    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-calendar-modal-close]')) closeRegistrationModal();
    });
    modal.querySelector('[data-calendar-registration-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const formNode = event.currentTarget;
      const status = modal.querySelector('[data-calendar-modal-status]');
      if (!formNode.checkValidity()) {
        status.textContent = 'Пожалуйста, заполните обязательные поля.';
        formNode.reportValidity();
        return;
      }
      formNode.reset();
      status.textContent = 'Спасибо! Мы получили заявку и свяжемся с вами для подтверждения записи.';
    });

    return modal;
  }

  function openRegistrationModal(eventItem) {
    activeRegistrationEvent = eventItem;
    const modal = ensureRegistrationModal();
    const eventText = modal.querySelector('[data-calendar-modal-event]');
    const status = modal.querySelector('[data-calendar-modal-status]');
    const formNode = modal.querySelector('[data-calendar-registration-form]');
    eventText.textContent = `${eventItem.title} · ${eventItem.speaker} · ${eventItem.date.getDate()} ${monthNames[eventItem.date.getMonth()].toLowerCase()} ${eventItem.date.getFullYear()}, ${formatTime(eventItem.date)}`;
    status.textContent = '';
    formNode.reset();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('calendar-modal-open');
    modal.querySelector('input[name="name"]').focus();
  }

  function closeRegistrationModal() {
    const modal = document.getElementById('calendarRegistrationModal');
    if (!modal) return;
    activeRegistrationEvent = null;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('calendar-modal-open');
  }

  function renderFilters() {
    categoriesNode.innerHTML = categories.map((category) => `
      <button type="button" class="calendar-filter-button" data-category="${category}">${category}</button>
    `).join('');
  }

  function renderCalendar(filtered) {
    const byDay = new Map();
    filtered.forEach((event) => {
      const key = getDayKey(event.date);
      const list = byDay.get(key) || [];
      list.push(event);
      byDay.set(key, list);
    });

    monthNameNode.textContent = monthNames[state.cursor.getMonth()];
    yearNode.textContent = state.cursor.getFullYear();

    const cells = buildMonthGrid(state.cursor.getFullYear(), state.cursor.getMonth());
    gridNode.innerHTML = weekdayShort.map((day) => `<div class="calendar-weekday">${day}</div>`).join('') + cells.map((cell) => {
      const key = getDayKey(cell.date);
      const dayEvents = byDay.get(key) || [];
      const selected = state.selectedDate && isSameDay(state.selectedDate, cell.date);
      const snippets = dayEvents.slice(0, 2).map((event) => `<span class="calendar-day-event">· ${event.title}</span>`).join('');
      const more = dayEvents.length > 2 ? `<span class="calendar-day-more">+${dayEvents.length - 2}</span>` : '';
      return `
        <button type="button" class="calendar-day ${cell.inMonth ? '' : 'is-muted'} ${selected ? 'is-selected' : ''}" data-date="${key}" ${cell.inMonth ? '' : 'tabindex="-1"'}>
          <span class="calendar-day-number">${pad(cell.date.getDate())}</span>
          ${dayEvents.length && cell.inMonth ? `<span class="calendar-day-events">${snippets}${more}</span>` : ''}
        </button>
      `;
    }).join('');
  }

  function renderEvents(visibleEvents) {
    const sorted = [...visibleEvents].sort((a, b) => a.date - b.date);
    if (eventsCountNode) eventsCountNode.textContent = getFilteredEvents().length;

    resetDateButton.hidden = !state.selectedDate;
    selectedDateNode.hidden = !state.selectedDate;
    if (state.selectedDate) {
      selectedDateNode.textContent = `${state.selectedDate.getDate()} ${monthNames[state.selectedDate.getMonth()].toLowerCase()} ${state.selectedDate.getFullYear()}`;
    }

    if (sorted.length === 0) {
      eventsListNode.innerHTML = '<div class="calendar-empty">В выбранный период событий нет.</div>';
      return;
    }

    eventsListNode.innerHTML = sorted.map((event) => `
      <article class="calendar-event-card">
        <div class="calendar-event-date">
          <strong>${pad(event.date.getDate())}</strong>
          <span>${monthNames[event.date.getMonth()].slice(0, 3)}</span>
        </div>
        <div>
          <div class="calendar-event-meta">
            <span>${event.category}</span><i></i><span>${formatTime(event.date)}${event.endTime ? `–${event.endTime}` : ''}</span><i></i><span>${event.format}</span>
          </div>
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          ${event.price ? `<div class="calendar-event-price">Стоимость: ${event.price}</div>` : ''}
          <div class="calendar-event-speaker">${event.speaker} <em>— ${event.speakerRole}</em></div>
          <div class="calendar-event-actions">
            <button class="event-action primary" type="button" data-register-event="${event.id}">Записаться</button>
            ${event.seatsLeft !== undefined && event.seatsLeft <= 10 ? `<span class="calendar-event-seats">осталось ${event.seatsLeft} мест</span>` : ''}
          </div>
          <div class="calendar-event-location">${event.location}</div>
        </div>
      </article>
    `).join('');
  }

  function render() {
    const filtered = getFilteredEvents();
    const visible = getVisibleEvents(filtered);
    renderCalendar(filtered);
    renderEvents(visible);
    categoriesNode.querySelectorAll('[data-category]').forEach((button) => {
      button.classList.toggle('is-active', state.activeCategories.has(button.dataset.category));
    });
  }

  renderFilters();

  categoriesNode.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    const category = button.dataset.category;
    if (state.activeCategories.has(category)) state.activeCategories.delete(category);
    else state.activeCategories.add(category);
    state.selectedDate = null;
    render();
  });

  gridNode.addEventListener('click', (event) => {
    const button = event.target.closest('.calendar-day');
    if (!button || button.classList.contains('is-muted')) return;
    const [year, month, day] = button.dataset.date.split('-').map(Number);
    const clickedDate = new Date(year, month, day);
    state.selectedDate = isSameDay(state.selectedDate, clickedDate) ? null : clickedDate;
    render();
  });


  eventsListNode.addEventListener('click', (event) => {
    const button = event.target.closest('[data-register-event]');
    if (!button) return;
    const eventItem = events.find((item) => item.id === button.dataset.registerEvent);
    if (eventItem) openRegistrationModal(eventItem);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeRegistrationModal();
  });

  prevButton.addEventListener('click', () => {
    state.cursor = new Date(state.cursor.getFullYear(), state.cursor.getMonth() - 1, 1);
    state.selectedDate = null;
    render();
  });

  nextButton.addEventListener('click', () => {
    state.cursor = new Date(state.cursor.getFullYear(), state.cursor.getMonth() + 1, 1);
    state.selectedDate = null;
    render();
  });

  resetDateButton.addEventListener('click', () => {
    state.selectedDate = null;
    render();
  });

  render();
})();
