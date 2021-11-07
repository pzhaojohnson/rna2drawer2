import * as React from 'react';
import formStyles from './EditTertiaryBonds.css';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';
import { CloseButton } from 'Forms/buttons/CloseButton';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';
import { StrokeWidthField } from './StrokeWidthField';
import { DashedField } from './DashedField';
import { BasePadding1Field } from './BasePadding1Field';
import { BasePadding2Field } from './BasePadding2Field';
import { BringToFrontButton } from './BringToFrontButton';
import { SendToBackButton } from './SendToBackButton';
import { RemoveButton } from './RemoveButton';
import { AppInterface as App } from 'AppInterface';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';

export type Props = {
  app: App;

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBond[];

  unmount: () => void;
}

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      Tertiary Bonds
    </p>
  );
}

function TitleUnderline() {
  return (
    <div
      style={{
        height: '0px',
        borderWidth: '0px 0px 1px 0px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.2)',
      }}
    />
  );
}

export function EditTertiaryBonds(props: Props) {
  return (
    <div
      className={formStyles.form}
      style={{ position: 'relative', width: '324px', height: '100%', overflow: 'auto' }}
    >
      <div style={{ position: 'absolute', top: '0px', right: '0px' }} >
        <CloseButton
          onClick={() => props.unmount()}
        />
      </div>
      <div style={{ margin: '16px 32px 0px 32px' }} >
        <Title />
      </div>
      <div style={{ margin: '8px 16px 0px 16px' }} >
        <TitleUnderline />
      </div>
      <div style={{ margin: '24px 40px 0px 40px' }} >
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
                <div style={{ width: '16px' }} />
                <SendToBackButton app={props.app} tertiaryBonds={props.tertiaryBonds} />
              </div>
            </div>
            <div style={{ marginTop: '24px' }} >
              <RemoveButton app={props.app} tertiaryBonds={props.tertiaryBonds} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
