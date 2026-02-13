const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionScreen = document.getElementById('question-screen');
const successScreen = document.getElementById('success-screen');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const emojis = ["❤️", "🌹", "✨", "🥰", "💖", "🌸"];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Inicializar

// --- LÓGICA DEL BOTÓN FUGITIVO (OPTIMIZADA) ---
function moveButton() {
    // 1. Obtener dimensiones seguras de pantalla (restando un margen de seguridad)
    const margin = 20; // 20px de margen para que no se pegue al borde
    const screenWidth = window.innerWidth - margin;
    const screenHeight = window.innerHeight - margin;
    
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    // 2. Calcular posición asegurando que no se salga
    // Math.max(0, ...) asegura que no sea negativo
    const maxX = screenWidth - btnWidth;
    const maxY = screenHeight - btnHeight;
    
    const randomX = Math.max(margin, Math.random() * maxX);
    const randomY = Math.max(margin, Math.random() * maxY);

    // 3. Aplicar movimiento
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Un toque extra: cambiar el texto aleatoriamente para confundir
    const frases = ["No", "Nop", "¿Segura?", "¡Ups!", "¡Aquí no!"];
    noBtn.innerText = frases[Math.floor(Math.random() * frases.length)];
}

// Eventos para PC y Móvil
noBtn.addEventListener('mouseover', moveButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Evita el click
    moveButton();
});
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveButton();
});

// --- LÓGICA DEL BOTÓN SÍ ---
yesBtn.addEventListener('click', () => {
    questionScreen.classList.add('hidden');
    successScreen.classList.remove('hidden');
    
    // Ocultar botón No
    noBtn.style.display = 'none';

    createExplosion();
    loop(); 
});

// --- CONFETI (Igual que antes) ---
function createExplosion() {
    for (let i = 0; i < 300; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            size: Math.random() * 20 + 10, // Un poco más pequeños para móvil
            speedX: (Math.random() - 0.5) * 15,
            speedY: (Math.random() - 0.5) * 15,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.15,
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
    if (particles.length > 0) requestAnimationFrame(loop);
}