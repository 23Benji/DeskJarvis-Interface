import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { startTetris } from './logic/main';

@Component({
  selector: 'app-tetris',
  template: `<div id="tetris-root" class="tetris-game"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      overflow: hidden; /* Prevent scrolling */
      background: #000;
    }
    .tetris-game {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class Tetris implements AfterViewInit, OnDestroy {
  private gameInstance: any;

  ngAfterViewInit() {
    this.gameInstance = startTetris('tetris-root');
  }

  ngOnDestroy() {
    // Cleanup handled by Kaplay internally mostly,
    // but ensures the component destroys cleanly.
  }
}