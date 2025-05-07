export function getRoleTypes(user) {
  return user?.roles?.map(r => r.roleType) || [];
}

export function isAdmin(user) {
  const roles = getRoleTypes(user);
  return roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");
}
