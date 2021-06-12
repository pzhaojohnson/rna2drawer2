import { BaseNumbering } from './BaseNumbering';
import NodeSVG from 'Draw/NodeSVG';
import angleBetween from 'Draw/angleBetween';
import { distance2D as distance } from 'Math/distance';
import normalizeAngle from 'Draw/normalizeAngle';

let svg = NodeSVG();

describe('BaseNumbering class', () => {
  it('_lineCoordinates static method', () => {
    let lcs = BaseNumbering._lineCoordinates(1.1, -2, Math.PI / 3, 4.6, 8.05);
    expect(lcs.x1).toBeCloseTo(3.4000000000000004);
    expect(lcs.y1).toBeCloseTo(1.9837168574084174);
    expect(lcs.x2).toBeCloseTo(7.4250000000000025);
    expect(lcs.y2).toBeCloseTo(8.955221357873148);
  });

  describe('_positionText static method', () => {
    it('in right quadrant', () => {
      let text = svg.text(add => add.tspan('140'));
      text.attr({ 'font-size': 12 });
      let line = svg.line(1, 2, 3, 2);
      BaseNumbering._positionText(text, line);
      expect(text.attr('x')).toBeCloseTo(7);
      expect(text.attr('y')).toBeCloseTo(6.8);
      expect(text.attr('text-anchor')).toBe('start');
    });

    it('in bottom quadrant', () => {
      let text = svg.text(add => add.tspan('1000'));
      text.attr({ 'font-size': 16 });
      let line = svg.line(-1, -4, -1, -3);
      BaseNumbering._positionText(text, line);
      expect(text.attr('x')).toBeCloseTo(-1);
      expect(text.attr('y')).toBeCloseTo(13.8);
      expect(text.attr('text-anchor')).toBe('middle');
    });

    it('in left quadrant', () => {
      let text = svg.text(add => add.tspan('54'));
      text.attr({ 'font-size': 9 });
      let line = svg.line(1, -1, -1, -1);
      BaseNumbering._positionText(text, line);
      expect(text.attr('x')).toBeCloseTo(-5);
      expect(text.attr('y')).toBeCloseTo(2.6);
      expect(text.attr('text-anchor')).toBe('end');
    });

    it('in top quadrant', () => {
      let text = svg.text(add => add.tspan('101'));
      text.attr({ 'font-size': 24 });
      let line = svg.line(2, 5, 2, 3);
      BaseNumbering._positionText(text, line);
      expect(text.attr('x')).toBeCloseTo(2);
      expect(text.attr('y')).toBeCloseTo(-1);
      expect(text.attr('text-anchor')).toBe('middle');
    });
  });

  describe('fromSavedState static method', () => {
    it('valid saved state', () => {
      let n1 = BaseNumbering.create(svg, 10, 5, 8);
      n1.basePadding = 27.83;
      let savableState = n1.savableState();
      let spy = jest.spyOn(BaseNumbering, 'updateDefaults');
      let n2 = BaseNumbering.fromSavedState(savableState, svg, 5, 8);
      expect(n2.text.id()).toBe(savableState.textId);
      expect(n2.line.id()).toBe(savableState.lineId);
      // requires that base coordinates are passed correctly to constructor
      expect(n2.basePadding).toBeCloseTo(27.83);
      expect(spy.mock.calls[0][0]).toBe(n2); // updates defaults
    });

    describe('invalid saved state', () => {
      it('wrong className', () => {
        let n = BaseNumbering.create(svg, 5, 1, 2);
        let savableState = n.savableState();
        savableState.className = 'BaseNmbering';
        expect(
          () => BaseNumbering.fromSavedState(savableState, svg, 1, 2)
        ).toThrow();
      });

      it('constructor throws', () => {
        let n = BaseNumbering.create(svg, 8, 3, 5);
        let savableState = n.savableState();
        n.text.clear();
        n.text.tspan('9.9');
        expect(
          () => BaseNumbering.fromSavedState(savableState, svg, 3, 5)
        ).toThrow();
      });
    });
  });

  describe('create static method', () => {
    let spy = jest.spyOn(BaseNumbering, 'applyDefaults');
    let n = BaseNumbering.create(svg, 129, 120, 548);
    let t = n.text;
    let l = n.line;

    it('creates with number', () => {
      expect(n.number).toBe(129);
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
      expect(() => BaseNumbering.create(svg, 1.1, 1, 2)).toThrow();
    });
  });

  describe('constructor', () => {
    it('throws on missing element arguments', () => {
      let t = svg.text(add => add.tspan('5'));
      let l = svg.line(1, 2, 3, 4);
      expect(() => new BaseNumbering(undefined, l, 5, 4)).toThrow();
      expect(() => new BaseNumbering(t, undefined, 5, 6)).toThrow();
    });

    it('throws on element arguments of wrong types', () => {
      let t = svg.text(add => add.tspan('1'));
      let l = svg.line(1, 5, 8, 12);
      let c = svg.circle(20);
      expect(() => new BaseNumbering(c, l, 1, 2)).toThrow();
      expect(() => new BaseNumbering(t, c, 10, 20)).toThrow();
    });

    it('initializes element IDs', () => {
      let t = svg.text(add => add.tspan('1'));
      let l = svg.line(1, 5, 8, 12);
      expect(t.attr('id')).toBe(undefined);
      expect(l.attr('id')).toBe(undefined);
      let n = new BaseNumbering(t, l, 1, 2);
      expect(t.attr('id')).toBeTruthy();
      expect(l.attr('id')).toBeTruthy();
    });

    it('checks that text is an integer', () => {
      let l = svg.line(5, 10, 20, 10);
      let t1 = svg.text(add => add.tspan('a')); // not a number
      expect(() => new BaseNumbering(t1, l, 10, 5)).toThrow();
      let t2 = svg.text(add => add.tspan('10.1')); // not an integer
      expect(() => new BaseNumbering(t2, l, 5, 10)).toThrow();
    });
  });

  it('id getter', () => {
    let t = svg.text(add => add.tspan('6'));
    t.id('asdfzxcv');
    let l = svg.line(10, 20, 30, 40);
    let n = new BaseNumbering(t, l, 10, 20);
    expect(n.id).toBe('asdfzxcv');
  });

  it('basePadding getter and setter', () => {
    let n = BaseNumbering.create(svg, 10, 30, 80);
    let la = normalizeAngle(n.lineAngle);
    let ll = n.lineLength;
    n.basePadding = 22; // use setter
    expect(n.basePadding).toBeCloseTo(22); // check getter
    let l = n.line;
    // check actual value
    expect(distance(30, 80, l.attr('x1'), l.attr('y1'))).toBeCloseTo(22);
    expect(normalizeAngle(n.lineAngle)).toBeCloseTo(la); // maintains line angle
    expect(n.lineLength).toBeCloseTo(ll); // maintains line length
    // updates defaults
    expect(BaseNumbering.defaults.basePadding).toBeCloseTo(22);
  });

  it('lineAngle getter and setter', () => {
    let n = BaseNumbering.create(svg, 120, 8, 98);
    let bp = n.basePadding;
    let ll = n.lineLength;
    n.lineAngle = 5 * Math.PI / 7; // use setter
    expect(normalizeAngle(n.lineAngle)).toBeCloseTo(5 * Math.PI / 7); // check getter
    let l = n.line;
    // check actual values
    let fromBase = angleBetween(8, 98, l.attr('x1'), l.attr('y1'));
    let fromEnd1 = angleBetween(l.attr('x1'), l.attr('y1'), l.attr('x2'), l.attr('y2'));
    expect(normalizeAngle(fromBase)).toBeCloseTo(5 * Math.PI / 7);
    expect(normalizeAngle(fromEnd1)).toBeCloseTo(5 * Math.PI / 7);
    expect(n.basePadding).toBeCloseTo(bp); // maintains base padding
    expect(n.lineLength).toBeCloseTo(ll); // maintains line length
  });

  it('lineLength getter and setter', () => {
    let n = BaseNumbering.create(svg, 80, 256, 120);
    let bp = n.basePadding;
    let la = normalizeAngle(n.lineAngle);
    n.lineLength = 33.8; // use setter
    expect(n.lineLength).toBeCloseTo(33.8); // check getter
    let l = n.line;
    // check actual value
    expect(distance(l.attr('x1'), l.attr('y1'), l.attr('x2'), l.attr('y2'))).toBeCloseTo(33.8);
    expect(n.basePadding).toBeCloseTo(bp); // maintains base padding
    expect(normalizeAngle(n.lineAngle)).toBeCloseTo(la); // maintains line angle
    // updates defaults
    expect(BaseNumbering.defaults.lineLength).toBeCloseTo(33.8);
  });

  describe('reposition method', () => {
    it('shifts text', () => {
      let n = BaseNumbering.create(svg, 100, 500, 480);
      let t = n.text;
      let xPrev = t.attr('x');
      let yPrev = t.attr('y');
      n.reposition(420, 520);
      expect(t.attr('x') - xPrev).toBeCloseTo(-80);
      expect(t.attr('y') - yPrev).toBeCloseTo(40);
    });

    it('shifts line', () => {
      let n = BaseNumbering.create(svg, 800, 20, 75);
      let l = n.line;
      let xPrev1 = l.attr('x1');
      let yPrev1 = l.attr('y1');
      let xPrev2 = l.attr('x2');
      let yPrev2 = l.attr('y2');
      n.reposition(60, 50);
      expect(l.attr('x1') - xPrev1).toBeCloseTo(40);
      expect(l.attr('y1') - yPrev1).toBeCloseTo(-25);
      expect(l.attr('x2') - xPrev2).toBeCloseTo(40);
      expect(l.attr('y2') - yPrev2).toBeCloseTo(-25);
    });
  });

  it('bringToFront and sendToBack methods', () => {
    let r1 = svg.rect(5, 6);
    let r2 = svg.rect(20, 20);
    let n = BaseNumbering.create(svg, 50, 2, 3);
    let c = svg.circle(20);
    // not already at back
    // and must be sent backwards more than one position
    // (cannot just call backward method of SVG elements)
    expect(n.text.position()).toBeGreaterThan(2);
    expect(n.line.position()).toBeGreaterThan(1);
    n.sendToBack();
    // sent to back
    // and text is kept above line
    expect(n.text.position()).toBe(1);
    expect(n.line.position()).toBe(0);
    let frontMarker = svg.ellipse(20, 40);
    n.bringToFront();
    // brought to front
    // and text is kept above line
    expect(n.line.position()).toBeGreaterThan(frontMarker.position());
    expect(n.text.position()).toBeGreaterThan(n.line.position());
    // had to be brought all the way to front and not just forward one position
    expect(n.line.position()).toBeGreaterThan(1);
  });

  it('number getter and setter', () => {
    let n = BaseNumbering.create(svg, 312, 20, 80);
    expect(n.number).toBe(312);
    n.number = 524;
    expect(n.number).toBe(524);
    n.number = Infinity; // not a finite number
    expect(n.number).toBe(524);
    n.number = 5.2; // not an integer
    expect(n.number).toBe(524);
  });

  it('fontWeight getter and setter', () => {
    let n = BaseNumbering.create(svg, 100, 8, 9);
    n.fontWeight = 600; // use setter
    expect(n.fontWeight).toBe(600); // check getter
    expect(n.text.attr('font-weight')).toBe(600); // check actual value
    // updates defaults
    expect(BaseNumbering.defaults.text['font-weight']).toBe(600);
  });

  it('color getter and setter', () => {
    let n = BaseNumbering.create(svg, 12, 2, 5);
    n.color = '#132435'; // use setter
    expect(n.color).toBe('#132435'); // check getter
    // check actual values
    expect(n.text.attr('fill')).toBe('#132435');
    expect(n.line.attr('stroke')).toBe('#132435');
    // updates defaults
    expect(BaseNumbering.defaults.color).toBe('#132435');
  });

  it('lineStrokeWidth getter and setter', () => {
    let n = BaseNumbering.create(svg, 2, 1, 4);
    n.lineStrokeWidth = 5.234; // use setter
    expect(n.lineStrokeWidth).toBe(5.234); // check getter
    expect(n.line.attr('stroke-width')).toBe(5.234); // check actual value
    // updates defaults
    expect(BaseNumbering.defaults.line['stroke-width']).toBe(5.234);
  });

  it('remove method', () => {
    let n = BaseNumbering.create(svg, 2, 1, 8);
    let textId = '#' + n.text.id();
    let lineId = '#' + n.line.id();
    expect(svg.findOne(textId)).toBeTruthy();
    expect(svg.findOne(lineId)).toBeTruthy();
    n.remove();
    expect(svg.findOne(textId)).toBe(null);
    expect(svg.findOne(lineId)).toBe(null);
  });

  it('savableState method', () => {
    let n = BaseNumbering.create(svg, 8, 3, 9);
    let savableState = n.savableState();
    expect(savableState.className).toBe('BaseNumbering');
    expect(savableState.textId).toBe(n.text.id());
    expect(savableState.lineId).toBe(n.line.id());
  });

  it('refreshIds method', () => {
    let n = BaseNumbering.create(svg, 12, 8, 20);
    let oldTextId = n.text.id();
    let oldLineId = n.line.id();
    n.refreshIds();
    expect(n.text.id()).not.toBe(oldTextId);
    expect(n.line.id()).not.toBe(oldLineId);
  });
});
