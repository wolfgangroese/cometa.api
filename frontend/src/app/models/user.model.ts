export interface User {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  totalRewards?: number;
  roles: string[];
  role?: string;
  currentOrganizationId?: string;
}
