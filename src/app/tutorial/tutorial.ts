import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, MousePointer2, ScanFace, Grab, CheckCircle2, PanelRight, Hand } from 'lucide-angular';

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
    click: ScanFace,
    drag: Grab, // Using Grab for Drag
    enter: Hand, // Using Hand (or Grab) to represent the Fist/Interaction
    finish: CheckCircle2,
    toolbox: PanelRight
  };

  constructor(private router: Router) {}

  finishTutorial() {
    sessionStorage.setItem('tutorialShown', 'true');
    this.router.navigate(['/home']);
  }
}
