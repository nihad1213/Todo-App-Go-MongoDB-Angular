import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/tasks';
  
  tasks: Task[] = [];
  newTask = { title: '', description: '' };
  editingTask: Task | null = null;
  filter: 'all' | 'active' | 'completed' = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  addTask() {
    if (!this.newTask.title.trim()) return;

    this.http.post<Task>(this.apiUrl, this.newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTask = { title: '', description: '' };
      },
      error: (err) => console.error('Error creating task:', err)
    });
  }

  toggleTask(task: Task) {
    const url = `${this.apiUrl}/${task.id}`;
    this.http.put<Task>(url, { completed: !task.completed }).subscribe({
      next: (updated) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) this.tasks[index] = updated;
      },
      error: (err) => console.error('Error updating task:', err)
    });
  }

  startEdit(task: Task) {
    this.editingTask = { ...task };
  }

  saveEdit() {
    if (!this.editingTask) return;

    const url = `${this.apiUrl}/${this.editingTask.id}`;
    this.http.put<Task>(url, {
      title: this.editingTask.title,
      description: this.editingTask.description
    }).subscribe({
      next: (updated) => {
        const index = this.tasks.findIndex(t => t.id === this.editingTask!.id);
        if (index !== -1) this.tasks[index] = updated;
        this.editingTask = null;
      },
      error: (err) => console.error('Error updating task:', err)
    });
  }

  cancelEdit() {
    this.editingTask = null;
  }

  deleteTask(id: string) {
    const url = `${this.apiUrl}/${id}`;
    this.http.delete(url).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }

  get filteredTasks() {
    switch (this.filter) {
      case 'active':
        return this.tasks.filter(t => !t.completed);
      case 'completed':
        return this.tasks.filter(t => t.completed);
      default:
        return this.tasks;
    }
  }

  get activeCount() {
    return this.tasks.filter(t => !t.completed).length;
  }

  clearCompleted() {
    const completed = this.tasks.filter(t => t.completed);
    completed.forEach(task => this.deleteTask(task.id));
  }
}