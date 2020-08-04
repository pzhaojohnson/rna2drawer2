import applyStrictLayout from './applyStrictLayout';
import Drawing from '../Drawing';
import createNodeSVG from '../createNodeSVG';
import parseDotBracket from '../../parse/parseDotBracket';
import { appendStructure } from './addStructure';
import GeneralStrictLayoutProps from '../layout/singleseq/strict/GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from '../layout/singleseq/strict/PerBaseStrictLayoutProps';
import StrictLayout from '../layout/singleseq/strict/StrictLayout';
import distanceBetween from '../distanceBetween';
import normalizeAngle from '../normalizeAngle';

function perBaseProps(length) {
  let props = [];
  for (let i = 0; i < length; i++) {
    props.push(new PerBaseStrictLayoutProps());
  }
  return props;
}

it('moves bases', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  let parsed = parseDotBracket('(((...)))');
  appendStructure(drawing, {
    id: 'asdf',
    characters: 'asdfasdfa',
    secondaryPartners: parsed.secondaryPartners,
  });
  let layout = new StrictLayout(
    parsed.secondaryPartners,
    new GeneralStrictLayoutProps(),
    perBaseProps(9),
  );
  applyStrictLayout(drawing, layout, 12, 18);
  drawing.forEachBase((b, p) => {
    let bcs = layout.baseCoordinatesAtPosition(p);
    let ex = window.screen.width + (12 * (bcs.xCenter - layout.xMin));
    let ey = window.screen.height + (18 * (bcs.yCenter - layout.yMin));
    expect(b.xCenter).toBeCloseTo(ex);
    expect(b.yCenter).toBeCloseTo(ey);
  });
});

it('repositions bonds', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  let parsed = parseDotBracket('..((..))');
  appendStructure(drawing, {
    id: 'asdf',
    characters: 'asdfasdf',
    secondaryPartners: parsed.secondaryPartners,
  });
  let layout = new StrictLayout(
    parsed.secondaryPartners,
    new GeneralStrictLayoutProps(),
    perBaseProps(8),
  );
  applyStrictLayout(drawing, layout, 12, 15);
  drawing.forEachSecondaryBond(sb => {
    let b1 = sb.base1;
    expect(
      distanceBetween(sb.x1, sb.y1, b1.xCenter, b1.yCenter)
    ).toBeCloseTo(sb.padding1);
  });
});

it('adjusts base numbering line angles', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  let parsed = parseDotBracket('(((....)))');
  appendStructure(drawing, {
    id: 'qwer',
    characters: 'qwerqwerqw',
    secondaryPartners: parsed.secondaryPartners,
  });
  let spy = jest.spyOn(drawing, 'adjustNumberingLineAngles');
  let layout = new StrictLayout(
    parsed.secondaryPartners,
    new GeneralStrictLayoutProps(),
    perBaseProps(10),
  );
  applyStrictLayout(drawing, layout, 8, 12);
  expect(spy).toHaveBeenCalled();
});

it('sets width and height of drawing', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  let parsed = parseDotBracket('((..))');
  appendStructure(drawing, {
    id: 'zxcv',
    characters: 'zxcvzx',
    secondaryPartners: parsed.secondaryPartners,
  });
  let layout = new StrictLayout(
    parsed.secondaryPartners,
    new GeneralStrictLayoutProps(),
    perBaseProps(6),
  );
  applyStrictLayout(drawing, layout, 20, 18);
  let ew = (2 * window.screen.width) + (20 * (layout.xMax - layout.xMin));
  let eh = (2 * window.screen.height) + (18 * (layout.yMax - layout.yMin));
  expect(drawing.width).toBeCloseTo(ew);
  expect(drawing.height).toBeCloseTo(eh);
});
