export function resolvePublicUrl(path: string): string {
  const cleaned = path.replace(/^\//, "");
  const base = new URL("/", window.location.origin);
  return new URL(cleaned, base).toString();
}
