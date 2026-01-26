import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notes.html',
  styleUrl: './notes.scss'
})
export class NotesComponent implements OnInit {
  private http = inject(HttpClient);
  notes: any[] = [];

  ngOnInit() {
    this.http.get<any[]>('/assets/data/notes.json').subscribe({
      next: (data) => this.notes = data,
      error: (err) => console.error('Error loading notes:', err)
    });
  }
}
