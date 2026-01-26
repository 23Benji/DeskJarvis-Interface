import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resizable-image-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resizable-image-widget.html',
  styleUrl: './resizable-image-widget.scss'
})
export class ResizableImageWidgetComponent {
  width = 250;
  height = 250;
  isResizing = false;

  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;

  // When user clicks the resize grip
  startResize(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation(); // Stop drag from interfering
    this.isResizing = true;

    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.width;
    this.startHeight = this.height;

    // Attach listeners to window so dragging works even if mouse leaves the widget
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  // Using an arrow function to preserve 'this' context
  onMouseMove = (event: MouseEvent) => {
    if (!this.isResizing) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    this.width = Math.max(100, this.startWidth + dx);
    this.height = Math.max(100, this.startHeight + dy);
  }

  onMouseUp = () => {
    this.isResizing = false;
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }
}
