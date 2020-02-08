import StrictLayoutBaseProps from './StrictLayoutBaseProps';

it('can be instantiated', () => {
  let bps = new StrictLayoutBaseProps();
});

it('can be copied using the spread operator', () => {
  let bps0 = new StrictLayoutBaseProps();
  bps0.stretch3 = 1;
  bps0.flatOutermostLoopAngle3 = 0.5;
  bps0.flipStem = !bps0.flipStem;
  bps0.loopShape = 'triangle';

  let bps1 = {...bps0};

  Object.keys(bps0).forEach(k => {
    expect(bps1[k]).toBe(bps0[k]);
  });
});
