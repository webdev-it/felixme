document.addEventListener('DOMContentLoaded', () => {
  // populate year
  document.getElementById('year').textContent = new Date().getFullYear();

  // fetch team from API
  fetch('/api/team')
    .then(r => r.json())
    .then(data => {
      const list = document.getElementById('team-list');
      data.team.forEach(m => {
        const el = document.createElement('div');
        el.className = 'member';
        el.innerHTML = `<strong>${m.name}</strong><div class="muted">${m.role}</div><div class="muted">${m.email}</div>`;
        list.appendChild(el);
      });
    })
    .catch(() => {
      const list = document.getElementById('team-list');
      list.innerHTML = '<p class="muted">Не удалось загрузить команду.</p>';
    });


  // Interactive accordion
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const content = btn.nextElementSibling;
      if (!expanded) content.classList.add('open');
      else content.classList.remove('open');
    });
  });

  // Render apps placeholders (empty for now)
  const appsGrid = document.getElementById('apps-grid');
  if (appsGrid) {
    for (let i = 0; i < 4; i++) {
      const c = document.createElement('div');
      c.className = 'app-card';
      c.innerHTML = `<div><strong>Приложение ${i+1}</strong><div class="muted">Заглушка — скоро тут будет продукт</div></div>`;
      appsGrid.appendChild(c);
    }
  }

  // Smooth nav scrolling and active link
  document.querySelectorAll('.main-nav a').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // simple on-scroll active link highlight
  const sections = Array.from(document.querySelectorAll('main section'));
  window.addEventListener('scroll', () => {
    const mid = window.scrollY + window.innerHeight / 2;
    let current = sections[0];
    for (const s of sections) if (s.offsetTop <= mid) current = s;
    document.querySelectorAll('.main-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
  });
});
