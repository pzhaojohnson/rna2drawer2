import { ValuesWrapper } from './ValuesWrapper';

describe('ValuesWrapper class', () => {
  test('values property', () => {
    let vs = [1, 2, 3, 'asdf', 'qwer'];
    let values = new ValuesWrapper(vs);
    expect(values.values).toBe(vs);
  });

  describe('commonValue getter', () => {
    test('an empty array of values', () => {
      let values = new ValuesWrapper([]);
      expect(values.commonValue).toBeUndefined();
    });

    test('values arrays with just a single value', () => {
      let values = new ValuesWrapper(['Q']);
      expect(values.commonValue).toBe('Q');

      values = new ValuesWrapper([2]);
      expect(values.commonValue).toBe(2);

      values = new ValuesWrapper([false]);
      expect(values.commonValue).toBe(false);

      let o = {}; // an object
      values = new ValuesWrapper([o]);
      expect(values.commonValue).toBe(o);

      values = new ValuesWrapper([null]);
      expect(values.commonValue).toBe(null);

      values = new ValuesWrapper([undefined]);
      expect(values.commonValue).toBeUndefined();
    });

    test('values arrays with copies of a single value', () => {
      let values = new ValuesWrapper(['zxc', 'zxc', 'zxc', 'zxc', 'zxc']);
      expect(values.commonValue).toBe('zxc');

      values = new ValuesWrapper([38, 38, 38]);
      expect(values.commonValue).toBe(38);

      values = new ValuesWrapper([true, true, true, true]);
      expect(values.commonValue).toBe(true);

      let o = {}; // an object
      values = new ValuesWrapper([o, o, o, o, o, o]);
      expect(values.commonValue).toBe(o);

      values = new ValuesWrapper([null, null, null]);
      expect(values.commonValue).toBe(null);

      values = new ValuesWrapper([undefined, undefined, undefined, undefined]);
      expect(values.commonValue).toBeUndefined();
    });

    test('values arrays with multiple different values', () => {
      let values = new ValuesWrapper(['b', 'b', 'b', 'c', 'b']); // just one value is different
      expect(values.commonValue).toBeUndefined();

      values = new ValuesWrapper([8, '8', true, {}, null, undefined]); // all values are different
      expect(values.commonValue).toBeUndefined();

      values = new ValuesWrapper([28, 29]); // two different numbers
      expect(values.commonValue).toBeUndefined();

      values = new ValuesWrapper(['c', 'C']); // two different strings
      expect(values.commonValue).toBeUndefined();

      values = new ValuesWrapper([true, false]); // true and false
      expect(values.commonValue).toBeUndefined();

      values = new ValuesWrapper([{}, {}]); // two different objects
      expect(values.commonValue).toBeUndefined();

      values = new ValuesWrapper([null, undefined]); // null and undefined
      expect(values.commonValue).toBeUndefined();

      values = new ValuesWrapper([3, '3']); // a number and its string
      expect(values.commonValue).toBeUndefined();

      values = new ValuesWrapper([0, false]); // zero and false
      expect(values.commonValue).toBeUndefined();

      values = new ValuesWrapper([true, 'true']); // a boolean and its string
      expect(values.commonValue).toBeUndefined();

      values = new ValuesWrapper([{}, null]); // an object and null
      expect(values.commonValue).toBeUndefined();
    });
  });
});
