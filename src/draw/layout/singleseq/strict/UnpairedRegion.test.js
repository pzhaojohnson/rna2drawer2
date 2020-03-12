import UnpairedRegion from './UnpairedRegion';
import Stem from './Stem';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import validatePartners from '../../../../parse/validatePartners';
import { polarizeLength } from './circle';

it('bounding stem getters', () => {
  let partners = [6, 5, null, null, 2, 1];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
  
  let st = new Stem(1, partners, gps, bps);
  let it = st.loopIterator();
  let ur = it.next().value;
  expect(Object.is(ur.boundingStem5, st)).toBeTruthy();
  expect(Object.is(ur.boundingStem3, st)).toBeTruthy();
});

it('bounding positions and base coordinates', () => {

  let cases = [

    // hairpin loop
    {
      partners: [12, 11, null, 9, 8, null, null, 5, 4, null, 2, 1],
      firstPosition5: 4,
      secondPosition5: 4,
      boundingPosition5: 'positionTop5',
      boundingPosition3: 'positionTop3',
      baseCoordinatesBounding5: 'baseCoordinatesTop5',
      baseCoordinatesBounding3: 'baseCoordinatesTop3'
    },

    // 5' bounding stem is outer
    {
      partners: [12, 11, null, 9, 8, null, null, 5, 4, null, 2, 1],
      firstPosition5: 1,
      secondPosition5: 4,
      boundingPosition5: 'positionTop5',
      boundingPosition3: 'position5',
      baseCoordinatesBounding5: 'baseCoordinatesTop5',
      baseCoordinatesBounding3: 'baseCoordinates5'
    },

    // 3' bounding stem is outer
    {
      partners: [12, 11, null, 9, 8, null, null, 5, 4, null, 2, 1],
      firstPosition5: 4,
      secondPosition5: 1,
      boundingPosition5: 'position3',
      boundingPosition3: 'positionTop3',
      baseCoordinatesBounding5: 'baseCoordinates3',
      baseCoordinatesBounding3: 'baseCoordinatesTop3'
    },

    // bounding stems are siblings
    {
      partners: [4, null, null, 1, null, 11, 10, null, null, 7, 6, null],
      firstPosition5: 1,
      secondPosition5: 6,
      boundingPosition5: 'position3',
      boundingPosition3: 'position5',
      baseCoordinatesBounding5: 'baseCoordinates3',
      baseCoordinatesBounding3: 'baseCoordinates5'
    },

    // outermost loop is a bounding stem
    {
      partners: [6, 5, null, null, 2, 1],
      firstPosition5: 0,
      secondPosition5: 1,
      boundingPosition5: 'positionTop5',
      boundingPosition3: 'position5',
      baseCoordinatesBounding5: 'baseCoordinatesTop5',
      baseCoordinatesBounding3: 'baseCoordinates5'
    },

    // hairpin loop of outermost stem
    {
      partners: [null, null, null],
      firstPosition5: 0,
      secondPosition5: 0,
      boundingPosition5: 'positionTop5',
      boundingPosition3: 'positionTop3',
      baseCoordinatesBounding5: 'baseCoordinatesTop5',
      baseCoordinatesBounding3: 'baseCoordinatesTop3'
    }
  ];

  cases.forEach(cs => {

    // validate manually typed in partners notation
    validatePartners(cs.partners);

    let gps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.partners.forEach(position => bps.push(new StrictLayoutBaseProps()));

    let st1 = new Stem(cs.firstPosition5, cs.partners, gps, bps);
    let st2;
    
    if (cs.firstPosition5 === cs.secondPosition5) {
      st2 = st1;
    } else {
      st2 = new Stem(cs.secondPosition5, cs.partners, gps, bps);
    }

    let ur = new UnpairedRegion(st1, st2, gps, bps);
    
    expect(ur.boundingPosition5).toEqual(st1[cs.boundingPosition5]);
    expect(ur.boundingPosition3).toEqual(st2[cs.boundingPosition3]);
    
    let bcb5 = ur.baseCoordinatesBounding5();
    let ebcb5 = st1[cs.baseCoordinatesBounding5]();
    expect(bcb5.xLeft).toBeCloseTo(ebcb5.xLeft, 6);
    expect(bcb5.yTop).toBeCloseTo(ebcb5.yTop, 6);

    let bcb3 = ur.baseCoordinatesBounding3();
    let ebcb3 = st2[cs.baseCoordinatesBounding3]();
    expect(bcb3.xLeft).toBeCloseTo(ebcb3.xLeft, 6);
    expect(bcb3.yTop).toBeCloseTo(ebcb3.yTop, 6);
  });
});

it('size', () => {

  let cases = [
    
    // size of zero
    {
      partners: [6, 5, null, null, 2, 1, 10, null, null, 7, null],
      firstPosition5: 1,
      secondPosition5: 7,
      size: 0
    },

    // size greater than zero (and a hairpin loop)
    {
      partners: [6, 5, null, null, 2, 1],
      firstPosition5: 1,
      secondPosition5: 1,
      size: 2
    }
  ];

  cases.forEach(cs => {

    // validate manually typed in partners notation
    validatePartners(cs.partners);

    let gps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.partners.forEach(position => bps.push(new StrictLayoutBaseProps()));

    let st1 = new Stem(cs.firstPosition5, cs.partners, gps, bps);
    let st2;

    if (cs.firstPosition5 === cs.secondPosition5) {
      st2 = st1;
    } else {
      st2 = new Stem(cs.secondPosition5, cs.partners, gps, bps);
    }

    let ur = new UnpairedRegion(st1, st2, gps, bps);
    expect(ur.size).toEqual(cs.size);
  });
});

it('isHairpinLoop', () => {

  let cases = [

    // hairpin loop
    {
      partners: [6, 5, null, null, 2, 1],
      firstPosition5: 1,
      secondPosition5: 1,
      isHairpinLoop: true
    },

    // not a hairpin loop
    {
      partners: [3, null, 1, 6, null, 4],
      firstPosition5: 1,
      secondPosition5: 4,
      isHairpinLoop: false
    },

    // hairpin loop of outermost stem
    {
      partners: [null],
      firstPosition5: 0,
      secondPosition5: 0,
      isHairpinLoop: true
    }
  ];

  cases.forEach(cs => {

    // validate manually typed in partners notation
    validatePartners(cs.partners);

    let gps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.partners.forEach(position => bps.push(new StrictLayoutBaseProps()));

    let st1 = new Stem(cs.firstPosition5, cs.partners, gps, bps);
    let st2;

    if (cs.firstPosition5 === cs.secondPosition5) {
      st2 = st1;
    } else {
      st2 = new Stem(cs.secondPosition5, cs.partners, gps, bps);
    }

    let ur = new UnpairedRegion(st1, st2, gps, bps);
    expect(ur.isHairpinLoop()).toEqual(cs.isHairpinLoop);
  });
});

it('is dangling', () => {
  let partners = [null, 7, 6, null, null, 3, 2, null, 11, null, 9];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();

  let ur = it.next().value;
  expect(ur.isDangling5()).toBeTruthy();
  expect(ur.isDangling3()).toBeFalsy();

  it.next();
  ur = it.next().value;
  expect(ur.isDangling5()).toBeFalsy();
  expect(ur.isDangling3()).toBeFalsy();

  it.next();
  ur = it.next().value;
  expect(ur.isDangling5()).toBeFalsy();
  expect(ur.isDangling3()).toBeTruthy();
});

it('minLength', () => {
  let partners = [8, 7, null, null, null, null, 2, 1, null, 12, null, 10, null, null, null, null];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();

  // size of zero
  expect(it.next().value.minLength).toEqual(0);

  // hairpin loop
  let innerIt = it.next().value.loopIterator();
  expect(innerIt.next().value.minLength).toEqual(4);

  // size of one
  expect(it.next().value.minLength).toEqual(1);

  it.next();

  // size greater than one
  expect(it.next().value.minLength).toEqual(2);
});

it('length', () => {
  let partners = [8, 7, null, null, null, null, 2, 1, null, 12, null, 10, null, null, null, null];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));

  // bigger than minimum length
  bps[7].stretch3 = 5;
  bps[8].stretch3 = 5;

  // smaller than minimum length
  bps[13].stretch3 = -8;
  bps[14].stretch3 = -8;

  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();

  // empty
  expect(it.next().value.length).toBeCloseTo(0, 6);

  // hairpin loop
  let innerIt = it.next().value.loopIterator();
  expect(innerIt.next().value.length).toBeCloseTo(4, 6);

  // bigger than minimum length
  expect(it.next().value.length).toBeCloseTo(11);

  it.next();
  
  // smaller than minimum length
  let ur = it.next().value;
  expect(ur.length).toBeCloseTo(ur.minLength);
});

it('polarLength', () => {
  let partners = [null, null, null];
  let gps = new StrictLayoutGeneralProps();
  let bps = [];
  partners.forEach(position => bps.push(new StrictLayoutBaseProps()));
  let outermostStem = new Stem(0, partners, gps, bps);
  let it = outermostStem.loopIterator();

  let ur = it.next().value;
  expect(ur.polarLength).toEqual(polarizeLength(3));
});
