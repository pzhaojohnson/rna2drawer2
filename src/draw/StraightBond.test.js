import { StraightBond, PrimaryBond, SecondaryBond } from './StraightBond';
import createNodeSVG from './createNodeSVG';
import Base from './Base';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

describe('StraightBond class', () => {
  it('_lineCoordinates static method', () => {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 5, 8);
    let b2 = Base.create(svg, 'r', 77, 980);
    let lcs = StraightBond._lineCoordinates(b1, b2, 4, 7);
    expect(
      distanceBetween(5, 8, lcs.x1, lcs.y1)
    ).toBeCloseTo(4);
    expect(
      distanceBetween(77, 980, lcs.x2, lcs.y2)
    ).toBeCloseTo(7);
    expect(
      normalizeAngle(angleBetween(lcs.x1, lcs.y1, lcs.x2, lcs.y2))
    ).toBeCloseTo(normalizeAngle(b1.angleBetweenCenters(b2)));
  });

  describe('_opacity static method', () => {
    it('paddings are too big', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'A', 5, 9);
      let b2 = Base.create(svg, 'T', 8, 13);
      expect(StraightBond._opacity(b1, b2, 3, 4)).toBe(0);
    });

    it('paddings fit', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 't', 1, 5);
      let b2 = Base.create(svg, 'b', 80, 75);
      expect(StraightBond._opacity(b1, b2, 3, 6)).toBe(1);
    });
  });

  describe('constructor', () => {
    it('stores bases and line', () => {
      let svg = createNodeSVG();
      let l = svg.line(1, 3, 5, 7);
      let b1 = Base.create(svg, 't', 1, 2);
      let b2 = Base.create(svg, 'n', 3, 3);
      let sb = new StraightBond(l, b1, b2);
      expect(sb._line).toBe(l);
      expect(sb.base1).toBe(b1);
      expect(sb.base2).toBe(b2);
    });

    it('validates line', () => {
      let svg = createNodeSVG();
      let l = svg.line(1, 2, 3, 4);
      let b1 = Base.create(svg, 't', 1, 2);
      let b2 = Base.create(svg, 't', 2, 3);
      expect(l.attr('id')).toBe(undefined);
      let sb = new StraightBond(l, b1, b2);
      expect(l.attr('id')).toBeTruthy();
    });

    it('stores paddings', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'a', 3, 6);
      let b2 = Base.create(svg, 'b', 90, 87);
      let lcs = StraightBond._lineCoordinates(b1, b2, 8, 5);
      let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
      let sb = new StraightBond(l, b1, b2);
      expect(sb.padding1).toBeCloseTo(8);
      expect(sb.padding2).toBeCloseTo(5);
    });
  });

  describe('_validateLine method', () => {
    it('initializes ID', () => {
      let svg = createNodeSVG();
      let l = svg.line(1, 2, 3, 4);
      let b1 = Base.create(svg, 't', 1, 3);
      let b2 = Base.create(svg, 'n', 5, 5);
      expect(l.attr('id')).toBe(undefined);
      let sb = new StraightBond(l, b1, b2);
      expect(l.attr('id')).toBeTruthy();
    });
  });

  it('id getter', () => {
    let svg = createNodeSVG();
    let l = svg.line(1, 2, 3, 4);
    let lid = l.id();
    let b1 = Base.create(svg, 'e', 1, 4);
    let b2 = Base.create(svg, 'h', 3, 2);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.id).toBe(lid);
  });

  it('base1 and base2 getters', () => {
    let svg = createNodeSVG();
    let l = svg.line(1, 2, 3, 4);
    let b1 = Base.create(svg, 'y', 5, 4);
    let b2 = Base.create(svg, 'n', 4, 5);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.base1).toBe(b1);
    expect(sb.base2).toBe(b2);
  });

  it('padding1 and padding2 getters and setters', () => {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'e', 3, 6);
    let b2 = Base.create(svg, 'm', 200, 330);
    let lcs = StraightBond._lineCoordinates(b1, b2, 8, 12);
    let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
    let sb = new StraightBond(l, b1, b2);
    sb.padding1 = 18;
    expect(sb.padding1).toBeCloseTo(18);
    expect(
      distanceBetween(3, 6, l.attr('x1'), l.attr('y1'))
    ).toBeCloseTo(18);
    sb.padding2 = 30;
    expect(sb.padding2).toBeCloseTo(30);
    expect(
      distanceBetween(200, 330, l.attr('x2'), l.attr('y2'))
    ).toBeCloseTo(30);
  });

  describe('reposition method', () => {
    it('moves line', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'e', 4, 9);
      let b2 = Base.create(svg, 'q', 200, 300);
      let lcs = StraightBond._lineCoordinates(b1, b2, 12, 16);
      let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
      let sb = new StraightBond(l, b1, b2);
      b1.moveTo(-10, -14);
      b2.moveTo(312, 398);
      sb.reposition();
      lcs = StraightBond._lineCoordinates(b1, b2, 12, 16);
      expect(l.attr('x1')).toBeCloseTo(lcs.x1);
      expect(l.attr('y1')).toBeCloseTo(lcs.y1);
      expect(l.attr('x2')).toBeCloseTo(lcs.x2);
      expect(l.attr('y2')).toBeCloseTo(lcs.y2);
      expect(sb.padding1).toBeCloseTo(12);
      expect(sb.padding2).toBeCloseTo(16);
    });

    it('updates opacity', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'm', 3, 5);
      let b2 = Base.create(svg, 'y', 500, 400);
      let lcs = StraightBond._lineCoordinates(b1, b2, 6, 8);
      let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
      let sb = new StraightBond(l, b1, b2);
      expect(sb.opacity).toBe(1);
      b2.moveTo(4, 6);
      sb.reposition();
      expect(sb.opacity).toBe(0);
    });
  });

  it('insertBefore and insertAfter methods', () => {
    let svg = createNodeSVG();
    let c = svg.circle(50);
    let l = svg.line(1, 2, 3, 4);
    let b1 = Base.create(svg, 'b', 2, 3);
    let b2 = Base.create(svg, 'h', 5, 5);
    let sb = new StraightBond(l, b1, b2);
    expect(l.position()).toBeGreaterThan(c.position());
    sb.insertBefore(c);
    expect(l.position()).toBeLessThan(c.position());
    sb.insertAfter(c);
    expect(l.position()).toBeGreaterThan(c.position());
  });

  it('stroke and strokeWidth getters and setters', () => {
    let svg = createNodeSVG();
    let l = svg.line(5, 5, 3, 3);
    let b1 = Base.create(svg, 'b', 1, 4);
    let b2 = Base.create(svg, 'n', 10, 12);
    let sb = new StraightBond(l, b1, b2);
    sb.stroke = '#44bb99';
    expect(sb.stroke).toBe('#44bb99');
    sb.strokeWidth = 5.43;
    expect(sb.strokeWidth).toBe(5.43);
  });

  it('opacity getter and private setter', () => {
    let svg = createNodeSVG();
    let l = svg.line(5, 2, 1, 6);
    let b1 = Base.create(svg, 'b', 5, 4);
    let b2 = Base.create(svg, 'n', 3, 5);
    let sb = new StraightBond(l, b1, b2);
    sb._setOpacity(0.55);
    expect(sb.opacity).toBe(0.55);
  });

  it('remove method', () => {
    let svg = createNodeSVG();
    let l = svg.line(1, 2, 4, 5);
    let b1 = Base.create(svg, 'n', 1, 4);
    let b2 = Base.create(svg, 'n', 4, 4);
    let sb = new StraightBond(l, b1, b2);
    let lid = l.id();
    expect(svg.findOne('#' + lid)).toBeTruthy();
    sb.remove();
    expect(svg.findOne('#' + lid)).toBe(null);
  });

  describe('savableState method', () => {
    it('includes className, line and base IDs', () => {
      let svg = createNodeSVG();
      let l = svg.line(5, 5, 4, 3);
      let b1 = Base.create(svg, 'n', 4, 3);
      let b2 = Base.create(svg, 'j', 5, 10);
      let sb = new StraightBond(l, b1, b2);
      let savableState = sb.savableState();
      expect(savableState.className).toBe('StraightBond');
      expect(savableState.line).toBe(l.id());
      expect(savableState.base1).toBe(b1.id);
      expect(savableState.base2).toBe(b2.id);
    });

    it('can be converted to and from a JSON string', () => {
      let svg = createNodeSVG();
      let l = svg.line(5, 5, 4, 3);
      let b1 = Base.create(svg, 'n', 4, 3);
      let b2 = Base.create(svg, 'j', 5, 10);
      let sb = new StraightBond(l, b1, b2);
      let savableState1 = sb.savableState();
      let json1 = JSON.stringify(savableState1);
      let savableState2 = JSON.parse(json1);
      let json2 = JSON.stringify(savableState2);
      expect(json2).toBe(json1);
    });
  });
});

describe('PrimaryBond class', () => {
  describe('mostRecentProps static method', () => {
    it('returns a new object', () => {
      expect(PrimaryBond.mostRecentProps()).not.toBe(PrimaryBond._mostRecentProps);
    });

    it('returns correct values', () => {
      PrimaryBond._mostRecentProps.padding1 = 5.44;
      PrimaryBond._mostRecentProps.padding2 = 12.43;
      PrimaryBond._mostRecentProps.stroke = '#8ab1c3'
      PrimaryBond._mostRecentProps.strokeWidth = 3.22;
      let mrps = PrimaryBond.mostRecentProps();
      expect(mrps.padding1).toBe(5.44);
      expect(mrps.padding2).toBe(12.43);
      expect(mrps.stroke).toBe('#8ab1c3');
      expect(mrps.strokeWidth).toBe(3.22);
    });
  });

  it('_applyMostRecentProps static method', () => {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'a', 1, 2);
    let b2 = Base.create(svg, 'b', 5, 4);
    let pb = PrimaryBond.create(svg, b1, b2);
    PrimaryBond._mostRecentProps.padding1 = 3.45;
    PrimaryBond._mostRecentProps.padding2 = 12.89;
    PrimaryBond._mostRecentProps.stroke = '#aa33dd';
    PrimaryBond._mostRecentProps.strokeWidth = 4.97;
    PrimaryBond._applyMostRecentProps(pb);
    expect(pb.padding1).toBeCloseTo(3.45);
    expect(pb.padding2).toBeCloseTo(12.89);
    expect(pb.stroke).toBe('#aa33dd');
    expect(pb.strokeWidth).toBe(4.97);
  });

  it('_copyPropsToMostRecent static method', () => {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'g', 1, 4);
    let b2 = Base.create(svg, 'n', 5, 10);
    let pb = PrimaryBond.create(svg, b1, b2);
    pb.padding1 = 5.67;
    pb.padding2 = 8.901;
    pb.stroke = '#aa12cd';
    pb.strokeWidth = 2.08;
    PrimaryBond._mostRecentProps.padding1 = 6.78;
    PrimaryBond._mostRecentProps.padding2 = 12.33;
    PrimaryBond._mostRecentProps.stroke = '#aaddcc';
    PrimaryBond._mostRecentProps.strokeWidth = 2;
    PrimaryBond._copyPropsToMostRecent(pb);
    let mrps = PrimaryBond.mostRecentProps();
    expect(mrps.padding1).toBeCloseTo(5.67);
    expect(mrps.padding2).toBeCloseTo(8.901);
    expect(mrps.stroke).toBe('#aa12cd');
    expect(mrps.strokeWidth).toBe(2.08);
  });

  describe('fromSavedState static method', () => {
    describe('invalid saved state', () => {
      it('wrong className', () => {
        let svg = createNodeSVG();
        let b1 = Base.create(svg, 'a', 5, 3);
        let b2 = Base.create(svg, 'A', 1, 10);
        let pb = PrimaryBond.create(svg, b1, b2);
        let savableState = pb.savableState();
        savableState.className = 'StraightBnd';
        expect(PrimaryBond.fromSavedState(
          savableState,
          svg,
          id => {
            if (id === b1.id) {
              return b1;
            } else if (id === b2.id) {
              return b2;
            }
          }
        )).toBe(null);
      });

      it('constructor throws', () => {
        let svg = createNodeSVG();
        let b1 = Base.create(svg, 'a', 1, 2);
        let b2 = Base.create(svg, 'g', 5, 4);
        let pb = PrimaryBond.create(svg, b1, b2);
        let savableState = pb.savableState();
        pb._line.remove();
        expect(PrimaryBond.fromSavedState(
          savableState,
          svg,
          id => {
            if (id === b1.id) {
              return b1;
            } else if (id === b2.id) {
              return b2;
            }
          }
        )).toBe(null);
      });
    });

    it('creates with line and bases', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'a', 2, 3);
      let b2 = Base.create(svg, 'Y', 5, 5);
      let pb1 = PrimaryBond.create(svg, b1, b2);
      let l = pb1._line;
      let savableState1 = pb1.savableState();
      let pb2 = PrimaryBond.fromSavedState(
        savableState1,
        svg,
        id => {
          if (id === b1.id) {
            return b1;
          } else if (id === b2.id) {
            return b2;
          }
        }
      );
      expect(pb2._line.id()).toBe(l.id());
      expect(pb2.base1.id).toBe(b1.id);
      expect(pb2.base2.id).toBe(b2.id);
    });

    it('copies properties to most recent', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'a', 4, 5);
      let b2 = Base.create(svg, 'b', 50, 200);
      let pb1 = PrimaryBond.create(svg, b1, b2);
      pb1.stroke = '#55bcd1';
      let savableState1 = pb1.savableState();
      let pb2 = PrimaryBond.fromSavedState(
        savableState1,
        svg,
        id => {
          if (id === b1.id) {
            return b1;
          } else if (id === b2.id) {
            return b2;
          }
        }
      );
      expect(PrimaryBond.mostRecentProps().stroke).toBe('#55bcd1');
    });
  });

  describe('create static method', () => {
    it('creates with line and bases', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'b', 1, 5);
      let b2 = Base.create(svg, 'Y', 10, 20);
      let pb = PrimaryBond.create(svg, b1, b2);
      expect(pb.base1).toBe(b1);
      expect(pb.base2).toBe(b2);
      expect(svg.findOne('#' + pb._line.id())).toBeTruthy();
    });

    it('applies most recent properties', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'g', 1, 3);
      let b2 = Base.create(svg, 'u', 5, 5);
      PrimaryBond._mostRecentProps.strokeWidth = 5.804;
      let pb = PrimaryBond.create(svg, b1, b2);
      expect(pb.strokeWidth).toBe(5.804);
    });
  });

  describe('padding1 and padding2 getters and setters', () => {
    it('return and set values', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'E', 1, 5);
      let b2 = Base.create(svg, 'h', 55, 44);
      let pb = PrimaryBond.create(svg, b1, b2);
      pb.padding1 = 12.3;
      expect(pb.padding1).toBeCloseTo(12.3);
      pb.padding2 = 14.03;
      expect(pb.padding2).toBeCloseTo(14.03);
    });

    it('update most recent properties', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'E', 1, 5);
      let b2 = Base.create(svg, 'h', 55, 44);
      let pb = PrimaryBond.create(svg, b1, b2);
      pb.padding1 = 9.78;
      pb.padding2 = 7.05;
      let mrps = PrimaryBond.mostRecentProps();
      expect(mrps.padding1).toBeCloseTo(9.78);
      expect(mrps.padding2).toBeCloseTo(7.05);
    });
  });

  describe('stroke and strokeWidth getters and setters', () => {
    it('return and set values', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'Q', 1, 1);
      let b2 = Base.create(svg, 'o', 200, 300);
      let pb = PrimaryBond.create(svg, b1, b2);
      pb.stroke = '#4455bc';
      pb.strokeWidth = 4.011;
      expect(pb.stroke).toBe('#4455bc');
      expect(pb.strokeWidth).toBe(4.011);
    });

    it('update most recent properties', () => {
      let svg = createNodeSVG();
      let b1 = Base.create(svg, 'Q', 1, 1);
      let b2 = Base.create(svg, 'o', 200, 300);
      let pb = PrimaryBond.create(svg, b1, b2);
      pb.stroke = '#4455bc';
      pb.strokeWidth = 4.011;
      let mrps = PrimaryBond.mostRecentProps();
      expect(mrps.stroke).toBe('#4455bc');
      expect(mrps.strokeWidth).toBe(4.011);
    });
  });
});

it('mostRecentProps static method returns a new object', () => {
  function runFor(StraightBondClass) {
    let mrps = StraightBondClass.mostRecentProps();
    expect(mrps).not.toBe(StraightBondClass._mostRecentProps);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('SecondaryBond _applyMostRecentProps padding1, padding2, and strokeWidth', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'g', 1, 3);
  let b2 = Base.create(svg, 't', 6, 6);
  let sb = new SecondaryBond(svg, b1, b2);

  /* Set after creating the primary bond since the create static method itself
  applies the most recent properties. */
  SecondaryBond._mostRecentProps.padding1 = 66.5;
  SecondaryBond._mostRecentProps.padding2 = 12.33;
  SecondaryBond._mostRecentProps.strokeWidth = 1.222;
  
  SecondaryBond._applyMostRecentProps(sb);
  expect(sb.padding1).toBeCloseTo(66.5, 6);
  expect(sb.padding2).toBeCloseTo(12.33, 6);
  expect(sb.strokeWidth).toBeCloseTo(1.222, 6);
});

it('SecondaryBond _applyMostRecentProps stroke', () => {
  let svg = createNodeSVG();
  let ba = Base.create(svg, 'A', 3, 5);
  let bu = Base.create(svg, 'U', 4, 3);
  let bg = Base.create(svg, 'g', 3, 2);
  let bc = Base.create(svg, 'c', 2, 2);
  let bt = Base.create(svg, 't', 5.5, -5.5);

  let sbau = SecondaryBond.create(svg, bu, ba);
  let sbgc = SecondaryBond.create(svg, bc, bg);
  let sbgu = SecondaryBond.create(svg, bg, bu);
  let sbat = SecondaryBond.create(svg, bt, ba);
  let sbgt = SecondaryBond.create(svg, bt, bg);
  let sbOther = SecondaryBond.create(svg, ba, bc);
  
  /* Set after creating the secondary bond since the create static method itself
  applies the most recent properties. */
  SecondaryBond._mostRecentProps.autStroke = '#aabbcc';
  SecondaryBond._mostRecentProps.gcStroke = '#ccbbaa';
  SecondaryBond._mostRecentProps.gutStroke = '#112233';
  SecondaryBond._mostRecentProps.otherStroke = '#998877';

  SecondaryBond._applyMostRecentProps(sbau);
  expect(sbau.stroke).toBe('#aabbcc');
  SecondaryBond._applyMostRecentProps(sbgc);
  expect(sbgc.stroke).toBe('#ccbbaa');
  SecondaryBond._applyMostRecentProps(sbgu);
  expect(sbgu.stroke).toBe('#112233');
  SecondaryBond._applyMostRecentProps(sbat);
  expect(sbat.stroke).toBe('#aabbcc');
  SecondaryBond._applyMostRecentProps(sbgt);
  expect(sbgt.stroke).toBe('#112233');
  SecondaryBond._applyMostRecentProps(sbOther);
  expect(sbOther.stroke).toBe('#998877');
});

it('SecondaryBond _copyPropsToMostRecent padding1, padding2, and strokeWidth', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'e', 5.5, 4);
  let b2 = Base.create(svg, 'w', 4, 3);
  let sb = SecondaryBond.create(svg, b1, b2);

  sb.padding1 = 8.777;
  sb.padding2 = 6.578;
  sb.strokeWidth = 35;
  SecondaryBond._copyPropsToMostRecent(sb);

  let mrps = SecondaryBond.mostRecentProps();
  expect(mrps.padding1).toBeCloseTo(8.777, 6);
  expect(mrps.padding2).toBeCloseTo(6.578, 6);
  expect(mrps.strokeWidth).toBeCloseTo(35, 6);
});

it('SecondaryBond _copyPropsToMostRecent stroke', () => {
  let svg = createNodeSVG();
  let ba = Base.create(svg, 'A', 3, 5);
  let bu = Base.create(svg, 'U', 4, 3);
  let bg = Base.create(svg, 'g', 3, 2);
  let bc = Base.create(svg, 'c', 2, 2);
  let bt = Base.create(svg, 't', 5.5, -5.5);

  let sbau = SecondaryBond.create(svg, bu, ba);
  let sbgc = SecondaryBond.create(svg, bc, bg);
  let sbgu = SecondaryBond.create(svg, bg, bu);
  let sbat = SecondaryBond.create(svg, bt, ba);
  let sbgt = SecondaryBond.create(svg, bt, bg);
  let sbOther = SecondaryBond.create(svg, ba, bc);
  
  sbau.stroke = '#123456';
  sbgc.stroke = '#234567';
  sbgu.stroke = '#345678';
  sbat.stroke = '#456789';
  sbgt.stroke = '#567890';
  sbOther.stroke = '#678900';

  SecondaryBond._copyPropsToMostRecent(sbau);
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#123456');
  SecondaryBond._copyPropsToMostRecent(sbgc);
  expect(SecondaryBond.mostRecentProps().gcStroke).toBe('#234567');
  SecondaryBond._copyPropsToMostRecent(sbgu);
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#345678');
  SecondaryBond._copyPropsToMostRecent(sbat);
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#456789');
  SecondaryBond._copyPropsToMostRecent(sbgt);
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#567890');
  SecondaryBond._copyPropsToMostRecent(sbOther);
  expect(SecondaryBond.mostRecentProps().otherStroke).toBe('#678900');
});

function checkCoordinates(cs, ecs) {
  expect(cs.x1).toBeCloseTo(ecs.x1, 6);
  expect(cs.y1).toBeCloseTo(ecs.y1, 6);
  expect(cs.x2).toBeCloseTo(ecs.x2, 6);
  expect(cs.y2).toBeCloseTo(ecs.y2, 6);
}

it('fromSavedState static method valid saved state', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1.1, 1.2);
    let b2 = Base.create(svg, 'U', 2.1, 2.2);
    let sb1 = StraightBondClass.create(svg, b1, b2);

    let savableState = sb1.savableState();

    let getBaseById = (id) => {
      let dict = {};
      dict[b1.id] = b1;
      dict[b2.id] = b2;
      return dict[id];
    };

    let sb2 = StraightBondClass.fromSavedState(savableState, svg, getBaseById);

    expect(sb2._line.id()).toBe(sb1._line.id());
    expect(sb2.base1).toBe(sb1.base1);
    expect(sb2.base2).toBe(sb1.base2);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('fromSavedState static method invalid saved state', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1.1, 1.2);
    let b2 = Base.create(svg, 'U', 2.1, 2.2);
    let sb1 = StraightBondClass.create(svg, b1, b2);

    let getBaseById = (id) => {
      let dict = {};
      dict[b1.id] = b1;
      dict[b2.id] = b2;
      return dict[id];
    };

    let savableState = sb1.savableState();
    expect(() => StraightBondClass.fromSavedState(savableState, svg, getBaseById)).not.toThrow();

    // class name is nonempty and incorrect
    savableState.className = 'StraightBnd';
    expect(StraightBondClass.fromSavedState(savableState, svg, getBaseById)).toBe(null);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('fromSavedState updates most recent padding1, padding2, and strokeWidth properties', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'a', 5, 6);
    let b2 = Base.create(svg, 'e', 0, 0);
    let sb1 = StraightBondClass.create(svg, b1, b2);
    sb1.padding1 = 5;
    sb1.padding2 = 0.5;
    sb1.strokeWidth = 1.65;
    let savableState = sb1.savableState();

    function getBaseById(id) {
      let dict = {};
      dict[b1.id] = b1;
      dict[b2.id] = b2;
      return dict[id];
    }

    let sb2 = StraightBondClass.fromSavedState(savableState, svg, getBaseById);
    let mrps = StraightBondClass.mostRecentProps();
    expect(mrps.padding1).toBeCloseTo(5, 6);
    expect(mrps.padding2).toBeCloseTo(0.5, 6);
    expect(mrps.strokeWidth).toBeCloseTo(1.65, 6);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('PrimaryBond fromSavedState updates most recent stroke property', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', 5, 6);
  let b2 = Base.create(svg, 'e', 0, 0);
  let pb1 = PrimaryBond.create(svg, b1, b2);
  pb1.stroke = '#433221';
  let savableState = pb1.savableState();

  function getBaseById(id) {
    let dict = {};
    dict[b1.id] = b1;
    dict[b2.id] = b2;
    return dict[id];
  }

  let pb2 = PrimaryBond.fromSavedState(savableState, svg, getBaseById);
  let mrps = PrimaryBond.mostRecentProps();
  expect(mrps.stroke).toBe('#433221');
});

it('SecondaryBond fromSavedState updates most recent stroke properties', () => {
  let svg = createNodeSVG();
  let ba = Base.create(svg, 'a', 4, 1);
  let bu = Base.create(svg, 'U', 7, 100);
  let bg = Base.create(svg, 'G', -10, 5);
  let bc = Base.create(svg, 'c', 11, 33);
  let bt = Base.create(svg, 't', 4, 99);

  let sbau = SecondaryBond.create(svg, ba, bu);
  let sbgc = SecondaryBond.create(svg, bc, bg);
  let sbgu = SecondaryBond.create(svg, bu, bg);
  let sbat = SecondaryBond.create(svg, bt, ba);
  let sbgt = SecondaryBond.create(svg, bg, bt);
  let sbOther = SecondaryBond.create(svg, bg, ba);

  function getBaseById(id) {
    let dict = {};
    dict[ba.id] = ba;
    dict[bu.id] = bu;
    dict[bg.id] = bg;
    dict[bc.id] = bc;
    dict[bt.id] = bt;
    return dict[id];
  }

  sbau.stroke = '#445522';
  let auSavableState = sbau.savableState();
  SecondaryBond.fromSavedState(auSavableState, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#445522');
  
  sbgc.stroke = '#aabcde';
  let gcSavableState = sbgc.savableState();
  SecondaryBond.fromSavedState(gcSavableState, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().gcStroke).toBe('#aabcde');

  sbgu.stroke = '#aaabbb';
  let guSavablestate = sbgu.savableState();
  SecondaryBond.fromSavedState(guSavablestate, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#aaabbb');

  sbat.stroke = '#654321';
  let atSavableState = sbat.savableState();
  SecondaryBond.fromSavedState(atSavableState, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#654321');

  sbgt.stroke = '#987654';
  let gtSavableState = sbgt.savableState();
  SecondaryBond.fromSavedState(gtSavableState, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#987654');

  sbOther.stroke = '#a1b2c3';
  let otherSavableState = sbOther.savableState();
  SecondaryBond.fromSavedState(otherSavableState, svg, getBaseById);
  expect(SecondaryBond.mostRecentProps().otherStroke).toBe('#a1b2c3');
});

it('basic test of create static method', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1, 1);
    let b2 = Base.create(svg, 'U', 4, 4);
    let sb = StraightBondClass.create(svg, b1, b2);
    expect(typeof(sb) === 'object' && sb !== null).toBeTruthy();
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

describe('SecondaryBond isAUT method', () => {
  it('works with lowercase characters', () => {
    let svg = createNodeSVG();
    let bu = Base.create(svg, 'u', 4, 5);
    let ba = Base.create(svg, 'a', 3, 5);
    let sbua = SecondaryBond.create(svg, bu, ba);
    expect(sbua.isAUT()).toBeTruthy();
  });

  it('all possible true cases', () => {
    let svg = createNodeSVG();
    let ba = Base.create(svg, 'A', 1, 2);
    let bu = Base.create(svg, 'U', 5, 7);
    let bt = Base.create(svg, 't', 0, 0);
    let sbau = SecondaryBond.create(svg, ba, bu);
    expect(sbau.isAUT()).toBeTruthy();
    let sbat = SecondaryBond.create(svg, ba, bt);
    expect(sbat.isAUT()).toBeTruthy();
    let sbua = SecondaryBond.create(svg, bu, ba);
    expect(sbua.isAUT()).toBeTruthy();
    let sbta = SecondaryBond.create(svg, bt, ba);
    expect(sbta.isAUT()).toBeTruthy();
  });

  it('a false case', () => {
    let svg = createNodeSVG();
    let ba = Base.create(svg, 'A', 1, 5);
    let bc = Base.create(svg, 'C', 1, 5);
    let sbac = SecondaryBond.create(svg, ba, bc);
    expect(sbac.isAUT()).toBeFalsy();
  });
});

describe('SecondaryBond isGC method', () => {
  it('works with lowercase characters', () => {
    let svg = createNodeSVG();
    let bc = Base.create(svg, 'c', 3, 5);
    let bg = Base.create(svg, 'g', 8, 9);
    let sbcg = SecondaryBond.create(svg, bc, bg);
    expect(sbcg.isGC()).toBeTruthy();
  });

  it('all possible true cases', () => {
    let svg = createNodeSVG();
    let bg = Base.create(svg, 'G', 3, 5);
    let bc = Base.create(svg, 'c', 7, 9);
    let sbgc = SecondaryBond.create(svg, bg, bc);
    expect(sbgc.isGC()).toBeTruthy();
    let sbcg = SecondaryBond.create(svg, bc, bg);
    expect(sbcg.isGC()).toBeTruthy();
  });

  it('a false case', () => {
    let svg = createNodeSVG();
    let bg = Base.create(svg, 'G', 4, 5);
    let bu = Base.create(svg, 'U', 1, 2);
    let sbgu = SecondaryBond.create(svg, bg, bu);
    expect(sbgu.isGC()).toBeFalsy();
  });
});

describe('SecondaryBond isGUT method', () => {
  it('works with lowercase characters', () => {
    let svg = createNodeSVG();
    let bu = Base.create(svg, 'u', 5, 5);
    let bg = Base.create(svg, 'g', 3, 4);
    let sbug = SecondaryBond.create(svg, bu, bg);
    expect(sbug.isGUT()).toBeTruthy();
  });

  it('all possible true cases', () => {
    let svg = createNodeSVG();
    let bg = Base.create(svg, 'g', 1, 4);
    let bu = Base.create(svg, 'U', 2, 2);
    let bt = Base.create(svg, 't', 9, 8);
    let sbgu = SecondaryBond.create(svg, bg, bu);
    expect(sbgu.isGUT()).toBeTruthy();
    let sbgt = SecondaryBond.create(svg, bg, bt);
    expect(sbgt.isGUT()).toBeTruthy();
    let sbug = SecondaryBond.create(svg, bu, bg);
    expect(sbug.isGUT()).toBeTruthy();
    let sbtg = SecondaryBond.create(svg, bt, bg);
    expect(sbtg.isGUT()).toBeTruthy();
  });

  it('a false case', () => {
    let svg = createNodeSVG();
    let bu = Base.create(svg, 'U', 2, 5);
    let ba = Base.create(svg, 'A', 2, 5);
    let sbua = SecondaryBond.create(svg, bu, ba);
    expect(sbua.isGUT()).toBeFalsy();
  });
});

it('stroke getter and setter', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1, 1);
    let b2 = Base.create(svg, 'U', 4, 4);
    let sb = PrimaryBond.create(svg, b1, b2);

    sb.stroke = '#456abc';
    
    // check getter
    expect(sb.stroke).toBe('#456abc');

    // check actual value
    expect(sb._line.attr('stroke')).toBe('#456abc');
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});

it('PrimaryBond stroke setter updates most recent property', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', 3, 5);
  let b2 = Base.create(svg, 'j', 1, 1);
  let pb = PrimaryBond.create(svg, b1, b2);
  pb.stroke = '#445566';
  expect(PrimaryBond.mostRecentProps().stroke).toBe('#445566');
});

it('SecondaryBond stroke setter updates most recent property', () => {
  let svg = createNodeSVG();
  let ba = Base.create(svg, 'A', 3, 5);
  let bu = Base.create(svg, 'U', 4, 3);
  let bg = Base.create(svg, 'g', 3, 2);
  let bc = Base.create(svg, 'c', 2, 2);
  let bt = Base.create(svg, 't', 5.5, -5.5);

  let sbau = SecondaryBond.create(svg, bu, ba);
  let sbgc = SecondaryBond.create(svg, bc, bg);
  let sbgu = SecondaryBond.create(svg, bg, bu);
  let sbat = SecondaryBond.create(svg, bt, ba);
  let sbgt = SecondaryBond.create(svg, bt, bg);
  let sbOther = SecondaryBond.create(svg, ba, bc);
  
  sbau.stroke = '#123456';
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#123456');
  sbgc.stroke = '#234567';
  expect(SecondaryBond.mostRecentProps().gcStroke).toBe('#234567');
  sbgu.stroke = '#345678';
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#345678');
  sbat.stroke = '#456789';
  expect(SecondaryBond.mostRecentProps().autStroke).toBe('#456789');
  sbgt.stroke = '#567890';
  expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#567890');
  sbOther.stroke = '#678900';
  expect(SecondaryBond.mostRecentProps().otherStroke).toBe('#678900');
});

it('strokeWidth getter and setter', () => {
  function runFor(StraightBondClass) {
    let svg = createNodeSVG();
    let b1 = Base.create(svg, 'A', 1, 1);
    let b2 = Base.create(svg, 'U', 4, 4);
    let sb = StraightBondClass.create(svg, b1, b2);

    sb.strokeWidth = 2.3;

    // check getter
    expect(sb.strokeWidth).toBeCloseTo(2.3, 6);

    // check actual value
    expect(sb._line.attr('stroke-width')).toBeCloseTo(2.3, 6);

    // updates most recent property
    expect(StraightBondClass.mostRecentProps().strokeWidth).toBeCloseTo(2.3, 6);
  }

  runFor(PrimaryBond);
  runFor(SecondaryBond);
});
