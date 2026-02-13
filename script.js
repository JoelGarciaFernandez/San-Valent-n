const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionScreen = document.getElementById('question-screen');
const successScreen = document.getElementById('success-screen');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const emojis = ["❤️", "🌹", "✨", "🥰", "💖", "🌸"];

// --- LÓGICA DEL BOTÓN "REBOTÓN" ---

function moveButton() {
    // 1. ¿Dónde está el botón AHORA?
    const currentRect = noBtn.getBoundingClientRect();
    const currentX = currentRect.left;
    const currentY = currentRect.top;

    // 2. Límites de la pantalla (con un margen de seguridad de 20px)
    const margin = 20;
    const maxWidth = window.innerWidth - currentRect.width - margin;
    const maxHeight = window.innerHeight - currentRect.height - margin;

    // 3. ¿Cuánto queremos que se mueva? (Entre -150px y +150px)
    // Esto hace que el salto sea corto, no teletransportación
    const jumpRange = 150; 
    const randomX = (Math.random() - 0.5) * 2 * jumpRange;
    const randomY = (Math.random() - 0.5) * 2 * jumpRange;

    // 4. Calcular nueva posición
    let newX = currentX + randomX;
    let newY = currentY + randomY;

    // 5. LA PARED (Si se pasa, lo devolvemos adentro)
    // Math.max(margin, ...) -> Asegura que no se salga por la izquierda/arriba
    // Math.min(max..., ...) -> Asegura que no se salga por la derecha/abajo
    
    newX = Math.max(margin, Math.min(newX, maxWidth));
    newY = Math.max(margin, Math.min(newY, maxHeight));

    // 6. Aplicar movimiento
    noBtn.style.position = 'fixed'; // Necesario para moverse libremente
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    
    // Asegurar que esté encima de todo
    noBtn.style.zIndex = "9999";
}

// --- EVENTOS ---

// PC: Hover
noBtn.addEventListener('mouseover', moveButton);

// MÓVIL: Touchstart (al tocar)
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Evita el click
    moveButton();
});

// SEGURIDAD: Click
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveButton();
});


// --- RESTO DEL CÓDIGO (Igual que siempre) ---
yesBtn.addEventListener('click', () => {
    questionScreen.classList.add('hidden');
    successScreen.classList.remove('hidden');
    noBtn.style.display = 'none';
    createExplosion();
    loop(); 
});

function createExplosion() {
    for (let i = 0; i < 300; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            size: Math.random() * 20 + 10,
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

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});