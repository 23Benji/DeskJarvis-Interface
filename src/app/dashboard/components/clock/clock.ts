import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Clock as ClockIcon,
  Timer as StopwatchIcon,
  Hourglass,
  Target,
  Play,
  Pause,
  RotateCcw,
  BellOff
} from 'lucide-angular';

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
  time: Date = new Date();

  // Timer/Stopwatch State
  stopwatch: number = 0;
  timer: number = 60;
  pomodoro: number = 25 * 60;
  running: boolean = false;

  // Alarm State
  isAlarmRinging: boolean = false;
  private alarmAudio = new Audio('assets/sounds/ui-appear.wav');

  // Clock format preference
  use12HourFormat: boolean = true;

  // Intervals
  private clockInterval: any;
  private activeInterval: any;

  // Export Icons for Template (Aliased to avoid naming conflicts)
  readonly Icons = {
    Clock: ClockIcon,
    Stopwatch: StopwatchIcon,
    Timer: Hourglass,
    Pomodoro: Target,
    Play,
    Pause,
    Reset: RotateCcw,
    StopAlarm: BellOff
  };

  ngOnInit() {
    this.alarmAudio.loop = true;
    this.loadClockFormatPreference();
    this.clockInterval = setInterval(() => {
      this.time = new Date();
    }, 1000);
    window.addEventListener('clockFormatChanged', this.handleFormatChange);
  }

  ngOnDestroy() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clearActiveInterval();
    this.stopAlarm();
    window.removeEventListener('clockFormatChanged', this.handleFormatChange);
  }

  private loadClockFormatPreference() {
    const saved = localStorage.getItem('clockFormat');
    this.use12HourFormat = saved === null ? true : saved === '12';
  }

  private handleFormatChange = (event: any) => {
    this.use12HourFormat = event.detail.use12Hour;
  };

  get formattedTime(): string {
    const hours = this.time.getHours();
    const minutes = this.time.getMinutes().toString().padStart(2, '0');

    if (this.use12HourFormat) {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${period}`;
    } else {
      const displayHours = hours.toString().padStart(2, '0');
      return `${displayHours}:${minutes}`;
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  switchTab(tab: string) {
    this.running = false;
    this.activeTab = tab;
    this.clearActiveInterval();
    this.stopAlarm();
  }

  private triggerAlarm() {
    this.isAlarmRinging = true;
    this.running = false;
    this.clearActiveInterval();
    this.alarmAudio.play().catch(e => console.log('Audio play failed', e));
  }

  stopAlarm() {
    this.isAlarmRinging = false;
    this.alarmAudio.pause();
    this.alarmAudio.currentTime = 0;
  }

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
    this.clearActiveInterval();
    this.activeInterval = setInterval(() => {
      if (this.activeTab === 'stopwatch') {
        this.stopwatch++;
      } else if (this.activeTab === 'timer') {
        if (this.timer > 0) this.timer--;
        else this.triggerAlarm();
      } else if (this.activeTab === 'pomodoro') {
        if (this.pomodoro > 0) this.pomodoro--;
        else this.triggerAlarm();
      }
    }, 1000);
  }

  resetStopwatch() {
    this.stopwatch = 0;
    this.running = false;
    this.clearActiveInterval();
  }

  setTimer(val: number) {
    this.timer = val;
    this.running = false;
    this.clearActiveInterval();
    this.stopAlarm();
  }

  resetTimer() {
    this.timer = 60;
    this.running = false;
    this.clearActiveInterval();
    this.stopAlarm();
  }

  resetPomodoro() {
    this.pomodoro = 25 * 60;
    this.running = false;
    this.clearActiveInterval();
    this.stopAlarm();
  }
}
