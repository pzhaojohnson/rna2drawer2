import { PerBaseStrictLayoutProps as PerBaseProps } from 'Draw/strict/layout/PerBaseStrictLayoutProps';

import {
  perStemProps,
  setPerStemProps,
  resetStemProps,
} from './PerStemProps';

test('perStemProps function', () => {
  let psps = {
    flipStem: Math.random() >= 0.5,
    loopShape: Math.random() >= 0.5 ? 'round' : 'triangle',
    triangleLoopHeight: 100 * Math.random(),
  };
  let pbps = new PerBaseProps();
  pbps.flipStem = psps.flipStem;
  pbps.loopShape = psps.loopShape;
  pbps.triangleLoopHeight = psps.triangleLoopHeight;
  expect(perStemProps(pbps)).toStrictEqual(psps);
});

test('setPerStemProps function', () => {
  let psps = {
    flipStem: Math.random() < 0.5,
    loopShape: Math.random() >= 0.5 ? 'triangle' : 'round',
    triangleLoopHeight: 50 * Math.random(),
  };
  let pbps = new PerBaseProps();
  expect(perStemProps(pbps)).not.toStrictEqual(psps);
  setPerStemProps(pbps, psps);
  expect(perStemProps(pbps)).toStrictEqual(psps);
});

test('resetStemProps function', () => {
  let psps = {
    flipStem: Math.random() < 0.5,
    loopShape: Math.random() >= 0.5 ? 'triangle' : 'round',
    triangleLoopHeight: 75 * Math.random(),
  };
  let pbps = new PerBaseProps();
  setPerStemProps(pbps, psps);
  let defaults = new PerBaseProps();
  expect(perStemProps(pbps)).not.toStrictEqual(perStemProps(defaults));
  resetStemProps(pbps);
  expect(perStemProps(pbps)).toStrictEqual(perStemProps(defaults));
});
