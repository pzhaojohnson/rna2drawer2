import {
  _radialAngle,
  _numBasesInLoop,
  _addStretchToUnpairedRegion,
  _radiateOneBranch,
  _spreadMultipleBranches,
} from './radiateStems';
import parseDotBracket from '../../../../parse/parseDotBracket';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import Stem from './Stem';
import normalizeAngle from '../../../normalizeAngle';

function defaultBaseProps(length) {
  let baseProps = [];
  for (let i = 0; i < length; i++) {
    baseProps.push(new StrictLayoutBaseProps());
  }
  return baseProps;
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
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, bps);
    expect(_radialAngle(omst, 0)).toBe(0);
  });

  it('outermost stem', () => {
    let partners = parseDotBracket('..(((...)))......').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, bps);
    expect(_radialAngle(omst, partners.length)).toBe(0);
  });

  it('an inner stem', () => {
    let partners = parseDotBracket('..(((...)))....(((...)))......').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let st = new Stem(3, partners, gps, bps);
    expect(
      normalizeAngle(_radialAngle(st, partners.length))
    ).toBeCloseTo(4.084070449666731, 3);
  });
});

describe('_numBasesInLoop function', () => {
  it('handles the outermost stem', () => {
    let partners = parseDotBracket('.....').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, bps);
    expect(_numBasesInLoop(omst)).toBe(5);
  });

  it('handles a stem with multiple inner stems', () => {
    let partners = parseDotBracket('((..(((...)))...((.))))').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let st = new Stem(1, partners, gps, bps);
    expect(_numBasesInLoop(st)).toBe(11);
  });
});

describe('_addStretchToUnpairedRegion function', () => {
  it('handles a bounding position of zero', () => {
    let partners = parseDotBracket('...(((...)))').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, bps);
    let it = omst.loopIterator();
    let ur = it.next().value;
    let stretches3 = zeroStretches3(partners.length);
    _addStretchToUnpairedRegion(ur, stretches3, 6);
    checkStretches3(
      stretches3,
      [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    );
  });

  it('handles a bounding position greater than zero', () => {
    let partners = parseDotBracket('((.))...').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, bps);
    let it = omst.loopIterator();
    it.next();
    it.next();
    let ur = it.next().value;
    let stretches3 = zeroStretches3(partners.length);
    _addStretchToUnpairedRegion(ur, stretches3, 4);
    checkStretches3(
      stretches3,
      [0, 0, 0, 0, 1, 1, 1, 1],
    );
  });

  it('handles an unpaired region of size zero', () => {
    let partners = parseDotBracket('(.)(.)').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, bps);
    let it = omst.loopIterator();
    it.next();
    it.next();
    let ur = it.next().value;
    let stretches3 = zeroStretches3(partners.length);
    _addStretchToUnpairedRegion(ur, stretches3, 3);
    checkStretches3(
      stretches3,
      [0, 0, 3, 0, 0, 0],
    );
  });
});

describe('_radiateOneBranch function', () => {
  it('does nothing for the outermost stem', () => {
    let partners = parseDotBracket('...(((...))).').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let omst = new Stem(0, partners, gps, bps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateOneBranch(omst, stretches3);
    checkStretches3(
      stretches3,
      zeroStretches3(partners.length),
    );
  });

  it('can radiate clockwise', () => {
    let partners = parseDotBracket('((.(((...))).........))').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let st = new Stem(1, partners, gps, bps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateOneBranch(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    expectedStretches3[1] = 2.5;
    expectedStretches3[2] = 2.5;
    checkStretches3(stretches3, expectedStretches3);
  });

  it('can radiate counterclockwise', () => {
    let partners = parseDotBracket('((.........(((...))).))').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let st = new Stem(1, partners, gps, bps);
    let stretches3 = zeroStretches3(partners.length);
    _radiateOneBranch(st, stretches3);
    let expectedStretches3 = zeroStretches3(partners.length);
    expectedStretches3[19] = 2.5;
    expectedStretches3[20] = 2.5;
    checkStretches3(stretches3, expectedStretches3);
  });

  it('already radiated enough', () => {
    let partners = parseDotBracket('((......(((...))).....))').secondaryPartners;
    let gps = new StrictLayoutGeneralProps();
    let bps = defaultBaseProps(partners.length);
    let st = new Stem(1, partners, gps, bps);
    expect(
      st.firstUnpairedRegionInLoop.size
    ).not.toBe(st.lastUnpairedRegionInLoop.size);
    let stretches3 = zeroStretches3(partners.length);
    _radiateOneBranch(st, stretches3);
    checkStretches3(
      stretches3,
      zeroStretches3(partners.length),
    );
  });
});

describe('_spreadMultipleBranches function', () => {
  it('does not stretch unpaired regions neighboring the outermost stem', () => {});

  it("the 5' stem is outer to the 3' stem", () => {});

  it("the 3' stem is outer to the 5' stem", () => {});

  it('neither stem is outer', () => {});

  it('less than the angle threshold', () => {});
});
