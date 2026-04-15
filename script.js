// ========== TYPING ANIMATION ==========
const typedElement = document.getElementById('typed-text');
const phrases = ['Développeur Full-Stack', 'Créatif digital', 'UI/UX enthusiast', 'Freelance'];
let i = 0;
let j = 0;
let currentPhrase = [];
let isDeleting = false;
let isEnd = false;

function type() {
  isEnd = false;
  if (i < phrases.length) {
    if (!isDeleting && j <= phrases[i].length) {
      currentPhrase = phrases[i].substring(0, j);
      typedElement.textContent = currentPhrase;
      j++;
    }

    if (isDeleting && j <= phrases[i].length) {
      currentPhrase = phrases[i].substring(0, j - 1);
      typedElement.textContent = currentPhrase;
      j--;
    }

    if (j === phrases[i].length + 1) {
      isDeleting = true;
    }

    if (isDeleting && j === 0) {
      currentPhrase = '';
      typedElement.textContent = currentPhrase;
      isDeleting = false;
      i++;
      if (i === phrases.length) i = 0;
    }
  }
  const spedUp = isDeleting ? 50 : 120;
  setTimeout(type, isDeleting ? 80 : spedUp);
}

type();

// ========== DARK MODE TOGGLE ==========
const darkModeToggle = document.getElementById('darkmode-toggle');
const body = document.body;

// Check local storage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  darkModeToggle.checked = true;
}

darkModeToggle.addEventListener('change', () => {
  body.classList.toggle('dark');
  if (body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// ========== MOBILE MENU ==========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// ========== SCROLL REVEAL ANIMATION ==========
const revealElements = document.querySelectorAll('.reveal');

function checkReveal() {
  const windowHeight = window.innerHeight;
  const revealPoint = 120;

  revealElements.forEach(element => {
    const revealTop = element.getBoundingClientRect().top;
    if (revealTop < windowHeight - revealPoint) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

// ========== ANIMATED SKILL BARS (déclenchées par scroll) ==========
const skillSection = document.querySelector('.skills');
const progressBars = document.querySelectorAll('.progress-fill');

function animateSkills() {
  progressBars.forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = width + '%';
  });
}

// On appelle animateSkills quand la section skills devient visible
function checkSkills() {
  if (skillSection) {
    const sectionPos = skillSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.2;
    if (sectionPos < screenPos) {
      animateSkills();
      window.removeEventListener('scroll', checkSkills);
    }
  }
}

window.addEventListener('scroll', checkSkills);
window.addEventListener('load', checkSkills);

// ========== FORMULAIRE DE CONTACT (fonctionnel avec JS) ==========
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (name === '' || email === '' || message === '') {
    formFeedback.textContent = '⚠️ Tous les champs sont obligatoires.';
    formFeedback.style.color = '#e74c3c';
    return;
  }

  if (!validateEmail(email)) {
    formFeedback.textContent = '⚠️ Adresse email invalide.';
    formFeedback.style.color = '#e74c3c';
    return;
  }

  // Simulation d'envoi réussi
  formFeedback.textContent = '✅ Message envoyé ! Je vous répondrai rapidement.';
  formFeedback.style.color = '#27ae60';
  contactForm.reset();
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ========== ACTIVE NAVIGATION HIGHLIGHT ==========
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active-nav');
    }
  });
});

// Style pour le lien actif
const style = document.createElement('style');
style.textContent = `
  .nav-link.active-nav {
    color: var(--primary);
    font-weight: 700;
    position: relative;
  }
  .nav-link.active-nav::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    border-radius: 2px;
  }
`;
document.head.appendChild(style);

// ========== RESET SKILL BARS AU CHARGEMENT ==========
// On remet les barres à 0% au chargement pour qu'elles s'animent au scroll
window.addEventListener('load', () => {
  progressBars.forEach(bar => {
    bar.style.width = '0%';
  });
  // On vérifie si la section est déjà visible
  setTimeout(checkSkills, 100);
});