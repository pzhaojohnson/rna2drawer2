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

it('createOutOfView static method', () => {
  let svg = createNodeSVG();
  let b = Base.createOutOfView(svg, 'I');
  expect(b.letter).toBe('I');
  expect(b.xCenter < -50 || b.yCenter < -50).toBeTruthy();
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

it('savableState method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  
  // no highlighting, outline, numbering, or annotations
  let savableState = b.savableState();
  expect(savableState.className).toBe('Base');
  expect(savableState.text).toBe(b._text.id());
  expect(savableState.highlighting).toBe(undefined);
  expect(savableState.outline).toBe(undefined);
  expect(savableState.numbering).toBe(undefined);
  expect(savableState.annotations.length).toBe(0);

  // with highlighting, outline, numbering, and annotations
  let highlighting = b.addCircleHighlighting(svg);
  let outline = b.addCircleOutline(svg);
  let numbering = b.addNumbering(svg, 2, Math.PI / 3);
  let annotation1 = b.addCircleAnnotation(svg);
  let annotation2 = b.addCircleAnnotation(svg);
  savableState = b.savableState();
  expect(savableState.className).toBe('Base');
  expect(savableState.text).toBe(b._text.id());
  expect(savableState.highlighting.className).toBe('CircleBaseAnnotation');
  expect(savableState.outline.className).toBe('CircleBaseAnnotation');
  expect(savableState.numbering.className).toBe('Numbering');
  expect(savableState.annotations[0].className).toBe('CircleBaseAnnotation');
  expect(savableState.annotations[1].className).toBe('CircleBaseAnnotation');
});
