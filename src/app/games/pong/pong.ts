import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
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
      <a href="/games" class="back-btn">
        <lucide-icon [img]="ArrowLeft" size="24"></lucide-icon>
        <span>EXIT</span>
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
    .back-btn {
      position: absolute; top: 20px; left: 20px; z-index: 1000;
      display: flex; align-items: center; gap: 10px;
      background: rgba(0, 0, 0, 0.4); color: rgba(255, 255, 255, 0.6);
      padding: 10px 20px; border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1);
      text-decoration: none; font-family: 'Orbitron', sans-serif; font-size: 0.9rem;
      cursor: pointer; transition: all 0.3s ease;
    }
    .back-btn:hover {
      background: rgba(0, 255, 255, 0.1); color: #00ffff; border-color: #00ffff;
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.3); transform: translateY(2px);
    }
  `]
})
export class Pong implements AfterViewInit, OnDestroy {
  readonly ArrowLeft = ArrowLeft;
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