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
      [-0.4828261861873454, -4.764349867737609],
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
      [-2.0492196337696487, -5.14556394757073],
      [-1.2930410621410937, -5.791356928122859],
      [-0.3556521376943236, -6.123255422010872],
      [0.6384172900474787, -6.097167517731506],
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
      [-5.02450362384023, -3.3558518220795284],
      [-5.2512383442685735, -4.329808374782102],
      [-5.477973064696917, -5.303764927484676],
      [-5.70470778512526, -6.27772148018725],
      [-5.931442505553603, -7.251678032889823],
      [-6.158177225981946, -8.225634585592397],
      [-6.3849119464102895, -9.19959113829497],
      [-6.611646666838633, -10.173547690997543],
      [-6.838381387266976, -11.147504243700116],
      [-7.065116107695319, -12.121460796402689],
      [-7.291850828123662, -13.095417349105261],
      [-7.5185855485520054, -14.069373901807834],
      [-7.745320268980349, -15.043330454510407],
      [-7.972054989408692, -16.017287007212982],
      [-8.198789709837035, -16.991243559915556],
      [-8.425524430265378, -17.96520011261813],
      [-8.652259150693721, -18.939156665320706],
      [-8.878993871122065, -19.91311321802328],
      [-8.856496203681049, -20.911756700598783],
      [-8.672494008913647, -21.893560215896823],
      [-8.33184964905964, -22.832579049802973],
      [-7.843564844313949, -23.703999097647454],
      [-7.2205427972707374, -24.484792590979012],
      [-6.479247218484773, -25.1543266193922],
      [-5.639267263592819, -25.694908366874046],
      [-4.722799878778053, -26.09225265449071],
      [-3.754063233891906, -26.335859434333848],
      [-2.7586567435953806, -26.419291259235177],
      [-1.7628845883237578, -26.34034339595491],
      [-0.7930606114164469, -26.10110208650669],
      [0.1251870391008829, -25.707889418030433],
      [0.9675931488470333, -25.17109625805802],
      [1.7118966591223215, -24.50490766995198],
      [2.2678211796211794, -23.673674894185698],
      [2.8237457001200372, -22.842442118419417],
      [3.379670220618895, -22.011209342653135],
      [3.935594741117753, -21.179976566886854],
      [4.491519261616611, -20.348743791120572],
      [5.047443782115469, -19.51751101535429],
      [5.603368302614326, -18.68627823958801],
      [6.159292823113184, -17.855045463821728],
      [6.715217343612041, -17.023812688055447],
      [7.2711418641108985, -16.192579912289165],
      [7.827066384609756, -15.361347136522884],
      [8.382990905108613, -14.530114360756604],
      [8.93891542560747, -13.698881584990325],
      [9.494839946106328, -12.867648809224045],
      [10.050764466605186, -12.036416033457765],
      [10.606688987104043, -11.205183257691486],
      [11.1626135076029, -10.373950481925206],
    ],
  );
});

it('negative total stretch - length zero', () => {});

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
