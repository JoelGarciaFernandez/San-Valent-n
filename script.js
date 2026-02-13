const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionScreen = document.getElementById('question-screen');
const successScreen = document.getElementById('success-screen');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

// Ajustar canvas al tamaño de pantalla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const emojis = ["❤️", "🌹", "✨", "🥰", "💖", "🌸"];

// --- LÓGICA DEL BOTÓN FUGITIVO ---

function moveButton() {
    // 1. Obtener dimensiones de la pantalla
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 2. Obtener dimensiones del botón
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    // 3. Calcular nueva posición aleatoria
    // Restamos el tamaño del botón para que no se salga de la pantalla
    const randomX = Math.random() * (screenWidth - btnWidth);
    const randomY = Math.random() * (screenHeight - btnHeight);

    // 4. Aplicar la nueva posición
    noBtn.style.position = 'fixed'; // Importante para que flote libremente
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

// CASO 1: PC (Cuando pasa el ratón por encima)
noBtn.addEventListener('mouseover', () => {
    moveButton();
});

// CASO 2: MÓVIL (Cuando toca la pantalla)
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // ESTO ES CLAVE: Evita que el botón se pueda pulsar
    moveButton();
});

// CASO 3: SEGURIDAD (Por si logra hacer click muy rápido)
noBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Bloqueamos el click
    moveButton(); // Lo movemos de nuevo
});


// --- LÓGICA DEL BOTÓN SÍ ---

yesBtn.addEventListener('click', () => {
    questionScreen.classList.add('hidden'); // Ocultar pregunta
    successScreen.classList.remove('hidden'); // Mostrar respuesta
    
    // Ocultar el botón No definitivamente
    noBtn.style.display = 'none';

    // Lanzar confeti
    createExplosion();
    loop(); 
});


// --- SISTEMA DE PARTÍCULAS (CONFETI) ---
// (Esto es igual que antes, solo para dibujar los corazones)

function createExplosion() {
    for (let i = 0; i < 300; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            size: Math.random() * 30 + 10,
            speedX: (Math.random() - 0.5) * 20,
            speedY: (Math.random() - 0.5) * 20,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.2,
            opacity: 1
        });
    }
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.005;

        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px serif`;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();

        if (p.opacity <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }

    if (particles.length > 0) {
        requestAnimationFrame(loop);
    }
}

// Ajustar el canvas si gira el móvil
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});