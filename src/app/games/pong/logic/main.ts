import k, { initKaplay } from "./kaplayCtx";
import gameManager, { initGameManager } from "./gameManager";

export function startPong(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) throw new Error("Pong container not found");

  initKaplay({
    width: 800,
    height: 600,
    letterbox: true,
    background: [10, 10, 10],
    root: container,
    debug: false,
    pixelDensity: devicePixelRatio,
  });

  initGameManager();
  setupScenes();
  k.go("game");

  return k;
}

function setupScenes() {
  k.scene("game", () => {
    gameManager.reset();

    const center = k.vec2(k.width() / 2, k.height() / 2);
    const paddleSpeed = 400; // AI Speed
    const initialBallSpeed = 400;

    // -- BACKGROUND UI --
    for (let y = 0; y < k.height(); y += 40) {
      k.add([
        k.rect(4, 20),
        k.pos(k.width() / 2 - 2, y),
        k.color(50, 50, 50),
      ]);
    }

    const playerScoreLabel = k.add([
      k.text("0", { size: 60, font: "monospace" }),
      k.pos(k.width() / 2 - 100, 50),
      k.anchor("center"),
      k.color(255, 255, 255),
    ]);

    const cpuScoreLabel = k.add([
      k.text("0", { size: 60, font: "monospace" }),
      k.pos(k.width() / 2 + 100, 50),
      k.anchor("center"),
      k.color(255, 255, 255),
    ]);

    // -- OBJECTS --
    const player = k.add([
      k.rect(20, 100),
      k.pos(30, center.y),
      k.anchor("center"),
      k.area(),
      // ❌ Removed k.body() -> Manual control
      k.color(0, 255, 255), // Cyan
      "paddle",
      "player"
    ]);

    const cpu = k.add([
      k.rect(20, 100),
      k.pos(k.width() - 30, center.y),
      k.anchor("center"),
      k.area(),
      // ❌ Removed k.body()
      k.color(255, 0, 0), // Red
      "paddle",
      "cpu"
    ]);

    const ball = k.add([
      k.rect(20, 20),
      k.pos(center),
      k.anchor("center"),
      k.area(),
      // ❌ Removed k.body() -> Prevents conflict
      k.color(255, 255, 255),
      "ball",
      {
        vel: k.vec2(initialBallSpeed, initialBallSpeed),
        speed: initialBallSpeed
      }
    ]);

    // Walls
    k.add([k.rect(k.width(), 10), k.pos(0, -10), k.area(), "wall"]);
    k.add([k.rect(k.width(), 10), k.pos(0, k.height()), k.area(), "wall"]);

    // -- LOGIC --

    // 1. Player Movement (Mouse Y)
    k.onUpdate(() => {
      const mPos = k.mousePos();
      player.pos.y = Math.max(50, Math.min(k.height() - 50, mPos.y));
    });

    // 2. CPU AI Movement
    k.onUpdate(() => {
      const delta = k.dt();
      if (ball.pos.y > cpu.pos.y + 10) {
        cpu.pos.y += paddleSpeed * delta;
      } else if (ball.pos.y < cpu.pos.y - 10) {
        cpu.pos.y -= paddleSpeed * delta;
      }
      cpu.pos.y = Math.max(50, Math.min(k.height() - 50, cpu.pos.y));
    });

    // 3. Ball Movement
    k.onUpdate(() => {
      ball.pos.x += ball.vel.x * k.dt();
      ball.pos.y += ball.vel.y * k.dt();

      // Scoring
      if (ball.pos.x < -20) {
        gameManager.cpuScore++;
        cpuScoreLabel.text = String(gameManager.cpuScore);
        k.shake(20);
        resetBall(1);
      } else if (ball.pos.x > k.width() + 20) {
        gameManager.playerScore++;
        playerScoreLabel.text = String(gameManager.playerScore);
        k.shake(20);
        resetBall(-1);
      }
    });

    // 4. Collisions
    k.onCollide("ball", "wall", () => {
      ball.vel.y = -ball.vel.y;
    });

    k.onCollide("ball", "paddle", (b: any, p: any) => {
      ball.vel.x = -ball.vel.x;
      ball.vel.x *= 1.05;
      ball.vel.y *= 1.05;

      const offset = b.pos.y - p.pos.y;
      ball.vel.y += offset * 5; 

      // 🛠️ FIX: Push ball out to prevent sticking
      if (p.is("player")) {
        ball.pos.x = p.pos.x + p.width / 2 + b.width / 2 + 2;
      } else {
        ball.pos.x = p.pos.x - p.width / 2 - b.width / 2 - 2;
      }

      k.shake(2);
    });

    function resetBall(direction: number) {
      ball.pos = k.vec2(k.width() / 2, k.height() / 2);
      ball.vel = k.vec2(direction * initialBallSpeed, k.rand(-200, 200));
    }
  });
}