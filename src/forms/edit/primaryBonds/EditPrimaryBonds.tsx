import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DrawingInterface as Drawing } from '../../../draw/DrawingInterface';
import { PrimaryBondInterface as PrimaryBond } from '../../../draw/StraightBondInterface';
import { ClosableContainer } from '../../containers/ClosableContainer';
import { StrokeField } from './StrokeField';
import { StrokeWidthField } from './StrokeWidthField';
import { PaddingField } from './PaddingField';

function getPrimaryBonds(drawing: Drawing): PrimaryBond[] {
  let pbs = [] as PrimaryBond[];
  drawing.forEachPrimaryBond(pb => pbs.push(pb));
  return pbs;
}

interface Props {
  app: App;
  close: () => void;
}

export function EditPrimaryBonds(props: Props): React.ReactElement {
  let pbs = getPrimaryBonds(props.app.strictDrawing.drawing);
  let fieldProps = {
    getPrimaryBonds: () => [...pbs],
    pushUndo: () => props.app.pushUndo(),
    changed: () => props.app.drawingChangedNotByInteraction(),
  };
  return (
    <ClosableContainer
      close={props.close}
      title='Edit Primary Bonds'
      contained={
        props.app.strictDrawing.drawing.numPrimaryBonds == 0 ? (
          <p>Drawing has no primary bonds.</p>
        ) : (
          <div>
            <div>
              <StrokeField {...fieldProps} />
            </div>
            <div style={{ marginTop: '16px' }} >
              <StrokeWidthField {...fieldProps} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <PaddingField {...fieldProps} />
            </div>
          </div>
        )
      }
    />
  );
}
