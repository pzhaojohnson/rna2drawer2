import { Sequence } from './Sequence';
import NodeSVG from 'Draw/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { addNumbering, removeNumbering } from 'Draw/bases/number/add';
import normalizeAngle from 'Draw/normalizeAngle';
import angleBetween from 'Draw/angleBetween';

let svg = NodeSVG();

describe('Sequence class', () => {
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
      seq1.bases.splice(0, 0, ...[
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
  });

  it('characters getter', () => {
    let seq = new Sequence('asdf');
    seq.bases.splice(0, 0, ...[
      Base.create(svg, 'b', 1, 2),
      Base.create(svg, 'T', 5, 4),
      Base.create(svg, 'Q', 10, 200),
      Base.create(svg, '2', 4, 3),
    ]);
    seq.bases.splice(2, 1);
    expect(seq.characters).toBe('bT2');
  });

  it('_updateBaseNumberings method', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'asdfasdfasdf');
    seq.numberingOffset = 15; // must offset numbering
    seq.numberingAnchor = 6;
    seq.numberingIncrement = 3;
    seq.forEachBase(b => removeNumbering(b));
    addNumbering(seq.getBaseAtPosition(2), 100); // to remove
    addNumbering(seq.getBaseAtPosition(8), 8); // to remove
    addNumbering(seq.getBaseAtPosition(9), 90); // to replace
    seq._updateBaseNumberings();
    expect(seq.getBaseAtPosition(1).numbering).toBeFalsy();
    expect(seq.getBaseAtPosition(2).numbering).toBeFalsy(); // was removed
    expect(seq.getBaseAtPosition(3).numbering.text.text()).toBe('18'); // was added
    expect(seq.getBaseAtPosition(4).numbering).toBeFalsy();
    expect(seq.getBaseAtPosition(5).numbering).toBeFalsy();
    expect(seq.getBaseAtPosition(6).numbering.text.text()).toBe('21'); //was added
    expect(seq.getBaseAtPosition(7).numbering).toBeFalsy();
    expect(seq.getBaseAtPosition(8).numbering).toBeFalsy(); // was removed
    expect(seq.getBaseAtPosition(9).numbering.text.text()).toBe('24'); // was replaced
    expect(seq.getBaseAtPosition(10).numbering).toBeFalsy();
    expect(seq.getBaseAtPosition(11).numbering).toBeFalsy();
    expect(seq.getBaseAtPosition(12).numbering.text.text()).toBe('27'); // was added
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
    expect(Sequence.recommendedDefaults.numberingAnchor).toBe(1012);
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
    expect(Sequence.recommendedDefaults.numberingIncrement).toBe(82);
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
    seq.bases.splice(0, 0, ...[
      Base.create(svg, 'T', 3, 4),
      Base.create(svg, 'H', 2, 2),
      Base.create(svg, 't', 5, 10),
      Base.create(svg, 'Q', 10, 20),
    ]);
    expect(seq.length).toBe(4);
    seq.bases.splice(1, 1);
    expect(seq.length).toBe(3);
  });

  it('reversePositionOffset method', () => {
    let seq = new Sequence('asdf');
    seq.numberingOffset = -12;
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

  it('getBaseAtPosition method', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'qwerzxcv');
    seq.numberingOffset = 12;
    expect(seq.getBaseAtPosition(6).character).toBe('x');
    expect(seq.getBaseAtPosition(10)).toBeFalsy(); // out of range
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

  describe('positionOfBase method', () => {
    let seq = Sequence.createOutOfView(svg, 'asdf', 'qwer');
    seq.numberingOffset = 33;
    let b3 = seq.getBaseAtPosition(3);
    expect(seq.positionOfBase(b3)).toBe(3);
    let b = Base.create(svg, 'a', 1, 2); // not in sequence
    expect(seq.positionOfBase(b)).toBe(0);
  });

  describe('angle at position methods', () => {
    let seq = new Sequence('asdf');
    seq.bases.splice(0, 0, ...[
      Base.create(svg, 'a', 100, 200),
      Base.create(svg, 'b', 1000, 800),
      Base.create(svg, 'c', 50, 80),
      Base.create(svg, 'r', 250, 333),
    ]);
    let cs1 = { xCenter: 100, yCenter: 200 };
    let cs2 = { xCenter: 1000, yCenter: 800 };
    let cs3 = { xCenter: 50, yCenter: 80 };
    let cs4 = { xCenter: 250, yCenter: 333 };

    it('position out of range', () => {
      expect(seq.clockwiseNormalAngleAtPosition(5)).toBe(0);
      expect(seq.counterClockwiseNormalAngleAtPosition(5)).toBe(Math.PI);
      expect(seq.innerNormalAngleAtPosition(5)).toBe(0);
      expect(seq.outerNormalAngleAtPosition(5)).toBe(Math.PI);
    });

    it("no 5' base", () => {
      let cna = Sequence._clockwiseNormalAngleOfBase(cs1, null, cs2);
      let ina = Sequence._innerNormalAngleOfBase(cs1, null, cs2);
      expect(seq.clockwiseNormalAngleAtPosition(1)).toBe(cna);
      expect(seq.counterClockwiseNormalAngleAtPosition(1)).toBe(cna + Math.PI);
      expect(seq.innerNormalAngleAtPosition(1)).toBe(ina);
      expect(seq.outerNormalAngleAtPosition(1)).toBe(ina + Math.PI);
    });

    it("no 3' base", () => {
      let cna = Sequence._clockwiseNormalAngleOfBase(cs4, cs3, null);
      let ina = Sequence._innerNormalAngleOfBase(cs4, cs3, null);
      expect(seq.clockwiseNormalAngleAtPosition(4)).toBe(cna);
      expect(seq.counterClockwiseNormalAngleAtPosition(4)).toBe(cna + Math.PI);
      expect(seq.innerNormalAngleAtPosition(4)).toBe(ina);
      expect(seq.outerNormalAngleAtPosition(4)).toBe(ina + Math.PI);
    });

    it("has 5' and 3' base", () => {
      let cna = Sequence._clockwiseNormalAngleOfBase(cs3, cs2, cs4);
      let ina = Sequence._innerNormalAngleOfBase(cs3, cs2, cs4);
      expect(seq.clockwiseNormalAngleAtPosition(3)).toBe(cna);
      expect(seq.counterClockwiseNormalAngleAtPosition(3)).toBe(cna + Math.PI);
      expect(seq.innerNormalAngleAtPosition(3)).toBe(ina);
      expect(seq.outerNormalAngleAtPosition(3)).toBe(ina + Math.PI);
    });
  });

  describe('savableState method', () => {
    let seq = Sequence.createOutOfView(svg, 'qwerasdf', 'qwer');
    seq.numberingOffset = 23;
    seq.numberingAnchor = -223;
    seq.numberingIncrement = 83;
    let savableState = seq.savableState();

    it('includes className, ID and numbering properties', () => {
      expect(savableState.className).toBe('Sequence');
      expect(savableState.id).toBe('qwerasdf');
      expect(savableState.numberingOffset).toBe(23);
      expect(savableState.numberingAnchor).toBe(-223);
      expect(savableState.numberingIncrement).toBe(83);
    });

    it('includes bases', () => {
      expect(savableState.bases.length).toBe(4);
      expect(JSON.stringify(savableState.bases)).toBe(JSON.stringify([
        seq.getBaseAtPosition(1).savableState(),
        seq.getBaseAtPosition(2).savableState(),
        seq.getBaseAtPosition(3).savableState(),
        seq.getBaseAtPosition(4).savableState(),
      ]));
    });

    it('can be converted to and from a JSON string', () => {
      let json = JSON.stringify(savableState);
      let parsed = JSON.parse(json);
      expect(JSON.stringify(parsed)).toBe(json);
    });
  });
});
