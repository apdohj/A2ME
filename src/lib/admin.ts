const ADMIN_PASSWORD = "01147497465";

export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function setAdminAccess(value: boolean): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("a2me_admin", value ? "1" : "0");
}

export function hasAdminAccess(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("a2me_admin") === "1";
}
