import { Sequence } from './Sequence';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { addNumbering, removeNumbering } from 'Draw/bases/number/add';

let svg = NodeSVG();

describe('Sequence class', () => {
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
      seq.bases.forEach(b => {
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

  it('numberingOffset getter and setter', () => {
    let seq = new Sequence('asdf');
    seq.numberingOffset = 25; // use setter
    expect(seq.numberingOffset).toBe(25); // check getter
    seq.numberingOffset = -Infinity; // ignores nonfinite numbers
    expect(seq.numberingOffset).toBe(25);
    seq.numberingOffset = 5.5; // ignores non-integers
    expect(seq.numberingOffset).toBe(25);
  });

  it('numberingAnchor getter and setter', () => {
    let seq = new Sequence('qwer');
    seq.numberingAnchor = 1012; // use setter
    expect(seq.numberingAnchor).toBe(1012); // check getter
    // updates most recent prop
    expect(Sequence.recommendedDefaults.numberingAnchor).toBe(1012);
    seq.numberingAnchor = NaN; // ignores nonfinite numbers
    expect(seq.numberingAnchor).toBe(1012);
    seq.numberingAnchor = 10.1; // ignores non-integers
    expect(seq.numberingAnchor).toBe(1012);
  });

  it('numberingIncrement getter and setter', () => {
    let seq = new Sequence('asdf');
    seq.numberingIncrement = 82; // use setter
    expect(seq.numberingIncrement).toBe(82); // check getter
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
