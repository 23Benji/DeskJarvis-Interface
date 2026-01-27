import k from "./kaplayCtx";

let instance: any = null;

export function initGameManager() {
  instance = {
    score: 0,
    level: 1,
    isGameOver: false,
    board: [], // 2D array representation
    reset() {
      this.score = 0;
      this.level = 1;
      this.isGameOver = false;
      // Initialize empty board (rows x cols)
      this.board = Array.from({ length: 20 }, () => Array(10).fill(null));
    }
  };
  return instance;
}

const gameManager = new Proxy({}, {
  get: (target, prop) => {
    if (!instance) return undefined;
    return instance[prop];
  },
  set: (target, prop, value) => {
    if (!instance) return false;
    instance[prop] = value;
    return true;
  }
});

export default gameManager as any;