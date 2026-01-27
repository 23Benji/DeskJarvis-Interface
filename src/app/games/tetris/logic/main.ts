import k, { initKaplay } from "./kaplayCtx";
import gameManager, { initGameManager } from "./gameManager";
import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, COLORS } from "./constants";
import { TETROMINOES } from "./tetrominoes";

export function startTetris(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) throw new Error("Tetris container not found");

  // Calculate the logical game size
  const gameWidth = BOARD_WIDTH * BLOCK_SIZE + 100; // Board + UI space
  const gameHeight = BOARD_HEIGHT * BLOCK_SIZE;

  initKaplay({
    width: gameWidth,
    height: gameHeight,
    letterbox: true,      // 👈 KEY FIX: Scales game to fit container
    background: [10, 10, 10],
    root: container,
    debug: false,
    pixelDensity: devicePixelRatio, // Makes text crisp when scaled up
  });

  initGameManager();
  setupScenes();
  k.go("game");

  return k;
}

function setupScenes() {
  k.scene("game", () => {
    gameManager.reset();

    // -- UI --
    // Vertical line
    k.add([
      k.rect(2, k.height()),
      k.pos(BOARD_WIDTH * BLOCK_SIZE, 0),
      k.color(100, 100, 100)
    ]);

    // Score
    const scoreLabel = k.add([
      k.text("0", { size: 24 }),
      k.pos(BOARD_WIDTH * BLOCK_SIZE + 10, 20),
      k.color(255, 255, 255)
    ]);

    // Controls Text
    k.add([
      k.text("CLICK:\nRotate", { size: 10 }),
      k.pos(BOARD_WIDTH * BLOCK_SIZE + 10, 80),
    ]);
    k.add([
      k.text("ENTER:\nDrop", { size: 10 }),
      k.pos(BOARD_WIDTH * BLOCK_SIZE + 10, 120),
    ]);
    
    // -- GAMEPLAY STATE --
    let currentPiece = spawnPiece();
    let dropTimer = 0;
    const dropInterval = 0.5;

    // -- INPUTS --

    // 1. Mouse X Movement
    k.onUpdate(() => {
      if (gameManager.isGameOver) return;

      const mPos = k.mousePos();
      
      // We must clamp the mouse position to the logic board width
      // because letterbox might create black bars where mouse coordinates exist
      const logicMouseX = Math.min(Math.max(0, mPos.x), BOARD_WIDTH * BLOCK_SIZE);
      
      let targetCol = Math.floor(logicMouseX / BLOCK_SIZE);
      
      const shapeW = currentPiece.shape[0].length;
      if (targetCol < 0) targetCol = 0;
      if (targetCol + shapeW > BOARD_WIDTH) targetCol = BOARD_WIDTH - shapeW;

      if (targetCol !== currentPiece.x) {
        const oldX = currentPiece.x;
        currentPiece.x = targetCol;
        if (checkCollision(currentPiece)) {
          currentPiece.x = oldX;
        }
      }

      scoreLabel.text = String(gameManager.score);
    });

    // 2. Click to Rotate
    k.onClick(() => {
      if (gameManager.isGameOver) {
        k.go("game");
        return;
      }
      rotatePiece(currentPiece);
    });

    // 3. Enter to Hard Drop
    k.onKeyPress("enter", () => {
      if (gameManager.isGameOver) return;
      while (!checkCollision(currentPiece, 0, 1)) {
        currentPiece.y++;
      }
      lockPiece(currentPiece);
      currentPiece = spawnPiece();
      if (checkCollision(currentPiece)) gameOver();
    });

    // -- GAME LOOP --
    k.onUpdate(() => {
      if (gameManager.isGameOver) return;

      dropTimer += k.dt();
      if (dropTimer >= dropInterval) {
        dropTimer = 0;
        if (!checkCollision(currentPiece, 0, 1)) {
          currentPiece.y++;
        } else {
          lockPiece(currentPiece);
          currentPiece = spawnPiece();
          if (checkCollision(currentPiece)) gameOver();
        }
      }
    });

    // -- DRAWING --
    k.onDraw(() => {
      // 1. Draw Static Board
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          if (gameManager.board[y][x]) {
            k.drawRect({
              width: BLOCK_SIZE - 1,
              height: BLOCK_SIZE - 1,
              pos: k.vec2(x * BLOCK_SIZE, y * BLOCK_SIZE),
              color: hexToKColor(gameManager.board[y][x]),
            });
          }
        }
      }

      // 2. Draw Active Piece
      if (!gameManager.isGameOver) {
        drawMatrix(currentPiece.shape, currentPiece.x, currentPiece.y, currentPiece.color);
      }
    });
  });
}

// -- HELPERS --

function hexToKColor(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return k.color(r, g, b);
}

function spawnPiece() {
  const typeId = Math.floor(Math.random() * TETROMINOES.length);
  const template = TETROMINOES[typeId];
  const shape = template.shape.map(row => [...row]);
  
  return {
    shape: shape,
    color: template.color,
    x: Math.floor(BOARD_WIDTH / 2) - 1,
    y: 0
  };
}

function rotatePiece(piece: any) {
  const originalShape = piece.shape;
  const newShape = piece.shape[0].map((val: any, index: number) => 
    piece.shape.map((row: any) => row[index]).reverse()
  );

  piece.shape = newShape;

  if (checkCollision(piece)) {
    if (!checkCollision(piece, -1, 0)) {
        piece.x--;
    } 
    else if (!checkCollision(piece, 1, 0)) {
        piece.x++;
    } 
    else {
        piece.shape = originalShape;
    }
  }
}

function checkCollision(piece: any, offX = 0, offY = 0) {
  const { shape, x, y } = piece;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newX = x + col + offX;
        const newY = y + row + offY;

        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true;
        if (newY >= 0 && gameManager.board[newY][newX]) return true;
      }
    }
  }
  return false;
}

function lockPiece(piece: any) {
  const { shape, x, y, color } = piece;
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        if (y + row >= 0) {
           gameManager.board[y + row][x + col] = color;
        }
      }
    }
  }

  let linesCleared = 0;
  for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
    if (gameManager.board[r].every((cell: any) => cell !== null)) {
      gameManager.board.splice(r, 1);
      gameManager.board.unshift(Array(10).fill(null));
      linesCleared++;
      r++; 
    }
  }
  
  if (linesCleared > 0) {
      gameManager.score += linesCleared * 100 * linesCleared;
      k.shake(linesCleared * 2);
  }
}

function drawMatrix(matrix: any[][], offsetX: number, offsetY: number, colorHex: string) {
  matrix.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value) {
        k.drawRect({
            width: BLOCK_SIZE - 1,
            height: BLOCK_SIZE - 1,
            pos: k.vec2((offsetX + c) * BLOCK_SIZE, (offsetY + r) * BLOCK_SIZE),
            color: hexToKColor(colorHex)
        });
      }
    });
  });
}

function gameOver() {
  gameManager.isGameOver = true;
  k.add([
      k.text("GAME OVER", { size: 32 }),
      k.anchor("center"),
      k.pos(BOARD_WIDTH * BLOCK_SIZE / 2, BOARD_HEIGHT * BLOCK_SIZE / 2),
      k.color(255, 0, 0)
  ]);
  k.add([
    k.text("Click to restart", { size: 16 }),
    k.anchor("center"),
    k.pos(BOARD_WIDTH * BLOCK_SIZE / 2, (BOARD_HEIGHT * BLOCK_SIZE / 2) + 40),
  ]);
}