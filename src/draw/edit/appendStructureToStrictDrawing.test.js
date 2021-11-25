import appendStructureToStrictDrawing from './appendStructureToStrictDrawing';
import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { PerBaseStrictLayoutProps as PerBaseLayoutProps } from 'Draw/strict/layout/PerBaseStrictLayoutProps';
import { radiateStems } from 'Draw/strict/layout/radiateStems';
import parseDotBracket from '../../parse/parseDotBracket';

it('appends structure to underlying drawing', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  let s = { id: 'asdf', characters: 'asdf' };
  let appended = appendStructureToStrictDrawing(sd, s);
  expect(appended).toBeTruthy();
  expect(sd.drawing.getSequenceById('asdf')).toBeTruthy();
});

it('handles failure to append structure to underlying drawing', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  sd.appendSequence('asdf', 'asdf');
  let savableState = sd.savableState();
  // ID is already taken
  let appended = appendStructureToStrictDrawing(sd, { id: 'asdf', characters: 'asdf' });
  // indicates that structure was not appended
  expect(appended).toBeFalsy();
  // no change to strict drawing
  expect(sd.savableState().toString()).toBe(savableState.toString());
});

it('handles structure of length zero', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  // structure of length zero
  let appended = appendStructureToStrictDrawing(sd, { id: 'asdf', characters: '' });
  expect(appended).toBeTruthy(); // was appended
});

describe('appends per base layout props', () => {
  describe('handles preexisting sequences in drawing', () => {
    it('handles per base props list that is too short', () => {
      let sd = new StrictDrawing();
      sd.addTo(document.body, () => NodeSVG());
      sd.appendSequence('asdf', 'asdf');
      sd.setPerBaseLayoutProps([]); // list is now too short
      appendStructureToStrictDrawing(sd, { id: 'qwer', characters: 'qwer' });
      let perBaseProps = sd.perBaseLayoutProps();
      expect(perBaseProps.length).toBe(8);
      expect(perBaseProps[4]).toBeTruthy();
      expect(perBaseProps[5]).toBeTruthy();
      expect(perBaseProps[6]).toBeTruthy();
      expect(perBaseProps[7]).toBeTruthy();
    });

    it('handles per base props list that is too long', () => {
      let sd = new StrictDrawing();
      sd.addTo(document.body, () => NodeSVG());
      sd.appendSequence('qwer', 'qwe');
      let perBaseProps = [];
      for (let i = 0; i < 7; i++) {
        perBaseProps.push(new PerBaseLayoutProps());
        perBaseProps[i].stretch3 = 1012.5;
      }
      sd.setPerBaseLayoutProps(perBaseProps); // list is now too long
      appendStructureToStrictDrawing(sd, { id: 'as', characters: 'as' });
      perBaseProps = sd.perBaseLayoutProps();
      // initialized props for correct positions
      expect(perBaseProps[3].stretch3).toBe(0);
      expect(perBaseProps[4].stretch3).toBe(0);
      // maintained props for other positions
      expect(perBaseProps[0].stretch3).toBe(1012.5);
      expect(perBaseProps[1].stretch3).toBe(1012.5);
      expect(perBaseProps[2].stretch3).toBe(1012.5);
      expect(perBaseProps[5].stretch3).toBe(1012.5);
      expect(perBaseProps[6].stretch3).toBe(1012.5);
      expect(perBaseProps.length).toBe(7);
    });
  });
});

describe('radiates structure', () => {
  it('handles missing secondary partners', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => NodeSVG());
    // no secondary partners
    let appended = appendStructureToStrictDrawing(sd, { id: 'asdf', characters: 'asdf' });
    expect(appended).toBeTruthy(); // was appended
  });

  it('handles knots in secondary partners', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => NodeSVG());
    let partners = [9, 8, 7, 12, 11, 10, 3, 2, 1, 6, 5, 4]; // has a knot
    let appended = appendStructureToStrictDrawing(sd, {
      id: 'asdf',
      characters: 'asdfasdfasdf',
      secondaryPartners: partners,
    });
    expect(appended).toBeTruthy(); // was appended
  });

  it('sets stretch3 for correct bases', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => NodeSVG());
    sd.appendSequence('qwer', 'qwer'); // a preexisting sequence
    let dotBracket = '..(((.))).(((.)))................';
    let parsed = parseDotBracket(dotBracket);
    appendStructureToStrictDrawing(sd, {
      id: 'asdf',
      characters: dotBracket,
      secondaryPartners: parsed.secondaryPartners,
    });
    let perBaseProps = sd.perBaseLayoutProps();
    let expected = radiateStems(parsed.secondaryPartners);
    // there is some stretch to add
    expect(expected.filter(s => s > 0).length).toBeGreaterThan(0);
    parsed.secondaryPartners.forEach((_, i) => {
      let j = i + 4; // accounts for preexisting sequence
      expect(perBaseProps[j].stretch3).toBe(expected[i]);
    });
  });
});

it('updates layout', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  let spy = jest.spyOn(sd, 'updateLayout');
  appendStructureToStrictDrawing(sd, { id: 'asdf', characters: 'asdf' });
  expect(spy).toHaveBeenCalled();
});
