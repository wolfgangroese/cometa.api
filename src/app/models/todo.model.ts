export type UUID = string;

export interface Todo {
  id: UUID;
  name: string;
  description?: string;
  startDate?: Date |null;
  dueDate?: Date |null;
  endDate?: Date | null;
  rewards?: number;
  skills?: string[];
  isCompleted: boolean;
  parentTodoId?: number;
  subTodos?: Todo[];
}
