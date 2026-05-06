import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.html',
  styleUrl: './weather.scss'
})
export class WeatherComponent implements OnInit {
  weather: any = null;
  error: boolean = false;
  city: string = 'Bolzano';
  time: string = '';

  private readonly LAT = 46.4983;
  private readonly LON = 11.3548;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);
    this.fetchWeather();
  }

  updateTime() {
    this.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  fetchWeather() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.LAT}&longitude=${this.LON}&current_weather=true&temperature_unit=celsius`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.weather = data.current_weather;
      },
      error: (err) => {
        console.warn('Weather fetch failed:', err);
        this.error = true;
      }
    });
  }

  get icon(): string {
    if (!this.weather) return '';
    const code = this.weather.weathercode;
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '🌨️';
    if (code >= 80) return '⛈️';
    return '☁️';
  }

  get description(): string {
    if (!this.weather) return '';
    const code = this.weather.weathercode;
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly cloudy';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80) return 'Stormy';
    return 'Cloudy';
  }
}
