import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 👈 Needed for navigation
import { LucideAngularModule, LayoutDashboard, Gamepad2, Sparkles, Settings } from 'lucide-angular';

@Component({
  selector: 'app-homescreen',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './homescreen.html',
  styleUrl: './homescreen.scss'
})
export class HomescreenComponent {
  readonly Icons = {
    dashboard: LayoutDashboard,
    games: Gamepad2,
    matrix: Sparkles,
    settings: Settings
  };
}
