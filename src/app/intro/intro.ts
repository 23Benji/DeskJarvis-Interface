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
  welcomeText = "";       // 🆕 Holds the text as it types
  logoVisible = false;    // Controls Logo fade-in
  isFadingOut = false;    // Controls exit fade

  private readonly FULL_MSG = "Welcome to";

  ngAfterViewInit() {
    this.startMatrix();
    this.runSequence();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  // 🧠 The Director
  runSequence() {
    // 1. 🛑 WAIT 5 SECONDS (Just let the Matrix rain fall)
    setTimeout(() => {

      // 2. ⌨️ Start Typing "Welcome to"
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        this.welcomeText += this.FULL_MSG.charAt(charIndex);
        charIndex++;

        // Stop when finished typing
        if (charIndex >= this.FULL_MSG.length) {
          clearInterval(typeInterval);

          // 3. Wait a split second, then fade in the Logo
          setTimeout(() => {
            this.logoVisible = true;

            // 4. Hold for 2.5 seconds so user can see it all
            setTimeout(() => {
              this.isFadingOut = true; // Trigger exit

              // 5. Navigate away after fade (1.5s)
              // ... inside runSequence() ...
              setTimeout(() => {
                sessionStorage.setItem('introShown', 'true');

                // 👇 CHECK: If tutorial already seen (e.g. from Settings), go Home.
                // Otherwise, go to Tutorial.
                if (sessionStorage.getItem('tutorialShown')) {
                  this.router.navigate(['/home']);
                } else {
                  this.router.navigate(['/tutorial']);
                }

              }, 1500);

            }, 2500);

          }, 500);
        }
      }, 150); // ⚡ Typing Speed (150ms per letter)

    }, 3000); // 👈 The 5 Second Delay
  }

  startMatrix() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = '010101XYZABCDEF';
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops: number[] = [];
    for (let x = 0; x < columns; x++) { drops[x] = 1; }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
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
