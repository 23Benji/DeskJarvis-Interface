import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule, Upload } from 'lucide-angular';

@Component({
  selector: 'app-resizable-image-widget',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './resizable-image-widget.html',
  styleUrl: './resizable-image-widget.scss'
})
export class ResizableImageWidgetComponent {
  width = 250;
  height = 250;
  isResizing = false;

  // Upload State
  uploadedFileUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  fileType: 'image' | 'pdf' | null = null;
  readonly UploadIcon = Upload;

  private startX = 0;
  private startWidth = 0;
  private aspectRatio = 1;

  private sanitizer = inject(DomSanitizer);

  // --- UPLOAD LOGIC ---
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (this.uploadedFileUrl) {
      URL.revokeObjectURL(this.uploadedFileUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    this.uploadedFileUrl = objectUrl;

    if (file.type === 'application/pdf') {
      this.fileType = 'pdf';
      // THE FIX: Added view=FitH to force the PDF to fit edge-to-edge horizontally!
      this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl + '#toolbar=0&navpanes=0&view=FitH');

      // Standardize PDF ratio to roughly A4 size (1 : 1.414)
      this.aspectRatio = 1 / 1.414;
      this.height = this.width / this.aspectRatio;
    } else if (file.type.startsWith('image/')) {
      this.fileType = 'image';
    }
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.naturalWidth && img.naturalHeight) {
      this.aspectRatio = img.naturalWidth / img.naturalHeight;
      this.height = this.width / this.aspectRatio;
    }
  }

  // --- RESIZE LOGIC ---
  startResize(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;

    this.startX = event.clientX;
    this.startWidth = this.width;

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.isResizing) return;

    const dx = event.clientX - this.startX;
    let newWidth = this.startWidth + dx;

    // Prevent it from getting impossibly small
    if (newWidth < 100) {
      newWidth = 100;
    }

    // STRICT LOCK: Force height to obey the exact aspect ratio
    this.width = newWidth;
    this.height = newWidth / this.aspectRatio;
  };

  onMouseUp = () => {
    if (this.isResizing) {
      this.isResizing = false;
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
    }
  };
}
