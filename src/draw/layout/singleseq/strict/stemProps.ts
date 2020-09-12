import { PerBaseStrictLayoutProps as PerBaseProps } from './PerBaseStrictLayoutProps';

interface Stem {
  position5: number;
  position3: number;
  size: number;
}

export function resetStemProps(perBaseProps: PerBaseProps[], st: Stem) {
  let defaults = new PerBaseProps();
  let props = perBaseProps[st.position5 - 1];
  if (props) {
    props.flipStem = defaults.flipStem;
    props.loopShape = defaults.loopShape;
    props.triangleLoopHeight = defaults.triangleLoopHeight;
  }
}

export function copyStemProps(perBaseProps: PerBaseProps[], fromStem: Stem, toStem: Stem) {
  let fromProps = perBaseProps[fromStem.position5 - 1];
  let toProps = perBaseProps[toStem.position5 - 1];
  if (fromProps && toProps) {
    toProps.flipStem = fromProps.flipStem;
    toProps.loopShape = fromProps.loopShape;
    toProps.triangleLoopHeight = fromProps.triangleLoopHeight;
  }
}
