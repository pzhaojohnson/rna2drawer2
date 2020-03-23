import Stem from './Stem';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import validatePartners from '../../../../parse/validatePartners';
import normalizeAngle from '../../../normalizeAngle';
import { RoundLoop, StemLayout } from './StemLayout';
import parseDotBracket from '../../../../parse/parseDotBracket';
import { parse } from '@babel/core';

function defaultBaseProps(length) {
  let bps = [];
  for (let i = 0; i < length; i++) {
    bps.push(new StrictLayoutBaseProps());
  }
  return bps;
}

it('_initializePosition3', () => {

  let cases = [

    // outermost stem
    { partners: [9, 8, 7, null, null, null, 3, 2, 1], position5: 0, position3: 10 },

    // inner stem
    { partners: [9, 8, 7, null, null, null, 3, 2, 1], position5: 1, position3: 9 },

    // position5 greater than 1
    { partners: [null, 10, 9, 8, null, null, null, 4, 3, 2, null], position5: 2, position3: 10 }
  ];

  cases.forEach(cs => {
    let gps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
    let st = new Stem(cs.position5, cs.partners, gps, bps);
    expect(st.position3).toEqual(cs.position3);
  });
});

it('_initializeSize', () => {
  
  let cases = [

    // outermost stem
    { partners: [null, null, null], position5: 0, size: 1 },

    // size of one
    { partners: [5, null, null, null, 1], position5: 1, size: 1 },

    // size greater than one
    { partners: [9, 8, 7, null, null, null, 3, 2, 1, null, null], position5: 1, size: 3 },

    // empty loop and position5 greater than one
    { partners: [null, 7, 6, 5, 4, 3, 2], position5: 2, size: 3 },

    // nonnull partners at top of stem and position5 greater than one
    { partners: [11, 10, 8, 7, null, null, 4, 3, null, 2, 1], position5: 1, size: 2 },
    { partners: [null, 12, 11, null, 10, 9, null, null, 6, 5, 3, 2, null], position5: 2, size: 2 },
    { partners: [16, 15, 8, 7, null, null, 4, 3, 14, 13, null, null, 10, 9, 2, 1], position5: 1, size: 2 }
  ];

  cases.forEach(cs => {

    // check that manually typed partners notation is valid
    validatePartners(cs.partners);

    let gps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
    let st = new Stem(cs.position5, cs.partners, gps, bps);
    expect(st.size).toEqual(cs.size);
  });
});

it('_initializeLoop', () => {

  let cases = [

    // empty loop
    {
      partners: [null, 7, 6, 5, 4, 3, 2],
      position5: 2,
      definingPositions: [[4, 5]]
    },

    // a hairpin
    {
      partners: [9, 8, 7, null, null, null, 3, 2, 1, null, null],
      position5: 1,
      definingPositions: [[3, 7]]
    },

    // an internal loop
    {
      partners: [12, 11, null, 9, 8, null, null, 5, 4, null, 2, 1, null],
      position5: 1,
      definingPositions: [[2, 4], [4, 9, 2], [9, 11]]
    },

    // a multibranch loop and empty unpaired regions
    {
      partners: [16, 15, 8, 7, null, null, 4, 3, 14, 13, null, null, 10, 9, 2, 1],
      position5: 1,
      definingPositions: [[2, 3], [3, 8, 2], [8, 9], [9, 14, 2], [14, 15]]
    },

    // outermost stem with unstructured loop
    {
      partners: [null, null],
      position5: 0,
      definingPositions: [[0, 3]]
    },

    // outermost stem with one stem in loop
    {
      partners: [null, 7, 6, null, null, 3, 2],
      position5: 0,
      definingPositions: [[0, 2], [2, 7, 2], [7, 8]]
    },

    // outermost stem with multiple stems in loop
    {
      partners: [5, 4, null, 2, 1, 7, 6, null, null],
      position5: 0,
      definingPositions: [[0, 1], [1, 5, 2], [5, 6], [6, 7, 1], [7, 10]]
    }
  ];

  cases.forEach(cs => {

    // check that manually typed in partners notation is valid
    validatePartners(cs.partners);

    let gps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
    let st = new Stem(cs.position5, cs.partners, gps, bps);
    
    let it = st.loopIterator();
    let onUnpairedRegion = true;

    cs.definingPositions.forEach(positions => {
      let ele = it.next().value;

      if (onUnpairedRegion) {
        expect([ele.boundingPosition5, ele.boundingPosition3]).toEqual(positions);
      } else {
        expect([ele.position5, ele.position3, ele.size]).toEqual(positions);
      }

      onUnpairedRegion = !onUnpairedRegion;
    })
  });
});

it('position and size getters', () => {

  let cases = [

    // outermost stem
    {
      partners: [6, 5, null, null, 2, 1],
      position5: 0,
      position3: 7,
      positionTop5: 0,
      positionTop3: 7,
      size: 1
    },

    // an inner stem
    {
      partners: [6, 5, null, null, 2, 1],
      position5: 1,
      position3: 6,
      positionTop5: 2,
      positionTop3: 5,
      size: 2
    }
  ];

  cases.forEach(cs => {

    // check that manually typed in partners notation is valid
    validatePartners(cs.partners);

    let gps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
    let st = new Stem(cs.position5, cs.partners, gps, bps);
    expect([
      st.position5, st.position3, st.positionTop5, st.positionTop3, st.size
    ]).toEqual([
      cs.position5, cs.position3, cs.positionTop5, cs.positionTop3, cs.size
    ]);
  });
});

it('loopIterator', () => {
  // is tested in tests for _initializeLoop method
});

it('numBranches', () => {

  let cases = [

    // empty loop
    {
      partners: [null, 7, 6, 5, 4, 3, 2],
      position5: 2,
      numBranches: 0
    },

    // a hairpin
    {
      partners: [9, 8, 7, null, null, null, 3, 2, 1, null, null],
      position5: 1,
      numBranches: 0
    },

    // an internal loop
    {
      partners: [12, 11, null, 9, 8, null, null, 5, 4, null, 2, 1, null],
      position5: 1,
      numBranches: 1
    },

    // a multibranch loop
    {
      partners: [16, 15, 8, 7, null, null, 4, 3, 14, 13, null, null, 10, 9, 2, 1],
      position5: 1,
      numBranches: 2
    },

    // outermost stem with unstructured loop
    {
      partners: [null, null],
      position5: 0,
      numBranches: 0
    },

    // outermost stem with one stem in loop
    {
      partners: [null, 7, 6, null, null, 3, 2],
      position5: 0,
      numBranches: 1
    },

    // outermost stem with multiple stems in loop
    {
      partners: [5, 4, null, 2, 1, 7, 6, null, null],
      position5: 0,
      numBranches: 2
    }
  ];

  cases.forEach(cs => {

    // validate manually typed in partners notation
    validatePartners(cs.partners);

    let gps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
    let st = new Stem(cs.position5, cs.partners, gps, bps);
    expect(st.numBranches).toEqual(cs.numBranches);
  });
});

it('coordinates getters and setters', () => {
  let partners = [null, 7, 6, null, null, 3, 2, null];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
  
  // outermost stem
  gps.terminiGap = 6;
  let ost = new Stem(0, partners, gps, bps);
  ost.xBottomCenter = 1;
  ost.yBottomCenter = 2;
  ost.angle = Math.PI / 3;

  expect(ost.xBottomCenter).toBeCloseTo(1, 6);
  expect(ost.yBottomCenter).toBeCloseTo(2, 6);
  
  expect(ost.xTopCenter).toBeCloseTo(1 + Math.cos(Math.PI / 3), 6);
  expect(ost.yTopCenter).toBeCloseTo(2 + Math.sin(Math.PI / 3), 6);

  expect(ost.xBottomLeft).toBeCloseTo(1 + ((ost.width / 2) * Math.cos((Math.PI / 3) - (Math.PI / 2))), 6);
  expect(ost.yBottomLeft).toBeCloseTo(2 + ((ost.width / 2) * Math.sin((Math.PI / 3) - (Math.PI / 2))), 6);

  expect(ost.xBottomRight).toBeCloseTo(1 + ((ost.width / 2) * Math.cos((Math.PI / 3) + (Math.PI / 2))), 6);
  expect(ost.yBottomRight).toBeCloseTo(2 + ((ost.width / 2) * Math.sin((Math.PI / 3) + (Math.PI / 2))), 6);

  expect(ost.xTopLeft).toBeCloseTo(ost.xTopCenter + ((ost.width / 2) * Math.cos((Math.PI / 3) - (Math.PI / 2))), 6);
  expect(ost.yTopLeft).toBeCloseTo(ost.yTopCenter + ((ost.width / 2) * Math.sin((Math.PI / 3) - (Math.PI / 2))), 6);

  expect(ost.xTopRight).toBeCloseTo(ost.xTopCenter + ((ost.width / 2) * Math.cos((Math.PI / 3) + (Math.PI / 2))), 6);
  expect(ost.yTopRight).toBeCloseTo(ost.yTopCenter + ((ost.width / 2) * Math.sin((Math.PI / 3) + (Math.PI / 2))), 6);

  // inner stem
  gps.basePairBondLength = 2;
  let ist = new Stem(2, partners, gps, bps);
  ist.xBottomCenter = 1;
  ist.yBottomCenter = 2;
  ist.angle = Math.PI / 3;

  expect(ist.xBottomCenter).toBeCloseTo(1, 6);
  expect(ist.yBottomCenter).toBeCloseTo(2, 6);
  
  expect(ist.xTopCenter).toBeCloseTo(1 + (2 * Math.cos(Math.PI / 3)), 6);
  expect(ist.yTopCenter).toBeCloseTo(2 + (2 * Math.sin(Math.PI / 3)), 6);

  expect(ist.xBottomLeft).toBeCloseTo(1 + ((ist.width / 2) * Math.cos((Math.PI / 3) - (Math.PI / 2))), 6);
  expect(ist.yBottomLeft).toBeCloseTo(2 + ((ist.width / 2) * Math.sin((Math.PI / 3) - (Math.PI / 2))), 6);

  expect(ist.xBottomRight).toBeCloseTo(1 + ((ist.width / 2) * Math.cos((Math.PI / 3) + (Math.PI / 2))), 6);
  expect(ist.yBottomRight).toBeCloseTo(2 + ((ist.width / 2) * Math.sin((Math.PI / 3) + (Math.PI / 2))), 6);

  expect(ist.xTopLeft).toBeCloseTo(ist.xTopCenter + ((ist.width / 2) * Math.cos((Math.PI / 3) - (Math.PI / 2))), 6);
  expect(ist.yTopLeft).toBeCloseTo(ist.yTopCenter + ((ist.width / 2) * Math.sin((Math.PI / 3) - (Math.PI / 2))), 6);

  expect(ist.xTopRight).toBeCloseTo(ist.xTopCenter + ((ist.width / 2) * Math.cos((Math.PI / 3) + (Math.PI / 2))), 6);
  expect(ist.yTopRight).toBeCloseTo(ist.yTopCenter + ((ist.width / 2) * Math.sin((Math.PI / 3) + (Math.PI / 2))), 6);
});

it('angle getters and setters', () => {
  let partners = [6, 5, null, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
  let st = new Stem(1, partners, gps, bps);
  
  st.angle = Math.PI;
  expect(normalizeAngle(st.angle, 0)).toBeCloseTo(Math.PI, 6);
  expect(normalizeAngle(st.reverseAngle, 0)).toBeCloseTo(0, 6);

  st.angle = Math.PI / 4;
  expect(normalizeAngle(st.angle, 0)).toBeCloseTo(Math.PI / 4, 6);
  expect(normalizeAngle(st.reverseAngle, 0)).toBeCloseTo(5 * Math.PI / 4, 6);
});

it('width and height getters', () => {
  let partners = [6, 5, null, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 2;
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
  let st = new Stem(1, partners, gps, bps);
  expect(st.width).toBeCloseTo(4, 6);
  expect(st.height).toBeCloseTo(2);
});

it('baseCoordinates5 method', () => {
  let partners = [9, 8, 7, null, null, null, 3, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.4;
  let bps = defaultBaseProps(partners.length);
  let st = new Stem(1, partners, gps, bps);
  st.xBottomCenter = 1.2;
  st.yBottomCenter = -1.6;
  
  // pointed straight up
  st.angle = -Math.PI / 2;
  let bc5 = st.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(0, 3);
  expect(bc5.yCenter).toBeCloseTo(-2.1, 3);

  // pointed straight down
  st.angle = Math.PI / 2;
  bc5 = st.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(2.4, 3);
  expect(bc5.yCenter).toBeCloseTo(-1.1, 3);

  // pointed to the bottom right
  st.angle = Math.PI / 6;
  bc5 = st.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(2.2330127018922195, 3);
  expect(bc5.yCenter).toBeCloseTo(-2.3892304845413266, 3);

  // pointed to the top left
  st.angle = 7 * Math.PI / 5;
  bc5 = st.baseCoordinates5();
  expect(bc5.xCenter).toBeCloseTo(-0.09577631674165787, 3);
  expect(bc5.yCenter).toBeCloseTo(-1.70470786489764, 3);
});

it('baseCoordinatesTop5 method', () => {
  let partners = [9, 8, 7, null, null, null, 3, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 0.9;
  gps.basePairPadding = 0.1;
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  st.angle = Math.PI / 3;
  st.xBottomCenter = 1.11;
  st.yBottomCenter = 2.2;

  let bct5 = st.baseCoordinatesTop5();
  expect(bct5.xLeft).toBeCloseTo(2.7827240000000004, 3);
  expect(bct5.yTop).toBeCloseTo(3.563267888325765, 3);
});

it('baseCoordinates3 method', () => {
  let partners = [9, 8, 7, null, null, null, 3, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 1.8;
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  st.angle = 2 * Math.PI / 3;
  st.xBottomCenter = -0.2;
  st.yBottomCenter = -3.2;

  let bc3 = st.baseCoordinates3();
  expect(bc3.xLeft).toBeCloseTo(-2.1624361305964284, 3);
  expect(bc3.yTop).toBeCloseTo(-3.9669869999999996, 3);
});

it('baseCoordinatesTop3 method', () => {
  let partners = [9, 8, 7, null, null, null, 3, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  gps.basePairBondLength = 2.2;
  gps.basePairPadding = 0.25;
  let bps = defaultBaseProps(partners.length);

  let st = new Stem(1, partners, gps, bps);
  st.angle = -Math.PI / 3;
  st.xBottomCenter = 1.32;
  st.yBottomCenter = -5;

  let bct3 = st.baseCoordinatesTop3();
  expect(bct3.xLeft).toBeCloseTo(3.70564, 3);
  expect(bct3.yTop).toBeCloseTo(-7.298075509461096, 3);
});

it('isOuterTo', () => {

  let cases = [
    
    // outer to
    {
      partners: [12, 11, null, 9, 8, null, null, 5, 4, null, 2, 1],
      firstPosition5: 1,
      secondPosition5: 4,
      isOuterTo: true
    },

    // inner to
    {
      partners: [12, 11, null, 9, 8, null, null, 5, 4, null, 2, 1],
      firstPosition5: 4,
      secondPosition5: 1,
      isOuterTo: false
    },

    // to left of
    {
      partners: [6, 5, null, null, 2, 1, null, 12, 11, null, 9, 8, null],
      firstPosition5: 1,
      secondPosition5: 8,
      isOuterTo: false
    },

    // to the right of
    {
      partners: [6, 5, null, null, 2, 1, null, 12, 11, null, 9, 8, null],
      firstPosition5: 8,
      secondPosition5: 1,
      isOuterTo: false
    },

    // next to in another loop
    {
      partners: [null, 5, null, null, 2, 15, null, 13, 12, null, null, 9, 8, null, 6],
      firstPosition5: 2,
      secondPosition5: 8,
      isOuterTo: false
    },

    // outermost stem
    {
      partners: [12, 11, null, 9, 8, null, null, 5, 4, null, 2, 1],
      firstPosition5: 0,
      secondPosition5: 1,
      isOuterTo: true
    }
  ];

  cases.forEach(cs => {

    // validate manually typed in partners notation
    validatePartners(cs.partners);

    let gps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
    let st1 = new Stem(cs.firstPosition5, cs.partners, gps, bps);
    let st2 = new Stem(cs.secondPosition5, cs.partners, gps, bps);
    expect(st1.isOuterTo(st2)).toEqual(cs.isOuterTo);
  });
});

it('isOutermostStem', () => {
  let partners = [6, 5, null, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
  
  let outermostStem = new Stem(0, partners, gps, bps);
  expect(outermostStem.isOutermostStem()).toBeTruthy();

  let innerStem = new Stem(1, partners, gps, bps);
  expect(innerStem.isOutermostStem()).toBeFalsy();
});

it('hasHairpinLoop method - a hairpin', () => {
  let partners = [3, null, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(3);
  let st = new Stem(1, partners, gps, bps);
  expect(st.hasHairpinLoop()).toBeTruthy();
});

it('hasHairpinLoop method - not a hairpin', () => {
  let partners = [8, null, 6, null, null, 3, null, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = defaultBaseProps(8);
  let st = new Stem(1, partners, gps, bps);
  expect(st.hasHairpinLoop()).toBeFalsy();
});

it('loop shape', () => {
  let partners = [12, 11, null, 9, 8, null, null, 5, 4, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));

  gps.flatOutermostLoop = false;
  let outermostStem = new Stem(0, partners, gps, bps);
  expect(outermostStem.hasRoundLoop()).toBeTruthy();
  expect(outermostStem.hasTriangleLoop()).toBeFalsy();

  gps.flatOutermostLoop = true;
  outermostStem = new Stem(0, partners, gps, bps);
  expect(outermostStem.hasRoundLoop()).toBeFalsy();
  expect(outermostStem.hasTriangleLoop()).toBeFalsy();

  bps[0].loopShape = 'round';
  let innerStem = new Stem(1, partners, gps, bps);
  expect(innerStem.hasRoundLoop()).toBeTruthy();
  expect(innerStem.hasTriangleLoop()).toBeFalsy();

  bps[0].loopShape = 'triangle';
  innerStem = new Stem(1, partners, gps, bps);
  expect(innerStem.hasRoundLoop()).toBeFalsy();
  expect(innerStem.hasTriangleLoop()).toBeTruthy();
});

it('isFlipped', () => {
  let partners = [12, 11, null, 9, 8, null, null, 5, 4, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));

  let outermostStem = new Stem(0, partners, gps, bps);
  expect(outermostStem.isFlipped()).toBeFalsy();

  bps[0].flipStem = false;
  let innerStem = new Stem(1, partners, gps, bps);
  expect(innerStem.isFlipped()).toBeFalsy();
  
  bps[0].flipStem = true;
  innerStem = new Stem(1, partners, gps, bps);
  expect(innerStem.isFlipped()).toBeTruthy();
});

function checkCoords(coords, expectedCoords) {
  expect(coords.length).toBe(expectedCoords.length);
  for (let i = 0; i < expectedCoords.length; i++) {
    expect(coords[i].xLeft).toBeCloseTo(expectedCoords[i].xLeft, 3);
    expect(coords[i].yTop).toBeCloseTo(expectedCoords[i].yTop, 3);
  }
}

it('baseCoordinates method - the outermost stem', () => {
  
  //let partners = [null, null, null, null, 13, 12, 11, null, null, null, 7, 6, 5, null, null, null, null];
  //let partners = [null, 6, 5, null, 3, 2, null]
  //let partners = parseDotBracket('.(((....))).....(((.....)))...').secondaryPartners;
  //let partners = parseDotBracket('.(((.......((((.....))))....)))...').secondaryPartners;
  //let partners = parseDotBracket('((((((...)))(((((...)))))(((...))))))').secondaryPartners;
  //let partners = parseDotBracket('.(((....)))(((....))).').secondaryPartners;
  //let partners = parseDotBracket('((((((....))).)))').secondaryPartners;
  //let partners = parseDotBracket('.(((....)))').secondaryPartners;
  let partners = parseDotBracket(
    '.(((((..((....)).((((((...(((((((((((((..(((((((((((((((((((.....)).))))).)))..)))))))))))))))...((...)).)))))))....))))))..........))))).....(((((.((.(((...((((((....))))))..))).)).((((.((((..((.(((((..(((.....)))...((....))..)))))...((((((((((....(((((((((((....))))))).))))...((.((((((((((.(((.((.....))))))))).)))))).))...))))))..)))).....))..)))).)))).)))))..'
  ).secondaryPartners;
  let gps = new StrictLayoutGeneralProps();
  gps.terminiGap = 6;
  gps.basePairBondLength = 1;
  let bps = defaultBaseProps(partners.length);
  let omst = new Stem(0, partners, gps, bps);
  StemLayout.setCoordinatesAndAngles(omst, gps, bps);
  
  let coords = omst.baseCoordinates();
  let xs = '';
  let ys = '';
  let s = '';
  coords.forEach(bc => {
    xs += bc.xCenter + '\n';
    ys += bc.yCenter + '\n';
    //s += '[';
    s += bc.xLeft + '\t';
    s += bc.yTop + '\n';
  });
  //console.log(xs);
  //console.log(ys);
  //console.log(s);
  //console.log(omst);
  let it = omst.loopIterator();
  it.next();
  let st = it.next().value;
  //console.log(st);
  
});

it('baseCoordinates method - not the outermost stem', () => {});

it('baseCoordinates method - a hairpin', () => {});

it('baseCoordinates method - has inner stems', () => {});

it('baseCoordinates method - has a flipped inner stem', () => {});

it('flippedBaseCoordinates method', () => {});
