const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];

class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetX = this.x;
    this.targetY = Math.random() * (canvas.height / 2);
    this.speed = 2;
    this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.radius = 2;
    this.isExploded = false;
    this.particles = [];
  }

  update() {
    if (!this.isExploded) {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      if (Math.abs(this.y - this.targetY) < 4) {
        this.explode();
      }
    }

    this.particles.forEach((particle) => {
      particle.update();
    });

    this.particles = this.particles.filter((particle) => particle.radius > 0.2);
  }

  draw() {
    if (!this.isExploded) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, 3, 3);
    }

    this.particles.forEach((particle) => {
      particle.draw();
    });
  }

  explode() {
    this.isExploded = true;
    for (let i = 0; i < 30; i++) {
      const particle = new Particle(this.x, this.y, this.color);
      this.particles.push(particle);
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 2;
    this.speed = Math.random() * 1 + 1; // Điều chỉnh tốc độ ở đây
    this.angle = Math.random() * Math.PI * 2;
    this.gravity = 0.03; // Giảm giật bằng cách tăng giá trị này
    this.opacity = 1;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.radius -= 0.02;
    this.opacity -= 0.02;
  }

  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }
}

function createFirework() {
  const firework = new Firework();
  fireworks.push(firework);
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((firework) => {
    firework.update();
    firework.draw();
  });

  fireworks.forEach((firework, index) => {
    if (firework.isExploded && firework.particles.length === 0) {
      fireworks.splice(index, 1);
    }
  });

  if (Math.random() < 0.05) {
    createFirework();
  }
}

animate();
