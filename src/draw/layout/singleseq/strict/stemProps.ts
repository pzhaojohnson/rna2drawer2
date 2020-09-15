import { PerBaseStrictLayoutProps as PerBaseProps } from './PerBaseStrictLayoutProps';

export function resetStemProps(props: PerBaseProps) {
  let defaults = new PerBaseProps();
  props.flipStem = defaults.flipStem;
  props.loopShape = defaults.loopShape;
  props.triangleLoopHeight = defaults.triangleLoopHeight;
}

export function copyStemProps(fromProps: PerBaseProps, toProps: PerBaseProps) {
  toProps.flipStem = fromProps.flipStem;
  toProps.loopShape = fromProps.loopShape;
  toProps.triangleLoopHeight = fromProps.triangleLoopHeight;
}
