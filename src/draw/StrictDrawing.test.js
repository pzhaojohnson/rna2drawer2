import StrictDrawing from './StrictDrawing';
import NodeSVG from './NodeSVG';
import parseDotBracket from '../parse/parseDotBracket';
import validatePartners from '../parse/validatePartners';

import { StrictLayout } from './layout/singleseq/strict/StrictLayout';

import * as ApplyStrictLayout from './edit/applyStrictLayout';
import * as AppendStructureToStrictDrawing from './edit/appendStructureToStrictDrawing';

import isKnotless from '../parse/isKnotless';
import GeneralStrictLayoutProps from './layout/singleseq/strict/GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './layout/singleseq/strict/PerBaseStrictLayoutProps';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let dotBracket = '(((.[[[.))).]]].';
sd.appendStructure({
  id: 'asdf',
  characters: 'asdfasdfasdfasdf',
  secondaryPartners: parseDotBracket(dotBracket).secondaryPartners,
  tertiaryPartners: parseDotBracket(dotBracket).tertiaryPartners,
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

it('constructor initializes props', () => {
  let sd = new StrictDrawing();
  expect(sd.drawing).toBeTruthy();
  expect(sd.generalLayoutProps()).toBeTruthy();
  expect(sd.perBaseLayoutProps()).toBeTruthy();
  expect(sd.baseWidth).toBeTruthy();
  expect(sd.baseHeight).toBeTruthy();
});

it('drawing getter', () => {
  expect(sd.drawing.savableState().className).toBe('Drawing');
});

it('addTo method', () => {
  let sd = new StrictDrawing();
  sd._drawing = {
    addTo: jest.fn(),
  };
  let node = jest.fn();
  let svg = jest.fn();
  sd.addTo(node, svg);
  expect(sd._drawing.addTo.mock.calls[0][0]).toBe(node);
  expect(sd._drawing.addTo.mock.calls[0][1]).toBe(svg);
});

describe('layoutPartners method', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  sd.appendStructure({
    id: 'asdf',
    characters: 'asdfasdfasdfasdf',
    secondaryPartners: parseDotBracket('((..((....))..))').secondaryPartners,
  });
  
  it('no knots', () => {
    let partners = sd.layoutPartners();
    expect(() => validatePartners(partners)).not.toThrow();
    expect(partners.length).toBe(16);
  });

  it('removes knots', () => {
    let seq = sd.drawing.getSequenceById('asdf');
    sd.drawing.addSecondaryBond(
      seq.getBaseAtPosition(8),
      seq.getBaseAtPosition(14),
    );
    let partners = sd.layoutPartners();
    expect(() => validatePartners(partners)).not.toThrow();
    expect(isKnotless(partners)).toBeTruthy();
  });
});

describe('generalLayoutProps method', () => {
  it('handles nullish props', () => {
    sd._generalLayoutProps = undefined;
    expect(sd.generalLayoutProps()).toBeTruthy();
    expect(sd._generalLayoutProps).toBeTruthy();
  });

  it('returns a deep copy', () => {
    let props = sd.generalLayoutProps();
    expect(props).not.toBe(sd._generalLayoutProps);
    expect(JSON.stringify(props)).toBe(JSON.stringify(sd._generalLayoutProps));
  });
});

describe('setGeneralLayoutProps method', () => {
  it('handles missing argument', () => {
    sd.setGeneralLayoutProps();
    expect(sd.generalLayoutProps()).toBeTruthy();
  });

  it('sets props', () => {
    let props = new GeneralStrictLayoutProps();
    props.basePairPadding = 3.487;
    sd.setGeneralLayoutProps(props);
    expect(sd.generalLayoutProps().basePairPadding).toBe(3.487);
  });
});

describe('perBaseLayoutProps method', () => {
  it('handles nullish props', () => {
    sd._perBaseLayoutProps = undefined;
    expect(sd.perBaseLayoutProps()).toBeTruthy();
    expect(sd._perBaseLayoutProps).toBeTruthy();
  });

  it('returns a deep copy', () => {
    let props = sd.perBaseLayoutProps();
    expect(props).not.toBe(sd._perBaseLayoutProps);
    expect(JSON.stringify(props)).toBe(JSON.stringify(sd._perBaseLayoutProps));
  });
});

describe('setPerBaseLayoutProps method', () => {
  it('handles missing argument', () => {
    sd.setPerBaseLayoutProps();
    expect(sd.perBaseLayoutProps()).toBeTruthy();
  });

  it('sets props', () => {
    let props = [
      new PerBaseStrictLayoutProps(),
      new PerBaseStrictLayoutProps(),
    ];
    props[1].stretch3 = 7.89;
    sd.setPerBaseLayoutProps(props);
    expect(sd.perBaseLayoutProps()[1].stretch3).toBe(7.89);
  });
});

it('baseWidth and baseHeight getters', () => {
  sd.baseWidth = 2.59;
  sd.baseHeight = 23.09;
  expect(sd.baseWidth).toBe(2.59);
  expect(sd.baseHeight).toBe(23.09);
});

describe('layout method', () => {
  it('creates layout with correct props', () => {
    let received = sd.layout();
    let expected = new StrictLayout(
      sd.layoutPartners(),
      sd.generalLayoutProps(),
      sd.perBaseLayoutProps(),
    );
    expect(received.toString()).toBe(expected.toString());
  });

  it('handles failure to create layout', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => NodeSVG());
    sd.appendSequence('asdf', 'asdf');
    sd.layoutPartners = () => { throw new Error(); };
    expect(sd.layout()).toBe(null);
  });
});

describe('applyLayout method', () => {
  it('handles failure to create layout', () => {
    let spy = jest.spyOn(ApplyStrictLayout, 'applyStrictLayout');
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => NodeSVG());
    sd.layout = () => null;
    sd.applyLayout();
    expect(spy.mock.calls.length).toBe(0);
  });

  it('calls applyStrictLayout function', () => {
    let spy = jest.spyOn(ApplyStrictLayout, 'applyStrictLayout');
    sd.applyLayout();
    let c = spy.mock.calls[0];
    expect(c[0]).toBe(sd.drawing);
    expect(c[1].toString()).toBe(sd.layout().toString());
    expect(c[2]).toBe(sd.baseWidth);
    expect(c[3]).toBe(sd.baseHeight);
  });
});

describe('outermost loop shape methods', () => {
  it('handle nullish general layout props', () => {
    sd._generalLayoutProps = undefined;
    expect(sd.hasFlatOutermostLoop()).toBeFalsy();
    sd._generalLayoutProps = undefined;
    sd.flatOutermostLoop();
    expect(sd.hasFlatOutermostLoop()).toBeTruthy();
    sd._generalLayoutProps = undefined;
    expect(sd.hasRoundOutermostLoop()).toBeTruthy();
    sd._generalLayoutProps = undefined;
    expect(sd.roundOutermostLoop());
    expect(sd.hasRoundOutermostLoop()).toBeTruthy();
    sd.generalLayoutProps();
    expect(sd._generalLayoutProps).toBeTruthy();
  });

  it('can change and report the outermost loop shape', () => {
    sd.flatOutermostLoop();
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
    let original = sd.generalLayoutProps();
    sd._generalLayoutProps = undefined;
    let savableState = sd.savableState();
    expect(
      savableState.generalLayoutProps.toString()
    ).toBe((new GeneralStrictLayoutProps()).toString());
    sd.setGeneralLayoutProps(original);
  });

  it('handles nullish per base layout props array', () => {
    let original = sd.perBaseLayoutProps();
    sd._perBaseLayoutProps = undefined;
    let savableState = sd.savableState();
    expect(savableState.perBaseLayoutProps.toString()).toBe(([]).toString());
    sd.setPerBaseLayoutProps(original);
  });

  it('handles nullish per base layout props in array', () => {
    let original = sd.perBaseLayoutProps();
    let modified = sd.perBaseLayoutProps();
    modified[0] = undefined;
    sd.setPerBaseLayoutProps(modified);
    let savableState = sd.savableState();
    expect(savableState.perBaseLayoutProps.length).toBe(modified.length);
    expect(savableState.perBaseLayoutProps[0]).toBeFalsy();
    sd.setPerBaseLayoutProps(original);
  });

  it('gives correct values', () => {
    let generalProps = sd.generalLayoutProps();
    generalProps.basePairPadding = 12.71;
    sd.setGeneralLayoutProps(generalProps);
    let perBaseProps = sd.perBaseLayoutProps();
    perBaseProps[0].triangleLoopHeight = 12.91;
    sd.setPerBaseLayoutProps(perBaseProps);
    sd.baseWidth = 18.02;
    sd.baseHeight = 22.34;
    let savableState = sd.savableState();
    expect(savableState.drawing.className).toBe('Drawing');
    expect(savableState.generalLayoutProps.basePairPadding).toBe(12.71);
    expect(savableState.perBaseLayoutProps.length).toBe(perBaseProps.length);
    expect(savableState.perBaseLayoutProps[0].triangleLoopHeight).toBe(12.91);
    expect(savableState.baseWidth).toBe(18.02);
    expect(savableState.baseHeight).toBe(22.34);
  });

  it('can be converted to and from a JSON string', () => {
    let savableState1 = sd.savableState();
    let json1 = JSON.stringify(savableState1);
    let savableState2 = JSON.parse(json1);
    let json2 = JSON.stringify(savableState2);
    expect(json2).toBe(json1);
  });
});

it('savableString method', () => {
  let savableString = sd.savableString;
  let savableState = JSON.parse(savableString);
  expect(savableState.toString()).toBe(sd.savableState().toString());
});

describe('applySavedState method', () => {
  it('handles failure to apply saved state', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => NodeSVG());
    let savableState1 = sd.savableState();
    sd.appendSequence('asdf', 'asdf');
    let savableState2 = sd.savableState();
    savableState1.drawing.sequences = 'asdf';
    let applied = sd.applySavedState(savableState1);
    expect(applied).toBeFalsy();
    expect(JSON.stringify(sd.savableState())).toBe(JSON.stringify(savableState2));
  });

  it('applies saved state', () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => NodeSVG());
    let savableState1 = sd.savableState();
    sd.appendSequence('qwer', 'qwerqwer');
    let savableState2 = sd.savableState();
    expect(JSON.stringify(savableState1)).not.toBe(JSON.stringify(savableState2));
    let applied = sd.applySavedState(savableState1);
    expect(applied).toBeTruthy();
    expect(JSON.stringify(sd.savableState())).toBe(JSON.stringify(savableState1));
  });
});

it('refreshIds method', () => {
  let spy = jest.spyOn(sd.drawing, 'refreshIds');
  sd.refreshIds();
  expect(spy).toHaveBeenCalled();
});

it('zoom getter and setter', () => {
  let getSpy = jest.spyOn(sd.drawing, 'zoom', 'get');
  let setSpy = jest.spyOn(sd.drawing, 'zoom', 'set');
  sd.zoom = 0.78;
  expect(sd.zoom).toBeCloseTo(0.78);
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
  expect(sd.sequenceIds().toString()).toBe(sd.drawing.sequenceIds().toString());
  expect(sd.sequenceIds().length).toBeGreaterThan(0);
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
  expect(sd.svgString).toBe(sd.drawing.svgString);
});
