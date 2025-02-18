export type UUID = string;
export enum TaskStatus {
  Done = 0,
  InProgress = 1,
  Blocked = 2,
  Waiting = 3,
}
export interface CreateTaskDto {
  name: string; // Name ist erforderlich
  description?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  endDate?: Date | null;
  status?: TaskStatus;
}

export interface UpdateTaskDto {
  name: string;
  description?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  endDate?: Date | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  isCompleted?: boolean;
  status?: TaskStatus;
}

export interface Task {
  id: UUID; // Einzigartige ID des Tasks
  name: string;
  description?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  endDate?: Date | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  isCompleted?: boolean;
  parentTaskId?: UUID;
  subTasks?: Task[]; // Verschachtelte Tasks
  status?: TaskStatus;
}
