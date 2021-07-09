import { TertiaryBond } from './TertiaryBond';
import NodeSVG from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';

let svg = NodeSVG();

describe('TeritaryBond class', () => {
  describe('fromSavedState static method', () => {
    describe('invalid saved state', () => {
      let b1 = Base.create(svg, 'Y', 1, 5);
      let b2 = Base.create(svg, 'y', 50, 40);
      let getBasebyId = id => id === b1.id ? b1 : b2;
      let tb = TertiaryBond.create(svg, b1, b2);

      it('wrong class name', () => {
        let savableState = tb.savableState();
        savableState.className = 'QuadraticBezierBnd';
        expect(
          () => TertiaryBond.fromSavedState(savableState, svg, getBasebyId)
        ).toThrow();
      });
    });

    it('valid saved state', () => {
      let b1 = Base.create(svg, 'g', 1000, 800);
      let b2 = Base.create(svg, 'A', 200, 300);
      let getBasebyId = id => id === b1.id ? b1 : b2;
      let tb1 = TertiaryBond.create(svg, b1, b2);
      let savableState = tb1.savableState();
      let tb2 = TertiaryBond.fromSavedState(savableState, svg, getBasebyId);
      expect(tb2.path.id()).toBe(tb2.path.id()); // finds path
      // gets bases
      expect(tb2.base1).toBe(b1);
      expect(tb2.base2).toBe(b2);
    });
  });

  describe('create static method', () => {
    let b1 = Base.create(svg, 'a', 1, 5);
    let b2 = Base.create(svg, 'r', 200, 300);
    let tb = TertiaryBond.create(svg, b1, b2);

    it('creates with bases', () => {
      expect(tb.base1).toBe(b1);
      expect(tb.base2).toBe(b2);
    });

    it('creates with valid path', () => {
      let toEnd1 = angleBetween(1, 5, tb.x1, tb.y1);
      let toControl1 = angleBetween(1, 5, tb.xControl, tb.yControl);
      expect(normalizeAngle(toEnd1)).toBeCloseTo(normalizeAngle(toControl1));
      let toEnd2 = angleBetween(200, 300, tb.x2, tb.y2);
      let toControl2 = angleBetween(200, 300, tb.xControl, tb.yControl);
      expect(normalizeAngle(toEnd2)).toBeCloseTo(normalizeAngle(toControl2));
    });
  });

  it('padding1 and padding2 getters and setters', () => {
    let b1 = Base.create(svg, 'q', 1, 4);
    let b2 = Base.create(svg, 't', 400, 3000);
    let tb = TertiaryBond.create(svg, b1, b2);
    tb.padding1 = 6.6; // use setter
    expect(tb.padding1).toBeCloseTo(6.6); // check getter
    // updates recommended default
    expect(TertiaryBond.recommendedDefaults.basePadding1).toBeCloseTo(6.6);
    tb.padding2 = 12.8; // use setter
    expect(tb.padding2).toBeCloseTo(12.8); // check getter
    // updates recommended default
    expect(TertiaryBond.recommendedDefaults.basePadding2).toBeCloseTo(12.8);
  });

  it('strokeWidth getter and setter', () => {
    let b1 = Base.create(svg, 't', 50, 40);
    let b2 = Base.create(svg, 'q', -1000, -300);
    let tb = TertiaryBond.create(svg, b1, b2);
    tb.strokeWidth = 3.96; // use setter
    expect(tb.strokeWidth).toBe(3.96); // check getter
    // updates recommended default
    expect(TertiaryBond.recommendedDefaults.path['stroke-width']).toBe(3.96);
  });
});
