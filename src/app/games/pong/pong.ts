import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { startPong } from './logic/main';
import k from './logic/kaplayCtx';
import { LoaderComponent } from '../../shared/loader';

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, LoaderComponent],
  template: `
    <app-loader *ngIf="isLoading"></app-loader>

    <div class="game-wrapper" *ngIf="!isLoading">
      <a href="/games" class="home-btn">
        <lucide-icon [img]="X" size="24"></lucide-icon>
      </a>
      <div id="pong-root" class="pong-game"></div>
    </div>
  `,
  styles: [`
    .game-wrapper {
      position: relative; width: 100vw; height: 100vh; background: #000; overflow: hidden;
    }
    .pong-game {
      width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;
    }
    .home-btn {
      position: fixed; top: 0; left: 0; z-index: 2000;
      width: 100px; height: 100px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 0 0 100% 0;
      display: flex; align-items: flex-start; justify-content: flex-start;
      padding-top: 20px; padding-left: 20px; box-sizing: border-box;
      color: rgba(255, 255, 255, 0.5); cursor: pointer;
      transition: all 0.3s ease; text-decoration: none;
      backdrop-filter: blur(5px);
    }
    .home-btn:hover {
      width: 110px; height: 110px;
      background: rgba(0, 255, 255, 0.15); color: #00ffff8b;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
    }
    .home-btn lucide-icon { transition: transform 0.3s ease; }
    .home-btn:hover lucide-icon { transform: scale(1.2); }
  `]
})
export class Pong implements AfterViewInit, OnDestroy {
  readonly X = X;
  isLoading = true;
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoading = false;
      setTimeout(() => startPong('pong-root'), 50);
    }, 3000);
  }

  ngOnDestroy() {
    try { if (k && k.quit) k.quit(); } catch(e) {}
  }
}