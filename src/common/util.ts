export class Util {
  public static deepCopy<T = unknown>(value: T): T {
    if (value === null) {
      return value;
    } else if (typeof value === 'object') {
      if (value instanceof Error) {
        return new Error(value.message) as T;
      } else if (Array.isArray(value)) {
        const res: unknown[] = [];
        for (const item of value) {
          res.push(Util.deepCopy(item));
        }
        return res as T;
      } else if (value instanceof Date) {
        return new Date(value) as T;
      } else if (value instanceof Set) {
        return new Set(value) as T;
      } else if (value instanceof Map) {
        return new Map(value) as T;
      } else {
        const res: Record<string, unknown> = {};
        for (const key in value) {
          res[key] = Util.deepCopy(value[key as keyof typeof value] as unknown);
        }
        return res as T;
      }
    } else {
      return value;
    }
  }
}
