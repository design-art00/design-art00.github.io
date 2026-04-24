document.addEventListener('DOMContentLoaded', () => {
  const links = Array.from(document.querySelectorAll('[data-account-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-account-panel]'));

  if (!links.length || !panels.length) return;

  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    return panels.some((panel) => panel.dataset.accountPanel === hash) ? hash : 'publications';
  };

  const activateTab = (tab, shouldPush = true) => {
    links.forEach((link) => {
      const isActive = link.dataset.accountTab === tab;
      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.accountPanel === tab;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });

    if (shouldPush && window.location.hash !== `#${tab}`) {
      history.pushState(null, '', `#${tab}`);
    }
  };

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      activateTab(link.dataset.accountTab);
    });
  });

  window.addEventListener('hashchange', () => activateTab(getTabFromHash(), false));
  activateTab(getTabFromHash(), false);
});
