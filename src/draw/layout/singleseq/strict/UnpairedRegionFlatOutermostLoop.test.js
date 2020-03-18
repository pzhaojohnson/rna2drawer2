import baseCoordinatesFlatOutermostLoop from './UnpairedRegionFlatOutermostLoop';
import { FlatOutermostLoop } from './StemLayout';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';

function defaultBaseProps(length) {
  let bps = [];
  for (let i = 0; i < length; i++) {
    bps.push(new StrictLayoutBaseProps());
  }
  return bps;
}

function checkCoords(coords, expectedCoords) {
  expect(coords.length).toBe(expectedCoords.length);
  for (let i = 0; i < expectedCoords.length; i++) {
    expect(coords[i].xCenter).toBeCloseTo(expectedCoords[i].xCenter, 3);
    expect(coords[i].yCenter).toBeCloseTo(expectedCoords[i].yCenter, 3);
  }
}

it("5' dangling unpaired region", () => {
  let partners = [null, null, 5, null, 3, null, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  let bps = defaultBaseProps(partners.length);
  bps[0].stretch3 = 5.5;
  bps[0].flatOutermostLoopAngle3 = Math.PI / 3;

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  let ur = it.next().value;
  let st3 = it.next().value;
  
  st3.angle = 6 * Math.PI / 5;
  st3.xBottomCenter = -3.2;
  st3.yBottomCenter = -2.4;

  checkCoords(
    baseCoordinatesFlatOutermostLoop(ur, bps),
    FlatOutermostLoop.traverseUnpairedRegion35(ur, bps),
  );
});

it("not a 5' dangling unpaired region", () => {
  let partners = [null, null, 5, null, 3, null, null];
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  let bps = defaultBaseProps(partners.length);
  bps[4].stretch3 = 2;
  bps[4].flatOutermostLoopAngle3 = -Math.PI / 3;
  bps[5].stretch3 = -4.5;
  bps[5].flatOutermostLoopAngle3 = Math.PI / 6;

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();
  it.next();
  let st5 = it.next().value;
  let ur = it.next().value;

  st5.angle = Math.PI / 8;
  st5.xBottomCenter = 22.4;
  st5.yBottomCenter = 35.7;

  checkCoords(
    baseCoordinatesFlatOutermostLoop(ur, bps),
    FlatOutermostLoop.traverseUnpairedRegion53(ur, bps),
  );
});
