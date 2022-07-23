import { values, setValues } from './values';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { addNumbering } from './add';
import { round } from 'Math/round';

function roundBasePaddingAndLineLength(vs, places=3) {
  vs.basePadding = round(vs.basePadding, places);
  vs.lineLength = round(vs.lineLength, places);
}

let container = null;
let svg = null;
let base = null;
let numbering = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  base = Base.create(svg, 'A', 50, 100);
  addNumbering(base, 300);
  numbering = base.numbering;
});

afterEach(() => {
  numbering = null;
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
    numbering.text.attr({
      'font-family': 'Consolas',
      'font-size': 16.25,
      'font-weight': 489,
      'fill': '#1288bc',
      'fill-opacity': 0.723,
    });
    numbering.line.attr({
      'stroke': '#78acd2',
      'stroke-width': 8.19,
      'stroke-opacity': 0.191,
    });
    numbering.basePadding = 23.95;
    numbering.lineLength = 35.6;
    let vs = values(numbering);
    roundBasePaddingAndLineLength(vs);
    expect(vs).toEqual({
      text: {
        'font-family': 'Consolas',
        'font-size': 16.25,
        'font-weight': 489,
        'fill': '#1288bc',
        'fill-opacity': 0.723,
      },
      line: {
        'stroke': '#78acd2',
        'stroke-width': 8.19,
        'stroke-opacity': 0.191,
      },
      basePadding: 23.95,
      lineLength: 35.6,
    });
  });

  it('handles number and string font weights', () => {
    numbering.text.attr({ 'font-weight': 320 });
    let vs = values(numbering);
    expect(vs.text['font-weight']).toBe(320);
    numbering.text.attr({ 'font-weight': 'light' });
    vs = values(numbering);
    expect(vs.text['font-weight']).toBe('light');
  });
});

describe('setValues function', () => {
  it('sets values', () => {
    // make all values different to test if values are mixed up
    let vs1 = {
      text: {
        'font-family': 'Calibri',
        'font-size': 22.1,
        'font-weight': 510,
        'fill': '#45ab22',
        'fill-opacity': 0.122,
      },
      line: {
        'stroke': '#45bb1f',
        'stroke-width': 6.32,
        'stroke-opacity': 0.603,
      },
      basePadding: 90.1,
      lineLength: 15.4,
    };
    setValues(numbering, vs1);
    let vs2 = values(numbering);
    roundBasePaddingAndLineLength(vs2);
    expect(vs2).toEqual(vs1);
  });

  it('handles undefined values', () => {
    let vs1 = {
      text: {
        'font-family': 'Helvetica',
        'font-size': 8.2,
        'font-weight': 'lighter',
        'fill': '#4459ba',
        'fill-opacity': 0.541,
      },
      line: {
        'stroke': '#1903aa',
        'stroke-width': 6.33,
        'stroke-opacity': 0.439,
      },
      basePadding: 17.2,
      lineLength: 27.7,
    };
    setValues(numbering, vs1);
    // text and line values objects are defined
    setValues(numbering, { text: {}, line: {} });
    // text and line values objects are undefined
    setValues(numbering, {});
    let vs2 = values(numbering);
    roundBasePaddingAndLineLength(vs2);
    // no values were changed
    expect(vs2).toEqual(vs1);
  });

  it('handles number and string font weights', () => {
    let vs = { text: {}, line: {} };
    vs.text['font-weight'] = 620;
    setValues(numbering, vs);
    expect(numbering.text.attr('font-weight')).toBe(620);
    vs.text['font-weight'] = 'bolder';
    setValues(numbering, vs);
    expect(numbering.text.attr('font-weight')).toBe('bolder');
  });
});
