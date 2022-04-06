import * as SVG from 'Draw/svg/NodeSVG';

import { fontSize } from './fontSize';
import { setFontSize } from './fontSize';

let container = null;
let svg = null;
let eles = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = SVG.SVG();
  svg.addTo(container);

  eles = [
    svg.text('asdf'),
    svg.textPath('qwer', 'M 20 30 H 300'),
    svg.text(add => add.tspan('A')),
    svg.text('1'),
    svg.text(),
    svg.text('88'),
    svg.textPath('asdfQWER', 'M 55 55 Q 1 300 2 400'),
    svg.text(add => add.tspan('T')),
    svg.text('qwer'),
    svg.text('ZXCV'),
    svg.text('B'),
  ];
});

describe('fontSize function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('font-size', 12.6);
    expect(fontSize([ele])).toBe(12.6);
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('font-size', 18.92));
    // different ways of expressing font-size
    eles[1].attr('font-size', '18.92');
    eles[3].attr('font-size', '18.92px');
    expect(fontSize(eles)).toBe(18.92);
  });

  test('an empty array of elements', () => {
    expect(fontSize([])).toBeUndefined();
  });

  test('when one element has a different font-size', () => {
    eles.forEach(ele => ele.attr('font-size', 12));
    expect(fontSize(eles)).toBe(12);
    eles[2].attr('font-size', 11);
    expect(fontSize(eles)).toBeUndefined();
  });

  test('when multiple elements have a different font-size', () => {
    eles.forEach(ele => ele.attr('font-size', 16.5));
    expect(fontSize(eles)).toBe(16.5);
    eles[0].attr('font-size', 18.4);
    eles[1].attr('font-size', 17);
    eles[3].attr('font-size', 21);
    expect(fontSize(eles)).toBeUndefined();
  });

  test('a nonnumeric font-size', () => {
    let ele = eles[0];
    ele.attr('font-size', 'asdf');
    // check that nonnumeric values are not automatically ignored
    expect(ele.attr('font-size')).toBe('asdf');
    // nonnumeric values seem to be interpreted as zero
    expect(fontSize([ele])).toBe(0);
  });
});

describe('setFontSize function', () => {
  test('one element', () => {
    let ele = eles[0];
    ele.attr('font-size', 12);
    setFontSize([ele], 14);
    expect(fontSize([ele])).toBe(14);
  });

  test('multiple elements', () => {
    eles.forEach(ele => ele.attr('font-size', 16));
    setFontSize(eles, 15.2);
    expect(fontSize(eles)).toBe(15.2);
  });

  test('an empty array of elements', () => {
    expect(
      () => setFontSize([], 9)
    ).not.toThrow();
  });

  test('string values', () => {
    eles.forEach(ele => ele.attr('font-size', 10));
    setFontSize(eles, '9');
    expect(fontSize(eles)).toBe(9);
    setFontSize(eles, '4.3');
    expect(fontSize(eles)).toBe(4.3);
    setFontSize(eles, '6px');
    expect(fontSize(eles)).toBe(6);
  });

  test('values less than one', () => {
    eles.forEach(ele => ele.attr('font-size', 8));
    expect(fontSize(eles)).toBe(8);
    setFontSize(eles, 0);
    expect(fontSize(eles)).toBe(1);

    eles.forEach(ele => ele.attr('font-size', 8));
    expect(fontSize(eles)).toBe(8);
    setFontSize(eles, -1);
    expect(fontSize(eles)).toBe(1);
  });

  test('nonnumeric values', () => {
    eles.forEach(ele => ele.attr('font-size', 12));
    setFontSize(eles, 'asdf');
    setFontSize(eles, '');
    setFontSize(eles, '    ');
    setFontSize(eles, {});
    setFontSize(eles, undefined);
    setFontSize(eles, null);
    setFontSize(eles, false);
    expect(fontSize(eles)).toBe(12); // never changed
  });

  it('ignores units', () => {
    eles.forEach(ele => ele.attr('font-size', 8));
    setFontSize(eles, '15.6cm');
    expect(fontSize(eles)).toBe(15.6);
  });
});
