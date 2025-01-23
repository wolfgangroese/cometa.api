export interface Todo {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  dueDate: Date;
  endDate?: Date;
  rewards: number;
  skills: string[];
  isCompleted: boolean;
  parentTodoId?: number;
  subTodos?: Todo[];
}
