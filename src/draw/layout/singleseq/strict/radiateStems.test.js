import {
  radiateStems,
  _radialAngle,
  _numBasesInLoop,
  _setStretchForUnpairedRegion,
  _ONE_BRANCH_RADIATION,
  _radiateOneBranch,
  _MULTIPLE_BRANCHES_SPREAD,
  _MULTIPLE_BRANCHES_SPREAD_ANGLE,
  _spreadMultipleBranches,
  _MULTIPLE_BRANCHES_RADIATION,
  _radiateMultipleBranchesOutward,
  _radiateMultipleBranches,
  _radiateLoop,
} from './radiateStems';
import parseDotBracket from '../../../../parse/parseDotBracket';
import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './PerBaseStrictLayoutProps';
import Stem from './Stem';
import { normalizeAngle } from 'Math/angles/normalize';

function defaultPerBaseProps(length) {
  let perBaseProps = [];
  for (let i = 0; i < length; i++) {
    perBaseProps.push(new PerBaseStrictLayoutProps());
  }
  return perBaseProps;
}

function zeroStretches3(length) {
  let stretches3 = [];
  for (let i = 0; i < length; i++) {
    stretches3.push(0);
  }
  return stretches3;
}

function checkStretches3(stretches3, expectedStretches3) {
  expect(stretches3.length).toBe(expectedStretches3.length);
  for (let i = 0; i < expectedStretches3.length; i++) {
    expect(stretches3[i]).toBeCloseTo(expectedStretches3[i], 3);
  }
}

describe('_radialAngle function', () => {
  it('structure length is zero', () => {
    let partners = parseDotBracket('.').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    expect(_radialAngle(omst, 0)).toBe(0);
  });

  it('outermost stem', () => {
    let partners = parseDotBracket('..(((...)))......').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    expect(_radialAngle(omst, partners.length)).toBe(0);
  });

  it('an inner stem', () => {
    let partners = parseDotBracket('..(((...)))....(((...)))......').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(3, partners, gps, pbps);
    expect(
      normalizeAngle(_radialAngle(st, partners.length))
    ).toBeCloseTo(4.502949470145371, 3);
  });
});

describe('_numBasesInLoop function', () => {
  it('handles the outermost stem', () => {
    let partners = parseDotBracket('.....').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    expect(_numBasesInLoop(omst)).toBe(5);
  });

  it('handles a stem with multiple inner stems', () => {
    let partners = parseDotBracket('((..(((...)))...((.))))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    expect(_numBasesInLoop(st)).toBe(11);
  });
});

describe('_setStretchForUnpairedRegion function', () => {
  it('handles a bounding position of zero', () => {
    let partners = parseDotBracket('...(((...)))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let it = omst.loopIterator();
    let ur = it.next().value;
    let stretches3 = zeroStretches3(partners.length);
    _setStretchForUnpairedRegion(ur, stretches3, 6);
    checkStretches3(
      stretches3,
      [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    );
  });

  it('handles a bounding position greater than zero', () => {
    let partners = parseDotBracket('((.))...').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let it = omst.loopIterator();
    it.next();
    it.next();
    let ur = it.next().value;
    let stretches3 = zeroStretches3(partners.length);
    _setStretchForUnpairedRegion(ur, stretches3, 4);
    checkStretches3(
      stretches3,
      [0, 0, 0, 0, 1, 1, 1, 1],
    );
  });

  it('handles an unpaired region of size zero', () => {
    let partners = parseDotBracket('(.)(.)').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let it = omst.loopIterator();
    it.next();
    it.next();
    let ur = it.next().value;
    let stretches3 = zeroStretches3(partners.length);
    _setStretchForUnpairedRegion(ur, stretches3, 3);
    checkStretches3(
      stretches3,
      [0, 0, 3, 0, 0, 0],
    );
  });
});

describe('_radiateOneBranch function', () => {
  it('does nothing for the outermost stem', () => {
    let partners = parseDotBracket('...(((...))).').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateOneBranch(omst, stretches3);
    checkStretches3(
      stretches3,
      zeroStretches3(partners.length),
    );
  });

  it('can radiate clockwise', () => {
    let partners = parseDotBracket('((.(((...))).........))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let urFirst = st.firstUnpairedRegionInLoop;
    let urLast = st.lastUnpairedRegionInLoop;
    let stretches3 = zeroStretches3(partners.length);
    _radiateOneBranch(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    let s = (urLast.size * (_ONE_BRANCH_RADIATION / Math.PI)) - urFirst.size;
    expectedStretches3[1] = s / 2;
    expectedStretches3[2] = s / 2;
    checkStretches3(stretches3, expectedStretches3);
  });

  it('can radiate counterclockwise', () => {
    let partners = parseDotBracket('((.........(((...))).))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let urFirst = st.firstUnpairedRegionInLoop;
    let urLast = st.lastUnpairedRegionInLoop;
    let stretches3 = zeroStretches3(partners.length);
    _radiateOneBranch(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    let s = (urFirst.size * (_ONE_BRANCH_RADIATION / Math.PI)) - urLast.size;
    expectedStretches3[19] = s / 2;
    expectedStretches3[20] = s / 2;
    checkStretches3(stretches3, expectedStretches3);
  });

  it('already radiated enough', () => {
    let partners = parseDotBracket('((......(((...)))......))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateOneBranch(st, stretches3);
    checkStretches3(
      stretches3,
      zeroStretches3(partners.length),
    );
  });
});

describe('_spreadMultipleBranches function', () => {
  it('does not stretch unpaired regions neighboring the outermost stem', () => {
    let partners = parseDotBracket('.((..))................................((..))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _spreadMultipleBranches(omst, stretches3);
    checkStretches3(
      stretches3,
      zeroStretches3(partners.length),
    );
  });

  it("the 5' stem is outer to the 3' stem", () => {
    let partners = parseDotBracket('((.((..)).....................))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _spreadMultipleBranches(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    let s = (_MULTIPLE_BRANCHES_SPREAD - 1) / 2;
    expectedStretches3[1] = s;
    expectedStretches3[2] = s;
    checkStretches3(stretches3, expectedStretches3);
  });

  it("the 3' stem is outer to the 5' stem", () => {
    let partners = parseDotBracket('((.....................((..)).))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _spreadMultipleBranches(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    let s = (_MULTIPLE_BRANCHES_SPREAD - 1) / 2;
    expectedStretches3[28] = s;
    expectedStretches3[29] = s;
    checkStretches3(stretches3, expectedStretches3);
  });

  it('neither stem is outer', () => {
    let partners = parseDotBracket('............((..)).((..))........').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _spreadMultipleBranches(omst, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    let s = (_MULTIPLE_BRANCHES_SPREAD - 1) / 2;
    expectedStretches3[17] = s;
    expectedStretches3[18] = s;
    checkStretches3(stretches3, expectedStretches3);
  });

  it('greater than the angle threshold', () => {
    let partners = parseDotBracket('...((..))................((..))...').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _spreadMultipleBranches(omst, stretches3);
    checkStretches3(
      stretches3,
      zeroStretches3(partners.length),
    );
  });

  it('unpaired region is too big', () => {
    let partners = parseDotBracket('...................((..)).....((..))................').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let st5 = omst.firstStemInLoop;
    let st3 = omst.lastStemInLoop;
    let angle5 = _radialAngle(st5, partners.length);
    let angle3 = _radialAngle(st3, partners.length);
    angle3 = normalizeAngle(angle3, angle5);
    expect(angle3 - angle5).toBeLessThan(_MULTIPLE_BRANCHES_SPREAD_ANGLE);
    let stretches3 = zeroStretches3(partners.length);
    _spreadMultipleBranches(omst, stretches3);
    checkStretches3(
      stretches3,
      zeroStretches3(partners.length),
    );
  });
});

describe('_radiateMultipleBranchesOutward function', () => {
  it('first unpaired region determines the length', () => {
    let partners = parseDotBracket('((((((((((((......((.)).((.)).))))))))))))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateMultipleBranchesOutward(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    expectedStretches3[28] = 2.5;
    expectedStretches3[29] = 2.5;
    checkStretches3(stretches3, expectedStretches3);
  });

  it('last unpaired region determines the length', () => {
    let partners = parseDotBracket('((((((((((((.((.)).((.))......))))))))))))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateMultipleBranchesOutward(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    expectedStretches3[11] = 2.5;
    expectedStretches3[12] = 2.5;
    checkStretches3(stretches3, expectedStretches3);
  });

  it('radiation determines the length', () => {
    let partners = parseDotBracket('((((((((((((((((.((.))........((.)).))))))))))))))))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateMultipleBranchesOutward(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    let circumference = 6 * (Math.PI / (Math.PI - _MULTIPLE_BRANCHES_RADIATION));
    let length = (_MULTIPLE_BRANCHES_RADIATION / (2 * Math.PI)) * circumference;
    let s = (length - 1) / 2;
    expectedStretches3[15] = s;
    expectedStretches3[16] = s;
    expectedStretches3[34] = s;
    expectedStretches3[35] = s;
    checkStretches3(stretches3, expectedStretches3);
  });
});

describe('_radiateMultipleBranches function', () => {
  it('spreads outermost stem', () => {
    let partners = parseDotBracket('.((.)).........((.)).((.))..............((.)).').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateMultipleBranches(omst, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    _spreadMultipleBranches(omst, expectedStretches3);
    expect(expectedStretches3[19]).toBeGreaterThan(0);
    expect(expectedStretches3[20]).toBeGreaterThan(0);
    checkStretches3(stretches3, expectedStretches3);
  });

  it('both stems exceed radiation angle', () => {
    let partners = parseDotBracket('((((((((((((((((.((.))........((.)).))))))))))))))))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateMultipleBranches(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    _radiateMultipleBranchesOutward(st, expectedStretches3);
    expect(expectedStretches3[15]).toBeGreaterThan(0);
    expect(expectedStretches3[16]).toBeGreaterThan(0);
    expect(expectedStretches3[34]).toBeGreaterThan(0);
    expect(expectedStretches3[35]).toBeGreaterThan(0);
    checkStretches3(stretches3, expectedStretches3);
  });

  it('only one stem exceeds radiation angle', () => {
    let partners = parseDotBracket('((..........((.)).((.)).))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateMultipleBranches(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    _spreadMultipleBranches(st, expectedStretches3);
    expect(expectedStretches3[16]).toBeGreaterThan(0);
    expect(expectedStretches3[17]).toBeGreaterThan(0);
    checkStretches3(stretches3, expectedStretches3);
  });

  it('neither stem exceeds radiation angle', () => {
    let partners = parseDotBracket('((....((.))......................((.))....))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateMultipleBranches(st, stretches3);
    checkStretches3(
      stretches3,
      zeroStretches3(partners.length),
    );
  });
});

describe('_radiateLoop function', () => {
  it('one branch', () => {
    let partners = parseDotBracket('((.((.))...........))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let st = new Stem(1, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateLoop(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    _radiateOneBranch(st, expectedStretches3);
    expect(
      expectedStretches3.filter(n => n > 0).length
    ).toBeGreaterThan(0);
    checkStretches3(stretches3, expectedStretches3);
  });

  it('multiple branches', () => {
    let partners = parseDotBracket('..(((.))).(((.)))................').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateLoop(omst, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    _radiateMultipleBranches(omst, expectedStretches3);
    expect(
      expectedStretches3.filter(n => n > 0).length
    ).toBeGreaterThan(0);
    checkStretches3(stretches3, expectedStretches3);
  });

  it('is recursive on inner stems', () => {
    let partners = parseDotBracket('..((.((.))..........)).').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, pbps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateLoop(omst, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    _radiateOneBranch(omst, expectedStretches3);
    _radiateOneBranch(omst.firstStemInLoop, expectedStretches3);
    expect(
      expectedStretches3.filter(n => n > 0).length
    ).toBeGreaterThan(0);
    checkStretches3(stretches3, expectedStretches3);
  });
});

describe('radiateStems function', () => {
  it('handles knots', () => {
    let partners = [9, 8, 7, 12, 11, 10, 3, 2, 1, 4, 5, 6];
    checkStretches3(
      radiateStems(partners),
      zeroStretches3(partners.length),
    );
  });

  it('calls the _radiateLoop function', () => {
    let partners = parseDotBracket('((..(((...)))......................)).((...))').secondaryPartners;
    let gps = new GeneralStrictLayoutProps();
    let pbps = defaultPerBaseProps('partners.length');
    let omst = new Stem(0, partners, gps, pbps);
    let expectedStretches3 = zeroStretches3(partners.length);
    _radiateLoop(omst, expectedStretches3);
    checkStretches3(
      radiateStems(partners),
      expectedStretches3,
    );
  });
});
