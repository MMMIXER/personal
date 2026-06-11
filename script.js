const progressBar = document.querySelector('.scroll-progress span');
const sections = [...document.querySelectorAll('main section[id], .hero')];
const navLinks = [...document.querySelectorAll('.nav-links a')];
const toast = document.querySelector('.toast');

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
};

const updateActiveNav = () => {
  const current = sections
    .filter((section) => section.id && section.getBoundingClientRect().top < window.innerHeight * 0.35)
    .at(-1);

  navLinks.forEach((link) => {
    link.classList.toggle('active', current ? link.getAttribute('href') === `#${current.id}` : false);
  });
};

window.addEventListener(
  'scroll',
  () => {
    updateProgress();
    updateActiveNav();
  },
  { passive: true },
);

updateProgress();
updateActiveNav();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

document.querySelectorAll('.section-reveal').forEach((section) => {
  revealObserver.observe(section);
});

document.querySelectorAll('.project-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const card = trigger.closest('.project-card');
    const isOpen = card.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });
});

let toastTimer;
const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
};

const fallbackCopy = (text) => {
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.append(input);
  input.select();
  document.execCommand('copy');
  input.remove();
};

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        fallbackCopy(value);
      }
      showToast('已复制到剪贴板');
    } catch {
      fallbackCopy(value);
      showToast('已复制到剪贴板');
    }
  });
});
