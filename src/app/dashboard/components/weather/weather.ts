import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  city: string = '';
  time: string = '';

  ngOnInit() {
    this.updateTime();
    // Update time every minute
    setInterval(() => this.updateTime(), 60000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => this.handleGeoSuccess(pos),
        () => this.handleError()
      );
    } else {
      this.handleError();
    }
  }

  updateTime() {
    this.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async handleGeoSuccess(pos: any) {
    const { latitude, longitude } = pos.coords;
    try {
      // 1. Get City Name
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}`
      );
      const geoData = await geoRes.json();
      this.city = geoData?.results?.[0]?.name || '';

      // 2. Get Weather
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      this.weather = data.current_weather;
    } catch (err) {
      console.warn('Weather fetch failed:', err);
      this.error = true;
    }
  }

  handleError() {
    this.error = true;
  }

  get icon(): string {
    if (!this.weather) return '';
    const code = this.weather.weathercode;
    return code < 3 ? '☀️' : code < 60 ? '☁️' : '🌧️';
  }

  get description(): string {
    if (!this.weather) return '';
    const code = this.weather.weathercode;
    return code < 3 ? 'Sunny' : code < 60 ? 'Cloudy' : 'Rainy';
  }
}
