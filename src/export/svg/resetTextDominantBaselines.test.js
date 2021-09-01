import { resetTextDominantBaselines } from './resetTextDominantBaselines';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { round } from 'Math/round';

function dominantBaseline(ele) {
  return ele.attr('dominant-baseline');
}

function setDominantBaseline(ele, v) {
  ele.attr({ 'dominant-baseline': v });
}

function center(ele) {
  let bbox = ele.bbox();
  return { x: bbox.cx, y: bbox.cy };
}

function roundedCenter(ele, places=6) {
  let c = center(ele);
  return { x: round(c.x, places), y: round(c.y, places) };
}

let container = null;
let svg = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);
});

afterEach(() => {
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('resetTextDominantBaselines function', () => {
  it('resets non-auto dominant baselines', () => {
    let text1 = svg.plain('A');
    let text2 = svg.plain('C');
    let text3 = svg.plain('u');
    setDominantBaseline(text1, 'auto');
    expect(dominantBaseline(text2)).toBe(undefined); // interpreted as auto
    setDominantBaseline(text3, 'middle');
    resetTextDominantBaselines(svg);
    expect(dominantBaseline(text1)).toBe('auto'); // unchanged
    expect(dominantBaseline(text2)).toBe(undefined); // unchanged
    expect(dominantBaseline(text3)).toBe('auto'); // was reset
  });

  it('ignores non-texts', () => {
    let circle = svg.circle(50);
    setDominantBaseline(circle, 'middle');
    resetTextDominantBaselines(svg);
    expect(dominantBaseline(circle)).toBe('middle'); // unchanged
  });

  it('maintains center coordinates', () => {
    let text = svg.plain('G');
    setDominantBaseline(text, 'middle');
    let c1 = roundedCenter(text);
    resetTextDominantBaselines(svg);
    expect(dominantBaseline(text)).toBe('auto'); // was reset
    let c2 = roundedCenter(text);
    expect(c2).toEqual(c1);
  });
});
