import normalizeAngle from '../../../normalizeAngle';
import Stem from './Stem';
import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';
import StrictLayoutPerBaseProps from './StrictLayoutPerBaseProps';
import isKnotless from '../../../../parse/isKnotless';

/**
 * @param {Stem} st 
 * @param {number} structureLength 
 * 
 * @returns {number} 
 */
function _radialAngle(st, structureLength) {
  if (structureLength === 0) {
    return 0;
  } else if (st.isOutermostStem()) {
    return 0;
  }
  let p = (st.position5 + st.position3 - 1) / 2;
  return ((2 * Math.PI) * (p / structureLength)) - Math.PI;
}

/**
 * @param {Stem} st 
 * 
 * @returns {number} 
 */
function _numBasesInLoop(st) {
  let n = 0;
  if (!st.isOutermostStem()) {
    n += 2;
  }
  let it = st.loopIterator();
  let ur = it.next().value;
  n += ur.size;
  let next = it.next();
  while (!next.done) {
    n += 2;
    ur = it.next().value;
    n += ur.size;
    next = it.next();
  }
  return n;
}

/**
 * @param {UnpairedRegion} ur 
 * @param {Array<number>} stretches3 
 * @param {number} stretch 
 */
function _setStretchForUnpairedRegion(ur, stretches3, stretch) {
  let positions = ur.size + 1;
  let p = ur.boundingPosition5;
  if (p === 0) {
    p++;
    positions--;
  }
  while (p < ur.boundingPosition3) {
    stretches3[p - 1] = stretch / positions;
    p++;
  }
}

const _ONE_BRANCH_RADIATION = Math.PI;

/**
 * Assumes that the loop of the given stem has one branch.
 * 
 * @param {Stem} st 
 * @param {Array<number>} stretches3 
 */
function _radiateOneBranch(st, stretches3) {
  if (st.isOutermostStem()) {
    return;
  }
  let urSmaller = st.firstUnpairedRegionInLoop;
  let urBigger = st.lastUnpairedRegionInLoop;
  if (urBigger.size < urSmaller.size) {
    let urTemp = urSmaller;
    urSmaller = urBigger;
    urBigger = urTemp;
  }
  let length = (_ONE_BRANCH_RADIATION / Math.PI) * urBigger.size;
  if (urSmaller.size < length) {
    _setStretchForUnpairedRegion(
      urSmaller,
      stretches3,
      length - urSmaller.size,
    );
  }
}

const _MULTIPLE_BRANCHES_SPREAD = 4;
const _MULTIPLE_BRANCHES_SPREAD_ANGLE = Math.PI;

/**
 * Assumes that the loop of the given stem has multiple branches.
 * 
 * @param {Stem} st 
 * @param {Array<number>} stretches3 
 */
function _spreadMultipleBranches(st, stretches3) {
  st.unpairedRegionsInLoop().forEach(ur => {
    let st5 = ur.boundingStem5;
    let st3 = ur.boundingStem3;
    if (!st5.isOutermostStem() && !st3.isOutermostStem()) {
      let angle5 = _radialAngle(st5, stretches3.length);
      let angle3 = _radialAngle(st3, stretches3.length);
      if (st5.isOuterTo(st3)) {
        angle5 += Math.PI;
      } else if (st3.isOuterTo(st5)) {
        angle3 += Math.PI;
      }
      angle3 = normalizeAngle(angle3, angle5);
      if (angle3 - angle5 < _MULTIPLE_BRANCHES_SPREAD_ANGLE) {
        if (ur.size < _MULTIPLE_BRANCHES_SPREAD) {
          _setStretchForUnpairedRegion(
            ur,
            stretches3,
            _MULTIPLE_BRANCHES_SPREAD - ur.size,
          );
        }
      }
    }
  });
}

const _MULTIPLE_BRANCHES_RADIATION = Math.PI / 2;

/**
 * Assumes that the loop of the given stem has multiple branches.
 * 
 * @param {Stem} st 
 * @param {Array<number>} stretches3 
 */
function _radiateMultipleBranchesOutward(st, stretches3) {
  let remainingBases = _numBasesInLoop(st);
  remainingBases -= st.firstUnpairedRegionInLoop.size;
  remainingBases -= st.lastUnpairedRegionInLoop.size;
  remainingBases -= 4;
  let circumference = (Math.PI / (Math.PI - _MULTIPLE_BRANCHES_RADIATION)) * remainingBases;
  let length = (circumference * (_MULTIPLE_BRANCHES_RADIATION / (2 * Math.PI))) - 2;
  length = Math.max(
    length,
    st.firstUnpairedRegionInLoop.size,
    st.lastUnpairedRegionInLoop.size,
  );
  _setStretchForUnpairedRegion(
    st.firstUnpairedRegionInLoop,
    stretches3,
    length - st.firstUnpairedRegionInLoop.size,
  );
  _setStretchForUnpairedRegion(
    st.lastUnpairedRegionInLoop,
    stretches3,
    length - st.lastUnpairedRegionInLoop.size,
  );
}

/**
 * Assumes that the loop of the given stem has multiple branches.
 * 
 * @param {Stem} st 
 * @param {Array<number>} stretches3 
 */
function _radiateMultipleBranches(st, stretches3) {
  if (st.isOutermostStem()) {
    _spreadMultipleBranches(st, stretches3);
    return;
  }
  let outerAngle = _radialAngle(st, stretches3.length);
  outerAngle += Math.PI;
  let firstAngle = _radialAngle(st.firstStemInLoop, stretches3.length);
  let lastAngle = _radialAngle(st.lastStemInLoop, stretches3.length);
  let firstExceeded = normalizeAngle(firstAngle, outerAngle) - outerAngle > _MULTIPLE_BRANCHES_RADIATION;
  let lastExceeded = normalizeAngle(outerAngle, lastAngle) - lastAngle > _MULTIPLE_BRANCHES_RADIATION;
  if (firstExceeded && lastExceeded) {
    _radiateMultipleBranchesOutward(st, stretches3);
    return;
  }
  _spreadMultipleBranches(st, stretches3);
}

function _radiateLoop(st, stretches3) {
  if (st.numBranches === 1) {
    _radiateOneBranch(st, stretches3);
  } else if (st.numBranches > 1) {
    _radiateMultipleBranches(st, stretches3);
  }
  st.stemsInLoop().forEach(ist => {
    _radiateLoop(ist, stretches3);
  });
}

/**
 * Will not radiate any stems if there are knots in the structure.
 * 
 * @param {Array<number|null>} partners The secondary structure.
 * 
 * @returns {Array<number>} 3' base stretches to radiate the stems.
 */
function radiateStems(partners) {
  let stretches3 = [];
  partners.forEach(p => stretches3.push(0));
  if (isKnotless(partners)) {
    let gps = new GeneralStrictLayoutProps();
    let pbps = [];
    partners.forEach(p => pbps.push(new StrictLayoutPerBaseProps()));
    let st = new Stem(0, partners, gps, pbps);
    _radiateLoop(st, stretches3);
  }
  return stretches3;
}

export {
  radiateStems,

  // these are only exported to aid testing
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
};
