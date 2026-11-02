const menuButton = document.querySelector('.navbar__toggle');
const navigation = document.getElementById('site-navigation');

if (menuButton && navigation) {
  const mobileViewport = window.matchMedia('(max-width: 767px)');
  const menuLabel = document.documentElement.lang === 'en'
    ? { open: 'Open menu', close: 'Close menu' }
    : { open: 'Otwórz menu', close: 'Zamknij menu' };

  const setMenuOpen = (isOpen) => {
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? menuLabel.close : menuLabel.open);
    menuButton.classList.toggle('navbar__toggle--open', isOpen);
    navigation.classList.toggle('navbar__nav--open', isOpen);
  };

  menuButton.addEventListener('click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.navbar__container')) setMenuOpen(false);
  });

  mobileViewport.addEventListener('change', (event) => {
    if (!event.matches) setMenuOpen(false);
  });
}
