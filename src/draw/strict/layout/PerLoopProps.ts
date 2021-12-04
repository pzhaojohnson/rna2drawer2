import { PerBaseStrictLayoutProps as PerBaseProps } from 'Draw/strict/layout/PerBaseStrictLayoutProps';

// the subset of per base props pertaining to loops
export type PerLoopProps = {
  loopShape: string;
  triangleLoopHeight: number;
}

// extracts the per loop props from the given per base props
export function perLoopProps(pbps: PerBaseProps): PerLoopProps {
  return {
    loopShape: pbps.loopShape,
    triangleLoopHeight: pbps.triangleLoopHeight,
  };
}

// sets the per loop props of the given per base props
export function setPerLoopProps(pbps: PerBaseProps, plps: PerLoopProps) {
  pbps.loopShape = plps.loopShape;
  pbps.triangleLoopHeight = plps.triangleLoopHeight;
}

// resets the per loop props of the given per base props
// to their default values
export function resetLoopProps(pbps: PerBaseProps) {
  let defaults = new PerBaseProps();
  pbps.loopShape = defaults.loopShape;
  pbps.triangleLoopHeight = defaults.triangleLoopHeight;
}
