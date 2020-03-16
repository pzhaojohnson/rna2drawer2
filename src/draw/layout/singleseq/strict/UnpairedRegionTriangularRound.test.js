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

it('', () => {});


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
      [0.9417320272094623, -3.359258709918983],
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
      [-0.973449382746886, -4.865803412373346],
      [-0.023445050944639112, -5.1465305618146076],
      [0.9497201595415127, -4.961421307654002],
      [1.730313141716504, -4.351511019943093],
    ],
  );
});

it('big unpaired region (of length 50)', () => {
  let partners = [3, null, 1];
  for (let i = 0; i < 50; i++) { partners.push(null) }
  partners = partners.concat([56, null, 54]);
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
      [-4.414551489451787, -3.484749537219816],
      [-4.324609619222734, -4.48069655387266],
      [-4.234667748993681, -5.476643570525503],
      [-4.144725878764628, -6.472590587178347],
      [-4.0547840085355755, -7.468537603831191],
      [-3.9648421383065227, -8.464484620484034],
      [-3.87490026807747, -9.460431637136878],
      [-3.784958397848417, -10.456378653789722],
      [-3.695016527619364, -11.452325670442566],
      [-3.605074657390311, -12.44827268709541],
      [-3.5151327871612583, -13.444219703748253],
      [-3.4251909169322055, -14.440166720401097],
      [-3.3352490467031526, -15.43611373705394],
      [-3.2453071764740997, -16.432060753706786],
      [-3.155365306245047, -17.42800777035963],
      [-3.065423436015994, -18.423954787012477],
      [-2.975481565786941, -19.419901803665322],
      [-2.8855396955578883, -20.415848820318168],
      [-2.7955978253288354, -21.411795836971013],
      [-2.7056559550997825, -22.40774285362386],
      [-2.6157140848707296, -23.403689870276704],
      [-2.525772214641677, -24.39963688692955],
      [-2.1148412662866427, -25.304640954515364],
      [-1.396142700276977, -25.991204118309117],
      [-0.4733002234533983, -26.360336031902296],
      [0.5206284918841845, -26.358814358408782],
      [1.4423363867130206, -25.98685849641299],
      [2.158929375524062, -25.298097946548456],
      [2.5670873387170268, -24.39183987969056],
      [2.6539792675733898, -23.39562213607242],
      [2.7408711964297527, -22.399404392454276],
      [2.8277631252861157, -21.403186648836133],
      [2.9146550541424787, -20.40696890521799],
      [3.0015469829988417, -19.410751161599848],
      [3.0884389118552047, -18.414533417981705],
      [3.1753308407115677, -17.418315674363562],
      [3.2622227695679307, -16.42209793074542],
      [3.3491146984242937, -15.425880187127278],
      [3.4360066272806566, -14.429662443509137],
      [3.5228985561370196, -13.433444699890996],
      [3.6097904849933826, -12.437226956272855],
      [3.6966824138497456, -11.441009212654714],
      [3.7835743427061086, -10.444791469036574],
      [3.8704662715624716, -9.448573725418433],
      [3.9573582004188346, -8.452355981800292],
      [4.044250129275198, -7.45613823818215],
      [4.1311420581315605, -6.459920494564009],
      [4.2180339869879235, -5.463702750945868],
      [4.3049259158442865, -4.467485007327727],
      [4.3918178447006495, -3.4712672637095854],
    ],
  );
});

it('negative total stretch - length zero', () => {

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

  let s = '';
  coords.forEach(vbc => {
    s += '[';
    s += vbc.xCenter + ', ';
    s += vbc.yCenter + '],\n';
  });
  console.log(s);
  */
});

it('negative total stretch - length one', () => {});

it('negative total stretch - length four', () => {});

it('negative total stretch - length 50', () => {});

it('as compressed as possible - length zero', () => {});

it('as compressed as possible - length one', () => {});

it('as compressed as possible - length four', () => {});

it('as compressed as possible - length 50', () => {});

it('positive total stretch - length zero', () => {});

it('positive total stretch - length one', () => {});

it('positive total stretch - length four', () => {});

it('positive total stretch - length 50', () => {});

it('very large positive stretch - length zero', () => {});

it('very large positive stretch - length one', () => {});

it('very large positive stretch - length four', () => {});

it('very large positive stretch - length 50', () => {});

it('less than a semicircle but first pair needs to be a circle pair', () => {});

it('more than a semicircle and should start with circle pairs', () => {});

it('more than a semicircle but first pair should not be a circle pair', () => {});

it('distance between bounding stems is zero - length zero', () => {});

it('distance between bounding stems is zero - length one', () => {});

it('distance between bounding stems is zero - length four', () => {});

it('bounding stems have same angle - length zero', () => {});

it('bounding stems have same angle - length one', () => {});

it('bounding stems have same angle - length four', () => {});

it('bounding stems completely overlap - length zero', () => {});

it('bounding stems completely overlap - length one', () => {});

it('bounding stems completely overlap - length four', () => {});

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
