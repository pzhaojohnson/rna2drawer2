import appendStructure from './appendStructure';
import Drawing from '../Drawing';
import createNodeSVG from '../createNodeSVG';

it('sequence cannot be appended', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  drawing.appendSequenceOutOfView('asdf', 'asdf');
  let appended = appendStructure(drawing, {
    id: 'asdf',
    characters: 'qwer',
  });
  expect(appended).toBeFalsy();
  expect(drawing.numSequences).toBe(1);
});

it('secondary partners length does not match sequence length', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  let appended = appendStructure(drawing, {
    id: 'asdf',
    characters: 'asdf',
    secondaryPartners: [null, null, null],
  });
  expect(appended).toBeFalsy();
  expect(drawing.numSequences).toBe(0);
});

it('tertiary partners length does not match sequence length', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  let appended = appendStructure(drawing, {
    id: 'asdf',
    characters: 'asdf',
    tertiaryPartners: [null, null, null],
  });
  expect(appended).toBeFalsy();
  expect(drawing.numSequences).toBe(0);
});

it('appends sequence', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  drawing.appendSequenceOutOfView('asdf', 'asdf');
  let appended = appendStructure(drawing, {
    id: 'qwer',
    characters: 'qwerqwer',
  });
  expect(appended).toBeTruthy();
  let seq = drawing.getSequenceAtIndex(1);
  expect(seq.id).toBe('qwer');
  expect(seq.characters).toBe('qwerqwer');
});

it('adds primary bonds', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  drawing.appendSequenceOutOfView('asdf', 'asdf');
  appendStructure(drawing, {
    id: 'qwer',
    characters: 'qwe',
  });
  expect(drawing.numPrimaryBonds).toBe(2);
  let seq = drawing.getSequenceById('qwer');
  let p = 1;
  drawing.forEachPrimaryBond(pb => {
    expect(pb.base1.id).toBe(seq.getBaseAtPosition(p).id);
    expect(pb.base2.id).toBe(seq.getBaseAtPosition(p + 1).id);
    p++;
  });
});

it('handles undefined secondary partners', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  appendStructure(drawing, {
    id: 'asdf',
    characters: 'asdf',
  });
  expect(drawing.numSequences).toBe(1);
});

it('adds secondary bonds', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  drawing.appendSequenceOutOfView('asdf', 'asdf');
  appendStructure(drawing, {
    id: 'qwer',
    characters: 'qwerqwer',
    secondaryPartners: [null, 8, null, 6, null, 4, null, 2],
  });
  expect(drawing.numSecondaryBonds).toBe(2);
  let bonds = [];
  drawing.forEachSecondaryBond(sb => bonds.push(sb));
  let seq = drawing.getSequenceById('qwer');
  let sb1 = bonds[0];
  expect(sb1.base1.id).toBe(seq.getBaseAtPosition(2).id);
  expect(sb1.base2.id).toBe(seq.getBaseAtPosition(8).id);
  let sb2 = bonds[1];
  expect(sb2.base1.id).toBe(seq.getBaseAtPosition(4).id);
  expect(sb2.base2.id).toBe(seq.getBaseAtPosition(6).id);
});

it('handles undefined tertiary partners', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  appendStructure(drawing, {
    id: 'asdf',
    characters: 'asdf',
  });
  expect(drawing.numSequences).toBe(1);
});

it('adds tertiary bonds', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  drawing.appendSequenceOutOfView('asdf', 'asdf');
  appendStructure(drawing, {
    id: 'qwer',
    characters: 'qwerqwer',
    tertiaryPartners: [null, 8, null, 6, null, 4, null, 2],
  });
  expect(drawing.numTertiaryBonds).toBe(2);
  let bonds = [];
  drawing.forEachTertiaryBond(sb => bonds.push(sb));
  let seq = drawing.getSequenceById('qwer');
  let tb1 = bonds[0];
  expect(tb1.base1.id).toBe(seq.getBaseAtPosition(2).id);
  expect(tb1.base2.id).toBe(seq.getBaseAtPosition(8).id);
  let tb2 = bonds[1];
  expect(tb2.base1.id).toBe(seq.getBaseAtPosition(4).id);
  expect(tb2.base2.id).toBe(seq.getBaseAtPosition(6).id);
});
