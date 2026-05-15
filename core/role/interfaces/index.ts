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
