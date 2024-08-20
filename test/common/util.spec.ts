import { Util } from 'src/common/util';

describe('util', () => {
  test('deepCopy', async () => {
    const a = { a: 1, b: [10, 20], c: { d: 10 } };
    const b = Util.deepCopy(a);
    a.a = 2;
    a.b.push(30);
    a.c.d = 20;
    expect(b).toEqual({ a: 1, b: [10, 20], c: { d: 10 } });

    expect(Util.deepCopy(new Date())).toEqual(new Date());
    expect(Util.deepCopy(new Set([1, 2, 3]))).toEqual(new Set([1, 2, 3]));
    expect(Util.deepCopy(new Map([[1, 2]]))).toEqual(new Map([[1, 2]]));
    expect(Util.deepCopy(null)).toEqual(null);
    expect(Util.deepCopy(undefined)).toEqual(undefined);
    expect(Util.deepCopy(10)).toEqual(10);
    expect(Util.deepCopy('10')).toEqual('10');
    expect(Util.deepCopy(true)).toEqual(true);
  });
});
