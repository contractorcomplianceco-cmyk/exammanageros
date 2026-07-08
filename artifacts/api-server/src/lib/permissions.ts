import type { UserRole } from "@workspace/db";

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  operator: ["exams:read", "exams:write", "tasks:write", "escalations:write", "client-updates:draft"],
  reviewer: ["exams:read", "exams:write", "tasks:write", "escalations:write", "client-updates:draft", "client-updates:approve"],
  admin: ["exams:read", "exams:write", "tasks:write", "escalations:write", "client-updates:draft", "client-updates:approve", "admin:seed", "integrations:manage", "users:manage"],
};

export function permissionsForRole(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return permissionsForRole(role).includes(permission);
}
