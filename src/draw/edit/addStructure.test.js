import {
  addPrimaryBonds,
  addSecondaryBonds,
  addTertiaryBonds,
  appendStructure,
} from './addStructure';
import Drawing from '../Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';

describe('addPrimaryBonds function', () => {
  it('adds primary bonds', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => NodeSVG());
    let seq = drawing.appendSequence('asdf', 'qwer');
    addPrimaryBonds(drawing, 'asdf');
    let bonds = [];
    drawing.primaryBonds.forEach(pb => bonds.push(pb));
    expect(bonds.length).toBe(3);
    expect(bonds.find(pb => pb.base1.character == 'q' && pb.base2.character == 'w')).toBeTruthy();
    expect(bonds.find(pb => pb.base1.character == 'w' && pb.base2.character == 'e')).toBeTruthy();
    expect(bonds.find(pb => pb.base1.character == 'e' && pb.base2.character == 'r')).toBeTruthy();
  });
});

describe('addSecondaryBonds function', () => {
  it('adds secondary bonds', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => NodeSVG());
    let seq = drawing.appendSequence('qwer', 'asdfzxcv');
    addSecondaryBonds(drawing, 'qwer', [7, null, 6, 8, null, 3, 1, 4]);
    let bonds = [];
    drawing.secondaryBonds.forEach(sb => bonds.push(sb));
    expect(bonds.length).toBe(3);
    expect(bonds.find(sb => sb.base1.character == 'a' && sb.base2.character == 'c')).toBeTruthy();
    expect(bonds.find(sb => sb.base1.character == 'd' && sb.base2.character == 'x')).toBeTruthy();
    expect(bonds.find(sb => sb.base1.character == 'f' && sb.base2.character == 'v')).toBeTruthy();
  });
});

describe('addTertiaryBonds function', () => {
  it('adds tertiary bonds', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => NodeSVG());
    let seq = drawing.appendSequence('asdf', 'qwertyui');
    addTertiaryBonds(drawing, 'asdf', [5, 6, null, 8, 1, 2, null, 4]);
    let bonds = [];
    drawing.tertiaryBonds.forEach(tb => bonds.push(tb));
    expect(bonds.length).toBe(3);
    expect(bonds.find(tb => tb.base1.character == 'q' && tb.base2.character == 't')).toBeTruthy();
    expect(bonds.find(tb => tb.base1.character == 'w' && tb.base2.character == 'y')).toBeTruthy();
    expect(bonds.find(tb => tb.base1.character == 'r' && tb.base2.character == 'i')).toBeTruthy();
  });
});

describe('appendStructure function', () => {
  it('returns false if structure cannot be appended', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => NodeSVG());
    drawing.appendSequence('asdf', 'asdf');
    expect(appendStructure(drawing, { id: 'asdf', characters: 'qwer' })).toBeFalsy();
  });

  it('returns true if structure is appended', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => NodeSVG());
    expect(appendStructure(drawing, { id: 'asdf', characters: 'asdf' })).toBeTruthy();
  });

  it('adds primary, secondary and tertiary bonds', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => NodeSVG());
    appendStructure(drawing, {
      id: 'asdf',
      characters: 'asdfasdfasdf',
      secondaryPartners: [null, 11, null, 7, 9, null, 4, null, 5, null, 2, null],
      tertiaryPartners: [11, null, 7, null, null, null, 3, null, null, null, 1, null],
    });
    expect(drawing.primaryBonds.length).toBe(11);
    expect(drawing.secondaryBonds.length).toBe(3);
    expect(drawing.tertiaryBonds.length).toBe(2);
  });
});
