import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Home, HelpCircle } from 'lucide-angular';

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
    HelpIcon: HelpCircle
  };

  // State to track the current format
  use12HourFormat: boolean = true;

  ngOnInit() {
    // Load the preference when settings page is opened
    const saved = localStorage.getItem('clockFormat');
    this.use12HourFormat = saved === null ? true : saved === '12';
  }

  // Getter for the button text
  get clockFormatText(): string {
    return this.use12HourFormat ? '12-Hour (AM/PM)' : '24-Hour';
  }

  // Toggles the format, saves to local storage, and dispatches the event
  toggleClockFormat() {
    this.use12HourFormat = !this.use12HourFormat;
    localStorage.setItem('clockFormat', this.use12HourFormat ? '12' : '24');

    // Notify the clock widget (which is listening for this exact event)
    window.dispatchEvent(new CustomEvent('clockFormatChanged', {
      detail: { use12Hour: this.use12HourFormat }
    }));
  }
}
