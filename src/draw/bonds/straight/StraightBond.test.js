import {
  StraightBond,
  PrimaryBond,
  SecondaryBond,
  lineCoordinatesAreClose,
} from './StraightBond';
import NodeSVG from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import { distance2D as distance } from 'Math/distance';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';
import pair from 'Draw/interact/fold/pair';

it('lineCoordinatesAreClose function', () => {
  let lcs1 = { x1: 1, y1: 2, x2: 3, y2: 4 };
  let lcs2 = { ...lcs1 };
  expect(lineCoordinatesAreClose(lcs1, lcs2)).toBeTruthy(); // are close
  lcs2 = { ...lcs1, x1: 5 };
  expect(lineCoordinatesAreClose(lcs1, lcs2)).toBeFalsy(); // x1 is not close
  lcs2 = { ...lcs1, y1: 10 };
  expect(lineCoordinatesAreClose(lcs1, lcs2)).toBeFalsy(); // y1 is not close
  lcs2 = { ...lcs1, x2: 12 };
  expect(lineCoordinatesAreClose(lcs1, lcs2)).toBeFalsy(); // x2 is not close
  lcs2 = { ...lcs1, y2: -1 };
  expect(lineCoordinatesAreClose(lcs1, lcs2)).toBeFalsy(); // y2 is not close
});

let svg = NodeSVG();

describe('StraightBond class', () => {
  it('_lineCoordinates static method', () => {
    let b1 = Base.create(svg, 'A', 5, 8);
    let b2 = Base.create(svg, 'r', 77, 980);
    let lcs = StraightBond._lineCoordinates(b1, b2, 4, 7);
    expect(
      distance(5, 8, lcs.x1, lcs.y1)
    ).toBeCloseTo(4);
    expect(
      distance(77, 980, lcs.x2, lcs.y2)
    ).toBeCloseTo(7);
    expect(
      normalizeAngle(angleBetween(lcs.x1, lcs.y1, lcs.x2, lcs.y2))
    ).toBeCloseTo(normalizeAngle(b1.angleBetweenCenters(b2)));
  });

  describe('_opacity static method', () => {
    it('paddings sum is too big', () => {
      let b1 = Base.create(svg, 'A', 5, 9);
      let b2 = Base.create(svg, 'T', 8, 13);
      expect(b1.distanceBetweenCenters(b2)).toBeCloseTo(5);
      // note that each padding individually is not too big
      expect(StraightBond._opacity(b1, b2, 2.5, 3.5)).toBe(0);
    });

    it('paddings fit', () => {
      let b1 = Base.create(svg, 't', 1, 5);
      let b2 = Base.create(svg, 'b', 80, 75);
      expect(StraightBond._opacity(b1, b2, 3, 6)).toBe(1);
    });
  });

  describe('constructor', () => {
    let b1 = Base.create(svg, 'a', 1, 2);
    let b2 = Base.create(svg, 'b', 10, 20);

    it('throws on missing line element', () => {
      expect(() => new StraightBond(undefined, b1, b2)).toThrow();
    });

    it('throws on wrong element type', () => {
      let c = svg.circle(20);
      expect(() => new StraightBond(c, b1, b2)).toThrow();
    });

    it('initializes line ID', () => {
      let l = svg.line(1, 2, 6, 8);
      expect(l.attr('id')).toBe(undefined);
      let sb = new StraightBond(l, b1, b2);
      expect(l.attr('id')).toBeTruthy();
    });
  });

  it('id getter', () => {
    let l = svg.line(1, 2, 3, 4);
    l.id('zzxxcc');
    let b1 = Base.create(svg, 'e', 1, 4);
    let b2 = Base.create(svg, 'h', 3, 2);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.id).toBe('zzxxcc');
  });

  it('base1 and base2 getters', () => {
    let l = svg.line(1, 2, 3, 4);
    let b1 = Base.create(svg, 'y', 5, 4);
    let b2 = Base.create(svg, 'n', 4, 5);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.base1).toBe(b1);
    expect(sb.base2).toBe(b2);
  });

  it('contais method', () => {
    let l = svg.line(5, 10, 12, 18);
    let b1 = Base.create(svg, 'g', 1, 1);
    let b2 = Base.create(svg, 'A', 20, 20);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.contains(b1)).toBeTruthy();
    expect(sb.contains(b2)).toBeTruthy();
    let b3 = Base.create(svg, 'a', 5, 10);
    expect(sb.contains(b3)).toBeFalsy();
  });

  it('x1, y1, x2 and y2 getters', () => {
    let l = svg.line(101, 138, 259, 809);
    let b1 = Base.create(svg, 'e', 1, 5);
    let b2 = Base.create(svg, 'k', 600, 700);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.x1).toBeCloseTo(101);
    expect(sb.y1).toBeCloseTo(138);
    expect(sb.x2).toBeCloseTo(259);
    expect(sb.y2).toBeCloseTo(809);
  });

  it('padding1 property', () => {
    let b1 = Base.create(svg, 'e', 800, 900);
    let b2 = Base.create(svg, 'Q', 250, 300);
    let lcs = StraightBond._lineCoordinates(b1, b2, 12, 16);
    let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.getPadding1()).toBeCloseTo(12); // check getter
    sb.setPadding1(26); // use setter
    expect(sb.getPadding1()).toBeCloseTo(26); // check getter
    // check actual value
    expect(distance(800, 900, sb.x1, sb.y1)).toBeCloseTo(26);
    expect(sb.getPadding2()).toBeCloseTo(16); // maintains padding2
  });

  it('padding2 property', () => {
    let b1 = Base.create(svg, 'W', 1012, 112);
    let b2 = Base.create(svg, 'g', 510, 850);
    let lcs = StraightBond._lineCoordinates(b1, b2, 10, 20);
    let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
    let sb = new StraightBond(l, b1, b2);
    expect(sb.getPadding2()).toBeCloseTo(20); // check getter
    sb.setPadding2(5); // use setter
    expect(sb.getPadding2()).toBeCloseTo(5); // check getter
    // check actual value
    expect(distance(510, 850, sb.x2, sb.y2)).toBeCloseTo(5);
    expect(sb.getPadding1()).toBeCloseTo(10); // maintains padding1
  });

  describe('reposition method', () => {
    it('moves line', () => {
      let b1 = Base.create(svg, 'T', 101, 92);
      let b2 = Base.create(svg, 'b', 312, 256);
      let lcs = StraightBond._lineCoordinates(b1, b2, 15, 28);
      let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
      let sb = new StraightBond(l, b1, b2);
      b1.moveTo(185, 112);
      b2.moveTo(900, 872);
      sb.reposition();
      expect(distance(185, 112, sb.x1, sb.y1)).toBeCloseTo(15);
      expect(distance(900, 872, sb.x2, sb.y2)).toBeCloseTo(28);
      let baseAngle = b1.angleBetweenCenters(b2);
      let lineAngle = angleBetween(sb.x1, sb.y1, sb.x2, sb.y2);
      expect(normalizeAngle(lineAngle)).toBeCloseTo(normalizeAngle(baseAngle));
      // maintans paddings
      expect(sb.getPadding1()).toBeCloseTo(15);
      expect(sb.getPadding2()).toBeCloseTo(28);
    });

    it('updates opacity', () => {
      let b1 = Base.create(svg, 'm', 3, 5);
      let b2 = Base.create(svg, 'y', 500, 400);
      let lcs = StraightBond._lineCoordinates(b1, b2, 6, 8);
      let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
      let sb = new StraightBond(l, b1, b2);
      expect(sb.opacity).toBe(1);
      b2.moveTo(4, 6);
      sb.reposition();
      expect(sb.opacity).toBe(0);
      b1.moveTo(98, 76);
      sb.reposition();
      expect(sb.opacity).toBe(1);
    });
  });

  it('stroke and strokeWidth properties', () => {
    let l = svg.line(5, 5, 3, 3);
    let b1 = Base.create(svg, 'b', 1, 4);
    let b2 = Base.create(svg, 'n', 10, 12);
    let sb = new StraightBond(l, b1, b2);
    sb.setStroke('#44bb99'); // use setter
    expect(sb.getStroke()).toBe('#44bb99'); // check getter
    expect(sb.line.attr('stroke')).toBe('#44bb99'); // check actual value
    sb.setStrokeWidth(5.43); // use setter
    expect(sb.getStrokeWidth()).toBe(5.43); // check getter
    expect(sb.line.attr('stroke-width')).toBe(5.43); // check actual value
  });

  it('opacity getter and private setter', () => {
    let l = svg.line(5, 2, 1, 6);
    let b1 = Base.create(svg, 'b', 5, 4);
    let b2 = Base.create(svg, 'n', 3, 5);
    let sb = new StraightBond(l, b1, b2);
    sb._setOpacity(0.55); // use setter
    expect(sb.opacity).toBe(0.55); // check getter
    expect(sb.line.attr('opacity')).toBe(0.55); // check actual value
  });

  it('bringToFront and sendToBack methods', () => {
    let c = svg.circle(50);
    let r = svg.rect(10, 20);
    let b1 = Base.create(svg, 'G', 1, 5);
    let b2 = Base.create(svg, 'T', 100, 120);
    let lcs = StraightBond._lineCoordinates(b1, b2, 8, 8);
    let l = svg.line(lcs.x1, lcs.y1, lcs.x2, lcs.y2);
    let sb = new StraightBond(l, b1, b2);
    let e = svg.ellipse(5, 3);
    expect(sb.line.position()).toBeGreaterThan(0); // not already at back
    // must send all the way to back and not just back one position
    expect(sb.line.position()).toBeGreaterThan(1);
    sb.sendToBack();
    expect(sb.line.position()).toBe(0); // sent to back
    let frontMarker = svg.circle(10);
    sb.bringToFront();
    expect(sb.line.position()).toBeGreaterThan(frontMarker.position()); // brought to front
    // must have been brought all the way to front and not just forward one position
    expect(sb.line.position()).toBeGreaterThan(1);
  });

  it('remove method', () => {
    let l = svg.line(1, 2, 4, 5);
    let b1 = Base.create(svg, 'n', 1, 4);
    let b2 = Base.create(svg, 'n', 4, 4);
    let sb = new StraightBond(l, b1, b2);
    let id = '#' + l.id();
    expect(svg.findOne(id)).toBeTruthy();
    sb.remove();
    expect(svg.findOne(id)).toBeFalsy();
  });

  describe('savableState method', () => {
    it('includes className and line and base IDs', () => {
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
      let savableState = sb.savableState();
      let json = JSON.stringify(savableState);
      let parsed = JSON.parse(json);
      expect(JSON.stringify(parsed)).toBe(json);
    });
  });

  it('refreshIds method', () => {
    let l = svg.line(1, 2, 3, 4);
    let b1 = Base.create(svg, 'a', 1, 4);
    let b2 = Base.create(svg, 'h', 5, 5);
    let sb = new StraightBond(l, b1, b2);
    let oldId = sb.line.id();
    sb.refreshIds();
    expect(sb.line.id()).not.toBe(oldId);
  });
});

describe('PrimaryBond class', () => {
  describe('fromSavedState static method', () => {
    let b1 = Base.create(svg, 'q', 5, 8);
    let b2 = Base.create(svg, 't', 100, 200);
    let getBaseById = id => id === b1.id ? b1 : b2;

    describe('invalid saved state', () => {
      it('wrong class name', () => {
        let pb = PrimaryBond.create(svg, b1, b2);
        let savableState = pb.savableState();
        savableState.className = 'StraightBnd';
        expect(
          () => StraightBond.fromSavedState(savableState, svg, getBaseById)
        ).toThrow();
      });
    });

    it('valid saved state', () => {
      let pb1 = PrimaryBond.create(svg, b1, b2);
      let lineId = pb1.line.id();
      let savableState = pb1.savableState();
      let pb2 = PrimaryBond.fromSavedState(savableState, svg, getBaseById);
      expect(pb2.line.id()).toBe(lineId);
      expect(pb2.base1).toBe(b1);
      expect(pb2.base2).toBe(b2);
    });
  });

  describe('create static method', () => {
    let b1 = Base.create(svg, 'b', 1, 5);
    let b2 = Base.create(svg, 'Y', 10, 20);
    let pb = PrimaryBond.create(svg, b1, b2);

    it('creates with bases', () => {
      expect(pb.base1).toBe(b1);
      expect(pb.base2).toBe(b2);
    });

    it('creates with valid line coordinates', () => {
      let baseAngle = b1.angleBetweenCenters(b2);
      let lineAngle = angleBetween(pb.x1, pb.y1, pb.x2, pb.y2);
      expect(normalizeAngle(lineAngle)).toBeCloseTo(normalizeAngle(baseAngle));
    });

    it('sets opacity', () => {
      let b1 = Base.create(svg, 'a', 5, 50);
      let b2 = Base.create(svg, 'g', 5, 50);
      let b3 = Base.create(svg, 'f', 1000, 2000);
      // zero distance between bases
      let pb1 = PrimaryBond.create(svg, b1, b2);
      expect(pb1.opacity).toBe(0);
      // far away bases
      let pb2 = PrimaryBond.create(svg, b1, b3);
      expect(pb2.opacity).toBe(1);
    });
  });

  it('padding1 and padding2 getters and setters', () => {
    let b1 = Base.create(svg, 'E', 1, 5);
    let b2 = Base.create(svg, 'h', 55, 44);
    let pb = PrimaryBond.create(svg, b1, b2);
    pb.padding1 = 12.3; // use setter
    expect(pb.padding1).toBeCloseTo(12.3); // check getter
    // updates default value
    expect(PrimaryBond.recommendedDefaults.basePadding1).toBeCloseTo(12.3);
    pb.padding2 = 14.03; // use setter
    expect(pb.padding2).toBeCloseTo(14.03); // check getter
    // updates default value
    expect(PrimaryBond.recommendedDefaults.basePadding2).toBeCloseTo(14.03);
  });

  it('stroke and strokeWidth getters and setters', () => {
    let b1 = Base.create(svg, 'Q', 1, 1);
    let b2 = Base.create(svg, 'o', 200, 300);
    let pb = PrimaryBond.create(svg, b1, b2);
    pb.stroke = '#4455bc'; // use setter
    expect(pb.stroke).toBe('#4455bc'); // check getter
    // updates default value
    expect(PrimaryBond.recommendedDefaults.line['stroke']).toBe('#4455bc');
    pb.strokeWidth = 4.011; // use setter
    expect(pb.strokeWidth).toBe(4.011); // check getter
    // updates default value
    expect(PrimaryBond.recommendedDefaults.line['stroke-width']).toBe(4.011);
  });
});

describe('SecondaryBond class', () => {
  describe('mostRecentProps static method', () => {
    it('returns a copy', () => {
      SecondaryBond._mostRecentProps.padding1 = 3.4588;
      SecondaryBond._mostRecentProps.padding2 = 6.77;
      SecondaryBond._mostRecentProps.autStroke = '#aaccee';
      SecondaryBond._mostRecentProps.gcStroke = '#bbddff';
      SecondaryBond._mostRecentProps.gutStroke = '#115533';
      SecondaryBond._mostRecentProps.otherStroke = '#226644';
      SecondaryBond._mostRecentProps.strokeWidth = 1.28;
      let mrps = SecondaryBond.mostRecentProps();
      expect(mrps).not.toBe(PrimaryBond._mostRecentProps); // a new object
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
      it('wrong class name', () => {
        let b1 = Base.create(svg, 'a', 1, 2);
        let b2 = Base.create(svg, 'w', 30, 40);
        let getBaseById = id => id === b1.id ? b1 : b2;
        let sb = SecondaryBond.create(svg, b1, b2);
        let savableState = sb.savableState();
        savableState.className = 'StraghtBond';
        expect(
          () => SecondaryBond.fromSavedState(savableState, svg, getBaseById)
        ).toThrow();
      });
    });

    it('valid saved state', () => {
      let b1 = Base.create(svg, 'M', 100, 200);
      let b2 = Base.create(svg, 'q', 50, 800);
      let getBaseById = id => id === b1.id ? b1 : b2;
      let sb1 = SecondaryBond.create(svg, b1, b2);
      let lineId = sb1.line.id();
      let spy = jest.spyOn(SecondaryBond, '_copyPropsToMostRecent');
      let savableState = sb1.savableState();
      let sb2 = SecondaryBond.fromSavedState(savableState, svg, getBaseById);
      expect(sb2.line.id()).toBe(lineId);
      expect(sb2.base1).toBe(b1);
      expect(sb2.base2).toBe(b2);
      // copies props to most recent
      expect(spy.mock.calls[0][0]).toBe(sb2);
    });
  });

  describe('create static method', () => {
    let b1 = Base.create(svg, 'a', 100, 200);
    let b2 = Base.create(svg, 'P', 500, 600);
    let spy = jest.spyOn(SecondaryBond, '_applyMostRecentProps');
    let sb = SecondaryBond.create(svg, b1, b2);

    it('creates with bases', () => {
      expect(sb.base1).toBe(b1);
      expect(sb.base2).toBe(b2);
    });

    it('creates with valid line coordinates', () => {
      let baseAngle = b1.angleBetweenCenters(b2);
      let lineAngle = angleBetween(sb.x1, sb.y1, sb.x2, sb.y2);
      expect(normalizeAngle(lineAngle)).toBeCloseTo(normalizeAngle(baseAngle));
    });

    it('applies most recent props', () => {
      expect(spy.mock.calls[0][0]).toBe(sb);
    });

    it('sets opacity', () => {
      let b1 = Base.create(svg, 'g', 100, 200);
      let b2 = Base.create(svg, 't', 100, 200);
      let b3 = Base.create(svg, 'B', 500, 1500);
      // zero distance between bases
      let sb1 = SecondaryBond.create(svg, b1, b2);
      expect(sb1.opacity).toBe(0);
      // far away bases
      let sb2 = SecondaryBond.create(svg, b1, b3);
      expect(sb2.opacity).toBe(1);
    });
  });

  describe('isAUT method', () => {
    it('works with lowercase characters', () => {
      let bu = Base.create(svg, 'u', 4, 5);
      let ba = Base.create(svg, 'a', 3, 5);
      let sbua = SecondaryBond.create(svg, bu, ba);
      expect(sbua.isAUT()).toBeTruthy();
    });

    it('all possible true cases', () => {
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
      let ba = Base.create(svg, 'A', 1, 5);
      let bc = Base.create(svg, 'C', 1, 5);
      let sbac = SecondaryBond.create(svg, ba, bc);
      expect(sbac.isAUT()).toBeFalsy();
    });
  });

  describe('isGC method', () => {
    it('works with lowercase characters', () => {
      let bc = Base.create(svg, 'c', 3, 5);
      let bg = Base.create(svg, 'g', 8, 9);
      let sbcg = SecondaryBond.create(svg, bc, bg);
      expect(sbcg.isGC()).toBeTruthy();
    });

    it('all possible true cases', () => {
      let bg = Base.create(svg, 'G', 3, 5);
      let bc = Base.create(svg, 'c', 7, 9);
      let sbgc = SecondaryBond.create(svg, bg, bc);
      expect(sbgc.isGC()).toBeTruthy();
      let sbcg = SecondaryBond.create(svg, bc, bg);
      expect(sbcg.isGC()).toBeTruthy();
    });

    it('a false case', () => {
      let bg = Base.create(svg, 'G', 4, 5);
      let bu = Base.create(svg, 'U', 1, 2);
      let sbgu = SecondaryBond.create(svg, bg, bu);
      expect(sbgu.isGC()).toBeFalsy();
    });
  });

  describe('isGUT method', () => {
    it('works with lowercase characters', () => {
      let bu = Base.create(svg, 'u', 5, 5);
      let bg = Base.create(svg, 'g', 3, 4);
      let sbug = SecondaryBond.create(svg, bu, bg);
      expect(sbug.isGUT()).toBeTruthy();
    });

    it('all possible true cases', () => {
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
      let bu = Base.create(svg, 'U', 2, 5);
      let ba = Base.create(svg, 'A', 2, 5);
      let sbua = SecondaryBond.create(svg, bu, ba);
      expect(sbua.isGUT()).toBeFalsy();
    });
  });

  it('padding1 and padding2 getters and setters', () => {
    let b1 = Base.create(svg, 'e', 1, 5);
    let b2 = Base.create(svg, 'w', 200, 300);
    let sb = SecondaryBond.create(svg, b1, b2);
    sb.padding1 = 12.55; // use setter
    expect(sb.padding1).toBeCloseTo(12.55); // check getter
    // updates most recent prop
    expect(SecondaryBond.mostRecentProps().padding1).toBeCloseTo(12.55);
    sb.padding2 = 32.9; // use setter
    expect(sb.padding2).toBeCloseTo(32.9); // check getter
    // updates most recent prop
    expect(SecondaryBond.mostRecentProps().padding2).toBeCloseTo(32.9);
  });

  describe('stroke getter and setter', () => {
    it('retrieves and sets value', () => {
      let b1 = Base.create(svg, 'q', 3, 5);
      let b2 = Base.create(svg, 'b', 2, 3);
      let sb = SecondaryBond.create(svg, b1, b2);
      sb.stroke = '#132435';
      expect(sb.stroke).toBe('#132435');
    });

    it('updates most recent props', () => {
      let ba = Base.create(svg, 'A', 4, 5);
      let bu = Base.create(svg, 'u', 4, 8);
      let bg = Base.create(svg, 'g', 10, 12);
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

  it('strokeWidth getter and setter', () => {
    let b1 = Base.create(svg, 'b', 1, 5);
    let b2 = Base.create(svg, 'q', -100, 200);
    let sb = SecondaryBond.create(svg, b1, b2);
    sb.strokeWidth = 1.245; // use setter
    expect(sb.strokeWidth).toBe(1.245); // check getter
    // updates most recent prop
    expect(SecondaryBond.mostRecentProps().strokeWidth).toBe(1.245);
  });
});
