export interface Permission {
  id: number;
  name: string;
  codename: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  permission_ids: number[];
}

export interface UpdateRoleRequest {
  id: number;
  name?: string;
  permission_ids: number[];
}
