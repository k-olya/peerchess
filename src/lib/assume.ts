// throws an error if the expression is null or undefined
// returns false otherwise
export function assert(expr: any, message: string) {
  if (expr == null) {
    console.error(message, expr);
    throw new Error(message);
  }
  return false;
}

// softer version of assert, logs an error instead of throwing
// returns true so that it can be used in ifs for early returns
export function assume(expr: any, message: string) {
  if (expr == null) {
    console.error(message, expr);
    return true;
  }
  return false;
}
