document.addEventListener('DOMContentLoaded', () => {
  const links = Array.from(document.querySelectorAll('[data-account-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-account-panel]'));
  const profileForm = document.querySelector('[data-profile-form]');
  const profileEditButton = document.querySelector('[data-profile-edit]');

  if (profileForm && profileEditButton) {
    const profileFields = Array.from(profileForm.querySelectorAll('input, select, textarea'));

    profileEditButton.addEventListener('click', () => {
      profileForm.classList.add('is-editing');
      profileFields.forEach((field) => {
        field.disabled = false;
      });
      profileFields[0]?.focus();
    });
  }

  if (!links.length || !panels.length) return;

  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    return panels.some((panel) => panel.dataset.accountPanel === hash) ? hash : 'dashboard';
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
