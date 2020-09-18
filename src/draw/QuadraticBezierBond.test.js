import {
  QuadraticBezierBond,
  TertiaryBond,
} from './QuadraticBezierBond';
import NodeSVG from './NodeSVG';
import Base from './Base';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

let svg = NodeSVG();

describe('QuadraticBezierBond class', () => {
  it('_dPath static method', () => {
    let b1 = Base.create(svg, 'Q', 2, 8);
    let b2 = Base.create(svg, 'B', 45, 200);
    let d = QuadraticBezierBond._dPath(b1, b2, 10, 12, 98, 2 * Math.PI / 3);
    let p = svg.path(d);
    let pa = p.array();
    let m = pa[0];
    let q = pa[1];
    expect(distanceBetween(b1.xCenter, b1.yCenter, m[1], m[2])).toBeCloseTo(10);
    expect(distanceBetween(b2.xCenter, b2.yCenter, q[3], q[4])).toBeCloseTo(12);
    let xMiddle = (b1.xCenter + b2.xCenter) / 2;
    let yMiddle = (b1.yCenter + b2.yCenter) / 2;
    expect(distanceBetween(xMiddle, yMiddle, q[1], q[2])).toBeCloseTo(98);
    let ca = angleBetween(xMiddle, yMiddle, q[1], q[2]);
    let a12 = b1.angleBetweenCenters(b2);
    expect(normalizeAngle(ca, a12) - a12).toBeCloseTo(2 * Math.PI / 3);
  });

  describe('constructor', () => {
    let b1 = Base.create(svg, 'a', 5, 10);
    let b2 = Base.create(svg, 'Q', 100, 200);

    it('throws on missing path element', () => {
      expect(() => new QuadraticBezierBond(undefined, b1, b2)).toThrow();
    });

    it('throws on wrong element type', () => {
      let c = svg.circle(20);
      expect(() => new QuadraticBezierBond(c, b1, b2)).toThrow();
    });

    it('initializes path ID', () => {
      let d = QuadraticBezierBond._dPath(b1, b2, 5, 5, 20, Math.PI / 2);
      let p = svg.path(d);
      expect(p.attr('id')).toBe(undefined);
      let qbb = new QuadraticBezierBond(p, b1, b2);
      expect(p.attr('id')).toBeTruthy();
    });

    it('sets path fill opacity to zero', () => {
      let d = QuadraticBezierBond._dPath(b1, b2, 10, 15, 10, Math.PI / 3);
      let p = svg.path(d);
      p.attr({ 'fill-opacity': 1 });
      let qbb = new QuadraticBezierBond(p, b1, b2);
      expect(p.attr('fill-opacity')).toBe(0);
    });

    it('throws on wrong path segments', () => {
      let p = svg.path('M 1 2 Q 1 5 8 9 Q 2 10 11 20'); // too many segments
      expect(() => new QuadraticBezierBond(p, b1, b2)).toThrow();
      p = svg.path('L 1 2 Q 1 5 10 15'); // first segment is not M
      expect(() => new QuadraticBezierBond(p, b1, b2)).toThrow();
      p = svg.path('M 5 8 L 5 9'); // second segment is not Q
      expect(() => new QuadraticBezierBond(p, b1, b2)).toThrow();
    });
  });

  it('id and base getters', () => {
    let p = svg.path('M 1 2 Q 4 5 6 7');
    p.id('asdfzxcv');
    let b1 = Base.create(svg, 'h', 1, 5);
    let b2 = Base.create(svg, 'y', 1, 1);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    expect(qbb.id).toBe('asdfzxcv');
    expect(qbb.base1).toBe(b1);
    expect(qbb.base2).toBe(b2);
  });

  it('contains method', () => {
    let p = svg.path('M 1 2 Q 4 5 6 7');
    let b1 = Base.create(svg, 'h', 1, 5);
    let b2 = Base.create(svg, 'y', 1, 1);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    expect(qbb.contains(b1)).toBeTruthy();
    expect(qbb.contains(b2)).toBeTruthy();
    let b3 = Base.create(svg, 'b', 2, 2);
    expect(qbb.contains(b3)).toBeFalsy();
  });

  it('x1, y1, x2, y2, xControl and yControl getters', () => {
    let p = svg.path('M 1.2 4.3 Q 100 200.3 30 45.5');
    let b1 = Base.create(svg, 'b', 1, 2);
    let b2 = Base.create(svg, 'n', 4, 4);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    expect(qbb.x1).toBeCloseTo(1.2);
    expect(qbb.y1).toBeCloseTo(4.3);
    expect(qbb.x2).toBeCloseTo(30);
    expect(qbb.y2).toBeCloseTo(45.5);
    expect(qbb.xControl).toBeCloseTo(100);
    expect(qbb.yControl).toBeCloseTo(200.3);
  });

  it('padding1 getter and setter', () => {
    let b1 = Base.create(svg, 'a', 100, 200);
    let b2 = Base.create(svg, 'q', 500, 800);
    let d = QuadraticBezierBond._dPath(b1, b2, 12, 20, 100, Math.PI / 3);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    expect(qbb.getPadding1()).toBeCloseTo(12); // check getter
    qbb.setPadding1(30); // use setter
    expect(qbb.getPadding1()).toBeCloseTo(30); // check getter
    // check actual value
    expect(distanceBetween(100, 200, qbb.x1, qbb.y1)).toBeCloseTo(30);
    // maintains other aspects of path positioning
    expect(qbb.getPadding2()).toBeCloseTo(20);
    expect(qbb._controlHeight).toBeCloseTo(100);
    expect(normalizeAngle(qbb._controlAngle)).toBeCloseTo(Math.PI / 3);
  });

  it('padding2 getter and setter', () => {
    let b1 = Base.create(svg, 'q', 800, 1000);
    let b2 = Base.create(svg, 'a', 200, 500);
    let d = QuadraticBezierBond._dPath(b1, b2, 10, 18, 25, 2 * Math.PI / 3);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    expect(qbb.getPadding2()).toBeCloseTo(18); // check getter
    qbb.setPadding2(28); // use setter
    expect(qbb.getPadding2()).toBeCloseTo(28); // check getter
    // check actual value
    expect(distanceBetween(200, 500, qbb.x2, qbb.y2)).toBeCloseTo(28);
    // maintains other aspects of path positioning
    expect(qbb.getPadding1()).toBeCloseTo(10);
    expect(qbb._controlHeight).toBeCloseTo(25);
    expect(normalizeAngle(qbb._controlAngle)).toBeCloseTo(2 * Math.PI / 3);
  });

  it('shiftControl method', () => {
    let b1 = Base.create(svg, 'T', 20, 30);
    let b2 = Base.create(svg, 'b', 2000, 300);
    let d = QuadraticBezierBond._dPath(b1, b2, 8, 12, 300, Math.PI / 3);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    let unshifted = p.array();
    qbb.shiftControl(-50, 120);
    let shifted = p.array();
    // check control coordinates
    expect(shifted[1][1]).toBeCloseTo(unshifted[1][1] - 50);
    expect(shifted[1][2]).toBeCloseTo(unshifted[1][2] + 120);
    // maintains paddings
    expect(qbb.getPadding1()).toBeCloseTo(8);
    expect(qbb.getPadding2()).toBeCloseTo(12);
  });

  it('reposition method', () => {
    let b1 = Base.create(svg, 'H', 4, 9);
    let b2 = Base.create(svg, 'j', -2000, -500);
    let d = QuadraticBezierBond._dPath(b1, b2, 20, 15, 1000, 2 * Math.PI / 3);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    b1.moveTo(200, 259);
    b2.moveTo(-2500, -800);
    qbb.reposition();
    // check padding1
    expect(qbb.getPadding1()).toBeCloseTo(20); // check getter
    expect(distanceBetween(200, 259, qbb.x1, qbb.y1)).toBeCloseTo(20); // check actual value
    // check padding2
    expect(qbb.getPadding2()).toBeCloseTo(15); // check getter
    expect(distanceBetween(-2500, -800, qbb.x2, qbb.y2)).toBeCloseTo(15); // check actual value
    // check control coordinates
    let xMiddle = (b1.xCenter + b2.xCenter) / 2;
    let yMiddle = (b1.yCenter + b2.yCenter) / 2;
    expect(distanceBetween(xMiddle, yMiddle, qbb.xControl, qbb.yControl)).toBeCloseTo(1000);
    let ca = angleBetween(xMiddle, yMiddle, qbb.xControl, qbb.yControl);
    let a12 = b1.angleBetweenCenters(b2);
    expect(normalizeAngle(ca, a12) - a12).toBeCloseTo(2 * Math.PI / 3);
  });

  it('stroke, strokeWidth, strokeOpacity and strokeDasharray getters and setters', () => {
    let b1 = Base.create(svg, 'a', 50, 40);
    let b2 = Base.create(svg, 'n', 100, 300);
    let d = QuadraticBezierBond._dPath(b1, b2, 6, 8, 200, Math.PI / 6);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    qbb.setStroke('#132435'); // use setter
    expect(qbb.getStroke()).toBe('#132435'); // check getter
    expect(p.attr('stroke')).toBe('#132435'); // check actual value
    qbb.setStrokeWidth(3.44); // use setter
    expect(qbb.getStrokeWidth()).toBe(3.44); // check getter
    expect(p.attr('stroke-width')).toBe(3.44); // check actual value
    qbb.setStrokeOpacity(0.41); // use setter
    expect(qbb.getStrokeOpacity()).toBe(0.41); // check getter
    expect(qbb._path.attr('stroke-opacity')).toBe(0.41); // check actual value
    qbb.setStrokeDasharray('3 1 6 7'); // use setter
    expect(qbb.getStrokeDasharray()).toBe('3 1 6 7'); // check getter
    expect(p.attr('stroke-dasharray')).toBe('3 1 6 7'); // check actual value
  });

  it('fill, fillOpacity and cursor getters and setters', () => {
    let b1 = Base.create(svg, 'A', 10, 20);
    let b2 = Base.create(svg, 'g', 800, 200);
    let d = QuadraticBezierBond._dPath(b1, b2, 10, 50, 80, Math.PI / 5);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    qbb.fill = '#1324ab'; // use setter
    expect(qbb.fill).toBe('#1324ab'); // check getter
    expect(qbb._path.attr('fill')).toBe('#1324ab'); // check actual value
    qbb.fillOpacity = 0.29; // use setter
    expect(qbb.fillOpacity).toBe(0.29); // check getter
    expect(qbb._path.attr('fill-opacity')).toBe(0.29); // check actual value
    expect(qbb.cursor).not.toBe('pointer'); // below test of setter will be valid
    qbb.cursor = 'pointer'; // use setter
    expect(qbb.cursor).toBe('pointer'); // check getter
    expect(p.css('cursor')).toBe('pointer'); // check actual value
  });

  describe('binding events', () => {
    let b1 = Base.create(svg, 'b', 1, 2);
    let b2 = Base.create(svg, 'r', 5, 9);
    let d = QuadraticBezierBond._dPath(b1, b2, 7, 8, 25, Math.PI / 3);
    let p = svg.path(d);
    let qbb = new QuadraticBezierBond(p, b1, b2);

    it('onMouseover method', () => {
      let f = jest.fn();
      qbb.onMouseover(f);
      p.fire('mouseover');
      expect(f).toHaveBeenCalled();
    });

    it('onMouseout method', () => {
      let f = jest.fn();
      qbb.onMouseout(f);
      p.fire('mouseout');
      expect(f).toHaveBeenCalled();
    });

    it('onMousedown method', () => {
      let f = jest.fn();
      qbb.onMousedown(f);
      p.fire('mousedown');
      expect(f).toHaveBeenCalled();
    });

    it('onDblclick method', () => {
      let f = jest.fn();
      qbb.onDblclick(f);
      p.fire('dblclick');
      expect(f).toHaveBeenCalled();
    });
  });

  it('remove and hasBeenRemoved methods', () => {
    let p = svg.path('M 1 2 Q 3 4 5 6');
    let b1 = Base.create(svg, 'v', 1, 2);
    let b2 = Base.create(svg, 'n', 5, 10);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    let id = '#' + p.id();
    expect(svg.findOne(id)).toBeTruthy();
    expect(qbb.hasBeenRemoved()).toBeFalsy();
    qbb.remove();
    expect(svg.findOne(id)).toBeFalsy();
    expect(qbb.hasBeenRemoved()).toBeTruthy();
  });

  describe('savableState method', () => {
    it('includes className, path and bases', () => {
      let p = svg.path('M 1 2 Q 5 5 6 7');
      let b1 = Base.create(svg, 'b', 1, 5);
      let b2 = Base.create(svg, 'N', 5, 3);
      let qbb = new QuadraticBezierBond(p, b1, b2);
      let savableState = qbb.savableState();
      expect(savableState.className).toBe('QuadraticBezierBond');
      expect(savableState.pathId).toBe(p.id());
      expect(savableState.baseId1).toBe(b1.id);
      expect(savableState.baseId2).toBe(b2.id);
    });

    it('can be converted to and from a JSON string', () => {
      let p = svg.path('M 1 2 Q 5 5 6 7');
      let b1 = Base.create(svg, 'b', 1, 5);
      let b2 = Base.create(svg, 'N', 5, 3);
      let qbb = new QuadraticBezierBond(p, b1, b2);
      let savableState = qbb.savableState();
      let json = JSON.stringify(savableState);
      let parsed = JSON.parse(json);
      expect(JSON.stringify(parsed)).toBe(json);
    });
  });

  it('refreshIds method', () => {
    let p = svg.path('M 1 2 Q 5 5 6 7');
    let b1 = Base.create(svg, 'b', 1, 5);
    let b2 = Base.create(svg, 'N', 5, 3);
    let qbb = new QuadraticBezierBond(p, b1, b2);
    let oldId = qbb._path.id();
    qbb.refreshIds();
    expect(qbb._path.id()).not.toBe(oldId);
  });
});

function getBasebyId(id, bases) {
  let i = null;
  bases.forEach((b, j) => {
    if (b.id === id) {
      i = j;
    }
  });
  return bases[i];
}

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
      expect(tb2._path.id()).toBe(tb2._path.id()); // finds path
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
