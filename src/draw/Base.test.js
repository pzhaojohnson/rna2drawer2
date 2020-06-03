import Base from './Base';
import NodeSVG from './NodeSVG';
import normalizeAngle from './normalizeAngle';
import BaseNumbering from './BaseNumbering';
import { CircleBaseAnnotation } from './BaseAnnotation';
import angleBetween from './angleBetween';
import distanceBetween from './distanceBetween';

let svg = NodeSVG();

describe('Base class', () => {
  describe('mostRecentProps static method', () => {
    it('returns a new object', () => {
      let _mrps = Base._mostRecentProps;
      expect(_mrps).toBe(Base._mostRecentProps);
      let mrps = Base.mostRecentProps();
      expect(mrps).not.toBe(Base._mostRecentProps);
    });

    it('returns correct values', () => {
      Base._mostRecentProps.fontFamily = 'Tahoe';
      Base._mostRecentProps.fontSize = 4.567;
      Base._mostRecentProps.fontWeight = 'bolder';
      Base._mostRecentProps.fontStyle = 'oblique';
      let mrps = Base.mostRecentProps();
      expect(mrps.fontFamily).toBe('Tahoe');
      expect(mrps.fontSize).toBeCloseTo(4.567, 6);
      expect(mrps.fontWeight).toBe('bolder');
      expect(mrps.fontStyle).toBe('oblique');
    });
  });

  it('_applyMostRecentProps static method', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'G', 3, 4);
    Base._mostRecentProps.fontFamily = 'Cambria';
    Base._mostRecentProps.fontSize = 4.88;
    Base._mostRecentProps.fontWeight = 600;
    Base._mostRecentProps.fontStyle = 'italic';
    expect(b.fontFamily).not.toBe('Cambria');
    expect(b.fontSize).not.toBe(4.88);
    expect(b.fontWeight).not.toBe(600);
    expect(b.fontStyle).not.toBe('italic');
    Base._applyMostRecentProps(b);
    expect(b.fontFamily).toBe('Cambria');
    expect(b.fontSize).toBe(4.88);
    expect(b.fontWeight).toBe(600);
    expect(b.fontStyle).toBe('italic');
  });

  it('_copyPropsToMostRecent static method', () => {
    let svg = NodeSVG();
    let t = svg.text(add => add.tspan('A'));
    t.attr({
      'font-family': 'Impact',
      'font-size': 4.447,
      'font-weight': 'lighter',
      'font-style': 'oblique',
    });
    let b = new Base(t);
    let mrps = Base.mostRecentProps();
    expect(mrps.fontFamily).not.toBe('Impact');
    expect(mrps.fontSize).not.toBe(4.447);
    expect(mrps.fontWeight).not.toBe('lighter');
    expect(mrps.fontStyle).not.toBe('oblique');
    Base._copyPropsToMostRecent(b);
    mrps = Base.mostRecentProps();
    expect(mrps.fontFamily).toBe('Impact');
    expect(mrps.fontSize).toBe(4.447);
    expect(mrps.fontWeight).toBe('lighter');
    expect(mrps.fontStyle).toBe('oblique');
  });

  describe('fromSavedState static method', () => {
    describe('valid saved state', () => {
      it('handles nullish highlighting, outline and numbering', () => {
        let b1 = Base.create(svg, 'B', 5, 5);
        let savableState = b1.savableState();
        let b2 = Base.fromSavedState(savableState, svg);
        expect(b2.hasHighlighting()).toBeFalsy();
        expect(b2.hasOutline()).toBeFalsy();
        expect(b2.hasNumbering()).toBeFalsy();
      });

      it('can include highlighting', () => {
        let b1 = Base.create(svg, 'a', 4, 5);
        let h = b1.addCircleHighlighting();
        let savableState = b1.savableState();
        let b2 = Base.fromSavedState(savableState, svg);
        expect(b2.highlighting.id).toBe(h.id);
      });

      it('can include outline', () => {
        let b1 = Base.create(svg, 'b', 5, 6);
        let o = b1.addCircleOutline();
        let savableState = b1.savableState();
        let b2 = Base.fromSavedState(savableState, svg);
        expect(b2.outline.id).toBe(o.id);
      });

      it('can include numbering', () => {
        let b1 = Base.create(svg, 't', 10, 11);
        let n = b1.addNumbering(10);
        let savableState = b1.savableState();
        let b2 = Base.fromSavedState(savableState, svg);
        expect(b2.numbering.id).toBe(n.id);
      });

      it('copies properties to most recent', () => {
        let svg = NodeSVG();
        let b1 = Base.create(svg, 'T', 1, 1);
        b1.fontFamily = 'Consolas';
        let savableState1 = b1.savableState();
        Base._mostRecentProps.fontFamily = 'Times New Roman';
        let b2 = Base.fromSavedState(savableState1, svg);
        expect(Base.mostRecentProps().fontFamily).toBe('Consolas');
      });
    });

    describe('invalid saved state', () => {
      it('invalid className', () => {
        let b = Base.create(svg, 'A', 4, 5);
        let savableState = b.savableState();
        savableState.className = 'Bse';
        expect(
          () => Base.fromSavedState(savableState, svg)
        ).toThrow();
      });

      it('constructor throws', () => {
        let t = svg.text(add => add.tspan('A'));
        let b = new Base(t);
        let savableState = b.savableState();
        t.clear();
        t.tspan('ab');
        expect(
          () => Base.fromSavedState(savableState, svg)
        ).toThrow();
      });
    });
  });

  it('xFromSavedState and yFromSavedState static methods', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'T', 9, 12);
    let savableState = b.savableState();
    expect(Base.xFromSavedState(savableState, svg)).toBe(9);
    expect(Base.yFromSavedState(savableState, svg)).toBe(12);
  });

  describe('create static method', () => {
    it('creates text element with correct values', () => {
      let b = Base.create(svg, 'r', 8, 77);
      expect(b.character).toBe('r');
      expect(b._text.id()).toBeTruthy();
      expect(b.xCenter).toBe(8);
      expect(b.yCenter).toBe(77);
    });

    it('constructor throws', () => {
      expect(() => Base.create(svg, 'ab', 3, 5)).toThrow();
    });

    it('applies most recent properties', () => {
      Base._mostRecentProps.fontSize = 19.228;
      let b = Base.create(svg, 'A', 4, 5);
      expect(b.fontSize).toBe(19.228);
    });
  });

  it('createOutOfView static method', () => {
    let b = Base.createOutOfView(svg, 'I');
    expect(b.character).toBe('I');
    expect(b.xCenter < -50 || b.yCenter < -50).toBeTruthy();
  });

  describe('constructor', () => {
    it('stores text', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('w'));
      let b = new Base(t);
      expect(b._text).toBe(t);
    });

    it('validates text', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('qwe'));
      expect(() => { new Base(t) }).toThrow();
    });

    it('initializes _highlighting, _outline and _numbering', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('Q'));
      let b = new Base(t);
      expect(b._highlighting).toBe(null);
      expect(b._outline).toBe(null);
      expect(b._numbering).toBe(null);
    });
  });

  describe('_validateText method', () => {
    it('initializes ID', () => {
      let svg = NodeSVG();
      let t = svg.text(add => add.tspan('T'));
      expect(t.attr('id')).toBe(undefined);
      let b = new Base(t);
      expect(t.attr('id')).toBeTruthy();
    });

    it('text content is not a single character', () => {
      let svg = NodeSVG();
      let t1 = svg.text('');
      expect(t1.text().length).toBe(0);
      expect(() => { new Base(t1) }).toThrow();
      let t2 = svg.text(add => add.tspan('ab'));
      expect(() => { new Base(t2) }).toThrow();
    });
  });

  it('id getter', () => {
    let svg = NodeSVG();
    let text = svg.text(add => add.tspan('T'));
    let id = text.id();
    let b = new Base(text);
    expect(b.id).toEqual(id);
  });

  it('character getter', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'h', 1, 2);
    expect(b.character).toBe('h');
  });

  describe('character setter', () => {
    it('given string is not a single character', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'y', 2, 5);
      b.character = '';
      expect(b.character).toBe('y');
      b.character = 'asdf';
      expect(b.character).toBe('y');
    });

    it('sets the character', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 't', 3, 3);
      b.character = 'J';
      expect(b.character).toBe('J');
    });
  });

  it('xCenter and yCenter getters', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'A', -1, -2);
    expect(b.xCenter).toBeCloseTo(-1);
    expect(b.yCenter).toBeCloseTo(-2);
  });

  describe('moveTo method', () => {
    it('no highlighting, outline or numbering', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'g', 3, 5);
      expect(b.hasHighlighting()).toBeFalsy();
      expect(b.hasOutline()).toBeFalsy();
      expect(b.hasNumbering()).toBeFalsy();
      b.moveTo(-10, 200);
      expect(b.xCenter).toBe(-10);
      expect(b.yCenter).toBe(200);
      expect(b._text.cx()).toBeCloseTo(-10);
      expect(b._text.cy()).toBeCloseTo(200);
    });

    it('repositions highlighting', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 't', 1, 2);
      let h = b.addCircleHighlighting();
      h.shift(5, 4);
      let da = h.displacementAngle;
      b.moveTo(8, 9);
      expect(
        normalizeAngle(angleBetween(8, 9, h.xCenter, h.yCenter))
      ).toBeCloseTo(normalizeAngle(da));
    });

    it('repositions outline', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'e', 3, 8);
      let o = b.addCircleOutline();
      o.shift(-2, 55);
      let da = o.displacementAngle;
      b.moveTo(55, 38);
      expect(
        normalizeAngle(angleBetween(55, 38, o.xCenter, o.yCenter))
      ).toBeCloseTo(normalizeAngle(da));
    });

    it('repositions numbering', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'e', 1, 5);
      let n = b.addNumbering(112);
      n.lineAngle = Math.PI / 5;
      b.moveTo(20, 40);
      expect(
        normalizeAngle(angleBetween(20, 40, n._line.attr('x1'), n._line.attr('y1')))
      ).toBeCloseTo(Math.PI / 5);
    });
  });

  it('distanceBetweenCenters method', () => {
    let svg = NodeSVG();
    let b1 = Base.create(svg, 'A', 1, 2);
    let b2 = Base.create(svg, 'U', 4, 6);
    expect(b1.distanceBetweenCenters(b2)).toBeCloseTo(5, 3);
  });

  it('angleBetweenCenters method', () => {
    let svg = NodeSVG();
    let b1 = Base.create(svg, 'A', 1, 2);
    let b2 = Base.create(svg, 'U', 44, 5);
    expect(
      normalizeAngle(b1.angleBetweenCenters(b2))
    ).toBeCloseTo(
      normalizeAngle(angleBetween(1, 2, 44, 5)),
      3,
    );
  });

  it('fontFamily getter and setter', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'a', 1, 2);
    b.fontFamily = 'Cambria';
    expect(b.fontFamily).toBe('Cambria');
    // maintains center coordinates
    expect(b._text.cx()).toBeCloseTo(1);
    expect(b._text.cy()).toBeCloseTo(2);
  });

  it('fontSize getter and setter', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'e', 5, 6);
    b.fontSize = 5.123;
    expect(b.fontSize).toBe(5.123);
    // maintains center coordinates
    expect(b._text.cx()).toBeCloseTo(5);
    expect(b._text.cy()).toBeCloseTo(6);
  });

  it('fontWeight getter and setter', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'a', 1, 4);
    b.fontWeight = 650;
    expect(b.fontWeight).toBe(650);
    // maintains center coordinates
    expect(b._text.cx()).toBeCloseTo(1);
    expect(b._text.cy()).toBeCloseTo(4);
  });

  it('fontStyle getter and setter', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'E', 5, 15);
    b.fontStyle = 'italic';
    expect(b.fontStyle).toBe('italic');
    // maintains center coordinates
    expect(b._text.cx()).toBeCloseTo(5);
    expect(b._text.cy()).toBeCloseTo(15);
  });

  it('fill getter and setter', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 't', 4, 5);
    b.fill = '#4523ab';
    expect(b.fill).toBe('#4523ab');
  });

  it('cursor getter and setter', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'e', 4, 5);
    b.cursor = 'crosshair';
    expect(b.cursor).toBe('crosshair');
  });

  it('onMouseover method', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'A', 1.3, 1.4);
    let v = false;
    b.onMouseover(e => { v = true; });
    b._text.fire('mouseover');
    expect(v).toBeTruthy();
  });

  it('onMouseout method', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'A', 1.3, 1.4);
    let v = false;
    b.onMouseout(e => { v = true; });
    b._text.fire('mouseout');
    expect(v).toBeTruthy();
  });

  it('onMousedown method', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'A', 1.3, 1.4);
    let v = false;
    b.onMousedown(e => { v = true; });
    b._text.fire('mousedown');
    expect(v).toBeTruthy();
  });

  it('onDblclick method', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'A', 1.3, 1.4);
    let v = false;
    b.onDblclick(e => { v = true; });
    b._text.fire('dblclick');
    expect(v).toBeTruthy();
  });

  describe('addCircleHighlighting method', () => {
    it('removes previous highlighting', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'e', 4, 6);
      let h1 = b.addCircleHighlighting();
      expect(svg.findOne('#' + h1.id)).toBeTruthy();
      let h2 = b.addCircleHighlighting();
      expect(svg.findOne('#' + h1.id)).toBe(null);
    });

    it('returns added circle highlighting', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'e', 4, 4);
      let h = b.addCircleHighlighting();
      expect(h).toBe(b._highlighting);
    });

    it('creates circle highlighting with correct position', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'r', 2, 9);
      let h = b.addCircleHighlighting();
      expect(h.xCenter).toBeCloseTo(2);
      expect(h.yCenter).toBeCloseTo(9);
    });
  });

  describe('addCircleHighlightingFromSavedState method', () => {
    it('removes previous highlighting', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'w', 3, 5);
      let h = b.addCircleHighlighting();
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 3, 5);
      let savableState = cba.savableState();
      expect(svg.findOne('#' + h.id)).toBeTruthy();
      b.addCircleHighlightingFromSavedState(savableState, 0);
      expect(svg.findOne('#' + h.id)).toBe(null);
    });

    it('returns added circle highlighting', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'g', 3, 9);
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 3, 9);
      let savableState = cba.savableState();
      let h = b.addCircleHighlightingFromSavedState(savableState, 0);
      expect(h).toBe(b._highlighting);
    });

    it('passes base center', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'q', 2, 9);
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 2, 9);
      cba.shift(8, 10);
      let dl = cba.displacementLength;
      let da = cba.displacementAngle;
      let savableState = cba.savableState();
      let h = b.addCircleHighlightingFromSavedState(savableState);
      expect(h.displacementLength).toBeCloseTo(dl, 3);
      expect(normalizeAngle(h.displacementAngle)).toBeCloseTo(normalizeAngle(da), 3);
    });
  });

  it('hasHighlighting method', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'C', 0.99, 100.2357);
    expect(b.hasHighlighting()).toBeFalsy();
    b.addCircleHighlighting();
    expect(b.hasHighlighting()).toBeTruthy();
    b.removeHighlighting();
    expect(b.hasHighlighting()).toBeFalsy();
  });

  it('highlighting getter', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'C', 0.99, 100.2357);
    expect(b.highlighting).toBe(null);
    let h = b.addCircleHighlighting();
    expect(b.highlighting).toBe(h);
  });

  describe('removeHighlighting method', () => {
    it('has no highlighting in the first place', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'a', 3, 5);
      expect(b.hasHighlighting()).toBeFalsy();
      expect(() => b.removeHighlighting()).not.toThrow();
    });

    it('removes highlighting', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 't', 1, 9);
      let h = b.addCircleHighlighting();
      expect(b.hasHighlighting()).toBeTruthy();
      expect(svg.findOne('#' + h.id)).toBeTruthy();
      b.removeHighlighting();
      expect(b.hasHighlighting()).toBeFalsy();
      expect(svg.findOne('#' + h.id)).toBe(null);
    });
  });

  describe('addCircleOutline method', () => {
    it('removes previous outline', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'q', 3, 5);
      let o1 = b.addCircleOutline();
      expect(svg.findOne('#' + o1.id)).toBeTruthy();
      let o2 = b.addCircleOutline();
      expect(svg.findOne('#' + o1.id)).toBe(null);
    });

    it('returns added circle outline', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'b', 2, 4);
      let o = b.addCircleOutline();
      expect(o).toBe(b._outline);
    });

    it('creates circle outline with correct position', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'b', 5, 6);
      let o = b.addCircleOutline();
      expect(o.xCenter).toBeCloseTo(5);
      expect(o.yCenter).toBeCloseTo(6);
    });
  });

  describe('addCircleOutlineFromSavedState method', () => {
    it('removes previous outline', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'e', 3, 9);
      let o1 = b.addCircleOutline();
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 3, 9);
      let savableState = cba.savableState();
      expect(svg.findOne('#' + o1.id)).toBeTruthy();
      let o2 = b.addCircleOutlineFromSavedState(savableState, 0);
      expect(svg.findOne('#' + o1.id)).toBe(null);
    });

    it('returns added circle outline', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'q', 2, 9);
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 44, 7);
      let savableState = cba.savableState();
      let o = b.addCircleOutlineFromSavedState(savableState, 0);
      expect(o).toBe(b._outline);
    });

    it('passes base center', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'w', 12, 16);
      let cba = CircleBaseAnnotation.createNondisplaced(svg, 12, 16);
      cba.shift(4, 8);
      let dl = cba.displacementLength;
      let da = cba.displacementAngle;
      let savableState = cba.savableState();
      let o = b.addCircleOutlineFromSavedState(savableState);
      expect(o.displacementLength).toBeCloseTo(dl, 3);
      expect(normalizeAngle(o.displacementAngle)).toBeCloseTo(normalizeAngle(da), 3);
    });
  });

  it('hasOutline method', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'C', 0.99, 100.2357);
    expect(b.hasOutline()).toBeFalsy();
    b.addCircleOutline();
    expect(b.hasOutline()).toBeTruthy();
    b.removeOutline();
    expect(b.hasOutline()).toBeFalsy();
  });

  it('outline getter', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'C', 0.99, 100.2357);
    expect(b.outline).toBe(null);
    let o = b.addCircleOutline();
    expect(b.outline).toBe(o);
  });

  describe('removeOutline method', () => {
    it('has no outline in the first place', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 't', 1, 2);
      expect(b.hasOutline()).toBeFalsy();
      expect(() => b.removeOutline()).not.toThrow();
    });

    it('removes outline', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'g', 5, 7);
      let o  = b.addCircleOutline();
      expect(b.hasOutline()).toBeTruthy();
      expect(svg.findOne('#' + o.id)).toBeTruthy();
      b.removeOutline();
      expect(b.hasOutline()).toBeFalsy();
      expect(svg.findOne('#' + o.id)).toBe(null);
    });
  });

  describe('addNumbering method', () => {
    it('removes previous numbering', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'a', 1, 2);
      let n1 = b.addNumbering(5, 0);
      expect(svg.findOne('#' + n1._text.id())).toBeTruthy();
      let n2 = b.addNumbering(6, 0);
      expect(svg.findOne('#' + n1._text.id())).toBe(null);
    });

    it('returns added numbering', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'b', 4, 5);
      let n = b.addNumbering(9, 0);
      expect(n).toBe(b._numbering);
    });

    it('invalid number', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'h', 3, 5);
      let n = b.addNumbering(1.2, 0);
      expect(n).toBe(null);
      expect(b.hasNumbering()).toBeFalsy();
    });

    it('passes number and base center', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'w', 5, 9);
      let n = b.addNumbering(12);
      n.lineAngle = Math.PI / 3;
      expect(n.number).toBe(12);
      expect(
        distanceBetween(5, 9, n._line.attr('x1'), n._line.attr('y1'))
      ).toBeCloseTo(n.basePadding, 3);
      expect(
        normalizeAngle(angleBetween(5, 9, n._line.attr('x1'), n._line.attr('y1')))
      ).toBeCloseTo(Math.PI / 3, 3);
    });
  });

  describe('addNumberingFromSavedState method', () => {
    it('removes previous numbering', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'y', 5, 9);
      let n1 = b.addNumbering(30, 0);
      let n2 = BaseNumbering.create(svg, 15, 5, 9, Math.PI / 6);
      let savableState2 = n2.savableState();
      expect(svg.findOne('#' + n1._text.id())).toBeTruthy();
      let n3 = b.addNumberingFromSavedState(savableState2);
      expect(svg.findOne('#' + n1._text.id())).toBe(null);
    });

    it('returns added numbering', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'p', 7, 8);
      let n1 = BaseNumbering.create(svg, 20, 7, 8, 0);
      let savableState1 = n1.savableState();
      let n2 = b.addNumberingFromSavedState(savableState1);
      expect(n2).toBe(b._numbering);
    });

    it('passes base center', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'e', 4, 9);
      let n1 = BaseNumbering.create(svg, 40, 4, 9, Math.PI / 3);
      n1.basePadding = 12;
      let savableState1 = n1.savableState();
      let n2 = b.addNumberingFromSavedState(savableState1);
      expect(n2.basePadding).toBeCloseTo(12, 3);
    });
  });

  it('hasNumbering method', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'C', 0.99, 100.2357);
    expect(b.hasNumbering()).toBeFalsy();
    b.addNumbering(12, Math.PI / 6);
    expect(b.hasNumbering()).toBeTruthy();
    b.removeNumbering();
    expect(b.hasNumbering()).toBeFalsy();
  });

  it('numbering getter', () => {
    let svg = NodeSVG();
    let b = Base.create(svg, 'C', 0.99, 100.2357);
    expect(b.numbering).toBe(null);
    let n = b.addNumbering(-9, Math.PI / 7);
    expect(b.numbering).toBe(n);
  });

  describe('removeNumbering method', () => {
    it('has no numbering in the first place', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'g', 1, 2);
      expect(b.hasNumbering()).toBeFalsy();
      expect(() => b.removeNumbering()).not.toThrow();
    });

    it('removes numbering', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 't', 4, 5);
      let n = b.addNumbering(12, Math.PI / 3);
      expect(b.hasNumbering()).toBeTruthy();
      expect(svg.findOne('#' + n._text.id())).toBeTruthy();
      b.removeNumbering();
      expect(b.hasNumbering()).toBeFalsy();
      expect(svg.findOne('#' + n._text.id())).toBe(null);
    });
  });

  describe('remove method', () => {
    it('removes text', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 't', 1, 4);
      expect(svg.findOne('#' + b._text.id())).toBeTruthy();
      b.remove();
      expect(svg.findOne('#' + b._text.id())).toBe(null);
    });

    it('removes highlighting, outline and numbering', () => {
      let svg = NodeSVG();
      let b = Base.create(svg, 'r', 5, 5);
      let h = b.addCircleHighlighting();
      let o = b.addCircleOutline();
      let n = b.addNumbering(12, 0);
      expect(svg.findOne('#' + h.id)).toBeTruthy();
      expect(svg.findOne('#' + o.id)).toBeTruthy();
      expect(svg.findOne('#' + n.id)).toBeTruthy();
      b.remove();
      expect(svg.findOne('#' + h.id)).toBe(null);
      expect(svg.findOne('#' + o.id)).toBe(null);
      expect(svg.findOne('#' + n.id)).toBe(null);
    });
  });

  describe('savableState method', () => {
    it('includes className and text', () => {
      let b = Base.create(svg, 'a', 1, 2);
      let savableState = b.savableState();
      expect(savableState.className).toBe('Base');
      expect(savableState.textId).toBe(b._text.id());
    });

    it('with no highlighting, outline or numbering', () => {
      let b = Base.create(svg, 't', 1, 5);
      let savableState = b.savableState();
      expect(savableState.highlighting).toBeFalsy();
      expect(savableState.outline).toBeFalsy();
      expect(savableState.numbering).toBeFalsy();
    });

    it('includes highlighting, outline and numbering', () => {
      let b = Base.create(svg, 'k', 5, 8);
      let h = b.addCircleHighlighting();
      let o = b.addCircleOutline();
      let n = b.addNumbering(55);
      let savableState = b.savableState();
      expect(
        JSON.stringify(savableState.highlighting)
      ).toBe(JSON.stringify(h.savableState()));
      expect(
        JSON.stringify(savableState.outline)
      ).toBe(JSON.stringify(o.savableState()));
      expect(
        JSON.stringify(savableState.numbering)
      ).toBe(JSON.stringify(n.savableState()));
    });
  });

  describe('refreshIds method', () => {
    let svg = NodeSVG();
    
    it('with no highlighting, outline or numbering', () => {
      let b = Base.create(svg, 'A', 1, 5);
      b.removeHighlighting();
      b.removeOutline();
      b.removeNumbering();
      let oldTextId = b._text.id();
      b.refreshIds();
      expect(b._text.id()).not.toBe(oldTextId);
    });

    it('with highlighting, outline and numbering', () => {
      let b = Base.create(svg, 'A', 1, 5);
      let h = b.addCircleHighlighting();
      let o = b.addCircleOutline();
      let n = b.addNumbering(5);
      let oldTextId = b._text.id();
      let spies = [
        jest.spyOn(h, 'refreshIds'),
        jest.spyOn(o, 'refreshIds'),
        jest.spyOn(n, 'refreshIds'),
      ];
      b.refreshIds();
      expect(b._text.id()).not.toBe(oldTextId);
      spies.forEach(s => expect(s).toHaveBeenCalled());
    });
  });
});
