import type { GameObj } from "kaplay";
import k from "./kaplayCtx";

// Hold the real instance after it's created
let instance: GameObj | null = null;

// Call this AFTER Kaplay is initialized (in main.ts)
export function initGameManager() {
  instance = k.add([
    k.state("menu", [
      "menu",
      "cutscene",
      "round-start",
      "round-end",
      "hunt-start",
      "hunt-end",
      "duck-hunted",
      "duck-escaped",
    ]),
    {
      isGamePaused: false,
      currentScore: 0,
      currentRoundNb: 0,
      currentHuntNb: 0,
      nbBulletsLeft: 3,
      nbDucksShotInRound: 0,
      preySpeed: 100,
      resetGameState(this: GameObj) {
        this["currentScore"] = 0;
        this["currentRoundNb"] = 0;
        this["currentHuntNb"] = 0;
        this["nbBulletsLeft"] = 3;
        this["nbDucksShotInRound"] = 0;
        this["preySpeed"] = 100;
      },
    },
  ]);
  return instance;
}

// Proxy to allow other files to import 'gameManager' normally.
// It forwards property access to the 'instance' created above.
const gameManager = new Proxy({}, {
  get: (target, prop) => {
    if (!instance) {
      console.warn(`[GameManager] Accessing '${String(prop)}' before initialization!`);
      return undefined;
    }
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
  set: (target, prop, value) => {
    if (!instance) return false;
    (instance as any)[prop] = value;
    return true;
  }
});

// Export as the intersection of GameObj and custom props for TypeScript
export default gameManager as GameObj & {
  isGamePaused: boolean;
  currentScore: number;
  currentRoundNb: number;
  currentHuntNb: number;
  nbBulletsLeft: number;
  nbDucksShotInRound: number;
  preySpeed: number;
  resetGameState: () => void;
  // State machine methods from k.state()
  enterState: (state: string, ...args: any[]) => void;
  state: string;
  onStateEnter: (state: string, action: (args?: any) => void) => void;
};