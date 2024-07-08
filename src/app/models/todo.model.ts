// src/app/models/todo.model.ts

export interface Todo {
  id: number;
  title: string;
  description: string;
  points: number;
  skills: string[];
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  parentTodoId?: number; // optional
  subTodos?: Todo[]; // optional
}
