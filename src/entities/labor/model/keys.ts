export const laborKeys = {
  all: ["labor"] as const,
  employeeDirectoryBase: () => [...laborKeys.all, "employee-directory"] as const,
  employeeDirectory: (params?: { keyword?: string; page?: number; size?: number }) =>
    [...laborKeys.employeeDirectoryBase(), params ?? {}] as const,
  seasonEmployeesBase: (seasonId: number) => [...laborKeys.all, "season-employees", seasonId] as const,
  seasonEmployees: (seasonId: number, params?: { keyword?: string; page?: number; size?: number }) =>
    [...laborKeys.seasonEmployeesBase(seasonId), params ?? {}] as const,
  seasonProgressBase: (seasonId: number) => [...laborKeys.all, "season-progress", seasonId] as const,
  seasonProgress: (
    seasonId: number,
    params?: { employeeUserId?: number; taskId?: number; page?: number; size?: number }
  ) => [...laborKeys.seasonProgressBase(seasonId), params ?? {}] as const,
  seasonPayrollBase: (seasonId: number) => [...laborKeys.all, "season-payroll", seasonId] as const,
  seasonPayroll: (
    seasonId: number,
    params?: { employeeUserId?: number; page?: number; size?: number }
  ) => [...laborKeys.seasonPayrollBase(seasonId), params ?? {}] as const,
  employeeTasksBase: () => [...laborKeys.all, "employee-tasks"] as const,
  employeeTasks: (params?: { status?: string; seasonId?: number; page?: number; size?: number }) =>
    [...laborKeys.employeeTasksBase(), params ?? {}] as const,
  employeeProgressBase: () => [...laborKeys.all, "employee-progress"] as const,
  employeeProgress: (params?: { page?: number; size?: number }) =>
    [...laborKeys.employeeProgressBase(), params ?? {}] as const,
  employeePayrollBase: () => [...laborKeys.all, "employee-payroll"] as const,
  employeePayroll: (params?: { seasonId?: number; page?: number; size?: number }) =>
    [...laborKeys.employeePayrollBase(), params ?? {}] as const,
};
