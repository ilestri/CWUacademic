const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

const SCALE = 20;
const ROWS = canvas.height / SCALE;
const COLUMNS = canvas.width / SCALE;

let score = 0;
let speed = 250; // 스네이크의 초기 속도 (밀리초)
let snake, fruit, gameRunning = false;
let lastRenderTime = 0;

// 뱀 객체 정의
class Snake {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = SCALE;
    this.ySpeed = 0;
    this.tail = [];
    this.newDirection = null;
  }

  // 뱀 그리기 함수
  draw() {
    ctx.fillStyle = "#4CAF50";
    for (const part of this.tail) {
      ctx.fillRect(part.x, part.y, SCALE, SCALE);
    }
    ctx.fillRect(this.x, this.y, SCALE, SCALE);
  }

  // 뱀의 위치 업데이트 함수
  update() {
    if (this.newDirection) {
      this.changeDirection(this.newDirection);
      this.newDirection = null;
    }

    this.tail.push({x: this.x, y: this.y});
    this.tail.shift();

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x < 0 || this.y < 0 || this.x >= canvas.width || this.y >= canvas.height) {
      gameOver();
    }
  }

  // 방향 변경 함수
  changeDirection(direction) {
    const opposite = {
      Up: "Down",
      Down: "Up",
      Left: "Right",
      Right: "Left"
    };

    if (direction === opposite[this.currentDirection()]) {
      return;
    }

    switch (direction) {
      case "Up":
        this.xSpeed = 0;
        this.ySpeed = -SCALE;
        break;
      case "Down":
        this.xSpeed = 0;
        this.ySpeed = SCALE;
        break;
      case "Left":
        this.xSpeed = -SCALE;
        this.ySpeed = 0;
        break;
      case "Right":
        this.xSpeed = SCALE;
        this.ySpeed = 0;
        break;
    }
  }

  currentDirection() {
    if (this.xSpeed === SCALE) {
      return "Right";
    }
    if (this.xSpeed === -SCALE) {
      return "Left";
    }
    if (this.ySpeed === SCALE) {
      return "Down";
    }
    if (this.ySpeed === -SCALE) {
      return "Up";
    }
  }

  eat(fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.tail.push({x: this.x - this.xSpeed, y: this.y - this.ySpeed});
      return true;
    }
    return false;
  }

  checkCollision() {
    for (const part of this.tail) {
      if (this.x === part.x && this.y === part.y) {
        gameOver();
      }
    }
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = SCALE;
    this.ySpeed = 0;
    this.tail = [];
    score = 0;
    speed = 250; // 게임 초기화 시 속도도 초기화
    document.getElementById("score").textContent = score;
  }
}

// 먹이 객체 정의
class Fruit {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.pickLocation();
  }

  pickLocation() {
    this.x = Math.floor(Math.random() * COLUMNS) * SCALE;
    this.y = Math.floor(Math.random() * ROWS) * SCALE;
  }

  draw() {
    ctx.fillStyle = "#FF4136";
    ctx.fillRect(this.x, this.y, SCALE, SCALE);
  }
}

function drawBorder() {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// 게임 시작 함수
function startGame() {
  if (gameRunning) {
    return;
  }
  snake = new Snake();
  fruit = new Fruit();
  gameRunning = true;
  window.requestAnimationFrame(gameLoop);
}

// 게임 루프 함수 (requestAnimationFrame 사용)
function gameLoop(currentTime) {
  if (!gameRunning) {
    return;
  }

  if (currentTime - lastRenderTime >= speed) { // 속도에 따라 게임 루프 조정
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBorder();
    fruit.draw();
    snake.update();
    snake.draw();

    if (snake.eat(fruit)) {
      score++;
      document.getElementById("score").textContent = score;
      fruit.pickLocation();

      // 속도 증가: 먹이를 먹을 때마다 속도가 더 빨라짐
      if (speed > 50) { // 최소 속도를 제한하여 너무 빠르지 않도록
        speed -= 10; // 속도를 10ms씩 줄임
      }
    }

    snake.checkCollision();
    lastRenderTime = currentTime;
  }

  window.requestAnimationFrame(gameLoop);
}

// 게임 정지 함수
function stopGame() {
  gameRunning = false;
}

function gameOver() {
  alert("게임 오버! 점수: " + score);
  snake.reset();
  stopGame();
}

// 버튼 토글 함수
function toggleGame() {
  if (gameRunning) {
    stopGame();
    document.getElementById("toggle-btn").textContent = "시작";
  } else {
    startGame();
    document.getElementById("toggle-btn").textContent = "정지";
  }
}

// 방향키 입력 이벤트 처리
window.addEventListener("keydown", (event) => {
  const direction = event.key.replace("Arrow", "");
  snake.newDirection = direction;
});

document.getElementById("toggle-btn").addEventListener("click", toggleGame);
