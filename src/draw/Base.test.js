import Base from './Base';
import createNodeSVG from './createNodeSVG';
import createUUIDforSVG from './createUUIDforSVG';
import normalizeAngle from './normalizeAngle';

it('fromSavedState static method valid saved state', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);

  // no highlighting, outline, numbering, or annotations
  let savableState = b1.savableState();
  let b2 = Base.fromSavedState(savableState, svg, Math.PI / 3);
  expect(b2._text.id()).toBe(b1._text.id());
  expect(b2.letter).toBe(b1.letter);
  expect(b2.hasHighlighting()).toBeFalsy();
  expect(b2.hasOutline()).toBeFalsy();
  expect(b2.hasNumbering()).toBeFalsy();
  expect(b2.hasNoAnnotations()).toBeTruthy();

  // with highlighting, outline, numbering, and annotations
  let highlighting = b1.addCircleHighlighting(svg);
  let outline = b1.addCircleOutline(svg);
  let numbering = b1.addNumbering(svg, 3, Math.PI / 3);
  let annotation1 = b1.addCircleAnnotation(svg);
  let annotation2 = b1.addCircleAnnotation(svg);
  savableState = b1.savableState();
  let b3 = Base.fromSavedState(savableState, svg, Math.PI / 3);
  expect(b3._text.id()).toBe(b1._text.id());
  expect(b3.letter).toBe(b1.letter);
  expect(b3.highlighting._circle.id()).toBe(highlighting._circle.id());
  expect(b3.outline._circle.id()).toBe(outline._circle.id());
  expect(b3.numbering._text.id()).toBe(numbering._text.id());
  expect(b3.numbering._line.id()).toBe(numbering._line.id());
  expect(b3._annotations[0]._circle.id()).toBe(annotation1._circle.id());
  expect(b3._annotations[1]._circle.id()).toBe(annotation2._circle.id());
});

it('fromSavedState static method invalid class name', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1, 2);
  let savableState = b.savableState();

  // no class name defined
  delete savableState.className;
  expect(() => Base.fromSavedState(savableState, svg, Math.PI / 3)).toThrow();

  // class name is not a string
  savableState.className = 5;
  expect(() => Base.fromSavedState(savableState, svg, Math.PI / 3)).toThrow();

  // class name is an empty string
  savableState.className = '';
  expect(() => Base.fromSavedState(savableState, svg, Math.PI / 3)).toThrow();

  // class name is not Base
  savableState.className = 'Bse';
  expect(() => Base.fromSavedState(savableState, svg, Math.PI / 3)).toThrow();
});

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

it('letter getter and setter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1, 2);
  expect(b.letter).toBe('A');

  b.letter = 'i';
  expect(b.letter).toBe('i');

  // empty string
  expect(() => { b.letter = ''; }).toThrow();

  // more than one character
  expect(() => { b.letter = 'abc'; }).toThrow();
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

it('fontFamily getter and setter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 0.5, 1.9);
  b.fontFamily = 'Consolas';

  // check getter
  expect(b.fontFamily).toBe('Consolas');

  // check actual value
  expect(b._text.attr('font-family')).toBe('Consolas');
});

it('fontSize getter and setter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  b.fontSize = 22.5;

  // check getter
  expect(b.fontSize).toBeCloseTo(22.5, 6);

  // check actual value
  expect(b._text.attr('font-size')).toBeCloseTo(22.5, 6);
});

it('fontWeight getter and setter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  
  // settings to a string
  b.fontWeight = 'bold';

  // check getter
  expect(b.fontWeight).toBe('bold');

  // check actual value
  expect(b._text.attr('font-weight')).toBe('bold');

  // setting to a number
  b.fontWeight = 200;

  // check getter
  expect(b.fontWeight).toBeCloseTo(200, 6);

  // check actual value
  expect(b._text.attr('font-weight')).toBeCloseTo(200, 6);
});

it('fontStyle getter and setter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  b.fontStyle = 'italic';

  // check getter
  expect(b.fontStyle).toBe('italic');

  // check actual value
  expect(b._text.attr('font-style')).toBe('italic');
});

it('bindMouseover method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  let v = false;
  b.bindMouseover(e => { v = true; });
  b._text.fire('mouseover');
  expect(v).toBeTruthy();
});

it('bindMouseout method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  let v = false;
  b.bindMouseout(e => { v = true; });
  b._text.fire('mouseout');
  expect(v).toBeTruthy();
});

it('bindMousedown method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  let v = false;
  b.bindMousedown(e => { v = true; });
  b._text.fire('mousedown');
  expect(v).toBeTruthy();
});

it('bindDblclick method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  let v = false;
  b.bindDblclick(e => { v = true; });
  b._text.fire('dblclick');
  expect(v).toBeTruthy();
});

it('cursor getter and setter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  b.cursor = 'pointer';

  // check getter
  expect(b.cursor).toBe('pointer');

  // check actual value
  expect(b._text.css('cursor')).toBe('pointer');
});

it('numAnnotations getter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  expect(b.numAnnotations).toBe(0);
  b.addCircleAnnotation(svg);
  let ann2 = b.addCircleAnnotation(svg);
  b.addCircleAnnotation(svg);
  expect(b.numAnnotations).toBe(3);
  b.removeAnnotationById(ann2.id);
  expect(b.numAnnotations).toBe(2);
  b.removeAnnotations();
  expect(b.numAnnotations).toBe(0);
});

it('hasNoAnnotations method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  expect(b.hasNoAnnotations()).toBeTruthy();
  b.addCircleAnnotation(svg);
  let ann2 = b.addCircleAnnotation(svg);
  b.addCircleAnnotation(svg);
  expect(b.hasNoAnnotations()).toBeFalsy();
  b.removeAnnotationById(ann2.id);
  expect(b.hasNoAnnotations()).toBeFalsy();
  b.removeAnnotations();
  expect(b.hasNoAnnotations()).toBeTruthy();
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
