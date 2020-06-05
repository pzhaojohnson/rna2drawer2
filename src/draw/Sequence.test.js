import Sequence from './Sequence';
import NodeSVG from './NodeSVG';
import Base from './Base';
import normalizeAngle from './normalizeAngle';
import angleBetween from './angleBetween';

let svg = NodeSVG();

describe('Sequence class', () => {
  describe('mostRecentProps static method', () => {
    it('returns a new object', () => {
      expect(Sequence.mostRecentProps()).not.toBe(Sequence._mostRecentProps);
    });

    it('returns correct values', () => {
      Sequence._mostRecentProps.numberingAnchor = 804;
      Sequence._mostRecentProps.numberingIncrement = 99;
      let mrps = Sequence.mostRecentProps();
      expect(mrps.numberingAnchor).toBe(804);
      expect(mrps.numberingIncrement).toBe(99);
    });
  });
  
  it('_applyMostRecentProps static method', () => {
    let seq = new Sequence('asdf');
    seq.numberingAnchor = 10;
    seq.numberingIncrement = 10;
    Sequence._mostRecentProps.numberingAnchor = 980;
    Sequence._mostRecentProps.numberingIncrement = 88;
    Sequence._applyMostRecentProps(seq);
    expect(seq.numberingAnchor).toBe(980);
    expect(seq.numberingIncrement).toBe(88);
  });

  it('_copyPropsToMostRecent static method', () => {
    let seq = new Sequence('asdf');
    seq.setNumberingAnchor(-5);
    seq.setNumberingIncrement(4);
    Sequence._mostRecentProps.numberingAnchor = 10;
    Sequence._mostRecentProps.numberingIncrement = 20;
    Sequence._copyPropsToMostRecent(seq);
    let mrps = Sequence.mostRecentProps();
    expect(mrps.numberingAnchor).toBe(-5);
    expect(mrps.numberingIncrement).toBe(4);
  });

  it('_angleBetweenBaseCenters static method', () => {
    expect(
      Sequence._angleBetweenBaseCenters(
        { xCenter: 3, yCenter: 4 },
        { xCenter: 8, yCenter: 9 },
      )
    ).toBeCloseTo(Math.PI / 4, 3);
  });

  describe('_clockwiseNormalAngleOfBase static method', () => {
    it('no neighboring bases', () => {
      expect(
        Sequence._clockwiseNormalAngleOfBase(
          { xCenter: 5, yCenter: 9 },
          null,
          null,
        )
      ).toBe(Math.PI / 2);
    });

    it("only a 5' neighboring base", () => {
      expect(
        normalizeAngle(Sequence._clockwiseNormalAngleOfBase(
          { xCenter: 2, yCenter: 20 },
          { xCenter: 19, yCenter: 29 },
          null,
        ))
      ).toBeCloseTo(
        normalizeAngle(angleBetween(2, 20, 19, 29)) + (3 * Math.PI / 2),
        3,
      );
    });

    it("only a 3' neighboring base", () => {
      expect(
        normalizeAngle(Sequence._clockwiseNormalAngleOfBase(
          { xCenter: -5, yCenter: -10 },
          null,
          { xCenter: 44, yCenter: 78 },
        ))
      ).toBeCloseTo(
        normalizeAngle(angleBetween(-5, -10, 44, 78)) + (Math.PI / 2),
        3,
      );
    });

    it("both 5' and 3' neighboring bases", () => {
      expect(
        normalizeAngle(Sequence._clockwiseNormalAngleOfBase(
          { xCenter: 2, yCenter: 4 },
          { xCenter: 5, yCenter: 0 },
          { xCenter: -1, yCenter: 8 },
        ))
      ).toBeCloseTo(
        Math.atan2(4, -3) + (Math.PI / 2),
        3,
      );
    });
  });

  describe('_innerNormalAngleOfBase static method', () => {
    it("no 5' neighboring base", () => {
      expect(
        Sequence._innerNormalAngleOfBase(
          { xCenter: 8, yCenter: 12 },
          null,
          { xCenter: 6, yCenter: 10 },
        )
      ).toBe(
        Sequence._clockwiseNormalAngleOfBase(
          { xCenter: 8, yCenter: 12 },
          null,
          { xCenter: 6, yCenter: 10 },
        )
      );
    });

    it("no 3' neighboring base", () => {
      expect(
        Sequence._innerNormalAngleOfBase(
          { xCenter: 100, yCenter: 200 },
          { xCenter: 300, yCenter: 250 },
          null,
        )
      ).toBe(
        Sequence._clockwiseNormalAngleOfBase(
          { xCenter: 100, yCenter: 200 },
          { xCenter: 300, yCenter: 250 },
          null,
        )
      );
    });

    it('is the clockwise normal angle', () => {
      expect(
        Sequence._innerNormalAngleOfBase(
          { xCenter: 24, yCenter: 67 },
          { xCenter: 17, yCenter: 80},
          { xCenter: 34, yCenter: 55 },
        )
      ).toBe(
        Sequence._clockwiseNormalAngleOfBase(
          { xCenter: 24, yCenter: 67 },
          { xCenter: 17, yCenter: 80},
          { xCenter: 34, yCenter: 55 },
        )
      );
    });

    it('is the counter-clockwise normal angle', () => {
      expect(
        normalizeAngle(Sequence._innerNormalAngleOfBase(
          { xCenter: -10, yCenter: -20 },
          { xCenter: -12, yCenter: -30 },
          { xCenter: 2, yCenter: -18 },
        ))
      ).toBeCloseTo(
        normalizeAngle(Sequence._clockwiseNormalAngleOfBase(
          { xCenter: -10, yCenter: -20 },
          { xCenter: -12, yCenter: -30 },
          { xCenter: 2, yCenter: -18 },
        )) + Math.PI,
        3,
      );
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
      let savableState1 = seq1.savableState();
      let seq2 = Sequence.fromSavedState(savableState1, svg);
      expect(seq2.id).toBe('zxcvasdfqwer');
      expect(seq2.numberingOffset).toBe(-200);
      expect(seq2.numberingAnchor).toBe(249);
      expect(seq2.numberingIncrement).toBe(134);
    });

    it('handles nullish numbering properties', () => {
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

    it('creates bases', () => {
      let seq1 = new Sequence('asdf');
      seq1.appendBases([
        Base.create(svg, 'y', 2, 4),
        Base.create(svg, 'M', 5, 10),
      ]);
      let savableState1 = seq1.savableState();
      let seq2 = Sequence.fromSavedState(savableState1, svg);
      expect(seq2.length).toBe(2);
      let b21 = seq2.getBaseAtPosition(1);
      expect(b21.character).toBe('y');
      let b22 = seq2.getBaseAtPosition(2);
      expect(b22.character).toBe('M');
    });

    it('copies properties to most recent', () => {
      let svg = NodeSVG();
      let seq1 = new Sequence('asdf');
      seq1.numberingAnchor = 177;
      seq1.numberingIncrement = 124;
      let savableState1 = seq1.savableState();
      Sequence._mostRecentProps.numberingAnchor = 2;
      Sequence._mostRecentProps.numberingIncrement = 10;
      let seq2 = Sequence.fromSavedState(savableState1, svg);
      let mrps = Sequence.mostRecentProps();
      expect(mrps.numberingAnchor).toBe(177);
      expect(mrps.numberingIncrement).toBe(124);
    });
  });

  describe('createOutOfView static method', () => {
    it('creates with ID', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'ppooiiuu', 'asdf');
      expect(seq.id).toBe('ppooiiuu');
    });

    it('adds bases out of view', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'wO');
      expect(seq.length).toBe(2);
      let b1 = seq.getBaseAtPosition(1);
      expect(b1.character).toBe('w');
      expect(b1.xCenter < -50 || b1.yCenter < -50).toBeTruthy();
      let b2 = seq.getBaseAtPosition(2);
      expect(b2.character).toBe('O');
      expect(b2.xCenter < -50 || b2.yCenter < -50).toBeTruthy();
    });

    it('applies most recent properties', () => {
      let svg = NodeSVG();
      Sequence._mostRecentProps.numberingAnchor = 1129;
      Sequence._mostRecentProps.numberingIncrement = 87;
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
      expect(seq.numberingAnchor).toBe(1129);
      expect(seq.numberingIncrement).toBe(87);
    });
  });

  describe('constructor', () => {
    it('stores ID', () => {
      let seq = new Sequence('ttnnmmbb');
      expect(seq.id).toBe('ttnnmmbb');
    });

    it('initializes bases array', () => {
      let seq = new Sequence('asdf');
      expect(seq._bases.length).toBe(0);
    });

    it('initializes numbering properties', () => {
      let seq = new Sequence('asdf');
      expect(seq.numberingOffset).toBe(0);
      expect(typeof seq.numberingAnchor).toBe('number');
      expect(typeof seq.numberingIncrement).toBe('number');
    });
  });

  it('id getter', () => {
    let seq = new Sequence('ooyyuu');
    expect(seq.id).toBe('ooyyuu');
  });

  it('characters getter', () => {
    let svg = NodeSVG();
    let seq = new Sequence('asdf');
    seq.appendBases([
      Base.create(svg, 'b', 1, 2),
      Base.create(svg, 'T', 5, 4),
      Base.create(svg, '2', 4, 3),
    ]);
    expect(seq.characters).toBe('bT2');
  });

  describe('_updateBaseNumberings method', () => {
    it('adds numbering to correct bases', () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      seq.appendBases([
        Base.create(svg, 'A', 1, 2),
        Base.create(svg, 'b', 5, 5),
        Base.create(svg, 'T', 5, 9),
        Base.create(svg, 'I', 1, 1),
        Base.create(svg, 'k', 2, 9),
        Base.create(svg, 'r', 10, 12),
      ]);
      for (let p = 1; p <= 6; p++) {
        expect(seq.getBaseAtPosition(p).hasNumbering()).toBeFalsy();
      }
      seq.numberingAnchor = 4;
      seq.numberingIncrement = 2;
      for (let p = 1; p <= 6; p++) {
        if (p % 2 == 0) {
          expect(seq.getBaseAtPosition(p).hasNumbering()).toBeTruthy();
        } else {
          expect(seq.getBaseAtPosition(p).hasNumbering()).toBeFalsy();
        }
      }
    });

    it('removes numbering from correct bases', () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      seq.appendBases([
        Base.create(svg, 'A', 1, 2),
        Base.create(svg, 'b', 5, 5),
        Base.create(svg, 'T', 5, 9),
        Base.create(svg, 'I', 1, 1),
        Base.create(svg, 'k', 2, 9),
        Base.create(svg, 'r', 10, 12),
      ]);
      seq.numberingIncrement = 1;
      for (let p = 1; p <= 6; p++) {
        expect(seq.getBaseAtPosition(p).hasNumbering()).toBeTruthy();
      }
      seq.numberingAnchor = 3;
      seq.numberingIncrement = 2;
      for (let p = 1; p <= 6; p++) {
        if (p % 2 == 0) {
          expect(seq.getBaseAtPosition(p).hasNumbering()).toBeFalsy();
        } else {
          expect(seq.getBaseAtPosition(p).hasNumbering()).toBeTruthy();
        }
      }
    });
    
    it('passes correct number with numbering offset', () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      seq.appendBases([
        Base.create(svg, 'a', 5, 23),
        Base.create(svg, 'b', 1, 2),
        Base.create(svg, 'n', 5, 5),
      ]);
      seq.numberingAnchor = 2;
      seq.numberingOffset = -23;
      let b2 = seq.getBaseAtPosition(2);
      expect(b2.numbering.number).toBe(-21);
    });

    it('passes outer normal angle', () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      seq.appendBases([
        Base.create(svg, 'T', -10, -12),
        Base.create(svg, 'E', 3, 30),
        Base.create(svg, 'G', 100, 200),
      ]);
      seq.numberingAnchor = 2;
      let b2 = seq.getBaseAtPosition(2);
      let n2 = b2.numbering;
      expect(
        normalizeAngle(angleBetween(3, 30, n2._line.attr('x1'), n2._line.attr('y1')))
      ).toBeCloseTo(
        normalizeAngle(seq.outerNormalAngleAtPosition(2)),
        3,
      );
    });
  });

  it('numberingOffset getter', () => {
    let seq = new Sequence('asdf');
    seq.numberingOffset = 12;
    expect(seq.numberingOffset).toBe(12);
  });

  describe('numberingOffset setter', () => {
    it('handles a non-finite number', () => {
      let seq = new Sequence('asdf');
      seq.numberingOffset = 89;
      seq.numberingOffset = Infinity;
      expect(seq.numberingOffset).toBe(89);
    });

    it('handles a non-integer number', () => {
      let seq = new Sequence('asdf');
      seq.numberingOffset = -100;
      seq.numberingOffset = 1.2;
      expect(seq.numberingOffset).toBe(-100);
    });

    it('updates base numberings', () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      seq.appendBase(Base.create(svg, 'T', 2, 3));
      seq.numberingAnchor = 1;
      let b1 = seq.getBaseAtPosition(1);
      seq.numberingOffset = -179;
      expect(b1.numbering.number).toBe(-178);
    });
  });

  it('numberingAnchor getter', () => {
    let seq = new Sequence('asdf');
    seq.numberingAnchor = 12;
    expect(seq.numberingAnchor).toBe(12);
  });

  describe('numberingAnchor setter', () => {
    it('handles a non-finite number', () => {
      let seq = new Sequence('asdf');
      seq.numberingAnchor = 40;
      seq.numberingAnchor = NaN;
      expect(seq.numberingAnchor).toBe(40);
    });

    it('handles a non-integer number', () => {
      let seq = new Sequence('asdf');
      seq.numberingAnchor = -40;
      seq.numberingAnchor = 1.05;
      expect(seq.numberingAnchor).toBe(-40);
    });

    it('updates base numberings', () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      seq.appendBase(Base.create(svg, 'e', 1, 5));
      let b1 = seq.getBaseAtPosition(1);
      expect(b1.hasNumbering()).toBeFalsy();
      seq.numberingAnchor = 1;
      expect(b1.hasNumbering()).toBeTruthy();
    });

    it('updates most recent property', () => {
      let seq = new Sequence('asdf');
      seq.numberingAnchor = 887;
      expect(Sequence.mostRecentProps().numberingAnchor).toBe(887);
    });
  });

  it('numberingIncrement getter', () => {
    let seq = new Sequence('asdf');
    seq.numberingIncrement = 7;
    expect(seq.numberingIncrement).toBe(7);
  });

  describe('numberingIncrement setter', () => {
    it('handles a non-finite number', () => {
      let seq = new Sequence('asdf');
      seq.numberingIncrement = 54;
      seq.numberingIncrement = -Infinity;
      expect(seq.numberingIncrement).toBe(54);
    });

    it('handles a non-integer number', () => {
      let seq = new Sequence('asdf');
      seq.numberingIncrement = 88;
      seq.numberingIncrement = 6.6;
      expect(seq.numberingIncrement).toBe(88);
    });

    it('updates base numberings', () => {
      let svg = NodeSVG();
      let seq = new Sequence('asdf');
      seq.appendBases([
        Base.create(svg, 'r', 1, 5),
        Base.create(svg, 'Y', 9, 9),
      ]);
      let b2 = seq.getBaseAtPosition(2);
      expect(b2.hasNumbering()).toBeFalsy();
      seq.numberingIncrement = 2;
      expect(b2.hasNumbering()).toBeTruthy();
    });

    it('updates most recent property', () => {
      let seq = new Sequence('asdf');
      seq.numberingIncrement = 778;
      expect(Sequence.mostRecentProps().numberingIncrement).toBe(778);
    });
  });

  it('length getter', () => {
    let svg = NodeSVG();
    let seq = new Sequence('asdf');
    expect(seq.length).toBe(0);
    seq.appendBases([
      Base.create(svg, 'T', 3, 4),
      Base.create(svg, 'H', 2, 2),
    ]);
    expect(seq.length).toBe(2);
  });

  it('offsetPosition method', () => {
    let seq = new Sequence('asdf');
    seq.numberingOffset = -12;
    expect(seq.offsetPosition(19)).toBe(7);
  });

  it('reversePositionOffset method', () => {
    let seq = new Sequence('asdf');
    seq.numberingOffset = 33;
    expect(seq.reversePositionOffset(87)).toBe(54);
  });

  describe('positionOutOfRange method', () => {
    it('edge cases', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'ki', 'ggh');
      expect(seq.positionOutOfRange(0)).toBeTruthy();
      expect(seq.positionOutOfRange(1)).toBeFalsy();
      expect(seq.positionOutOfRange(3)).toBeFalsy();
      expect(seq.positionOutOfRange(4)).toBeTruthy();
    });
  });

  describe('positionInRange method', () => {
    it('edge cases', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'uuj', 'lkj');
      expect(seq.positionInRange(0)).toBeFalsy();
      expect(seq.positionInRange(1)).toBeTruthy();
      expect(seq.positionInRange(3)).toBeTruthy();
      expect(seq.positionInRange(4)).toBeFalsy();
    });
  });

  describe('offsetPositionOutOfRange method', () => {
    it('edge cases', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'hh', 'plo');
      seq.numberingOffset = 12;
      expect(seq.offsetPositionOutOfRange(12)).toBeTruthy();
      expect(seq.offsetPositionOutOfRange(13)).toBeFalsy();
      expect(seq.offsetPositionOutOfRange(15)).toBeFalsy();
      expect(seq.offsetPositionOutOfRange(16)).toBeTruthy();
    });
  });

  describe('offsetPositionInRange method', () => {
    it('edge cases', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'qwer', 'QYQ');
      seq.numberingOffset = -45;
      expect(seq.offsetPositionInRange(-45)).toBeFalsy();
      expect(seq.offsetPositionInRange(-44)).toBeTruthy();
      expect(seq.offsetPositionInRange(-42)).toBeTruthy();
      expect(seq.offsetPositionInRange(-41)).toBeFalsy();
    });
  });

  describe('getBaseAtPosition method', () => {
    it('position is out of range', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'qwer', 'ui');
      expect(seq.getBaseAtPosition(3)).toBeFalsy();
    });

    it('position is in range', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'zxcv');
      expect(seq.getBaseAtPosition(2)).toBe(seq._bases[1]);
    });
  });

  describe('getBaseAtOffsetPosition method', () => {
    it('takes into account numbering offset', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
      seq.numberingOffset = 23;
      expect(seq.getBaseAtOffsetPosition(25)).toBe(seq.getBaseAtPosition(2));
    });
  });

  describe('getBaseById method', () => {
    it('no base has the given ID', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'zxcv');
      expect(seq.getBaseById('asdfqwer')).toBeFalsy();
    });

    it('a base does have the given ID', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qeere');
      let b3 = seq.getBaseAtPosition(3);
      expect(seq.getBaseById(b3.id)).toBe(b3);
    });
  });

  it('getBasesInRange method', () => {
    let svg = NodeSVG();
    let seq = Sequence.createOutOfView(svg, 'asdf', 'zxcvqwer');
    let bases = seq.getBasesInRange(3, 5);
    expect(bases.length).toBe(3);
    expect(bases[0].character).toBe('c');
    expect(bases[1].character).toBe('v');
    expect(bases[2].character).toBe('q');
  });

  it('forEachBase method', () => {
    let svg = NodeSVG();
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
    let svg = NodeSVG();
    let seq = Sequence.createOutOfView(svg, 'asdf', 'bh');
    let ids = seq.baseIds();
    expect(ids.length).toBe(2);
    expect(ids[0]).toBe(seq.getBaseAtPosition(1).id);
    expect(ids[1]).toBe(seq.getBaseAtPosition(2).id);
  });

  describe('positionOfBase method', () => {
    it('base is not in sequence', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
      let b = Base.create(svg, 'a', 2, 3);
      expect(seq.positionOfBase(b)).toBe(0);
    });

    it('returns correct position', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
      let b3 = seq.getBaseAtPosition(3);
      expect(seq.positionOfBase(b3)).toBe(3);
    });
  });

  describe('offsetPositionOfBase method', () => {
    it('base is not in sequence', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'qwer', 'zxcv');
      seq.numberingOffset = -15;
      let b = Base.create(svg, 't', 3, 5);
      expect(seq.offsetPositionOfBase(b)).toBe(-15);
    });

    it('returns correct offset position', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'zxcv', 'asdf');
      seq.numberingOffset = 24;
      let b3 = seq.getBaseAtPosition(3);
      expect(seq.offsetPositionOfBase(b3)).toBe(27);
    });
  });

  describe('contains method', () => {
    it('base is in sequence', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwerqwer');
      let b6 = seq.getBaseAtPosition(6);
      expect(seq.contains(b6)).toBeTruthy();
    });

    it('base is not in sequence', () => {
      let svg = NodeSVG();
      let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
      let b = Base.create(svg, 'a', 1, 2);
      expect(seq.contains(b)).toBeFalsy();
    });
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
      seq.setNumberingAnchor(12, svg);
      seq.setNumberingIncrement(10, svg);
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
