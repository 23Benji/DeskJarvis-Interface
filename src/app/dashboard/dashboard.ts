import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
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

  positions: Record<string, { x: number, y: number }> = {};

  toolboxVisible = false;
  isTrashHovered = false; // 👈 NEW: Tracks if we are dragging over the drop zone

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

    if (!this.hasHiddenWidgets) {
      this.toolboxVisible = false;
    }
  }

  // 👈 NEW: Tracks drag movement in real time
  onDragMoved(event: CdkDragMove) {
    const trashThreshold = window.innerWidth - 130; // 130px from the right edge
    this.isTrashHovered = event.pointerPosition.x >= trashThreshold;

    if (this.isTrashHovered) {
      this.toolboxVisible = true; // Force toolbox open to show drop zone
    }
  }

  // 👈 UPDATED: Handles dropping the widget
  onDragEnded(event: CdkDragEnd, widgetName: string) {
    if (this.isTrashHovered) {
      // 1. Dragged into the drop zone: Hide it
      this.widgets[widgetName] = false;
      // 2. Reset offset so it respawns in its original central spot next time
      this.positions[widgetName] = { x: 0, y: 0 };
    } else {
      // Normal drag: Save position
      this.positions[widgetName] = event.source.getFreeDragPosition();
    }

    this.isTrashHovered = false; // Reset hover state
    this.saveDashboardState();

    if (!this.hasHiddenWidgets) {
      this.toolboxVisible = false;
    }
  }

  get hasHiddenWidgets(): boolean {
    return Object.values(this.widgets).some(isVisible => !isVisible);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.isTrashHovered) return; // Don't interfere if we are dragging to trash

    const threshold = window.innerWidth * 0.9;
    if (e.clientX > threshold && this.hasHiddenWidgets) {
      this.toolboxVisible = true;
    } else {
      this.toolboxVisible = false;
    }
  }
}
