import k from '../kaplayCtx';
import gameManager from '../gameManager';
import type { GameObj, Vec2 } from 'kaplay';

/* -------------------------------------------------------
 * Typed Dog Game Object
 * ----------------------------------------------------- */
export type DogGameObj = GameObj & {
  // injected properties
  pos: Vec2;
  speed: number;

  // injected methods
  onStateEnter(state: string, cb: () => void): void;
  onStateUpdate(state: string, cb: () => void): void;
  enterState(state: string): void;

  play(anim: string): void;
  move(x: number, y: number): void;
  use(comp: unknown): void;

  // custom API
  searchForDucks(): void;
  slideUpAndDown(): Promise<void>;
  catchFallenDuck(): Promise<void>;
  mockPlayer(): Promise<void>;
};

/* -------------------------------------------------------
 * Factory
 * ----------------------------------------------------- */
export default function makeDog(position: Vec2): DogGameObj {
  const sniffing = k.play('sniffing', { volume: 2, paused: true });
  const barking = k.play('barking', { paused: true });
  const laughing = k.play('laughing', { paused: true });

  const dog = k.add([
    k.sprite('dog'),
    k.pos(position),
    k.state('search', ['search', 'snif', 'detect', 'jump', 'drop']),
    k.z(2),

    {
      speed: 15,

      /* -----------------------------
       * Main behavior
       * --------------------------- */
      searchForDucks(this: DogGameObj) {
        let snifs = 0;

        this.onStateEnter('search', () => {
          this.play('search');
          k.wait(2, () => this.enterState('snif'));
        });

        this.onStateUpdate('search', () => {
          this.move(this.speed, 0);
        });

        this.onStateEnter('snif', () => {
          snifs++;
          this.play('snif');
          sniffing.play();

          k.wait(2, () => {
            sniffing.stop();
            this.enterState(snifs === 2 ? 'detect' : 'search');
          });
        });

        this.onStateEnter('detect', () => {
          barking.play();
          this.play('detect');

          k.wait(1, () => {
            barking.stop();
            this.enterState('jump');
          });
        });

        this.onStateEnter('jump', () => {
          barking.play();
          this.play('jump');

          k.wait(0.5, () => {
            barking.stop();
            this.use(k.z(0));
            this.enterState('drop');
          });
        });

        this.onStateUpdate('jump', () => {
          this.move(100, -50);
        });

        this.onStateEnter('drop', async () => {
          await tweenY(this, 125, 0.5);
          gameManager.enterState('round-start', true);
        });
      },

      /* -----------------------------
       * Anim helpers
       * --------------------------- */
      async slideUpAndDown(this: DogGameObj) {
        await tweenY(this, 90, 0.4);
        await k.wait(1);
        await tweenY(this, 125, 0.4);
      },

      async catchFallenDuck(this: DogGameObj) {
        this.play('catch');
        k.play('successful-hunt');
        await this.slideUpAndDown();
        gameManager.enterState('hunt-end');
      },

      async mockPlayer(this: DogGameObj) {
        laughing.play();
        this.play('mock');
        await this.slideUpAndDown();
        gameManager.enterState('hunt-end');
      },
    },
  ]);

  return dog as DogGameObj;
}

/* -------------------------------------------------------
 * Helpers
 * ----------------------------------------------------- */
function tweenY(obj: GameObj, y: number, time: number) {
  return k.tween(
    obj['pos'].y,
    y,
    time,
    (v: any) => (obj['pos'].y = v),
    k.easings.linear
  );
}
