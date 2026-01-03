export interface Organization {
  id: string;
  name: string;
  description?: string;
  slug: string;
  memberCount: number;
  role: string;
  isOwner: boolean;
}

export interface CreateOrganizationDto {
  name: string;
  description?: string;
  slug: string;
}

export interface UpdateOrganizationDto {
  name: string;
  description?: string;
  slug: string;
}

export interface InviteMemberDto {
  email: string;
  role: OrganizationRoleEnum;
}

export enum OrganizationRoleEnum {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member'
}

export interface UpdateMemberRoleDto {
  role: OrganizationRoleEnum;
}
