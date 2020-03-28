import StrictLayoutBaseProps from './StrictLayoutBaseProps';

it('fromSavedState static method', () => {
  let bps1 = new StrictLayoutBaseProps();
  bps1.stretch3 = 0.8;
  bps1.flatOutermostLoopAngle3 = Math.PI / 9;
  bps1.flipStem = true;
  bps1.loopShape = 'triangle';
  bps1.maxTriangleLoopBranchingAngle = Math.PI / 8;
  let savableState1 = bps1.savableState();
  let bps2 = StrictLayoutBaseProps.fromSavedState(savableState1);
  let savableState2 = bps2.savableState();
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});

it('fromSavedState static method - ignores undefined properties', () => {
  let bps1 = new StrictLayoutBaseProps();
  let bps2 = StrictLayoutBaseProps.fromSavedState({});
  let savableState1 = bps1.savableState();
  let savableState2 = bps2.savableState();
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});

it('basic test of constructor', () => {
  expect(() => { new StrictLayoutBaseProps() }).not.toThrow();
});

it('deepCopy', () => {
  let bps1 = new StrictLayoutBaseProps();
  bps1.stretch3 = 0.78;
  bps1.flatOutermostLoopAngle3 = 4 * Math.PI / 5;
  bps1.flipStem = true;
  bps1.loopShape = 'triangle';
  bps1.maxTriangleLoopBranchingAngle = Math.PI / 6;
  let bps2 = bps1.deepCopy();
  expect(bps2).not.toBe(bps1);
  let savableState1 = bps1.savableState();
  let savableState2 = bps2.savableState();
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});

it('savableState', () => {
  let bps = new StrictLayoutBaseProps();
  bps.stretch3 = 3.7;
  bps.flatOutermostLoopAngle3 = Math.PI / 5;
  bps.flipStem = true;
  bps.loopShape = 'triangle';
  bps.maxTriangleLoopBranchingAngle = 2 * Math.PI / 9;
  let savableState = bps.savableState();
  expect(savableState.stretch3).toBe(3.7);
  expect(savableState.flatOutermostLoopAngle3).toBe(Math.PI / 5);
  expect(savableState.flipStem).toBe(true);
  expect(savableState.loopShape).toBe('triangle');
  expect(savableState.maxTriangleLoopBranchingAngle).toBe(2 * Math.PI / 9);
});

it('savableState - can be converted to and read from a JSON string', () => {
  let bps = new StrictLayoutBaseProps();
  let savableState1 = bps.savableState();
  let json = JSON.stringify(savableState1);
  let savableState2 = JSON.parse(json);
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});
