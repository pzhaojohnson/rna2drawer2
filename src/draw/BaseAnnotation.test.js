import { CircleBaseAnnotation } from './BaseAnnotation';
import createNodeSVG from './createNodeSVG';

it('circle constructor', () => {
  let svg = createNodeSVG();

  // just see if constructor runs without errors
  let circle = svg.circle(10);
  expect(() => new CircleBaseAnnotation(circle, 0, 0, 0)).not.toThrow();
});
