import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';

it('can be instantiated', () => {
  let dps = new StrictLayoutGeneralProps();
});

it('can be copied using the spread operator', () => {
  let dps0 = new StrictLayoutGeneralProps();
  dps0.flatOutermostLoop = !dps0.flatOutermostLoop;
  dps0.rotation = 0.5;
  dps0.watsonCrickBondLength = 2;
  dps0.terminiGap = 9;
  dps0.maxTriangleLoopAngle = 0.3;

  let dps1 = {...dps0};

  expect(Object.keys(dps1).length).toBe(Object.keys(dps0).length);

  Object.keys(dps0).forEach(k => {
    expect(dps1[k]).toBe(dps0[k]);
  });
});

it('can be converted to and parsed from a JSON string', () => {
  let dps0 = new StrictLayoutGeneralProps();
  dps0.flatOutermostLoop = !dps0.flatOutermostLoop;
  dps0.rotation = 0.5;
  dps0.watsonCrickBondLength = 2;
  dps0.terminiGap = 9;
  dps0.maxTriangleLoopAngle = 0.3;

  let s = JSON.stringify(dps0);
  let dps1 = JSON.parse(s);

  expect(Object.keys(dps1).length).toBe(Object.keys(dps0).length);

  Object.keys(dps0).forEach(k => {
    expect(dps1[k]).toBe(dps0[k]);
  });
});
