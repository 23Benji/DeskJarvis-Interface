import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// 👇 Imported specific icons: Bird, Activity, PieChart
import { LucideAngularModule, LayoutDashboard, Bird, Activity, PieChart, Home } from 'lucide-angular';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './games.html',
  styleUrl: './games.scss'
})
export class Games {
  readonly Icons = {
    // 🦆 Duck Hunt -> Bird
    duck: Bird,

    // 🧱 Tetris -> LayoutDashboard (Blocks)
    tetris: LayoutDashboard,

    // 🐍 Snake -> Activity (Squiggly line)
    snake: Activity,

    // ᗧ••• Pac-Man -> PieChart (Looks just like him!)
    pacman: PieChart,

    // 🏠 Back Button
    home: Home
  };
}
