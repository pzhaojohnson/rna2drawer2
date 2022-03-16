import { Drawing } from 'Draw/Drawing';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';

import { sideToMotif } from './sideToMotif';

let container = null;
let drawing = null;
let sequence = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG });
  drawing.appendTo(container);

  sequence = appendSequence(drawing, { id: 'asdf', characters: 'asdfASDF' });
});

afterEach(() => {
  sequence = null;
  drawing = null;

  container.remove();
  container = null;
});

describe('sideToMotif function', () => {
  test('an empty side', () => {
    expect(sideToMotif([])).toBe('');
  });

  test('a side with one base', () => {
    let side = [sequence.atPosition(4)];
    expect(sideToMotif(side)).toBe('f');
  });

  test('a side with multiple bases', () => {
    let side = sequence.bases.slice(2, 7);
    expect(sideToMotif(side)).toBe('dfASD');
  });

  test('when one base has no text content', () => {
    let side = sequence.bases.slice(0, 4);
    expect(sideToMotif(side)).toBe('asdf');
    side[1].text.text(''); // remove text content
    expect(side[1].text.text()).toBe('');
    expect(sideToMotif(side)).toBeUndefined();
  });

  test('when the text content of one base has two characters', () => {
    let side = sequence.bases.slice(3, 7);
    expect(sideToMotif(side)).toBe('fASD');
    side[2].text.text('QW'); // make two characters
    expect(side[2].text.text()).toBe('QW');
    expect(sideToMotif(side)).toBeUndefined();
  });
});
