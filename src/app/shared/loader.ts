import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="loader-overlay">
      <div class="loader-container">
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
        <span class="text">INITIALIZING...</span>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #000;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loader-container {
      position: relative;
      width: 200px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ring {
      position: absolute;
      border: 2px solid transparent;
      border-radius: 50%;
      border-top: 2px solid #00ffff; /* Cyan */
      animation: spin 2s linear infinite;
    }

    .ring:nth-child(1) { width: 150px; height: 150px; animation-duration: 2s; }
    .ring:nth-child(2) { width: 120px; height: 120px; border-top-color: #ff00ff; animation-direction: reverse; animation-duration: 2s; }
    .ring:nth-child(3) { width: 90px; height: 90px; border-top-color: #ffffff; animation-duration: 1s; }

    .text {
      color: #00ffff;
      font-family: 'Orbitron', sans-serif;
      letter-spacing: 2px;
      animation: pulse 1s ease-in-out infinite;
      font-size: 0.9rem;
      margin-top: 200px; /* Push text below rings */
      position: absolute;
    }

    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
  `]
})
export class LoaderComponent {}