import { StraightBond } from './StraightBond';
import { NodeSVG } from 'Draw/NodeSVG';
import { SVGLineWrapper as LineWrapper } from 'Draw/svg/line';
import Base from 'Draw/Base';
import { uuidRegex } from 'Draw/svg/id';
import { round } from 'Math/round';
import { position } from './position';

function getRoundedPositioning(bond, places=3) {
  return {
    line: {
      'x1': round(bond.line.attr('x1'), places),
      'y1': round(bond.line.attr('y1'), places),
      'x2': round(bond.line.attr('x2'), places),
      'y2': round(bond.line.attr('y2'), places),
    },
  };
}

let container = null;
let svg = null;

let line = null;
let base1 = null;
let base2 = null;
let bond = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  line = new LineWrapper(svg.line(35, 55, 250, 55));
  base1 = Base.create(svg, 'G', 20, 55);
  base2 = Base.create(svg, 'U', 270, 55);
  bond = new StraightBond(line, base1, base2);
});

afterEach(() => {
  line = null;
  base1 = null;
  base2 = null;
  bond = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('StraightBond class', () => {
  describe('constructor', () => {
    it('checks wrapped element type', () => {
      let line = new LineWrapper(svg.rect(50, 60)); // doesn't wrap a line
      expect(
        () => new StraightBond(line, base1, base2)
      ).toThrow();
    });

    it('stores references to line and bases 1 and 2', () => {
      let bond = new StraightBond(line, base1, base2);
      expect(bond.line).toBe(line);
      expect(bond.base1).toBe(base1);
      expect(bond.base2).toBe(base2);
    });

    it('initializes line ID with a UUID', () => {
      [undefined, ''].forEach(v => {
        let line = new LineWrapper(svg.line(10, 20, 30, 40));
        line.attr({ 'id': v });
        // use the attr method to check the value of the ID
        // since the id method itself will initialize an ID
        expect(line.attr('id')).toBe(v);
        let bond = new StraightBond(line, base1, base2);
        // assigned a UUID
        expect(line.attr('id')).toMatch(uuidRegex);
      });
    });

    it('does not overwrite line ID', () => {
      // it is important not to overwrite IDs when opening
      // a saved drawing since elements in the drawing may
      // reference other elements using saved IDs (e.g.,
      // bonds referencing their bases)
      line.id('a-predefined-id');
      let bond = new StraightBond(line, base1, base2);
      expect(line.id()).toBe('a-predefined-id');
    });

    it('caches base paddings 1 and 2', () => {
      line.attr({ 'x1': 10, 'y1': 20, 'x2': 100, 'y2': 20 });
      base1.moveTo(2, 20); // base padding 1 will be 8
      base2.moveTo(112, 20); // base padding 2 will be 12
      let bond = new StraightBond(line, base1, base2);
      base1.moveTo(23, 400);
      base2.moveTo(1012, 323);
      bond.reposition(); // must use cached base paddings 1 and 2
      let rp1 = getRoundedPositioning(bond);
      position(bond, { basePadding1: 8, basePadding2: 12 });
      let rp2 = getRoundedPositioning(bond);
      expect(rp1).toEqual(rp2); // used cached base paddings 1 and 2
    });
  });

  it('id getter', () => {
    // returns line ID
    expect(bond.id).toBe(bond.line.id());
    // double-check that ID is defined
    expect(bond.id).toBeTruthy();
  });

  it('contains method', () => {
    expect(bond.contains(bond.base1)).toBeTruthy();
    expect(bond.contains(bond.base2)).toBeTruthy();
    let base3 = Base.create(svg, 'T', 20, 80);
    expect(bond.contains(base3)).toBeFalsy();
  });

  describe('basePadding1 property', () => {
    it('positions bond', () => {
      let bp1 = bond.basePadding1 + 12;
      bond.basePadding1 = bp1;
      let rp1 = getRoundedPositioning(bond);
      position(bond, { basePadding1: bp1, basePadding2: bond.basePadding2 });
      let rp2 = getRoundedPositioning(bond);
      expect(rp1).toEqual(rp2); // positioned line
    });

    it('caches value', () => {
      let bp1 = bond.basePadding1 + 20;
      bond.basePadding1 = bp1;
      bond.base1.moveTo(bond.base1.xCenter + 70, bond.base1.yCenter + 80);
      expect(bond.basePadding1).toBeCloseTo(bp1); // gives cached value
      bond.reposition(); // must use cached value
      let rp1 = getRoundedPositioning(bond);
      position(bond, { basePadding1: bp1, basePadding2: bond.basePadding2 });
      let rp2 = getRoundedPositioning(bond);
      expect(rp1).toEqual(rp2); // used cached value
    });
  });

  describe('basePadding2 property', () => {
    it('positions bond', () => {
      let bp2 = bond.basePadding2 + 8.5;
      bond.basePadding2 = bp2;
      let rp1 = getRoundedPositioning(bond);
      position(bond, { basePadding1: bond.basePadding1, basePadding2: bp2 });
      let rp2 = getRoundedPositioning(bond);
      expect(rp1).toEqual(rp2); // positioned bond
    });

    it('caches value', () => {
      let bp2 = bond.basePadding2 + 6;
      bond.basePadding2 = bp2;
      bond.base2.moveTo(bond.base2.xCenter - 300, bond.base2.yCenter + 500);
      expect(bond.basePadding2).toBeCloseTo(bp2); // gives cached value
      bond.reposition(); // must use cached value
      let rp1 = getRoundedPositioning(bond);
      position(bond, { basePadding1: bond.basePadding1, basePadding2: bp2 });
      let rp2 = getRoundedPositioning(bond);
      expect(rp1).toEqual(rp2); // used cached value
    });
  });
  
  describe('reposition method', () => {
    it('positions bond using cached base paddings 1 and 2', () => {
      bond.basePadding1 = 16.6;
      bond.basePadding2 = 29.4;
      bond.base1.moveTo(bond.base1.xCenter + 356, bond.base1.yCenter + 700);
      bond.base2.moveTo(bond.base2.xCenter + 1000, bond.base2.yCenter + 812);
      bond.reposition(); // must use cached base paddings 1 and 2
      let rp1 = getRoundedPositioning(bond);
      position(bond, { basePadding1: 16.6, basePadding2: 29.4 });
      let rp2 = getRoundedPositioning(bond);
      expect(rp1).toEqual(rp2); // used cached base paddings 1 and 2
    });
  });

  it('bringToFront and sendToBack methods', () => {
    let c = svg.circle(20);
    let r = svg.rect(20, 40);
    let t = svg.text('asdf');
    bond.sendToBack();
    expect(bond.line.position()).toBe(0); // starts at back
    // must bring all the way to the front and not just
    // forward one position
    bond.bringToFront();
    expect(bond.line.position()).toBeGreaterThan(2);
    // must send all the way to the back and not just back
    // one position
    bond.sendToBack();
    expect(bond.line.position()).toBe(0);
  });

  it('refreshIds method', () => {
    let prevId = bond.line.id();
    expect(prevId).toBeTruthy();
    bond.refreshIds();
    let currId = bond.line.id();
    // changed ID
    expect(currId).not.toEqual(prevId);
    // redefined ID (and didn't undefine ID)
    expect(currId).toMatch(uuidRegex);
  });
});
