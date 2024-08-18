export class Util {
  public static deepCopy<T = unknown>(value: T): T {
    function copyRec(value: unknown): unknown {
      if (value === null) {
        return null;
      } else if (Array.isArray(value)) {
        const res: unknown[] = [];
        for (const item of value) {
          res.push(copyRec(item));
        }
        return res;
      } else if (typeof value === 'object') {
        const res: { [index: string]: unknown } = {};
        for (const key in value) {
          res[key] = copyRec(value[key as keyof typeof value] as unknown);
        }
        return res;
      } else {
        return value;
      }
    }
    return copyRec(value) as T;
  }
}
