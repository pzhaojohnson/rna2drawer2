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
/*
it('length zero - stems are normal distance apart', () => {
  let partners = [3, null, 1, 6, null, 4];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 0;
  bs5.xBottomCenter = 0;
  bs5.yBottomCenter = 0;
  bs3.angle = Math.PI / 6;
  bs3.xBottomCenter = -0.5;
  bs3.yBottomCenter = 0.5;

  let coords = baseCoordinatesTriangularRound(ur);
  expect(coords.length).toBe(0);
});

it('length one - stems are normal distance apart', () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = (Math.PI / 2) - (Math.PI / 6);
  bs5.xBottomCenter = 4;
  bs5.yBottomCenter = 4;
  bs3.angle = (Math.PI / 2) + (Math.PI / 6);
  bs3.xBottomCenter = 2;
  bs3.yBottomCenter = 4;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [3, 4.713394991279214],
    ],
  )
});

it('length one - stems are very far apart', () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = Math.PI - (Math.PI / 16);
  bs5.xBottomCenter = -40;
  bs5.yBottomCenter = 400;
  bs3.angle = Math.PI + (Math.PI / 16);
  bs3.xBottomCenter = -40;
  bs3.yBottomCenter = -400;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [-40.76158286826103, -0.49999999998218514],
    ],
  )
});
*/
it('length one - stems are close together', () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = -Math.PI / 8;
  bs5.xBottomCenter = 4.195518130045147;
  bs5.yBottomCenter = -1.3307337294603592;
  bs3.angle = Math.PI / 8;
  bs3.xBottomCenter = 4.195518130045147;
  bs3.yBottomCenter = 1.730733729460359;

  let coords = baseCoordinatesTriangularRound(ur);
  let xs = '';
  let ys = '';
  xs += ur.baseCoordinatesBounding5().xCenter + '\n';
  ys += ur.baseCoordinatesBounding5().yCenter + '\n';
  coords.forEach(vbc => {
    xs += vbc.xCenter + '\n';
    ys += vbc.yCenter + '\n';
  });
  xs += ur.baseCoordinatesBounding3().xCenter + '\n';
  ys += ur.baseCoordinatesBounding3().yCenter + '\n';
  console.log(xs);
  console.log(ys);

  let s = '';
  coords.forEach(vbc => {
    s += '[';
    s += vbc.xCenter + ', ';
    s += vbc.yCenter + '],\n';
  });
  console.log(s);

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [1.5197341908259738, 0.6779675679464053],
    ],
  )
});
/*
it('length one - stems are completely overlapping', () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = Math.PI;
  bs5.xBottomCenter = 1;
  bs5.yBottomCenter = 1;
  bs3.angle = Math.PI;
  bs3.xBottomCenter = 1;
  bs3.yBottomCenter = 1;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [1.0004545454232812, 0.39999986225818407],
    ],
  )
});

it('length four - stems are normal distance apart', () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 2 * Math.PI / 3;
  bs5.xBottomCenter = 2;
  bs5.yBottomCenter = 6.5;
  bs3.angle = 4 * Math.PI / 3;
  bs3.xBottomCenter = 3;
  bs3.yBottomCenter = 1.2;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [0.5654886868400664, 4.5802636529287675],
      [0.43057584701508844, 3.5951487254288743],
      [0.66087851392746, 2.627877524396915],
      [1.225251638696062, 1.8092592551335884],
    ],
  )
});

it('length four - stems are very far apart', () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 2.5 * Math.PI / 3;
  bs5.xBottomCenter = 2;
  bs5.yBottomCenter = 66.5;
  bs3.angle = 3.5* Math.PI / 3;
  bs3.xBottomCenter = 3;
  bs3.yBottomCenter = 1.2;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [1.5513247251292341, 52.367058735676515],
      [1.7019897424465853, 39.687235682891746],
      [1.901992770711331, 27.008094884475632],
      [2.1513307816499037, 14.32982831709046],
    ],
  );
});

it('length four - stems are close together', () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = -Math.PI / 3;
  bs5.xBottomCenter = 0;
  bs5.yBottomCenter = -1;
  bs3.angle = Math.PI / 3;
  bs3.xBottomCenter = 0;
  bs3.yBottomCenter = 2;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [1.4910422004392565, -0.14828424941521945],
      [2.489816882908524, -0.09879552687751392],
      [2.489816882908524, 0.09879552687751397],
      [1.4910422004392565, 0.14828424941521945],
    ],
  );
});

it('length four - stems are completely overlapping', () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = Math.PI / 3;
  bs5.xBottomCenter = 0;
  bs5.yBottomCenter = 2;
  bs3.angle = Math.PI / 3;
  bs3.xBottomCenter = 0;
  bs3.yBottomCenter = 2;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [-1.818880501372064, 2.5496062832457937],
      [-2.6855868880929847, 3.0484248578264896],
      [0.7785128184498262, 1.0484259597543542],
      [-0.0868299323770998, 1.5496064209866063],
    ],
  );
});

it('length 50 - stems are normal distance apart', () => {
  let partners = [3, null, 1];
  for (let i = 0; i < 50; i++) { partners.push(null) }
  partners = partners.concat([56, null, 54]);
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = -Math.PI / 3;
  bs5.xBottomCenter = 0;
  bs5.yBottomCenter = 0;
  bs3.angle = Math.PI / 3;
  bs3.xBottomCenter = 0;
  bs3.yBottomCenter = 50;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [1.4235658460202316, 0.9321481918165091],
      [1.8771113830664845, 1.8233633092580597],
      [2.313090069154782, 2.7233024877627265],
      [2.731334176383868, 3.63161950648421],
      [3.131682799625672, 4.547964921488468],
      [3.5139819184280796, 5.471986200190333],
      [3.878084456269022, 6.40332785697839],
      [4.223850337139133, 7.3416315899758935],
      [4.551146539431215, 8.286536418885191],
      [4.8598471471157865, 9.23767882386255],
      [5.149833398182913, 10.19469288536999],
      [5.4209937303318725, 11.157210424950334],
      [5.673223823890943, 12.124861146871273],
      [5.906426641950809, 13.097272780584012],
      [6.120512467696187, 14.074071223941623],
      [6.315398938921362, 15.05488068712208],
      [6.491011079716152, 16.03932383720054],
      [6.647281329310395, 17.027021943315304],
      [6.784149568065608, 18.017595022371555],
      [6.901563140603983, 19.01066198522689],
      [6.999476876065721, 20.00584078330232],
      [7.077853105487009, 21.002748555562444],
      [7.136661676291837, 22.001001775808103],
      [7.175879963892179, 23.000216400225018],
      [7.1954928803920595, 24.000008015131495],
      [7.195492880392067, 24.99999198486848],
      [7.175879963892179, 25.999783599774958],
      [7.136661676291837, 26.99899822419187],
      [7.077853105487009, 27.99725144443753],
      [6.999476876065728, 28.994159216697653],
      [6.90156314060399, 29.989338014773086],
      [6.784149568065615, 30.982404977628416],
      [6.6472813293104025, 31.972978056684667],
      [6.491011079716159, 32.96067616279943],
      [6.315398938921362, 33.94511931287789],
      [6.120512467696194, 34.92592877605835],
      [5.906426641950809, 35.902727219415965],
      [5.67322382389095, 36.8751388531287],
      [5.42099373033188, 37.84278957504964],
      [5.1498333981829205, 38.80530711462999],
      [4.859847147115794, 39.76232117613743],
      [4.55114653943123, 40.71346358111479],
      [4.223850337139147, 41.65836841002408],
      [3.878084456269036, 42.59667214302159],
      [3.513981918428101, 43.52801379980964],
      [3.131682799625686, 44.452035078511514],
      [2.731334176383882, 45.36838049351577],
      [2.3130900691547964, 46.27669751223725],
      [1.8771113830665058, 47.176636690741915],
      [1.423565846020253, 48.06785180818348],
    ],
  );
});

it('length 50 - stems are very far apart', () => {
  let partners = [3, null, 1];
  for (let i = 0; i < 50; i++) { partners.push(null) }
  partners = partners.concat([56, null, 54]);
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = -Math.PI / 3;
  bs5.xBottomCenter = 0;
  bs5.yBottomCenter = 0;
  bs3.angle = Math.PI / 3;
  bs3.xBottomCenter = 0;
  bs3.yBottomCenter = 5000;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [1.0581431309692562, 98.06760995398736],
      [1.1594377113506198, 196.08522436055455],
      [1.2565116863697767, 294.10284303796425],
      [1.349365054629743, 392.1204658044776],
      [1.437997816130519, 490.13809247835775],
      [1.5224099713377655, 588.1557228778661],
      [1.6026015197858214, 686.1733568212651],
      [1.6785724610090256, 784.1909941268166],
      [1.7503227954730392, 882.2086346127826],
      [1.8178525227122009, 980.2262780974252],
      [1.8811616422608495, 1078.2439243990068],
      [1.9402501545846462, 1176.2615733357889],
      [1.9951180596835911, 1274.2792247260338],
      [2.0457653566263616, 1372.2968783880037],
      [2.092192045878619, 1470.3145341399604],
      [2.134398127440363, 1568.332191800166],
      [2.172383600845933, 1666.3498511868825],
      [2.2061484665609896, 1764.367512118372],
      [2.235692724119872, 1862.385174412896],
      [2.2610163735225797, 1960.4028378887174],
      [2.282119414769113, 2058.4205023640975],
      [2.299001847859472, 2156.438167657299],
      [2.3116636723279953, 2254.4558335865827],
      [2.3201048891060054, 2352.473499970212],
      [2.32432549726218, 2450.491166626448],
      [2.32432549726218, 2548.5088333735534],
      [2.3201048891060054, 2646.5265000297895],
      [2.3116636723279953, 2744.5441664134187],
      [2.299001847859472, 2842.5618323427025],
      [2.282119414769113, 2940.579497635904],
      [2.2610163735225797, 3038.597162111284],
      [2.235692724119872, 3136.6148255871053],
      [2.2061484665609896, 3234.6324878816295],
      [2.172383600845933, 3332.650148813119],
      [2.134398127440363, 3430.6678081998352],
      [2.092192045878619, 3528.685465860041],
      [2.0457653566263616, 3626.7031216119976],
      [1.9951180596835911, 3724.720775273968],
      [1.9402501545846462, 3822.7384266642125],
      [1.8811616422608495, 3920.7560756009943],
      [1.8178525227122009, 4018.773721902576],
      [1.7503227954730392, 4116.791365387218],
      [1.6785724610090256, 4214.809005873185],
      [1.6026015197858214, 4312.826643178736],
      [1.5224099713377655, 4410.844277122135],
      [1.437997816130519, 4508.861907521644],
      [1.349365054629743, 4606.879534195524],
      [1.2565116863697767, 4704.897156962037],
      [1.1594377113506198, 4802.914775639447],
      [1.0581431309692562, 4900.932390046013],
    ],
  );
});

it('length 50 - stems are close together (first pair is a circle pair)', () => {
  let partners = [3, null, 1];
  for (let i = 0; i < 50; i++) { partners.push(null) }
  partners = partners.concat([56, null, 54]);
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = Math.PI / 3;
  bs5.xBottomCenter = 6;
  bs5.yBottomCenter = 0;
  bs3.angle = 2 * Math.PI / 3;
  bs3.xBottomCenter = -6;
  bs3.yBottomCenter = 0;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [4.158017249319017, 0.5063228367221075],
      [4.072850317112002, 1.5026895331037387],
      [3.9876833849049875, 2.4990562294853698],
      [3.9025164526979728, 3.495422925867001],
      [3.817349520490958, 4.491789622248632],
      [3.7321825882839432, 5.4881563186302635],
      [3.6470156560769285, 6.484523015011895],
      [3.5618487238699137, 7.480889711393527],
      [3.476681791662899, 8.477256407775158],
      [3.391514859455884, 9.47362310415679],
      [3.3063479272488694, 10.469989800538421],
      [3.2211809950418546, 11.466356496920053],
      [3.13601406283484, 12.462723193301684],
      [3.050847130627825, 13.459089889683316],
      [2.9656801984208103, 14.455456586064948],
      [2.8805132662137956, 15.451823282446579],
      [2.795346334006781, 16.44818997882821],
      [2.710179401799766, 17.444556675209842],
      [2.6250124695927513, 18.440923371591474],
      [2.5398455373857365, 19.437290067973105],
      [2.4546786051787217, 20.433656764354737],
      [2.369511672971707, 21.43002346073637],
      [2.065555747731289, 22.37501353488765],
      [1.4027865194385416, 23.114021244428923],
      [0.49633543212559167, 23.518671551536645],
      [-0.4963354321255975, 23.518671551536645],
      [-1.4027865194385474, 23.114021244428923],
      [-2.065555747731295, 22.37501353488765],
      [-2.369511672971713, 21.43002346073637],
      [-2.454678605178728, 20.433656764354737],
      [-2.5398455373857427, 19.437290067973105],
      [-2.6250124695927575, 18.440923371591474],
      [-2.7101794017997722, 17.444556675209842],
      [-2.795346334006787, 16.44818997882821],
      [-2.8805132662138018, 15.45182328244658],
      [-2.9656801984208165, 14.45545658606495],
      [-3.0508471306278313, 13.459089889683318],
      [-3.136014062834846, 12.462723193301686],
      [-3.221180995041861, 11.466356496920055],
      [-3.3063479272488756, 10.469989800538423],
      [-3.3915148594558904, 9.473623104156792],
      [-3.476681791662905, 8.47725640777516],
      [-3.56184872386992, 7.480889711393528],
      [-3.6470156560769347, 6.484523015011897],
      [-3.7321825882839494, 5.488156318630265],
      [-3.817349520490964, 4.491789622248634],
      [-3.902516452697979, 3.4954229258670027],
      [-3.9876833849049937, 2.4990562294853715],
      [-4.0728503171120085, 1.5026895331037404],
      [-4.158017249319023, 0.5063228367221093],
    ],
  );
});

it('length 50 - stems are completely overlapping', () => {
  let partners = [3, null, 1];
  for (let i = 0; i < 50; i++) { partners.push(null) }
  partners = partners.concat([56, null, 54]);
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 2 * Math.PI / 3;
  bs5.xBottomCenter = -6;
  bs5.yBottomCenter = 0;
  bs3.angle = 2 * Math.PI / 3;
  bs3.xBottomCenter = -6;
  bs3.yBottomCenter = 0;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [-7.8184259559488964, -1.5503935790134165],
      [-8.683768706775936, -2.0515740402456686],
      [-9.54865548148473, -2.553540969498272],
      [-10.413085565293272, -3.0562939519224983],
      [-11.277058243796432, -3.5598325720200137],
      [-12.140572802967199, -4.064156413643218],
      [-13.003628529157368, -4.569265059995814],
      [-13.866224709097537, -5.07515809363224],
      [-14.728360629898702, -5.581835096459599],
      [-15.590035579051687, -6.0892956497363],
      [-16.451248844428505, -6.597539334073417],
      [-17.311999714282592, -7.106565729435147],
      [-18.172287477249938, -7.616374415138353],
      [-19.03211142234875, -8.126964969853589],
      [-19.891470838980695, -8.638336971605213],
      [-20.750365016931596, -9.150489997771956],
      [-21.608793246371533, -9.66342362508658],
      [-22.466754817855872, -10.177137429637241],
      [-23.324249022325148, -10.69163098686704],
      [-24.181275151107002, -11.206903871574582],
      [-25.037832495915154, -11.722955657914895],
      [-25.893920348850997, -12.239785919398514],
      [-26.749538002403938, -12.757394228893304],
      [-27.60468474945219, -13.275780158623775],
      [-28.459359883262778, -13.794943280171765],
      [14.838182675785902, 11.202904571544991],
      [13.961236656912888, 10.722315754456531],
      [13.084727899278732, 10.2409299124148],
      [12.208657127270726, 9.75874744325938],
      [11.333025064914182, 9.27576874548788],
      [10.457832435872092, 8.791994218256491],
      [9.583079963443879, 8.307424261378742],
      [8.708768370565622, 7.822059275325614],
      [7.834898379808806, 7.3358996612251985],
      [6.9614707133798674, 6.848945820862355],
      [6.088486093119855, 6.361198156678029],
      [5.215945240503629, 5.872657071769595],
      [4.343848876639413, 5.383322969890173],
      [3.4721977222676514, 4.8931962554477195],
      [2.6009924977613537, 4.402277333505708],
      [1.7302339231248425, 3.9105666097822223],
      [0.8599227179930722, 3.4180644906499538],
      [-0.009940398368371461, 2.924771383135294],
      [-0.8793547070645218, 2.4306876949183334],
      [-1.748319489571145, 1.9358138343327482],
      [-2.616834027735649, 1.4401502103651183],
      [-3.4848976037774264, 0.9436972326550404],
      [-4.352509500288534, 0.44645531149387807],
      [-5.219669000234489, -0.0515751421743289],
      [-6.086375386954614, -0.55039371675457],
    ],
  );
});

it('angle span is greater than Math.PI and first pairs are circle pairs', () => {
  let partners = [3, null, 1];
  for (let i = 0; i < 50; i++) { partners.push(null) }
  partners = partners.concat([56, null, 54]);
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 2 * Math.PI / 3;
  bs5.xBottomCenter = 1.0622998405985764;
  bs5.yBottomCenter = 3.3179618662659234;
  bs3.angle = Math.PI / 3;
  bs3.xBottomCenter = 2.937700159401424;
  bs3.yBottomCenter = 3.3179618662659234;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [-0.6805490937609044, 1.659904176749397],
      [-1.2843228755425424, 0.866405224285965],
      [-1.6596535994807056, -0.05734269305702899],
      [-1.5780558636215725, -1.054008037845671],
      [-1.4964581277624394, -2.0506733826343133],
      [-1.4148603919033063, -3.0473387274229555],
      [-1.3332626560441732, -4.044004072211598],
      [-1.25166492018504, -5.04066941700024],
      [-1.170067184325907, -6.037334761788882],
      [-1.0884694484667738, -7.034000106577524],
      [-1.0068717126076407, -8.030665451366167],
      [-0.9252739767485076, -9.027330796154809],
      [-0.8436762408893745, -10.023996140943451],
      [-0.7620785050302414, -11.020661485732093],
      [-0.6804807691711083, -12.017326830520735],
      [-0.5988830333119752, -13.013992175309378],
      [-0.5172852974528421, -14.01065752009802],
      [-0.4356875615937089, -15.007322864886662],
      [-0.3540898257345757, -16.003988209675306],
      [-0.2724920898754425, -17.00065355446395],
      [-0.19089435401630928, -17.99731889925259],
      [-0.10929661815717606, -18.993984244041233],
      [-0.02769888229804285, -19.990649588829875],
      [0.6060318229075476, -20.75382413247033],
      [1.5040035305616575, -21.175365118655485],
      [2.495996469438337, -21.175365118655485],
      [3.3939681770924466, -20.75382413247033],
      [4.027698882298037, -19.990649588829875],
      [4.10929661815717, -18.993984244041233],
      [4.190894354016304, -17.99731889925259],
      [4.272492089875438, -17.00065355446395],
      [4.3540898257345715, -16.003988209675306],
      [4.435687561593705, -15.007322864886664],
      [4.517285297452839, -14.010657520098022],
      [4.598883033311972, -13.01399217530938],
      [4.680480769171105, -12.017326830520737],
      [4.762078505030238, -11.020661485732095],
      [4.843676240889371, -10.023996140943453],
      [4.925273976748504, -9.02733079615481],
      [5.006871712607637, -8.030665451366168],
      [5.08846944846677, -7.034000106577526],
      [5.170067184325903, -6.037334761788884],
      [5.2516649201850365, -5.040669417000242],
      [5.33326265604417, -4.0440040722115995],
      [5.414860391903303, -3.0473387274229573],
      [5.496458127762436, -2.050673382634315],
      [5.578055863621569, -1.0540080378456727],
      [5.659653599480702, -0.057342693057030436],
      [5.28432287554254, 0.8664052242859621],
      [4.680549093760902, 1.6599041767493956],
    ],
  );
});

it('angle span is greater than Math.PI but first pairs are not circle pairs', () => {
  let partners = [3, null, 1];
  for (let i = 0; i < 50; i++) { partners.push(null) }
  partners = partners.concat([56, null, 54]);
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 5 * Math.PI / 9;
  bs5.xBottomCenter = 1.0622998405985764;
  bs5.yBottomCenter = 3.3179618662659234;
  bs3.angle = 4 * Math.PI / 9;
  bs3.xBottomCenter = 2.937700159401424;
  bs3.yBottomCenter = 3.3179618662659234;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [-0.9780707290746347, 2.3415170177620093],
      [-1.8964439672160625, 1.9490020854267218],
      [-2.7641714361667855, 1.454505961813081],
      [-3.5699744609393873, 0.8644560809488668],
      [-4.3033792571424625, 0.18652187946108878],
      [-4.954853068667014, -0.5704848903489435],
      [-5.51592807393781, -1.3967246951882668],
      [-5.979311450202953, -2.281458114496966],
      [-6.338980165251895, -3.2131854308592103],
      [-6.590259264464281, -4.179796102711926],
      [-6.729882635618756, -5.168726176512903],
      [-6.756035461644004, -6.167121592333428],
      [-6.668377809513478, -7.162005260238129],
      [-6.4680490486765905, -8.14044573580223],
      [-6.157653041595879, -9.089725302330919],
      [-5.741224298882706, -9.997505275057168],
      [-5.224175538945262, -10.851986378702941],
      [-4.613227333765708, -11.642062113824853],
      [-3.916320755266889, -12.357463118496788],
      [-3.1425141576864384, -12.988890648924084],
      [-2.3018654375754277, -13.52813744401541],
      [-1.4053013017997649, -13.968194402921167],
      [-0.46447524279183217, -14.303341688949487],
      [0.5083839329175885, -14.529223075696013],
      [1.5006310540691135, -14.64290256904049],
      [2.49936894593091, -14.642902569040487],
      [3.491616067082435, -14.52922307569601],
      [4.464475242791855, -14.30334168894948],
      [5.405301301799787, -13.96819440292116],
      [6.301865437575449, -13.5281374440154],
      [7.142514157686458, -12.988890648924071],
      [7.9163207552669075, -12.357463118496774],
      [8.613227333765725, -11.642062113824837],
      [9.224175538945278, -10.851986378702925],
      [9.74122429888272, -9.99750527505715],
      [10.15765304159589, -9.0897253023309],
      [10.468049048676601, -8.14044573580221],
      [10.668377809513485, -7.162005260238108],
      [10.756035461644009, -6.167121592333408],
      [10.729882635618758, -5.168726176512883],
      [10.590259264464281, -4.179796102711906],
      [10.338980165251892, -3.213185430859191],
      [9.979311450202948, -2.281458114496948],
      [9.515928073937804, -1.396724695188249],
      [8.954853068667004, -0.5704848903489284],
      [8.303379257142453, 0.186521879461103],
      [7.569974460939375, 0.8644560809488793],
      [6.764171436166772, 1.4545059618130916],
      [5.896443967216048, 1.9490020854267316],
      [4.97807072907462, 2.3415170177620164],
    ],
  );
});
*/
it('very large positive stretch - length zero', () => {

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
  xs += ur.baseCoordinatesBounding3().xCenter + '\n';
  ys += ur.baseCoordinatesBounding3().yCenter + '\n';
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
