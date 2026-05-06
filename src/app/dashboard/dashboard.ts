import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { LucideAngularModule, Clock, Cloud, Calendar, CheckSquare, StickyNote, Music, Image as ImageIcon, Home } from 'lucide-angular';
import { RouterLink } from '@angular/router';

// Import all our widget components
import { AiWidgetComponent } from './components/ai-widget/ai-widget';
import { ClockComponent } from './components/clock/clock';
import { WeatherComponent } from './components/weather/weather';
import { CalendarComponent } from './components/calendar/calendar';
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
    NotesComponent,
    MusicPlayerComponent,
    ResizableImageWidgetComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  widgets: Record<string, boolean> = {
    clock: true,
    weather: false,
    calendar: false,
    notes: false,
    music: false,
    image: false,
  };

  // Store the exact drag positions of each widget
  positions: Record<string, {x: number, y: number}> = {};

  toolboxVisible = false;

  readonly Icons: Record<string, any> = {
    clock: Clock,
    weather: Cloud,
    calendar: Calendar,
    notes: StickyNote,
    music: Music,
    image: ImageIcon,
    home: Home
  };

  ngOnInit() {
    this.loadDashboardState();
  }

  loadDashboardState() {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    if (savedWidgets) {
      this.widgets = JSON.parse(savedWidgets);
    }

    const savedPositions = localStorage.getItem('dashboardPositions');
    if (savedPositions) {
      this.positions = JSON.parse(savedPositions);
    }
  }

  saveDashboardState() {
    localStorage.setItem('dashboardWidgets', JSON.stringify(this.widgets));
    localStorage.setItem('dashboardPositions', JSON.stringify(this.positions));
  }

  hideWidget(name: string) {
    this.widgets[name] = false;
    this.saveDashboardState();
  }

  showWidget(name: string) {
    this.widgets[name] = true;
    this.saveDashboardState();

    // Automatically hide the toolbox if there are no more widgets to show
    if (!this.hasHiddenWidgets) {
      this.toolboxVisible = false;
    }
  }

  onDragEnded(event: CdkDragEnd, widgetName: string) {
    this.positions[widgetName] = event.source.getFreeDragPosition();
    this.saveDashboardState();
  }

  // NEW CHECK: Returns true if at least one widget is currently hidden
  get hasHiddenWidgets(): boolean {
    return Object.values(this.widgets).some(isVisible => !isVisible);
  }

  // 🧭 Smart Toolbox Logic (Mouse Proximity)
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const threshold = window.innerWidth * 0.9;

    // Only open the sidebar IF mouse is on the right AND there are actually hidden widgets to show
    if (e.clientX > threshold && this.hasHiddenWidgets) {
      this.toolboxVisible = true;
    } else {
      this.toolboxVisible = false;
    }
  }
}
