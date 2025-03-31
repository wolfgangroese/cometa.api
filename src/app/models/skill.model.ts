export interface Skill {
  id: string;
  name: string;
  description?: string;
  prevalence?: Prevalence;
}

export enum Prevalence {
  None = -1,
  Low = 0,
  Medium = 1,
  High = 2
}
