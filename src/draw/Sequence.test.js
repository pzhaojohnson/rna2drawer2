import Sequence from './Sequence';
import NodeSVG from './NodeSVG';
import Base from './Base';
import normalizeAngle from './normalizeAngle';
import angleBetween from './angleBetween';

let svg = NodeSVG();

describe('Sequence class', () => {
  describe('mostRecentProps static method', () => {
    it('returns a copy', () => {
      Sequence._mostRecentProps.numberingAnchor = 804;
      Sequence._mostRecentProps.numberingIncrement = 99;
      let mrps = Sequence.mostRecentProps();
      expect(mrps).not.toBe(Sequence._mostRecentProps); // a new object
      expect(mrps.numberingAnchor).toBe(804);
      expect(mrps.numberingIncrement).toBe(99);
    });
  });
  
  it('_applyMostRecentProps static method', () => {
    let seq = new Sequence('asdf');
    Sequence._mostRecentProps.numberingAnchor = 980;
    Sequence._mostRecentProps.numberingIncrement = 88;
    Sequence._applyMostRecentProps(seq);
    expect(seq.numberingAnchor).toBe(980);
    expect(seq.numberingIncrement).toBe(88);
  });

  it('_copyPropsToMostRecent static method', () => {
    let seq = new Sequence('asdf');
    seq.numberingAnchor = -5;
    seq.numberingIncrement = 4;
    // necessary since the above setters update most recent props
    Sequence._mostRecentProps.numberingAnchor = 10;
    Sequence._mostRecentProps.numberingIncrement = 20;
    Sequence._copyPropsToMostRecent(seq);
    let mrps = Sequence.mostRecentProps();
    expect(mrps.numberingAnchor).toBe(-5);
    expect(mrps.numberingIncrement).toBe(4);
  });

  describe('_clockwiseNormalAngleOfBase static method', () => {
    let cs = { xCenter: 15, yCenter: 33 };
    let cs5 = { xCenter: 52, yCenter: 80 };
    let cs3 = { xCenter: 2, yCenter: 45 };

    it('no neighboring bases', () => {
      let cna = Sequence._clockwiseNormalAngleOfBase(cs, null, null);
      expect(cna).toBe(Math.PI / 2);
    });

    it("only a 5' neighboring base", () => {
      let cna = Sequence._clockwiseNormalAngleOfBase(cs, cs5, null);
      expect(normalizeAngle(cna)).toBeCloseTo(5.616277102940276);
    });

    it("only a 3' neighboring base", () => {
      let cna = Sequence._clockwiseNormalAngleOfBase(cs, null, cs3);
      expect(normalizeAngle(cna)).toBeCloseTo(3.9669695041105317);
    });

    it("both 5' and 3' neighboring bases", () => {
      // requires that the 5' angle is normalized to the 3' angle
      let cna = Sequence._clockwiseNormalAngleOfBase(cs, cs5, cs3);
      expect(normalizeAngle(cna)).toBeCloseTo(4.791623303525403);
    });
  });

  describe('_innerNormalAngleOfBase static method', () => {
    let cs = { xCenter: 15, yCenter: 33 };
    let cs5 = { xCenter: 52, yCenter: 80 };
    let cs3 = { xCenter: 2, yCenter: 45 };
    
    it("no 5' or 3' neighboring bases", () => {
      let ina = Sequence._innerNormalAngleOfBase(cs, null, null);
      let cna = Sequence._clockwiseNormalAngleOfBase(cs, null, null);
      expect(ina).toBe(cna);
    });

    it("no 5' neighboring base", () => {
      let ina = Sequence._innerNormalAngleOfBase(cs, null, cs3);
      let cna = Sequence._clockwiseNormalAngleOfBase(cs, null, cs3);
      expect(ina).toBe(cna);
    });

    it("no 3' neighboring base", () => {
      let ina = Sequence._innerNormalAngleOfBase(cs, cs5, null);
      let cna = Sequence._clockwiseNormalAngleOfBase(cs, cs5, null);
      expect(ina).toBe(cna);
    });

    describe("has 5' and 3' neighboring bases", () => {
      it('should return the clockwise normal angle', () => {
        let cs = { xCenter: 100, yCenter: 200 };
        let cs5 = { xCenter: 80, yCenter: 300 };
        let cs3 = { xCenter: 150, yCenter: 150 };
        let ina = Sequence._innerNormalAngleOfBase(cs, cs5, cs3);
        let cna = Sequence._clockwiseNormalAngleOfBase(cs, cs5, cs3);
        expect(ina).toBe(cna);
      });

      it('should return the counter-clockwise normal angle', () => {
        let cs = { xCenter: -250, yCenter: 100 };
        let cs5 = { xCenter: -400, yCenter: 120 };
        let cs3 = { xCenter: -200, yCenter: -50 };
        let ina = Sequence._innerNormalAngleOfBase(cs, cs5, cs3);
        let cna = Sequence._clockwiseNormalAngleOfBase(cs, cs5, cs3);
        expect(normalizeAngle(ina)).toBeCloseTo(normalizeAngle(cna + Math.PI));
      });
    });
  });

  describe('fromSavedState static method', () => {
    it('wrong class name', () => {
      let seq = new Sequence('qwer');
      let savableState = seq.savableState();
      savableState.className = 'Squence';
      expect(() => Sequence.fromSavedState(savableState, svg)).toThrow();
    });

    it('creates with id and numbering properties', () => {
      let seq1 = new Sequence('zxcvasdfqwer');
      seq1.numberingOffset = -200;
      seq1.numberingAnchor = 249;
      seq1.numberingIncrement = 134;
      let savableState = seq1.savableState();
      let seq2 = Sequence.fromSavedState(savableState, svg);
      expect(seq2.id).toBe('zxcvasdfqwer');
      expect(seq2.numberingOffset).toBe(-200);
      expect(seq2.numberingAnchor).toBe(249);
      expect(seq2.numberingIncrement).toBe(134);
    });

    it('handles nullish numbering props', () => {
      let seq1 = new Sequence('asdf');
      let savableState = seq1.savableState();
      savableState.numberingOffset = undefined;
      savableState.numberingAnchor = undefined;
      savableState.numberingIncrement = undefined;
      let seq2 = Sequence.fromSavedState(savableState, svg);
      expect(seq2.numberingOffset).toBe(0);
      expect(seq2.numberingAnchor).toBe(0);
      expect(seq2.numberingIncrement).toBeGreaterThan(0);
    });

    it('creates with bases', () => {
      let seq1 = new Sequence('asdf');
      seq1.appendBases([
        Base.create(svg, 'y', 2, 4),
        Base.create(svg, 'M', 5, 10),
        Base.create(svg, 'p', 10, 200),
      ]);
      let savableState = seq1.savableState();
      let seq2 = Sequence.fromSavedState(savableState, svg);
      expect(seq2.length).toBe(3);
      let b21 = seq2.getBaseAtPosition(1);
      expect(b21.character).toBe('y');
      let b22 = seq2.getBaseAtPosition(2);
      expect(b22.character).toBe('M');
      let b23 = seq2.getBaseAtPosition(3);
      expect(b23.character).toBe('p');
    });

    it('copies props to most recent', () => {
      let seq1 = new Sequence('asdf');
      let savableState = seq1.savableState();
      let spy = jest.spyOn(Sequence, '_copyPropsToMostRecent');
      let seq2 = Sequence.fromSavedState(savableState, svg);
      expect(spy.mock.calls[0][0]).toBe(seq2);
    });
  });

  describe('createOutOfView static method', () => {
    it('creates with ID', () => {
      let seq = Sequence.createOutOfView(svg, 'ppooiiuu', 'asdf');
      expect(seq.id).toBe('ppooiiuu');
    });

    it('adds bases out of view', () => {
      let seq = Sequence.createOutOfView(svg, 'asdf', 'wOu');
      expect(seq.length).toBe(3);
      let b1 = seq.getBaseAtPosition(1);
      expect(b1.character).toBe('w');
      let b2 = seq.getBaseAtPosition(2);
      expect(b2.character).toBe('O');
      let b3 = seq.getBaseAtPosition(3);
      expect(b3.character).toBe('u');
      seq.forEachBase(b => {
        expect(b.xCenter < -50 || b.yCenter < -50).toBeTruthy();
      });
    });

    it('applies most recent properties', () => {
      let spy = jest.spyOn(Sequence, '_applyMostRecentProps');
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
      expect(spy.mock.calls[0][0]).toBe(seq);
    });
  });

  it('id getter', () => {
    let seq = new Sequence('ooyyuu');
    expect(seq.id).toBe('ooyyuu');
  });

  it('characters getter', () => {
    let seq = new Sequence('asdf');
    seq.appendBases([
      Base.create(svg, 'b', 1, 2),
      Base.create(svg, 'T', 5, 4),
      Base.create(svg, 'Q', 10, 200),
      Base.create(svg, '2', 4, 3),
    ]);
    seq.removeBaseAtPosition(3);
    expect(seq.characters).toBe('bT2');
  });

  it('_updateBaseNumberings method', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'asdfasdfasdf');
    seq.numberingOffset = 15; // must offset numbering
    seq.numberingAnchor = 6;
    seq.numberingIncrement = 3;
    seq.forEachBase(b => b.removeNumbering());
    seq.getBaseAtPosition(2).addNumbering(100); // to remove
    seq.getBaseAtPosition(8).addNumbering(8); // to remove
    seq.getBaseAtPosition(9).addNumbering(90); // to replace
    seq._updateBaseNumberings();
    expect(seq.getBaseAtPosition(1).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(2).hasNumbering()).toBeFalsy(); // was removed
    expect(seq.getBaseAtPosition(3).numbering.number).toBe(18); // was added
    expect(seq.getBaseAtPosition(4).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(5).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(6).numbering.number).toBe(21); //was added
    expect(seq.getBaseAtPosition(7).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(8).hasNumbering()).toBeFalsy(); // was removed
    expect(seq.getBaseAtPosition(9).numbering.number).toBe(24); // was replaced
    expect(seq.getBaseAtPosition(10).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(11).hasNumbering()).toBeFalsy();
    expect(seq.getBaseAtPosition(12).numbering.number).toBe(27); // was added
  });

  it('numberingOffset getter and setter', () => {
    let seq = new Sequence('asdf');
    let spy = jest.spyOn(seq, '_updateBaseNumberings');
    seq.numberingOffset = 25; // use setter
    expect(seq.numberingOffset).toBe(25); // check getter
    expect(spy).toHaveBeenCalled(); // updates base numberings
    seq.numberingOffset = -Infinity; // ignores nonfinite numbers
    expect(seq.numberingOffset).toBe(25);
    seq.numberingOffset = 5.5; // ignores non-integers
    expect(seq.numberingOffset).toBe(25);
  });

  it('numberingAnchor getter and setter', () => {
    let seq = new Sequence('qwer');
    let spy = jest.spyOn(seq, '_updateBaseNumberings');
    seq.numberingAnchor = 1012; // use setter
    expect(seq.numberingAnchor).toBe(1012); // check getter
    expect(spy).toHaveBeenCalled(); // updates base numberings
    // updates most recent prop
    expect(Sequence.mostRecentProps().numberingAnchor).toBe(1012);
    seq.numberingAnchor = NaN; // ignores nonfinite numbers
    expect(seq.numberingAnchor).toBe(1012);
    seq.numberingAnchor = 10.1; // ignores non-integers
    expect(seq.numberingAnchor).toBe(1012);
  });

  it('numberingIncrement getter and setter', () => {
    let seq = new Sequence('asdf');
    let spy = jest.spyOn(seq, '_updateBaseNumberings');
    seq.numberingIncrement = 82; // use setter
    expect(seq.numberingIncrement).toBe(82); // check getter
    expect(spy).toHaveBeenCalled(); // updates base numberings
    // updates most recent prop
    expect(Sequence.mostRecentProps().numberingIncrement).toBe(82);
    seq.numberingIncrement = Infinity; // ignores nonfinite numbers
    expect(seq.numberingIncrement).toBe(82);
    seq.numberingIncrement = 9.8; // ignores non-integers
    expect(seq.numberingIncrement).toBe(82);
    seq.numberingIncrement = -10; // ignores negative numbers
    expect(seq.numberingIncrement).toBe(82);
    seq.numberingIncrement = 0; // ignores zero
    expect(seq.numberingIncrement).toBe(82);
  });

  it('length getter', () => {
    let seq = new Sequence('asdf');
    expect(seq.length).toBe(0);
    seq.appendBases([
      Base.create(svg, 'T', 3, 4),
      Base.create(svg, 'H', 2, 2),
      Base.create(svg, 't', 5, 10),
      Base.create(svg, 'Q', 10, 20),
    ]);
    expect(seq.length).toBe(4);
    seq.removeBaseAtPosition(2);
    expect(seq.length).toBe(3);
  });

  it('offsetPosition and reversePositionOffset methods', () => {
    let seq = new Sequence('asdf');
    seq.numberingOffset = -12;
    expect(seq.offsetPosition(19)).toBe(7);
    expect(seq.reversePositionOffset(20)).toBe(32);
  });

  it('positionOutOfRange method', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
    expect(seq.positionOutOfRange(0)).toBeTruthy();
    expect(seq.positionOutOfRange)
  });

  describe('positionOutOfRange method', () => {
    let seq = Sequence.createOutOfView(svg, 'ki', 'ggha');
    expect(seq.positionOutOfRange(0)).toBeTruthy();
    expect(seq.positionOutOfRange(1)).toBeFalsy();
    expect(seq.positionOutOfRange(2)).toBeFalsy();
    expect(seq.positionOutOfRange(3)).toBeFalsy();
    expect(seq.positionOutOfRange(4)).toBeFalsy();
    expect(seq.positionOutOfRange(5)).toBeTruthy();
  });

  describe('positionInRange method', () => {
    let seq = Sequence.createOutOfView(svg, 'uuj', 'lkjq');
    expect(seq.positionInRange(0)).toBeFalsy();
    expect(seq.positionInRange(1)).toBeTruthy();
    expect(seq.positionInRange(2)).toBeTruthy();
    expect(seq.positionInRange(3)).toBeTruthy();
    expect(seq.positionInRange(4)).toBeTruthy();
    expect(seq.positionInRange(5)).toBeFalsy();
  });

  describe('offsetPositionOutOfRange method', () => {
    let seq = Sequence.createOutOfView(svg, 'hh', 'plot');
    seq.numberingOffset = 12;
    expect(seq.offsetPositionOutOfRange(12)).toBeTruthy();
    expect(seq.offsetPositionOutOfRange(13)).toBeFalsy();
    expect(seq.offsetPositionOutOfRange(14)).toBeFalsy();
    expect(seq.offsetPositionOutOfRange(15)).toBeFalsy();
    expect(seq.offsetPositionOutOfRange(16)).toBeFalsy();
    expect(seq.offsetPositionOutOfRange(17)).toBeTruthy();
  });

  describe('offsetPositionInRange method', () => {
    let seq = Sequence.createOutOfView(svg, 'qwer', 'QYQq');
    seq.numberingOffset = -45;
    expect(seq.offsetPositionInRange(-45)).toBeFalsy();
    expect(seq.offsetPositionInRange(-44)).toBeTruthy();
    expect(seq.offsetPositionInRange(-43)).toBeTruthy();
    expect(seq.offsetPositionInRange(-42)).toBeTruthy();
    expect(seq.offsetPositionInRange(-41)).toBeTruthy();
    expect(seq.offsetPositionInRange(-40)).toBeFalsy();
  });

  it('getBaseAtPosition and getBaseAtOffsetPosition methods', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'qwerzxcv');
    seq.numberingOffset = 12;
    expect(seq.getBaseAtPosition(6).character).toBe('x');
    expect(seq.getBaseAtOffsetPosition(14).character).toBe('w');
    expect(seq.getBaseAtPosition(10)).toBeFalsy(); // out of range
    expect(seq.getBaseAtOffsetPosition(8)).toBeFalsy(); // out of range
  });

  describe('getBaseById method', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
    let b3 = seq.getBaseAtPosition(3);
    expect(seq.getBaseById(b3.id)).toBe(b3);
    expect(seq.getBaseById('nonexistent ID')).toBeFalsy();
  });

  describe('getBasesInRange method', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'zxcvqw');

    it('normal case', () => {
      let bases = seq.getBasesInRange(3, 5);
      expect(bases.length).toBe(3);
      expect(bases[0].character).toBe('c');
      expect(bases[1].character).toBe('v');
      expect(bases[2].character).toBe('q');
    });

    it('p5 is greater than p3', () => {
      let bases = seq.getBasesInRange(5, 3);
      expect(bases.length).toBe(0);
    });
  });

  it('forEachBase method', () => {
    let characters = 'cvbn';
    let seq = Sequence.createOutOfView(svg, 'adf', characters);
    let i = 0;
    seq.forEachBase((b, p) => {
      expect(b.character).toBe(characters.charAt(i));
      expect(p).toBe(i + 1);
      i++;
    });
    expect(i).toBe(4);
  });

  it('baseIds method', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'bhq');
    let ids = seq.baseIds();
    expect(ids.length).toBe(3);
    expect(ids[0]).toBe(seq.getBaseAtPosition(1).id);
    expect(ids[1]).toBe(seq.getBaseAtPosition(2).id);
    expect(ids[2]).toBe(seq.getBaseAtPosition(3).id);
  });

  describe('positionOfBase and offsetPositionOfBase methods', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
    seq.numberingOffset = 33;
    let b3 = seq.getBaseAtPosition(3);
    expect(seq.positionOfBase(b3)).toBe(3);
    expect(seq.offsetPositionOfBase(b3)).toBe(36);
    let b = Base.create(svg, 'a', 1, 2); // not in sequence
    expect(seq.positionOfBase(b)).toBe(0);
    expect(seq.offsetPositionOfBase(b)).toBe(33);
  });

  describe('contains method', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'qwerqwer');
    let b6 = seq.getBaseAtPosition(6);
    expect(seq.contains(b6)).toBeTruthy();
    let b = Base.create(svg, 'a', 1, 2); // not in sequence
    expect(seq.contains(b)).toBeFalsy();
  });

  describe('clockwiseNormalAngleAtPosition method', () => {
    it('position is out of range', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
      expect(seq.clockwiseNormalAngleAtPosition(5)).toBe(null);
    });

    it("no 5' or 3' base", () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      let b = Base.create(svg, 'a', 4, 7);
      seq.appendBase(b);
      expect(
        seq.clockwiseNormalAngleAtPosition(1)
      ).toBe(Sequence._clockwiseNormalAngleOfBase(
        { xCenter: 4, yCenter: 7 },
        null,
        null,
      ));
    });

    it("has a 5' and 3' base", () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      seq.appendBases([
        Base.create(svg, 'e', 5, 10),
        Base.create(svg, 'b', 20, 30),
        Base.create(svg, 'n', 44, 55),
      ]);
      expect(
        seq.clockwiseNormalAngleAtPosition(2)
      ).toBe(Sequence._clockwiseNormalAngleOfBase(
        { xCenter: 20, yCenter: 30 },
        { xCenter: 5, yCenter: 10 },
        { xCenter: 44, yCenter: 55 },
      ));
    });
  });

  describe('counterClockwiseNormalAngleAtPosition method', () => {
    it('position is out of range', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
      expect(seq.counterClockwiseNormalAngleAtPosition(6)).toBe(null);
    });

    it('position is in range', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'zxcvzxcv');
      expect(
        seq.counterClockwiseNormalAngleAtPosition(5)
      ).toBe(
        Math.PI + seq.clockwiseNormalAngleAtPosition(5)
      );
    });
  });

  describe('innerNormalAngleAtPosition method', () => {
    it('position is out of range', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'zxcv', 'asdf');
      expect(seq.innerNormalAngleAtPosition(5)).toBe(null);
    });

    it("no 5' or 3' base", () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      seq.appendBase(
        Base.create(svg, 't', 5, 12),
      );
      expect(
        seq.innerNormalAngleAtPosition(1)
      ).toBe(Sequence._innerNormalAngleOfBase(
        { xCenter: 5, yCenter: 12 },
        null,
        null,
      ));
    });

    it("has a 5' and 3' base", () => {
      let svg = NodeSVG();
      let seq = new Sequence('qwer');
      seq.appendBases([
        Base.create(svg, 'Q', 55, 44),
        Base.create(svg, 'q', -10, 33),
        Base.create(svg, 'N', 100, 112),
      ]);
      expect(
        seq.innerNormalAngleAtPosition(2)
      ).toBe(Sequence._innerNormalAngleOfBase(
        { xCenter: -10, yCenter: 33 },
        { xCenter: 55, yCenter: 44 },
        { xCenter: 100, yCenter: 112 },
      ));
    });
  });

  describe('outerNormalAngleAtPosition', () => {
    it('position out of range', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'qwer', 'dd');
      expect(seq.outerNormalAngleAtPosition(3)).toBe(null);
    });

    it('position is in range', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'zxcv');
      expect(
        seq.outerNormalAngleAtPosition(2)
      ).toBe(
        Math.PI + seq.innerNormalAngleAtPosition(2)
      );
    });
  });

  describe('appendBase method', () => {
    it('already contains base', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
      let spy = jest.spyOn(seq, 'fireAddBase');
      expect(seq.length).toBe(4);
      seq.appendBase(seq.getBaseAtPosition(3));
      expect(seq.length).toBe(4);
      expect(spy).not.toHaveBeenCalled();
    });

    it('appends base', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'zxcv');
      let spy = jest.spyOn(seq, 'fireAddBase');
      expect(seq.length).toBe(4);
      let b = Base.create(svg, 'q', 4, 5);
      seq.appendBase(b);
      expect(seq.length).toBe(5);
      expect(seq.getBaseAtPosition(5)).toBe(b);
      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toBe(b);
    });
    
    it('updates base numberings', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'qwer', 'asdfasdf');
      seq.numberingAnchor = 0;
      seq.numberingIncrement = 9;
      let b = Base.create(svg, 't', 1, 5);
      expect(b.hasNumbering()).toBeFalsy();
      seq.appendBase(b);
      expect(b.hasNumbering()).toBeTruthy();
    });
  });

  describe('appendBases method', () => {
    it('sequence already contains one of the given bases', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'asdf');
      let spy = jest.spyOn(seq, 'fireAddBase');
      let b1 = Base.create(svg, 'Q', 1, 5);
      let b2 = seq.getBaseAtPosition(3);
      let b3 = Base.create(svg, 'H', 5, 6);
      expect(seq.length).toBe(4);
      seq.appendBases([b1, b2, b3], svg);
      expect(seq.length).toBe(4);
      expect(spy).not.toHaveBeenCalled();
    });

    it('sequence does not contain any of the given bases', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'QQE', 'qqe');
      let spy = jest.spyOn(seq, 'fireAddBase');
      let b1 = Base.create(svg, 'T', 3, 1);
      let b2 = Base.create(svg, 'B', 3, 3);
      expect(seq.length).toBe(3);
      seq.appendBases([b1, b2], svg);
      expect(seq.length).toBe(5);
      expect(seq.getBaseAtPosition(4).id).toBe(b1.id);
      expect(seq.getBaseAtPosition(5).id).toBe(b2.id);
      expect(spy.mock.calls.length).toBe(2);
      expect(spy.mock.calls[0][0]).toBe(b1);
      expect(spy.mock.calls[1][0]).toBe(b2);
    });

    it('updates base numberings', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'asdfasdfasdfasdfasdf');
      seq.numberingAnchor = 12;
      seq.numberingIncrement = 10;
      expect(seq.getBaseAtPosition(2).hasNumbering()).toBeTruthy();
      expect(seq.getBaseAtPosition(12).hasNumbering()).toBeTruthy();
      let bases = [
        Base.create(svg, 'a', 1, 2),
        Base.create(svg, 't', 5, 6),
        Base.create(svg, 'r', 6, 9),
      ];
      seq.appendBases(bases, svg);
      expect(seq.getBaseAtPosition(2).hasNumbering()).toBeTruthy();
      expect(seq.getBaseAtPosition(12).hasNumbering()).toBeTruthy();
      expect(seq.getBaseAtPosition(21).hasNumbering()).toBeFalsy();
      expect(seq.getBaseAtPosition(22).hasNumbering()).toBeTruthy();
      expect(seq.getBaseAtPosition(23).hasNumbering()).toBeFalsy();
    });
  });

  describe('insertBaseAtPosition method', () => {
    it('already contains given base', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwe');
      let spy = jest.spyOn(seq, 'fireAddBase');
      let b2 = seq.getBaseAtPosition(2);
      expect(seq.length).toBe(3);
      seq.insertBaseAtPosition(b2, 3);
      expect(seq.length).toBe(3);
      expect(spy).not.toHaveBeenCalled();
    });

    it('position is out of range', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'qwer', 'kkj');
      let spy = jest.spyOn(seq, 'fireAddBase');
      let b = Base.create(svg, 'q', 1, 2);
      expect(seq.length).toBe(3);
      seq.insertBaseAtPosition(b, 5);
      expect(seq.length).toBe(3);
      expect(spy).not.toHaveBeenCalled();
    });

    it('positions at the beginning middle and end', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'qer', 'bbm');
      expect(seq.length).toBe(3);
      seq.insertBaseAtPosition(Base.create(svg, 't', 2, 2), 1);
      expect(seq.length).toBe(4);
      expect(seq.getBaseAtPosition(1).character).toBe('t');
      seq.insertBaseAtPosition(Base.create(svg, 'p', 5, 5), 3);
      expect(seq.length).toBe(5);
      expect(seq.getBaseAtPosition(3).character).toBe('p');
      seq.insertBaseAtPosition(Base.create(svg, 'e', 3, 9), 6);
      expect(seq.length).toBe(6);
      expect(seq.getBaseAtPosition(6).character).toBe('e');
    });

    it('updates base numberings and fire add base event', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'qwer', 'asdf');
      let spy = jest.spyOn(seq, 'fireAddBase');
      seq.numberingAnchor = 2;
      let b = Base.create(svg, 'q', 2, 2);
      expect(b.hasNumbering()).toBeFalsy();
      seq.insertBaseAtPosition(b, 2);
      expect(b.hasNumbering()).toBeTruthy();
      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toBe(b);
    });
  });

  it('add base event', () => {
    let svg = NodeSVG();
    let seq = Sequence.createOutOfView(svg, 'asdf', 'asdf');
    seq._onAddBase = null;
    expect(() => seq.fireAddBase()).not.toThrow(); // firing with no binding
    let f = jest.fn();
    let b = jest.fn();
    seq.onAddBase(f);
    seq.fireAddBase(b);
    expect(f.mock.calls.length).toBe(1);
    expect(f.mock.calls[0][0]).toBe(b);
  });

  describe('removeBaseAtPosition method', () => {
    it('position is out of range', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
      expect(seq.length).toBe(4);
      seq.removeBaseAtPosition(5);
      expect(seq.length).toBe(4);
    });

    it('removes the base', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'zxcv');
      let b3 = seq.getBaseAtPosition(3);
      let id3 = b3.id;
      expect(seq.length).toBe(4);
      expect(svg.findOne('#' + id3)).toBeTruthy();
      seq.removeBaseAtPosition(3);
      expect(seq.length).toBe(3);
      expect(seq.getBaseAtPosition(3).character).toBe('v');
      expect(svg.findOne('#' + id3)).toBe(null);
    });

    it('updates base numberings', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwerqwer');
      seq.numberingAnchor = 5;
      let b6 = seq.getBaseAtPosition(6);
      expect(b6.hasNumbering()).toBeFalsy();
      seq.removeBaseAtPosition(5);
      expect(b6.hasNumbering()).toBeTruthy();
    });
  });

  describe('remove method', () => {
    it('removes bases and resets bases array', () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      let b1 = Base.create(svg, 'a', 1, 2);
      let id1 = b1.id;
      let b2 = Base.create(svg, 'g', 3, 4);
      let id2 = b2.id;
      seq.appendBases([b1, b2]);
      expect(seq.length).toBe(2);
      expect(svg.findOne('#' + id1)).toBeTruthy();
      expect(svg.findOne('#' + id2)).toBeTruthy();
      seq.remove();
      expect(seq.length).toBe(0);
      expect(svg.findOne('#' + id1)).toBe(null);
      expect(svg.findOne('#' + id2)).toBe(null);
    });
  });

  describe('savableState method', () => {
    it('includes className, ID and numbering properties', () => {
      let seq = new Sequence('asdfqwer');
      seq.numberingOffset = 27;
      seq.numberingAnchor = 115;
      seq.numberingIncrement = 98;
      let savableState = seq.savableState();
      expect(savableState.className).toBe('Sequence');
      expect(savableState.id).toBe('asdfqwer');
      expect(savableState.numberingOffset).toBe(27);
      expect(savableState.numberingAnchor).toBe(115);
      expect(savableState.numberingIncrement).toBe(98);
    });

    it('includes bases', () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      let b1 = Base.create(svg, 't', 55, 66);
      let b2 = Base.create(svg, 'i', 10, -20);
      seq.appendBases([b1, b2]);
      let savableState = seq.savableState();
      expect(savableState.bases.length).toBe(2);
      expect(
        JSON.stringify(savableState.bases[0])
      ).toBe(JSON.stringify(b1.savableState()));
      expect(
        JSON.stringify(savableState.bases[1])
      ).toBe(JSON.stringify(b2.savableState()));
    });

    it('can be converted to and from a JSON string', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'zxcvqwer');
      let savableState1 = seq.savableState();
      let json1 = JSON.stringify(savableState1);
      let savableState2 = JSON.parse(json1);
      let json2 = JSON.stringify(savableState2);
      expect(json2).toBe(json1);
    });
  });

  it('refreshIds method', () => {
    let svg = NodeSVG();
    let seq = Sequence.createOutOfView(svg, 'qwer', 'qwerasdf');
    let spies = [];
    seq.forEachBase(b => spies.push(jest.spyOn(b, 'refreshIds')));
    seq.refreshIds();
    spies.forEach(s => expect(s).toHaveBeenCalled());
  });
});
