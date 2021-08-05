import { Sequence } from './Sequence';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { addNumbering, removeNumbering } from 'Draw/bases/number/add';

let svg = NodeSVG();

describe('Sequence class', () => {
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
});
