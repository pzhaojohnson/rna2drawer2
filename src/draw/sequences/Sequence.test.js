import { Sequence } from './Sequence';
import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';

let container = null;
let drawing = null;
let seq = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());

  seq = appendSequence(drawing, { id: 'asdf', characters: 'asdfASDFqwer' });
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('Sequence class', () => {
  describe('constructor', () => {
    it('stores ID', () => {
      let id = 'id' + Math.random();
      let seq = new Sequence(id);
      expect(seq.id).toBe(id);
    });
  });

  test('characters getter', () => {
    expect(seq.length).toBeGreaterThanOrEqual(5);
    let cs = seq.characters;
    for (let i = 0; i < seq.length; i++) {
      expect(cs.charAt(i)).toBe(seq.bases[i].character);
    }
  });

  describe.each`
    name
    ${'numberingOffset'}
    ${'numberingAnchor'}
    ${'numberingIncrement'}
  `('$name property', ({ name }) => {
    it('floors numbers', () => {
      let v = Math.floor(60 * Math.random()); // an integer
      seq[name] = v + 0.6; // set to non-integer
      expect(seq[name]).toBe(v); // floored
    });

    it('rejects nonfinite numbers', () => {
      seq[name] = 28;
      [NaN, Infinity, -Infinity].forEach(v => {
        seq[name] = v;
        expect(seq[name]).toBe(28); // didn't change
      });
    });

    if (name == 'numberingIncrement') {
      it('rejects nonpositive numbers', () => {
        seq.numberingIncrement = 60;
        [0, -1, -5, -10].forEach(v => {
          seq.numberingIncrement = v;
        });
        seq.numberingIncrement = 0.68; // floors to zero
        expect(seq.numberingIncrement).toBe(60); // didn't change
      });
    }
  });

  it('length getter', () => {
    expect(seq.bases.length).toBeGreaterThanOrEqual(5);
    expect(seq.length).toBe(seq.bases.length);
  });

  test('positionInRange and positionOutOfRange methods', () => {
    let seq = appendSequence(drawing, { id: 'asdf', characters: 'qweras' });
    [1, 2, 3, 4, 5, 6].forEach(p => {
      expect(seq.positionInRange(p)).toBeTruthy();
      expect(seq.positionOutOfRange(p)).toBeFalsy();
    });
    [0, -1, -10, 7, 8, 12].forEach(p => {
      expect(seq.positionInRange(p)).toBeFalsy();
      expect(seq.positionOutOfRange(p)).toBeTruthy();
    });
  });

  test('atPosition and getBaseAtPosition methods', () => {
    let cs = 'zxcvZX';
    let seq = appendSequence(drawing, { id: 'qwer', characters: cs });
    [1, 2, 3, 4, 5, 6].forEach(p => {
      let b = seq.atPosition(p);
      expect(b.character).toBe(cs.charAt(p - 1));
      b = seq.getBaseAtPosition(p);
      expect(b.character).toBe(cs.charAt(p - 1));
    });
    [0, -1, -5, 7, 9, 12].forEach(p => {
      let b = seq.atPosition(p);
      expect(b).toBe(undefined);
      b = seq.getBaseAtPosition(p);
      expect(b).toBe(undefined);
    });
  });

  test('positionOf method', () => {
    let cs = 'ABCDasdfqwer';
    let seq1 = appendSequence(drawing, { id: 'QQww', characters: cs });
    expect(seq1.positionOf(seq1.bases[0])).toBe(1);
    expect(seq1.positionOf(seq1.bases[3])).toBe(4);
    expect(seq1.positionOf(seq1.bases[8])).toBe(9);
    expect(seq1.positionOf(seq1.bases[seq.bases.length - 1])).toBe(seq.bases.length);
    let seq2 = appendSequence(drawing, { id: 'ZxcV', characters: 'zxcv' });
    expect(seq1.positionOf(seq2.bases[0])).toBe(0); // not in sequence
  });
});
