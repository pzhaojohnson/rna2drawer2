import Base from './Base';
import NodeSVG from './NodeSVG';
import normalizeAngle from './normalizeAngle';
import { BaseNumbering } from './BaseNumbering';
import { CircleBaseAnnotation } from './BaseAnnotation';
import angleBetween from './angleBetween';
import { distance2D as distance } from 'Math/distance';

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

  describe('character property', () => {
    it('setter only accepts a single character', () => {
      let b = Base.create(svg, 'k', 1, 2);
      expect(b.character).toBe('k');
      b.character = 'P';
      expect(b.character).toBe('P');
      b.character = ''; // no characters
      expect(b.character).toBe('P');
      b.character = 'mn'; // multiple characters
      expect(b.character).toBe('P');
    });

    it('setter maintains center coordinates', () => {
      let b = Base.create(svg, 'G', 22, 53);
      let cx = b.xCenter;
      let cy = b.yCenter;
      let w = b._text.bbox().width;
      b.character = 'i';
      // dimensions did change
      expect(b._text.bbox().width).not.toBeCloseTo(w);
      // but center was still maintained
      expect(b._text.cx()).toBeCloseTo(cx);
      expect(b._text.cy()).toBeCloseTo(cy);
    });
  });

  it('xCenter and yCenter getters', () => {
    let b = Base.create(svg, 'q', 55.8, 245);
    expect(b.xCenter).toBeCloseTo(55.8);
    expect(b.yCenter).toBeCloseTo(245);
  });

  describe('moveTo method', () => {
    describe('moving text when either X or Y coordinate is not close', () => {
      it('X coordinate is not close', () => {
        let b = Base.create(svg, 'W', 55.8, 103.9);
        b.moveTo(805.2, 103.9);
        expect(b._text.cx()).toBeCloseTo(805.2);
        expect(b._text.cy()).toBeCloseTo(103.9);
        expect(b.xCenter).toBeCloseTo(805.2);
        expect(b.yCenter).toBeCloseTo(103.9);
      });

      it('Y coordinate is not close', () => {
        let b = Base.create(svg, 'W', 55.8, 103.9);
        b.moveTo(55.8, 651.8);
        expect(b._text.cx()).toBeCloseTo(55.8);
        expect(b._text.cy()).toBeCloseTo(651.8);
        expect(b.xCenter).toBeCloseTo(55.8);
        expect(b.yCenter).toBeCloseTo(651.8);
      });
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

  it('fill and fillOpacity getters and setters', () => {
    let b = Base.create(svg, 't', 4, 5);
    b.fill = '#4523ab';
    expect(b.fill).toBe('#4523ab'); // check getter
    expect(b._text.attr('fill')).toBe('#4523ab'); // check actual value
    b.fillOpacity = 0.34;
    expect(b.fillOpacity).toBe(0.34); // check getter
    expect(b._text.attr('fill-opacity')).toBe(0.34); // check actual value
  });

  it('cursor getter and setter', () => {
    let b = Base.create(svg, 'e', 4, 5);
    b.cursor = 'crosshair';
    expect(b.cursor).toBe('crosshair'); // check getter
    expect(b._text.css('cursor')).toBe('crosshair'); // check actual value
  });

  it('bringToFront and sendToBack methods', () => {
    let r = svg.rect(50, 60);
    let c1 = svg.circle(100);
    let c2 = svg.circle(10);
    let b = Base.create(svg, 'G', 5, 5);
    b.addCircleOutline();

    expect(b._text.position()).toBeGreaterThan(0); // not already at back
    // cannot just call the backward method of SVG elements
    expect(b._text.position()).toBeGreaterThan(1);
    b.outline.bringToFront(); // must send outline to back too
    b.sendToBack();
    expect(b._text.position()).toBeGreaterThan(0); // kept in front of outline
    b.outline.bringToFront();
    expect(b._text.position()).toBe(0); // only the outline was behind the text

    let marker1 = svg.circle(80);
    b.outline.sendToBack(); // must bring outline to front too
    b.bringToFront();
    let marker2 = svg.circle(120);
    marker2.front();
    // was brought to front and kept in front of outline
    expect(b._text.position()).toBe(marker2.position() - 1);
    // cannot have just called the forward method of SVG elements
    expect(b._text.position()).toBeGreaterThan(2);
    let p1 = marker1.position();
    let p2 = marker2.position();
    b.outline.sendToBack();
    // outline was brought to front too
    expect(marker1.position()).toBeGreaterThan(p1);
    expect(marker2.position()).toBe(p2);
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

  describe('highlighting', () => {
    describe('addCircleHighlighting method', () => {
      it('passes center base coordinates and stores reference', () => {
        let b = Base.create(svg, 'a', 5, 10);
        let h = b.addCircleHighlighting();
        expect(h.xCenter).toBeCloseTo(5);
        expect(h.yCenter).toBeCloseTo(10);
        expect(h.displacementLength).toBeCloseTo(0);
        expect(b.highlighting).toBe(h); // check reference
      });

      it('removes previous highlighting', () => {
        let b = Base.create(svg, 't', 5, 12);
        let h1 = b.addCircleHighlighting();
        let spy = jest.spyOn(h1, 'remove');
        let h2 = b.addCircleHighlighting();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('addCircleHighlightingFromSavedState method', () => {
      it('passes center base coordinates and stores reference', () => {
        let b = Base.create(svg, 'g', 30, 82);
        let h1 = CircleBaseAnnotation.createNondisplaced(svg, b.xCenter, b.yCenter);
        let savableState1 = h1.savableState();
        let h2 = b.addCircleHighlightingFromSavedState(savableState1);
        // requires that center base coordinates were passed
        expect(h2.displacementLength).toBeCloseTo(0);
        expect(b.highlighting).toBe(h2); // check reference
      });

      it('removes previous highlighting', () => {
        let b = Base.create(svg, 'b', 5, 6);
        let h1 = b.addCircleHighlighting();
        let spy = jest.spyOn(h1, 'remove');
        let h2 = CircleBaseAnnotation.createNondisplaced(svg, b.xCenter, b.yCenter);
        let savableState2 = h2.savableState();
        let h3 = b.addCircleHighlightingFromSavedState(savableState2);
        expect(spy).toHaveBeenCalled();
      });
    });

    it('hasHighlighting method and highlighting getter', () => {
      let b = Base.create(svg, 'h', 10, 20);
      expect(b.hasHighlighting()).toBeFalsy();
      expect(b.highlighting).toBe(null);
      let h = b.addCircleHighlighting();
      expect(b.hasHighlighting()).toBeTruthy();
      expect(b.highlighting).toBe(h);
      b.removeHighlighting();
      expect(b.hasHighlighting()).toBeFalsy();
      expect(b.highlighting).toBe(null);
    });

    describe('removeHighlighting method', () => {
      it('removes highlighting and reference', () => {
        let b = Base.create(svg, 'b', 1, 5);
        let h = b.addCircleHighlighting();
        let spy = jest.spyOn(h, 'remove');
        b.removeHighlighting();
        expect(spy).toHaveBeenCalled();
        expect(b.highlighting).toBe(null); // check reference
      });

      it('can be called with no highlighting', () => {
        let b = Base.create(svg, 'a', 1, 2);
        expect(b.hasHighlighting()).toBeFalsy();
        expect(() => b.removeHighlighting()).not.toThrow();
      });
    });
  });

  describe('outline', () => {
    describe('addCircleOutline method', () => {
      it('passes center base coordinates and stores reference', () => {
        let b = Base.create(svg, 'g', 10, 28);
        let o = b.addCircleOutline();
        expect(o.xCenter).toBeCloseTo(10);
        expect(o.yCenter).toBeCloseTo(28);
        expect(o.displacementLength).toBeCloseTo(0);
        expect(b.outline).toBe(o); // check reference
      });

      it('removes previous outline', () => {
        let b = Base.create(svg, 'Q', 5, 8);
        let o1 = b.addCircleOutline();
        let spy = jest.spyOn(o1, 'remove');
        let o2 = b.addCircleOutline();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('addCircleOutlineFromSavedState method', () => {
      it('passes saved state and center base coordinates and stores reference', () => {
        let b = Base.create(svg, 'H', 30, 60);
        let o1 = CircleBaseAnnotation.createNondisplaced(svg, b.xCenter, b.yCenter);
        let savableState1 = o1.savableState();
        let o2 = b.addCircleOutlineFromSavedState(savableState1);
        expect(o2.id).toBe(o1.id);
        // requires that center base coordinates were passed
        expect(o2.displacementLength).toBeCloseTo(0);
        expect(b.outline).toBe(o2); // check reference
      });

      it('removes previous outline', () => {
        let b = Base.create(svg, 'q', 5, 10);
        let o1 = b.addCircleOutline();
        let spy = jest.spyOn(o1, 'remove');
        let o2 = CircleBaseAnnotation.createNondisplaced(svg, b.xCenter, b.yCenter);
        let savableState2 = o2.savableState();
        let o3 = b.addCircleOutlineFromSavedState(savableState2);
        expect(spy).toHaveBeenCalled();
      });
    });

    it('hasOutline method and outline getter', () => {
      let b = Base.create(svg, 'h', 100, 112);
      expect(b.hasOutline()).toBeFalsy();
      expect(b.outline).toBe(null);
      let o = b.addCircleOutline();
      expect(b.hasOutline()).toBeTruthy();
      expect(b.outline).toBe(o);
      b.removeOutline();
      expect(b.hasOutline()).toBeFalsy();
      expect(b.outline).toBe(null);
    });

    describe('removeOutline method', () => {
      it('removes outline and reference', () => {
        let b = Base.create(svg, 'b', 5, 2);
        let o = b.addCircleOutline();
        let spy = jest.spyOn(o, 'remove');
        b.removeOutline();
        expect(spy).toHaveBeenCalled();
        expect(b.outline).toBe(null);
      });

      it('can be called without outline', () => {
        let b = Base.create(svg, 'a', 1, 2);
        expect(b.hasOutline()).toBeFalsy();
        expect(() => b.removeOutline()).not.toThrow();
      });
    });
  });

  describe('numbering', () => {
    describe('addNumbering method', () => {
      it('creates with number and passes center base coordinates and stores reference', () => {
        let b = Base.create(svg, 'G', 20, 80);
        let spy = jest.spyOn(BaseNumbering, 'create');
        let n = b.addNumbering(2056);
        expect(n.number).toBe(2056);
        let c = spy.mock.calls[0];
        expect(c[2]).toBe(b.xCenter);
        expect(c[3]).toBe(b.yCenter);
        expect(b.numbering).toBe(n); // check reference
      });

      it('removes previous numbering', () => {
        let b = Base.create(svg, 'G', 200, 800);
        let n1 = b.addNumbering(1);
        let spy = jest.spyOn(n1, 'remove');
        let n2 = b.addNumbering(2);
        expect(b.numbering).toBe(n2);
        expect(spy).toHaveBeenCalled();
      });

      it('handles throw by BaseNumbering class', () => {
        let b = Base.create(svg, 'G', 2, 8);
        let n = b.addNumbering('asdf');
        expect(n).toBe(null);
        expect(b.numbering).toBe(null);
      });
    });

    describe('addNumberingFromSavedState method', () => {
      it('passes saved state and center base coordinates and stores reference', () => {
        let b = Base.create(svg, 'G', 15, 30);
        let n1 = BaseNumbering.create(svg, 852, b.xCenter, b.yCenter);
        let savableState1 = n1.savableState();
        let n2 = b.addNumberingFromSavedState(savableState1);
        expect(n2.number).toBe(852);
        // requires that center base coordinates were passed
        expect(n2.basePadding).toBeCloseTo(n1.basePadding);
        expect(b.numbering).toBe(n2); // check reference
      });

      it('removes previous numbering', () => {
        let b = Base.create(svg, 'G', 30, 6);
        let n1 = BaseNumbering.create(svg, 1, b.xCenter, b.yCenter);
        let savableState1 = n1.savableState();
        let n2 = b.addNumbering(2);
        let spy = jest.spyOn(n2, 'remove');
        b.addNumberingFromSavedState(savableState1);
        expect(b.numbering.number).toBe(1);
        expect(spy).toHaveBeenCalled();
      });
    });

    it('hasNumbering method and numbering getter', () => {
      let b = Base.create(svg, 'Q', 5, 12);
      expect(b.hasNumbering()).toBeFalsy();
      expect(b.numbering).toBe(null);
      b.addNumbering(6);
      expect(b.hasNumbering()).toBeTruthy();
      expect(b.numbering.number).toBe(6);
      b.removeNumbering();
      expect(b.hasNumbering()).toBeFalsy();
      expect(b.numbering).toBe(null);
    });

    describe('removeNumbering method', () => {
      it('removes numbering and reference', () => {
        let b = Base.create(svg, 'G', 50, 25);
        let n = b.addNumbering(1);
        let spy = jest.spyOn(n, 'remove');
        b.removeNumbering();
        expect(spy).toHaveBeenCalled();
        expect(b.numbering).toBe(null);
      });

      it('can be called without numbering', () => {
        let b = Base.create(svg, 'G', 100, 200);
        expect(b.hasNumbering()).toBeFalsy();
        expect(() => b.removeNumbering()).not.toThrow();
      });
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
