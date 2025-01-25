export type UUID = string;

// Modell für das Erstellen eines neuen Todos
export interface CreateTodoDto {
  name: string; // Name ist erforderlich
  description?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  endDate?: Date | null;
}

// Modell für das Aktualisieren eines bestehenden Todos
export interface UpdateTodoDto {
  name: string;
  description?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  endDate?: Date | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  isCompleted: boolean;
}

// Modell für ein vollständiges Todo (z. B. das, was du vom Backend empfängst)
export interface Todo {
  id: UUID; // Einzigartige ID des Todos
  name: string;
  description?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  endDate?: Date | null;
  rewards?: number;
  skills?: string[]; // Array von Skill-Namen
  isCompleted: boolean;
  parentTodoId?: UUID;
  subTodos?: Todo[]; // Verschachtelte Todos
}
