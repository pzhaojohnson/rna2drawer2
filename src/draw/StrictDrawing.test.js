import StrictDrawing from './StrictDrawing';
import NodeSVG from './NodeSVG';
import parseDotBracket from '../parse/parseDotBracket';

import { StrictLayout } from './layout/singleseq/strict/StrictLayout';

import * as AppendStructureToStrictDrawing from './edit/appendStructureToStrictDrawing';

import GeneralStrictLayoutProps from './layout/singleseq/strict/GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './layout/singleseq/strict/PerBaseStrictLayoutProps';
import layoutPartnersOfStrictDrawing from './edit/layoutPartnersOfStrictDrawing';

let sd = new StrictDrawing();
let container = document.createElement('div');
document.body.appendChild(container);
sd.addTo(container, () => NodeSVG());
let dotBracket1 = '(((.[[[.))).]]].';
let partners1 = parseDotBracket(dotBracket1);
sd.appendStructure({
  id: 'asdf',
  characters: 'asdfasdfasdfasdf',
  secondaryPartners: partners1.secondaryPartners,
  tertiaryPartners: partners1.tertiaryPartners,
});
let dotBracket2 = '..((..((....))..))';
let partners2 = parseDotBracket(dotBracket2);
sd.appendStructure({
  id: 'qwer',
  characters: 'qwerqwerqwerqwerqw',
  secondaryPartners: partners2.secondaryPartners,
  tertiaryPartners: partners2.tertiaryPartners,
});
let generalProps = sd.generalLayoutProps();
generalProps.basePairBondLength = 6.78;
sd.setGeneralLayoutProps(generalProps);
let perBaseProps = sd.perBaseLayoutProps();
perBaseProps[0].flipStem = true;
perBaseProps[11].stretch3 = 20;
sd.setPerBaseLayoutProps(perBaseProps);
sd.baseWidth = 20.78;
sd.baseHeight = 18.012;

it('drawing getter', () => {
  expect(sd.drawing).toBe(sd._drawing);
});

it('addTo method', () => {
  let sd = new StrictDrawing();
  let spy = jest.spyOn(sd._drawing, 'addTo');
  let container = document.createElement('div');
  document.body.appendChild(container);
  let svg = () => NodeSVG();
  sd.addTo(container, svg);
  let c = spy.mock.calls[0];
  expect(c[0]).toBe(container);
  expect(c[1]).toBe(svg);
  expect(container.childNodes.length).toBe(1); // drawing was added
});

it('layoutPartners method', () => {
  expect(sd.drawing.numSequences).toBeGreaterThan(1); // handles multiple sequences
  expect(sd.drawing.secondaryBonds.length).toBeGreaterThan(1); // has a secondary structure
  let received = sd.layoutPartners();
  let expected = layoutPartnersOfStrictDrawing(sd);
  expect(JSON.stringify(received)).toBe(JSON.stringify(expected));
});

describe('generalLayoutProps method', () => {
  it('handles nullish props', () => {
    sd._generalLayoutProps = undefined;
    expect(sd.generalLayoutProps()).toBeTruthy();
    expect(sd._generalLayoutProps).toBeTruthy(); // initializes new props
  });

  it('returns a copy', () => {
    let props = sd.generalLayoutProps();
    expect(props).not.toBe(sd._generalLayoutProps); // a new object
    expect(JSON.stringify(props)).toBe(JSON.stringify(sd._generalLayoutProps));
  });
});

describe('setGeneralLayoutProps method', () => {
  it('handles missing argument', () => {
    sd.setGeneralLayoutProps();
    expect(sd.generalLayoutProps()).toBeTruthy();
  });

  it('sets props', () => {
    let props = sd.generalLayoutProps();
    props.basePairPadding += 5.5;
    sd.setGeneralLayoutProps(props);
    expect(JSON.stringify(sd.generalLayoutProps())).toBe(JSON.stringify(props));
  });
});

describe('perBaseLayoutProps method', () => {
  it('handles nullish list', () => {
    sd._perBaseLayoutProps = undefined;
    expect(sd.perBaseLayoutProps()).toBeTruthy();
    expect(sd._perBaseLayoutProps.length).toBe(0); // initializes new list
  });

  it('handles nullish props in list', () => {
    let props = [
      new PerBaseStrictLayoutProps(),
      null,
      new PerBaseStrictLayoutProps(),
    ];
    sd.setPerBaseLayoutProps(props);
    expect(sd._perBaseLayoutProps[1]).toBeFalsy();
    let received = sd.perBaseLayoutProps();
    expect(received[1]).toBeTruthy();
    expect(sd._perBaseLayoutProps[1]).toBeTruthy(); // initializes new props
  });

  it('returns a copy', () => {
    let props = sd.perBaseLayoutProps();
    expect(props).not.toBe(sd._perBaseLayoutProps); // a new object
    expect(JSON.stringify(props)).toBe(JSON.stringify(sd._perBaseLayoutProps));
  });
});

describe('setPerBaseLayoutProps method', () => {
  it('handles missing argument', () => {
    sd.setPerBaseLayoutProps();
    expect(sd.perBaseLayoutProps()).toBeTruthy();
  });

  it('sets props', () => {
    let props = sd.perBaseLayoutProps();
    props[0].stretch3 += 10.12;
    sd.setPerBaseLayoutProps(props);
    expect(JSON.stringify(sd.perBaseLayoutProps())).toBe(JSON.stringify(props));
  });
});

it('baseWidth and baseHeight getters and setters', () => {
  sd.baseWidth = 2.59;
  sd.baseHeight = 23.09;
  expect(sd.baseWidth).toBe(2.59);
  expect(sd.baseHeight).toBe(23.09);
});

describe('outermost loop shape methods', () => {
  it('handle nullish general layout props', () => {
    sd._generalLayoutProps = undefined;
    expect(sd.hasFlatOutermostLoop()).toBeFalsy();
    sd._generalLayoutProps = undefined;
    sd.flatOutermostLoop();
    expect(sd.hasFlatOutermostLoop()).toBeTruthy();
    expect(sd._generalLayoutProps).toBeTruthy(); // initializes new props
    sd._generalLayoutProps = undefined;
    expect(sd.hasRoundOutermostLoop()).toBeTruthy();
    sd._generalLayoutProps = undefined;
    expect(sd.roundOutermostLoop());
    expect(sd.hasRoundOutermostLoop()).toBeTruthy();
    // does not have to initialize new props since loop is round by default
  });

  it('can change and report the outermost loop shape', () => {
    sd.flatOutermostLoop();
    expect(sd.hasRoundOutermostLoop()).toBeFalsy();
    expect(sd.hasFlatOutermostLoop()).toBeTruthy();
    sd.roundOutermostLoop();
    expect(sd.hasRoundOutermostLoop()).toBeTruthy();
    expect(sd.hasFlatOutermostLoop()).toBeFalsy();
    sd.flatOutermostLoop();
    expect(sd.hasRoundOutermostLoop()).toBeFalsy();
    expect(sd.hasFlatOutermostLoop()).toBeTruthy();
  });
});

describe('savableState method', () => {
  it('handles nullish general layout props', () => {
    sd._generalLayoutProps = undefined;
    let savableState = sd.savableState();
    expect(savableState.generalLayoutProps).toBeTruthy();
    expect(sd._generalLayoutProps).toBeTruthy(); // initializes new props
  });

  it('handles nullish per base layout props list', () => {
    sd._perBaseLayoutProps = undefined;
    let savableState = sd.savableState();
    expect(savableState.perBaseLayoutProps.length).toBe(0);
    expect(sd._perBaseLayoutProps.length).toBe(0); // initializes new list
  });

  it('handles nullish per base layout props in array', () => {
    let props = [
      new PerBaseStrictLayoutProps(),
      undefined,
      new PerBaseStrictLayoutProps(),
      null,
      new PerBaseStrictLayoutProps(),
    ];
    sd.setPerBaseLayoutProps(props);
    let savableState = sd.savableState();
    expect(savableState.perBaseLayoutProps.length).toBe(5);
    expect(savableState.perBaseLayoutProps[0]).toBeTruthy();
    expect(savableState.perBaseLayoutProps[1]).toBeFalsy();
    expect(savableState.perBaseLayoutProps[2]).toBeTruthy();
    expect(savableState.perBaseLayoutProps[3]).toBeFalsy();
    expect(savableState.perBaseLayoutProps[4]).toBeTruthy();
  });

  it('gives correct values', () => {
    let generalProps = sd.generalLayoutProps();
    generalProps.basePairPadding += 12.71;
    sd.setGeneralLayoutProps(generalProps);
    let perBaseProps = sd.perBaseLayoutProps();
    perBaseProps[0].triangleLoopHeight += 12.91;
    sd.setPerBaseLayoutProps(perBaseProps);
    sd.baseWidth = 18.02;
    sd.baseHeight = 22.34;
    let savableState = sd.savableState();
    expect(savableState.drawing.className).toBe('Drawing');
    expect(savableState.generalLayoutProps.toString()).toBe(generalProps.savableState().toString());
    expect(savableState.perBaseLayoutProps.length).toBe(perBaseProps.length);
    savableState.perBaseLayoutProps.forEach((props, i) => {
      if (props) {
        expect(props.toString()).toBe(perBaseProps[i].savableState().toString());
      } else {
        expect(props).toBe(perBaseProps[i]);
      }
    });
    expect(savableState.baseWidth).toBe(18.02);
    expect(savableState.baseHeight).toBe(22.34);
  });

  it('can be converted to and from a JSON string', () => {
    let savableState = sd.savableState();
    let json = JSON.stringify(savableState);
    let parsed = JSON.parse(json);
    expect(JSON.stringify(parsed)).toBe(json);
  });
});

it('savableString method', () => {
  let savableString = sd.savableString;
  let savableState = JSON.parse(savableString);
  expect(savableState.toString()).toBe(sd.savableState().toString());
});

describe('applySavedState method', () => {
  describe('handles failure to apply saved state', () => {
    it('wrong class name', () => {
      let sd = new StrictDrawing();
      sd.addTo(document.body, () => NodeSVG());
      sd.appendSequence('asdf', 'asdf');
      let savableState1 = sd.savableState();
      sd.appendSequence('qwer', 'qwer');
      let savableState2 = sd.savableState();
      expect(JSON.stringify(savableState2)).not.toBe(JSON.stringify(savableState1));
      savableState1.className = 'StrctDrawing';
      let applied = sd.applySavedState(savableState1);
      expect(applied).toBeFalsy();
      // the drawing is not changed
      expect(JSON.stringify(sd.savableState())).toBe(JSON.stringify(savableState2));
    });

    it('handles failure to apply saved state to underlying drawing', () => {
      let sd = new StrictDrawing();
      sd.addTo(document.body, () => NodeSVG());
      let savableState1 = sd.savableState();
      sd.appendSequence('asdf', 'asdf');
      let savableState2 = sd.savableState();
      expect(JSON.stringify(savableState2)).not.toBe(JSON.stringify(savableState1));
      savableState1.drawing = null;
      let applied = sd.applySavedState(savableState1);
      expect(applied).toBeFalsy();
      // the drawing is not changed
      expect(JSON.stringify(sd.savableState())).toBe(JSON.stringify(savableState2));
    });
  });

  it('can successfully apply saved state', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => NodeSVG());
    sd.appendSequence('asdf', 'asdf');
    sd.flatOutermostLoop();
    let perBaseProps = sd.perBaseLayoutProps();
    perBaseProps[0].stretch3 += 1200;
    sd.setPerBaseLayoutProps(perBaseProps);
    sd.baseWidth = 128.885;
    sd.baseHeight = 59.902;
    let savableState1 = sd.savableState();
    sd.appendSequence('qwer', 'qwerqwer'); // change underlying drawing
    sd.roundOutermostLoop(); // change general layout props
    perBaseProps = sd.perBaseLayoutProps();
    perBaseProps[1].stretch3 += 802;
    sd.setPerBaseLayoutProps(perBaseProps); // change per base layout props
    // change base width and height
    sd.baseWidth = 19;
    sd.baseHeight = 23.01;
    let savableState2 = sd.savableState();
    expect(JSON.stringify(savableState2)).not.toBe(JSON.stringify(savableState1));
    let applied = sd.applySavedState(savableState1);
    expect(applied).toBeTruthy();
    // requires that the saved drawing and general and per base layout props
    // and base width and height were applied correctly
    expect(JSON.stringify(sd.savableState())).toBe(JSON.stringify(savableState1));
  });
});

it('zoom getter and setter', () => {
  let getSpy = jest.spyOn(sd.drawing, 'zoom', 'get');
  let setSpy = jest.spyOn(sd.drawing, 'zoom', 'set');
  sd.zoom = 0.78; // use setter
  expect(sd.zoom).toBeCloseTo(0.78); // check getter
  // uses drawing getter and setter
  expect(getSpy).toHaveBeenCalled();
  expect(setSpy).toHaveBeenCalled();
});

it('isEmpty method', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  expect(sd.isEmpty()).toBeTruthy();
  sd.appendSequence('asdf', 'asdf');
  expect(sd.isEmpty()).toBeFalsy();
});

it('sequenceIds method', () => {
  expect(sd.drawing.numSequences).toBeGreaterThan(1);
  expect(sd.sequenceIds().toString()).toBe(sd.drawing.sequenceIds().toString());
});

it('appendSequence method', () => {
  let spy = jest.spyOn(sd, 'appendStructure');
  sd.appendSequence('kljh', 'kkio');
  let c = spy.mock.calls[0];
  expect(c[0].id).toBe('kljh');
  expect(c[0].characters).toBe('kkio');
  expect(c[0].secondaryPartners).toBeFalsy();
  expect(c[0].tertiaryPartners).toBeFalsy();
});

it('appendStructure method', () => {
  let spy = jest.spyOn(AppendStructureToStrictDrawing, 'appendStructureToStrictDrawing');
  let s = {
    id: 'asdf',
    characters: 'qwerzxcv',
  };
  sd.appendStructure(s);
  let c = spy.mock.calls[0];
  expect(c[0]).toBe(sd);
  expect(c[1]).toBe(s);
});

it('svgString getter', () => {
  expect(sd.isEmpty()).toBeFalsy();
  expect(sd.svgString).toBe(sd.drawing.svgString);
});
