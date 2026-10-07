
const openCookieManagement = () => {
  const container = document.querySelector<HTMLElement>('.cookie-management')!;
  const firstLink = container.querySelector<HTMLButtonElement>('.ct-customization-button');
  firstLink?.focus();
  container.removeAttribute('inert');
};

export const setVisible = (value: boolean) => {
  const container = document.querySelector<HTMLElement>('.cookie-management')!;
  const firstLink = container.querySelector<HTMLButtonElement>('.ct-customization-button');

  if (value) {
    container.style.display = 'block';
    document.body.classList.add('cookie-management-visible');
    container.removeAttribute('inert');
    container.addEventListener('transitionend', openCookieManagement);

    return container.classList.add('visible');
  }

  container.classList.remove('visible');
  document.body.classList.remove('cookie-management-visible');
  firstLink?.blur();
  container.setAttribute('inert', '');
  /* istanbul ignore next */
  setTimeout(() => (container.style.display = 'none'), 250);
  container.removeEventListener('transitionend', openCookieManagement);
};
