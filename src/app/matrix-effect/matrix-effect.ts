import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Home } from 'lucide-angular';

@Component({
  selector: 'app-matrix-effect',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './matrix-effect.html',
  styleUrl: './matrix-effect.scss'
})
export class MatrixEffectComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly HomeIcon = Home;
  private intervalId: any;
  private titleTimerId: any;

  // 👻 Ghost Text State
  showTitle = false;
  private readonly TITLE_TEXT = "DESKJARVIS";

  ngAfterViewInit() {
    this.startMatrix();

    // ⏱️ Every 10 seconds, toggle the "Ghost Text" mode
    this.titleTimerId = setInterval(() => {
      this.showTitle = !this.showTitle;
    }, 10000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.titleTimerId) clearInterval(this.titleTimerId);
  }

  startMatrix() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = '0101010101XYZABCDEF';
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    // Calculate center position for the text
    const textLength = this.TITLE_TEXT.length;
    const centerColStart = Math.floor((columns - textLength) / 2);
    const centerRow = Math.floor((canvas.height / fontSize) / 2);

    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      // 1. Fade out (Black with opacity)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        // Default: Random Matrix Character
        let text = letters.charAt(Math.floor(Math.random() * letters.length));
        let isTitlePixel = false;

        // 👻 MAGIC LOGIC: Check if we are passing through the hidden text
        if (this.showTitle) {
          // Are we in the correct columns (horizontal)?
          if (i >= centerColStart && i < centerColStart + textLength) {
             // Are we exactly on the center row (vertical)?
             if (Math.floor(drops[i]) === centerRow) {
                // Determine which letter of "DESK JARVIS" belongs here
                const letterIndex = i - centerColStart;
                text = this.TITLE_TEXT[letterIndex];
                isTitlePixel = true;
             }
          }
        }

        // 🎨 Coloring
        if (isTitlePixel) {
          ctx.fillStyle = '#FFFFFF'; // Bright White for the title
          ctx.shadowBlur = 10;       // Glow effect
          ctx.shadowColor = '#FFFFFF';
        } else {
          ctx.fillStyle = '#0F0';    // Standard Matrix Green
          ctx.shadowBlur = 0;
        }

        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop if it falls off screen (randomized)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    this.intervalId = setInterval(draw, 33);
  }
}
