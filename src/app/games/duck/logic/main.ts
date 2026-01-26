import k, { initKaplay } from "./kaplayCtx";
import { COLORS } from "./constant";
// Import the init function 
import gameManager, { initGameManager } from "./gameManager"; 
import formatScore from "./utils";
import makeDog from "./entities/dog";
import makeDuck from "./entities/duck";

const ASSETS_PATH = "/assets";

export function startDuckHunter(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) throw new Error("Container not found");

  // 1. Initialize Kaplay
  initKaplay({
    width: 256,       // 👈 FIXED: Internal resolution (NES width)
    height: 224,      // 👈 FIXED: Internal resolution (NES height)
    letterbox: true,  // 👈 FIXED: Scales the 256x224 image to fill the container
    background: [0, 0, 0],
    root: container   // Attaches to your Angular div
  });

  // 2. Initialize Game Manager (NOW IT IS SAFE)
  initGameManager();

  loadResources();
  setupScenes();

  k.go("main-menu");

  return k;
}

/** Load all sprites, sounds, and fonts */
function loadResources() {
  // Sprites
  k.loadSprite("background", `${ASSETS_PATH}/graphics/background.png`);
  k.loadSprite("menu", `${ASSETS_PATH}/graphics/menu.png`);
  k.loadSprite("cursor", `${ASSETS_PATH}/graphics/cursor.png`);
  k.loadSprite("text-box", `${ASSETS_PATH}/graphics/text-box.png`);
  k.loadSprite("dog", `${ASSETS_PATH}/graphics/dog.png`, {
    sliceX: 4,
    sliceY: 3,
    anims: {
      search: { from: 0, to: 3, speed: 6, loop: true },
      snif: { from: 4, to: 5, speed: 4, loop: true },
      detect: 6,
      jump: { from: 7, to: 8, speed: 6 },
      catch: 9,
      mock: { from: 10, to: 11, loop: true },
    },
  });
  k.loadSprite("duck", `${ASSETS_PATH}/graphics/duck.png`, {
    sliceX: 8,
    sliceY: 1,
    anims: {
      "flight-diagonal": { from: 0, to: 2, loop: true },
      "flight-side": { from: 3, to: 5, loop: true },
      shot: 6,
      fall: 7,
    },
  });

  // Sounds
  const sounds = [
    "gun-shot",
    "quacking",
    "flapping",
    "fall",
    "impact",
    "sniffing",
    "barking",
    "laughing",
    "ui-appear",
    "successful-hunt",
    "forest-ambiance",
  ];
  sounds.forEach((s) => k.loadSound(s, `${ASSETS_PATH}/sounds/${s}.wav`));
  k.loadSound("flapping", `${ASSETS_PATH}/sounds/flapping.ogg`); 
  k.loadFont("nes", `${ASSETS_PATH}/nintendo-nes-font/nintendo-nes-font.ttf`);
}

/** Setup all game scenes */
function setupScenes() {
  setupMainMenu();
  setupGameScene();
  setupGameOverScene();
}

/** Main Menu */
function setupMainMenu() {
  k.scene("main-menu", () => {
    k.add([k.sprite("menu")]);
    k.add([k.text("CLICK TO START", { font: "nes", size: 8 }), k.anchor("center"), k.pos(k.center().x, k.center().y + 40)]);
    k.add([k.text("MADE BY JSLEGEND", { font: "nes", size: 8 }), k.pos(10, 215), k.z(2), k.color(COLORS.BLUE), k.opacity(0.5)]);

    const bestScoreData: { value: number } | null = k.getData("best-score");
    const bestScore = bestScoreData?.value || 0;
    k.add([k.text(`TOP SCORE = ${formatScore(bestScore, 6)}`, { font: "nes", size: 8 }), k.pos(55, 184), k.color(COLORS.RED)]);

    k.onClick(() => k.go("game"));
  });
}

/** Game Over Scene */
function setupGameOverScene() {
  k.scene("game-over", () => {
    k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);
    k.add([k.text("GAME OVER!", { font: "nes", size: 8 }), k.anchor("center"), k.pos(k.center())]);
    k.wait(2, () => k.go("main-menu"));
  });
}

/** Game Scene */
function setupGameScene() {
  k.scene("game", () => {
    k.setCursor("none");

    // Background
    k.add([k.rect(k.width(), k.height()), k.color(COLORS.BLUE), "sky"]);
    k.add([k.sprite("background"), k.pos(0, -10), k.z(1)]);

    // UI: Score & Round
    const score = k.add([k.text(formatScore(0, 6), { font: "nes", size: 8 }), k.pos(192, 197), k.z(2)]);
    const roundCount = k.add([k.text("1", { font: "nes", size: 8 }), k.pos(42, 182), k.z(2), k.color(COLORS.RED)]);

    // Duck Icons
    const duckIcons = k.add([k.pos(95, 198)]);
    for (let i = 0, x = 1; i < 10; i++, x += 8) duckIcons.add([k.rect(7, 9), k.pos(x, 0), `duckIcon-${i}`]);

    // Bullet UI
    const bulletUIMask = k.add([k.rect(0, 8), k.pos(25, 198), k.z(2), k.color(0, 0, 0)]);

    // Dog
    const dog = makeDog(k.vec2(0, k.center().y));
    dog.searchForDucks();

    // Game state controllers
    setupGameStateControllers(score, roundCount, duckIcons, bulletUIMask, dog);

    // Cursor
    const cursor = k.add([k.sprite("cursor"), k.anchor("center"), k.pos(), k.z(3)]);
    k.onClick(() => {
      // Access gameManager properties safely now
      if (gameManager.state === "hunt-start" && !gameManager.isGamePaused) {
        if (gameManager.nbBulletsLeft > 0) k.play("gun-shot", { volume: 0.5 });
        gameManager.nbBulletsLeft--;
      }
    });

    // Update
    k.onUpdate(() => {
      score.text = formatScore(gameManager.currentScore, 6);
      bulletUIMask.width = [0, 8, 15, 22][Math.max(0, 3 - gameManager.nbBulletsLeft)] ?? 22;
      cursor.moveTo(k.mousePos());
    });

    // Ambiance
    const forestAmbiance = k.play("forest-ambiance", { volume: 0.1, loop: true });
    k.onSceneLeave(() => {
      forestAmbiance.stop();
      gameManager.resetGameState();
    });

    // Pause
    k.onKeyPress((key: string) => {
      if (key === "p") togglePause();
    });
  });
}

/** Pause toggle */
function togglePause() {
  const root = k.getTreeRoot();
  root.paused = !root.paused;
  gameManager.isGamePaused = root.paused;

  if (root.paused) {
    //@ts-ignore
    if(window.audioCtx) window.audioCtx.suspend();
    k.add([k.text("PAUSED", { font: "nes", size: 8 }), k.pos(5, 5), k.z(3), "paused-text"]);
  } else {
    //@ts-ignore
    if(window.audioCtx) window.audioCtx.resume();
    const pausedText = k.get("paused-text")[0];
    if (pausedText) k.destroy(pausedText);
  }
}

/** Game state controllers (rounds, hunts, ducks, etc.) */
function setupGameStateControllers(score: any, roundCount: any, duckIcons: any, bulletUIMask: any, dog: any) {
  // Round Start
  gameManager.onStateEnter("round-start", async (isFirstRound: any) => {
    // Note: The callback arg for onStateEnter might be implicit, check type safety
    if (!isFirstRound) gameManager.preySpeed += 50;
    k.play("ui-appear");
    gameManager.currentRoundNb++;
    roundCount.text = String(gameManager.currentRoundNb);

    const textBox = k.add([k.sprite("text-box"), k.anchor("center"), k.pos(k.center().x, k.center().y - 50), k.z(2)]);
    textBox.add([k.text("ROUND", { font: "nes", size: 8 }), k.anchor("center"), k.pos(0, -10)]);
    textBox.add([k.text(String(gameManager.currentRoundNb), { font: "nes", size: 8 }), k.anchor("center"), k.pos(0, 4)]);

    await k.wait(1);
    k.destroy(textBox);
    gameManager.enterState("hunt-start");
  });

  // Round End
  gameManager.onStateEnter("round-end", () => {
    if (gameManager.nbDucksShotInRound < 6) return k.go("game-over");
    if (gameManager.nbDucksShotInRound === 10) {
      gameManager.currentScore += 500;
      k.setData("best-score", { value: gameManager.currentScore });
    }
    gameManager.nbDucksShotInRound = 0;
    for (const duckIcon of duckIcons.children) (duckIcon as any)["color"] = k.color(255, 255, 255);
    gameManager.enterState("round-start");
  });

  // Hunt Start
  gameManager.onStateEnter("hunt-start", () => {
    gameManager.currentHuntNb++;
    const duck = makeDuck(String(gameManager.currentHuntNb - 1), gameManager.preySpeed);
    duck.setBehavior();
  });

  // Hunt End
  gameManager.onStateEnter("hunt-end", () => {
    const bestScoreData: { value: number } | null = k.getData("best-score");
    const bestScore = bestScoreData?.value;
    if (bestScore && bestScore < gameManager.currentScore) k.setData("best-score", { value: gameManager.currentScore });

    if (gameManager.currentHuntNb <= 9) return gameManager.enterState("hunt-start");
    gameManager.currentHuntNb = 0;
    gameManager.enterState("round-end");
  });

  // Duck Hunted
  gameManager.onStateEnter("duck-hunted", () => {
    gameManager.nbBulletsLeft = 3;
    dog.catchFallenDuck();
  });

  // Duck Escaped
  gameManager.onStateEnter("duck-escaped", async () => dog.mockPlayer());
}