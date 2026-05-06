import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
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

  // Clock format preference
  use12HourFormat: boolean = true;

  // Intervals
  private clockInterval: any;
  private activeInterval: any;

  // Icons for template
  readonly MenuIcon = Menu;

  ngOnInit() {
    // Load clock format preference
    this.loadClockFormatPreference();

    // Start the main clock tick immediately
    this.clockInterval = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Listen for format changes from settings
    window.addEventListener('clockFormatChanged', this.handleFormatChange);
  }

  ngOnDestroy() {
    // Cleanup intervals when widget is removed
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clearActiveInterval();

    // Remove event listener
    window.removeEventListener('clockFormatChanged', this.handleFormatChange);
  }

  // Load clock format from localStorage
  private loadClockFormatPreference() {
    const saved = localStorage.getItem('clockFormat');
    this.use12HourFormat = saved === null ? true : saved === '12';
  }

  // Handle format change events
  private handleFormatChange = (event: any) => {
    this.use12HourFormat = event.detail.use12Hour;
  };

  // Format time based on user preference
  get formattedTime(): string {
    const hours = this.time.getHours();
    const minutes = this.time.getMinutes().toString().padStart(2, '0');
    const seconds = this.time.getSeconds().toString().padStart(2, '0');

    if (this.use12HourFormat) {
      // 12-hour format with AM/PM
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
      return `${displayHours}:${minutes}:${seconds} ${period}`;
    } else {
      // 24-hour format
      const displayHours = hours.toString().padStart(2, '0');
      return `${displayHours}:${minutes}:${seconds}`;
    }
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

  // Stop propagation here so the document click listener doesn't immediately close it
  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  // Listens for clicks anywhere on the page to close the menu
  @HostListener('document:click')
  closeMenu() {
    this.menuOpen = false;
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
