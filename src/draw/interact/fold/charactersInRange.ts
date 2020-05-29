import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import {
  basesInRange,
  Range,
} from './basesInRange';
import Base from '../../Base';

export function charactersInRange(mode: FoldingMode, r: Range): string {
  let cs = '';
  basesInRange(mode, r).forEach((b: Base) => {
    cs += b.character;
  });
  return cs;
}

export default charactersInRange;
