import Numbering from './Numbering';
import createNodeSVG from './createNodeSVG';
import createUUIDforSVG from './createUUIDforSVG';
import angleBetween from './angleBetween';

it('_lineCoordinates', () => {
  let lcs = Numbering._lineCoordinates(1.1, -2, 4 * Math.PI / 3, 4.6, 8.05);
  expect(lcs.x1).toBeCloseTo(-1.200000000000002, 6);
  expect(lcs.y1).toBeCloseTo(-5.9837168574084165, 6);
  expect(lcs.x2).toBeCloseTo(-5.225000000000006, 6);
  expect(lcs.y2).toBeCloseTo(-12.955221357873146, 6);
});

it('_textPositioning', () => {

  /* These tests assume that the text padding is 4. */

  /* A line inside each quadrant. */

  /* A line at each quadrant border. */
  
});

it('basic test of create static method', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 10, 2, 3, Math.PI / 3);
  
  expect(n.number).toBe(10);
  expect(n._text.text()).toBe('10');

  let x1 = n._line.attr('x1');
  let y1 = n._line.attr('y1');
  expect(angleBetween(2, 3, x1, y1)).toBeCloseTo(Math.PI / 3, 6);
});

it('basic test of constructor', () => {
  let svg = createNodeSVG();
  let text = svg.text(add => add.tspan('12'));
  text.id(createUUIDforSVG());
  let line = svg.line(1, 2, 3, 4);
  text.id(createUUIDforSVG());
  expect(() => new Numbering(text, line, 5, 6)).not.toThrow();
});

it('_validateText', () => {
  let svg = createNodeSVG();
  let line = svg.line(1, 2, 3, 4);

  // valid text
  let text = svg.text(add => add.tspan('-2'));
  text.id(createUUIDforSVG());
  expect(() => new Numbering(text, line, 0, 0)).not.toThrow();

  /* It does not seem possible using the SVG.js framework to create an element
  with no ID or an empty string for an ID. */

  // ID is not a string
  text = svg.text(add => add.tspan('10'));
  text.id(2);
  expect(() => new Numbering(text, line, 3, 4)).toThrow();

  // text that is not a number
  text = svg.text(add => add.tspan('asdf'));
  text.id(createUUIDforSVG());
  expect(() => new Numbering(text, line, 5, 6));

  // text that is a number but not an integer
  text = svg.text(add => add.tspan('1.4'));
  expect(() => new Numbering(text, line, -1, -2));
});

it('id getter', () => {
  let svg = createNodeSVG();
  let text = svg.text(add => add.tspan('1'));
  let textId = createUUIDforSVG();
  text.id(textId);
  let line = svg.line(7, 8, 9, 0);
  line.id(createUUIDforSVG());
  let n = new Numbering(text, line, 8, 7);
  expect(n.id).toBe(textId);
});

it('_validateLine', () => {
  let svg = createNodeSVG();
  let text = svg.text(add => add.tspan('6'));
  text.id(createUUIDforSVG());

  // valid line
  let line = svg.line(0, 2, 3, 8);
  line.id(createUUIDforSVG())
  expect(() => new Numbering(text, line, -2, -5)).not.toThrow();

  /* It does not seem possible using the SVG.js framework to create an element
  with no ID or an empty string for an ID. */

  // ID is not a string
  line = svg.line(-1, -2, 3, 4);
  line.id(3);
  expect(() => new Numbering(text, line, -1, 0)).toThrow();
});
