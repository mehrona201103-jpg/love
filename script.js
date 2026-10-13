let currentStep = 1;
let timerInterval = null;
let timeLeft = 10;
let clicksLeft = 10;
const totalClicks = 10;

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// 1. Открытие конверта
function openEnvelope() {
  const envelope = document.querySelector('.envelope');
  envelope.style.transform = 'translateY(-10px) scale(1.05)';
  
  setTimeout(() => {
    showScreen('letter-screen');
    startTimer();
  }, 500);
}

// 2. Таймер на письмо (10 секунд)
function startTimer() {
  timeLeft = 10;
  const timerBar = document.getElementById('timer-bar');
  const timerSeconds = document.getElementById('timer-seconds');
  
  timerBar.style.width = '100%';
  timerSeconds.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerSeconds.textContent = timeLeft;
    timerBar.style.width = (timeLeft * 10) + '%';

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showScreen('ice-screen');
    }
  }, 1000);
}

// 3. Логика таяния ледяного сердца
function meltIce(event) {
  if (clicksLeft <= 0) return;

  clicksLeft--;
  
  const iceShell = document.getElementById('ice-shell');
  const heartContainer = document.getElementById('heart-container');
  const progressBar = document.getElementById('progress-bar');
  const clicksLeftText = document.getElementById('clicks-left');

  // Анимация тряски
  heartContainer.classList.remove('shake');
  void heartContainer.offsetWidth; // Триггер reflow для перезапуска анимации
  heartContainer.classList.add('shake');

  // Уменьшаем прозрачность льда
  const opacity = clicksLeft / totalClicks;
  iceShell.style.opacity = opacity;
  iceShell.style.transform = `scale(${0.8 + (opacity * 0.2)})`;

  // Обновляем прогресс-бар
  const progressPercent = ((totalClicks - clicksLeft) / totalClicks) * 100;
  progressBar.style.setProperty('--progress', `${progressPercent}%`);
  clicksLeftText.textContent = `Осталось кликов: ${clicksLeft}`;

  // Создаем ледяные осколки при клике
  createIceParticles(event);

  // Когда лёд полностью растаял (0 кликов)
  if (clicksLeft === 0) {
    setTimeout(() => {
      explodeHeart();
    }, 200);
  }
}

// Эффект вылетающих осколков льда
function createIceParticles(e) {
  const container = document.getElementById('heart-container');
  const rect = container.getBoundingClientRect();
  
  const particles = ['🧊', '❄️', '💧', '✨'];
  
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement('div');
    particle.className = 'ice-particle';
    particle.textContent = particles[Math.floor(Math.random() * particles.length)];
    
    // Вычисляем случайное направление полета
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 80;
    const dx = Math.cos(angle) * distance + 'px';
    const dy = Math.sin(angle) * distance + 'px';
    
    particle.style.setProperty('--dx', dx);
    particle.style.setProperty('--dy', dy);
    
    // Координаты относительно центра нажатия
    particle.style.left = (e.clientX - rect.left) + 'px';
    particle.style.top = (e.clientY - rect.top) + 'px';

    container.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 600);
  }
}

// 4. Взрыв/раскрытие сердца и конфетти
function explodeHeart() {
  // Праздничное конфетти
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  }

  showScreen('final-screen');
}

// Перезапуск
function restart() {
  clicksLeft = 10;
  document.getElementById('ice-shell').style.opacity = '1';
  document.getElementById('progress-bar').style.setProperty('--progress', '0%');
  document.getElementById('clicks-left').textContent = 'Осталось кликов: 10';
  
  showScreen('envelope-screen');
}
