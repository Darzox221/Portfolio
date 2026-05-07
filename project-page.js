(function () {
  const darkModeToggle = document.getElementById('darkmode-toggle');
  const body = document.body;

  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    if (darkModeToggle) darkModeToggle.checked = true;
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
      body.classList.toggle('dark');
      localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }
})();
