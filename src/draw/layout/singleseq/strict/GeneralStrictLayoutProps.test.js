import GeneralStrictLayoutProps from './GeneralStrictLayoutProps';

it('fromSavedState static method', () => {
  let gps1 = new GeneralStrictLayoutProps();
  gps1.outermostLoopShape = 'flat';
  gps1.rotation = Math.PI / 5;
  gps1.basePairBondLength = 5.4;
  gps1.basePairPadding = 3.2;
  gps1.terminiGap = 5.44;
  let savableState1 = gps1.savableState();
  let gps2 = GeneralStrictLayoutProps.fromSavedState(savableState1);
  let savableState2 = gps2.savableState();
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});

it('fromSavedState static method - ignores undefined properties', () => {
  let gps1 = new GeneralStrictLayoutProps();
  let gps2 = GeneralStrictLayoutProps.fromSavedState({});
  let savableState1 = gps1.savableState();
  let savableState2 = gps2.savableState();
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});

it('basic test of constructor', () => {
  expect(() => { new GeneralStrictLayoutProps() }).not.toThrow();
});

it('deepCopy', () => {
  let gps1 = new GeneralStrictLayoutProps();
  gps1.outermostLoopShape = 'flat';
  gps1.rotation = 2 * Math.PI / 3;
  gps1.basePairBondLength = 0.77;
  gps1.basePairPadding = 0.1;
  gps1.terminiGap = 0.8;
  let gps2 = gps1.deepCopy();
  expect(gps2).not.toBe(gps1);
  let savableState1 = gps1.savableState();
  let savableState2 = gps2.savableState();
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});

it('savableState', () => {
  let gps = new GeneralStrictLayoutProps();
  gps.outermostLoopShape = 'flat';
  gps.rotation = Math.PI / 3;
  gps.basePairBondLength = 2.8;
  gps.basePairPadding = 0.77;
  gps.terminiGap = 7.8;
  let savableState = gps.savableState();
  expect(savableState.outermostLoopShape).toBe('flat');
  expect(savableState.rotation).toBe(Math.PI / 3);
  expect(savableState.basePairBondLength).toBe(2.8);
  expect(savableState.basePairPadding).toBe(0.77);
  expect(savableState.terminiGap).toBe(7.8);
});

it('savableState - can be coverted to and read from a JSON string', () => {
  let gps = new GeneralStrictLayoutProps();
  let savableState1 = gps.savableState();
  let json = JSON.stringify(savableState1);
  let savableState2 = JSON.parse(json);
  Object.keys(savableState1).forEach(k => {
    expect(savableState2[k]).toBe(savableState1[k]);
  });
});
