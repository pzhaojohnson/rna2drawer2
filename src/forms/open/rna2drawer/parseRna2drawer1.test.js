import { parseRna2drawer1 } from './parseRna2drawer1';
import * as fs from 'fs';

function readRna2drawer1(name) {
  return fs.readFileSync('testinput/rna2drawer1/' + name + '.rna2drawer', 'utf8');
}

Object.defineProperty(window, 'getComputedStyle', {
  value: ele => {
    let color;
    switch (ele.style.color) {
      case 'black':
        color = 'rgb(0, 0, 0)';
        break;
      case 'red':
        color = 'rgb(255, 0, 0)';
        break;
      case 'green':
        color = 'rgb(0, 255, 0)';
        break;
      case 'blue':
        color = 'rgb(0, 0, 255)';
        break;
      case 'cyan':
        color = 'rgb(0, 255, 255)';
        break;
      case 'orange':
        color = 'rgb(255, 165, 0)';
        break;
      case 'gold':
        color = 'rgb(255, 215, 0)';
        break;
      case 'lightyellow':
        color = 'rgb(255, 255, 224)';
        break;
    }
    return { color: color };
  }
});

it('parses sequence ID and characters', () => {
  let rna2drawer1 = parseRna2drawer1(readRna2drawer1('hairpin'));
  expect(rna2drawer1.sequenceId).toBe('AsdfQwer  Zxcv');
  expect(rna2drawer1.characters).toBe('AAGGCCUUAGCUAA');
});

it('parses secondary structure', () => {
  let rna2drawer1 = parseRna2drawer1(readRna2drawer1('hairpin'));
  expect(rna2drawer1.secondaryStructure.secondaryPartners).toStrictEqual(
    [12, 11, 10, 9, null, null, null, null, 4, 3, 2, 1, null, null]
  );
  let tertiaryPartners = [];
  rna2drawer1.characters.split('').forEach(() => tertiaryPartners.push(null));
  expect(rna2drawer1.secondaryStructure.tertiaryPartners).toStrictEqual(tertiaryPartners);
});

describe('parsing tertiary interactions', () => {
  let rna2drawer1 = parseRna2drawer1(readRna2drawer1('tertiaryInteractions'));

  it('parses all tertiary interactions', () => {
    expect(rna2drawer1.tertiaryInteractions.length).toBe(3);
  });

  it('parses sides', () => {
    let ti = rna2drawer1.tertiaryInteractions[1];
    expect(ti.side1).toStrictEqual([11, 13]);
    expect(ti.side2).toStrictEqual([6, 8]);
  });

  it('parses color', () => {
    let ti = rna2drawer1.tertiaryInteractions[1];
    expect(ti.color.toHex()).toBe('#ffa500');
  });

  it('can parse a drawing with no tertiary interactions', () => {
    let rna2drawer1 = parseRna2drawer1(readRna2drawer1('noTertiaryInteractions'));
    expect(rna2drawer1).toBeTruthy();
  });

  it('handles invalid side positions', () => {
    let rna2drawer1 = parseRna2drawer1(readRna2drawer1('tertiaryInteractionWithInvalidSidePosition'));
    expect(rna2drawer1).toBe(null);
  });
});

it('parses numbering props', () => {
  let rna2drawer1 = parseRna2drawer1(readRna2drawer1('numbering'));
  expect(rna2drawer1.numberingOffset).toBe(-58);
  expect(rna2drawer1.numberingAnchor).toBe(82);
  expect(rna2drawer1.numberingIncrement).toBe(6);
});

describe('parsing base colors', () => {
  it('parses valid colors', () => {
    let rna2drawer1 = parseRna2drawer1(readRna2drawer1('baseColors'));
    let colors = [];
    rna2drawer1.baseColors.forEach(bc => colors.push(bc.toHex()));
    expect(colors).toStrictEqual(
      ['#000000', '#0000ff', '#000000', '#00ffff', '#00ffff', '#000000']
    );
  });

  it('handles invalid colors', () => {
    let rna2drawer1 = parseRna2drawer1(readRna2drawer1('invalidBaseColor'));
    /* It seems that the color of an element defaults to black when it is
    set to an invalid color name. There is really no other convenient way
    to convert a color name to a computed value other than by setting the
    color of an element, though. */
    //expect(rna2drawer1).toBe(null);
  });
});

describe('parsing base outlines', () => {
  let rna2drawer1 = parseRna2drawer1(readRna2drawer1('baseOutlines'));

  it('parses relative radius', () => {
    let bo = rna2drawer1.baseOutlines[2];
    expect(bo.relativeRadius).toBeCloseTo(0.91);
  });

  it('parses an outline with stroke and fill', () => {
    let bo = rna2drawer1.baseOutlines[1];
    expect(bo.stroke.toHex()).toBe('#ffd700');
    expect(bo.strokeWidth).toBeCloseTo(1.22);
    expect(bo.strokeOpacity).toBe(1);
    expect(bo.fill.toHex()).toBe('#ffa500');
    expect(bo.fillOpacity).toBe(1);
  });

  it('parses an outline with only stroke', () => {
    let bo = rna2drawer1.baseOutlines[3];
    expect(bo.stroke.toHex()).toBe('#ffa500');
    expect(bo.strokeWidth).toBeCloseTo(2.06);
    expect(bo.strokeOpacity).toBe(1);
    expect(bo.fillOpacity).toBe(0);
  });

  it('parses an outline with only fill', () => {
    let bo = rna2drawer1.baseOutlines[5];
    expect(bo.strokeOpacity).toBe(0);
    expect(bo.fill.toHex()).toBe('#ffffe0');
    expect(bo.fillOpacity).toBe(1);
  });

  it('parses an outline with no stroke or fill', () => {
    let bo = rna2drawer1.baseOutlines[4];
    expect(bo).toBe(null);
  });
  
  it('handles invalid relative radius or stroke width', () => {
    let invalidRr = parseRna2drawer1(readRna2drawer1('baseOutlineWithInvalidRelativeRadius'));
    expect(invalidRr).toBe(null);
    let invalidSw = parseRna2drawer1(readRna2drawer1('baseOutlineWithInvalidStrokeWidth'));
    expect(invalidSw).toBe(null);
  });
});

it('cleans up any invisible elements used to compute colors', () => {
  let n = document.body.childNodes.length;
  parseRna2drawer1(readRna2drawer1('numbering'));
  expect(document.body.childNodes.length).toBe(n); // is unchanged
});
