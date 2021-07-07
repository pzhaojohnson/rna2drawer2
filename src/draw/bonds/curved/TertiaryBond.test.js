import { TertiaryBond } from './TertiaryBond';
import NodeSVG from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';

let svg = NodeSVG();

describe('TeritaryBond class', () => {
  describe('mostRecentProps static method', () => {
    it('returns a copy', () => {
      TertiaryBond._mostRecentProps.padding1 = 2.45;
      TertiaryBond._mostRecentProps.padding2 = 5.68;
      TertiaryBond._mostRecentProps.stroke = '#45abc3';
      TertiaryBond._mostRecentProps.strokeWidth = 3.47;
      TertiaryBond._mostRecentProps.strokeOpacity = 0.82;
      TertiaryBond._mostRecentProps.strokeDasharray = '3 3 1 5 6 9';
      let mrps = TertiaryBond.mostRecentProps();
      expect(mrps).not.toBe(TertiaryBond._mostRecentProps); // a new object
      expect(mrps.padding1).toBe(2.45);
      expect(mrps.padding2).toBe(5.68);
      expect(mrps.stroke).toBe('#45abc3');
      expect(mrps.strokeWidth).toBe(3.47);
      expect(mrps.strokeOpacity).toBe(0.82);
      expect(mrps.strokeDasharray).toBe('3 3 1 5 6 9');
    });
  });

  it('_applyMostRecentProps static method', () => {
    let b1 = Base.create(svg, 't', 300, 400);
    let b2 = Base.create(svg, 'a', 0, 0);
    let tb = TertiaryBond.create(svg, b1, b2);
    TertiaryBond._mostRecentProps.padding1 = 16.4;
    TertiaryBond._mostRecentProps.padding2 = 17.3;
    TertiaryBond._mostRecentProps.stroke = '#243511';
    TertiaryBond._mostRecentProps.strokeWidth = 3.22;
    TertiaryBond._mostRecentProps.strokeOpacity = 0.39;
    TertiaryBond._mostRecentProps.strokeDasharray = '3 1 9';
    TertiaryBond._applyMostRecentProps(tb);
    expect(tb.padding1).toBeCloseTo(16.4);
    expect(tb.padding2).toBeCloseTo(17.3);
    expect(tb.stroke).toBe('#243511');
    expect(tb.strokeWidth).toBe(3.22);
    expect(tb.strokeOpacity).toBe(0.39);
    expect(tb.strokeDasharray).toBe('3 1 9');
  });

  it('_copyPropsToMostRecent static method', () => {
    let b1 = Base.create(svg, 'q', 40, 30);
    let b2 = Base.create(svg, 'Q', 500, 400);
    let tb = TertiaryBond.create(svg, b1, b2);
    tb.padding1 = 14.7;
    tb.padding2 = 15.33;
    tb.stroke = '#4455aa';
    tb.strokeWidth = 5.42;
    tb.strokeOpacity = 0.54;
    tb.strokeDasharray = '3 3 1 4';
    // necessary since the setters used above also update the most recent props
    TertiaryBond._mostRecentProps.padding1 = 20;
    TertiaryBond._mostRecentProps.padding2 = 30;
    TertiaryBond._mostRecentProps.stroke = '#abcdef';
    TertiaryBond._mostRecentProps.strokeWidth = 2;
    TertiaryBond._mostRecentProps.strokeOpacity = 1;
    TertiaryBond._mostRecentProps.strokeDasharray = '';
    TertiaryBond._copyPropsToMostRecent(tb);
    let mrps = TertiaryBond.mostRecentProps();
    expect(mrps.padding1).toBeCloseTo(14.7);
    expect(mrps.padding2).toBeCloseTo(15.33);
    expect(mrps.stroke).toBe('#4455aa');
    expect(mrps.strokeWidth).toBe(5.42);
    expect(mrps.strokeOpacity).toBe(0.54);
    expect(mrps.strokeDasharray).toBe('3 3 1 4');
  });

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
      let spy = jest.spyOn(TertiaryBond, '_copyPropsToMostRecent');
      let tb2 = TertiaryBond.fromSavedState(savableState, svg, getBasebyId);
      expect(tb2.path.id()).toBe(tb2.path.id()); // finds path
      // gets bases
      expect(tb2.base1).toBe(b1);
      expect(tb2.base2).toBe(b2);
      // copies most recent props
      expect(spy.mock.calls[0][0]).toBe(tb2);
    });
  });

  describe('create static method', () => {
    let b1 = Base.create(svg, 'a', 1, 5);
    let b2 = Base.create(svg, 'r', 200, 300);
    let spy = jest.spyOn(TertiaryBond, '_applyMostRecentProps');
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

    it('applies most recent props', () => {
      expect(spy.mock.calls[0][0]).toBe(tb);
    });
  });

  it('padding1 and padding2 getters and setters', () => {
    let b1 = Base.create(svg, 'q', 1, 4);
    let b2 = Base.create(svg, 't', 400, 3000);
    let tb = TertiaryBond.create(svg, b1, b2);
    tb.padding1 = 6.6; // use setter
    expect(tb.padding1).toBeCloseTo(6.6); // check getter
    // updates most recent prop
    expect(TertiaryBond.mostRecentProps().padding1).toBeCloseTo(6.6);
    tb.padding2 = 12.8; // use setter
    expect(tb.padding2).toBeCloseTo(12.8); // check getter
    // updates most recent prop
    expect(TertiaryBond.mostRecentProps().padding2).toBeCloseTo(12.8);
  });

  it('stroke, strokeWidth, strokeOpacity and strokeDasharray getters and setters', () => {
    let b1 = Base.create(svg, 't', 50, 40);
    let b2 = Base.create(svg, 'q', -1000, -300);
    let tb = TertiaryBond.create(svg, b1, b2);
    tb.stroke = '#44bbcc'; // use setter
    expect(tb.stroke).toBe('#44bbcc'); // check getter
    // updates most recent prop
    expect(TertiaryBond.mostRecentProps().stroke).toBe('#44bbcc');
    tb.strokeWidth = 3.96; // use setter
    expect(tb.strokeWidth).toBe(3.96); // check getter
    // updates most recent prop
    expect(TertiaryBond.mostRecentProps().strokeWidth).toBe(3.96);
    tb.strokeOpacity = 0.76; // use setter
    expect(tb.strokeOpacity).toBe(0.76); // check getter
    // updates most recent prop
    expect(TertiaryBond.mostRecentProps().strokeOpacity).toBe(0.76);
    tb.strokeDasharray = '3 2 8 7'; // use setter
    expect(tb.strokeDasharray).toBe('3 2 8 7'); // check getter
    // updates most recent prop
    expect(TertiaryBond.mostRecentProps().strokeDasharray).toBe('3 2 8 7');
  });
});
