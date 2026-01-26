import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop'; // 👈 Import for Dragging
import { LucideAngularModule, Clock, Cloud, Calendar, CheckSquare, StickyNote, Music, Image as ImageIcon,Home } from 'lucide-angular';
import { RouterLink } from '@angular/router';

// Import all our widget components
import { AiWidgetComponent } from './components/ai-widget/ai-widget';
import { ClockComponent } from './components/clock/clock';
import { WeatherComponent } from './components/weather/weather';
import { CalendarComponent } from './components/calendar/calendar';
import { ToDoComponent } from './components/to-do/to-do';
import { NotesComponent } from './components/notes/notes';
import { MusicPlayerComponent } from './components/music-player/music-player';
import { ResizableImageWidgetComponent } from './components/resizable-image-widget/resizable-image-widget';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    DragDropModule,
    LucideAngularModule,
    AiWidgetComponent,
    ClockComponent,
    WeatherComponent,
    CalendarComponent,
    ToDoComponent,
    NotesComponent,
    MusicPlayerComponent,
    ResizableImageWidgetComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  // 1. Add 'Record<string, boolean>' type here 👇
  widgets: Record<string, boolean> = {
    clock: true,
    weather: false,
    calendar: false,
    todo: false,
    notes: false,
    music: false,
    image: false,
  };

  toolboxVisible = false;

  // 2. Add 'Record<string, any>' type here 👇
  readonly Icons: Record<string, any> = {
    clock: Clock,
    weather: Cloud,
    calendar: Calendar,
    todo: CheckSquare,
    notes: StickyNote,
    music: Music,
    image: ImageIcon,
    home: Home // 👈 Added for the button
  };

  // Toggle Widget Visibility
  hideWidget(name: string) {
    this.widgets[name] = false;
  }

  showWidget(name: string) {
    this.widgets[name] = true;
  }

  // 🧭 Smart Toolbox Logic (Mouse Proximity)
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const threshold = window.innerWidth * 0.1; // 10% from right edge
    if (window.innerWidth - e.clientX <= threshold) {
      this.toolboxVisible = true;
    } else {
      this.toolboxVisible = false;
    }
  }

  // Helper for *ngFor in template to iterate over hidden widgets
  get hiddenWidgets() {
    return Object.keys(this.widgets).filter(key => !this.widgets[key]);
  }
}
