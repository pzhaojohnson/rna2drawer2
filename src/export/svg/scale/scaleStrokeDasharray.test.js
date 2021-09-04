import { scaleStrokeDasharray } from './scaleStrokeDasharray';
import { NodeSVG } from 'Draw/svg/NodeSVG';

function strokeDasharray(ele) {
  return ele.attr('stroke-dasharray');
}

function setStrokeDasharray(ele, dasharray) {
  ele.attr({ 'stroke-dasharray': dasharray });
}

let container = null;
let svg = null;
let ele = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  ele = svg.path('M 50 60 Q 120 5 2000 33');
});

afterEach(() => {
  ele = null;
  
  svg = null;

  container.remove();
  container = null;
});

describe('scaleStrokeDasharray function', () => {
  it('handles undefined stroke dasharrays', () => {
    expect(strokeDasharray(ele)).toBe(undefined);
    scaleStrokeDasharray(ele, 5);
    expect(strokeDasharray(ele)).toBe(undefined);
  });

  it('handles null stroke dasharrays', () => {
    setStrokeDasharray(ele, null);
    scaleStrokeDasharray(ele, 4);
    // doesn't seem to be possible to set to null
    expect(strokeDasharray(ele)).toBe(undefined);
  });

  it('handles non-nullish stroke dasharrays', () => {
    let factor = 4;
    [
      { unscaled: '', scaled: '' },
      { unscaled: 'none', scaled: 'none' },
      { unscaled: '1', scaled: '' }, // one value
      { unscaled: '4 2 3 5', scaled: '16 8 12 20 ' }, // multiple values
      { unscaled: '2.5 12.2', scaled: '10 48.8 ' }, // floating points
    ].forEach(({ unscaled, scaled }) => {
      setStrokeDasharray(ele, unscaled);
      scaleStrokeDasharray(ele, factor);
      expect(strokeDasharray(ele)).toBe(scaled);
    });
  });
});
