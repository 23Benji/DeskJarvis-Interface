import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class CalendarComponent implements OnInit {
  calendarGrid: any[][] = [];
  monthInfo: string = '';
  currentDay: number = new Date().getDate();

  ngOnInit() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
    const firstDay = new Date(year, now.getMonth(), 1).getDay();

    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const grid: any[] = [];
    let week: any[] = new Array(firstDay).fill(null);

    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d);
      if (week.length === 7 || d === daysInMonth) {
        grid.push(week);
        week = [];
      }
    }

    this.monthInfo = `${month.toUpperCase()} ${year}`;
    this.calendarGrid = [days, ...grid];
  }
}
