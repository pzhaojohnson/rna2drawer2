import { textOptions } from './text';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { pixelsToPoints } from 'Export/units';

let container = null;
let svg = null;
let text = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  text = svg.text(() => {});
  text.plain('G'); // adds text content without tspans
});

afterEach(() => {
  text = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('textOptions function', () => {
  it('positions text and sizes the text box', () => {
    text.attr({
      'x': 611,
      'y': 205,
      'font-size': 16,
      'font-weight': 550,
    });
    let options = textOptions(text);
    
    // positions text box
    expect(options.x).toBeCloseTo(6.3646);
    expect(options.y).toBeCloseTo(1.9573);

    // centers text content
    expect(options.align).toBe('center');
    expect(options.valign).toBe('middle');
    expect(options.margin).toBe(0);

    // sizes text box
    expect(options.w).toBeCloseTo(0.1213);
    expect(options.h).toBeCloseTo(0.227);
  });

  it('specifies font face', () => {
    ['Arial', 'Courier New', 'Times New Roman'].forEach(ff => {
      text.attr({ 'font-family': ff });
      expect(textOptions(text).fontFace).toBe(ff);
    });
  });

  it('specifies font size', () => {
    [
      { 'font-size': 9, fontSize: pixelsToPoints(9) },
      { 'font-size': '7.33', fontSize: pixelsToPoints(7.33) },
      { 'font-size': '18px', fontSize: pixelsToPoints(18) },
    ].forEach(fs => {
      text.attr({ 'font-size': fs['font-size'] });
      expect(textOptions(text).fontSize).toBeCloseTo(fs.fontSize);
    });
  });

  it('specifies if bold', () => {
    [
      { 'font-weight': 400, isBold: false },
      { 'font-weight': 700, isBold: true },
      { 'font-weight': 'normal', isBold: false },
      { 'font-weight': 'bold', isBold: true },
    ].forEach(fw => {
      text.attr({ 'font-weight': fw['font-weight'] });
      expect(textOptions(text).bold).toBe(fw.isBold);
    });
  });

  it('specifies color', () => {
    [
      { 'fill': '#ab22Fe', color: 'AB22FE' },
      { 'fill': '#4Ba', color: '44BBAA' },
    ].forEach(f => {
      text.attr({ 'fill': f['fill'] });
      expect(textOptions(text).color).toBe(f.color);
    });
  });
});
