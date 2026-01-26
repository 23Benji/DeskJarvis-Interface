import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { startDuckHunter } from './logic/main'; // path to your main.ts wrapper

@Component({
  selector: 'app-duck',
  template: `<div id="duck-hunt-root" class="duck-hunt-game"></div>`,
  styles: [`
    .duck-hunt-game {
      width: 100%;
      height: 100vh;
      background: black;
    }
  `]
})
export class Duck implements AfterViewInit, OnDestroy {

  private gameInstance: any;

  ngAfterViewInit() {
    this.gameInstance = startDuckHunter('duck-hunt-root');
  }

  ngOnDestroy() {
    if (this.gameInstance?.destroy) {
      this.gameInstance.destroy();
    }
  }
}
