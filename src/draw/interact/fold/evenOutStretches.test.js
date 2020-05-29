import evenOutStretches from './evenOutStretches';
import StrictDrawing from '../../StrictDrawing';
import NodeSVG from '../../NodeSVG';
import parseDotBracket from '../../../parse/parseDotBracket';
import FoldingMode from './FoldingMode';

it('multiple stretches to even out', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  sd.appendStructure({
    id: 'asdf',
    characters: 'asdfasdfasdfasdf',
    secondaryPartners: parseDotBracket('((..))..((..))..').secondaryPartners,
  });
  let perBaseProps = sd.perBaseLayoutProps();
  perBaseProps[5].stretch3 = 3;
  perBaseProps[6].stretch3 = 5;
  perBaseProps[7].stretch3 = 7;
  perBaseProps[13].stretch3 = 2;
  perBaseProps[14].stretch3 = 6;
  perBaseProps[15].stretch3 = 4;
  sd.setPerBaseLayoutProps(perBaseProps);
  let mode = new FoldingMode(sd);
  evenOutStretches(mode);
  perBaseProps = sd.perBaseLayoutProps();
  expect(perBaseProps[5].stretch3).toBeCloseTo(5);
  expect(perBaseProps[6].stretch3).toBeCloseTo(5);
  expect(perBaseProps[7].stretch3).toBeCloseTo(5);
  expect(perBaseProps[13].stretch3).toBeCloseTo(4);
  expect(perBaseProps[14].stretch3).toBeCloseTo(4);
  expect(perBaseProps[15].stretch3).toBeCloseTo(4);
});

it("5' bounding position of unpaired region is zero", () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  sd.appendStructure({
    id: 'asdf',
    characters: 'qwerqwer',
    secondaryPartners: parseDotBracket('..((..))').secondaryPartners,
  });
  let perBaseProps = sd.perBaseLayoutProps();
  perBaseProps[0].stretch3 = 10;
  perBaseProps[1].stretch3 = 6;
  sd.setPerBaseLayoutProps(perBaseProps);
  let mode = new FoldingMode(sd);
  evenOutStretches(mode);
  perBaseProps = sd.perBaseLayoutProps();
  expect(perBaseProps[0].stretch3).toBe(8);
  expect(perBaseProps[1].stretch3).toBe(8);
});

it('no positions with stretch in unpaired region', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => NodeSVG());
  sd.appendStructure({
    id : 'asdf',
    characters: 'asdfas',
    secondaryPartners: parseDotBracket('((..))').secondaryPartners,
  });
  let mode = new FoldingMode(sd);
  expect(
    () => evenOutStretches(mode)
  ).not.toThrow();
});
