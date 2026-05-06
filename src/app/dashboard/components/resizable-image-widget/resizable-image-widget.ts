import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resizable-image-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resizable-image-widget.html',
  styleUrl: './resizable-image-widget.scss'
})
export class ResizableImageWidgetComponent implements AfterViewInit {
  width = 250;
  height = 250;
  isResizing = false;

  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private aspectRatio = 1;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const img = this.el.nativeElement.querySelector('img');

    if (img) {
      if (img.complete && img.naturalWidth) {
        this.setNativeRatio(img);
      } else {
        img.onload = () => this.setNativeRatio(img);
      }
    }
  }

  private setNativeRatio(img: HTMLImageElement) {
    if (img.naturalWidth && img.naturalHeight) {
      this.aspectRatio = img.naturalWidth / img.naturalHeight;
      this.height = this.width / this.aspectRatio;
    }
  }

  startResize(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;

    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.width;
    this.startHeight = this.height;

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.isResizing) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    // Project the mouse movement onto the image's diagonal for perfectly smooth scaling
    const startDiag = Math.sqrt(this.startWidth * this.startWidth + this.startHeight * this.startHeight);

    // Calculate the direction vectors
    const ux = this.startWidth / startDiag;
    const uy = this.startHeight / startDiag;

    // Determine how far the mouse has moved along that diagonal line
    const projectedDelta = (dx * ux) + (dy * uy);
    const newDiag = startDiag + projectedDelta;

    // Convert the new diagonal length back into width and height
    let newWidth = newDiag * ux;
    let newHeight = newDiag * uy;

    // 🛑 THE FIX: Lowered the minimum limit to 40px so you can shrink it way down!
    if (newWidth < 40) {
      newWidth = 40;
      newHeight = 40 / this.aspectRatio;
    }

    this.width = newWidth;
    this.height = newHeight;
  };

  onMouseUp = () => {
    if (this.isResizing) {
      this.isResizing = false;
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
    }
  };
}
