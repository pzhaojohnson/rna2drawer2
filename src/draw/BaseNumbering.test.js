import BaseNumbering from './BaseNumbering';
import NodeSVG from './NodeSVG';
import angleBetween from './angleBetween';
import distanceBetween from './distanceBetween';
import normalizeAngle from './normalizeAngle';

let svg = NodeSVG();

describe('BaseNumbering class', () => {
  it('_lineCoordinates static method', () => {
    let lcs = BaseNumbering._lineCoordinates(1.1, -2, 4 * Math.PI / 3, 4.6, 8.05);
    expect(lcs.x1).toBeCloseTo(1.1 + (4.6 * Math.cos(4 * Math.PI / 3)), 3);
    expect(lcs.y1).toBeCloseTo(-2 + (4.6 * Math.sin(4 * Math.PI / 3)), 3);
    expect(lcs.x2).toBeCloseTo(1.1 + (12.65 * Math.cos(4 * Math.PI / 3)), 3);
    expect(lcs.y2).toBeCloseTo(-2 + (12.65 * Math.sin(4 * Math.PI / 3)), 3);
  });

  describe('_positionText static method', () => {
    it('in right quadrant', () => {
      let text = svg.text(add => add.tspan('140'));
      text.attr({ 'font-size': 12 });
      let line = svg.line(1, 2, 3, 2);
      BaseNumbering._positionText(text, line);
      expect(text.attr('x')).toBeCloseTo(7);
      expect(text.attr('y')).toBeCloseTo(8);
      expect(text.attr('text-anchor')).toBe('start');
    });

    it('in bottom quadrant', () => {
      let text = svg.text(add => add.tspan('1000'));
      text.attr({ 'font-size': 16 });
      let line = svg.line(-1, -4, -1, -3);
      BaseNumbering._positionText(text, line);
      expect(text.attr('x')).toBeCloseTo(-1);
      expect(text.attr('y')).toBeCloseTo(17);
      expect(text.attr('text-anchor')).toBe('middle');
    });

    it('in left quadrant', () => {
      let text = svg.text(add => add.tspan('54'));
      text.attr({ 'font-size': 9 });
      let line = svg.line(1, -1, -1, -1);
      BaseNumbering._positionText(text, line);
      expect(text.attr('x')).toBeCloseTo(-5);
      expect(text.attr('y')).toBeCloseTo(3.5);
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

  describe('mostRecentProps static method', () => {
    it('returns a new object', () => {
      let _mrps = BaseNumbering._mostRecentProps;
      expect(_mrps).toBe(BaseNumbering._mostRecentProps);
      let mrps = BaseNumbering.mostRecentProps();
      expect(mrps).not.toBe(BaseNumbering._mostRecentProps);
    });

    it('returns correct values', () => {
      BaseNumbering._mostRecentProps.basePadding = 5.798;
      BaseNumbering._mostRecentProps.lineLength = 10.23;
      BaseNumbering._mostRecentProps.fontFamily = 'Tahoe';
      BaseNumbering._mostRecentProps.fontSize = 3.567;
      BaseNumbering._mostRecentProps.fontWeight = 'lighter';
      BaseNumbering._mostRecentProps.color = '#456123';
      BaseNumbering._mostRecentProps.lineStrokeWidth = 3.5678;
      let mrps = BaseNumbering.mostRecentProps();
      expect(mrps.basePadding).toBe(5.798);
      expect(mrps.lineLength).toBe(10.23);
      expect(mrps.fontFamily).toBe('Tahoe');
      expect(mrps.fontSize).toBe(3.567);
      expect(mrps.fontWeight).toBe('lighter');
      expect(mrps.color).toBe('#456123');
      expect(mrps.lineStrokeWidth).toBe(3.5678);
    });
  });

  it('_applyMostRecentProps static method', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 9, 1.1, 2.2);
    BaseNumbering._mostRecentProps.basePadding = 5.798;
    BaseNumbering._mostRecentProps.lineLength = 10.23;
    BaseNumbering._mostRecentProps.fontFamily = 'Tahoe';
    BaseNumbering._mostRecentProps.fontSize = 3.567;
    BaseNumbering._mostRecentProps.fontWeight = 'lighter';
    BaseNumbering._mostRecentProps.color = '#456123';
    BaseNumbering._mostRecentProps.lineStrokeWidth = 3.5678;
    BaseNumbering._applyMostRecentProps(n);
    expect(n.basePadding).toBe(5.798);
    expect(n.lineLength).toBe(10.23);
    expect(n.fontFamily).toBe('Tahoe');
    expect(n.fontSize).toBe(3.567);
    expect(n.fontWeight).toBe('lighter');
    expect(n.color).toBe('#456123');
    expect(n.lineStrokeWidth).toBe(3.5678);
  });

  it('_copyPropsToMostRecent static method', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 9, 1.1, 2.2);
    n.basePadding = 5.798;
    n.lineLength = 10.23;
    n.fontFamily = 'Tahoe';
    n.fontSize = 3.567;
    n.fontWeight = 'lighter';
    n.color = '#456123';
    n.lineStrokeWidth = 3.5678;
    BaseNumbering._copyPropsToMostRecent(n);
    let mrps = BaseNumbering.mostRecentProps();
    expect(mrps.basePadding).toBe(5.798);
    expect(mrps.lineLength).toBe(10.23);
    expect(mrps.fontFamily).toBe('Tahoe');
    expect(mrps.fontSize).toBe(3.567);
    expect(mrps.fontWeight).toBe('lighter');
    expect(mrps.color).toBe('#456123');
    expect(mrps.lineStrokeWidth).toBe(3.5678);
  });

  describe('fromSavedState static method', () => {
    it('valid saved state', () => {
      let n1 = BaseNumbering.create(svg, 10, 5, 8);
      n1.basePadding = 27.83;
      let savableState = n1.savableState();
      let n2 = BaseNumbering.fromSavedState(savableState, svg, 5, 8);
      expect(n2._text.id()).toBe(savableState.textId);
      expect(n2._line.id()).toBe(savableState.lineId);
      // requires that base coordinates are passed correctly to constructor
      expect(n2.basePadding).toBeCloseTo(27.83);
    });

    describe('invalid saved state', () => {
      it('wrong className', () => {
        let n = BaseNumbering.create(svg, 5, 1, 2);
        let savableState = n.savableState();
        savableState.className = 'Nmbering';
        expect(
          () => BaseNumbering.fromSavedState(savableState, svg, 1, 2)
        ).toThrow();
      });

      it('constructor throws', () => {
        let n = BaseNumbering.create(svg, 8, 3, 5);
        let savableState = n.savableState();
        n._text.clear();
        n._text.tspan('9.9');
        expect(
          () => BaseNumbering.fromSavedState(savableState, svg, 3, 5)
        ).toThrow();
      });
    });

    it('updates most recent properties', () => {
      let svg = NodeSVG();
      let n1 = BaseNumbering.create(svg, 6, 1.4, 5.5);
      n1.lineAngle = Math.PI / 8;
      n1.fontSize = 12.987;
      let savableState1 = n1.savableState();
      let n2 = BaseNumbering.create(svg, 8, 1, 5);
      n2.lineAngle = Math.PI / 5;
      n2.fontSize = 12;
      let mrps = BaseNumbering.mostRecentProps();
      expect(mrps.fontSize).not.toBe(12.987);
      let n3 = BaseNumbering.fromSavedState(savableState1, svg, 1.4, 5.5);
      mrps = BaseNumbering.mostRecentProps();
      expect(mrps.fontSize).toBe(12.987);
    });
  });

  describe('create static method', () => {
    describe('creates with correct values', () => {
      let n = BaseNumbering.create(svg, 19, 27.5, 98);

      it('number', () => {
        expect(n.number).toBe(19);
      });

      it('line coordinates', () => {
        let x1 = n._line.attr('x1');
        let y1 = n._line.attr('y1');
        let x2 = n._line.attr('x2');
        let y2 = n._line.attr('y2');
        expect(
          distanceBetween(27.5, 98, x1, y1)
        ).toBeCloseTo(n.basePadding);
        expect(
          normalizeAngle(angleBetween(27.5, 98, x1, y1))
        ).toBeCloseTo(normalizeAngle(angleBetween(27.5, 98, x2, y2)));
      });

      it('text positioning', () => {
        let n = BaseNumbering.create(svg, 19, 27.5, 98);
        let tp = BaseNumbering._textPositioning(n._text, n._line);
        expect(n._text.attr('x')).toBe(tp.x);
        expect(n._text.attr('y')).toBe(tp.y);
        expect(n._text.attr('text-anchor')).toBe(tp.textAnchor);
      });
    });

    it('constructor throws', () => {
      expect(
        () => BaseNumbering.create(svg, 5.5, 1, 2)
      ).toThrow();
    });

    it('applies most recent properties', () => {
      let svg = NodeSVG();
      BaseNumbering._mostRecentProps.lineStrokeWidth = 1.59;
      let n = BaseNumbering.create(svg, 4, 1, 9);
      expect(n.lineStrokeWidth).toBe(1.59);
    });
  });

  describe('constructor', () => {
    it('stores text and line', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('1'));
      let l = svg.line(5, 3, 0, 9);
      let n = new BaseNumbering(t, l, 2, 9);
      expect(n._text).toBe(t);
      expect(n._line).toBe(l);
    });

    it('validates text', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('a'));
      let l = svg.line(1, 2, 3, 4);
      expect(() => { new BaseNumbering(t, l, 3, 4) }).toThrow();
    });

    it('validates line', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('2'));
      let l = svg.line(5, 2, 6, 3);
      expect(l.attr('id')).toBe(undefined);
      let n = new BaseNumbering(t, l, 6, 7);
      expect(l.attr('id')).toBeTruthy();
    });

    it('stores base padding', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('5'));
      let l = svg.line(3, 5, 9, 10);
      let n = new BaseNumbering(t, l, 1, 2);
      expect(n._basePadding).toBeCloseTo(distanceBetween(1, 2, 3, 5), 4);
    });
  });

  describe('_validateText method', () => {
    it('initializes ID', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('1'));
      let l = svg.line(1, 2, 3, 4);
      expect(t.attr('id')).toBe(undefined);
      let n = new BaseNumbering(t, l, 2, 3);
      expect(l.attr('id')).toBeTruthy();
    });

    it('not a number', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('b'));
      let l = svg.line(1, 2, 3, 4);
      expect(() => { new BaseNumbering(t, l, 2, 3) }).toThrow();
    });

    it('not an integer', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('1.4'));
      let l = svg.line(1, 2, 3, 4);
      expect(() => { new BaseNumbering(t, l, 5, 6) }).toThrow();
    });
  });

  describe('_validateLine method', () => {
    it('initializes ID', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('4'));
      let l = svg.line(1, 2, 3, 4);
      expect(l.attr('id')).toBe(undefined);
      let n = new BaseNumbering(t, l, 5, 6);
      expect(n._line.attr('id')).toBeTruthy();
    });
  });

  it('id getter', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 5, 1, 6);
    expect(n.id).toBe(n._text.id());
  });

  it('basePadding getter', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 6, 9, 12);
    n.lineAngle = Math.PI / 3;
    expect(n.basePadding).toBeCloseTo(
      distanceBetween(9, 12, n._line.attr('x1'), n._line.attr('y1')),
      3,
    );
  });

  it('_xBaseCenter and _yBaseCenter getters', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 12, 10, 20);
    n.lineAngle = 2 * Math.PI / 3;
    expect(n._xBaseCenter).toBeCloseTo(10, 3);
    expect(n._yBaseCenter).toBeCloseTo(20, 3);
  });

  describe('basePadding setter', () => {
    describe('repositions with correct values', () => {
      it('base center and base padding', () => {
        let svg = NodeSVG();
        let n = BaseNumbering.create(svg, 8, -2, 3);
        n.lineAngle = Math.PI / 5;
        n.basePadding = 27;
        expect(n.basePadding).toBeCloseTo(27, 3);
        expect(
          distanceBetween(-2, 3, n._line.attr('x1'), n._line.attr('y1'))
        ).toBeCloseTo(27, 3);
      });

      it('angle', () => {
        let svg = NodeSVG();
        let n = BaseNumbering.create(svg, -100, 4, 5);
        n.lineAngle = Math.PI / 6;
        n.basePadding = 30;
        expect(
          angleBetween(4, 5, n._line.attr('x1'), n._line.attr('y1'))
        ).toBeCloseTo(Math.PI / 6, 3);
        expect(
          angleBetween(n._line.attr('x1'), n._line.attr('y1'), n._line.attr('x2'), n._line.attr('y2'))
        ).toBeCloseTo(Math.PI / 6, 3);
      });

      it('line length', () => {
        let svg = NodeSVG();
        let n = BaseNumbering.create(svg, 9, 10, 12);
        n.lineAngle = 2 * Math.PI / 3;
        let ll = n.lineLength;
        n.basePadding = 45;
        expect(n.lineLength).toBeCloseTo(ll, 3);
      });
    });

    it('updates most recent property', () => {
      let svg = NodeSVG();
      let n = BaseNumbering.create(svg, 39, 7, 8);
      BaseNumbering._mostRecentProps.basePadding = 8;
      n.basePadding = 16;
      expect(BaseNumbering.mostRecentProps().basePadding).toBe(16);
    });
  });

  it('lineAngle getter', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 65, 99, 103);
    n.lineAngle = Math.PI / 5;
    expect(normalizeAngle(n.lineAngle)).toBeCloseTo(Math.PI / 5, 3);
  });

  it('lineAngle setter', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 5, 8, 9);
    let bp = n.basePadding;
    let ll = n.lineLength;
    let lcs = BaseNumbering._lineCoordinates(8, 9, 2 * Math.PI / 3, bp, ll);
    n.lineAngle = 2 * Math.PI / 3;
    expect(n._line.attr('x1')).toBeCloseTo(lcs.x1, 3);
    expect(n._line.attr('y1')).toBeCloseTo(lcs.y1, 3);
    expect(n._line.attr('x2')).toBeCloseTo(lcs.x2, 3);
    expect(n._line.attr('y2')).toBeCloseTo(lcs.y2, 3);
  });

  it('lineLength getter', () => {
    let svg = NodeSVG();
    let t = svg.text(add => add.tspan('1'));
    let l = svg.line(0, 0, 3, 4);
    let n = new BaseNumbering(t, l, -3, -4);
    expect(n.lineLength).toBeCloseTo(5, 3);
  });

  describe('lineLength setter', () => {
    describe('repositions with correct values', () => {
      it('line length', () => {
        let svg = NodeSVG();
        let n = BaseNumbering.create(svg, 8, 10, 19);
        n.lineAngle = Math.PI / 3;
        expect(n.lineLength).not.toBeCloseTo(22, 3);
        n.lineLength = 22;
        expect(n.lineLength).toBeCloseTo(22, 3);
        expect(
          distanceBetween(n._line.attr('x1'), n._line.attr('y1'), n._line.attr('x2'), n._line.attr('y2'))
        ).toBeCloseTo(22, 3);
      });

      it('base center and base padding', () => {
        let svg = NodeSVG();
        let n = BaseNumbering.create(svg, 9, 8, 6);
        n.lineAngle = Math.PI / 3;
        let bp = n.basePadding;
        n.lineLength = 18;
        expect(n.basePadding).toBeCloseTo(bp, 3);
        expect(
          distanceBetween(8, 6, n._line.attr('x1'), n._line.attr('y1'))
        ).toBeCloseTo(bp, 3);
      });

      it('angle', () => {
        let svg = NodeSVG();
        let n = BaseNumbering.create(svg, 15, 8, 9);
        n.lineAngle = Math.PI / 6;
        n.lineLength = 18;
        expect(
          normalizeAngle(angleBetween(8, 9, n._line.attr('x1'), n._line.attr('y1')))
        ).toBeCloseTo(Math.PI / 6, 3);
        expect(
          normalizeAngle(angleBetween(n._line.attr('x1'), n._line.attr('y1'), n._line.attr('x2'), n._line.attr('y2')))
        ).toBeCloseTo(Math.PI / 6, 3);
      });
    });

    it('updates most recent property', () => {
      let svg = NodeSVG();
      let n = BaseNumbering.create(svg, 12, 4, 5);
      BaseNumbering._mostRecentProps.lineLength = 12;
      n.lineLength = 28;
      expect(BaseNumbering.mostRecentProps().lineLength).toBeCloseTo(28, 3);
    });
  });

  describe('reposition method', () => {
    it('maintains line angle, base padding and line length', () => {
      let svg = NodeSVG();
      let n = BaseNumbering.create(svg, 12, 9, 8);
      n.lineAngle = Math.PI / 3;
      n.basePadding = 12;
      n.lineLength = 19;
      n.reposition(100, 112, 2 * Math.PI / 3);
      expect(normalizeAngle(n.lineAngle)).toBeCloseTo(Math.PI / 3);
      expect(n.basePadding).toBeCloseTo(12, 3);
      expect(n.lineLength).toBeCloseTo(19, 3);
    });

    it('updates position', () => {
      let svg = NodeSVG();
      let n = BaseNumbering.create(svg, 20, 30, 40);
      n.lineAngle = Math.PI / 5;
      n.basePadding = 19;
      n.reposition(-2, -5);
      expect(
        distanceBetween(-2, -5, n._line.attr('x1'), n._line.attr('y1'))
      ).toBeCloseTo(19, 3);
    });
  });

  describe('_reposition method', () => {
    it('updates line coordinates', () => {
      let svg = NodeSVG();
      let n = BaseNumbering.create(svg, 12, 9, 6);
      n.lineAngle = Math.PI / 5;
      n._reposition(100, 1000, 8 * Math.PI / 5, 12, 18);
      let lcs = BaseNumbering._lineCoordinates(100, 1000, 8 * Math.PI / 5, 12, 18);
      expect(n._line.attr('x1')).toBeCloseTo(lcs.x1, 3);
      expect(n._line.attr('y1')).toBeCloseTo(lcs.y1, 3);
      expect(n._line.attr('x2')).toBeCloseTo(lcs.x2, 3);
      expect(n._line.attr('y2')).toBeCloseTo(lcs.y2, 3);
    });

    it('updates text positioning', () => {
      let svg = NodeSVG();
      let n = BaseNumbering.create(svg, 90, 80, 50);
      n.lineAngle = Math.PI / 7;
      n._reposition(-3, -2, Math.PI / 3.5, 100, 200);
      let tp = BaseNumbering._textPositioning(n._text, n._line);
      expect(n._text.attr('x')).toBeCloseTo(tp.x);
      expect(n._text.attr('y')).toBeCloseTo(tp.y);
      expect(n._text.attr('text-anchor')).toBe(tp.textAnchor);
    });

    it('stores base padding', () => {
      let svg = NodeSVG();
      let n = BaseNumbering.create(svg, 12, 5, 8);
      n.lineAngle = Math.PI / 6;
      n._reposition(500, 450, Math.PI / 8, 27, 88);
      expect(n._basePadding).toBeCloseTo(27, 3);
    });
  });

  it('insertBefore and insertAfter methods', () => {
    let svg = NodeSVG();
    let c = svg.circle(20);
    let n = BaseNumbering.create(svg, 12, 5, 6);
    n.lineAngle = 0;
    expect(n._text.position()).toBeGreaterThan(c.position());
    expect(n._line.position()).toBeGreaterThan(c.position());
    n.insertBefore(c);
    expect(n._text.position()).toBeLessThan(c.position());
    expect(n._line.position()).toBeLessThan(c.position());
    n.insertAfter(c);
    expect(n._text.position()).toBeGreaterThan(c.position());
    expect(n._line.position()).toBeGreaterThan(c.position());
  });

  it('number getter', () => {
    let svg = NodeSVG();
    let t = svg.text(add => add.tspan('5'));
    let l = svg.line(1, 2, 3, 4);
    let n = new BaseNumbering(t, l, 0, 0);
    expect(n.number).toBe(5);
  });

  describe('number setter', () => {
    it('not a finite number', () => {
      let svg = NodeSVG();
      let n = BaseNumbering.create(svg, 12, 0, 0);
      n.number = Infinity;
      expect(n.number).toBe(12);
    });

    it('not an integer', () => {
      let svg = NodeSVG();
      let n = BaseNumbering.create(svg, 19, 0, 0);
      n.number = 12.5;
      expect(n.number).toBe(19);
    });

    it('an integer', () => {
      let svg = NodeSVG();
      let n = BaseNumbering.create(svg, 3, 1, 2);
      n.number = 8;
      expect(n.number).toBe(8);
    });
  });

  it('fontFamily getter and setter', () => {
    let n = BaseNumbering.create(svg, 9, 0, 0);
    n.fontFamily = 'Consolas';
    expect(n.fontFamily).toBe('Consolas');
    expect(BaseNumbering.mostRecentProps().fontFamily).toBe('Consolas');
    // updates text positioning
    let tp = BaseNumbering._textPositioning(n._text, n._line);
    expect(n._text.attr('x')).toBe(tp.x);
    expect(n._text.attr('y')).toBe(tp.y);
    expect(n._text.attr('text-anchor')).toBe(tp.textAnchor);
  });

  it('fontSize getter and setter', () => {
    let n = BaseNumbering.create(svg, 12, 0, 0);
    n.fontSize = 19.87;
    expect(n.fontSize).toBe(19.87);
    expect(BaseNumbering.mostRecentProps().fontSize).toBe(19.87);
    // updates text positioning
    let tp = BaseNumbering._textPositioning(n._text, n._line);
    expect(n._text.attr('x')).toBe(tp.x);
    expect(n._text.attr('y')).toBe(tp.y);
    expect(n._text.attr('text-anchor')).toBe(tp.textAnchor);
  });

  it('fontWeight getter and setter', () => {
    let n = BaseNumbering.create(svg, 100, 0, 0);
    n.fontWeight = 600;
    expect(n.fontWeight).toBe(600);
    expect(BaseNumbering.mostRecentProps().fontWeight).toBe(600);
    // updates text positioning
    let tp = BaseNumbering._textPositioning(n._text, n._line);
    expect(n._text.attr('x')).toBe(tp.x);
    expect(n._text.attr('y')).toBe(tp.y);
    expect(n._text.attr('text-anchor')).toBe(tp.textAnchor);
  });

  it('color getter and setter', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 12, 2, 5);
    n.color = '#132435';
    expect(n.color).toBe('#132435');
    expect(n._text.attr('fill')).toBe('#132435');
    expect(n._line.attr('stroke')).toBe('#132435');
    expect(BaseNumbering.mostRecentProps().color).toBe('#132435');
  });

  it('lineStrokeWidth getter and setter', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 2, 1, 4);
    n.lineStrokeWidth = 5.234;
    expect(n.lineStrokeWidth).toBe(5.234);
    expect(BaseNumbering.mostRecentProps().lineStrokeWidth).toBe(5.234);
  });

  it('remove method', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 2, 1, 8);
    let textId = n._text.id();
    let lineId = n._line.id();
    expect(svg.findOne('#' + textId)).toBeTruthy();
    expect(svg.findOne('#' + lineId)).toBeTruthy();
    n.remove();
    expect(svg.findOne('#' + textId)).toBe(null);
    expect(svg.findOne('#' + lineId)).toBe(null);
  });

  it('savableState method', () => {
    let n = BaseNumbering.create(svg, 8, 3, 9);
    let savableState = n.savableState();
    expect(savableState.className).toBe('BaseNumbering');
    expect(savableState.textId).toBe(n._text.id());
    expect(savableState.lineId).toBe(n._line.id());
  });

  it('refreshIds method', () => {
    let svg = NodeSVG();
    let n = BaseNumbering.create(svg, 12, 8, 20);
    let oldTextId = n._text.id();
    let oldLineId = n._line.id();
    n.refreshIds();
    expect(n._text.id()).not.toBe(oldTextId);
    expect(n._line.id()).not.toBe(oldLineId);
  });
});
