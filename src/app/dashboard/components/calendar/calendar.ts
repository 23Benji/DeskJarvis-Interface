import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DayInfo {
  date: number;
  dayName: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();

  pastDays: DayInfo[] = [];
  futureDays: DayInfo[] = [];

  currentDay: number = 0;
  currentDayName: string = '';
  currentMonthYear: string = '';

  ngOnInit() {
    this.generateTimeline();
  }

  generateTimeline() {
    // Current date central details
    this.currentDay = this.currentDate.getDate();
    this.currentDayName = this.currentDate.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
    this.currentMonthYear = this.currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

    // Generate the 7 previous days
    for (let i = 7; i > 0; i--) {
      const d = new Date(this.currentDate);
      d.setDate(d.getDate() - i);
      this.pastDays.push({
        date: d.getDate(),
        // Get the first 2 letters of the day (e.g., "MO", "TU", "WE")
        dayName: d.toLocaleString('en-US', { weekday: 'short' }).substring(0, 2).toUpperCase()
      });
    }

    // Generate the 7 upcoming days
    for (let i = 1; i <= 7; i++) {
      const d = new Date(this.currentDate);
      d.setDate(d.getDate() + i);
      this.futureDays.push({
        date: d.getDate(),
        dayName: d.toLocaleString('en-US', { weekday: 'short' }).substring(0, 2).toUpperCase()
      });
    }
  }
}
