import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';

it('can be instantiated', () => {
  let gps = new StrictLayoutGeneralProps();
});

it('can be copied using the spread operator', () => {
  let gps0 = new StrictLayoutGeneralProps();
  gps0.flatOutermostLoop = !gps0.flatOutermostLoop;
  gps0.rotation = 0.5;
  gps0.watsonCrickBondLength = 2;
  gps0.terminiGap = 9;
  gps0.maxTriangleLoopAngle = 0.3;

  let gps1 = {...gps0};

  expect(Object.keys(gps1).length).toBe(Object.keys(gps0).length);

  Object.keys(gps0).forEach(k => {
    expect(gps1[k]).toBe(gps0[k]);
  });
});

it('can be converted to and parsed from a JSON string', () => {
  let gps0 = new StrictLayoutGeneralProps();
  gps0.flatOutermostLoop = !gps0.flatOutermostLoop;
  gps0.rotation = 0.5;
  gps0.watsonCrickBondLength = 2;
  gps0.terminiGap = 9;
  gps0.maxTriangleLoopAngle = 0.3;

  let s = JSON.stringify(gps0);
  let gps1 = JSON.parse(s);

  expect(Object.keys(gps1).length).toBe(Object.keys(gps0).length);

  Object.keys(gps0).forEach(k => {
    expect(gps1[k]).toBe(gps0[k]);
  });
});
