// Год в футере
document.getElementById('year').textContent = new Date().getFullYear();

// Тема: авто/свет/тёмная, с сохранением в localStorage
// --- THEME BUTTON UPGRADE (robust, cross-page) ---
(function(){
  const KEY = 'felix-theme';
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    if(btn) {
      btn.classList.remove('active');
      if(theme === 'dark') {
        btn.classList.add('active');
        if(btn.querySelector('.icon')) btn.querySelector('.icon').textContent = '🌙';
      } else {
        if(btn.querySelector('.icon')) btn.querySelector('.icon').textContent = '☀️';
      }
    }
  }
  // Инициализация
  let saved = localStorage.getItem(KEY);
  if(saved !== 'light' && saved !== 'dark') {
    saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setTheme(saved);
  if(btn) {
    btn.addEventListener('click', ()=>{
      const cur = root.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }
  // Автоматически обновлять тему при смене системной темы
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if(!localStorage.getItem(KEY)) setTheme(e.matches ? 'dark' : 'light');
  });
})();
// --- END THEME BUTTON UPGRADE ---

// Мобильное меню
(function(){
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('mobileNav');
  if(!btn || !panel) return;
  btn.addEventListener('click', ()=>{
    const hidden = panel.hasAttribute('hidden');
    if(hidden){ panel.removeAttribute('hidden'); panel.style.display = 'grid'; }
    else { panel.setAttribute('hidden',''); panel.style.display = 'none'; }
  });
})();
