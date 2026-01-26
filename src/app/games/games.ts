import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Gamepad2, Sparkles, Settings } from 'lucide-angular';

@Component({
  selector: 'app-games',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './games.html',
  styleUrl: './games.scss',
})
export class Games {
  readonly Icons = {
    pacman: LayoutDashboard,
    snake: Gamepad2,
    tetris: Sparkles,
    duck: Settings
  };
}