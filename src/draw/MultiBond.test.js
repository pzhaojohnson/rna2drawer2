import MultiBond from './MultiBond';
import createNodeSVG from './createNodeSVG';
import Base from './Base';

it('_validateSides', () => {
  let svg = createNodeSVG();
  
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 2, 3);
  let b3 = Base.create(svg, 'G', 3, 5);
  let b4 = Base.create(svg, 'C', 2, 8);

  // same side lengths
  expect(() => new MultiBond([b1, b2], [b3, b4])).not.toThrow();

  // unequal side lengths
  expect(() => new MultiBond([b1, b2], [b3])).not.toThrow();

  // zero side lengths
  expect(() => new MultiBond([b1, b2], [])).toThrow();
  expect(() => new MultiBond([], [b3])).toThrow();
  expect(() => new MultiBond([], [])).toThrow();
});

it('inBond', () => {
  let svg = createNodeSVG();

  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 2, 3);
  let b3 = Base.create(svg, 'G', 3, 5);
  let b4 = Base.create(svg, 'C', 2, 8);
  let mb = new MultiBond([b1], [b3, b4]);

  expect(mb.inBond(b1)).toBeTruthy();
  expect(mb.inBond(b2)).toBeFalsy();
  expect(mb.inBond(b3)).toBeTruthy();
});
