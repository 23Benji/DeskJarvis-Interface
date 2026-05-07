import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Home, HelpCircle, ShieldCheck, Activity, Cpu } from 'lucide-angular';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
  readonly Icons = {
    HomeIcon: Home,
    HelpIcon: HelpCircle,
    Shield: ShieldCheck,
    Activity: Activity,
    Cpu: Cpu
  };

  use12HourFormat: boolean = true;

  ngOnInit() {
    const saved = localStorage.getItem('clockFormat');
    this.use12HourFormat = saved === null ? true : saved === '12';
  }

  get clockFormatText(): string {
    return this.use12HourFormat ? '12-HOUR (AM/PM)' : '24-HOUR MILITARY';
  }

  toggleClockFormat() {
    this.use12HourFormat = !this.use12HourFormat;
    localStorage.setItem('clockFormat', this.use12HourFormat ? '12' : '24');

    window.dispatchEvent(new CustomEvent('clockFormatChanged', {
      detail: { use12Hour: this.use12HourFormat }
    }));
  }
}
