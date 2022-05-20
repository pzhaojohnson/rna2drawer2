import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import colorFieldStyles from 'Forms/inputs/color/ColorField.css';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';
import { StrokeWidthField } from './StrokeWidthField';
import { DashedField } from './DashedField';
import { BasePadding1Field } from './BasePadding1Field';
import { BasePadding2Field } from './BasePadding2Field';
import { BringToFrontButton } from './BringToFrontButton';
import { SendToBackButton } from './SendToBackButton';
import type { App } from 'App';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

export type Props = {
  app: App;

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBond[];

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditTertiaryBondsForm(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Tertiary Bonds'
      style={{ width: '324px' }}
    >
      {props.tertiaryBonds.length == 0 ? (
        <p className='unselectable' style={{ fontSize: '12px' }} >
          No tertiary bonds are selected.
        </p>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <StrokePicker app={props.app} tertiaryBonds={props.tertiaryBonds} />
            <div style={{ marginLeft: '10px' }} >
              <StrokeOpacityInput app={props.app} tertiaryBonds={props.tertiaryBonds} />
            </div>
            <div style={{ marginLeft: '8px' }} >
              <p className={`${colorFieldStyles.label} unselectable`} >
                Color
              </p>
            </div>
          </div>
          <div style={{ marginTop: '16px' }} >
            <StrokeWidthField app={props.app} tertiaryBonds={props.tertiaryBonds} />
          </div>
          <div style={{ marginTop: '12px' }} >
            <DashedField app={props.app} tertiaryBonds={props.tertiaryBonds} />
          </div>
          <div style={{ marginTop: '12px' }} >
            <BasePadding1Field app={props.app} tertiaryBonds={props.tertiaryBonds} />
          </div>
          <div style={{ marginTop: '8px' }} >
            <BasePadding2Field app={props.app} tertiaryBonds={props.tertiaryBonds} />
          </div>
          <div style={{ marginTop: '16px' }} >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              <BringToFrontButton app={props.app} tertiaryBonds={props.tertiaryBonds} />
              <div style={{ width: '18px' }} />
              <SendToBackButton app={props.app} tertiaryBonds={props.tertiaryBonds} />
            </div>
          </div>
        </div>
      )}
    </PartialWidthContainer>
  );
}
