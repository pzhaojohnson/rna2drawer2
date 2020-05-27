import { PivotingModeInterface as PivotingMode } from './PivotingModeInterface';
import Base from '../../Base';
import positionIsInStem from '../../../parse/positionIsInStem';
import stemOfPosition from '../../../parse/stemOfPosition';
import highlightStem from './highlightStem';

function handleMouseoverOnBase(mode: PivotingMode, b: Base) {
  if (mode.selectedPosition) {
    return;
  }
  let p = mode.strictDrawing.drawing.overallPositionOfBase(b);
  let partners = mode.strictDrawing.layoutPartners();
  if (positionIsInStem(p, partners)) {
    highlightStem(
      mode,
      stemOfPosition(p, partners),
    );
  }
}

export default handleMouseoverOnBase;
