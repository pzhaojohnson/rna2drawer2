import { addRna2drawer1 } from './addRna2drawer1';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import * as Svg from '@svgdotjs/svg.js';
import { pixelsToPoints } from '../../../export/pixelsToPoints';

let app = null;
let rna2drawer1 = null;

beforeEach(() => {
  app = new App(() => NodeSVG());

  let characters = 'AAACCCUUU';
  let tertiaryPartners = [];
  characters.split('').forEach(() => tertiaryPartners.push(null));
  let baseColors = [];
  characters.split('').forEach(() => baseColors.push(new Svg.Color('#000000')));
  rna2drawer1 = {
    sequenceId: 'AsdfQwer',
    characters: characters,
    secondaryStructure: {
      secondaryPartners: [9, 8, 7, null, null, null, 3, 2, 1],
      tertiaryPartners: tertiaryPartners,
    },
    tertiaryInteractions: [],
    numberingOffset: 0,
    numberingAnchor: 0,
    numberingIncrement: 20,
    baseColors: baseColors,
    baseOutlines: [],
  };
});

it('adds sequence with ID and characters', () => {
  rna2drawer1.sequenceId = 'asdfQWER zxcv';
  rna2drawer1.characters = 'AAggccUGCAAU';
  addRna2drawer1(app.strictDrawing, rna2drawer1);
  let seq = app.strictDrawing.drawing.getSequenceById('asdfQWER zxcv');
  expect(seq).toBeTruthy();
  expect(seq.characters).toBe('AAggccUGCAAU');
});

it('adds secondary structure', () => {
  rna2drawer1.characters = 'aaaggguuuccc';
  rna2drawer1.secondaryStructure.secondaryPartners = [9, 8, 7, null, null, null, 3, 2, 1, null, null, null];
  let tertiaryPartners = [];
  rna2drawer1.characters.split('').forEach(() => tertiaryPartners.push(null));
  rna2drawer1.secondaryStructure.tertiaryPartners = tertiaryPartners;
  let spy = jest.spyOn(app.strictDrawing, 'appendStructure');
  addRna2drawer1(app.strictDrawing, rna2drawer1);
  expect(app.strictDrawing.layoutPartners()).toStrictEqual(rna2drawer1.secondaryStructure.secondaryPartners);
  expect(spy.mock.calls[0][0].tertiaryPartners).toBe(tertiaryPartners);
});

describe('adding tertiary interactions', () => {
  it('', () => {});
});

it('adds numbering props', () => {
  rna2drawer1.sequenceId = 'asdf';
  rna2drawer1.numberingOffset = -1012;
  rna2drawer1.numberingAnchor = 38;
  rna2drawer1.numberingIncrement = 43;
  addRna2drawer1(app.strictDrawing, rna2drawer1);
  let seq = app.strictDrawing.drawing.getSequenceById('asdf');
  expect(seq.numberingOffset).toBe(-1012);
  expect(seq.numberingAnchor).toBe(38);
  expect(seq.numberingIncrement).toBe(43);
});

describe('adding base colors', () => {
  it('colors bases correctly', () => {
    rna2drawer1.characters = 'augc';
    let baseColors = [new Svg.Color('#000000'), new Svg.Color('#00ffff'), new Svg.Color('#ffa500'), new Svg.Color('#00ffa5')];
    rna2drawer1.baseColors = baseColors;
    addRna2drawer1(app.strictDrawing, rna2drawer1);
    app.strictDrawing.drawing.forEachBase((b, p) => {
      expect(b.fill).toBe(baseColors[p - 1].toHex());
    });
  });

  it('handles undefined base colors', () => {
    rna2drawer1.characters = 'asdfasdf';
    rna2drawer1.baseColors = [new Svg.Color('#000000'), undefined, new Svg.Color('#ff0000')];
    addRna2drawer1(app.strictDrawing, rna2drawer1);
    let drawing = app.strictDrawing.drawing;
    expect(drawing.getBaseAtOverallPosition(1).fill).toBe('#000000');
    expect(drawing.getBaseAtOverallPosition(2).fill).toBe('#000000');
    expect(drawing.getBaseAtOverallPosition(3).fill).toBe('#ff0000');
    for (let p = 4; p <= drawing.numBases; p++) {
      expect(drawing.getBaseAtOverallPosition(p).fill).toBe('#000000');
    }
  });
});

describe('adding base outlines', () => {
  it('adds outlines to all bases that should have one', () => {
    let o = {
      relativeRadius: 1.1,
      stroke: new Svg.Color('#00ff00'),
      strokeWidth: 1.12,
      strokeOpacity: 1,
      fill: new Svg.Color('#0000ff'),
      fillOpacity: 1,
    };
    rna2drawer1.characters = 'asdfasdf';
    rna2drawer1.baseOutlines = [null, null, { ...o }, null, { ...o }, null];
    addRna2drawer1(app.strictDrawing, rna2drawer1);
    app.strictDrawing.drawing.forEachBase((b, p) => {
      if (p == 3 || p == 5) {
        expect(b.outline).toBeTruthy();
      } else {
        expect(b.outline).toBeFalsy();
      }
    });
  });

  it('adds outlines with correct props', () => {
    rna2drawer1.baseOutlines = [{
      relativeRadius: 1.15,
      stroke: new Svg.Color('#ff00ab'),
      strokeWidth: 2.31,
      strokeOpacity: 0.45,
      fill: new Svg.Color('#abcd21'),
      fillOpacity: 0.57,
    }];
    addRna2drawer1(app.strictDrawing, rna2drawer1);
    let b = app.strictDrawing.drawing.getBaseAtOverallPosition(1);
    let o = b.outline;
    expect(o.radius).toBeCloseTo(1.15 * pixelsToPoints(b.fontSize));
    expect(o.stroke).toBe('#ff00ab');
    expect(o.strokeWidth).toBe(2.31);
    expect(o.strokeOpacity).toBe(0.45);
    expect(o.fill).toBe('#abcd21');
    expect(o.fillOpacity).toBe(0.57);
  });
});
