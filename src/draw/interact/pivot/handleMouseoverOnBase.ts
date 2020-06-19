import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import Base from '../../Base';
import stemOfPosition from '../../../parse/stemOfPosition';
import highlightStem from './highlightStem';

function handleMouseoverOnBase(mode: PivotingMode, b: Base) {
  if (mode.selectedPosition) {
    return;
  }
  let p = mode.strictDrawing.drawing.overallPositionOfBase(b);
  let partners = mode.strictDrawing.layoutPartners();
  let st = stemOfPosition(p, partners);
  if (st) {
    highlightStem(mode, st);
  }
}

export default handleMouseoverOnBase;
