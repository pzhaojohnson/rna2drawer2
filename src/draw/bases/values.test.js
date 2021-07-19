import { values, setValues } from './values';
import { NodeSVG } from 'Draw/NodeSVG';
import { Base } from './Base';

let container = null;
let svg = null;
let base = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let text = svg.text(() => {});
  text.plain('A');
  base = new Base(text);
});

afterEach(() => {
  base = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('values function', () => {
  it('returns values', () => {
    // make all values different to test if values are mixed up
    base.text.attr({
      'font-family': 'Consolas',
      'font-size': 18.7,
      'font-weight': 'bolder',
      'font-style': 'italic',
    });
    let vs = values(base);
    expect(vs).toEqual({
      text: {
        'font-family': 'Consolas',
        'font-size': 18.7,
        'font-weight': 'bolder',
        'font-style': 'italic',
      },
    });
  });

  it('handles string and number font weights', () => {
    base.text.attr({ 'font-weight': 720 });
    let vs = values(base);
    expect(vs.text['font-weight']).toEqual(720);
    base.text.attr({ 'font-weight': 'light' });
    vs = values(base);
    expect(vs.text['font-weight']).toEqual('light');
  });
});

describe('setValues function', () => {
  it('sets values', () => {
    // make all values different to test if values are mixed up
    let vs1 = {
      text: {
        'font-family': 'Impact',
        'font-size': 23.6,
        'font-weight': 610,
        'font-style': 'oblique',
      },
    };
    setValues(base, vs1);
    let vs2 = values(base);
    expect(vs2).toEqual(vs1);
  });

  it('handles falsy values', () => {
    let vs1 = {
      text: {
        'font-family': 'Impact',
        'font-size': 6.4,
        'font-weight': 290,
        'font-style': 'italic',
      },
    };
    setValues(base, vs1);
    // with a defined text values object
    setValues(base, { text: {} });
    // with an undefined text values object
    setValues(base, {});
    let vs2 = values(base);
    // didn't set anything to undefined
    expect(vs2).toEqual(vs1);
  });

  it('handles string and number font weights', () => {
    setValues(base, { text: { 'font-weight': 430 } });
    expect(base.text.attr('font-weight')).toBe(430);
    setValues(base, { text: { 'font-weight': 'lighter' } });
    expect(base.text.attr('font-weight')).toBe('lighter');
  });
});
