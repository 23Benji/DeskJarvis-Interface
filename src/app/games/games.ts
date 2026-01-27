import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// 👇 Imported specific icons: Bird, Activity, PieChart
import { LucideAngularModule, LayoutDashboard, Bird, Activity, AlignHorizontalSpaceBetween, Home } from 'lucide-angular';

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

    pong: AlignHorizontalSpaceBetween,

    // 🏠 Back Button
    home: Home
  };
}
