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

it('createHorizontalLine', () => {
  let svg = createNodeSVG();
  
  let seq0 = Sequence.createHorizontalLine(svg, createUUIDforSVG(), 'AUGC', 1, 1, 2);
  expect(seq0.length).toEqual(4);
  let b1 = seq0.getBase(1);
  expect([b1.letter, b1.xCenter, b1.yCenter]).toEqual(['A', 1, 1]);
  let b2 = seq0.getBase(2);
  expect([b2.letter, b2.xCenter, b2.yCenter]).toEqual(['U', 3, 1]);
  let b3 = seq0.getBase(3);
  expect([b3.letter, b3.xCenter, b3.yCenter]).toEqual(['G', 5, 1]);
  let b4 = seq0.getBase(4);
  expect([b4.letter, b4.xCenter, b4.yCenter]).toEqual(['C', 7, 1]);

  let seq1 = Sequence.createHorizontalLine(svg, createUUIDforSVG(), '', 2, 2, 1);
  expect(seq1.length).toEqual(0);
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
