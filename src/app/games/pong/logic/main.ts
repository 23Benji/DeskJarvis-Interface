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

    let hoverPaused = false;
    let blurPaused = false;
    let manualPaused = false;

    const applyPause = () => {
      gameManager.isGamePaused = hoverPaused || blurPaused || manualPaused;
    };

    const onBlur = () => { blurPaused = true; applyPause(); };
    const onFocus = () => { blurPaused = false; applyPause(); };
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    k.onSceneLeave(() => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    });

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
      const isOverButton = mPos.x < 110 && mPos.y < 110;
      if (hoverPaused !== isOverButton) {
        hoverPaused = isOverButton;
        applyPause();
      }
      if (gameManager.isGamePaused) return;
      player.pos.y = Math.max(50, Math.min(k.height() - 50, mPos.y));
    });

    // 2. CPU AI Movement
    k.onUpdate(() => {
      if (gameManager.isGamePaused) return;
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
      if (gameManager.isGamePaused) return;
      ball.pos.x += ball.vel.x * k.dt();
      ball.pos.y += ball.vel.y * k.dt();

      // Scoring
      if (ball.pos.x < -20) {
        gameManager.cpuScore++;
        cpuScoreLabel.text = String(gameManager.cpuScore);
        resetBall(1);
      } else if (ball.pos.x > k.width() + 20) {
        gameManager.playerScore++;
        playerScoreLabel.text = String(gameManager.playerScore);
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
    });

    k.onKeyPress("p", () => { manualPaused = !manualPaused; applyPause(); });
    k.onKeyPress("escape", () => { manualPaused = !manualPaused; applyPause(); });

    k.onClick(() => {
      if (gameManager.isGamePaused) {
        manualPaused = false;
        applyPause();
      }
    });

    function resetBall(direction: number) {
      ball.pos = k.vec2(k.width() / 2, k.height() / 2);
      ball.vel = k.vec2(direction * initialBallSpeed, k.rand(-200, 200));
    }
  });
}

function togglePause() {
  const root = k.getTreeRoot();
  root.paused = !root.paused;
  gameManager.isGamePaused = root.paused;

  if (root.paused) {
    k.add([
      k.rect(k.width(), k.height()),
      k.color(0, 0, 0),
      k.opacity(0.7),
      "pause-overlay"
    ]);
    k.add([
      k.text("PAUSED", { size: 32 }),
      k.anchor("center"),
      k.pos(k.width() / 2, k.height() / 2 - 20),
      k.color(255, 255, 255),
      "pause-text"
    ]);
    k.add([
      k.text("Press P or ESC to resume", { size: 14 }),
      k.anchor("center"),
      k.pos(k.width() / 2, k.height() / 2 + 20),
      k.color(200, 200, 200),
      "pause-hint"
    ]);
  } else {
    const overlay = k.get("pause-overlay")[0];
    if (overlay) k.destroy(overlay);
    const text = k.get("pause-text")[0];
    if (text) k.destroy(text);
    const hint = k.get("pause-hint")[0];
    if (hint) k.destroy(hint);
  }
}