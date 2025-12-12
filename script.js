const yesBtn = document.getElementById('yesBtn');
const yesBtnNav = document.getElementById('yesBtnNav');
const noBtn = document.getElementById('noBtn');
const response = document.getElementById('response');
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let fireworks = [];
let particles = [];
let noButtonClicks = 0;

// Firework class
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.exploded = false;
        this.particles = [];
        this.colors = ['#FFD700', '#FFA500', '#FF6B6B', '#FFB6C1', '#FFE5B4', '#FF69B4'];
        
        this.explode();
    }
    
    explode() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 4;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                life: 1,
                decay: 0.02 + Math.random() * 0.02
            });
        }
        this.exploded = true;
    }
    
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= p.decay;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    draw() {
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life * 0.7; // Add opacity to particles
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }
    
    isDead() {
        return this.particles.length === 0;
    }
}

// Animation loop
function animate() {
    // Only clear if there are fireworks active
    if (fireworks.length > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.update();
        fw.draw();
        
        if (fw.isDead()) {
            fireworks.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}
animate();

// Create firework at position
function createFirework(x, y) {
    fireworks.push(new Firework(x, y));
}

// Create multiple fireworks
function createFireworks() {
    const count = 5;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.6;
            createFirework(x, y);
        }, i * 200);
    }
}

function handleYesClick() {
    if (yesBtn) yesBtn.style.display = 'none';
    if (yesBtnNav) yesBtnNav.style.display = 'none';
    if (noBtn) noBtn.style.display = 'none';
    
    // Show fireworks canvas with opacity
    canvas.classList.add('active');
    
    // Show "SHE SAID YES" text
    const sheSaidYes = document.getElementById('sheSaidYes');
    if (sheSaidYes) {
        sheSaidYes.classList.add('show');
    }
    
    // Create fireworks animation
    createFireworks();
    
    // Continue fireworks for a bit
    const interval = setInterval(() => {
        if (fireworks.length < 3) {
            createFireworks();
        }
    }, 1000);
    
    setTimeout(() => {
        clearInterval(interval);
    }, 5000);
}

if (yesBtn) {
    yesBtn.addEventListener('click', handleYesClick);
}
if (yesBtnNav) {
    yesBtnNav.addEventListener('click', handleYesClick);
}

noBtn.addEventListener('click', () => {
    noButtonClicks++;
    
    
    // Move button randomly
    const container = document.querySelector('.buttons');
    const containerRect = container.getBoundingClientRect();
    const buttonRect = noBtn.getBoundingClientRect();
    
    const maxX = window.innerWidth - buttonRect.width - 20;
    const maxY = window.innerHeight - buttonRect.height - 20;
    const minX = 20;
    const minY = 20;
    
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.zIndex = '1000';
    noBtn.style.width = buttonRect.width + 'px';
    
    // Reset message after a moment
    setTimeout(() => {
        if (noButtonClicks < 3) {
            response.innerHTML = '';
        }
    }, 2000);
});
