import { FiniteList } from './FiniteList';

describe('FiniteList class', () => {
  test('maxLength property', () => {
    let fl = new FiniteList({ maxLength: 2038 });
    expect(fl.maxLength).toBe(2038);
  });

  describe('elements method', () => {
    test('an empty list', () => {
      let fl = new FiniteList({ maxLength: 50 });
      expect(fl.length).toBe(0);
      expect(fl.elements()).toStrictEqual([]);
    });

    test('a nonempty list', () => {
      let fl = new FiniteList({ maxLength: 50 });
      fl.push(2);
      fl.push('a');
      fl.push(55);
      fl.push('asdf');
      expect(fl.elements()).toStrictEqual([2, 'a', 55, 'asdf']);
    });

    it('returns a new array', () => {
      let fl = new FiniteList({ maxLength: 50 });
      expect(fl.elements()).not.toBe(fl._elements);
    });
  });

  test('length and size properties', () => {
    let fl = new FiniteList({ maxLength: 50 });
    expect(fl.length).toBe(0);
    expect(fl.size).toBe(0);

    fl.push('A');
    fl.push('B');
    fl.push('ABCD');
    expect(fl.length).toBe(3);
    expect(fl.size).toBe(3);

    fl.pop();
    expect(fl.length).toBe(2);
    expect(fl.size).toBe(2);
  });

  describe('push method', () => {
    test('when the list is less than its maximum length', () => {
      let fl = new FiniteList({ maxLength: 50 });
      expect(fl.elements()).toStrictEqual([]);
      fl.push(1);
      expect(fl.elements()).toStrictEqual([1]);
      fl.pop();
      expect(fl.elements()).toStrictEqual([]);
      fl.push(127);
      fl.push('1000');
      fl.push('B');
      expect(fl.elements()).toStrictEqual([127, '1000', 'B']);
      fl.pop();
      fl.pop();
      expect(fl.elements()).toStrictEqual([127]);
      fl.push('K');
      fl.push('ZXCV');
      fl.push(1012);
      expect(fl.elements()).toStrictEqual([127, 'K', 'ZXCV', 1012]);
    });

    test('when the list is its maximum length', () => {
      let fl = new FiniteList({ maxLength: 4 });
      fl.push('A');
      fl.push('B');
      fl.push('C');
      fl.push('D');
      expect(fl.elements()).toStrictEqual(['A', 'B', 'C', 'D']);
      fl.push('E');
      expect(fl.elements()).toStrictEqual(['B', 'C', 'D', 'E']);
      fl.push('F');
      expect(fl.elements()).toStrictEqual(['C', 'D', 'E', 'F']);
    });
  });

  describe('pop method', () => {
    test('an empty list', () => {
      let fl = new FiniteList({ maxLength: 50 });
      expect(fl.length).toBe(0);
      expect(fl.pop()).toBeUndefined();
    });

    test('a nonempty list', () => {
      let fl = new FiniteList({ maxLength: 50 });
      fl.push(1);
      fl.push('B');
      fl.push('ZX');
      expect(fl.elements()).toStrictEqual([1, 'B', 'ZX']);
      expect(fl.pop()).toBe('ZX'); // returns the popped element
      expect(fl.elements()).toStrictEqual([1, 'B']); // removed from list
    });

    test('when the list is its maximum length', () => {
      let fl = new FiniteList({ maxLength: 3 });
      fl.push('QWER');
      fl.push('QWE');
      fl.push('QW');
      expect(fl.elements()).toStrictEqual(['QWER', 'QWE', 'QW']);
      fl.push('Q'); // is already its maximum length
      expect(fl.elements()).toStrictEqual(['QWE', 'QW', 'Q']);
      expect(fl.pop()).toBe('Q'); // returns the popped element
      expect(fl.elements()).toStrictEqual(['QWE', 'QW']); // removed from list
    });
  });

  describe('last property', () => {
    test('an empty list', () => {
      let fl = new FiniteList({ maxLength: 50 });
      expect(fl.length).toBe(0);
      expect(fl.last).toBeUndefined();
      expect(fl.elements()).toStrictEqual([]); // did not modify
    });

    test('a nonempty list', () => {
      let fl = new FiniteList({ maxLength: 50 });
      fl.push(5);
      fl.push('QWER');
      fl.push(99);
      expect(fl.last).toBe(99);
      expect(fl.elements()).toStrictEqual([5, 'QWER', 99]); // did not modify
      fl.pop();
      expect(fl.last).toBe('QWER');
      expect(fl.elements()).toStrictEqual([5, 'QWER']); // did not modify
      fl.pop();
      expect(fl.last).toBe(5);
      expect(fl.elements()).toStrictEqual([5]); // did not modify
    });
  });
});
