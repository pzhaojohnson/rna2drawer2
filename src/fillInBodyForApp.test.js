import {
  fillInBodyForApp,
  getMenuContainer,
  getDrawingContainer,
  getFormContainer,
  getInfobarContainer,
} from './fillInBodyForApp';

it('fills in body and can retrieve unique containers', () => {
  fillInBodyForApp();
  let containers = {};
  let mc = getMenuContainer();
  containers[mc.id] = mc;
  let dc = getDrawingContainer();
  containers[dc.id] = dc;
  let fc = getFormContainer();
  containers[fc.id] = fc;
  let ic = getInfobarContainer();
  containers[ic.id] = ic;
  expect(Object.keys(containers).length).toBe(4);
});
