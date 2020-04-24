import Numbering from './Numbering';
import createNodeSVG from './createNodeSVG';
import angleBetween from './angleBetween';
import distanceBetween from './distanceBetween';
import normalizeAngle from './normalizeAngle';

it('_lineCoordinates', () => {
  let lcs = Numbering._lineCoordinates(1.1, -2, 4 * Math.PI / 3, 4.6, 8.05);
  expect(lcs.x1).toBeCloseTo(-1.200000000000002, 6);
  expect(lcs.y1).toBeCloseTo(-5.9837168574084165, 6);
  expect(lcs.x2).toBeCloseTo(-5.225000000000006, 6);
  expect(lcs.y2).toBeCloseTo(-12.955221357873146, 6);
});

it('_textPositioning', () => {
  let svg = createNodeSVG();

  /* These tests assume that the text padding is 4. */

  /* A line with an angle inside each quadrant. */

  let tp = Numbering._textPositioning(svg.line(1, 2.2, 4, 6.2));
  expect(tp.x).toBeCloseTo(4, 6);
  expect(tp.y).toBeCloseTo(10.2, 6);
  expect(tp.textAnchor).toBe('middle');
  expect(tp.dominantBaseline).toBe('hanging');

  tp = Numbering._textPositioning(svg.line(-2.2, 1, -6.2, 4));
  expect(tp.x).toBeCloseTo(-10.2, 6);
  expect(tp.y).toBeCloseTo(4, 6);
  expect(tp.textAnchor).toBe('end');
  expect(tp.dominantBaseline).toBe('middle');

  tp = Numbering._textPositioning(svg.line(-1, -2.2, -4, -6.2));
  expect(tp.x).toBeCloseTo(-4, 6);
  expect(tp.y).toBeCloseTo(-10.2, 6);
  expect(tp.textAnchor).toBe('middle');
  expect(tp.dominantBaseline).toBe('baseline');

  // a line with an angle above 7 * Math.PI / 4
  tp = Numbering._textPositioning(svg.line(2.2, -1, 6.2, -4));
  expect(tp.x).toBeCloseTo(10.2, 6);
  expect(tp.y).toBeCloseTo(-4, 6);
  expect(tp.textAnchor).toBe('start');
  expect(tp.dominantBaseline).toBe('middle');
  
  // a line with an angle below Math.PI / 4
  tp = Numbering._textPositioning(svg.line(2.2, 1, 6.2, 4));
  expect(tp.x).toBeCloseTo(10.2, 6);
  expect(tp.y).toBeCloseTo(4, 6);
  expect(tp.textAnchor).toBe('start');
  expect(tp.dominantBaseline).toBe('middle');

  /* A line with an angle at each quadrant border. */
  tp = Numbering._textPositioning(svg.line(1, 2, 3, 4));
  expect(tp.x).toBeCloseTo(3, 6);
  expect(tp.y).toBeCloseTo(8, 6);
  expect(tp.textAnchor).toBe('middle');
  expect(tp.dominantBaseline).toBe('hanging');

  tp = Numbering._textPositioning(svg.line(-1, 2, -3, 4));
  expect(tp.x).toBeCloseTo(-7, 6);
  expect(tp.y).toBeCloseTo(4, 6);
  expect(tp.textAnchor).toBe('end');
  expect(tp.dominantBaseline).toBe('middle');

  tp = Numbering._textPositioning(svg.line(-1, -2, -3, -4));
  expect(tp.x).toBeCloseTo(-3, 6);
  expect(tp.y).toBeCloseTo(-8, 6);
  expect(tp.textAnchor).toBe('middle');
  expect(tp.dominantBaseline).toBe('baseline');

  tp = Numbering._textPositioning(svg.line(1, -2, 3, -4));
  expect(tp.x).toBeCloseTo(3, 6);
  expect(tp.y).toBeCloseTo(-8, 6);
  expect(tp.textAnchor).toBe('middle');
  expect(tp.dominantBaseline).toBe('baseline');
});

it('mostRecentProps static method', () => {
  Numbering._mostRecentProps.basePadding = 5.798;
  Numbering._mostRecentProps.lineLength = 10.23;
  Numbering._mostRecentProps.fontFamily = 'Tahoe';
  Numbering._mostRecentProps.fontSize = 3.567;
  Numbering._mostRecentProps.fontWeight = 'lighter';
  Numbering._mostRecentProps.color = '#456123';
  Numbering._mostRecentProps.lineStrokeWidth = 3.5678;

  let mrps = Numbering.mostRecentProps();
  expect(mrps).not.toBe(Numbering._mostRecentProps);
  expect(mrps.basePadding).toBeCloseTo(5.798, 6);
  expect(mrps.lineLength).toBeCloseTo(10.23, 6);
  expect(mrps.fontFamily).toBe('Tahoe');
  expect(mrps.fontSize).toBeCloseTo(3.567, 6);
  expect(mrps.fontWeight).toBe('lighter');
  expect(mrps.color).toBe('#456123');
  expect(mrps.lineStrokeWidth).toBeCloseTo(3.5678, 6);
});

it('_applyMostRecentProps static method', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 9, 1.1, 2.2, 0);

  /* Set after creating the numbering since the create static method itself
  applies the most recent properties. */
  Numbering._mostRecentProps.basePadding = 5.798;
  Numbering._mostRecentProps.lineLength = 10.23;
  Numbering._mostRecentProps.fontFamily = 'Tahoe';
  Numbering._mostRecentProps.fontSize = 3.567;
  Numbering._mostRecentProps.fontWeight = 'lighter';
  Numbering._mostRecentProps.color = '#456123';
  Numbering._mostRecentProps.lineStrokeWidth = 3.5678;

  Numbering._applyMostRecentProps(n);
  expect(n.basePadding).toBeCloseTo(5.798, 6);
  expect(n.lineLength).toBeCloseTo(10.23, 6);
  expect(n.fontFamily).toBe('Tahoe');
  expect(n.fontSize).toBeCloseTo(3.567, 6);
  expect(n.fontWeight).toBe('lighter');
  expect(n.color).toBe('#456123');
  expect(n.lineStrokeWidth).toBeCloseTo(3.5678, 6);
});

it('_copyPropsToMostRecent static method', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 9, 1.1, 2.2, 0);
  n.basePadding = 5.798;
  n.lineLength = 10.23;
  n.fontFamily = 'Tahoe';
  n.fontSize = 3.567;
  n.fontWeight = 'lighter';
  n.color = '#456123';
  n.lineStrokeWidth = 3.5678;

  Numbering._copyPropsToMostRecent(n);
  let mrps = Numbering.mostRecentProps();
  expect(mrps.basePadding).toBeCloseTo(5.798, 6);
  expect(mrps.lineLength).toBeCloseTo(10.23, 6);
  expect(mrps.fontFamily).toBe('Tahoe');
  expect(mrps.fontSize).toBeCloseTo(3.567, 6);
  expect(mrps.fontWeight).toBe('lighter');
  expect(mrps.color).toBe('#456123');
  expect(mrps.lineStrokeWidth).toBeCloseTo(3.5678, 6);
});

it('fromSavedState static method valid saved state', () => {
  let svg = createNodeSVG();
  let n1 = Numbering.create(svg, 2, 1, 8, 7);
  let savableState = n1.savableState();
  let n2 = Numbering.fromSavedState(savableState, svg, 1, 8);

  expect(n2._text.id()).toBe(n1._text.id());
  expect(n2._line.id()).toBe(n1._line.id());
  expect(n2.number).toBe(n1.number);
  expect(n2.basePadding).toBeCloseTo(n1.basePadding, 6);
  expect(n2.lineLength).toBeCloseTo(n1.lineLength, 6);
});

it('fromSavedState static method invalid saved state', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 2, 1, 8, 7);
  let savableState = n.savableState();
  
  // no class name defined
  delete savableState.className;
  expect(Numbering.fromSavedState(savableState, svg, 1, 8)).toBe(null);

  // class name is not a string
  savableState.className = 0.1234;
  expect(Numbering.fromSavedState(savableState, svg, 1, 8)).toBe(null);

  // class name is an empty string
  savableState.className = '';
  expect(Numbering.fromSavedState(savableState, svg, 1, 8)).toBe(null);

  // class name is not Numbering
  savableState.className = 'Nmbering';
  expect(Numbering.fromSavedState(savableState, svg, 1, 8)).toBe(null);
});

it('fromSavedState static method updates most recent properties', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 9, 1.1, 2.2, 0);
  n.basePadding = 5.798;
  n.lineLength = 10.23;
  n.fontFamily = 'Tahoe';
  n.fontSize = 3.567;
  n.fontWeight = 'lighter';
  n.color = '#456123';
  n.lineStrokeWidth = 3.5678;

  let savedState = n.savableState();
  Numbering.fromSavedState(savedState, svg, 1.1, 2.2);
  let mrps = Numbering.mostRecentProps();
  expect(mrps.basePadding).toBeCloseTo(5.798, 6);
  expect(mrps.lineLength).toBeCloseTo(10.23, 6);
  expect(mrps.fontFamily).toBe('Tahoe');
  expect(mrps.fontSize).toBeCloseTo(3.567, 6);
  expect(mrps.fontWeight).toBe('lighter');
  expect(mrps.color).toBe('#456123');
  expect(mrps.lineStrokeWidth).toBeCloseTo(3.5678, 6);
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

it('create static method applies most recent properties', () => {
  Numbering._mostRecentProps.basePadding = 5.798;
  Numbering._mostRecentProps.lineLength = 10.23;
  Numbering._mostRecentProps.fontFamily = 'Tahoe';
  Numbering._mostRecentProps.fontSize = 3.567;
  Numbering._mostRecentProps.fontWeight = 'lighter';
  Numbering._mostRecentProps.color = '#456123';
  Numbering._mostRecentProps.lineStrokeWidth = 3.5678;

  let svg = createNodeSVG();
  let n = Numbering.create(svg, 9, 1.1, 2.2, 0);
  expect(n.basePadding).toBeCloseTo(5.798, 6);
  expect(n.lineLength).toBeCloseTo(10.23, 6);
  expect(n.fontFamily).toBe('Tahoe');
  expect(n.fontSize).toBeCloseTo(3.567, 6);
  expect(n.fontWeight).toBe('lighter');
  expect(n.color).toBe('#456123');
  expect(n.lineStrokeWidth).toBeCloseTo(3.5678, 6);
});

it('basic test of constructor', () => {
  let svg = createNodeSVG();
  let text = svg.text(add => add.tspan('12'));
  text.id();
  let line = svg.line(1, 2, 3, 4);
  line.id();
  expect(() => new Numbering(text, line, 5, 6)).not.toThrow();
});

it('_validateText', () => {
  let svg = createNodeSVG();
  let line = svg.line(1, 2, 3, 4);

  // valid text
  let text = svg.text(add => add.tspan('-2'));
  text.id();
  expect(() => new Numbering(text, line, 0, 0)).not.toThrow();

  // initializes ID
  text = svg.text(add => add.tspan('10'));
  expect(text.attr('id')).toBe(undefined);
  new Numbering(text, line, 3, 4);
  expect(text.attr('id')).toBeTruthy();

  // text that is not a number
  text = svg.text(add => add.tspan('asdf'));
  text.id();
  expect(() => new Numbering(text, line, 5, 6));

  // text that is a number but not an integer
  text = svg.text(add => add.tspan('1.4'));
  expect(() => new Numbering(text, line, -1, -2));
});

it('id getter', () => {
  let svg = createNodeSVG();
  let text = svg.text(add => add.tspan('1'));
  let textId = 'a_unique_text_id';
  text.id(textId);
  let line = svg.line(7, 8, 9, 0);
  line.id();
  let n = new Numbering(text, line, 8, 7);
  expect(n.id).toBe(textId);
});

it('_validateLine', () => {
  let svg = createNodeSVG();
  let text = svg.text(add => add.tspan('6'));
  text.id();

  // valid line
  let line = svg.line(0, 2, 3, 8);
  line.id()
  expect(() => new Numbering(text, line, -2, -5)).not.toThrow();

  // ID is not a string
  line = svg.line(-1, -2, 3, 4);
  line.id(3);
  expect(() => new Numbering(text, line, -1, 0)).toThrow();
});

it('basePadding getter and setter', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 2, 1.1, -5, Math.PI / 3);
  n.basePadding = 20;

  // check getter
  expect(n.basePadding).toBeCloseTo(20, 6);

  // check actual values
  let x1 = n._line.attr('x1');
  let y1 = n._line.attr('y1');
  expect(distanceBetween(1.1, -5, x1, y1)).toBeCloseTo(20, 6);
  let angle = angleBetween(1.1, -5, x1, y1);
  angle = normalizeAngle(angle, 0);
  expect(angle).toBeCloseTo(Math.PI / 3, 6);

  // updates most recent property
  expect(Numbering.mostRecentProps().basePadding).toBeCloseTo(20, 6);
});

it('lineLength getter and setter', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, -1, 2.3, 4.3, 4 * Math.PI / 3);
  let x1 = n._line.attr('x1');
  let y1 = n._line.attr('y1');

  n.lineLength = 24.4;

  // check getter
  expect(n.lineLength).toBeCloseTo(24.4, 6);

  // check actual values

  expect(distanceBetween(
    n._line.attr('x1'),
    n._line.attr('y1'),
    n._line.attr('x2'),
    n._line.attr('y2'),
  )).toBeCloseTo(24.4, 6);

  let angle = angleBetween(
    n._line.attr('x1'),
    n._line.attr('y1'),
    n._line.attr('x2'),
    n._line.attr('y2'),
  );

  angle = normalizeAngle(angle, 0);
  expect(angle).toBeCloseTo(4 * Math.PI / 3, 6);

  expect(n._line.attr('x1')).toBeCloseTo(x1, 6);
  expect(n._line.attr('y1')).toBeCloseTo(y1, 6);

  // updates most recent property
  expect(Numbering.mostRecentProps().lineLength).toBeCloseTo(24.4, 6);
});

it('reposition', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, -5, 2, 3, Math.PI / 3);
  n.basePadding = 5;
  n.lineLength = 2.5;

  n.reposition(-2.3, -8, -Math.PI / 5);

  // check getters
  expect(n.basePadding).toBeCloseTo(5, 6);
  expect(n.lineLength).toBeCloseTo(2.5, 6);

  // check actual values

  expect(n._line.attr('x1')).toBeCloseTo(1.7450849718747374, 6);
  expect(n._line.attr('y1')).toBeCloseTo(-10.938926261462367, 6);
  expect(n._line.attr('x2')).toBeCloseTo(3.767627457812106, 6);
  expect(n._line.attr('y2')).toBeCloseTo(-12.40838939219355, 6);

  // assumes that text padding is 4
  expect(n._text.attr('x')).toBeCloseTo(7.767627457812106, 6);
  expect(n._text.attr('y')).toBeCloseTo(-12.40838939219355, 6);
  expect(n._text.attr('text-anchor')).toBe('start');
  expect(n._text.attr('dominant-baseline')).toBe('middle');
});

it('_reposition', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, -2, -2.22, -0.1, -Math.PI / 6);
  n.basePadding = 5.666;
  n.lineLength = 9.01;

  n.reposition(0.2, -8.2, -8 * Math.PI / 5);

  // check getters
  expect(n.basePadding).toBeCloseTo(5.666, 6);
  expect(n.lineLength).toBeCloseTo(9.01, 6);

  // check actual values

  expect(n._line.attr('x1')).toBeCloseTo(1.950890290128451, 6);
  expect(n._line.attr('y1')).toBeCloseTo(-2.811313778671658, 6);
  expect(n._line.attr('x2')).toBeCloseTo(4.735133409446726, 6);
  expect(n._line.attr('y2')).toBeCloseTo(5.7577054331476765, 6);

  // assumes that text padding is 4
  expect(n._text.attr('x')).toBeCloseTo(4.735133409446726, 6);
  expect(n._text.attr('y')).toBeCloseTo(9.7577054331476765, 6);
  expect(n._text.attr('text-anchor')).toBe('middle');
  expect(n._text.attr('dominant-baseline')).toBe('hanging');
});

it('insertBefore', () => {
  let svg = createNodeSVG();
  let circle = svg.circle(1);
  let n = Numbering.create(svg, 1, 3, 4, 0);
  expect(n._text.position()).toBeGreaterThan(circle.position());
  expect(n._line.position()).toBeGreaterThan(circle.position());

  n.insertBefore(circle);
  expect(n._text.position()).toBeLessThan(circle.position());
  expect(n._line.position()).toBeLessThan(circle.position());

  let rect = svg.rect(10);
  n.insertBefore(rect);
  expect(n._text.position()).toBeGreaterThan(circle.position());
  expect(n._line.position()).toBeGreaterThan(circle.position());
  expect(n._text.position()).toBeLessThan(rect.position());
  expect(n._line.position()).toBeLessThan(rect.position());
});

it('insertAfter', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 1, 3, 4, 0);
  let circle = svg.circle(1);
  let rect = svg.rect(10);
  expect(n._text.position()).toBeLessThan(circle.position());
  expect(n._line.position()).toBeLessThan(circle.position());
  expect(n._text.position()).toBeLessThan(rect.position());
  expect(n._line.position()).toBeLessThan(rect.position());

  n.insertAfter(circle);
  expect(n._text.position()).toBeGreaterThan(circle.position());
  expect(n._line.position()).toBeGreaterThan(circle.position());
  expect(n._text.position()).toBeLessThan(rect.position());
  expect(n._line.position()).toBeLessThan(rect.position());
});

it('number getter and setter', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, -10, -1.1, 4.5, 9);
  n.number = 0;
  expect(n.number).toBe(0);

  // not a number
  expect(() => { n.number = null; }).toThrow();

  // a string of a number
  expect(() => { n.number = '1'; }).toThrow();

  // not an integer
  expect(() => { n.number = 1.1; }).toThrow();

  // not finite
  expect(() => { n.number = NaN; }).toThrow();
  expect(() => { n.number = Infinity; }).toThrow();
  expect(() => { n.number = -Infinity; }).toThrow();
});

it('fontFamily getter and setter', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 7, 0, 0, 0);
  n.fontFamily = 'Consolas';

  // check getter
  expect(n.fontFamily).toBe('Consolas');

  // check actual value
  expect(n._text.attr('font-family')).toBe('Consolas');

  // updates most recent property
  expect(Numbering.mostRecentProps().fontFamily).toBe('Consolas');
});

it('fontSize', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, -2, 4, 5, 6);
  n.fontSize = 20;

  // check getter
  expect(n.fontSize).toBeCloseTo(20, 6);

  // check actual value
  expect(n._text.attr('font-size')).toBeCloseTo(20, 6);

  // updates most recent property
  expect(Numbering.mostRecentProps().fontSize).toBeCloseTo(20, 6);
});

it('fontWeight getter and setter', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 9, 10, 12.2, 100);
  n.fontWeight = 'bold';

  // check getter
  expect(n.fontWeight).toBe('bold');

  // check actual value
  expect(n._text.attr('font-weight')).toBe('bold');

  // setting to a number
  n.fontWeight = 200;

  // check getter
  expect(n.fontWeight).toBeCloseTo(200, 6);

  // check actual value
  expect(n._text.attr('font-weight')).toBeCloseTo(200, 6);

  // updatest most recent property
  expect(Numbering.mostRecentProps().fontWeight).toBe(200);
});

it('color getter and setter', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 19999, 0.3, 0.2, 0.00001);
  n.color = '#192865';

  // check getter
  expect(n.color).toBe('#192865');

  // check actual values
  expect(n._text.attr('fill')).toBe('#192865');
  expect(n._line.attr('stroke')).toBe('#192865');

  // updates most recent property
  expect(Numbering.mostRecentProps().color).toBe('#192865');
});

it('lineStrokeWidth getter and setter', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 2, 1, 8, 7);
  n.lineStrokeWidth = 12.2;

  // check getter
  expect(n.lineStrokeWidth).toBeCloseTo(12.2, 6);

  // check actual value
  expect(n._line.attr('stroke-width')).toBeCloseTo(12.2, 6);

  // updates most recent property
  expect(Numbering.mostRecentProps().lineStrokeWidth).toBeCloseTo(12.2, 6);
});

it('remove method', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 2, 1, 8, 7);
  
  let textId = n._text.id();
  expect(svg.findOne('#' + textId)).not.toBe(null);
  let lineId = n._line.id();
  expect(svg.findOne('#' + lineId)).not.toBe(null);

  n.remove();
  
  expect(svg.findOne('#' + textId)).toBe(null);
  expect(svg.findOne('#' + lineId)).toBe(null);
});

it('savableState method', () => {
  let svg = createNodeSVG();
  let n = Numbering.create(svg, 2, 1, 8, 7);
  let savableState = n.savableState();
  expect(savableState.className).toBe('Numbering');
  expect(savableState.text).toBe(n._text.id());
  expect(savableState.line).toBe(n._line.id());
});
