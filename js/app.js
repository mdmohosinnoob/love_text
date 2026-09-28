// Canvas Setup
const canvas = document.getElementById('canvas') || document.getElementById('heartCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initHeartPoints();
    });

    // Mouse & Touch Coordinates
    const mouse = {
        x: null,
        y: null,
        radius: 100
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    let heartPoints = [];
    const totalParticles = 1200;

    // Mathematical Heart Curve Equation
    function getHeartPoint(t) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x, y };
    }

    function initHeartPoints() {
        heartPoints = [];
        const scale = Math.min(width, height) / 45; // Responsive scale

        for (let i = 0; i < totalParticles; i++) {
            const t = (i / totalParticles) * Math.PI * 2;
            const pt = getHeartPoint(t);

            // Random volume offset for glow density
            const offsetX = (Math.random() - 0.5) * 8;
            const offsetY = (Math.random() - 0.5) * 8;

            heartPoints.push({
                baseX: width / 2 + pt.x * scale + offsetX,
                baseY: height / 2.2 + pt.y * scale + offsetY,
                x: width / 2 + pt.x * scale + offsetX,
                y: height / 2.2 + pt.y * scale + offsetY,
                size: Math.random() * 2 + 1,
                color: `hsl(${330 + Math.random() * 30}, 100%, ${60 + Math.random() * 20}%)`,
                vx: 0,
                vy: 0,
                friction: 0.88,
                ease: 0.05,
                pulseSpeed: Math.random() * 0.05 + 0.02,
                pulseAngle: Math.random() * Math.PI * 2
            });
        }
    }

    initHeartPoints();

    let time = 0;

    function animate() {
        // Semi-transparent background clear for glowing trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);

        time += 0.03;
        const heartBeatScale = 1 + Math.sin(time * 3) * 0.05; // Gentle Heartbeat pulse

        for (let i = 0; i < heartPoints.length; i++) {
            let p = heartPoints[i];

            const targetX = width / 2 + (p.baseX - width / 2) * heartBeatScale;
            const targetY = height / 2.2 + (p.baseY - height / 2.2) * heartBeatScale;

            // Particle dispersion on Mouse hover
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    p.vx -= Math.cos(angle) * force * 6;
                    p.vy -= Math.sin(angle) * force * 6;
                }
            }

            // Spring physics returning particles
            p.vx += (targetX - p.x) * p.ease;
            p.vy += (targetY - p.y) * p.ease;

            p.vx *= p.friction;
            p.vy *= p.friction;

            p.x += p.vx;
            p.y += p.vy;

            p.pulseAngle += p.pulseSpeed;
            const currentSize = p.size + Math.sin(p.pulseAngle) * 0.8;

            // Render Particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

// Modal and Button Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('messageModal') || document.getElementById('modalOverlay');
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');
    const closeModalAction = document.getElementById('closeModalAction');

    function openModal() {
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('active');
        }
        triggerHeartBurst();
    }

    function closeModal() {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('active');
        }
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeModalAction) closeModalAction.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
});

// Floating Hearts Animation Effect
function triggerHeartBurst() {
    const heartEmojis = ['❤️', '💖', '💕', '💗', '💓', '✨'];
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

            heart.style.position = 'fixed';
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.top = `${60 + Math.random() * 30}vh`;
            heart.style.fontSize = `${20 + Math.random() * 20}px`;
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            heart.style.animation = 'floatUp 3s ease-out forwards';

            document.body.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 80);
    }
}
