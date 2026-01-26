import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Menu } from 'lucide-angular';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './clock.html',
  styleUrl: './clock.scss'
})
export class ClockComponent implements OnInit, OnDestroy {
  // Logic State
  activeTab: string = 'clock';
  menuOpen: boolean = false;
  time: Date = new Date();

  // Timer/Stopwatch State
  stopwatch: number = 0;
  timer: number = 60;
  pomodoro: number = 25 * 60;
  running: boolean = false;

  // Intervals
  private clockInterval: any;
  private activeInterval: any;

  // Icons for template
  readonly MenuIcon = Menu;

  ngOnInit() {
    // Start the main clock tick immediately
    this.clockInterval = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    // Cleanup intervals when widget is removed
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clearActiveInterval();
  }

  // -- Helper to format seconds to MM:SS --
  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // -- Switching Tabs --
  switchTab(tab: string) {
    this.running = false;
    this.activeTab = tab;
    this.menuOpen = false;
    this.clearActiveInterval();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // -- Start/Pause Logic --
  toggleRunning() {
    this.running = !this.running;
    if (this.running) {
      this.startActiveTimer();
    } else {
      this.clearActiveInterval();
    }
  }

  private clearActiveInterval() {
    if (this.activeInterval) clearInterval(this.activeInterval);
  }

  private startActiveTimer() {
    this.clearActiveInterval(); // ensure no duplicates

    this.activeInterval = setInterval(() => {
      if (this.activeTab === 'stopwatch') {
        this.stopwatch++;
      } else if (this.activeTab === 'timer') {
        if (this.timer > 0) this.timer--;
        else this.toggleRunning(); // Stop if 0
      } else if (this.activeTab === 'pomodoro') {
        if (this.pomodoro > 0) this.pomodoro--;
        else this.toggleRunning();
      }
    }, 1000);
  }

  // -- Reset Handlers --
  resetStopwatch() { this.stopwatch = 0; }
  setTimer(val: number) { this.timer = val; } // For the quick buttons
  resetTimer() { this.timer = 60; }
  resetPomodoro() { this.pomodoro = 25 * 60; }
}
