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

it('length zero', () => {
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

it('length one - positive total stretch', () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = Math.PI / 6;
  bs5.xBottomCenter = -2.303847577293368;
  bs5.yBottomCenter = -6.800000000000001;
  bs3.angle = bs5.angle + (Math.PI / 3);
  bs3.xBottomCenter = -7.5;
  bs3.yBottomCenter = -3.8000000000000007;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [-4.607330157406533, -5.289748863105842],
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

it('length one - polar length from stems is close to 2', () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0;
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 0;
  bs5.xBottomCenter = 6;
  bs5.yBottomCenter = 2;
  bs3.angle = 0.55;
  bs3.xBottomCenter = 5.262622610297528;
  bs3.yBottomCenter = 4.613436144653296;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [5.8787128865313, 2.876522085966446],
    ],
  );
});

it('length one - polar length from stems is less than 2', () => {
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

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [4.718803604117624, -0.30000000000000004],
    ],
  )
});

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
      [1, -0.6000000000001346],
    ],
  )
});

it('length one - angle span is greater than Math.PI', () => {
  let partners = [3, null, 1, null, 7, null, 5];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 4 * Math.PI / 5;
  bs5.xBottomCenter = -2.6541019662496836;
  bs5.yBottomCenter = 1.326711513754839;
  bs3.angle = bs5.angle - (Math.PI / 5);
  bs3.xBottomCenter = 0.34589803375031614;
  bs3.yBottomCenter = 3.5063390977709217;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [-0.9268883345555778, 1.603792571014509],
    ],
  );
});

it('length four - positive total stretch', () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = Math.PI / 6;
  bs5.xBottomCenter = 6.260254037844387;
  bs5.yBottomCenter = 8.5;
  bs3.angle = bs5.angle + (2 * Math.PI / 3);
  bs3.xBottomCenter = -11.060254037844386;
  bs3.yBottomCenter = 8.500000000000004;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [2.4663444214283663, 9.00254247937255],
      [-0.7778531925020469, 9.027500485503367],
      [-4.022146807497737, 9.027500485503367],
      [-7.26634442142815, 9.00254247937255],
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

  bs5.angle = Math.PI / 6;
  bs5.xBottomCenter = 863.6254037844387;
  bs5.yBottomCenter = 503.49999999999994;
  bs3.angle = bs5.angle + (2 * Math.PI / 3);
  bs3.xBottomCenter = -868.4254037844385;
  bs3.yBottomCenter = 503.50000000000034;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [516.8854342709109, 504.4682579472428],
      [170.69517675707255, 504.72607302031247],
      [-175.49517675687144, 504.72607302031247],
      [-521.6854342707097, 504.4682579472428],
    ],
  );
});

it('length four - negative total stretch', () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = -Math.PI / 8;
  bs5.xBottomCenter = 0;
  bs5.yBottomCenter = -3;
  bs3.angle = Math.PI / 8;
  bs3.xBottomCenter = 0;
  bs3.yBottomCenter = 3;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [0.7124288987760208, -1.5287750720989477],
      [1.5027449396836436, -0.9808407820494986],
      [1.5027449396836436, -0.019159217950501573],
      [0.7124288987760208, 0.5287750720989479],
    ],
  )
});

it('length four - polar length from stems is close to 3', () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0;
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 0;
  bs5.xBottomCenter = 6;
  bs5.yBottomCenter = 2;
  bs3.angle = 0.7;
  bs3.xBottomCenter = 4.824210936422443;
  bs3.yBottomCenter = 5.221088436188455;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [5.901624245370314, 2.839391554181258],
      [6.752504636467542, 3.1225159945375904],
      [6.445011730027164, 3.964896550563017],
      [5.611828738416058, 3.6332898691302913],
    ],
  )
});

it('length four - polar length from stems is less than 3', () => {
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
      [1.4349555848086113, -0.37518430145296344],
      [2.322619980449454, -0.4452111402001724],
      [2.3226199804494536, 0.4452111402001724],
      [1.4349555848086113, 0.37518430145296344],
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
      [-0.9526279441631686, 2.050000000000068],
      [-0.9526279441631686, 2.050000000000068],
      [-0.9526279441631686, 2.050000000000068],
      [-0.9526279441631686, 2.050000000000068],
    ],
  );
});

it('length four - angle span is greater than Math.PI', () => {
  let partners = [3, null, 1, null, null, null, null, 10, null, 8];
  let gps = new StrictLayoutGeneralProps();
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 4 * Math.PI / 5;
  bs5.xBottomCenter = -2.6541019662496836;
  bs5.yBottomCenter = 1.326711513754839;
  bs3.angle = bs5.angle - (Math.PI / 5);
  bs3.xBottomCenter = 0.34589803375031614;
  bs3.yBottomCenter = 3.5063390977709217;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [-2.3447311881114885, 0.5944247606851718],
      [-1.3973352627673066, 1.2642990808610648],
      [-0.4586347427364217, 1.946304929724235],
      [0.4712150358985667, 2.640329449004568],
    ],
  );
});

it('length 50 - positive total stretch', () => {
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

it('length 50 - negative total stretch (first pair is a circle pair)', () => {
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
      [4.158017249319018, 0.5063228367221075],
      [4.083153753458458, 1.503516627811651],
      [4.008290257597897, 2.5007104189011944],
      [3.933426761737337, 3.497904209990738],
      [3.858563265876777, 4.495098001080281],
      [3.7836997700162165, 5.492291792169825],
      [3.708836274155656, 6.489485583259368],
      [3.633972778295096, 7.4866793743489115],
      [3.5591092824345356, 8.483873165438455],
      [3.4842457865739753, 9.481066956527998],
      [3.409382290713415, 10.478260747617542],
      [3.3345187948528547, 11.475454538707085],
      [3.2596552989922944, 12.472648329796629],
      [3.184791803131734, 13.469842120886172],
      [3.109928307271174, 14.467035911975715],
      [3.0350648114106136, 15.464229703065259],
      [2.9602013155500533, 16.4614234941548],
      [2.885337819689493, 17.458617285244344],
      [2.8104743238289327, 18.455811076333887],
      [2.7356108279683724, 19.45300486742343],
      [2.660747332107812, 20.450198658512974],
      [2.585883836247252, 21.447392449602518],
      [2.1526036396059607, 22.342216513966733],
      [1.4228388053483145, 23.017409169175394],
      [0.49710206068945634, 23.379974079991694],
      [-0.4971020606894542, 23.379974079991694],
      [-1.4228388053483132, 23.017409169175394],
      [-2.152603639605959, 22.342216513966733],
      [-2.58588383624725, 21.447392449602518],
      [-2.6607473321078103, 20.450198658512974],
      [-2.7356108279683706, 19.45300486742343],
      [-2.810474323828931, 18.455811076333887],
      [-2.885337819689491, 17.458617285244344],
      [-2.9602013155500515, 16.4614234941548],
      [-3.035064811410612, 15.464229703065259],
      [-3.109928307271172, 14.467035911975715],
      [-3.1847918031317324, 13.469842120886172],
      [-3.2596552989922927, 12.472648329796629],
      [-3.334518794852853, 11.475454538707085],
      [-3.4093822907134133, 10.478260747617542],
      [-3.4842457865739735, 9.481066956527998],
      [-3.559109282434534, 8.483873165438455],
      [-3.633972778295094, 7.4866793743489115],
      [-3.7088362741556544, 6.489485583259368],
      [-3.7836997700162147, 5.492291792169825],
      [-3.858563265876775, 4.495098001080281],
      [-3.9334267617373353, 3.497904209990738],
      [-4.008290257597896, 2.5007104189011944],
      [-4.083153753458456, 1.503516627811651],
      [-4.158017249319016, 0.5063228367221075],
    ],
  );
});

it('length 50 - polar length from stems is close to 3', () => {
  let partners = [3, null, 1];
  for (let i = 0; i < 50; i++) { partners.push(null) }
  partners = partners.concat([56, null, 54]);
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0;
  let bps = zeroStretch3(partners.length);

  let st = new Stem(0, partners, gps, bps);
  let it = st.loopIterator();
  it.next();
  let bs5 = it.next().value;
  let ur = it.next().value;
  let bs3 = it.next().value;

  bs5.angle = 0;
  bs5.xBottomCenter = 6;
  bs5.yBottomCenter = 2;
  bs3.angle = 0.7;
  bs3.xBottomCenter = 4.824210936422443;
  bs3.yBottomCenter = 5.221088436188455;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [5.901624245370314, 2.839391554181258],
      [6.840996958217693, 3.18228936163671],
      [7.780369671065072, 3.5251871690921615],
      [8.71974238391245, 3.868084976547613],
      [9.659115096759828, 4.210982784003065],
      [10.598487809607207, 4.553880591458516],
      [11.537860522454585, 4.896778398913968],
      [12.477233235301963, 5.2396762063694196],
      [13.416605948149341, 5.582574013824871],
      [14.355978660996719, 5.925471821280323],
      [15.295351373844097, 6.268369628735774],
      [16.234724086691475, 6.611267436191226],
      [17.174096799538855, 6.954165243646678],
      [18.113469512386235, 7.297063051102129],
      [19.052842225233615, 7.639960858557581],
      [19.992214938080995, 7.9828586660130325],
      [20.931587650928375, 8.325756473468484],
      [21.870960363775755, 8.668654280923935],
      [22.810333076623134, 9.011552088379386],
      [23.749705789470514, 9.354449895834836],
      [24.689078502317894, 9.697347703290287],
      [25.628451215165274, 10.040245510745738],
      [26.567823928012654, 10.383143318201189],
      [27.507196640860034, 10.72604112565664],
      [28.35807703195726, 11.009165566012973],
      [28.050584125516885, 11.8515461220384],
      [27.217401133905778, 11.519939440605672],
      [26.278028421058398, 11.177041633150221],
      [25.338655708211018, 10.83414382569477],
      [24.399282995363638, 10.49124601823932],
      [23.459910282516258, 10.148348210783869],
      [22.52053756966888, 9.805450403328418],
      [21.5811648568215, 9.462552595872967],
      [20.64179214397412, 9.119654788417517],
      [19.70241943112674, 8.776756980962066],
      [18.76304671827936, 8.433859173506615],
      [17.82367400543198, 8.090961366051163],
      [16.8843012925846, 7.748063558595711],
      [15.94492857973722, 7.4051657511402595],
      [15.005555866889843, 7.062267943684808],
      [14.066183154042465, 6.719370136229356],
      [13.126810441195087, 6.376472328773905],
      [12.187437728347708, 6.033574521318453],
      [11.24806501550033, 5.6906767138630014],
      [10.308692302652952, 5.34777890640755],
      [9.369319589805574, 5.004881098952098],
      [8.429946876958194, 4.661983291496647],
      [7.490574164110816, 4.319085484041194],
      [6.551201451263437, 3.976187676585743],
      [5.611828738416058, 3.6332898691302913],
    ],
  );
});

it('length 50 - polar length from stems is less than 3', () => {
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
  bs5.yBottomCenter = -1;
  bs3.angle = Math.PI / 3;
  bs3.xBottomCenter = 0;
  bs3.yBottomCenter = 2;

  checkCoords(
    baseCoordinatesTriangularRound(ur),
    [
      [1.4349555848086113, -0.37518430145296344],
      [2.4349555848086113, -0.37518430145296344],
      [3.4349555848086113, -0.37518430145296344],
      [4.434955584808611, -0.37518430145296344],
      [5.434955584808611, -0.37518430145296344],
      [6.434955584808611, -0.37518430145296344],
      [7.434955584808611, -0.37518430145296344],
      [8.43495558480861, -0.37518430145296344],
      [9.43495558480861, -0.37518430145296344],
      [10.43495558480861, -0.37518430145296344],
      [11.43495558480861, -0.37518430145296344],
      [12.43495558480861, -0.37518430145296344],
      [13.43495558480861, -0.37518430145296344],
      [14.43495558480861, -0.37518430145296344],
      [15.43495558480861, -0.37518430145296344],
      [16.434955584808613, -0.37518430145296344],
      [17.434955584808613, -0.37518430145296344],
      [18.434955584808613, -0.37518430145296344],
      [19.434955584808613, -0.37518430145296344],
      [20.434955584808613, -0.37518430145296344],
      [21.434955584808613, -0.37518430145296344],
      [22.434955584808613, -0.37518430145296344],
      [23.434955584808613, -0.37518430145296344],
      [24.434955584808613, -0.37518430145296344],
      [25.322619980449453, -0.4452111402001714],
      [25.322619980449453, 0.44521114020017144],
      [24.434955584808613, 0.37518430145296344],
      [23.434955584808613, 0.37518430145296344],
      [22.434955584808613, 0.37518430145296344],
      [21.434955584808613, 0.37518430145296344],
      [20.434955584808613, 0.37518430145296344],
      [19.434955584808613, 0.37518430145296344],
      [18.434955584808613, 0.37518430145296344],
      [17.434955584808613, 0.37518430145296344],
      [16.434955584808613, 0.37518430145296344],
      [15.43495558480861, 0.37518430145296344],
      [14.43495558480861, 0.37518430145296344],
      [13.43495558480861, 0.37518430145296344],
      [12.43495558480861, 0.37518430145296344],
      [11.43495558480861, 0.37518430145296344],
      [10.43495558480861, 0.37518430145296344],
      [9.43495558480861, 0.37518430145296344],
      [8.43495558480861, 0.37518430145296344],
      [7.434955584808611, 0.37518430145296344],
      [6.434955584808611, 0.37518430145296344],
      [5.434955584808611, 0.37518430145296344],
      [4.434955584808611, 0.37518430145296344],
      [3.4349555848086113, 0.37518430145296344],
      [2.4349555848086113, 0.37518430145296344],
      [1.4349555848086113, 0.37518430145296344],
    ],
  )
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
      [-6.952627944163282, -1.0500000000002956],
      [-6.952627944163282, -2.0500000000002956],
      [-6.952627944163282, -3.0500000000002956],
      [-6.952627944163282, -4.050000000000296],
      [-6.952627944163282, -5.050000000000296],
      [-6.952627944163282, -6.050000000000296],
      [-6.952627944163282, -7.050000000000296],
      [-6.952627944163282, -8.050000000000296],
      [-6.952627944163282, -9.050000000000296],
      [-6.952627944163282, -10.050000000000296],
      [-6.952627944163282, -11.050000000000296],
      [-6.952627944163282, -12.050000000000296],
      [-6.952627944163282, -13.050000000000296],
      [-6.952627944163282, -14.050000000000296],
      [-6.952627944163282, -15.050000000000296],
      [-6.952627944163282, -16.050000000000296],
      [-6.952627944163282, -17.050000000000296],
      [-6.952627944163282, -18.050000000000296],
      [-6.952627944163282, -19.050000000000296],
      [-6.952627944163282, -20.050000000000296],
      [-6.952627944163282, -21.050000000000296],
      [-6.952627944163282, -22.050000000000296],
      [-6.952627944163282, -23.050000000000296],
      [-6.952627944163282, -24.050000000000296],
      [-6.952627944163282, -24.050000000000296],
      [-6.952627944163282, -24.050000000000296],
      [-6.952627944163282, -24.050000000000296],
      [-6.952627944163282, -23.050000000000296],
      [-6.952627944163282, -22.050000000000296],
      [-6.952627944163282, -21.050000000000296],
      [-6.952627944163282, -20.050000000000296],
      [-6.952627944163282, -19.050000000000296],
      [-6.952627944163282, -18.050000000000296],
      [-6.952627944163282, -17.050000000000296],
      [-6.952627944163282, -16.050000000000296],
      [-6.952627944163282, -15.050000000000296],
      [-6.952627944163282, -14.050000000000296],
      [-6.952627944163282, -13.050000000000296],
      [-6.952627944163282, -12.050000000000296],
      [-6.952627944163282, -11.050000000000296],
      [-6.952627944163282, -10.050000000000296],
      [-6.952627944163282, -9.050000000000296],
      [-6.952627944163282, -8.050000000000296],
      [-6.952627944163282, -7.050000000000296],
      [-6.952627944163282, -6.050000000000296],
      [-6.952627944163282, -5.050000000000296],
      [-6.952627944163282, -4.050000000000296],
      [-6.952627944163282, -3.0500000000002956],
      [-6.952627944163282, -2.0500000000002956],
      [-6.952627944163282, -1.0500000000002956],
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
      [-1.5892644825821747, -1.0548623030007358],
      [-1.5188753656836438, -2.0523819129444427],
      [-1.4484862487851131, -3.0499015228881494],
      [-1.3780971318865824, -4.047421132831857],
      [-1.3077080149880518, -5.044940742775563],
      [-1.2373188980895211, -6.04246035271927],
      [-1.1669297811909904, -7.039979962662977],
      [-1.0965406642924598, -8.037499572606684],
      [-1.026151547393929, -9.035019182550391],
      [-0.9557624304953984, -10.032538792494098],
      [-0.8853733135968678, -11.030058402437804],
      [-0.8149841966983371, -12.027578012381511],
      [-0.7445950797998064, -13.025097622325218],
      [-0.6742059629012758, -14.022617232268924],
      [-0.6038168460027451, -15.020136842212631],
      [-0.5334277291042144, -16.017656452156338],
      [-0.46303861220568376, -17.015176062100046],
      [-0.3926494953071531, -18.012695672043755],
      [-0.3222603784086224, -19.010215281987463],
      [-0.25187126151009176, -20.00773489193117],
      [0.5546604821324099, -20.59198264409695],
      [1.5020444574528224, -20.899069753432194],
      [2.497955542547161, -20.899069753432194],
      [3.445339517867574, -20.591982644096955],
      [4.251871261510077, -20.00773489193117],
      [4.3222603784086076, -19.010215281987463],
      [4.392649495307139, -18.012695672043755],
      [4.46303861220567, -17.015176062100046],
      [4.533427729104201, -16.017656452156338],
      [4.603816846002732, -15.020136842212631],
      [4.674205962901263, -14.022617232268924],
      [4.744595079799795, -13.025097622325218],
      [4.814984196698326, -12.027578012381511],
      [4.885373313596857, -11.030058402437804],
      [4.955762430495389, -10.032538792494098],
      [5.02615154739392, -9.035019182550391],
      [5.096540664292451, -8.037499572606684],
      [5.166929781190983, -7.0399799626629775],
      [5.237318898089514, -6.042460352719271],
      [5.307708014988045, -5.044940742775564],
      [5.378097131886577, -4.0474211328318574],
      [5.448486248785108, -3.0499015228881508],
      [5.518875365683639, -2.052381912944444],
      [5.589264482582171, -1.0548623030007374],
      [5.659653599480702, -0.057342693057030436],
      [5.28432287554254, 0.8664052242859621],
      [4.680549093760904, 1.6599041767493934],
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
      [-0.978804886912283, 2.3414595651810446],
      [-1.8978985401461173, 1.9487982968191986],
      [-2.7663220215787003, 1.4540694094649638],
      [-3.572786384987543, 0.8637040601787653],
      [-4.3068081127991045, 0.18537661846143738],
      [-4.958845395068616, -0.5720950956090203],
      [-5.520422166866952, -1.3988644373620893],
      [-5.984238291668358, -2.284183937576816],
      [-6.344264458425914, -3.21654501266313],
      [-6.5958205587338545, -4.183827568840024],
      [-6.735636525224092, -5.173457555552557],
      [-6.761894840336933, -6.172570420034683],
      [-6.674254162879353, -7.168178338213834],
      [-6.473853765240773, -8.147339048063113],
      [-6.163298723585389, -9.097324090676242],
      [-5.746626053539018, -10.005784272039561],
      [-5.229252231584741, -10.860910194604578],
      [-4.617902784355406, -11.651585771853952],
      [-3.9205248611168706, -12.367532730270394],
      [-3.1461839259434177, -12.999444220275876],
      [-2.304945912520564, -13.539105799284995],
      [-1.4077463734869564, -13.97950221417064],
      [-0.4662483252896914, -14.314908595038663],
      [0.5073093635215877, -14.540964874851209],
      [1.5002710697072241, -14.65473246749145],
      [2.4997289302927745, -14.65473246749145],
      [3.492690636478411, -14.540964874851209],
      [4.46624832528969, -14.314908595038663],
      [5.407746373486955, -13.97950221417064],
      [6.304945912520563, -13.539105799284997],
      [7.146183925943418, -12.999444220275878],
      [7.92052486111687, -12.367532730270396],
      [8.617902784355406, -11.651585771853956],
      [9.229252231584741, -10.86091019460458],
      [9.746626053539018, -10.005784272039564],
      [10.163298723585388, -9.097324090676246],
      [10.473853765240772, -8.147339048063117],
      [10.674254162879354, -7.168178338213837],
      [10.761894840336936, -6.1725704200346865],
      [10.735636525224095, -5.1734575555525595],
      [10.595820558733859, -4.1838275688400275],
      [10.344264458425918, -3.216545012663133],
      [9.984238291668362, -2.284183937576819],
      [9.520422166866956, -1.398864437362092],
      [8.95884539506862, -0.572095095609022],
      [8.306808112799109, 0.18537661846143472],
      [7.572786384987548, 0.8637040601787636],
      [6.766322021578705, 1.454069409464962],
      [5.897898540146121, 1.9487982968191968],
      [4.97880488691229, 2.341459565181043],
    ],
  );
});

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
