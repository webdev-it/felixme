document.addEventListener('DOMContentLoaded', () => {
  // populate year
  document.getElementById('year').textContent = new Date().getFullYear();

  // fetch team from API
  const teamListEl = document.getElementById('team-list');
  if (teamListEl) {
    fetch('/api/team').then(r => r.json()).then(data => {
      renderTeam(teamListEl, data.team || []);
    }).catch(() => {
      // fallback static team
      renderTeam(teamListEl, [
        { name: 'Alex Novak', role: 'Team Lead', email: 'alex@felixme.dev' },
        { name: 'Maya Petrova', role: 'Mobile Engineer', email: 'maya@felixme.dev' },
        { name: 'Ivan Sokolov', role: 'Backend', email: 'ivan@felixme.dev' },
        { name: 'Lina Gomez', role: 'Designer', email: 'lina@felixme.dev' }
      ]);
    });
  }

  function renderTeam(container, list) {
    container.innerHTML = '';
    list.forEach(m => {
      const el = document.createElement('div');
      el.className = 'member';
      el.innerHTML = `<strong>${m.name}</strong><div class="muted">${m.role}</div><div class="muted">${m.email || ''}</div>`;
      container.appendChild(el);
    });
  }


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

  // On multi-page site we don't hijack navigation, but provide accordion and apps interactions.
  // If nav contains in-page links (hash), enable smooth scroll for them only.
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });

  // on pages that have multiple sections, keep active highlighting
  const sections = Array.from(document.querySelectorAll('main section'));
  if (sections.length) {
    window.addEventListener('scroll', () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let current = sections[0];
      for (const s of sections) if (s.offsetTop <= mid) current = s;
      document.querySelectorAll('.main-nav a').forEach(a => {
        const ah = a.getAttribute('href') || '';
        a.classList.toggle('active', ah === '#' + current.id || ah.endsWith(current.id + '.html') );
      });
    });
  }
});
