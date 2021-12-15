import secondaryBondsWith from './secondaryBondsWith';
import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import FoldingMode from './FoldingMode';
import parseDotBracket from '../../../parse/parseDotBracket';
import IntegerRange from './IntegerRange';

let sd = new StrictDrawing({ SVG: { SVG: NodeSVG } });
sd.appendTo(document.body);
let mode = new FoldingMode(sd);
let secondaryPartners = parseDotBracket('...(((...)))').secondaryPartners;
let chars = '';
secondaryPartners.forEach(() => chars += 'A');
sd.appendStructure({ id: 'asdf', characters: chars, secondaryPartners: secondaryPartners });

it('no secondary bonds with range', () => {
  let r = new IntegerRange(7, 9);
  expect(secondaryBondsWith(mode, r).length).toBe(0);
});

it('there are secondary bonds with range', () => {
  let r = new IntegerRange(4, 6);
  let bonds = secondaryBondsWith(mode, r);
  expect(bonds.length).toBe(3);
  sd.drawing.secondaryBonds.forEach(sb1 => {
    expect(bonds.find(sb2 => sb2.id == sb1.id)).toBeTruthy();
  });
});

it('bases in range share secondary bonds', () => {
  let r = new IntegerRange(1, 12);
  let bonds = secondaryBondsWith(mode, r);
  expect(bonds.length).toBe(3);
  sd.drawing.secondaryBonds.forEach(sb1 => {
    expect(bonds.find(sb2 => sb2.id == sb1.id)).toBeTruthy();
  });
});
