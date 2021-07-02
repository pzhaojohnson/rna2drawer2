import { SecondaryBond } from './SecondaryBond';
import { NodeSVG } from 'Draw/NodeSVG';
import Base from 'Draw/Base';
import angleBetween from 'Draw/angleBetween';
import normalizeAngle from 'Draw/normalizeAngle';

let svg = NodeSVG();

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

  it('type getter', () => {
    [
      { type: 'AUT',
        characters1: ['A', 'a'],
        characters2: ['U', 'u', 'T', 't'] },
      { type: 'AUT',
        characters1: ['U', 'u', 'T', 't'],
        characters2: ['A', 'a'] },
      { type: 'GC',
        characters1: ['G', 'g'],
        characters2: ['C', 'c'] },
      { type: 'GC',
        characters1: ['C', 'c'],
        characters2: ['G', 'g'] },
      { type: 'GUT',
        characters1: ['G', 'g'],
        characters2: ['U', 'u', 'T', 't'] },
      { type: 'GUT',
        characters1: ['U', 'u', 'T', 't'],
        characters2: ['G', 'g'] },
      // characters 1 are other characters
      { type: 'other', characters1: ['X', 'x'], characters2: ['G', 'g'] },
      // characters 2 are other characters
      { type: 'other', characters1: ['A', 'a'], characters2: ['N', 'n'] },
      // both characters 1 and 2 are other characters
      { type: 'other', characters1: ['M', 'm'], characters2: ['W', 'w'] },
    ].forEach(t12 => {
      t12.characters1.forEach(c1 => {
        t12.characters2.forEach(c2 => {
          let line = svg.line(100, 200, 300, 200);
          let base1 = Base.create(svg, c1, 50, 200);
          let base2 = Base.create(svg, c2, 350, 200);
          let bond = new SecondaryBond(line, base1, base2);
          expect(bond.type).toBe(t12.type);
        });
      });
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
