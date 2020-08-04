import canSecondaryPair from './canSecondaryPair';
import StrictDrawing from '../../StrictDrawing';
import NodeSVG from '../../NodeSVG';
import FoldingMode from './FoldingMode';
import parseDotBracket from '../../../parse/parseDotBracket';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);
let chars = 'AAAAGGGGUUUUCCCCUUUU';
let secondaryPartners = parseDotBracket('....((((....))))....').secondaryPartners;
sd.appendStructure({ id: 'asdf', characters: chars, secondaryPartners: secondaryPartners });

it('nothing selected', () => {
  mode.hovered = 2;
  mode.selected = undefined;
  expect(canSecondaryPair(mode)).toBeFalsy();
});

it('selected already have secondary bonds', () => {
  mode.hovered = 19;
  mode.selected = { tightEnd: 5, looseEnd: 8 };
  expect(canSecondaryPair(mode)).toBeFalsy();
});

it('no hovered pairable', () => {
  mode.hovered = undefined;
  mode.selected = { tightEnd: 1, looseEnd: 4 };
  expect(canSecondaryPair(mode)).toBeFalsy();
});

it('hovered pairable already has secondary bonds', () => {
  mode.hovered = 5;
  mode.selected = { tightEnd: 17, looseEnd: 20 };
  expect(canSecondaryPair(mode)).toBeFalsy();
});

it('adding secondary bonds would form a knot', () => {
  mode.hovered = 10;
  mode.selected = { tightEnd: 1, looseEnd: 4 };
  expect(canSecondaryPair(mode)).toBeFalsy();
});

it('adding secondary bonds would not form a knot', () => {
  mode.hovered = 1;
  mode.selected = { tightEnd: 17, looseEnd: 20 };
  expect(canSecondaryPair(mode)).toBeTruthy();
});
