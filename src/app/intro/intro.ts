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

  // 🎬 Animation Stages
  lettersRevealed = 0;   // How many letters of "DESK JARVIS" are shown
  isZooming = false;     // Trigger for the CSS Zoom

  private readonly TITLE_TEXT = "DESK JARVIS";

  ngAfterViewInit() {
    this.startMatrix();
    this.runSequence();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  // 🧠 The Director: Controls the timing of the show
  runSequence() {
    // 1. Let it rain normally for 2 seconds
    setTimeout(() => {

      // 2. Typewriter Effect (Reveal 1 letter every 200ms)
      let typeInterval = setInterval(() => {
        this.lettersRevealed++;
        if (this.lettersRevealed >= this.TITLE_TEXT.length) {
          clearInterval(typeInterval);

          // 3. Wait 1 second after typing finishes, then ZOOM
          setTimeout(() => {
            this.isZooming = true; // Triggers CSS class

            // 4. Wait for zoom to finish (1.5s), then navigate
            setTimeout(() => {
              sessionStorage.setItem('introShown', 'true');
              this.router.navigate(['/home']);
            }, 1500);

          }, 1000);
        }
      }, 200); // Speed of typing

    }, 2000); // Initial delay
  }

  startMatrix() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = '010101XYZABCDEF';
    const fontSize = 20; // Slightly bigger font for intro
    const columns = canvas.width / fontSize;

    // Center Logic
    const textLength = this.TITLE_TEXT.length;
    const centerColStart = Math.floor((columns - textLength) / 2);
    const centerRow = Math.floor((canvas.height / fontSize) / 2);

    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      // Fade out trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        let text = letters.charAt(Math.floor(Math.random() * letters.length));
        let isTitlePixel = false;

        // 👻 Logic: If this column belongs to the title...
        if (i >= centerColStart && i < centerColStart + textLength) {
           const letterIndex = i - centerColStart;

           // ... AND we are allowed to show this letter yet ...
           if (letterIndex < this.lettersRevealed) {
             // ... AND the drop is passing the center row
             if (Math.floor(drops[i]) === centerRow) {
                text = this.TITLE_TEXT[letterIndex];
                isTitlePixel = true;
             }
           }
        }

        // Color Logic
        if (isTitlePixel) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#00FFFF'; // Cyan Glow
        } else {
          ctx.fillStyle = '#0F0';
          ctx.shadowBlur = 0;
        }

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
