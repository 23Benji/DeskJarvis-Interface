import k from "./kaplayCtx";

let instance: any = null;

export function initGameManager() {
  instance = {
    playerScore: 0,
    cpuScore: 0,
    isGamePaused: false,
    reset() {
      this.playerScore = 0;
      this.cpuScore = 0;
      this.isGamePaused = false;
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