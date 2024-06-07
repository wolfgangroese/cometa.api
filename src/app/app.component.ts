import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TodoListComponent} from "./features/todo-list/todos-list.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, TodoListComponent] // Importieren der TodoList Komponente
})
export class AppComponent {
  title = 'cometa';
}
