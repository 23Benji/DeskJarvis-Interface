import k from '../kaplayCtx';
import gameManager from '../gameManager';
import { COLORS } from '../constant';
import type { Vec2 } from 'kaplay';
// You can remove the import for DuckGameObj if you don't have the types file,
// otherwise keep it. We use 'any' casting below to be safe.
import type { DuckGameObj } from './types'; 

export default function makeDuck(duckId: string, speed: number): DuckGameObj {
  const startingPos = [
    k.vec2(80, k.center().y + 40),
    k.vec2(k.center().x, k.center().y + 40),
    k.vec2(200, k.center().y + 40),
  ];

  const flyDirections: Vec2[] = [
    k.vec2(-1, -1),
    k.vec2(1, -1),
    k.vec2(1, -1),
  ];

  const chosenPosIndex = k.randi(startingPos.length);
  const chosenFlyDirectionIndex = k.randi(flyDirections.length);

  return k.add([
    k.sprite('duck', { anim: 'flight-side' }),
    k.area({ shape: new k.Rect(k.vec2(0), 24, 24) }),
    k.body(),
    k.anchor('center'),
    k.pos(startingPos[chosenPosIndex]),
    k.state('fly', ['fly', 'shot', 'fall']),
    k.timer(),
    k.offscreen({ destroy: true, distance: 100 }),

    {
      flyTimer: 0,
      timeBeforeEscape: 5,
      duckId,
      speed,

      flyDirection: k.vec2(0, 0),
      quackingSound: null,
      flappingSound: null,
      fallSound: null,

      setBehavior(this: DuckGameObj) {
        // Cast to 'any' to avoid TS errors
        const sky = k.get('sky')[0] as any;

        this.flyDirection = flyDirections[chosenFlyDirectionIndex];

        if (this.flyDirection.x < 0) this.flipX = true;

        this.quackingSound = k.play('quacking', { volume: 0.5, loop: true });
        this.flappingSound = k.play('flapping', { loop: true, speed: 2 });

        this.onStateUpdate('fly', () => {
          if (
            this.flyTimer < this.timeBeforeEscape &&
            (this.pos.x > k.width() + 10 || this.pos.x < -10)
          ) {
            this.flyDirection.x *= -1;
            this.flipX = !this.flipX;
            this.play(
              this.getCurAnim().name === 'flight-side'
                ? 'flight-diagonal'
                : 'flight-side'
            );
          }

          if (this.pos.y < -10 || this.pos.y > k.height() - 70) {
            this.flyDirection.y *= -1;
            this.play(
              this.getCurAnim().name === 'flight-side'
                ? 'flight-diagonal'
                : 'flight-side'
            );
          }

          this.move(k.vec2(this.flyDirection).scale(this.speed));
        });

        this.onStateEnter('shot', async () => {
          gameManager.nbDucksShotInRound++;
          this.play('shot');
          this.quackingSound?.stop();
          this.flappingSound?.stop();
          await k.wait(0.2);
          this.enterState('fall');
        });

        this.onStateEnter('fall', () => {
          this.fallSound = k.play('fall', { volume: 0.7 });
          this.play('fall');
        });

        this.onStateUpdate('fall', async () => {
          this.move(0, this.speed);

          if (this.pos.y > k.height() - 70) {
            this.fallSound?.stop();
            k.play('impact');
            k.destroy(this);

            // 👇 FIXED: Use k.color() instead of k.Color.fromHex()
            if (sky) sky.color = k.color(COLORS.BLUE);

            const duckIcon = k.get(`duckIcon-${this.duckId}`, {
              recursive: true,
            })[0] as any;

            // 👇 FIXED: Use k.color() instead of k.Color.fromHex()
            if (duckIcon) duckIcon.color = k.color(COLORS.RED);

            await k.wait(1);
            gameManager.enterState('duck-hunted');
          }
        });

        this.onClick(() => {
          if (gameManager.nbBulletsLeft < 0) return;
          gameManager.currentScore += 100;
          this.enterState('shot');
        });

        this.loop(1, () => {
          this.flyTimer++;
          if (this.flyTimer === this.timeBeforeEscape) {
            // 👇 FIXED: Use k.color()
            if (sky) sky.color = k.color(COLORS.BEIGE);
          }
        });

        this.onExitScreen(() => {
          this.quackingSound?.stop();
          this.flappingSound?.stop();
          
          // 👇 FIXED: Use k.color()
          if (sky) sky.color = k.color(COLORS.BLUE);
          
          gameManager.nbBulletsLeft = 3;
          gameManager.enterState('duck-escaped');
        });
      },
    },
  ]) as DuckGameObj;
}