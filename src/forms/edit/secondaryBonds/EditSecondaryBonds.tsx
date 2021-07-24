import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DrawingInterface as Drawing } from '../../../draw/DrawingInterface';
import { SecondaryBondInterface as SecondaryBond } from 'Draw/bonds/straight/SecondaryBondInterface';
import { ClosableContainer } from '../../containers/ClosableContainer';
import { SecondaryBondsByType } from './FieldProps';
import {
  AutStrokeField,
  GcStrokeField,
  GutStrokeField,
  OtherStrokeField,
} from './StrokeFields';
import { BaseSpacingField } from './BaseSpacingField';
import { BasePaddingField } from './BasePaddingField';
import { StrokeWidthField } from './StrokeWidthField';
import { ForwardAndBackwardButtons } from './ForwardAndBackwardButtons';

function getSecondaryBondsByType(drawing: Drawing): SecondaryBondsByType {
  let sbs = {
    aut: [] as SecondaryBond[],
    gc: [] as SecondaryBond[],
    gut: [] as SecondaryBond[],
    other: [] as SecondaryBond[],
  };
  drawing.secondaryBonds.forEach(sb => {
    let t = sb.type;
    if (t == 'AUT') {
      sbs.aut.push(sb);
    } else if (t == 'GC') {
      sbs.gc.push(sb);
    } else if (t == 'GUT') {
      sbs.gut.push(sb);
    } else {
      sbs.other.push(sb);
    }
  });
  return sbs;
}

interface Props {
  app: App;
  close: () => void;
}

export function EditSecondaryBonds(props: Props): React.ReactElement {
  let sbsByType = getSecondaryBondsByType(props.app.strictDrawing.drawing);
  let allSbs = [...sbsByType.aut, ...sbsByType.gc, ...sbsByType.gut, ...sbsByType.other];
  let fieldProps = {
    app: props.app,
    getSecondaryBondsByType: () => ({ ...sbsByType }),
    getAllSecondaryBonds: () => [...allSbs],
    pushUndo: () => props.app.pushUndo(),
    changed: () => props.app.drawingChangedNotByInteraction(),
  };
  return (
    <ClosableContainer
      close={props.close}
      title='Edit Secondary Bonds'
      contained={
        allSbs.length == 0 ? (
          <p>Drawing has no secondary bonds.</p>
        ) : (
          <div>
            {sbsByType.aut.length == 0 ? null : (
              <div style={{ marginBottom: '16px' }} >
                <AutStrokeField {...fieldProps} />
              </div>
            )}
            {sbsByType.gc.length == 0 ? null : (
              <div style={{ marginBottom: '16px' }} >
                <GcStrokeField {...fieldProps} />
              </div>
            )}
            {sbsByType.gut.length == 0 ? null : (
              <div style={{ marginBottom: '16px' }} >
                <GutStrokeField {...fieldProps} />
              </div>
            )}
            {sbsByType.other.length == 0 ? null : (
              <div style={{ marginBottom: '16px' }} >
                <OtherStrokeField {...fieldProps} />
              </div>
            )}
            <div style={{ marginBottom: '8px' }} >
              <BaseSpacingField {...fieldProps} />
            </div>
            <div style={{ marginBottom: '8px' }} >
              <BasePaddingField {...fieldProps} />
            </div>
            <div style={{ marginBottom: '12px' }} >
              <StrokeWidthField {...fieldProps} />
            </div>
            <ForwardAndBackwardButtons {...fieldProps} />
          </div>
        )
      }
    />
  );
}
