export const resolveRoleName = (roleName?: string): string =>
  roleName === "Professional" ? "User" : roleName ?? "";
