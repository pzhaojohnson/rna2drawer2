import { savableState } from './save';
import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { savableState as savableBaseState } from 'Draw/bases/save';

let container = null;
let drawing = null;
let seq = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());

  seq = appendSequence(drawing, { id: 'asdfQWER', characters: 'asdfASDFQWERqwer' });
});

afterEach(() => {
  seq = null;

  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('savableState function', () => {
  it('includes class name', () => {
    let saved = savableState(seq);
    expect(saved.className).toBe('Sequence');
  });

  it('includes sequence ID', () => {
    let id = 'id' + Math.random();
    seq.id = id;
    let saved = savableState(seq);
    expect(saved.id).toBe(id);
  });

  it('includes bases', () => {
    expect(seq.bases.length).toBeGreaterThanOrEqual(3);
    let saved = savableState(seq);
    expect(saved.bases.length).toBe(seq.bases.length);
    for (let i = 0; i < seq.bases.length; i++) {
      expect(saved.bases[i]).toEqual(savableBaseState(seq.bases[i]));
    }
  });

  it('includes numbering properties', () => {
    let offset = Math.floor(100 * Math.random()) - 50;
    let anchor = Math.floor(200 * Math.random()) - 100;
    let increment = Math.floor(50 * Math.random()) + 1; // cannot be zero

    seq.numberingOffset = offset;
    seq.numberingAnchor = anchor;
    seq.numberingIncrement = increment;

    let saved = savableState(seq);
    expect(saved.numberingOffset).toBe(offset);
    expect(saved.numberingAnchor).toBe(anchor);
    expect(saved.numberingIncrement).toBe(increment);
  });
});
