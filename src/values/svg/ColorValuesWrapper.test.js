import { interpretColorValue } from 'Draw/svg/interpretColorValue';

import { ColorValuesWrapper } from './ColorValuesWrapper';

describe('ColorValuesWrapper class', () => {
  test('values property', () => {
    let vs = ['#abcdef', '#123456'];
    let values = new ColorValuesWrapper(vs);
    expect(values.values).toBe(vs);
  });

  describe('commonValue getter', () => {
    test('an empty array', () => {
      let values = new ColorValuesWrapper([]);
      expect(values.commonValue).toBeUndefined();
    });

    test('a single color value', () => {
      let values = new ColorValuesWrapper(['rgb(20, 40, 88)']);
      expect(values.commonValue.toHex().toLowerCase()).toBe('#142858');
    });

    test('multiple color values specifying the same color', () => {
      let values = new ColorValuesWrapper([
        'rgb(87, 254, 9)',
        { r: 87, g: 254, b: 9 },
        '#57fe09',
        '#57FE09',
      ]);
      expect(values.commonValue.toHex().toLowerCase()).toBe('#57fe09');
    });

    test('when one color value specifies a different color', () => {
      let values = new ColorValuesWrapper([
        '#abcdef',
        '#abcde1',
        '#abcdef',
        '#abcdef',
      ]);
      expect(values.commonValue).toBeUndefined();
    });

    test('an uninterpretable color value', () => {
      expect(interpretColorValue('asdf')).toBeFalsy(); // is uninterpretable
      let values = new ColorValuesWrapper(['#123456', 'asdf']);
      expect(values.commonValue).toBeUndefined();
    });
  });
});
