import { Base } from './Base';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import normalizeAngle from 'Draw/normalizeAngle';
import { addCircleHighlighting, addCircleOutline } from 'Draw/bases/annotate/circle/add';
import { addNumbering } from 'Draw/bases/number/add';
import angleBetween from 'Draw/angleBetween';
import { distance2D as distance } from 'Math/distance';

let svg = NodeSVG();

describe('Base class', () => {
  describe('create static method', () => {
    it('creates with character and center coordinates', () => {
      let b = Base.create(svg, 'r', 8, 77);
      expect(b.character).toBe('r');
      expect(b.xCenter).toBe(8);
      expect(b.yCenter).toBe(77);
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
      expect(b.text).toBe(t);
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
      let w = b.text.bbox().width;
      b.character = 'i';
      // dimensions did change
      expect(b.text.bbox().width).not.toBeCloseTo(w);
      // but center was still maintained
      expect(b.text.cx()).toBeCloseTo(cx);
      expect(b.text.cy()).toBeCloseTo(cy);
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
        expect(b.text.cx()).toBeCloseTo(805.2);
        expect(b.text.cy()).toBeCloseTo(103.9);
        expect(b.xCenter).toBeCloseTo(805.2);
        expect(b.yCenter).toBeCloseTo(103.9);
      });

      it('Y coordinate is not close', () => {
        let b = Base.create(svg, 'W', 55.8, 103.9);
        b.moveTo(55.8, 651.8);
        expect(b.text.cx()).toBeCloseTo(55.8);
        expect(b.text.cy()).toBeCloseTo(651.8);
        expect(b.xCenter).toBeCloseTo(55.8);
        expect(b.yCenter).toBeCloseTo(651.8);
      });
    });

    /* By testing highlighting, outline and numbering separately,
    we test that the if clauses of the moveTo method work correctly. */

    it('can reposition highlighting', () => {
      // with no outline or numbering
      let b = Base.create(svg, 't', 1, 2);
      addCircleHighlighting(b);
      let h = b.highlighting;
      b.moveTo(8, 9);
      expect(h.circle.attr('cx')).toBeCloseTo(8);
      expect(h.circle.attr('cy')).toBeCloseTo(9);
    });

    it('can reposition outline', () => {
      // with no highlighting or numbering
      let b = Base.create(svg, 'e', 3, 8);
      addCircleOutline(b);
      let o = b.outline;
      b.moveTo(55, 38);
      expect(o.circle.attr('cx')).toBeCloseTo(55);
      expect(o.circle.attr('cy')).toBeCloseTo(38);
    });

    it('can reposition numbering', () => {
      // with no highlighting or outline
      let b = Base.create(svg, 'e', 1, 5);
      addNumbering(b, 112);
      let n = b.numbering;
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
});
