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

it('reposition with zero displacement', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 10, 8);

  // check position getters
  expect(cba.xCenter).toBeCloseTo(10, 6);
  expect(cba.yCenter).toBeCloseTo(8, 6);

  // check actual position
  expect(cba._circle.attr('cx')).toBeCloseTo(10, 6);
  expect(cba._circle.attr('cy')).toBeCloseTo(8, 6);

  cba.reposition(12, 15, 0);

  // check position getters
  expect(cba.xCenter).toBeCloseTo(12, 6);
  expect(cba.yCenter).toBeCloseTo(15, 6);

  // check actual position
  expect(cba._circle.attr('cx')).toBeCloseTo(12, 6);
  expect(cba._circle.attr('cy')).toBeCloseTo(15, 6);
});

it('circle reposition with some displacement', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 10, 8);

  // add some displacement
  cba.shift(2.5, -1.2, 10, 8, Math.PI / 3);

  // check position getters
  expect(cba.xCenter).toBeCloseTo(12.5, 6);
  expect(cba.yCenter).toBeCloseTo(6.8, 6);

  // check actual position
  expect(cba._circle.attr('cx')).toBeCloseTo(12.5, 6);
  expect(cba._circle.attr('cy')).toBeCloseTo(6.8, 6);

  cba.reposition(12, 15, 4 * Math.PI / 3);

  // check position getters
  expect(cba.xCenter).toBeCloseTo(9.500000000000002, 6);
  expect(cba.yCenter).toBeCloseTo(16.200000000000003, 6);

  // check actual position
  expect(cba._circle.attr('cx')).toBeCloseTo(9.500000000000002, 6);
  expect(cba._circle.attr('cy')).toBeCloseTo(16.200000000000003, 6);
});
