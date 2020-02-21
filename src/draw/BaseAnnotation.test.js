import { CircleBaseAnnotation } from './BaseAnnotation';
import createNodeSVG from './createNodeSVG';
import createUUIDforSVG from './createUUIDforSVG';

it('circle constructor', () => {
  let svg = createNodeSVG();

  // just see if constructor runs without errors
  let circle = svg.circle(10);
  expect(() => new CircleBaseAnnotation(circle, 0, 0, 0)).not.toThrow();
});

it('circle _validateCircle', () => {
  let svg = createNodeSVG();
  
  // valid circle
  let circle = svg.circle(10);
  circle.attr({ 'id': createUUIDforSVG() });
  expect(() => new CircleBaseAnnotation(circle, 0, 0, 0)).not.toThrow();

  // ID that is not a string
  circle = svg.circle(10);
  circle.attr({ 'id': 2 });
  expect(() => new CircleBaseAnnotation(circle, 0, 0, 0)).toThrow();

  /* It does not seem possible to create an element without an ID with the
  SVG.js framework. */
  
});
