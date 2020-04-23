import { CircleBaseAnnotation, BaseAnnotation } from './BaseAnnotation';
import createNodeSVG from './createNodeSVG';

it('check that BaseAnnotation class members are unimplemented', () => {
  let svg = createNodeSVG();

  expect(() => BaseAnnotation.createNondisplaced(svg, 1, 2)).toThrow();

  let ba = new BaseAnnotation();
  expect(() => ba.type).toThrow();
  expect(() => ba.id).toThrow();
  expect(() => ba.xCenter).toThrow();
  expect(() => ba.yCenter).toThrow();
  expect(() => ba.displacementLength).toThrow();
  expect(() => ba.displacementAngle).toThrow();
  expect(() => ba.shift(1, 2, 3, 4, 5)).toThrow();
  expect(() => ba.reposition(7, 8, 9)).toThrow();
  expect(() => ba.insertBefore(svg.rect(10))).toThrow();
  expect(() => ba.insertAfter(svg.rect(10))).toThrow();
  expect(() => ba.remove()).toThrow();
  expect(() => ba.savableState()).toThrow();
});

it('circle fromSavedState static method valid saved state', () => {
  let svg = createNodeSVG();
  let cba1 = CircleBaseAnnotation.createNondisplaced(svg, 5, 8);
  cba1.shift(2, 3, 5, 8, Math.PI / 3);
  let savableState = cba1.savableState();
  let cba2 = CircleBaseAnnotation.fromSavedState(savableState, svg, 5, 8, Math.PI / 3);

  expect(cba2._circle.id()).toBe(cba1._circle.id());
  expect(cba2.displacementLength).toBeCloseTo(cba1.displacementLength, 6);
  expect(cba2.displacementAngle).toBeCloseTo(cba1.displacementAngle, 6);
});

it('circle fromSavedState static method invalid saved state', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 8);
  cba.shift(2, 3, 5, 8, Math.PI / 3);
  let savableState = cba.savableState();
  
  // no class name defined
  delete savableState.className;
  
  expect(() => CircleBaseAnnotation.fromSavedState(
    savableState, svg, 5, 8, Math.PI / 3)
  ).toThrow();

  // class name is not a string
  savableState.className = -19;

  expect(() => CircleBaseAnnotation.fromSavedState(
    savableState, svg, 5, 8, Math.PI / 3)
  ).toThrow();

  // class name is an empty string
  savableState.className = '';

  expect(() => CircleBaseAnnotation.fromSavedState(
    savableState, svg, 5, 8, Math.PI / 3)
  ).toThrow();

  // class name is not CircleBaseAnnotation
  savableState.className = 'CircleBseAnnotation';

  expect(() => CircleBaseAnnotation.fromSavedState(
    savableState, svg, 5, 8, Math.PI / 3)
  ).toThrow();
});

it('circle createNondisplaced', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 8);

  // check position getters
  expect(cba.xCenter).toBeCloseTo(5, 6);
  expect(cba.yCenter).toBeCloseTo(8, 6);

  // check actual position
  expect(cba._circle.attr('cx')).toBeCloseTo(5, 6);
  expect(cba._circle.attr('cy')).toBeCloseTo(8, 6);

  expect(cba.displacementLength).toBeCloseTo(0, 6);
  expect(typeof(cba.displacementAngle)).toBe('number');
  expect(isFinite(cba.displacementAngle)).toBeTruthy();
})

it('circle constructor', () => {
  let svg = createNodeSVG();

  // just see if constructor runs without errors
  let circle = svg.circle(10);
  expect(() => new CircleBaseAnnotation(circle, 0, 0, 0)).not.toThrow();
});

it('type getter', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
  expect(cba.type).toBe('circle');
})

it('circle _validateCircle', () => {
  let svg = createNodeSVG();
  
  // valid circle
  let circle = svg.circle(10);
  circle.id();
  expect(() => new CircleBaseAnnotation(circle, 0, 0, 0)).not.toThrow();

  // ID that is not a string
  circle = svg.circle(10);
  circle.attr({ 'id': 2 });
  expect(() => new CircleBaseAnnotation(circle, 0, 0, 0)).toThrow();

  /* It does not seem possible to create an element without an ID with the
  SVG.js framework. */

});

it('circle id getter', () => {
  let svg = createNodeSVG();
  let circle = svg.circle(8);
  let id = 'a_unique_id';
  circle.id(id);
  let cba = new CircleBaseAnnotation(circle, 0, 0, 0);
  expect(cba.id).toBe(id);
});

it('circle xCenter and yCenter', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 3, 4);
  expect(cba.xCenter).toBeCloseTo(3, 6);
  expect(cba.yCenter).toBeCloseTo(4, 6);
});

it('circle displacement getters', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 4);
  expect(cba.displacementLength).toBeCloseTo(0);
  expect(typeof(cba.displacementAngle)).toBe('number');
  expect(isFinite(cba.displacementAngle)).toBeTruthy();
});

it('circle shift', () => {
  let svg = createNodeSVG();

  // starting with no displacement
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 5, 4);

  // check position getters
  expect(cba.xCenter).toBeCloseTo(5, 6);
  expect(cba.yCenter).toBeCloseTo(4, 6);

  // check actual position
  expect(cba._circle.attr('cx')).toBeCloseTo(5, 6);
  expect(cba._circle.attr('cy')).toBeCloseTo(4, 6);

  expect(cba.displacementLength).toBeCloseTo(0, 6);
  expect(typeof(cba.displacementAngle)).toBe('number');
  expect(isFinite(cba.displacementAngle)).toBeTruthy();

  cba.shift(-5, 0.5, 5, 4, 0);

  // check position getters
  expect(cba.xCenter).toBeCloseTo(0, 6);
  expect(cba.yCenter).toBeCloseTo(4.5, 6);

  // check actual position
  expect(cba._circle.attr('cx')).toBeCloseTo(0, 6);
  expect(cba._circle.attr('cy')).toBeCloseTo(4.5, 6);

  expect(cba.displacementLength).toBeCloseTo(5.024937810560445, 6);
  expect(cba.displacementAngle).toBeCloseTo(3.0419240010986313, 6);

  cba.shift(2, -4, -2, 8, Math.PI / 3);

  // check position getters
  expect(cba.xCenter).toBeCloseTo(2, 6);
  expect(cba.yCenter).toBeCloseTo(0.5, 6);

  // check actual position
  expect(cba._circle.attr('cx')).toBeCloseTo(2, 6);
  expect(cba._circle.attr('cy')).toBeCloseTo(0.5, 6);

  expect(cba.displacementLength).toBeCloseTo(8.5, 6);
  expect(cba.displacementAngle).toBeCloseTo(4.155148755441821, 6);
});

it('circle reposition with zero displacement', () => {
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

it('insertBefore and insertAfter', () => {
  let svg = createNodeSVG();
  
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
  let rect = svg.rect(10);
  expect(cba._circle.position()).toBeLessThan(rect.position());

  cba.insertAfter(rect);
  expect(cba._circle.position()).toBeGreaterThan(rect.position());

  let circle = svg.circle(5);
  let line = svg.line(1, 2, 3, 4);
  cba.insertAfter(circle);
  expect(cba._circle.position()).toBeGreaterThan(circle.position());
  expect(cba._circle.position()).toBeLessThan(line.position());
});

it('circle radius getter and setter', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
  cba.radius = 8;
  
  // check getter
  expect(cba.radius).toBeCloseTo(8, 6);
  
  // check actual value
  expect(cba._circle.attr('r')).toBeCloseTo(8, 6);
});

it('circle fill getter and setter', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
  cba.fill = '#654321';
  
  // check getter
  expect(cba.fill).toBe('#654321');
  
  // check actual value
  expect(cba._circle.attr('fill')).toBe('#654321');
});

it('circle fillOpacity getter and setter', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
  cba.fillOpacity = 0.6;
  
  // check getter
  expect(cba.fillOpacity).toBeCloseTo(0.6, 6);
  
  // check actual value
  expect(cba._circle.attr('fill-opacity')).toBeCloseTo(0.6, 6);
});

it('circle stroke getter and setter', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
  cba.stroke = '#abcdef';
  
  // check getter
  expect(cba.stroke).toBe('#abcdef');
  
  // check actual value
  expect(cba._circle.attr('stroke')).toBe('#abcdef');
});

it('circle strokeWidth getter and setter', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
  cba.strokeWidth = 5;
  
  // check getter
  expect(cba.strokeWidth).toBeCloseTo(5, 6);
  
  // check actual value
  expect(cba._circle.attr('stroke-width')).toBeCloseTo(5, 6);
});

it('circle strokeOpacity getter and setter', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
  cba.strokeOpacity = 0.3;
  
  // check getter
  expect(cba.strokeOpacity).toBeCloseTo(0.3, 6);
  
  // check actual value
  expect(cba._circle.attr('stroke-opacity')).toBeCloseTo(0.3, 6);
});

it('circle remove method', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
  let circleId = cba._circle.id();
  expect(svg.findOne('#' + circleId)).not.toBe(null);

  cba.remove();

  expect(svg.findOne('#' + circleId)).toBe(null);
});

it('circle savableState method', () => {
  let svg = createNodeSVG();
  let cba = CircleBaseAnnotation.createNondisplaced(svg, 1, 2);
  let savableState = cba.savableState();
  expect(savableState.className).toBe('CircleBaseAnnotation');
  expect(savableState.circle).toBe(cba._circle.id());
});
