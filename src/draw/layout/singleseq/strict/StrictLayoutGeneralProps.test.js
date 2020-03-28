import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';

it('fromSavedState static method', () => {
  let gps1 = new StrictLayoutGeneralProps();
  let savableState1 = gps1.savableState();
  let gps2 = StrictLayoutGeneralProps.fromSavedState(savableState1);
  let savableState2 = gps2.savableState();
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});

it('fromSavedState static method - ignores undefined properties', () => {
  let gps1 = new StrictLayoutGeneralProps();
  let gps2 = StrictLayoutGeneralProps.fromSavedState({});
  let savableState1 = gps1.savableState();
  let savableState2 = gps2.savableState();
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});

it('basic test of constructor', () => {
  expect(() => { new StrictLayoutGeneralProps() }).not.toThrow();
});

it('deepCopy', () => {
  let gps = new StrictLayoutGeneralProps();
  let copy = gps.deepCopy();
  expect(copy).not.toBe(gps);
  let savableState = gps.savableState();
  let copySavableState = copy.savableState();
  Object.keys(savableState).forEach(k => {
    expect(copySavableState[k]).toBe(savableState[k]);
  });
});

it('savableState', () => {
  let gps = new StrictLayoutGeneralProps();
  gps.flatOutermostLoop = true;
  gps.rotation = Math.PI / 3;
  gps.basePairBondLength = 2.8;
  gps.basePairPadding = 0.77;
  gps.terminiGap = 7.8;
  let savableState = gps.savableState();
  expect(savableState.flatOutermostLoop).toBe(true);
  expect(savableState.rotation).toBe(Math.PI / 3);
  expect(savableState.basePairBondLength).toBe(2.8);
  expect(savableState.basePairPadding).toBe(0.77);
  expect(savableState.terminiGap).toBe(7.8);
});

it('savableState - can be coverted to and read from a JSON string', () => {
  let gps = new StrictLayoutGeneralProps();
  let savableState1 = gps.savableState();
  let json = JSON.stringify(savableState1);
  let savableState2 = JSON.parse(json);
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});
