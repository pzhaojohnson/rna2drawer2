import { StraightBond, PrimaryBond, SecondaryBond } from './StraightBond';
import NodeSVG from './NodeSVG';
import Base from './Base';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

let svg = NodeSVG();

describe('StraightBond class', () => {
  it('_lineCoordinates static method', () => {
    let svg = NodeSVG();
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
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'A', 5, 9);
      let b2 = Base.create(svg, 'T', 8, 13);
      expect(StraightBond._opacity(b1, b2, 3, 4)).toBe(0);
    });

    it('paddings fit', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 't', 1, 5);
      let b2 = Base.create(svg, 'b', 80, 75);
      expect(StraightBond._opacity(b1, b2, 3, 6)).toBe(1);
    });
  });

  describe('constructor', () => {
    it('stores bases and line', () => {
      let svg = NodeSVG();
      let l = svg.line(1, 3, 5, 7);
      let b1 = Base.create(svg, 't', 1, 2);
      let b2 = Base.create(svg, 'n', 3, 3);
      let sb = new StraightBond(l, b1, b2);
      expect(sb._line).toBe(l);
      expect(sb.base1).toBe(b1);
      expect(sb.base2).toBe(b2);
    });

    it('validates line', () => {
      let svg = NodeSVG();
      let l = svg.line(1, 2, 3, 4);
      let b1 = Base.create(svg, 't', 1, 2);
      let b2 = Base.create(svg, 't', 2, 3);
      expect(l.attr('id')).toBe(undefined);
      let sb = new StraightBond(l, b1, b2);
      expect(l.attr('id')).toBeTruthy();
    });

    it('stores paddings', () => {
      let svg = NodeSVG();
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
      let svg = NodeSVG();
      let l = svg.line(1, 2, 3, 4);
      let b1 = Base.create(svg, 't', 1, 3);
      let b2 = Base.create(svg, 'n', 5, 5);
      expect(l.attr('id')).toBe(undefined);
      let sb = new StraightBond(l, b1, b2);
      expect(l.attr('id')).toBeTruthy();
    });
  });

  it('id getter', () => {
    let svg = NodeSVG();
    let l = svg.line(1, 2, 3, 4);
    let lid = l.id();
    let b1 = Base.create(svg, 'e', 1, 4);
    let b2 = Base.create(svg, 'h', 3, 2);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.id).toBe(lid);
  });

  it('base1 and base2 getters', () => {
    let svg = NodeSVG();
    let l = svg.line(1, 2, 3, 4);
    let b1 = Base.create(svg, 'y', 5, 4);
    let b2 = Base.create(svg, 'n', 4, 5);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.base1).toBe(b1);
    expect(sb.base2).toBe(b2);
  });

  it('x1, y1, x2 and y2 getters', () => {
    let svg = NodeSVG();
    let b1 = Base.create(svg, 'e', 1, 5);
    let b2 = Base.create(svg, 'k', 600, 700);
    let lcs = StraightBond._lineCoordinates(b1, b2, 6.7, 13.9);
    let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.x1).toBeCloseTo(lcs.x1);
    expect(sb.y1).toBeCloseTo(lcs.y1);
    expect(sb.x2).toBeCloseTo(lcs.x2);
    expect(sb.y2).toBeCloseTo(lcs.y2);
  });

  it('padding1 and padding2 getters and setters', () => {
    let svg = NodeSVG();
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
      let svg = NodeSVG();
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
      let svg = NodeSVG();
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
    let svg = NodeSVG();
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
    let svg = NodeSVG();
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
    let svg = NodeSVG();
    let l = svg.line(5, 2, 1, 6);
    let b1 = Base.create(svg, 'b', 5, 4);
    let b2 = Base.create(svg, 'n', 3, 5);
    let sb = new StraightBond(l, b1, b2);
    sb._setOpacity(0.55);
    expect(sb.opacity).toBe(0.55);
  });

  it('remove method', () => {
    let svg = NodeSVG();
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
      let l = svg.line(5, 5, 4, 3);
      let b1 = Base.create(svg, 'n', 4, 3);
      let b2 = Base.create(svg, 'j', 5, 10);
      let sb = new StraightBond(l, b1, b2);
      let savableState = sb.savableState();
      expect(savableState.className).toBe('StraightBond');
      expect(savableState.lineId).toBe(l.id());
      expect(savableState.baseId1).toBe(b1.id);
      expect(savableState.baseId2).toBe(b2.id);
    });

    it('can be converted to and from a JSON string', () => {
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

  it('refreshIds method', () => {
    let svg = NodeSVG();
    let l = svg.line(1, 2, 3, 4);
    let b1 = Base.create(svg, 'a', 1, 4);
    let b2 = Base.create(svg, 'h', 5, 5);
    let sb = new StraightBond(l, b1, b2);
    let oldLineId = sb._line.id();
    sb.refreshIds();
    expect(sb._line.id()).not.toBe(oldLineId);
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
    let svg = NodeSVG();
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
    let svg = NodeSVG();
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
      let b1 = Base.create(svg, 'a', 1, 2);
      let b2 = Base.create(svg, 'i', 10, 11);
      let getBaseById = id => id === b1.id ? b1 : b2;
      let pb = PrimaryBond.create(svg, b1, b2);

      it('wrong class name', () => {
        let savableState = pb.savableState();
        savableState.className = 'StraightBnd';
        expect(
          () => PrimaryBond.fromSavedState(savableState, svg, getBaseById)
        ).toThrow();
      });

      it('constructor throws', () => {
        let savableState = pb.savableState();
        savableState.lineId += 'asdf';
        expect(
          () => PrimaryBond.fromSavedState(savableState, svg, getBaseById)
        ).toThrow();
      });
    });

    it('creates with line and bases', () => {
      let b1 = Base.create(svg, 'a', 2, 3);
      let b2 = Base.create(svg, 'Y', 5, 5);
      let getBaseById = id => id === b1.id ? b1 : b2;
      let pb1 = PrimaryBond.create(svg, b1, b2);
      let savableState = pb1.savableState();
      let pb2 = PrimaryBond.fromSavedState(savableState, svg, getBaseById);
      expect(pb2._line.id()).toBe(pb1._line.id());
      expect(pb2.base1.id).toBe(b1.id);
      expect(pb2.base2.id).toBe(b2.id);
    });

    it('copies properties to most recent', () => {
      let svg = NodeSVG();
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
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'b', 1, 5);
      let b2 = Base.create(svg, 'Y', 10, 20);
      let pb = PrimaryBond.create(svg, b1, b2);
      expect(pb.base1).toBe(b1);
      expect(pb.base2).toBe(b2);
      expect(svg.findOne('#' + pb._line.id())).toBeTruthy();
    });

    it('applies most recent properties', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'g', 1, 3);
      let b2 = Base.create(svg, 'u', 5, 5);
      PrimaryBond._mostRecentProps.strokeWidth = 5.804;
      let pb = PrimaryBond.create(svg, b1, b2);
      expect(pb.strokeWidth).toBe(5.804);
    });
  });

  describe('padding1 and padding2 getters and setters', () => {
    it('return and set values', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'E', 1, 5);
      let b2 = Base.create(svg, 'h', 55, 44);
      let pb = PrimaryBond.create(svg, b1, b2);
      pb.padding1 = 12.3;
      expect(pb.padding1).toBeCloseTo(12.3);
      pb.padding2 = 14.03;
      expect(pb.padding2).toBeCloseTo(14.03);
    });

    it('update most recent properties', () => {
      let svg = NodeSVG();
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
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'Q', 1, 1);
      let b2 = Base.create(svg, 'o', 200, 300);
      let pb = PrimaryBond.create(svg, b1, b2);
      pb.stroke = '#4455bc';
      pb.strokeWidth = 4.011;
      expect(pb.stroke).toBe('#4455bc');
      expect(pb.strokeWidth).toBe(4.011);
    });

    it('update most recent properties', () => {
      let svg = NodeSVG();
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

describe('SecondaryBond class', () => {
  describe('mostRecentProps static method', () => {
    it('returns a new object', () => {
      expect(SecondaryBond.mostRecentProps()).not.toBe(SecondaryBond._mostRecentProps);
    });

    it('returns correct values', () => {
      SecondaryBond._mostRecentProps.padding1 = 3.4588;
      SecondaryBond._mostRecentProps.padding2 = 6.77;
      SecondaryBond._mostRecentProps.autStroke = '#aaccee';
      SecondaryBond._mostRecentProps.gcStroke = '#bbddff';
      SecondaryBond._mostRecentProps.gutStroke = '#115533';
      SecondaryBond._mostRecentProps.otherStroke = '#226644';
      SecondaryBond._mostRecentProps.strokeWidth = 1.28;
      let mrps = SecondaryBond.mostRecentProps();
      expect(mrps.padding1).toBe(3.4588);
      expect(mrps.padding2).toBe(6.77);
      expect(mrps.autStroke).toBe('#aaccee');
      expect(mrps.gcStroke).toBe('#bbddff');
      expect(mrps.gutStroke).toBe('#115533');
      expect(mrps.otherStroke).toBe('#226644');
      expect(mrps.strokeWidth).toBe(1.28);
    });
  });

  describe('_applyMostRecentProps static method', () => {
    it('applies padding1, padding2 and strokeWidth properties', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'a', 1, 5);
      let b2 = Base.create(svg, 'g', 555, 55);
      let sb = SecondaryBond.create(svg, b1, b2);
      SecondaryBond._mostRecentProps.padding1 = 5.83;
      SecondaryBond._mostRecentProps.padding2 = 10.28;
      SecondaryBond._mostRecentProps.strokeWidth = 1.27;
      SecondaryBond._applyMostRecentProps(sb);
      expect(sb.padding1).toBeCloseTo(5.83);
      expect(sb.padding2).toBeCloseTo(10.28);
      expect(sb.strokeWidth).toBe(1.27);
    });

    it('applies stroke properties', () => {
      let svg = NodeSVG();
      let ba = Base.create(svg, 'a', 1, 2);
      let bu = Base.create(svg, 'u', 3, 5);
      let bg = Base.create(svg, 'G', 1, 5);
      let bc = Base.create(svg, 'c', 3, 3);
      let sbau = SecondaryBond.create(svg, ba, bu);
      let sbcg = SecondaryBond.create(svg, bc, bg);
      let sbgu = SecondaryBond.create(svg, bg, bu);
      let sbac = SecondaryBond.create(svg, ba, bc);
      SecondaryBond._mostRecentProps.autStroke = '#114488';
      SecondaryBond._mostRecentProps.gcStroke = '#111223';
      SecondaryBond._mostRecentProps.gutStroke = '#aaabbc';
      SecondaryBond._mostRecentProps.otherStroke = '#463524';
      SecondaryBond._applyMostRecentProps(sbau);
      expect(sbau.stroke).toBe('#114488');
      SecondaryBond._applyMostRecentProps(sbcg);
      expect(sbcg.stroke).toBe('#111223');
      SecondaryBond._applyMostRecentProps(sbgu);
      expect(sbgu.stroke).toBe('#aaabbc');
      SecondaryBond._applyMostRecentProps(sbac);
      expect(sbac.stroke).toBe('#463524');
    });
  });

  describe('_copyPropsToMostRecent static method', () => {
    it('copies padding1, padding2 and strokeWidth properties', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'g', 1, 2);
      let b2 = Base.create(svg, 't', 300, 3);
      let sb = SecondaryBond.create(svg, b1, b2);
      sb.padding1 = 12.33;
      sb.padding2 = 15.42;
      sb.strokeWidth = 5.44;
      SecondaryBond._copyPropsToMostRecent(sb);
      let mrps = SecondaryBond.mostRecentProps();
      expect(mrps.padding1).toBeCloseTo(12.33);
      expect(mrps.padding2).toBeCloseTo(15.42);
      expect(mrps.strokeWidth).toBe(5.44);
    });

    it('copies stroke properties', () => {
      let svg = NodeSVG();
      let ba = Base.create(svg, 'A', 1, 2);
      let bt = Base.create(svg, 't', 5, 5);
      let bg = Base.create(svg, 'g', 2, 2);
      let bc = Base.create(svg, 'C', 2, 2);
      let sbta = SecondaryBond.create(svg, bt, ba);
      let sbgc = SecondaryBond.create(svg, bg, bc);
      let sbtg = SecondaryBond.create(svg, bt, bg);
      let sbct = SecondaryBond.create(svg, bc, bt);
      sbta.stroke = '#113322';
      SecondaryBond._mostRecentProps.autStroke = '#123456';
      SecondaryBond._copyPropsToMostRecent(sbta);
      expect(SecondaryBond.mostRecentProps().autStroke).toBe('#113322');
      sbgc.stroke = '#11aabb';
      SecondaryBond._mostRecentProps.gcStroke = '#123456';
      SecondaryBond._copyPropsToMostRecent(sbgc);
      expect(SecondaryBond.mostRecentProps().gcStroke).toBe('#11aabb');
      sbtg.stroke = '#aa1234';
      SecondaryBond._mostRecentProps.gutStroke = '#123456';
      SecondaryBond._copyPropsToMostRecent(sbtg);
      expect(SecondaryBond.mostRecentProps().gutStroke).toBe('#aa1234');
      sbct.stroke = '#876543';
      SecondaryBond._mostRecentProps.otherStroke = '#123456';
      SecondaryBond._copyPropsToMostRecent(sbct);
      expect(SecondaryBond.mostRecentProps().otherStroke).toBe('#876543');
    });
  });

  describe('fromSavedState static method', () => {
    describe('invalid saved state', () => {
      it('constructor throws', () => {
        let svg = NodeSVG();
        let b1 = Base.create(svg, 'a', 1, 2);
        let b2 = Base.create(svg, 'w', 30, 40);
        let sb = SecondaryBond.create(svg, b1, b2);
        let l = sb._line;
        let savableState = sb.savableState();
        l.remove();
        expect(SecondaryBond.fromSavedState(
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
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'a', 1, 2);
      let b2 = Base.create(svg, 'b', 5, 5);
      let sb1 = SecondaryBond.create(svg, b1, b2);
      let l = sb1._line;
      let savableState1 = sb1.savableState();
      let sb2 = SecondaryBond.fromSavedState(
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
      expect(sb2.base1).toBe(b1);
      expect(sb2.base2).toBe(b2);
      expect(sb2._line.id()).toBe(l.id());
    });

    it('copies properties to most recent', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'g', 1, 2);
      let b2 = Base.create(svg, 'y', 4, 9);
      let sb1 = SecondaryBond.create(svg, b1, b2);
      sb1.strokeWidth = 4.23;
      let savableState1 = sb1.savableState();
      SecondaryBond._mostRecentProps.strokeWidth = 1;
      let sb2 = SecondaryBond.fromSavedState(
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
      expect(SecondaryBond.mostRecentProps().strokeWidth).toBe(4.23);
    });
  });

  describe('create static method', () => {
    it('creates with bases', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'a', 1, 5);
      let b2 = Base.create(svg, 'T', 40, 30);
      let sb = SecondaryBond.create(svg, b1, b2);
      expect(sb.base1).toBe(b1);
      expect(sb.base2).toBe(b2);
    });

    it('applies most recent properties', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'g', 1, 5);
      let b2 = Base.create(svg, 'n', 55, 66);
      SecondaryBond._mostRecentProps.strokeWidth = 10.24;
      let sb = SecondaryBond.create(svg, b1, b2);
      expect(sb.strokeWidth).toBe(10.24);
    });
  });

  describe('isAUT method', () => {
    it('works with lowercase characters', () => {
      let svg = NodeSVG();
      let bu = Base.create(svg, 'u', 4, 5);
      let ba = Base.create(svg, 'a', 3, 5);
      let sbua = SecondaryBond.create(svg, bu, ba);
      expect(sbua.isAUT()).toBeTruthy();
    });
  
    it('all possible true cases', () => {
      let svg = NodeSVG();
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
      let svg = NodeSVG();
      let ba = Base.create(svg, 'A', 1, 5);
      let bc = Base.create(svg, 'C', 1, 5);
      let sbac = SecondaryBond.create(svg, ba, bc);
      expect(sbac.isAUT()).toBeFalsy();
    });
  });

  describe('isGC method', () => {
    it('works with lowercase characters', () => {
      let svg = NodeSVG();
      let bc = Base.create(svg, 'c', 3, 5);
      let bg = Base.create(svg, 'g', 8, 9);
      let sbcg = SecondaryBond.create(svg, bc, bg);
      expect(sbcg.isGC()).toBeTruthy();
    });
  
    it('all possible true cases', () => {
      let svg = NodeSVG();
      let bg = Base.create(svg, 'G', 3, 5);
      let bc = Base.create(svg, 'c', 7, 9);
      let sbgc = SecondaryBond.create(svg, bg, bc);
      expect(sbgc.isGC()).toBeTruthy();
      let sbcg = SecondaryBond.create(svg, bc, bg);
      expect(sbcg.isGC()).toBeTruthy();
    });
  
    it('a false case', () => {
      let svg = NodeSVG();
      let bg = Base.create(svg, 'G', 4, 5);
      let bu = Base.create(svg, 'U', 1, 2);
      let sbgu = SecondaryBond.create(svg, bg, bu);
      expect(sbgu.isGC()).toBeFalsy();
    });
  });

  describe('isGUT method', () => {
    it('works with lowercase characters', () => {
      let svg = NodeSVG();
      let bu = Base.create(svg, 'u', 5, 5);
      let bg = Base.create(svg, 'g', 3, 4);
      let sbug = SecondaryBond.create(svg, bu, bg);
      expect(sbug.isGUT()).toBeTruthy();
    });
  
    it('all possible true cases', () => {
      let svg = NodeSVG();
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
      let svg = NodeSVG();
      let bu = Base.create(svg, 'U', 2, 5);
      let ba = Base.create(svg, 'A', 2, 5);
      let sbua = SecondaryBond.create(svg, bu, ba);
      expect(sbua.isGUT()).toBeFalsy();
    });
  });

  describe('padding1 and padding2 getters and setters', () => {
    it('return and set values and update most recent properties', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'e', 1, 5);
      let b2 = Base.create(svg, 'w', 200, 300);
      let sb = SecondaryBond.create(svg, b1, b2);
      sb.padding1 = 12.55;
      sb.padding2 = 32.9;
      expect(sb.padding1).toBeCloseTo(12.55);
      expect(sb.padding2).toBeCloseTo(32.9);
      let mrps = SecondaryBond.mostRecentProps();
      expect(mrps.padding1).toBeCloseTo(12.55);
      expect(mrps.padding2).toBeCloseTo(32.9);
    });
  });

  describe('stroke getter and setter', () => {
    it('return and set values', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'q', 3, 5);
      let b2 = Base.create(svg, 'b', 2, 3);
      let sb = SecondaryBond.create(svg, b1, b2);
      sb.stroke = '#132435';
      expect(sb.stroke).toBe('#132435');
    });

    it('update most recent properties', () => {
      let svg = NodeSVG();
      let ba = Base.create(svg, 'A', 4, 5);
      let bu = Base.create(svg, 'U', 4, 8);
      let bg = Base.create(svg, 'G', 10, 12);
      let bc = Base.create(svg, 'C', 20, 30);
      let sbau = SecondaryBond.create(svg, ba, bu);
      let sbgc = SecondaryBond.create(svg, bg, bc);
      let sbug = SecondaryBond.create(svg, bu, bg);
      let sbga = SecondaryBond.create(svg, bg, ba);
      sbau.stroke = '#445567';
      sbgc.stroke = '#a1b2c3';
      sbug.stroke = '#445abc';
      sbga.stroke = '#aacbd1';
      let mrps = SecondaryBond.mostRecentProps();
      expect(mrps.autStroke).toBe('#445567');
      expect(mrps.gcStroke).toBe('#a1b2c3');
      expect(mrps.gutStroke).toBe('#445abc');
      expect(mrps.otherStroke).toBe('#aacbd1');
    });
  });

  describe('strokeWidth getter and setter', () => {
    it('return and set value and update most recent property', () => {
      let svg = NodeSVG();
      let b1 = Base.create(svg, 'b', 1, 5);
      let b2 = Base.create(svg, 'q', -100, 200);
      let sb = SecondaryBond.create(svg, b1, b2);
      sb.strokeWidth = 1.245;
      expect(sb.strokeWidth).toBe(1.245);
      let mrps = SecondaryBond.mostRecentProps();
      expect(mrps.strokeWidth).toBe(1.245);
    });
  });
});
