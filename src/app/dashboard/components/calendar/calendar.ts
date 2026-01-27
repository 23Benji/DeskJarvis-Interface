import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss' // Make sure this matches your file (.css or .scss)
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  calendarGrid: (string | number | null)[][] = [];
  monthInfo = '';
  currentDay: number = 0;

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // 🟢 FIX: Force 'en-US' to ensure "January" instead of "Gennaio"
    this.monthInfo = this.currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    this.currentDay = this.currentDate.getDate();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let weeks: (string | number | null)[][] = [];
    let week: (string | number | null)[] = [];

    // Add headers (English)
    const headers = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    weeks.push(headers);

    // Add empty slots for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(null);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // Fill remaining slots in the last week
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    this.calendarGrid = weeks;
  }
}
