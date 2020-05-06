import baseCoordinatesFlatOutermostLoop from './UnpairedRegionFlatOutermostLoop';
import { FlatOutermostLoop } from './StemLayout';
import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';
import StrictLayoutPerBaseProps from './StrictLayoutPerBaseProps';
import Stem from './Stem';

function defaultPerBaseProps(length) {
  let pbps = [];
  for (let i = 0; i < length; i++) {
    pbps.push(new StrictLayoutPerBaseProps());
  }
  return pbps;
}

function checkCoords(coords, expectedCoords) {
  expect(coords.length).toBe(expectedCoords.length);
  for (let i = 0; i < expectedCoords.length; i++) {
    expect(coords[i].xCenter).toBeCloseTo(expectedCoords[i].xCenter, 3);
    expect(coords[i].yCenter).toBeCloseTo(expectedCoords[i].yCenter, 3);
  }
}

it('basic case', () => {
  let partners = [null, null, 5, null, 3, null, null];
  let gps = new GeneralStrictLayoutProps();
  gps.flatOutermostLoop = true;
  let pbps = defaultPerBaseProps(partners.length);
  pbps[4].stretch3 = 2;
  pbps[4].flatOutermostLoopAngle3 = -Math.PI / 3;
  pbps[5].stretch3 = -4.5;
  pbps[5].flatOutermostLoopAngle3 = Math.PI / 6;

  let outermostStem = new Stem(0, partners, gps, pbps);
  let it = outermostStem.loopIterator();
  it.next();
  let st5 = it.next().value;
  let ur = it.next().value;

  st5.angle = Math.PI / 8;
  st5.xBottomCenter = 22.4;
  st5.yBottomCenter = 35.7;

  checkCoords(
    baseCoordinatesFlatOutermostLoop(ur, gps, pbps),
    FlatOutermostLoop.traverseUnpairedRegion53(ur, gps, pbps),
  );
});

it("5' dangling unpaired region", () => {
  let partners = [null, null, 5, null, 3, null, null];
  let gps = new GeneralStrictLayoutProps();
  gps.flatOutermostLoop = true;
  let pbps = defaultPerBaseProps(partners.length);
  pbps[0].stretch3 = 5.5;
  pbps[0].flatOutermostLoopAngle3 = Math.PI / 3;

  let outermostStem = new Stem(0, partners, gps, pbps);
  let it = outermostStem.loopIterator();
  let ur = it.next().value;
  
  outermostStem.angle = 6 * Math.PI / 5;
  outermostStem.xBottomCenter = -3.2;
  outermostStem.yBottomCenter = -2.4;

  checkCoords(
    baseCoordinatesFlatOutermostLoop(ur, gps, pbps),
    FlatOutermostLoop.traverseUnpairedRegion53(ur, gps, pbps),
  );
});
