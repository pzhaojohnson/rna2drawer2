import {
  createPPTXfromSVG,
  _NUMBER_TRIM,
  _trimNum,
  _xTextCenter,
} from './createPPTXfromSVG';
import { trimNum } from './trimNum';
import createNodeSVG from '../draw/createNodeSVG';
const fs = require('fs');
import PptxGenJs from 'pptxgenjs';

it('_trimNum function', () => {
  let n = 7.1298471294;
  let trimmed = trimNum(n, _NUMBER_TRIM);
  expect(trimmed).not.toEqual(n);
  expect(_trimNum(n)).toEqual(trimmed);
});

describe('_xTextCenter function', () => {
  describe('resets text-anchor', () => {
    it('text-anchor was previously undefined', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('a'));
      _xTextCenter(t);
      expect(t.attr('text-anchor')).toBe('start');
    });

    it('text-anchor was end', () => {
      let svg = createNodeSVG();
      let t = svg.text(add => add.tspan('A'));
      t.attr({ 'text-anchor': 'end' });
      _xTextCenter(t);
      expect(t.attr('text-anchor')).toBe('end');
    });
  });

  it('gives correct value', () => {
    let svg = createNodeSVG();
    let t = svg.text(add => add.tspan('G'));
    t.attr({
      'x': 5,
      'font-size': 20,
      'text-anchor': 'middle',
    });
    let cxPrev = t.bbox().cx;
    t.attr({ 'text-anchor': 'end' });
    let cx = 5 + (t.bbox().cx - cxPrev);
    expect(_xTextCenter(t)).toBeCloseTo(cx, 3);
  });
});

describe('createPPTXfromSVG function', () => {
  it('sets slide dimensions (and trims numbers)', () => {
    let svg = createNodeSVG();
    svg.viewbox(0, 0, 800, 500);
    let pres = createPPTXfromSVG(svg);
    return pres.write('blob').then(data => {
      let expectedData = fs.readFileSync('testinput/pptx/sets_slide_dimensions_blob', 'utf8');
      expect(data.toString()).toBe(expectedData.toString());
    });
  });
});
