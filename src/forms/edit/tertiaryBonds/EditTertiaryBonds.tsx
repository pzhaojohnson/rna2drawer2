import * as React from 'react';
import { ClosableContainer } from '../../containers/ClosableContainer';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import { StrokeField } from './StrokeField';
import { StrokeWidthField } from './StrokeWidthField';
import { DashedField } from './DashedField';
import { PaddingField1, PaddingField2 } from './PaddingFields';
import { ForwardAndBackwardButtons } from './ForwardAndBackwardButtons';
import { RemoveButton } from './RemoveButton';

interface Props {
  app: App;
  drawing: Drawing;
  getTertiaryBonds: () => TertiaryBond[];
  pushUndo: () => void;
  changed: () => void;
  close: () => void;
}

export function EditTertiaryBonds(props: Props): React.ReactElement {
  return (
    <ClosableContainer
      close={props.close}
      title={'Edit Tertiary Bonds'}
      contained={
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          {props.getTertiaryBonds().length == 0 ? (
            <p>No tertiary bonds are selected.</p>
          ) : (
            <div>
              <StrokeField {...props} />
              <div style={{ marginTop: '16px' }} >
                <StrokeWidthField {...props} />
              </div>
              <div style={{ marginTop: '16px' }} >
                <DashedField {...props} />
              </div>
              <div style={{ marginTop: '16px' }} >
                <PaddingField1 {...props} />
              </div>
              <div style={{ marginTop: '16px' }} >
                <PaddingField2 {...props} />
              </div>
              <div style={{ marginTop: '16px' }} >
                <ForwardAndBackwardButtons {...props} />
              </div>
              <div style={{ marginTop: '32px' }} >
                <RemoveButton {...props} />
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
