import Base from './Base';
import createNodeSVG from './createNodeSVG';
import createUUIDforSVG from './createUUIDforSVG';
import normalizeAngle from './normalizeAngle';

it('create', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1, 2);
  expect(b.letter).toEqual('A');
  expect(b.xCenter).toEqual(1);
  expect(b.yCenter).toEqual(2);
});

it('_validateText', () => {
  let svg = createNodeSVG();
  
  let text1 = svg.text('A');
  text1.attr({ 'id': createUUIDforSVG(), 'text-anchor': 'middle', 'dy': '0.4em' });
  expect(() => new Base(text1)).not.toThrow();

  let text2 = svg.text('UG');
  text2.attr({ 'id': createUUIDforSVG(), 'text-anchor': 'middle', 'dy': '0.4em' });
  expect(() => new Base(text2)).toThrow();

  let text3 = svg.text('');
  text3.attr({ 'id': createUUIDforSVG(), 'text-anchor': 'middle', 'dy': '0.4em' });
  expect(() => new Base(text3)).toThrow();

  let text4 = svg.text('C');
  text4.attr({ 'text-anchor': 'middle', 'dy': '0.4em' });
  expect(() => new Base(text4)).toThrow();

  let text5 = svg.text('A');
  text5.attr({ 'id': createUUIDforSVG(), 'dy': '0.4em' });
  expect(() => new Base(text5)).toThrow();

  let text6 = svg.text('U');
  text6.attr({ 'id': createUUIDforSVG(), 'text-anchor': 'middle' });
  expect(() => new Base(text6)).toThrow();
});

it('id', () => {
  let svg = createNodeSVG();
  let id = createUUIDforSVG();
  let text = svg.text('A');
  text.attr({ 'id': id, 'text-anchor': 'middle', 'dy': '0.4em' });
  let b = new Base(text);
  expect(b.id).toEqual(id);
});

it('letter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1, 2);
  expect(b.letter).toEqual('A');
});

it('move', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 0, 0);
  
  b.move(1, 2);
  expect(b.xCenter).toEqual(1);
  expect(b.yCenter).toEqual(2);

  b.move(5, 8);
  expect(b.xCenter).toEqual(5);
  expect(b.yCenter).toEqual(8);
});

it('distanceBetweenCenters', () => {
  let svg = createNodeSVG();
  let b0 = Base.create(svg, 'A', 1, 2);
  let b1 = Base.create(svg, 'U', 4, 6);
  expect(b0.distanceBetweenCenters(b1)).toBeCloseTo(5);
});

it('angleBetweenCenters', () => {
  let svg = createNodeSVG();
  let b0 = Base.create(svg, 'A', 1, 2);
  let b1 = Base.create(svg, 'U', 4, 5);
  let a = b0.angleBetweenCenters(b1);
  expect(normalizeAngle(a, 0)).toBeCloseTo(Math.PI / 4);
});
