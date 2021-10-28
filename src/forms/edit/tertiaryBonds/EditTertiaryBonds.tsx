import * as React from 'react';
import { ClosableContainer } from '../../containers/ClosableContainer';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';
import { StrokeWidthField } from './StrokeWidthField';
import { DashedField } from './DashedField';
import { BasePadding1Field } from './BasePadding1Field';
import { BasePadding2Field } from './BasePadding2Field';
import { BringToFrontButton } from './BringToFrontButton';
import { SendToBackButton } from './SendToBackButton';
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
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <StrokePicker app={props.app} tertiaryBonds={props.getTertiaryBonds()} />
                <div style={{ marginLeft: '12px' }} >
                  <StrokeOpacityInput app={props.app} tertiaryBonds={props.getTertiaryBonds()} />
                </div>
                <div style={{ marginLeft: '8px' }} >
                  <p className={`${colorFieldStyles.label} unselectable`} >
                    Color
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '16px' }} >
                <StrokeWidthField app={props.app} tertiaryBonds={props.getTertiaryBonds()} />
              </div>
              <div style={{ marginTop: '12px' }} >
                <DashedField app={props.app} tertiaryBonds={props.getTertiaryBonds()} />
              </div>
              <div style={{ marginTop: '12px' }} >
                <BasePadding1Field app={props.app} tertiaryBonds={props.getTertiaryBonds()} />
              </div>
              <div style={{ marginTop: '8px' }} >
                <BasePadding2Field app={props.app} tertiaryBonds={props.getTertiaryBonds()} />
              </div>
              <div style={{ marginTop: '16px' }} >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                  <BringToFrontButton app={props.app} tertiaryBonds={props.getTertiaryBonds()} />
                  <div style={{ width: '16px' }} />
                  <SendToBackButton app={props.app} tertiaryBonds={props.getTertiaryBonds()} />
                </div>
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
