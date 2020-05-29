import canSecondaryPair from './canSecondaryPair';
import StrictDrawing from '../../StrictDrawing';
import NodeSVG from '../../NodeSVG';
import FoldingMode from './FoldingMode';
import parseDotBracket from '../../../parse/parseDotBracket';

jest.mock('./selectedAreSecondaryUnpaired');
import selectedAreSecondaryUnpaired from './selectedAreSecondaryUnpaired';

jest.mock('./hoveredComplement');
import hoveredComplement from './hoveredComplement';

jest.mock('../../../parse/isKnotless');
import isKnotless from '../../../parse/isKnotless';

let strictDrawing = null;
let mode = null;

beforeEach(() => {
  strictDrawing = new StrictDrawing();
  strictDrawing.addTo(document.body, () => NodeSVG());
  mode = new FoldingMode(strictDrawing);
});

afterEach(() => {
  strictDrawing = null;
  mode = null;
  while (document.body.firstChild) {
    document.body.removeChild(document.body.lastChild);
  }
  jest.resetAllMocks();
});

it('nothing selected', () => {
  mode.selected = null;
  expect(canSecondaryPair(mode)).toBeFalsy();
});

it('selected have secondary partners', () => {
  mode.selected = {
    tightEnd: 3,
    looseEnd: 5,
  };
  selectedAreSecondaryUnpaired.mockImplementation(() => false);
  expect(canSecondaryPair(mode)).toBeFalsy();
});

it('no hovered complement', () => {
  mode.selected = {
    tightEnd: 3,
    looseEnd: 4,
  };
  selectedAreSecondaryUnpaired.mockImplementation(() => true);
  hoveredComplement.mockImplementation(() => null);
  expect(canSecondaryPair(mode)).toBeFalsy();
});

it('secondary pairing would form knots', () => {
  strictDrawing.appendStructure({
    id: 'asdf',
    characters: 'aaccuugg',
    secondaryPartners: parseDotBracket('..((..))').secondaryPartners,
  });
  mode.selected = {
    tightEnd: 5,
    looseEnd: 6,
  };
  mode.hovered = 1;
  selectedAreSecondaryUnpaired.mockImplementation(() => true);
  hoveredComplement.mockImplementation(() => {
    return {
      position5: 1,
      position3: 2,
    };
  });
  let f = jest.fn(() => false);
  isKnotless.mockImplementation(f);
  expect(canSecondaryPair(mode)).toBeFalsy();
  let partners = f.mock.calls[0][0];
  expect(partners[0]).toBe(6);
  expect(partners[1]).toBe(5);
  expect(partners[4]).toBe(2);
  expect(partners[5]).toBe(1);
});

it('secondary pairing would not form knots', () => {
  strictDrawing.appendStructure({
    id: 'asdf',
    characters: 'aaccuugguu',
    secondaryPartners: parseDotBracket('..((..))..').secondaryPartners,
  });
  mode.selected = {
    tightEnd: 9,
    looseEnd: 10,
  };
  selectedAreSecondaryUnpaired.mockImplementation(() => true);
  hoveredComplement.mockImplementation(() => {
    return {
      position5: 1,
      position3: 2,
    };
  });
  let f = jest.fn(() => true);
  isKnotless.mockImplementation(f);
  expect(canSecondaryPair(mode)).toBeTruthy();
  let partners = f.mock.calls[0][0];
  expect(partners[0]).toBe(10);
  expect(partners[1]).toBe(9);
  expect(partners[8]).toBe(2);
  expect(partners[9]).toBe(1);
});
