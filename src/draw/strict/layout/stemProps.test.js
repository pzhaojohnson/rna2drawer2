import { PerBaseStrictLayoutProps as PerBaseProps } from './PerBaseStrictLayoutProps';
import { resetStemProps, copyStemProps } from './stemProps';

it('resetStemProps function', () => {
  let defaults = new PerBaseProps();
  let props = new PerBaseProps();
  props.flipStem = !defaults.flipStem;
  props.loopShape = 'triangle';
  expect(defaults.loopShape).not.toBe(props.loopShape);
  props.triangleLoopHeight = defaults.triangleLoopHeight + 123.123;
  resetStemProps(props);
  expect(props).toStrictEqual(defaults);
});

it('copyStemProps function', () => {
  let fromProps = new PerBaseProps();
  let toProps = new PerBaseProps();
  fromProps.flipStem = !toProps.flipStem;
  fromProps.loopShape = 'triangle';
  expect(toProps.loopShape).not.toBe(fromProps.loopShape);
  fromProps.triangleLoopHeight = toProps.triangleLoopHeight + 50;
  copyStemProps(fromProps, toProps);
  expect(toProps).toStrictEqual(fromProps);
});
