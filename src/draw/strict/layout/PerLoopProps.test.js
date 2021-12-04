import { PerBaseStrictLayoutProps as PerBaseProps } from 'Draw/strict/layout/PerBaseStrictLayoutProps';

import {
  perLoopProps,
  setPerLoopProps,
  resetPerLoopProps,
} from './PerLoopProps';

test('perLoopProps function', () => {
  let plps = {
    loopShape: Math.random() >= 0.5 ? 'round' : 'triangle',
    triangleLoopHeight: 200 * Math.random(),
  };
  let pbps = new PerBaseProps();
  pbps.loopShape = plps.loopShape;
  pbps.triangleLoopHeight = plps.triangleLoopHeight;
  expect(perLoopProps(pbps)).toStrictEqual(plps);
});

test('setPerLoopProps function', () => {
  let plps = {
    loopShape: Math.random() >= 0.5 ? 'triangle' : 'round',
    triangleLoopHeight: 55 * Math.random(),
  };
  let pbps = new PerBaseProps();
  expect(perLoopProps(pbps)).not.toStrictEqual(plps);
  setPerLoopProps(pbps, plps);
  expect(perLoopProps(pbps)).toStrictEqual(plps);
});

test('resetPerLoopProps function', () => {
  let plps = {
    loopShape: Math.random() >= 0.5 ? 'triangle' : 'round',
    triangleLoopHeight: 25 * Math.random(),
  };
  let pbps = new PerBaseProps();
  setPerLoopProps(pbps, plps);
  let defaults = new PerBaseProps();
  expect(perLoopProps(pbps)).not.toStrictEqual(perLoopProps(defaults));
  resetPerLoopProps(pbps);
  expect(perLoopProps(pbps)).toStrictEqual(perLoopProps(defaults));
});
