import NormalizedBaseCoordinates from './NormalizedBaseCoordinates';

export interface StemInterface {
  readonly position5: number;
  readonly position3: number;
  readonly positionTop5: number;
  readonly positionTop3: number;
  readonly size: number;
  loopIterator(): Iterator<(UnpairedRegionInterface | StemInterface)>;
  readonly numBranches: number;
  firstUnpairedRegionInLoop: UnpairedRegionInterface;
  lastUnpairedRegionInLoop: UnpairedRegionInterface;
  unpairedRegionsInLoop(): UnpairedRegionInterface[];
  firstStemInLoop: StemInterface | null;
  lastStemInLoop: StemInterface | null;
  stemsInLoop(): StemInterface[];
  xBottomCenter: number;
  yBottomCenter: number;
  angle: number;
  reverseAngle: number;
  width: number;
  height: number;
  loopLength: number;
  xTopCenter: number;
  yTopCenter: number;
  xBottomLeft: number;
  yBottomLeft: number;
  xBottomRight: number;
  yBottomRight: number;
  xTopLeft: number;
  yTopLeft: number;
  xTopRight: number;
  yTopRight: number;
  baseCoordinates5(): NormalizedBaseCoordinates;
  baseCoordinatesTop5(): NormalizedBaseCoordinates;
  baseCoordinates3(): NormalizedBaseCoordinates;
  baseCoordinatesTop3(): NormalizedBaseCoordinates;
  isOuterTo(st: StemInterface): boolean;
  isOutermostStem(): boolean;
  hasHairpinLoop(): boolean;
  hasRoundLoop(): boolean;
  hasTriangleLoop(): boolean;
  triangleLoopHeight: number;
  isFlipped(): boolean;
  baseCoordinates(): NormalizedBaseCoordinates[];
  flippedBaseCoordinates(): NormalizedBaseCoordinates[];
}

export interface UnpairedRegionInterface {
  readonly boundingStem5: StemInterface;
  readonly boundingStem3: StemInterface;
  readonly boundingPosition5: number;
  readonly boundingPosition3: number;
  boundingStemOutwardAngle5: number;
  boundingStemOutwardAngle3: number;
  baseCoordinatesBounding5(): NormalizedBaseCoordinates;
  baseCoordinatesBounding3(): NormalizedBaseCoordinates;
  readonly size: number;
  isHairpinLoop(): boolean;
  isDangling5(): boolean;
  isDangling3(): boolean;
  length: number;
  baseCoordinates(inOutermostLoop: boolean): NormalizedBaseCoordinates[];
}

export default StemInterface;
