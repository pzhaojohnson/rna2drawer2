import adjustStretches from './adjustStretches';
import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import FoldingMode from './FoldingMode';
import parseDotBracket from '../../../parse/parseDotBracket';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);
let secondaryPartners = parseDotBracket('...(((....(((...)))..(..)....)))..').secondaryPartners;
let chars = '';
secondaryPartners.forEach(() => chars += 'A');
sd.appendStructure({ id: 'asdf', characters: chars, secondaryPartners: secondaryPartners });

describe('evening out stretches of unpaired regions', () => {
  it("with a 5' bounding position of zero", () => {
    let perBaseProps = sd.perBaseLayoutProps();
    perBaseProps[0].stretch3 = 10;
    perBaseProps[1].stretch3 = 9;
    perBaseProps[2].stretch3 = 8;
    sd.setPerBaseLayoutProps(perBaseProps);
    adjustStretches(mode);
    perBaseProps = sd.perBaseLayoutProps();
    expect(perBaseProps[0].stretch3).toBeCloseTo(9);
    expect(perBaseProps[1].stretch3).toBeCloseTo(9);
    expect(perBaseProps[2].stretch3).toBeCloseTo(9);
  });

  it("with a nonzero 5' bounding position", () => {
    let perBaseProps = sd.perBaseLayoutProps();
    perBaseProps[18].stretch3 = 1;
    perBaseProps[19].stretch3 = 2;
    perBaseProps[20].stretch3 = 3;
    sd.setPerBaseLayoutProps(perBaseProps);
    adjustStretches(mode);
    perBaseProps = sd.perBaseLayoutProps();
    expect(perBaseProps[18].stretch3).toBeCloseTo(2);
    expect(perBaseProps[19].stretch3).toBeCloseTo(2);
    expect(perBaseProps[20].stretch3).toBeCloseTo(2);
  });

  it("with size of zero and a 5' bounding position of zero", () => {
    let sd = new StrictDrawing();
    sd.addTo(document.body, () => NodeSVG());
    let mode = new FoldingMode(sd);
    let secondaryPartners = parseDotBracket('(((...)))').secondaryPartners;
    let chars = '';
    secondaryPartners.forEach(() => chars += 'A');
    sd.appendStructure({ id: 'qwer', characters: chars, secondaryPartners: secondaryPartners });
    adjustStretches(mode);
    let perBaseProps = sd.perBaseLayoutProps();
    perBaseProps.forEach(props => {
      expect(Number.isFinite(props.stretch3)).toBeTruthy();
    });
  });
});

describe('removing stretch within stems', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  let mode = new FoldingMode(sd);
  let secondaryPartners = parseDotBracket('.(.(((.))).).').secondaryPartners;
  let chars = '';
  secondaryPartners.forEach(() => chars += 'A');
  sd.appendStructure({ id: 'asdf', characters: chars, secondaryPartners: secondaryPartners });
  
  it('for a stem with one base pair', () => {
    let perBaseProps = sd.perBaseLayoutProps();
    perBaseProps[1].stretch3 = 18.5;
    perBaseProps[11].stretch3 = 27.8;
    sd.setPerBaseLayoutProps(perBaseProps);
    adjustStretches(mode);
    perBaseProps = sd.perBaseLayoutProps();
    // strethces are maintained (and spread out across unpaired region)
    expect(perBaseProps[1].stretch3).toBeCloseTo(9.25);
    expect(perBaseProps[2].stretch3).toBeCloseTo(9.25);
    expect(perBaseProps[11].stretch3).toBeCloseTo(13.9);
    expect(perBaseProps[12].stretch3).toBeCloseTo(13.9);
  });

  it('for a stem with multiple base pairs', () => {
    let perBaseProps = sd.perBaseLayoutProps();
    perBaseProps[3].stretch3 = 11.22;
    perBaseProps[4].stretch3 = 22.78;
    perBaseProps[5].stretch3 = 98.4;
    perBaseProps[7].stretch3 = 54.2;
    perBaseProps[8].stretch3 = 100.3;
    perBaseProps[9].stretch3 = 12.09;
    sd.setPerBaseLayoutProps(perBaseProps);
    adjustStretches(mode);
    perBaseProps = sd.perBaseLayoutProps();
    // removes stretch between base pairs
    expect(perBaseProps[3].stretch3).toBe(0);
    expect(perBaseProps[4].stretch3).toBe(0);
    expect(perBaseProps[7].stretch3).toBe(0);
    expect(perBaseProps[8].stretch3).toBe(0);
    // maintains stretch on edges (and spreads out across unpaired region)
    expect(perBaseProps[5].stretch3).toBeCloseTo(49.2);
    expect(perBaseProps[6].stretch3).toBeCloseTo(49.2);
    expect(perBaseProps[9].stretch3).toBeCloseTo(6.045);
    expect(perBaseProps[10].stretch3).toBeCloseTo(6.045);
  });
});
