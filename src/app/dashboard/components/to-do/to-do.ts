import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './to-do.html',
  styleUrl: './to-do.scss'
})
export class ToDoComponent implements OnInit {
  private http = inject(HttpClient);
  tasks: any[] = [];

  ngOnInit() {
    // 1. Try to load from memory
    const saved = localStorage.getItem('todoData');
    if (saved) {
      this.tasks = JSON.parse(saved);
    }

    // 2. If memory was empty (or didn't exist), force load from JSON
    if (this.tasks.length === 0) {
      this.loadDefaults();
    }
  }

  loadDefaults() {
    this.http.get<any[]>('/assets/data/todo.json').subscribe({
      next: (data) => {
        this.tasks = data;
        this.save(); // Save these defaults immediately
      },
      error: (err) => console.error('Error loading todo:', err)
    });
  }

  handleCheck(id: number) {
    this.tasks = this.tasks.map((t) =>
      t.id === id ? { ...t, done: 1 } : t
    );
    this.save();
  }

  save() {
    localStorage.setItem('todoData', JSON.stringify(this.tasks));
  }

  get visibleTasks() {
    // Only show tasks that are NOT done (0)
    return this.tasks.filter((t) => t.done === 0);
  }
}
