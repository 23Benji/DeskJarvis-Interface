import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// 👇 Added specific icons for gestures
import { LucideAngularModule, MousePointer2, Hand, Grab, ChevronsUpDown, CheckCircle2, ScanFace } from 'lucide-angular';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './tutorial.html',
  styleUrl: './tutorial.scss'
})
export class TutorialComponent {
  readonly Icons = {
    move: MousePointer2,
    click: ScanFace, // Represents "Pinch" focus
    drag: Grab,
    scroll: ChevronsUpDown,
    finish: CheckCircle2
  };

  constructor(private router: Router) {}

  finishTutorial() {
    sessionStorage.setItem('tutorialShown', 'true');
    this.router.navigate(['/home']);
  }
}
