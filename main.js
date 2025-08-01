// Flappy Bird Game - Vanilla JS
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GRAVITY = 0.5;
const FLAP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;

let birdY = canvas.height / 2;
let birdV = 0;
let pipes = [];
let score = 0;
let gameOver = false;

function resetGame() {
  birdY = canvas.height / 2;
  birdV = 0;
  pipes = [];
  score = 0;
  gameOver = false;
}

// Draw a simple cartoon bird
function drawBird() {
  const birdX = 80;
  // Body
  ctx.fillStyle = '#f9c74f';
  ctx.beginPath();
  ctx.ellipse(birdX, birdY, BIRD_WIDTH / 2, BIRD_HEIGHT / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Wing
  ctx.save();
  ctx.translate(birdX, birdY);
  ctx.rotate(-0.3);
  ctx.fillStyle = '#90be6d';
  ctx.beginPath();
  ctx.ellipse(-5, 0, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  // Beak
  ctx.fillStyle = '#f3722c';
  ctx.beginPath();
  ctx.moveTo(birdX + BIRD_WIDTH / 2, birdY);
  ctx.lineTo(birdX + BIRD_WIDTH / 2 + 10, birdY - 5);
  ctx.lineTo(birdX + BIRD_WIDTH / 2 + 10, birdY + 5);
  ctx.closePath();
  ctx.fill();
  // Eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(birdX + 10, birdY - 5, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(birdX + 12, birdY - 5, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawPipes() {
  ctx.fillStyle = '#43aa8b';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = '#333';
  ctx.font = '32px Arial';
  ctx.fillText(score, canvas.width / 2 - 10, 50);
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '48px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
  ctx.font = '24px Arial';
  ctx.fillText('Press Space to Restart', canvas.width / 2 - 110, canvas.height / 2 + 40);
}

function update() {
  if (gameOver) return;
  birdV += GRAVITY;
  birdY += birdV;

  // Add pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    const top = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
    pipes.push({
      x: canvas.width,
      top,
      bottom: top + PIPE_GAP,
      passed: false
    });
  }

  // Move pipes
  pipes.forEach(pipe => pipe.x -= 2);

  // Remove off-screen pipes
  if (pipes.length && pipes[0].x < -PIPE_WIDTH) pipes.shift();

  // Collision detection
  pipes.forEach(pipe => {
    if (
      80 + BIRD_WIDTH / 2 > pipe.x &&
      80 - BIRD_WIDTH / 2 < pipe.x + PIPE_WIDTH &&
      (birdY - BIRD_HEIGHT / 2 < pipe.top || birdY + BIRD_HEIGHT / 2 > pipe.bottom)
    ) {
      gameOver = true;
    }
    if (!pipe.passed && pipe.x + PIPE_WIDTH < 80) {
      score++;
      pipe.passed = true;
    }
  });

  // Ground/ceiling collision
  if (birdY + BIRD_HEIGHT / 2 > canvas.height || birdY - BIRD_HEIGHT / 2 < 0) {
    gameOver = true;
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
  if (gameOver) drawGameOver();
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    if (gameOver) {
      resetGame();
    } else {
      birdV = FLAP;
    }
  }
});
canvas.addEventListener('mousedown', () => {
  if (gameOver) {
    resetGame();
  } else {
    birdV = FLAP;
  }
});

gameLoop();
