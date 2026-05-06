import k from "./kaplayCtx";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants";

interface GameManager {
  score: number;
  level: number;
  isGameOver: boolean;
  board: (string | null)[][];
  reset(): void;
}

let instance: GameManager | null = null;

export function initGameManager(): GameManager {
  instance = {
    score: 0,
    level: 1,
    isGameOver: false,
    board: [],
    reset() {
      this.score = 0;
      this.level = 1;
      this.isGameOver = false;
      this.board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
    }
  };
  instance.reset();
  return instance;
}

const gameManager = new Proxy({} as GameManager, {
  get: (target, prop) => {
    if (!instance) return undefined;
    return instance[prop as keyof GameManager];
  },
  set: (target, prop, value) => {
    if (!instance) return false;
    (instance as any)[prop] = value;
    return true;
  }
});

export default gameManager;