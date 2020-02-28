import Sequence from './Sequence';
import createNodeSVG from './createNodeSVG';
import createUUIDforSVG from './createUUIDforSVG';
import Base from './Base';
import normalizeAngle from './normalizeAngle';

it('id', () => {
  let id = createUUIDforSVG();
  let seq = new Sequence(id);
  expect(seq.id).toEqual(id);
});

it('length', () => {
  let seq = new Sequence(createUUIDforSVG());
  expect(seq.length).toEqual(0);

  let svg = createNodeSVG();
  seq.appendBase(Base.create(svg, 'A', 1, 2));
  seq.appendBase(Base.create(svg, 'U', 2, 2));
  expect(seq.length).toEqual(2);
});

it('getBase', () => {
  let seq = new Sequence(createUUIDforSVG());
  let svg = createNodeSVG();
  seq.appendBase(Base.create(svg, 'A', 1, 2));
  seq.appendBase(Base.create(svg, 'U', 2, 2));
  seq.appendBase(Base.create(svg, 'G', 3, 2));
  expect(seq.getBase(1).letter).toEqual('A');
  expect(seq.getBase(2).letter).toEqual('U');
  expect(seq.getBase(3).letter).toEqual('G');
});

it('basePosition', () => {
  let svg = createNodeSVG();
  
  let seq0 = new Sequence(createUUIDforSVG());
  let b0 = Base.create(svg, 'A', 0, 1);
  expect(() => seq0.basePosition(b0)).toThrow();
  
  let seq1 = new Sequence(createUUIDforSVG());
  let b1 = Base.create(svg, 'U', 1, 1);
  seq1.appendBase(b1);
  let b2 = Base.create(svg, 'G', 2, 1);
  seq1.appendBase(b2);
  let b3 = Base.create(svg, 'C', 3, 1);
  seq1.appendBase(b3);
  expect(seq1.basePosition(b1)).toEqual(1);
  expect(seq1.basePosition(b2)).toEqual(2);
  expect(seq1.basePosition(b3)).toEqual(3);
});

it('baseOutwardAngle', () => {
  let svg = createNodeSVG();
  let seq = new Sequence(createUUIDforSVG());
  
  let b1 = Base.create(svg, 'A', 1, 1);
  seq.appendBase(b1);
  let a = normalizeAngle(seq.baseOutwardAngle(b1), 0);
  expect(a).toBeCloseTo(Math.PI, 6);

  let b2 = Base.create(svg, 'A', 2, 2);
  seq.appendBase(b2);
  a = normalizeAngle(seq.baseOutwardAngle(b1), 0);
  expect(a).toBeCloseTo(7 * Math.PI / 4, 6);
  a = normalizeAngle(seq.baseOutwardAngle(b2), 0);
  expect(a).toBeCloseTo(7 * Math.PI / 4, 6);

  let b3 = Base.create(svg, 'A', 2, 3);
  seq.appendBase(b3);
  a = normalizeAngle(seq.baseOutwardAngle(b2), 0);
  expect(a).toBeCloseTo(15 * Math.PI / 8, 6);
});

it('baseInwardAngle', () => {
  let svg = createNodeSVG();
  let seq = new Sequence(createUUIDforSVG());

  let b1 = Base.create(svg, 'A', 1, 1);
  seq.appendBase(b1);
  let a = normalizeAngle(seq.baseInwardAngle(b1), 0);
  expect(a).toBeCloseTo(0, 6);

  let b2 = Base.create(svg, 'A', 2, 2);
  seq.appendBase(b2);
  a = normalizeAngle(seq.baseInwardAngle(b1), 0);
  expect(a).toBeCloseTo(3 * Math.PI / 4, 6);
  a = normalizeAngle(seq.baseInwardAngle(b2), 0);
  expect(a).toBeCloseTo(3 * Math.PI / 4, 6);

  let b3 = Base.create(svg, 'A', 2, 3);
  seq.appendBase(b3);
  a = normalizeAngle(seq.baseInwardAngle(b2), 0);
  expect(a).toBeCloseTo(7 * Math.PI / 8, 6);
});

it('appendBase', () => {
  let seq = new Sequence(createUUIDforSVG());
  let svg = createNodeSVG();
  seq.appendBase(Base.create(svg, 'A', 0, 1));
  expect(seq.getBase(1).letter).toEqual('A');
  seq.appendBase(Base.create(svg, 'U', 1, 1));
  expect(seq.getBase(2).letter).toEqual('U');
  seq.appendBase(Base.create(svg, 'G', 2, 1));
  expect(seq.getBase(3).letter).toEqual('G');
});
