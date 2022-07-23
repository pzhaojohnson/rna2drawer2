import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/numberings/add';
import { areAllUnnumbered } from 'Draw/bases/numberings/areAllUnnumbered';

import { updateBaseNumberings } from './updateBaseNumberings';

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG: { SVG: NodeSVG } });
  drawing.appendTo(container);
});

afterEach(() => {
  drawing = null;

  container.remove();
  container = null;
});

describe('updateBaseNumberings function', () => {
  it('handles empty sequences', () => {
    let seq = appendSequence(drawing, { id: 'Empty', characters: '' });
    expect(seq.length).toBe(0);
    expect(() => {
      updateBaseNumberings(seq, { offset: 0, increment: 20, anchor: 0 });
    }).not.toThrow();
  });

  it('adds base numberings according to the specified numbering properties', () => {
    let seq = appendSequence(drawing, { id: 'Asdf', characters: 'asdfASDF' });
    expect(areAllUnnumbered(seq.bases)).toBeTruthy();
    updateBaseNumberings(seq, { offset: -2, increment: 3, anchor: 2 });
    expect(areAllUnnumbered(
      [1, 3, 4, 6, 7].map(p => seq.atPosition(p))
    )).toBeTruthy();
    expect(seq.atPosition(2).numbering.text.text()).toBe('0');
    expect(seq.atPosition(5).numbering.text.text()).toBe('3');
    expect(seq.atPosition(8).numbering.text.text()).toBe('6');
  });

  it('removes and replaces base numberings', () => {
    let seq = appendSequence(drawing, { id: 'Qwer', characters: 'zxcvQWERasdf' });
    expect(areAllUnnumbered(seq.bases)).toBeTruthy();
    addNumbering(seq.atPosition(3), 5); // should be removed
    addNumbering(seq.atPosition(6), 8); // should be replaced
    updateBaseNumberings(seq, { offset: 10, increment: 5, anchor: 1 });
    expect(seq.atPosition(3).numbering).toBeFalsy(); // was removed
    expect(seq.atPosition(6).numbering.text.text()).toBe('16'); // was replaced
  });

  it('handles negative numbering increments', () => {
    let seq = appendSequence(drawing, { id: 'zx', characters: 'zxcvXZCVqwerQWER' });
    // may loop infinitely if the numbering increment is used directly to increment a loop
    updateBaseNumberings(seq, { offset: 0, increment: -5, anchor: 0 });
    expect(areAllUnnumbered(
      [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16].map(p => seq.atPosition(p))
    )).toBeTruthy();
    expect(seq.atPosition(5).numbering.text.text()).toBe('5');
    expect(seq.atPosition(10).numbering.text.text()).toBe('10');
    expect(seq.atPosition(15).numbering.text.text()).toBe('15');
  });

  test('when there should be no base numberings in the end', () => {
    let seq = appendSequence(drawing, { id: 'ASDF', characters: 'qwerASDF' });
    addNumbering(seq.atPosition(3), 3);
    addNumbering(seq.atPosition(6), 6);
    updateBaseNumberings(seq, { offset: 0, increment: 20, anchor: -1 });
    expect(areAllUnnumbered(seq.bases)).toBeTruthy();
  });

  test('when there should only be one base numbering in the end', () => {
    let seq = appendSequence(drawing, { id: 'A', characters: 'QWER' });
    expect(areAllUnnumbered(seq.bases)).toBeTruthy();
    updateBaseNumberings(seq, { offset: 12, increment: 6, anchor: -3 });
    expect(areAllUnnumbered(
      [1, 2, 4].map(p => seq.atPosition(p))
    )).toBeTruthy();
    expect(seq.atPosition(3).numbering.text.text()).toBe('15');
  });
});
