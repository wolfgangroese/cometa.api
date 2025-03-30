export interface User {
  id: string;
  userName: string;
  email: string;
  totalRewards?: number;
  roles: string[];
  role?: string;
}
