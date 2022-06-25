import { NumbersWrapper } from './NumbersWrapper';

describe('NumbersWrapper class', () => {
  test('values property', () => {
    let vs = [1, 2, 3, 4, 5, null, undefined];
    let values = new NumbersWrapper(vs);
    expect(values.values).toBe(vs);
  });

  test('commonValue getter', () => {
    let values = new NumbersWrapper([]); // an empty array
    expect(values.commonValue).toBeUndefined();

    values = new NumbersWrapper([32]); // one number
    expect(values.commonValue).toBe(32);
    values = new NumbersWrapper([null]); // the value null
    expect(values.commonValue).toBe(null);
    values = new NumbersWrapper([undefined]); // the value undefined
    expect(values.commonValue).toBeUndefined();

    values = new NumbersWrapper([91, 91, 91]); // copies of the same number
    expect(values.commonValue).toBe(91);
    values = new NumbersWrapper([null, null, null]); // values of null
    expect(values.commonValue).toBe(null);
    values = new NumbersWrapper([undefined, undefined, undefined]); // values of undefined
    expect(values.commonValue).toBeUndefined();

    values = new NumbersWrapper([3, 3, 8, 3, 3]); // one number is different
    expect(values.commonValue).toBeUndefined();
    values = new NumbersWrapper([3, null, 3, 3, 3]); // one value is null
    expect(values.commonValue).toBeUndefined();
    values = new NumbersWrapper([3, 3, 3, undefined, 3]); // one value is undefined
    expect(values.commonValue).toBeUndefined();
  });

  test('min getter', () => {
    let values = new NumbersWrapper([]); // an empty array
    expect(values.min).toBeUndefined();

    values = new NumbersWrapper([-88]); // one number
    expect(values.min).toBe(-88);
    values = new NumbersWrapper([null]); // the value null
    expect(values.min).toBeUndefined();
    values = new NumbersWrapper([undefined]); // the value undefined
    expect(values.min).toBeUndefined();

    values = new NumbersWrapper([100, 102, 23, 56]); // multiple numbers
    expect(values.min).toBe(23);
    values = new NumbersWrapper([100, null, 23, 56]); // one value is null
    expect(values.min).toBe(23);
    values = new NumbersWrapper([100, 102, undefined, 56]); // one value is undefined
    expect(values.min).toBe(56);
    values = new NumbersWrapper([null, undefined, null]); // values of null and undefined
    expect(values.min).toBeUndefined();
  });

  test('max getter', () => {
    let values = new NumbersWrapper([]); // an empty array
    expect(values.max).toBeUndefined();

    values = new NumbersWrapper([-9]); // one number
    expect(values.max).toBe(-9);
    values = new NumbersWrapper([null]); // the value null
    expect(values.max).toBeUndefined();
    values = new NumbersWrapper([undefined]); // the value undefined
    expect(values.max).toBeUndefined();

    values = new NumbersWrapper([88, 109, 76, 80, 81]); // multiple numbers
    expect(values.max).toBe(109);
    values = new NumbersWrapper([88, 109, 76, null, 81]); // one value is null
    expect(values.max).toBe(109);
    values = new NumbersWrapper([88, undefined, 76, 80, 81]); // one value is undefined
    expect(values.max).toBe(88);
    values = new NumbersWrapper([undefined, null, undefined]); // values of null and undefined
    expect(values.max).toBeUndefined();
  });

  test('round method', () => {
    let values = new NumbersWrapper([]); // an empty array
    expect(values.round(2).values).toStrictEqual([]); // places specified
    expect(values.round().values).toStrictEqual([]); // places not specified

    // multiple numbers and values of null and undefined
    values = new NumbersWrapper([5, 10.22, 1.0231, -88.7683, 2.9762, -33.1939, undefined, null]);

    // places specified
    expect(values.round(2).values).toStrictEqual([
      5, // no need to round
      10.22, // no need to round
      1.02, // rounds down
      -88.77, // rounds down (and negative)
      2.98, // rounds up
      -33.19, // rounds up (and negative)
      undefined, // maintained
      null, // maintained
    ]);

    // places not specified (defaults to zero decimal places)
    expect(values.round().values).toStrictEqual([5, 10, 1, -89, 3, -33, undefined, null]);
  });
});
