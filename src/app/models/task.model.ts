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
  startDate?: string | null;
  dueDate?: string | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  endDate?: string | null;
  status?: TaskStatus;
  assigneeId?: string;
  skillNames: string [];

}

export interface UpdateTaskDto {
  name: string;
  description?: string;
  startDate?: string | null;
  dueDate?: string | null;
  endDate?: string | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  isCompleted?: boolean;
  status?: TaskStatus;
  assigneeId?: string;
  skillNames: string [];

}

export interface Task {
  id: UUID; // Einzigartige ID des Tasks
  name: string;
  description?: string;
  startDate?: string | null;
  dueDate?: string | null;
  endDate?: string | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  isCompleted?: boolean;
  parentTaskId?: UUID;
  subTasks?: Task[]; // Verschachtelte Tasks
  status?: TaskStatus;
  assigneeId?: string;
  assigneeName?: string;
  skillNames: string [];
}
