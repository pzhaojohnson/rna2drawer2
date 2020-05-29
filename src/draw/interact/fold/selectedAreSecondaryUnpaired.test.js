import selectedAreSecondaryUnpaired from './selectedAreSecondaryUnpaired';
import StrictDrawing from '../../StrictDrawing';
import NodeSVG from '../../NodeSVG';
import FoldingMode from './FoldingMode';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
sd.appendStructure({
  id: 'asdf',
  characters: 'asdfasdfasdfas',
  secondaryPartners: [12, 11, 10, null, null, null, null, null, null, 3, 2, 1, null, null],
});
let mode = new FoldingMode(sd);

it('nothing selected', () => {
  mode.selected = null;
  expect(selectedAreSecondaryUnpaired(mode)).toBeFalsy();
});

it('min selected is paired', () => {
  mode.selected = {
    tightEnd: 6,
    looseEnd: 3,
  };
  expect(selectedAreSecondaryUnpaired(mode)).toBeFalsy();
});

it('middle of selected is paired', () => {
  mode.selected = {
    tightEnd: 9,
    looseEnd: 14,
  };
  expect(selectedAreSecondaryUnpaired(mode)).toBeFalsy();
});

it('max selected is paired', () => {
  mode.selected = {
    tightEnd: 7,
    looseEnd: 10,
  };
  expect(selectedAreSecondaryUnpaired(mode)).toBeFalsy();
});

it('none of selected are paired', () => {
  mode.selected = {
    tightEnd: 8,
    looseEnd: 5,
  };
  expect(selectedAreSecondaryUnpaired(mode)).toBeTruthy();
});
