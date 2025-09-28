// Валидация формы и улучшение UX
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация фоновой музыки
    initBackgroundMusic();
    
    const form = document.getElementById('weddingForm');
    const loading = document.querySelector('.loading');
    
    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });

    // Функция валидации поля
    function validateField(event) {
        const field = event.target;
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (!field.value.trim() && field.hasAttribute('required')) {
            showError(field, errorElement, 'Это поле обязательно для заполнения');
            return false;
        }
        
        hideError(field, errorElement);
        return true;
    }

    // Показать ошибку
    function showError(field, errorElement, message) {
        field.style.borderColor = 'var(--error-color)';
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Скрыть ошибку
    function hideError(field, errorElement) {
        field.style.borderColor = '#e0e0e0';
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    // Очистить ошибку при вводе
    function clearError(event) {
        const field = event.target;
        const errorElement = field.parentNode.querySelector('.error-message');
        hideError(field, errorElement);
    }

    // Обработка отправки формы через новый API
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Валидация всей формы
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });

        // Проверка радио-кнопок
        const attendanceRadios = form.querySelectorAll('input[name="attendance"]');
        const attendanceSelected = Array.from(attendanceRadios).some(radio => radio.checked);
        if (!attendanceSelected) {
            alert('Пожалуйста, выберите, планируете ли вы присутствовать на свадьбе');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Вызываем новую функцию API отправки
        submitForm(event);
    });

    // Анимация при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.form-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Подсчет символов для textarea
    const textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(textarea => {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.textAlign = 'right';
        counter.style.fontSize = '0.9rem';
        counter.style.color = 'var(--accent-color)';
        counter.style.marginTop = '5px';
        
        const maxLength = textarea.getAttribute('maxlength');
        counter.textContent = `0/${maxLength}`;
        
        textarea.parentNode.appendChild(counter);
        
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength * 0.9) {
                counter.style.color = 'var(--error-color)';
            } else {
                counter.style.color = 'var(--accent-color)';
            }
        });
    });
});

// Система управления фоновой музыкой
let musicInitialized = false;
let backgroundMusic = null;
let musicToggleBtn = null;

function initBackgroundMusic() {
    backgroundMusic = document.getElementById('backgroundMusic');
    musicToggleBtn = document.getElementById('musicToggle');
    
    if (!backgroundMusic || !musicToggleBtn) return;
    
    // Установка начальной громкости
    backgroundMusic.volume = 0.3;
    
    // Попытка автовоспроизведения при загрузке страницы
    startMusicWithUserInteraction();
    
    // Обработчик ошибок аудио
    backgroundMusic.addEventListener('error', function() {
        console.log('Ошибка загрузки фоновой музыки');
        musicToggleBtn.style.display = 'none';
    });
    
    // События воспроизведения
    backgroundMusic.addEventListener('play', function() {
        musicToggleBtn.classList.add('playing');
        musicToggleBtn.classList.remove('muted');
        musicToggleBtn.innerHTML = '🎵';
        musicToggleBtn.title = 'Выключить музыку';
    });
    
    backgroundMusic.addEventListener('pause', function() {
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.classList.add('muted');
        musicToggleBtn.innerHTML = '🔇';
        musicToggleBtn.title = 'Включить музыку';
    });
}

function startMusicWithUserInteraction() {
    // Функция для попытки автовоспроизведения
    function tryAutoplay() {
        if (backgroundMusic && !musicInitialized) {
            backgroundMusic.play().then(() => {
                musicInitialized = true;
                console.log('Фоновая музыка запущена');
            }).catch(() => {
                // Автовоспроизведение заблокировано, ждем взаимодействия пользователя
                document.addEventListener('click', enableMusicOnFirstClick, { once: true });
                document.addEventListener('keydown', enableMusicOnFirstClick, { once: true });
                console.log('Автовоспроизведение заблокировано, ожидание взаимодействия пользователя');
            });
        }
    }
    
    // Запуск музыки при первом взаимодействии пользователя
    function enableMusicOnFirstClick() {
        if (backgroundMusic && !musicInitialized) {
            backgroundMusic.play().then(() => {
                musicInitialized = true;
                console.log('Фоновая музыка запущена после взаимодействия пользователя');
            }).catch(error => {
                console.log('Не удалось запустить музыку:', error);
            });
        }
    }
    
    // Попытка автовоспроизведения при загрузке
    setTimeout(tryAutoplay, 1000);
}

function toggleMusic() {
    if (!backgroundMusic) return;
    
    if (backgroundMusic.paused) {
        backgroundMusic.play().then(() => {
            console.log('Музыка включена пользователем');
        }).catch(error => {
            console.log('Ошибка воспроизведения:', error);
        });
    } else {
        backgroundMusic.pause();
        console.log('Музыка выключена пользователем');
    }
}

// Управление музыкой с клавиатуры
document.addEventListener('keydown', function(event) {
    // Пробел или M для переключения музыки
    if ((event.code === 'Space' || event.code === 'KeyM') && !event.target.matches('input, textarea, select')) {
        event.preventDefault();
        toggleMusic();
    }
});

// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://wedding-invitation-backend-lj0d.onrender.com'; // Ваш реальный Render backend

// Функция отправки формы через API
async function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Создаем объект с данными
    const data = {
        name: formData.get('name'),
        attendance: formData.get('attendance'),
        wishes: formData.get('wishes') || ''
    };
    
    // Находим кнопку отправки
    const submitBtn = form.querySelector('button[type="submit"]') || 
                     form.querySelector('.submit-btn') ||
                     document.querySelector('#submitBtn');
    
    if (submitBtn) {
        const originalText = submitBtn.textContent;
        
        try {
            // Показываем состояние загрузки
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Отправка...';
            submitBtn.style.opacity = '0.7';
            
            // Отправляем данные на API
            const response = await fetch(`${API_BASE_URL}/api/submit-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Успешная отправка
                console.log('✅ Форма отправлена успешно:', result);
                
                // Показываем успех
                submitBtn.textContent = '✅ Отправлено!';
                submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                
                // Перенаправляем через 1 секунду
                setTimeout(() => {
                    window.location.href = 'success.html';
                }, 1000);
                
            } else {
                // Ошибка валидации или сервера
                console.error('❌ Ошибка отправки:', result);
                throw new Error(result.message || 'Ошибка отправки формы');
            }
            
        } catch (error) {
            console.error('💥 Критическая ошибка:', error);
            
            // Показываем ошибку
            submitBtn.textContent = '❌ Ошибка отправки';
            submitBtn.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
            
            // Показываем уведомление пользователю
            alert(`Произошла ошибка при отправке формы:\n\n${error.message}\n\nПопробуйте еще раз или обратитесь к организаторам.`);
            
            // Восстанавливаем кнопку через 3 секунды
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.style.background = '';
            }, 3000);
        }
    } else {
        console.error('❌ Кнопка отправки не найдена');
    }
}