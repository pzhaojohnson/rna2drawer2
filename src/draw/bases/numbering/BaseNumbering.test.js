import { BaseNumbering } from './BaseNumbering';
import NodeSVG from 'Draw/NodeSVG';
import angleBetween from 'Draw/angleBetween';
import { distance2D as distance } from 'Math/distance';
import normalizeAngle from 'Draw/normalizeAngle';
import { round } from 'Math/round';
import { position } from './position';

let svg = NodeSVG();

function getRoundedPositioning(n) {
  return {
    line: {
      'x1': round(n.line.attr('x1'), 3),
      'y1': round(n.line.attr('y1'), 3),
      'x2': round(n.line.attr('x2'), 3),
      'y2': round(n.line.attr('y2'), 3),
    },
    text: {
      'x': round(n.text.attr('x'), 3),
      'y': round(n.text.attr('y'), 3),
      'text-anchor': n.text.attr('text-anchor'),
    }
  };
}

describe('BaseNumbering class', () => {
  describe('fromSavedState static method', () => {
    it('valid saved state', () => {
      let n1 = BaseNumbering.create(svg, 10, { x: 5, y: 8 });
      n1.basePadding = 27.83;
      let savableState = n1.savableState();
      let spy = jest.spyOn(BaseNumbering, 'updateDefaults');
      let n2 = BaseNumbering.fromSavedState(savableState, svg, { x: 5, y: 8 });
      expect(n2.text.id()).toBe(savableState.textId);
      expect(n2.line.id()).toBe(savableState.lineId);
      // requires that base coordinates are passed correctly to constructor
      expect(n2.basePadding).toBeCloseTo(27.83);
      expect(spy.mock.calls[0][0]).toBe(n2); // updates defaults
    });

    describe('invalid saved state', () => {
      it('wrong className', () => {
        let n = BaseNumbering.create(svg, 5, { x: 1, y: 2 });
        let savableState = n.savableState();
        savableState.className = 'BaseNmbering';
        expect(
          () => BaseNumbering.fromSavedState(savableState, svg, { x: 1, y: 2 })
        ).toThrow();
      });

      it('constructor throws', () => {
        let n = BaseNumbering.create(svg, 8, { x: 3, y: 5 });
        let savableState = n.savableState();
        n.text.remove();
        expect(
          () => BaseNumbering.fromSavedState(savableState, svg, { x: 3, y: 5 })
        ).toThrow();
      });
    });
  });

  describe('create static method', () => {
    let spy = jest.spyOn(BaseNumbering, 'applyDefaults');
    let n = BaseNumbering.create(svg, 129, { x: 120, y: 548 });
    let t = n.text;
    let l = n.line;

    it('creates with number', () => {
      expect(n.text.text()).toBe('129');
    });

    it('creates close to center base coordinates', () => {
      expect(
        distance(120, 548, l.attr('x1'), l.attr('y1'))
      ).toBeLessThan(16);
    });

    it('line is angled towards center base coordinates', () => {
      let la = normalizeAngle(n.lineAngle);
      let a = angleBetween(120, 548, l.attr('x1'), l.attr('y1'));
      expect(normalizeAngle(a)).toBeCloseTo(la);
    });

    it('text is close to line', () => {
      expect(
        distance(l.attr('x2'), l.attr('y2'), t.attr('x'), t.attr('y'))
      ).toBeLessThan(16);
    });

    it('applies defaults', () => {
      expect(spy).toHaveBeenCalled();
    });

    it('throws with constructor', () => {
      expect(() => BaseNumbering.create(svg, { toString: () => { throw 'Error' } }, { x: 1, y: 2 })).toThrow();
    });
  });

  describe('constructor', () => {
    it('checks passed element types', () => {
      let t = svg.text('a');
      let l = svg.line(1, 5, 8, 12);
      let c = svg.circle(20);
      expect(
        () => new BaseNumbering(c, l, { x: 1, y: 2 })
      ).toThrow();
      expect(
        () => new BaseNumbering(t, c, { x: 10, y: 20 })
      ).toThrow();
    });

    it('initializes element IDs', () => {
      let t = svg.text('1');
      let l = svg.line(1, 5, 8, 12);
      expect(t.attr('id')).toBe(undefined);
      expect(l.attr('id')).toBe(undefined);
      let n = new BaseNumbering(t, l, { x: 1, y: 2 });
      expect(t.attr('id')).toBeTruthy();
      expect(l.attr('id')).toBeTruthy();
    });
  });

  it('id getter', () => {
    let t = svg.text(add => add.tspan('6'));
    t.id('asdfzxcv');
    let l = svg.line(10, 20, 30, 40);
    let n = new BaseNumbering(t, l, { x: 10, y: 20 });
    expect(n.id).toBe('asdfzxcv');
  });

  it('basePadding, lineAngle and lineLength properties', () => {
    let n = BaseNumbering.create(svg, 12, { x: 25.5, y: 256 });
    // use setters
    n.basePadding = 18.07;
    n.lineAngle = 4.2;
    n.lineLength = 26.6;
    // check getters
    expect(n.basePadding).toBeCloseTo(18.07);
    expect(normalizeAngle(n.lineAngle, 0)).toBeCloseTo(4.2);
    expect(n.lineLength).toBeCloseTo(26.6);
    // check actual positioning
    let rp1 = getRoundedPositioning(n);
    position(n, {
      baseCenter: { x: 25.5, y: 256 },
      basePadding: 18.07,
      lineAngle: 4.2,
      lineLength: 26.6,
      textPadding: n.textPadding,
    });
    let rp2 = getRoundedPositioning(n);
    expect(rp1).toEqual(rp2);
  });

  describe('reposition method', () => {
    it('can be called with no arguments', () => {
      let n = BaseNumbering.create(svg, 100, { x: 520, y: 465 });
      n.basePadding = 16.6;
      n.lineAngle = 2.8;
      n.lineLength = 18.25;
      n.reposition();
      let rp1 = getRoundedPositioning(n);
      position(n, {
        baseCenter: { x: 520, y: 465 },
        basePadding: 16.6,
        lineAngle: 2.8,
        lineLength: 18.25,
        textPadding: n.textPadding,
      });
      let rp2 = getRoundedPositioning(n);
      expect(rp1).toEqual(rp2);
    });

    it('can be called with arguments', () => {
      let n = BaseNumbering.create(svg, 10, { x: 12, y: 300 });
      n.reposition({
        baseCenter: { x: 15, y: 1012 },
        basePadding: 25.2,
        lineAngle: 15.5,
        lineLength: 8.22,
      });
      let rp1 = getRoundedPositioning(n);
      position(n, {
        baseCenter: { x: 15, y: 1012 },
        basePadding: 25.2,
        lineAngle: 15.5,
        lineLength: 8.22,
        textPadding: n.textPadding,
      });
      let rp2 = getRoundedPositioning(n);
      expect(rp1).toEqual(rp2);
    });

    it('stores base center when provided', () => {
      let n = BaseNumbering.create(svg, 200, { x: 65, y: 19 });
      n.reposition({ baseCenter: { x: 421, y: 328 } });
      n.reposition({ basePadding: 82 });
      let rp1 = getRoundedPositioning(n);
      position(n, {
        baseCenter: { x: 421, y: 328 },
        basePadding: 82,
        lineAngle: n.lineAngle,
        lineLength: n.lineLength,
        textPadding: n.textPadding,
      });
      let rp2 = getRoundedPositioning(n);
      expect(rp1).toEqual(rp2);
    });
  });

  it('bringToFront and sendToBack methods', () => {
    let r1 = svg.rect(5, 6);
    let r2 = svg.rect(20, 20);
    let c = svg.circle(20);
    // create above multiple elements
    let n = BaseNumbering.create(svg, 50, { x: 2, y: 3 });
    expect(n.text.position()).toBeGreaterThan(3);
    expect(n.line.position()).toBeGreaterThan(3);
    n.sendToBack();
    expect(n.text.position()).toBeLessThanOrEqual(1);
    expect(n.line.position()).toBeLessThanOrEqual(1);
    n.bringToFront();
    expect(n.line.position()).toBeGreaterThan(3);
    expect(n.text.position()).toBeGreaterThan(3);
  });

  it('remove method', () => {
    let n = BaseNumbering.create(svg, 2, { x: 1, y: 8 });
    let textId = '#' + n.text.id();
    let lineId = '#' + n.line.id();
    expect(svg.findOne(textId)).toBeTruthy();
    expect(svg.findOne(lineId)).toBeTruthy();
    n.remove();
    expect(svg.findOne(textId)).toBe(null);
    expect(svg.findOne(lineId)).toBe(null);
  });

  it('savableState method', () => {
    let n = BaseNumbering.create(svg, 8, { x: 3, y: 9 });
    let savableState = n.savableState();
    expect(savableState.className).toBe('BaseNumbering');
    expect(savableState.textId).toBe(n.text.id());
    expect(savableState.lineId).toBe(n.line.id());
  });

  it('refreshIds method', () => {
    let n = BaseNumbering.create(svg, 12, { x: 8, y: 20 });
    let oldTextId = n.text.id();
    let oldLineId = n.line.id();
    n.refreshIds();
    expect(n.text.id()).not.toBe(oldTextId);
    expect(n.line.id()).not.toBe(oldLineId);
  });
});
