// Download counter for Android button (robust, with fallback and user feedback)
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('android-download');
    const counterEl = document.getElementById('download-counter');
    const NAMESPACE = 'felixme';
    const KEY = 'felixbrowser-downloads';
    const GET_URL = `https://api.countapi.xyz/get/${NAMESPACE}/${KEY}`;
    const HIT_URL = `https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`;

    function updateCounter() {
        fetch(GET_URL)
            .then(response => response.json())
            .then(data => {
                if (typeof data.value === 'number') {
                    counterEl.textContent = `Скачиваний: ${data.value}`;
                } else {
                    counterEl.textContent = 'Скачиваний: ?';
                }
            })
            .catch(error => {
                console.error('Error fetching counter:', error);
                counterEl.textContent = 'Скачиваний: -';
            });
    }

    // Initial load
    updateCounter();

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            if (!localStorage.getItem('downloaded')) {
                fetch(HIT_URL)
                    .then(response => response.json())
                    .then(data => {
                        localStorage.setItem('downloaded', 'true');
                        updateCounter();
                    })
                    .catch(error => {
                        alert('Ошибка при обновлении счётчика скачиваний. Попробуйте позже.');
                        console.error('Error updating counter:', error);
                    });
            }
        });
    } else {
        if (counterEl) counterEl.textContent = 'Ошибка: кнопка не найдена';
    }
});

// --- THEME BUTTON UPGRADE (standalone for app page) ---
(function(){
  const KEY = 'felix-theme';
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    if(btn && btn.querySelector('.icon')) {
      btn.classList.remove('active');
      if(theme === 'dark') {
        btn.classList.add('active');
        btn.querySelector('.icon').textContent = '🌙';
      } else {
        btn.querySelector('.icon').textContent = '☀️';
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
})();
// --- END THEME BUTTON UPGRADE ---
