import StraightBond from './StraightBond';
import createNodeSVG from './createNodeSVG';
import createUUIDforSVG from './createUUIDforSVG';
import Base from './Base';
import Drawing from './Drawing';

it('coordinates', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 5, 6);
  
  function checkCoordinates(cs, ex1, ey1, ex2, ey2) {
    expect(cs.x1).toBeCloseTo(ex1, 6);
    expect(cs.y1).toBeCloseTo(ey1, 6);
    expect(cs.x2).toBeCloseTo(ex2, 6);
    expect(cs.y2).toBeCloseTo(ey2, 6);
  }

  let cs0 = StraightBond.coordinates(b1, b2, 1, 2);
  
  checkCoordinates(
    cs0,
    1 + (2 ** -0.5),
    2 + (2 ** -0.5),
    5 - (2 ** 0.5),
    6 - (2 ** 0.5)
  );

  // zero paddings
  let cs1 = StraightBond.coordinates(b1, b2, 0, 0);
  checkCoordinates(cs1, 1, 2, 5, 6);

  // negative coordinates
  b1.move(-2, -1);
  let cs2 = StraightBond.coordinates(b1, b2, 2, 1);

  checkCoordinates(
    cs2,
    -2 + (2 ** 0.5),
    -1 + (2 ** 0.5),
    5 - (2 ** -0.5),
    6 - (2 ** -0.5)
  );
});

it('opacity static', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 4, 6);
  expect(b1.distanceBetweenCenters(b2)).toBeCloseTo(5);

  expect(StraightBond.opacity(b1, b2, 1, 2)).toEqual(1);
  expect(StraightBond.opacity(b1, b2, 0, 0)).toEqual(1);
  expect(StraightBond.opacity(b1, b2, 4, 3)).toEqual(0);
});

it('createStrand', () => {
  let svg = createNodeSVG();
  let drawing = new Drawing(svg);
  let b1 = Base.create(drawing._svg, 'A', 1, 2);
  let b2 = Base.create(drawing._svg, 'A', 2, 2);

  let strandBond = StraightBond.createStrand(drawing._svg, b1, b2, drawing.defaults);
  expect(strandBond.padding1).toBeCloseTo(drawing.defaults.strandBondPadding, 6);
  expect(strandBond.padding2).toBeCloseTo(drawing.defaults.strandBondPadding, 6);
  expect(strandBond.stroke).toEqual(drawing.defaults.strandBondStroke);
  expect(strandBond.strokeWidth).toBeCloseTo(drawing.defaults.strandBondStrokeWidth, 6);
});

it('createWatsonCrick', () => {
  let svg = createNodeSVG();
  let drawing = new Drawing(svg);

  let ba = Base.create(drawing._svg, 'A', 1, 2);
  let bu = Base.create(drawing._svg, 'u', 4, 5);
  let bg = Base.create(drawing._svg, 'g', 9, 9);
  let bc = Base.create(drawing._svg, 'C', 6, 8);
  let bt = Base.create(drawing._svg, 't', -2, -3);

  let auBond = StraightBond.createWatsonCrick(drawing._svg, ba, bu, drawing.defaults);
  expect(auBond.padding1).toBeCloseTo(drawing.defaults.watsonCrickBondPadding, 6);
  expect(auBond.padding2).toBeCloseTo(drawing.defaults.watsonCrickBondPadding, 6);
  expect(auBond.stroke).toEqual(drawing.defaults.watsonCrickAUTBondStroke);
  expect(auBond.strokeWidth).toBeCloseTo(drawing.defaults.watsonCrickBondStrokeWidth, 6);

  let gcBond = StraightBond.createWatsonCrick(drawing._svg, bg, bc, drawing.defaults);
  expect(gcBond.stroke).toEqual(drawing.defaults.watsonCrickGCBondStroke);

  let taBond = StraightBond.createWatsonCrick(drawing._svg, bt, ba, drawing.defaults);
  expect(taBond.stroke).toEqual(drawing.defaults.watsonCrickGCBondStroke);

  let tgBond = StraightBond.createWatsonCrick(drawing._svg, bt, bg, drawing.defaults);
  expect(tgBond.stroke).toEqual(drawing.defaults.watsonCrickGUTBondStroke);
});

it('create', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 1);
  let b2 = Base.create(svg, 'U', 4, 4);

  // no styles argument
  let sb0 = StraightBond.create(svg, b1, b2);

  let styles1 = {
    padding1: 1,
    padding2: 2 ** 0.5,
    stroke: '#00ff00',
    strokeWidth: 3
  };

  let sb1 = StraightBond.create(svg, b1, b2, styles1);
  expect(sb1.padding1).toBeCloseTo(1, 6);
  expect(sb1.padding2).toBeCloseTo(2 ** 0.5, 6);
  expect(sb1.stroke).toEqual('#00ff00');
  expect(sb1.strokeWidth).toBeCloseTo(3, 6);
  expect(sb1.opacity).toEqual(1);

  // should result in opacity of zero
  let styles2 = {
    padding1: 3,
    padding2: 3
  };

  let sb2 = StraightBond.create(svg, b1, b2, styles2);
  expect(sb2.padding1).toBeCloseTo(3, 6);
  expect(sb2.padding2).toBeCloseTo(3, 6);
  expect(sb2.opacity).toEqual(0);
});

it('_validateBases', () => {
  let svg = createNodeSVG();
  let line = svg.line(1, 1, 2, 2);
  line.attr({ 'id': createUUIDforSVG() });

  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 2, 3);
  expect(() => new StraightBond(line, b1, b2)).not.toThrow();

  let b3 = Base.create(svg, 'G', 4, 5);
  expect(() => new StraightBond(line, b3, b3)).toThrow();
});

it('inBond', () => {
  let svg = createNodeSVG();
  let line = svg.line(1, 1, 2, 2);
  line.attr({ 'id': createUUIDforSVG() });

  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 1);
  let bond = new StraightBond(line, b1, b2);
  expect(bond.inBond(b1)).toBeTruthy();
  expect(bond.inBond(b2)).toBeTruthy();

  let b3 = Base.create(svg, 'G', 4, 5);
  expect(bond.inBond(b3)).toBeFalsy();
});

it('otherBase', () => {
  let svg = createNodeSVG();
  let line = svg.line(1, 1, 2, 2);
  line.attr({ 'id': createUUIDforSVG() });

  let b1 = Base.create(svg, 'G', 3, 4);
  let b2 = Base.create(svg, 'C', 6, 8);
  let bond = new StraightBond(line, b1, b2);
  expect(bond.otherBase(b1)).toBe(b2);
  expect(bond.otherBase(b2)).toBe(b1);

  let b3 = Base.create(svg, 'A', 1, 3);
  expect(() => bond.otherBase(b3)).toThrow();
});

it('_validateLine', () => {
  let svg = createNodeSVG();
  let b0 = Base.create(svg, 'A', 1, 2);
  let b1 = Base.create(svg, 'U', 2, 3);

  let line0 = svg.line(1, 1, 2, 2);
  line0.attr({ 'id': createUUIDforSVG() });
  expect(() => new StraightBond(line0, b0, b1)).not.toThrow();

  let line1 = svg.line(2, 2, 3, 3);
  expect(() => new StraightBond(line1, b0, b1)).toThrow();
});

it('id', () => {
  let svg = createNodeSVG();
  let b0 = Base.create(svg, 'A', 1, 2);
  let b1 = Base.create(svg, 'U', 2, 3);

  let line = svg.line(1, 2, 3, 4);
  let id = createUUIDforSVG();
  line.attr({ 'id': id });
  let sb = new StraightBond(line, b0, b1);
  expect(sb.id).toEqual(id);
});

it('padding', () => {
  let svg = createNodeSVG();
  let line = svg.line(1, 1, 2, 2);
  line.attr({ 'id': createUUIDforSVG() });
  let b1 = Base.create(svg, 'A', 0, 0);
  let b2 = Base.create(svg, 'U', 3, 3);
  let sb = new StraightBond(line, b1, b2);
  expect(sb.padding1).toBeCloseTo(2 ** 0.5, 6);
  expect(sb.padding2).toBeCloseTo(2 ** 0.5, 6);
});

it('stroke', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 1);
  let b2 = Base.create(svg, 'U', 4, 4);

  let line = svg.line(2, 2, 3, 3);
  line.attr({ 'id': createUUIDforSVG(), 'stroke': '#00ff00' });
  let sb = new StraightBond(line, b1, b2);
  expect(sb.stroke).toEqual('#00ff00');
});

it('strokeWidth', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 1);
  let b2 = Base.create(svg, 'U', 4, 4);

  let line = svg.line(2, 2, 3, 3);
  line.attr({ 'id': createUUIDforSVG(), 'stroke-width': 2 });
  let sb = new StraightBond(line, b1, b2);
  expect(sb.strokeWidth).toEqual(2);
});

it('opacity getter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 4, 5);

  let styles0 = { padding1: 1, padding2: 1 };
  let sb0 = StraightBond.create(svg, b1, b2, styles0);
  expect(sb0.opacity).toEqual(1);

  let styles1 = { padding1: 3, padding2: 3 };
  let sb1 = StraightBond.create(svg, b1, b2, styles1);
  expect(sb1.opacity).toEqual(0);
});
