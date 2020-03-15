import baseCoordinatesTriangularRound from './UnpairedRegionTriangularRound';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';
import { RoundLoop } from './StemLayout';

function zeroStretch3(length) {
  let bps = [];
  for (let i = 0; i < length; i++) {
    bps.push(new StrictLayoutBaseProps());
    bps[i].stretch3 = 0;
  }
  return bps;
}

function checkCoords(coords, expectedCoords) {
  expect(coords.length).toBe(expectedCoords.length);

  for (let i = 0; i < expectedCoords.length; i++) {
    expect(coords[i].xCenter).toBeCloseTo(expectedCoords[i][0]);
    expect(coords[i].yCenter).toBeCloseTo(expectedCoords[i][1]);
  }
}

it('empty unpaired region', () => {
  let partners = [3, null, 1, 6, null, 4];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  let coords = baseCoordinatesTriangularRound(ur);
  expect(coords.length).toBe(0);
});

it('unpaired region of length one', () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  
  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [-0.5258802114424885, -4.9560323802778266],
    ],
  );
});

it('unpaired region of length four', () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);
  
  let st = new Stem(0, partners, gps, bps);
  RoundLoop.setCoordinatesAndAngles(st, gps, bps);

  let it = st.loopIterator();
  it.next();
  it.next();
  let ur = it.next().value;
  
  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [-2.279481942114413, -5.382860427623127],
      [-1.526353345341585, -6.235622154226999],
      [-0.453874511932735, -6.615351528291503],
      [0.6680593768807342, -6.426487569926458],
    ],
  );
});

it('less than semicircle', () => {

  /*
  let coords = baseCoordinatesTriangularRound(ur);
  let xs = '';
  let ys = '';
  xs += ur.baseCoordinatesBounding5().xCenter + '\n';
  ys += ur.baseCoordinatesBounding5().yCenter + '\n';
  coords.forEach(vbc => {
    xs += vbc.xCenter + '\n';
    ys += vbc.yCenter + '\n';
  });
  xs += ur.baseCoordinatesBounding3().xCenter;
  ys += ur.baseCoordinatesBounding3().yCenter;
  console.log(xs);
  console.log(ys);
  */

  /*
  let coords = baseCoordinatesTriangularRound(ur);
  let s = '';
  coords.forEach(vbc => {
    s += '[';
    s += vbc.xCenter + ', ';
    s += vbc.yCenter + '],\n';
  });
  console.log(s);
  */
});

// less than semicircle

// exactly semicircle

// more than semicircle

// much more than semicircle

// empty unpaired region

// length one

// distance between bounding stems is zero

// bounding stems have same angle

// bounding stems completely overlap
