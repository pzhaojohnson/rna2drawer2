import Base from './Base';
import createNodeSVG from './createNodeSVG';
import createUUIDforSVG from './createUUIDforSVG';
import normalizeAngle from './normalizeAngle';
import Numbering from './Numbering';
import { CircleBaseAnnotation } from './BaseAnnotation';

it('mostRecentProps static method', () => {
  Base._mostRecentProps.fontFamily = 'Tahoe';
  Base._mostRecentProps.fontSize = 4.567;
  Base._mostRecentProps.fontWeight = 'bolder';
  Base._mostRecentProps.fontStyle = 'oblique';

  let mrps = Base.mostRecentProps();
  expect(mrps).not.toBe(Base._mostRecentProps);
  expect(mrps.fontFamily).toBe('Tahoe');
  expect(mrps.fontSize).toBeCloseTo(4.567, 6);
  expect(mrps.fontWeight).toBe('bolder');
  expect(mrps.fontStyle).toBe('oblique');
});

it('_applyMostRecentProps static method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'G', 3, 4);

  // set after creating base since create static method itself applies most recent properties
  Base._mostRecentProps.fontFamily = 'Tahoe';
  Base._mostRecentProps.fontSize = 4.567;
  Base._mostRecentProps.fontWeight = 'bolder';
  Base._mostRecentProps.fontStyle = 'oblique';

  Base._applyMostRecentProps(b);
  expect(b.fontFamily).toBe('Tahoe');
  expect(b.fontSize).toBeCloseTo(4.567, 6);
  expect(b.fontWeight).toBe('bolder');
  expect(b.fontStyle).toBe('oblique');
});

it('_copyPropsToMostRecent static method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'G', 4, 6);
  b.fontFamily = 'Impact';
  b.fontSize = 4.447;
  b.fontWeight = 'lighter';
  b.fontStyle = 'oblique';

  Base._copyPropsToMostRecent(b);
  let mrps = Base.mostRecentProps();
  expect(mrps.fontFamily).toBe('Impact');
  expect(mrps.fontSize).toBeCloseTo(4.447, 6);
  expect(mrps.fontWeight).toBe('lighter');
  expect(mrps.fontStyle).toBe('oblique');
});

it('fromSavedState static method valid saved state', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);

  // no highlighting, outline, numbering, or annotations
  let savableState = b1.savableState();
  let b2 = Base.fromSavedState(savableState, svg, Math.PI / 3);
  expect(b2._text.id()).toBe(b1._text.id());
  expect(b2.character).toBe(b1.character);
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
  expect(b3.character).toBe(b1.character);
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

it('fromSavedState static method updates most recent properties', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'G', 4, 6);
  b.fontFamily = 'Impact';
  b.fontSize = 4.447;
  b.fontWeight = 'lighter';
  b.fontStyle = 'oblique';

  let savedState = b.savableState();
  Base.fromSavedState(savedState, svg, 0);
  let mrps = Base.mostRecentProps();
  expect(mrps.fontFamily).toBe('Impact');
  expect(mrps.fontSize).toBeCloseTo(4.447, 6);
  expect(mrps.fontWeight).toBe('lighter');
  expect(mrps.fontStyle).toBe('oblique');
});

it('create static method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1, 2);
  expect(b.character).toEqual('A');
  expect(b.xCenter).toEqual(1);
  expect(b.yCenter).toEqual(2);
});

it('create static method applies most recent properties', () => {
  Base._mostRecentProps.fontFamily = 'Tahoe';
  Base._mostRecentProps.fontSize = 4.567;
  Base._mostRecentProps.fontWeight = 'bolder';
  Base._mostRecentProps.fontStyle = 'oblique';

  let svg = createNodeSVG();
  let b = Base.create(svg, 'G', 3, 4);
  expect(b.fontFamily).toBe('Tahoe');
  expect(b.fontSize).toBeCloseTo(4.567, 6);
  expect(b.fontWeight).toBe('bolder');
  expect(b.fontStyle).toBe('oblique');
});

it('createOutOfView static method', () => {
  let svg = createNodeSVG();
  let b = Base.createOutOfView(svg, 'I');
  expect(b.character).toBe('I');
  expect(b.xCenter < -50 || b.yCenter < -50).toBeTruthy();
});

it('basic test of constructor', () => {
  let svg = createNodeSVG();
  let text = svg.text(add => add.tspan('e'));
  text.id(createUUIDforSVG());

  text.attr({
    'x': 4.4,
    'y': 5.5,
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
  });
  
  expect(() => new Base(text)).not.toThrow();
});

it('_validateText method', () => {
  let svg = createNodeSVG();
  
  // valid case
  let text1 = svg.text('A');
  text1.id(createUUIDforSVG());
  text1.attr({ 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  expect(() => new Base(text1)).not.toThrow();

  // more than one character
  let text2 = svg.text('UG');
  text2.id(createUUIDforSVG());
  text2.attr({ 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  expect(() => new Base(text2)).toThrow();

  // empty string
  let text3 = svg.text('');
  text3.id(createUUIDforSVG());
  text3.attr({ 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  expect(() => new Base(text3)).toThrow();

  // ID is not a string
  let text4 = svg.text('C');
  text4.id(0.1234);
  text4.attr({ 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  expect(() => new Base(text4)).toThrow();

  // text-anchor is not middle
  let text5 = svg.text('A');
  text5.id(createUUIDforSVG());
  text5.attr({ 'dominant-baseline': 'middle' });
  expect(() => new Base(text5)).toThrow();

  // dominant-baseline is not middle
  let text6 = svg.text('U');
  text6.id(createUUIDforSVG());
  text6.attr({ 'text-anchor': 'middle' });
  expect(() => new Base(text6)).toThrow();
});

it('id getter', () => {
  let svg = createNodeSVG();
  let id = createUUIDforSVG();
  let text = svg.text('A');
  text.attr({ 'id': id, 'text-anchor': 'middle', 'dominant-baseline': 'middle' });
  let b = new Base(text);
  expect(b.id).toEqual(id);
});

it('character getter and setter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1, 2);
  expect(b.character).toBe('A');

  b.character = 'i';
  expect(b.character).toBe('i');

  // empty string
  expect(() => { b.character = ''; }).toThrow();

  // more than one character
  expect(() => { b.character = 'abc'; }).toThrow();
});

it('xCenter and yCenter getters', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', -1, -2);
  expect(b.xCenter).toBeCloseTo(-1, 6);
  expect(b.yCenter).toBeCloseTo(-2, 6);

  b.move(10.111, 12.4, Math.PI / 3, Math.PI / 5);
  expect(b.xCenter).toBeCloseTo(10.111, 6);
  expect(b.yCenter).toBeCloseTo(12.4, 6);
});

it('move with no highlighting, outline, numbering, or annotations', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 0, 0);
  
  b.move(1, 2, Math.PI / 3, 4 * Math.PI / 3);
  expect(b.xCenter).toEqual(1);
  expect(b.yCenter).toEqual(2);

  b.move(5, 8, Math.PI / 3, 4 * Math.PI / 3);
  expect(b.xCenter).toEqual(5);
  expect(b.yCenter).toEqual(8);
});

it('move with highlighting, outline, numbering, and annotations', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'G', 0.2, -0.5);
  let highlighting = b.addCircleHighlighting(svg);
  let outline = b.addCircleOutline(svg);
  let numbering = b.addNumbering(svg, 0, 4 * Math.PI / 3);
  let eNumbering = Numbering.create(svg, 0, b.xCenter, b.yCenter, 4 * Math.PI / 3);
  let annotation1 = b.addCircleAnnotation(svg);
  annotation1.shift(1, 2, b.xCenter, b.yCenter, Math.PI / 3);
  let annotation2 = b.addCircleAnnotation(svg);

  b.move(100.5, 300.111, 2 * Math.PI / 3, 5 * Math.PI / 3);
  eNumbering.reposition(100.5, 300.111, 5 * Math.PI / 3);
  
  expect(b.xCenter).toBeCloseTo(100.5, 6);
  expect(b.yCenter).toBeCloseTo(300.111, 6);

  expect(highlighting.xCenter).toBeCloseTo(100.5, 6);
  expect(highlighting.yCenter).toBeCloseTo(300.111, 6);

  expect(outline.xCenter).toBeCloseTo(100.5, 6);
  expect(outline.yCenter).toBeCloseTo(300.111, 6);

  expect(numbering._text.attr('x')).toBeCloseTo(eNumbering._text.attr('x'), 6);
  expect(numbering._text.attr('y')).toBeCloseTo(eNumbering._text.attr('y'), 6);
  expect(numbering._text.attr('text-anchor')).toBe(eNumbering._text.attr('text-anchor'));
  expect(numbering._text.attr('dy')).toBe(eNumbering._text.attr('dy'));

  expect(numbering._line.attr('x1')).toBeCloseTo(eNumbering._line.attr('x1'), 6);
  expect(numbering._line.attr('y1')).toBeCloseTo(eNumbering._line.attr('y1'), 6);
  expect(numbering._line.attr('x2')).toBeCloseTo(eNumbering._line.attr('x2'), 6);
  expect(numbering._line.attr('y2')).toBeCloseTo(eNumbering._line.attr('y2'), 6);

  expect(annotation1.xCenter).toBeCloseTo(99.26794919243112, 6);
  expect(annotation1.yCenter).toBeCloseTo(301.9770254037844, 6);

  expect(annotation2.xCenter).toBeCloseTo(100.5, 6);
  expect(annotation2.yCenter).toBeCloseTo(300.111, 6);
});

it('distanceBetweenCenters method', () => {
  let svg = createNodeSVG();
  let b0 = Base.create(svg, 'A', 1, 2);
  let b1 = Base.create(svg, 'U', 4, 6);
  expect(b0.distanceBetweenCenters(b1)).toBeCloseTo(5);
});

it('angleBetweenCenters method', () => {
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

  // updates most recent property
  expect(Base.mostRecentProps().fontFamily).toBe('Consolas');
});

it('fontSize getter and setter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  b.fontSize = 22.5;

  // check getter
  expect(b.fontSize).toBeCloseTo(22.5, 6);

  // check actual value
  expect(b._text.attr('font-size')).toBeCloseTo(22.5, 6);

  // updates most recent property
  expect(Base.mostRecentProps().fontSize).toBeCloseTo(22.5, 6);
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

  // updates most recent property
  expect(Base.mostRecentProps().fontWeight).toBe(200);
});

it('fontStyle getter and setter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'A', 1.3, 1.4);
  b.fontStyle = 'italic';

  // check getter
  expect(b.fontStyle).toBe('italic');

  // check actual value
  expect(b._text.attr('font-style')).toBe('italic');

  // updates most recent property
  expect(Base.mostRecentProps().fontStyle).toBe('italic');
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

it('addCircleHighlighting method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);

  // no previous highlighting
  let highlighting1 = b.addCircleHighlighting(svg);
  let circleId1 = highlighting1._circle.id();
  expect(svg.findOne('#' + circleId1)).not.toBe(null);

  // removes previous highlighting
  let highlighting2 = b.addCircleHighlighting(svg);
  let circleId2 = highlighting2._circle.id();
  expect(svg.findOne('#' + circleId2)).not.toBe(null);
  expect(svg.findOne('#' + circleId1)).toBe(null);
});

it('addCircleHighlightingFromSavedState method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);

  // no previous highlighting
  let cba1 = CircleBaseAnnotation.createNondisplaced(svg, b.xCenter, b.yCenter);
  let savedState1 = cba1.savableState();
  let highlighting1 = b.addCircleHighlightingFromSavedState(savedState1, svg, Math.PI / 3);
  let circleId1 = highlighting1._circle.id();
  expect(svg.findOne('#' + circleId1)).not.toBe(null);

  // removes previous highlighting
  let cba2 = CircleBaseAnnotation.createNondisplaced(svg, b.xCenter, b.yCenter);
  let savedState2 = cba2.savableState();
  let highlighting2 = b.addCircleHighlightingFromSavedState(savedState2, svg, Math.PI / 3);
  let circleId2 = highlighting2._circle.id();
  expect(svg.findOne('#' + circleId2)).not.toBe(null);
  expect(svg.findOne('#' + circleId1)).toBe(null);
});

it('hasHighlighting method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);
  expect(b.hasHighlighting()).toBeFalsy();
  b.addCircleHighlighting(svg);
  expect(b.hasHighlighting()).toBeTruthy();
  b.removeHighlighting();
  expect(b.hasHighlighting()).toBeFalsy();
});

it('highlighting getter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);
  expect(b.highlighting).toBe(null);
  let highlighting = b.addCircleHighlighting(svg);
  expect(b.highlighting.id).toBe(highlighting.id);
  b.removeHighlighting();
  expect(b.highlighting).toBe(null);
});

it('removeHighlighting method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);
  
  b.addCircleHighlighting(svg);
  expect(b.hasHighlighting()).toBeTruthy();
  b.removeHighlighting();
  expect(b.hasHighlighting()).toBeFalsy();

  // remove when there is no highlighting
  expect(() => b.removeHighlighting()).not.toThrow();
  expect(b.hasHighlighting()).toBeFalsy();
});

it('addCircleOutline method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);

  // no previous outline
  let outline1 = b.addCircleOutline(svg);
  let circleId1 = outline1._circle.id();
  expect(svg.findOne('#' + circleId1)).not.toBe(null);

  // removes previous outline
  let outline2 = b.addCircleOutline(svg);
  let circleId2 = outline2._circle.id();
  expect(svg.findOne('#' + circleId2)).not.toBe(null);
  expect(svg.findOne('#' + circleId1)).toBe(null);
});

it('addCircleOutlineFromSavedState method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);

  // no previous outline
  let cba1 = CircleBaseAnnotation.createNondisplaced(svg, b.xCenter, b.yCenter);
  let savedState1 = cba1.savableState();
  let outline1 = b.addCircleOutlineFromSavedState(savedState1, svg, Math.PI / 3);
  let circleId1 = outline1._circle.id();
  expect(svg.findOne('#' + circleId1)).not.toBe(null);

  // removes previous outline
  let cba2 = CircleBaseAnnotation.createNondisplaced(svg, b.xCenter, b.yCenter);
  let savedState2 = cba2.savableState();
  let outline2 = b.addCircleOutlineFromSavedState(savedState2, svg, Math.PI / 3);
  let circleId2 = outline2._circle.id();
  expect(svg.findOne('#' + circleId2)).not.toBe(null);
  expect(svg.findOne('#' + circleId1)).toBe(null);
});

it('hasOutline method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);
  expect(b.hasOutline()).toBeFalsy();
  b.addCircleOutline(svg);
  expect(b.hasOutline()).toBeTruthy();
  b.removeOutline();
  expect(b.hasOutline()).toBeFalsy();
});

it('outline getter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);
  expect(b.outline).toBe(null);
  let outline = b.addCircleOutline(svg);
  expect(b.outline.id).toBe(outline.id);
  b.removeOutline();
  expect(b.outline).toBe(null);
});

it('removeOutline method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);
  
  b.addCircleOutline(svg);
  expect(b.hasOutline()).toBeTruthy();
  b.removeOutline();
  expect(b.hasOutline()).toBeFalsy();

  // remove when there is no outline
  expect(() => b.removeOutline()).not.toThrow();
  expect(b.hasOutline()).toBeFalsy();
});

it('addNumbering method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);

  // no previous numbering
  let numbering1 = b.addNumbering(svg, 5, Math.PI / 3);
  let textId1 = numbering1._text.id();
  expect(svg.findOne('#' + textId1)).not.toBe(null);

  // removes previous numbering
  let numbering2 = b.addNumbering(svg, 10, 4 * Math.PI / 3);
  let textId2 = numbering2._text.id();
  expect(svg.findOne('#' + textId2)).not.toBe(null);
  expect(svg.findOne('#' + textId1)).toBe(null);
});

it('addNumberingFromSavedState method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);

  // no previous numbering
  let n1 = Numbering.create(svg, 0, b.xCenter, b.yCenter, 0);
  let savedState1 = n1.savableState();
  let numbering1 = b.addNumberingFromSavedState(savedState1, svg);
  let textId1 = numbering1._text.id();
  expect(svg.findOne('#' + textId1)).not.toBe(null);

  // removes previous numbering
  let n2 = Numbering.create(svg, 1, b.xCenter, b.yCenter, 0);
  let savedState2 = n2.savableState();
  let numbering2 = b.addNumberingFromSavedState(savedState2, svg);
  let textId2 = numbering2._text.id();
  expect(svg.findOne('#' + textId2)).not.toBe(null);
  expect(svg.findOne('#' + textId1)).toBe(null);
});

it('hasNumbering method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);
  expect(b.hasNumbering()).toBeFalsy();
  b.addNumbering(svg, 12, Math.PI / 6);
  expect(b.hasNumbering()).toBeTruthy();
  b.removeNumbering();
  expect(b.hasNumbering()).toBeFalsy();
});

it('numbering getter', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);
  expect(b.numbering).toBe(null);
  let numbering = b.addNumbering(svg, -9, Math.PI / 7);
  expect(b.numbering.id).toBe(numbering.id);
  b.removeNumbering();
  expect(b.numbering).toBe(null);
});

it('removeNumbering method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'C', 0.99, 100.2357);
  
  b.addNumbering(svg, -10000, Math.PI);
  expect(b.hasNumbering()).toBeTruthy();
  b.removeNumbering();
  expect(b.hasNumbering()).toBeFalsy();

  // remove when there is no numbering
  expect(() => b.removeNumbering()).not.toThrow();
  expect(b.hasNumbering()).toBeFalsy();
});

it('addCircleAnnotation method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'k', 1, 2.22);

  let ann1 = b.addCircleAnnotation(svg);
  expect(b.numAnnotations).toBe(1);
  
  // can add multiple annotations
  let ann2 = b.addCircleAnnotation(svg);
  expect(b.numAnnotations).toBe(2);

  let annotation1 = b.getAnnotationById(ann1.id);
  expect(annotation1.id).toBe(ann1.id);
  let annotation2 = b.getAnnotationById(ann2.id);
  expect(annotation2.id).toBe(ann2.id);
});

it('addCircleAnnotationFromSavedState method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'k', 1, 2.22);

  let cba1 = CircleBaseAnnotation.createNondisplaced(svg, b.xCenter, b.yCenter);
  let savedState1 = cba1.savableState();
  let ann1 = b.addCircleAnnotationFromSavedState(savedState1, svg, Math.PI / 3);
  expect(b.numAnnotations).toBe(1);

  // can add multiple annotations
  let cba2 = CircleBaseAnnotation.createNondisplaced(svg, b.xCenter, b.yCenter);
  let savedState2 = cba2.savableState();
  let ann2 = b.addCircleAnnotationFromSavedState(savedState2, svg, Math.PI / 3);
  expect(b.numAnnotations).toBe(2);

  let annotation1 = b.getAnnotationById(ann1.id);
  let annotation2 = b.getAnnotationById(ann2.id);
  expect(annotation1.id).toBe(ann1.id);
  expect(annotation1._circle.id()).toBe(cba1._circle.id());
  expect(annotation2.id).toBe(ann2.id);
  expect(annotation2._circle.id()).toBe(cba2._circle.id());
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

it('getAnnotationById method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'g', 0, 0);

  let ann1 = b.addCircleAnnotation(svg);
  expect(b.getAnnotationById(ann1.id).id).toBe(ann1.id);
  expect(b.getAnnotationById(ann1.id)._circle.id()).toBe(ann1._circle.id());
  
  let ann2 = b.addCircleAnnotation(svg);
  expect(b.getAnnotationById(ann1.id).id).toBe(ann1.id);
  expect(b.getAnnotationById(ann1.id)._circle.id()).toBe(ann1._circle.id());
  expect(b.getAnnotationById(ann2.id).id).toBe(ann2.id);
  expect(b.getAnnotationById(ann2.id)._circle.id()).toBe(ann2._circle.id());

  // no annotation has the given ID
  let outline = b.addCircleOutline(svg);
  expect(b.getAnnotationById(outline.id)).toBe(null);

  // calling when base has no annotations
  b.removeAnnotations();
  expect(b.getAnnotationById(outline.id)).toBe(null);
});

it('removeAnnotationById method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'g', 0, 0);

  let ann1 = b.addCircleAnnotation(svg);
  let ann2 = b.addCircleAnnotation(svg);
  expect(b.numAnnotations).toBe(2);
  expect(b.getAnnotationById(ann1.id).id).toBe(ann1.id);
  expect(b.getAnnotationById(ann1.id)._circle.id()).toBe(ann1._circle.id());
  expect(b.getAnnotationById(ann2.id).id).toBe(ann2.id);
  expect(b.getAnnotationById(ann2.id)._circle.id()).toBe(ann2._circle.id());

  // no annotation has the given ID
  let outline = b.addCircleOutline(svg);
  expect(() => b.removeAnnotationById(outline.id)).not.toThrow();
  expect(b.numAnnotations).toBe(2);

  let id1 = ann1.id;
  b.removeAnnotationById(ann1.id);
  expect(b.numAnnotations).toBe(1);
  expect(b.getAnnotationById(id1)).toBe(null);

  // annotation 2 is still present
  expect(b.getAnnotationById(ann2.id).id).toBe(ann2.id);
  expect(b.getAnnotationById(ann2.id)._circle.id()).toBe(ann2._circle.id());

  let id2 = ann2.id;
  b.removeAnnotationById(ann2.id);
  expect(b.numAnnotations).toBe(0);
  expect(b.getAnnotationById(id2)).toBe(null);
  
  // calling when base has no annotations
  expect(() => b.removeAnnotationById(id1)).not.toThrow();
});

it('removeAnnotations method', () => {
  let svg = createNodeSVG();
  let b = Base.create(svg, 'l', 1, 7);

  // calling when has no annotations
  expect(() => b.removeAnnotations()).not.toThrow();
  expect(b.numAnnotations).toBe(0);
  
  let ann1 = b.addCircleAnnotation(svg);
  let ann2 = b.addCircleAnnotation(svg);
  expect(b.numAnnotations).toBe(2);
  b.removeAnnotations();
  expect(b.numAnnotations).toBe(0);
});

it('remove method', () => {
  let svg = createNodeSVG();
  
  // with no highlighting, outline, numbering, or annotations
  let b1 = Base.create(svg, 'q', 2.2, 3.3);
  let textId = b1._text.id();
  expect(svg.findOne('#' + textId)).not.toBe(null);
  b1.remove();
  expect(svg.findOne('#' + textId)).toBe(null);

  // with highlighting, outline, numbering, and annotations
  let b2 = Base.create(svg, '1', 1, 1);
  let highlighting = b2.addCircleHighlighting(svg);
  let outline = b2.addCircleOutline(svg);
  let numbering = b2.addNumbering(svg, 5, Math.PI / 3);
  let ann1 = b2.addCircleAnnotation(svg);
  let ann2 = b2.addCircleAnnotation(svg);

  textId = b2._text.id();
  let highlightingCircleId = highlighting._circle.id();
  let outlineCircleId = outline._circle.id();
  let numberingTextId = numbering._text.id();
  let numberingLineId = numbering._line.id();
  let annCircleId1 = ann1._circle.id();
  let annCircleId2 = ann2._circle.id();

  expect(svg.findOne('#' + textId)).not.toBe(null);
  expect(svg.findOne('#' + highlightingCircleId)).not.toBe(null);
  expect(svg.findOne('#' + outlineCircleId)).not.toBe(null);
  expect(svg.findOne('#' + numberingTextId)).not.toBe(null);
  expect(svg.findOne('#' + numberingLineId)).not.toBe(null);
  expect(svg.findOne('#' + annCircleId1)).not.toBe(null);
  expect(svg.findOne('#' + annCircleId2)).not.toBe(null);

  b2.remove();

  expect(svg.findOne('#' + textId)).toBe(null);
  expect(svg.findOne('#' + highlightingCircleId)).toBe(null);
  expect(svg.findOne('#' + outlineCircleId)).toBe(null);
  expect(svg.findOne('#' + numberingTextId)).toBe(null);
  expect(svg.findOne('#' + numberingLineId)).toBe(null);
  expect(svg.findOne('#' + annCircleId1)).toBe(null);
  expect(svg.findOne('#' + annCircleId2)).toBe(null);
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
