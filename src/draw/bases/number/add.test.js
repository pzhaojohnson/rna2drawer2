import { addNumbering, removeNumbering } from './add';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { BaseNumbering } from './BaseNumbering';
import { round } from 'Math/round';
import { position } from './position';

function getRoundedPositioning(bn) {
  let rp = {
    text: {},
    line: {},
  };
  ['x', 'y', 'text-anchor'].forEach(attr => {
    let v = bn.text.attr(attr);
    if (typeof v == 'number') {
      v = round(v, 3);
    }
    rp.text[attr] = v;
  });
  ['x1', 'y1', 'x2', 'y2'].forEach(attr => {
    let v = bn.line.attr(attr);
    if (typeof v == 'number') {
      v = round(v, 3);
    }
    rp.line[attr] = v;
  });
  return rp;
}

function wasRemoved(bn) {
  if (bn.text.root() || bn.line.root()) {
    return false;
  } else {
    return true;
  }
}

let container = null;
let svg = null;
let base = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  base = Base.create(svg, 'A', 100, 200);
});

afterEach(() => {
  base = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('addNumbering function', () => {
  it('adds with correct number', () => {
    addNumbering(base, 1017);
    expect(base.numbering.text.text()).toBe('1017');
  });

  it('positions the numbering', () => {
    addNumbering(base, 500);
    let rp1 = getRoundedPositioning(base.numbering);
    position(base.numbering, {
      baseCenter: { x: base.xCenter, y: base.yCenter },
      basePadding: BaseNumbering.recommendedDefaults.basePadding,
      lineAngle: base.numbering.lineAngle,
      lineLength: BaseNumbering.recommendedDefaults.lineLength,
      textPadding: base.numbering.textPadding,
    });
    let rp2 = getRoundedPositioning(base.numbering);
    expect(rp1).toEqual(rp2);
  });

  it('removes previous numbering if present', () => {
    addNumbering(base, 50);
    let prev = base.numbering;
    expect(wasRemoved(prev)).toBeFalsy();
    addNumbering(base, 200);
    // added new numbering
    expect(base.numbering.text.text()).toBe('200');
    // removed previous numbering
    expect(wasRemoved(prev)).toBeTruthy();
  });
});

describe('removeNumbering function', () => {
  it('removes numbering when present', () => {
    addNumbering(base, 1000);
    let bn = base.numbering;
    expect(wasRemoved(bn)).toBeFalsy();
    removeNumbering(base);
    expect(wasRemoved(bn)).toBeTruthy();
  });

  it('handles an unnumbered base', () => {
    expect(base.numbering).toBe(undefined);
    expect(
      () => removeNumbering(base)
    ).not.toThrow();
  });
});
