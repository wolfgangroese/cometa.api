export type UUID = string;
export enum TodoStatus {
  Done = 0,
  InProgress = 1,
  Blocked = 2,
  Waiting = 3,
}
export interface CreateTodoDto {
  name: string; // Name ist erforderlich
  description?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  endDate?: Date | null;
  status?: TodoStatus;
}

export interface UpdateTodoDto {
  name: string;
  description?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  endDate?: Date | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  isCompleted?: boolean;
  status?: TodoStatus;
}

export interface Todo {
  id: UUID; // Einzigartige ID des Todos
  name: string;
  description?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  endDate?: Date | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  isCompleted?: boolean;
  parentTodoId?: UUID;
  subTodos?: Todo[]; // Verschachtelte Todos
  status?: TodoStatus;
}
