import SingleBond from './SingleBond';
import createNodeSVG from './createNodeSVG';
import Base from './Base';

it('_validateBases', () => {
  let svg = createNodeSVG();

  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 2, 3);
  expect(() => new SingleBond(b1, b2)).not.toThrow();

  let b3 = Base.create(svg, 'G', 4, 5);
  expect(() => new SingleBond(b3, b3)).toThrow();
});

it('inBond', () => {
  let svg = createNodeSVG();

  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 1);
  let bond = new SingleBond(b1, b2);
  expect(bond.inBond(b1)).toBeTruthy();
  expect(bond.inBond(b2)).toBeTruthy();

  let b3 = Base.create(svg, 'G', 4, 5);
  expect(bond.inBond(b3)).toBeFalsy();
});

it('otherBase', () => {
  let svg = createNodeSVG();

  let b1 = Base.create(svg, 'G', 3, 4);
  let b2 = Base.create(svg, 'C', 6, 8);
  let bond = new SingleBond(b1, b2);
  expect(bond.otherBase(b1)).toBe(b2);
  expect(bond.otherBase(b2)).toBe(b1);

  let b3 = Base.create(svg, 'A', 1, 3);
  expect(() => bond.otherBase(b3)).toThrow();
});
