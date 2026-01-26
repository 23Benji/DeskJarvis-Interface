import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.html',
  styleUrl: './intro.scss'
})
export class IntroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private router = inject(Router);

  private intervalId: any;

  // 🎬 Animation States
  logoVisible = false;   // Controls the logo fade-in
  isZooming = false;     // Controls the final zoom

  ngAfterViewInit() {
    this.startMatrix();
    this.runSequence();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  // 🧠 The Director
  runSequence() {
    // 1. Let it rain normally for 1.5 seconds
    setTimeout(() => {

      // 2. Show the Logo
      this.logoVisible = true;

      // 3. Wait 2 seconds for user to see the logo, then ZOOM
      setTimeout(() => {
        this.isZooming = true;

        // 4. Wait for zoom animation (1.5s), then navigate
        setTimeout(() => {
          sessionStorage.setItem('introShown', 'true');
          this.router.navigate(['/home']);
        }, 1500);

      }, 2000);

    }, 1500);
  }

  startMatrix() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = '010101XYZABCDEF';
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      // Fade out trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; // Matrix Green
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    this.intervalId = setInterval(draw, 33);
  }
}
