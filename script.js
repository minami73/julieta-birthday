// ─── SOUNDS ──────────────────────────────────────────────
const sfxFanfare  = new Audio('sounds/fanfare.mp3');
const sfxCongrats = new Audio('sounds/congratulations.mp3');
const sfxCheering = new Audio('sounds/cheering.mp3');

function enterPage() {
  const overlay = document.getElementById('intro-overlay');
  overlay.classList.add('fade-out');
  setTimeout(() => overlay.remove(), 650);
  sfxFanfare.volume = 0.7;
  sfxFanfare.play().catch(() => {});
}

function playCongratsSound() {
    sfxCongrats.currentTime = 0;
    sfxCongrats.play().catch(() => { });
}

// ─── FANDOM CHIP AUDIO ───────────────────────────────────
let activeChipAudio = null;
let activeChip = null;

document.querySelectorAll('.fandom-chip[data-sound]').forEach(chip => {
    const audio = new Audio(chip.dataset.sound);

    chip.addEventListener('click', () => {
        // Si este chip ya está sonando, lo pausa y limpia
        if (activeChip === chip) {
            audio.pause();
            audio.currentTime = 0;
            chip.classList.remove('playing');
            activeChip = null;
            activeChipAudio = null;
            return;
        }
        // Para cualquier chip previo
        if (activeChipAudio) {
            activeChipAudio.pause();
            activeChipAudio.currentTime = 0;
            activeChip.classList.remove('playing');
        }
        // Reproduce el nuevo
        audio.currentTime = 0;
        audio.play().catch(() => {});
        chip.classList.add('playing');
        activeChip = chip;
        activeChipAudio = audio;

        // Limpia el estado cuando termina la canción
        audio.onended = () => {
            chip.classList.remove('playing');
            activeChip = null;
            activeChipAudio = null;
        };
    });
});

// ─── STARFIELD ───────────────────────────────────────────
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < 160; i++) {
    stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        alpha: Math.random()
    });
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
        s.alpha += (Math.random() - 0.5) * 0.05;
        s.alpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(103,200,255,${s.alpha})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(drawStars);
}
drawStars();

// ─── CONFETTI ────────────────────────────────────────────
const cc = document.getElementById('confetti-canvas');
const cx = cc.getContext('2d');
cc.width = window.innerWidth;
cc.height = window.innerHeight;
window.addEventListener('resize', () => { cc.width = window.innerWidth; cc.height = window.innerHeight; });

const COLORS = ['#B98EFF', '#FF87C3', '#FFE066', '#C89BFF', '#E0CCFF', '#FF6B6B'];
let confetti = [];

function spawnConfetti(n = 60) {
    for (let i = 0; i < n; i++) {
        confetti.push({
            x: Math.random() * cc.width,
            y: -10,
            r: Math.random() * 7 + 4,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 1.5,
            rot: Math.random() * 360,
            vrot: (Math.random() - 0.5) * 8,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
            life: 1
        });
    }
}

function drawConfetti() {
    cx.clearRect(0, 0, cc.width, cc.height);
    confetti = confetti.filter(p => p.life > 0);
    confetti.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
        p.vy += 0.06;
        if (p.y > cc.height) p.life = 0;
        cx.save();
        cx.globalAlpha = p.life;
        cx.fillStyle = p.color;
        cx.translate(p.x, p.y);
        cx.rotate(p.rot * Math.PI / 180);
        if (p.shape === 'rect') {
            cx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        } else {
            cx.beginPath(); cx.arc(0, 0, p.r / 2, 0, Math.PI * 2); cx.fill();
        }
        cx.restore();
    });
    requestAnimationFrame(drawConfetti);
}
drawConfetti();

// Burst on load
spawnConfetti(120);

// ─── FLOATING EMOJIS ─────────────────────────────────────
const floaterEmojis = ['💜', '📚', '⭐', '🎬', '🎧', '⚡', '🎊', '✨', '🎤', '🎂', '🎀', '🌟'];
const floaterContainer = document.getElementById('floaters');
for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.classList.add('floater');
    el.textContent = floaterEmojis[Math.floor(Math.random() * floaterEmojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (Math.random() * 12 + 8) + 's';
    el.style.animationDelay = (Math.random() * 10) + 's';
    el.style.fontSize = (Math.random() * 1.5 + 1.2) + 'rem';
    floaterContainer.appendChild(el);
}

// ─── ORBITING ICONS ──────────────────────────────────────
const orbitIcons = ['💜', '📚', '🎤', '⚡', '🎬', '⭐', '🎧', '🎊', '🌟', '🎀'];
const orbitContainer = document.getElementById('orbit-container');
const wrapperEl = document.querySelector('.name-wrapper');

function buildOrbit() {
    const w = wrapperEl.offsetWidth;
    const h = wrapperEl.offsetHeight;
    const rx = (w / 2) * 0.9;
    const ry = (h / 2) * 0.9;
    orbitContainer.innerHTML = '';
    orbitIcons.forEach((icon, i) => {
        const el = document.createElement('div');
        el.classList.add('orbit-icon');
        el.textContent = icon;
        const angle = (i / orbitIcons.length) * 360;
        const dur = 10 + (i % 3) * 3;
        const dir = i % 2 === 0 ? 1 : -1;
        el.style.cssText = `
      --start: ${angle}deg;
      --radius: ${Math.max(rx, ry) * 0.8}px;
      animation: orbitAnim ${dur}s linear infinite;
      ${dir < 0 ? 'animation-direction: reverse;' : ''}
    `;
        orbitContainer.appendChild(el);
    });
}
buildOrbit();
window.addEventListener('resize', buildOrbit);

// ─── CLICK PARTICLES ─────────────────────────────────────
document.addEventListener('click', e => {
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 10 + 5;
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        p.style.cssText = `
      left: ${e.clientX}px; top: ${e.clientY}px;
      width: ${size}px; height: ${size}px;
      background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
      --tx: ${tx}px; --ty: ${ty}px;
      animation-duration: ${Math.random() * 0.5 + 0.6}s;
    `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1100);
    }
    spawnConfetti(20);
});

// ─── AUDIO ───────────────────────────────────────────────
const bdayAudio = document.getElementById('bday-audio');
const playBtn = document.getElementById('play-btn');
const audioBars = document.getElementById('audio-bars');

function toggleAudio() {
    if (bdayAudio.paused) {
        bdayAudio.play().catch(() => {});
        playBtn.textContent = '⏸️';
        audioBars.classList.remove('paused');
    } else {
        bdayAudio.pause();
        playBtn.textContent = '▶️';
        audioBars.classList.add('paused');
    }
}

bdayAudio.addEventListener('ended', () => {
    playBtn.textContent = '▶️';
    audioBars.classList.add('paused');
});

// ─── SURPRISE MESSAGES ───────────────────────────────────
const surprises = [
    `🎉 ¡DATOS IMPORTANTES SOBRE JULIETA!<br><br>
   🌟 Tiene un gusto musical que combina K-pop con Daft Punk, The Weeknd y Sabrina Carpenter... y de algún modo todo encaja.<br>
   ⚡ Sospechamos que en realidad pertenece a Hogwarts y aún está esperando su carta.<br>
   📚 Sin duda alguna es una alumna muy aplicada, simpática y alegre, muchas cosas buenas para ella vendrán.<br>
   💜 Su color favorito es el lila porque inconscientemente sabe que es el color de la realeza... y de los buenos gustos.`,

    `😂 TEORÍAS CONSPIRATIVAS SOBRE SUS 15 AÑOS:<br><br>
   • A esta edad ya sabe más de K-dramas que muchos adultos juntos.<br>
   • Probablemente pueda recitar las casas de Hogwarts más rápido que el Sombrero Seleccionador.<br>
   • No sabemos si cumplió 15 o si ya lleva 15 temporadas viendo doramas.<br>
   • El universo sigue sin responder por qué V no le ha dedicado una canción todavía. 💜`,

    `✨ UN MENSAJE DE V (KIM TAE-HYUNG):<br><br>
   "Julieta, aunque no puedo estar ahí en persona, mis canciones sí pueden.
   Feliz cumpleaños de parte de tu bias favorito de BTS.
   P.D. — Si alguien te pregunta cuál es tu OST favorita, ya sabes qué responder." 💜`,

    `🎓 UN MENSAJE DEL PROFE JARED:<br><br>
   "Que cumplas muchos más, y que siempre seas tan genial como eres.
   Sigue preparandote
   ... Aunque sea tantito."`,
];
let surpriseIndex = 0;

function showSurprise() {
    const msg = document.getElementById('surprise-msg');
    msg.innerHTML = surprises[surpriseIndex % surprises.length];
    msg.classList.add('show');
    surpriseIndex++;
    spawnConfetti(80);
    sfxCheering.currentTime = 0;
    sfxCheering.play().catch(() => { });
    setTimeout(() => msg.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
}

// ─── KONAMI CODE EASTER EGG ──────────────────────────────
const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let kIndex = 0;
document.addEventListener('keydown', e => {
    if (e.key === konami[kIndex]) { kIndex++; }
    else { kIndex = 0; }
    if (kIndex === konami.length) {
        kIndex = 0;
        for (let i = 0; i < 5; i++) setTimeout(() => spawnConfetti(100), i * 200);
        alert('🎉 ¡KONAMI CODE! Julieta encontró el Easter Egg secreto. +1000 puntos de bruja certificada por Hogwarts. ✨');
    }
});
