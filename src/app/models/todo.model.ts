// src/app/models/todo.model.ts

export interface Todo {
  id: number;
  title: string;
  description: string;
  points: number;
  isCompleted: boolean;
  parentTodoId?: number; // optional
  subTodos?: Todo[]; // optional
}
