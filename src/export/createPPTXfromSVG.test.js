import {
  createPPTXfromSVG,
  _NUMBER_TRIM,
  _trimNum,
} from './createPPTXfromSVG';
import { trimNum } from './trimNum';
import PptxGenJs from 'pptxgenjs';

it('_trimNum function', () => {
  let n = 7.1298471294;
  let trimmed = trimNum(n, _NUMBER_TRIM);
  expect(trimmed).not.toEqual(n);
  expect(_trimNum(n)).toEqual(trimmed);
});
