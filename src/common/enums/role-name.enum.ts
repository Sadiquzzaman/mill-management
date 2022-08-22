export enum RoleNameEnum {
  SUPER_ADMIN_ROLE = 'SUPER_ADMIN_ROLE',
  ADMIN_ROLE = 'ADMIN_ROLE',
  EDITOR_ROLE = 'EDITOR_ROLE',
  SALES_ROLE = 'SALES_ROLE',
}

export const SUPERADMIN_ADMIN_EDITOR: RoleNameEnum[] = [
  RoleNameEnum.SUPER_ADMIN_ROLE,
  RoleNameEnum.ADMIN_ROLE,
  RoleNameEnum.EDITOR_ROLE,
];

export const SUPERADMIN_ADMIN: RoleNameEnum[] = [
  RoleNameEnum.SUPER_ADMIN_ROLE,
  RoleNameEnum.ADMIN_ROLE,
];

export const ADMIN_EDITOR: RoleNameEnum[] = [
  RoleNameEnum.EDITOR_ROLE,
  RoleNameEnum.ADMIN_ROLE,
];

export const EDITOR: RoleNameEnum[] = [RoleNameEnum.EDITOR_ROLE];
export const ADMIN: RoleNameEnum[] = [RoleNameEnum.ADMIN_ROLE];
export const SUPERADMIN: RoleNameEnum[] = [RoleNameEnum.SUPER_ADMIN_ROLE];
export const SALESMAN: RoleNameEnum[] = [RoleNameEnum.SALES_ROLE];
