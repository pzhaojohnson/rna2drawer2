import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import IntegerRange from './IntegerRange';
import basesInRange from './basesInRange';
import { Base } from 'Draw/bases/Base';

export function charactersInRange(mode: FoldingMode, r: IntegerRange): string {
  let cs = '';
  basesInRange(mode, r).forEach((b: Base) => {
    cs += b.character;
  });
  return cs;
}

export default charactersInRange;
