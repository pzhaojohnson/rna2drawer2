import Base from './Base';
import NodeSVG from './NodeSVG';
import normalizeAngle from './normalizeAngle';
import BaseNumbering from './BaseNumbering';
import { CircleBaseAnnotation } from './BaseAnnotation';
import angleBetween from './angleBetween';
import distanceBetween from './distanceBetween';

let svg = NodeSVG();

describe('Base class', () => {
  it('mostRecentProps static method returns a copy', () => {
    Base._mostRecentProps.fontFamily = 'Tahoe';
    Base._mostRecentProps.fontSize = 4.567;
    Base._mostRecentProps.fontWeight = 'bolder';
    Base._mostRecentProps.fontStyle = 'oblique';
    let mrps = Base.mostRecentProps();
    expect(mrps.fontFamily).toBe('Tahoe');
    expect(mrps.fontSize).toBeCloseTo(4.567, 6);
    expect(mrps.fontWeight).toBe('bolder');
    expect(mrps.fontStyle).toBe('oblique');
    expect(mrps).not.toBe(Base._mostRecentProps); // is a new object
  });

  it('_applyMostRecentProps static method', () => {
    let b = Base.create(svg, 'G', 3, 4);
    Base._mostRecentProps.fontFamily = 'Cambria';
    Base._mostRecentProps.fontSize = 4.88;
    Base._mostRecentProps.fontWeight = 600;
    Base._mostRecentProps.fontStyle = 'italic';
    Base._applyMostRecentProps(b);
    expect(b.fontFamily).toBe('Cambria');
    expect(b.fontSize).toBe(4.88);
    expect(b.fontWeight).toBe(600);
    expect(b.fontStyle).toBe('italic');
  });

  it('_copyPropsToMostRecent static method', () => {
    let t = svg.text(add => add.tspan('A'));
    t.attr({
      'font-family': 'Impact',
      'font-size': 4.447,
      'font-weight': 'lighter',
      'font-style': 'oblique',
    });
    let b = new Base(t);
    let mrps = Base.mostRecentProps();
    Base._copyPropsToMostRecent(b);
    mrps = Base.mostRecentProps();
    expect(mrps.fontFamily).toBe('Impact');
    expect(mrps.fontSize).toBe(4.447);
    expect(mrps.fontWeight).toBe('lighter');
    expect(mrps.fontStyle).toBe('oblique');
  });

  describe('fromSavedState static method', () => {
    describe('from valid saved state', () => {
      /* By only including one of highlighting, outline and numbering
      in the saved state, we test that the if clauses in the fromSavedState
      method each check for the presence of the correct element. */

      it('includes text', () => {
        let b1 = Base.create(svg, 'v', 90, 80);
        let savableState = b1.savableState();
        let b2 = Base.fromSavedState(savableState, svg);
        expect(b2.character).toBe('v');
      });

      it('can include highlighting', () => {
        // and handles missing outline and numbering
        let b1 = Base.create(svg, 'a', 4, 5);
        let h1 = b1.addCircleHighlighting();
        let savableState = b1.savableState();
        let b2 = Base.fromSavedState(savableState, svg);
        let h2 = b2.highlighting;
        expect(h2.id).toBe(h1.id);
      });

      it('can include outline', () => {
        // and handles missing highlighting and numbering
        let b1 = Base.create(svg, 'b', 5, 6);
        let o1 = b1.addCircleOutline();
        let savableState = b1.savableState();
        let b2 = Base.fromSavedState(savableState, svg);
        expect(b2.outline.id).toBe(o1.id);
      });

      it('can include numbering', () => {
        // and handles missing highlighting and outline
        let b1 = Base.create(svg, 't', 10, 11);
        let n1 = b1.addNumbering(10);
        let savableState = b1.savableState();
        let b2 = Base.fromSavedState(savableState, svg);
        expect(b2.numbering.id).toBe(n1.id);
      });

      it('copies props to most recent', () => {
        let b1 = Base.create(svg, 'T', 1, 1);
        let savableState = b1.savableState();
        let spy = jest.spyOn(Base, '_copyPropsToMostRecent');
        let b2 = Base.fromSavedState(savableState, svg);
        expect(spy.mock.calls[0][0]).toBe(b2);
      });
    });

    describe('from invalid saved state', () => {
      it('wrong className', () => {
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

  describe('create static method', () => {
    it('creates with character and center coordinates', () => {
      let b = Base.create(svg, 'r', 8, 77);
      expect(b.character).toBe('r');
      expect(b.xCenter).toBe(8);
      expect(b.yCenter).toBe(77);
    });

    it('applies most recent props', () => {
      let spy = jest.spyOn(Base, '_applyMostRecentProps');
      let b = Base.create(svg, 'A', 4, 5);
      expect(spy.mock.calls[0][0]).toBe(b);
    });
  });

  describe('createOutOfView static method', () => {
    it('creates with character and out of view', () => {
      let b = Base.createOutOfView(svg, 'I');
      expect(b.character).toBe('I');
      expect(b.xCenter < -50 || b.yCenter < -50).toBeTruthy();
    });
  });

  describe('constructor', () => {
    it('stores text', () => {
      let t = svg.text(add => add.tspan('w'));
      let b = new Base(t);
      expect(b._text).toBe(t);
    });

    describe('validates text', () => {
      it('missing argument', () => {
        expect(() => new Base()).toThrow();
      });

      it('wrong element type', () => {
        let c = svg.circle(20);
        expect(() => new Base(c)).toThrow();
      });

      it('initializes ID', () => {
        let t = svg.text(add => add.tspan('T'));
        expect(t.attr('id')).toBe(undefined);
        let b = new Base(t);
        expect(t.attr('id')).toBeTruthy();
      });

      it('no characters', () => {
        let t = svg.text(add => add.tspan(''));
        expect(() => new Base(t)).toThrow();
      });

      it('too many characters', () => {
        let t = svg.text(add => add.tspan('qwe'));
        expect(() => new Base(t)).toThrow();
      });
    });
  });

  it('id getter', () => {
    let t = svg.text(add => add.tspan('T'));
    let id = t.id('asdfqwer');
    let b = new Base(t);
    expect(b.id).toEqual('asdfqwer');
  });

  it('character getter and setter', () => {
    let b = Base.create(svg, 'k', 1, 2);
    expect(b.character).toBe('k');
    b.character = 'P';
    expect(b.character).toBe('P');
    b.character = ''; // an empty string
    expect(b.character).toBe('P');
    b.character = 'mn'; // more than a single character
    expect(b.character).toBe('P');
  });

  it('xCenter and yCenter getters', () => {
    let b = Base.create(svg, 'q', 55.8, 245);
    expect(b.xCenter).toBeCloseTo(55.8);
    expect(b.yCenter).toBeCloseTo(245);
  });

  describe('moveTo method', () => {
    it('shifts text and updates center coordinates', () => {
      let b = Base.create(svg, 'W', 55.8, 103.9);
      b.moveTo(805.2, 651.8);
      expect(b._text.cx()).toBeCloseTo(805.2);
      expect(b._text.cy()).toBeCloseTo(651.8);
      expect(b.xCenter).toBeCloseTo(805.2);
      expect(b.yCenter).toBeCloseTo(651.8);
    });

    /* By testing highlighting, outline and numbering separately,
    we test that the if clauses of the moveTo method work correctly. */
    
    it('can reposition highlighting', () => {
      // with no outline or numbering
      let b = Base.create(svg, 't', 1, 2);
      let h = b.addCircleHighlighting();
      h.shift(5, 4);
      let da = normalizeAngle(h.displacementAngle);
      b.moveTo(8, 9);
      let a = angleBetween(8, 9, h.xCenter, h.yCenter);
      // requires that base center coordinates were passed
      expect(normalizeAngle(a)).toBeCloseTo(da);
    });

    it('can reposition outline', () => {
      // with no highlighting or numbering
      let b = Base.create(svg, 'e', 3, 8);
      let o = b.addCircleOutline();
      o.shift(-2, 55);
      let da = normalizeAngle(o.displacementAngle);
      b.moveTo(55, 38);
      let a = angleBetween(55, 38, o.xCenter, o.yCenter);
      // requires that base center coordinates were passed
      expect(normalizeAngle(a)).toBeCloseTo(da);
    });

    it('can reposition numbering', () => {
      // with no highlighting or outline
      let b = Base.create(svg, 'e', 1, 5);
      let n = b.addNumbering(112);
      let bp = n.basePadding;
      b.moveTo(20, 40);
      // requires that base center coordinates were passed
      expect(n.basePadding).toBeCloseTo(bp);
    });
  });

  it('distanceBetweenCenters and angleBetweenCenters methods', () => {
    let b1 = Base.create(svg, 'A', 1, 2);
    let b2 = Base.create(svg, 'U', 4, 6);
    expect(b1.distanceBetweenCenters(b2)).toBeCloseTo(5, 3);
    let a = angleBetween(1, 2, 4, 6);
    expect(normalizeAngle(a)).toBeCloseTo(Math.asin(4 / 5));
  });

  it('fontFamily getter and setter', () => {
    let b = Base.create(svg, 'a', 1, 2);
    b.fontFamily = 'Cambria';
    expect(b.fontFamily).toBe('Cambria'); // check getter
    expect(b._text.attr('font-family')).toBe('Cambria'); // check actual value
    // maintains center coordinates
    expect(b._text.cx()).toBeCloseTo(1);
    expect(b._text.cy()).toBeCloseTo(2);
  });

  it('fontSize getter and setter', () => {
    let b = Base.create(svg, 'e', 5, 6);
    b.fontSize = 5.123;
    expect(b.fontSize).toBe(5.123); // check getter
    expect(b._text.attr('font-size')).toBe(5.123); // check actual value
    // maintains center coordinates
    expect(b._text.cx()).toBeCloseTo(5);
    expect(b._text.cy()).toBeCloseTo(6);
  });

  it('fontWeight getter and setter', () => {
    let b = Base.create(svg, 'a', 1, 4);
    b.fontWeight = 650;
    expect(b.fontWeight).toBe(650); // check getter
    expect(b._text.attr('font-weight')).toBe(650); // check actual value
    // maintains center coordinates
    expect(b._text.cx()).toBeCloseTo(1);
    expect(b._text.cy()).toBeCloseTo(4);
  });

  it('fontStyle getter and setter', () => {
    let b = Base.create(svg, 'E', 5, 15);
    b.fontStyle = 'italic';
    expect(b.fontStyle).toBe('italic'); // check getter
    expect(b._text.attr('font-style')).toBe('italic'); // check actual value
    // maintains center coordinates
    expect(b._text.cx()).toBeCloseTo(5);
    expect(b._text.cy()).toBeCloseTo(15);
  });

  it('fill getter and setter', () => {
    let b = Base.create(svg, 't', 4, 5);
    b.fill = '#4523ab';
    expect(b.fill).toBe('#4523ab'); // check getter
    expect(b._text.attr('fill')).toBe('#4523ab'); // check actual value
  });

  it('cursor getter and setter', () => {
    let b = Base.create(svg, 'e', 4, 5);
    b.cursor = 'crosshair';
    expect(b.cursor).toBe('crosshair'); // check getter
    expect(b._text.css('cursor')).toBe('crosshair'); // check actual value
  });
  
  describe('binding events', () => {
    let b = Base.create(svg, 'h', 50, 100);

    it('onMouseover method', () => {
      let f = jest.fn();
      b.onMouseover(f);
      b._text.fire('mouseover');
      expect(f).toHaveBeenCalled();
    });

    it('onMouseout method', () => {
      let f = jest.fn();
      b.onMouseout(f);
      b._text.fire('mouseout');
      expect(f).toHaveBeenCalled();
    });

    it('onMousedown method', () => {
      let f = jest.fn();
      b.onMousedown(f);
      b._text.fire('mousedown');
      expect(f).toHaveBeenCalled();
    });

    it('onDblclick method', () => {
      let f = jest.fn();
      b.onDblclick(f);
      b._text.fire('dblclick');
      expect(f).toHaveBeenCalled();
    });
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

  it('remove method', () => {
    let b = Base.create(svg, 'a', 5, 5);
    let textId = '#' + b._text.id();
    expect(svg.findOne(textId)).toBeTruthy();
    let spies = [
      jest.spyOn(b, 'removeHighlighting'),
      jest.spyOn(b, 'removeOutline'),
      jest.spyOn(b, 'removeNumbering'),
    ];
    b.remove();
    expect(svg.findOne(textId)).toBeFalsy();
    spies.forEach(s => expect(s).toHaveBeenCalled());
  });

  describe('savableState method', () => {
    it('includes className and text', () => {
      let b = Base.create(svg, 'a', 1, 2);
      let savableState = b.savableState();
      expect(savableState.className).toBe('Base');
      expect(savableState.textId).toBe(b._text.id());
    });

    /* By testing highlighting, outline and numbering separately,
    we test that the conditional clauses work correctly. */

    it('can include highlighting', () => {
      // with no outline or numbering
      let b = Base.create(svg, 'q', 10, 20);
      let h = b.addCircleHighlighting();
      let savableState = b.savableState();
      expect(JSON.stringify(savableState.highlighting)).toBe(JSON.stringify(h.savableState()));
    });

    it('can include outline', () => {
      // with no highlighting or numbering
      let b = Base.create(svg, 'b', 100, 200);
      let o = b.addCircleOutline();
      let savableState = b.savableState();
      expect(JSON.stringify(savableState.outline)).toBe(JSON.stringify(o.savableState()));
    });

    it('can include numbering', () => {
      // with no highlighting or outline
      let b = Base.create(svg, 'R', 0, 1);
      let n = b.addNumbering(1000);
      let savableState = b.savableState();
      expect(JSON.stringify(savableState.numbering)).toBe(JSON.stringify(n.savableState()));
    });

    describe('can be converted to and from a JSON string', () => {
      it('with highlighting, outline and numbering', () => {
        let b = Base.create(svg, 'n', 20, 50);
        b.addCircleHighlighting();
        b.addCircleOutline();
        b.addNumbering(100);
        let savableState = b.savableState();
        let json = JSON.stringify(savableState);
        let parsed = JSON.parse(json);
        expect(JSON.stringify(parsed)).toBe(json);
      });
    });
  });

  describe('refreshIds method', () => {
    it('refreshes text ID and handles no highlighting, outline or numbering', () => {
      let b = Base.create(svg, 'A', 1, 5);
      expect(b.hasHighlighting()).toBeFalsy();
      expect(b.hasOutline()).toBeFalsy();
      expect(b.hasNumbering()).toBeFalsy();
      let oldTextId = b._text.id();
      b.refreshIds();
      expect(b._text.id()).not.toBe(oldTextId);
    });

    it('can refresh highlighting, outline and numbering IDs', () => {
      let b = Base.create(svg, 'A', 1, 5);
      let h = b.addCircleHighlighting();
      let o = b.addCircleOutline();
      let n = b.addNumbering(5);
      let spies = [
        jest.spyOn(h, 'refreshIds'),
        jest.spyOn(o, 'refreshIds'),
        jest.spyOn(n, 'refreshIds'),
      ];
      b.refreshIds();
      spies.forEach(s => expect(s).toHaveBeenCalled());
    });
  });
});
