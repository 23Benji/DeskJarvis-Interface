import type { GameObj, Vec2 } from 'kaplay';

export type SoundHandle = {
  stop(): void;
};

export type DuckGameObj = GameObj & {
  // injected by components
  pos: Vec2;
  speed: number;
  flipX: boolean;

  // duck state
  flyTimer: number;
  timeBeforeEscape: number;
  duckId: string;
  flyDirection: Vec2;

  // sounds (nullable!)
  quackingSound: SoundHandle | null;
  flappingSound: SoundHandle | null;
  fallSound: SoundHandle | null;

  // kaplay API
  play(anim: string): void;
  move(x: number | Vec2, y?: number): void;
  getCurAnim(): { name: string };

  onStateEnter(state: string, cb: () => void): void;
  onStateUpdate(state: string, cb: () => void): void;
  enterState(state: string): void;

  loop(time: number, cb: () => void): void;
  onClick(cb: () => void): void;
  onExitScreen(cb: () => void): void;

  // custom
  setBehavior(): void;
};
