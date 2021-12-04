import { PerBaseStrictLayoutProps as PerBaseProps } from 'Draw/strict/layout/PerBaseStrictLayoutProps';

// the subset of per base props pertaining to stems
export type PerStemProps = {
  flipStem: boolean;
  loopShape: string;
  triangleLoopHeight: number;
}

// extracts the per stem props from the given per base props
export function perStemProps(pbps: PerBaseProps): PerStemProps {
  return {
    flipStem: pbps.flipStem,
    loopShape: pbps.loopShape,
    triangleLoopHeight: pbps.triangleLoopHeight,
  };
}

// sets the per stem props of the given per base props
export function setPerStemProps(pbps: PerBaseProps, psps: PerStemProps) {
  pbps.flipStem = psps.flipStem;
  pbps.loopShape = psps.loopShape;
  pbps.triangleLoopHeight = psps.triangleLoopHeight;
}

// resets the per stem props of the given per base props
// to their default values
export function resetStemProps(pbps: PerBaseProps) {
  let defaults = new PerBaseProps();
  pbps.flipStem = defaults.flipStem;
  pbps.loopShape = defaults.loopShape;
  pbps.triangleLoopHeight = defaults.triangleLoopHeight;
}
