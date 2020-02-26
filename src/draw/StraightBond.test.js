import StraightBond from './StraightBond';
import createNodeSVG from './createNodeSVG';
import createUUIDforSVG from './createUUIDforSVG';
import Base from './Base';

it('fromSavedState static method valid saved state', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1.1, 1.2);
  let b2 = Base.create(svg, 'U', 2.1, 2.2);
  let sb1 = StraightBond.create(svg, b1, b2);

  let savableState = sb1.savableState();

  let getBaseById = (id) => {
    if (id === b1.id) {
      return b1;
    } else {
      return b2;
    }
  };

  let sb2 = StraightBond.fromSavedState(savableState, svg, getBaseById);

  expect(sb2._line.id()).toBe(sb1._line.id());
  expect(sb2.base1).toBe(sb1.base1);
  expect(sb2.base2).toBe(sb1.base2);
});

it('fromSavedState static method invalid saved state', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1.1, 1.2);
  let b2 = Base.create(svg, 'U', 2.1, 2.2);
  let sb1 = StraightBond.create(svg, b1, b2);

  let getBaseById = (id) => {
    if (id === b1.id) {
      return b1;
    } else {
      return b2;
    }
  };

  // no class name defined
  let savableState = sb1.savableState();
  delete savableState.className;
  expect(() => StraightBond.fromSavedState(savableState, svg, getBaseById)).toThrow();

  // class name is not a string
  savableState.className = 2;
  expect(() => StraightBond.fromSavedState(savableState, svg, getBaseById)).toThrow();

  // class name is an empty string
  savableState.className = '';
  expect(() => StraightBond.fromSavedState(savableState, svg, getBaseById)).toThrow();

  // class name is not StraightBond
  savableState.className = 'StraightBnd';
  expect(() => StraightBond.fromSavedState(savableState, svg, getBaseById)).toThrow();
});

function checkCoordinates(cs, ecs) {
  expect(cs.x1).toBeCloseTo(ecs.x1, 6);
  expect(cs.y1).toBeCloseTo(ecs.y1, 6);
  expect(cs.x2).toBeCloseTo(ecs.x2, 6);
  expect(cs.y2).toBeCloseTo(ecs.y2, 6);
}

it('coordinates static method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 5, 6);
  
  // basic test
  checkCoordinates(
    StraightBond.coordinates(b1, b2, 1, 2),
    {
      x1: 1 + (2 ** -0.5),
      y1: 2 + (2 ** -0.5),
      x2: 5 - (2 ** 0.5),
      y2: 6 - (2 ** 0.5),
    },
  );

  // paddings of zero
  checkCoordinates(
    StraightBond.coordinates(b1, b2, 0, 0),
    {
      x1: 1,
      y1: 2,
      x2: 5,
      y2: 6,
    },
  );

  // negative base coordinates
  b1.move(-2, -1);
  b2.move(-10.5, -100);
  
  checkCoordinates(
    StraightBond.coordinates(b1, b2, 2.5, 1.111),
    {
      x1: -2.2138596577358562,
      y1: -3.49083601362938,
      x2: -10.404960768102185,
      y2: -98.89307247554311,
    },
  );

  // paddings greater than distance between bases
  checkCoordinates(
    StraightBond.coordinates(b1, b2, 60, 60),
    {
      x1: -6.25,
      y1: -50.5,
      x2: -6.25,
      y2: -50.5,
    },
  );
});

it('basic test of create static method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 1);
  let b2 = Base.create(svg, 'U', 4, 4);
  expect(() => StraightBond.create(svg, b1, b2)).not.toThrow();
});

it('basic test of constructor', () => {
  let svg = createNodeSVG();
  let line = svg.line(0, 0.22, 2.45, -1);
  line.id(createUUIDforSVG());
  let b1 = Base.create(svg, 'G', -1, -2);
  let b2 = Base.create(svg, 'C', 10, 0.002);
  expect(() => new StraightBond(line, b1, b2)).not.toThrow();
});

it('_validateLine', () => {
  let svg = createNodeSVG();
  let b0 = Base.create(svg, 'A', 1, 2);
  let b1 = Base.create(svg, 'U', 2, 3);

  let line0 = svg.line(1, 1, 2, 2);
  line0.id(createUUIDforSVG());
  expect(() => new StraightBond(line0, b0, b1)).not.toThrow();

  /* It does seems possible using the SVG.js framework to create
  an element with no ID. */

  // line with ID that is not a string
  let line2 = svg.line(-1, -2, 0, 0);
  line2.id(22);
  expect(() => new StraightBond(line2, b0, b1)).toThrow();
});

it('base1 and base2 getters', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 4.5, 6);
  let b2 = Base.create(svg, 'u', -10, -4);
  let sb = StraightBond.create(svg, b1, b2);
  expect(sb.base1).toBe(b1);
  expect(sb.base2).toBe(b2);
});

it('id getter', () => {
  let svg = createNodeSVG();
  let b0 = Base.create(svg, 'A', 1, 2);
  let b1 = Base.create(svg, 'U', 2, 3);

  let line = svg.line(1, 2, 3, 4);
  let id = createUUIDforSVG();
  line.attr({ 'id': id });
  let sb = new StraightBond(line, b0, b1);
  
  // check getter
  expect(sb.id).toBe(id);

  // check actual value
  expect(sb._line.id()).toBe(id);
});

it('padding1 getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', 40.3, 4.9);
  let b2 = Base.create(svg, 'T', 1, 4);
  let sb = StraightBond.create(svg, b1, b2);

  let x2 = sb._line.attr('x2');
  let y2 = sb._line.attr('y2');

  sb.padding1 = 0.25;

  // check getter
  expect(sb.padding1).toBeCloseTo(0.25, 6);

  // check actual line coordinates
  checkCoordinates(
    {
      x1: sb._line.attr('x1'),
      y1: sb._line.attr('y1'),
      x2: sb._line.attr('x2'),
      y2: sb._line.attr('y2'),
    },
    {
      x1: 40.05006552984633,
      y1: 4.89427630984381,
      x2: x2,
      y2: y2,
    },
  );
});

it('padding2 getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', 0.2, -3);
  let b2 = Base.create(svg, 'T', 120.5, 8);
  let sb = StraightBond.create(svg, b1, b2);

  let x1 = sb._line.attr('x1');
  let y1 = sb._line.attr('y1');

  sb.padding2 = 0.5;

  // check getter
  expect(sb.padding2).toBeCloseTo(0.5, 6);

  // check actual line coordinates
  checkCoordinates(
    {
      x1: sb._line.attr('x1'),
      y1: sb._line.attr('y1'),
      x2: sb._line.attr('x2'),
      y2: sb._line.attr('y2'),
    },
    {
      x1: x1,
      y1: y1,
      x2: 120.00207721370248,
      y2: 7.954470900671049,
    },
  );
});

it('reposition', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', 0.2, -3);
  let b2 = Base.create(svg, 'T', 120.5, 8);
  let sb = StraightBond.create(svg, b1, b2);

  sb.padding1 = 5;
  sb.padding2 = 0.99;

  b1.move(-10, 0.5);
  b2.move(1000, 980.2);

  sb.reposition();

  checkCoordinates(
    {
      x1: sb._line.attr('x1'),
      y1: sb._line.attr('y1'),
      x2: sb._line.attr('x2'),
      y2: sb._line.attr('y2'),
    },
    {
      x1: -6.411041600732329,
      y1: 3.981289647289641,
      x2: 999.289386236945,
      y2: 979.5107046498367,
    },
  );
});

it('_reposition', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', 0.2, -3);
  let b2 = Base.create(svg, 'T', 120.5, 8);
  let sb = StraightBond.create(svg, b1, b2);

  b1.move(-10, 0.5);
  b2.move(1000, 980.2);

  sb._reposition(5, 0.99);

  checkCoordinates(
    {
      x1: sb._line.attr('x1'),
      y1: sb._line.attr('y1'),
      x2: sb._line.attr('x2'),
      y2: sb._line.attr('y2'),
    },
    {
      x1: -6.411041600732329,
      y1: 3.981289647289641,
      x2: 999.289386236945,
      y2: 979.5107046498367,
    },
  );
});

it('insertBefore', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', -0.445, 0.56);
  let b2 = Base.create(svg, 'T', 1, 2);
  let sb = StraightBond.create(svg, b1, b2);

  let circle = svg.circle(100);
  let rect = svg.rect(2);

  expect(sb._line.position()).toBeLessThan(circle.position());
  expect(sb._line.position()).toBeLessThan(rect.position());

  sb.insertBefore(rect);

  expect(sb._line.position()).toBeGreaterThan(circle.position());
  expect(sb._line.position()).toBeLessThan(rect.position());
});

it('insertAfter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', -0.445, 0.56);
  let b2 = Base.create(svg, 'T', 1, 2);
  let sb = StraightBond.create(svg, b1, b2);

  let circle = svg.circle(100);
  let rect = svg.rect(2);

  expect(sb._line.position()).toBeLessThan(circle.position());
  expect(sb._line.position()).toBeLessThan(rect.position());

  sb.insertAfter(circle);

  expect(sb._line.position()).toBeGreaterThan(circle.position());
  expect(sb._line.position()).toBeLessThan(rect.position());
});

it('stroke getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 1);
  let b2 = Base.create(svg, 'U', 4, 4);
  let sb = StraightBond.create(svg, b1, b2);

  sb.stroke = '#456abc';
  
  // check getter
  expect(sb.stroke).toBe('#456abc');

  // check actual value
  expect(sb._line.attr('stroke')).toBe('#456abc');
});

it('strokeWidth getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 1);
  let b2 = Base.create(svg, 'U', 4, 4);
  let sb = StraightBond.create(svg, b1, b2);

  sb.strokeWidth = 2.3;

  // check getter
  expect(sb.strokeWidth).toBeCloseTo(2.3, 6);

  // check actual value
  expect(sb._line.attr('stroke-width')).toBeCloseTo(2.3, 6);
});

it('remove method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1.1, 1.2);
  let b2 = Base.create(svg, 'U', 2.1, 2.2);
  let sb = StraightBond.create(svg, b1, b2);
  let lineId = sb._line.id();
  let baseTextId1 = b1._text.id();
  let baseTextId2 = b2._text.id();

  expect(svg.findOne('#' + lineId)).not.toBe(null);
  expect(svg.findOne('#' + baseTextId1)).not.toBe(null);
  expect(svg.findOne('#' + baseTextId2)).not.toBe(null);

  sb.remove();

  expect(svg.findOne('#' + lineId)).toBe(null);

  // does not remove the bases
  expect(svg.findOne('#' + baseTextId1)).not.toBe(null);
  expect(svg.findOne('#' + baseTextId2)).not.toBe(null);
});

it('savableState method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1.1, 1.2);
  let b2 = Base.create(svg, 'U', 2.1, 2.2);
  let sb = StraightBond.create(svg, b1, b2);

  let savableState = sb.savableState();
  expect(savableState.className).toBe('StraightBond');
  expect(savableState.line).toBe(sb._line.id());
  expect(savableState.base1).toBe(b1.id);
  expect(savableState.base2).toBe(b2.id);
});
