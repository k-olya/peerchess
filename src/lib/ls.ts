// local strorage helpers

// set ls value
export function setLS(key: string, value: string): void {
  localStorage.setItem(key, value);
}

// get ls value or set it to default if it does not exist
export function getLS(key: string, def: string): string {
  const value = localStorage.getItem(key);
  if (value == null) {
    setLS(key, def);
    return def;
  }
  return value;
}
