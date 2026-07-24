export function deepClone<T>(value: T): T {
  // structuredClone isn't available in older iOS Safari
  const sc = (globalThis as { structuredClone?: (v: unknown) => unknown }).structuredClone;
  if (sc) return sc(value) as T;
  return JSON.parse(JSON.stringify(value)) as T;
}

export function normSrc(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
