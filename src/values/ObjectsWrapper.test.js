import { ObjectsWrapper } from './ObjectsWrapper';

describe('ObjectsWrapper class', () => {
  test('objects property', () => {
    let os = [{}, {}, {}];
    let objects = new ObjectsWrapper(os);
    expect(objects.objects).toBe(os);
  });

  describe('getProperty method', () => {
    test('an empty array of objects', () => {
      let objects = new ObjectsWrapper([]);
      expect(objects.getProperty('asdf')).toBeUndefined();
    });

    test('an array containing a single object', () => {
      let objects = new ObjectsWrapper([{}]); // no defined properties
      expect(objects.getProperty('asdf')).toBeUndefined();

      objects = new ObjectsWrapper([{ 'qwer': 7.8 }]); // has a defined property
      expect(objects.getProperty('qwer')).toBe(7.8);
    });

    test('an array containing multiple objects', () => {
      let objects = new ObjectsWrapper([{}, {}, {}]); // no defined properties
      expect(objects.getProperty('p')).toBeUndefined();

      objects = new ObjectsWrapper(
        [{ 'zy': 'Qq' }, { 'zy': 'Qq' }, { 'zy': 'Qq' }] // all have same value
      );
      expect(objects.getProperty('zy')).toBe('Qq');

      objects = new ObjectsWrapper(
        [{ 'ASD': 5 }, { 'ASD': 3 }, { 'ASD': 5 }] // one has a different value
      );
      expect(objects.getProperty('ASD')).toBeUndefined();

      objects = new ObjectsWrapper(
        [{ 'prop': true }, { 'prop': true }, {}] // one is missing the property
      );
      expect(objects.getProperty('prop')).toBeUndefined();
    });
  });

  describe('getNumberProperty method', () => {
    test('an empty array of objects', () => {
      let objects = new ObjectsWrapper([]);
      expect(objects.getNumberProperty('asdf')).toBeUndefined();
    });

    test('an array containing a single object', () => {
      let objects = new ObjectsWrapper([{}]); // no defined properties
      expect(objects.getNumberProperty('qwer')).toBeUndefined();

      objects = new ObjectsWrapper([{ 'p1': 6.75 }]); // has a number property
      expect(objects.getNumberProperty('p1')).toBe(6.75);

      objects = new ObjectsWrapper([{ 'p2': '5' }]); // not a number property
      expect(objects.getNumberProperty('p2')).toBeUndefined();
    });

    test('an array containing multiple objects', () => {
      let objects = new ObjectsWrapper([{}, {}, {}]); // no defined properties
      expect(objects.getNumberProperty('p1')).toBeUndefined();

      objects = new ObjectsWrapper(
        [{ 'p3': -2.33 }, { 'p3': -2.33 }, { 'p3': -2.33 }] // all the same number
      );
      expect(objects.getNumberProperty('p3')).toBe(-2.33);

      objects = new ObjectsWrapper(
        [{ 'asd': 6 }, { 'asd': 6 }, { 'asd': 7 }] // one number is different
      );
      expect(objects.getNumberProperty('asd')).toBeUndefined();

      objects = new ObjectsWrapper(
        [{ 'p5': 2 }, { 'p5': '2' }, { 'p5': 2 }] // one non-number
      );
      expect(objects.getNumberProperty('p5')).toBeUndefined();

      objects = new ObjectsWrapper(
        [{ 'p2': 3 }, {}, { 'p2': 3 }] // one is undefined
      );
      expect(objects.getNumberProperty('p2')).toBeUndefined();
    });

    test('places option', () => {
      let objects = new ObjectsWrapper(
        // different values when not rounded
        [{ 'p1': 2.3689 }, { 'p1': 2.3703 }, { 'p1': 2.366 }]
      );
      expect(objects.getNumberProperty('p1')).toBeUndefined();

      // same value when rounded
      expect(objects.getNumberProperty('p1', { places: 2 })).toBe(2.37);
    });
  });
});
