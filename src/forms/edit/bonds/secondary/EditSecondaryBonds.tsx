import * as React from 'react';
import { CloseButton } from 'Forms/buttons/CloseButton';
import formStyles from './EditSecondaryBonds.css';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';
import { AppInterface as App } from 'AppInterface';
import { SecondaryBondInterface as SecondaryBond } from 'Draw/bonds/straight/SecondaryBondInterface';
import {
  AUTStrokePicker,
  GCStrokePicker,
  GUTStrokePicker,
  OtherStrokePicker,
} from './StrokePicker';
import {
  AUTStrokeOpacityInput,
  GCStrokeOpacityInput,
  GUTStrokeOpacityInput,
  OtherStrokeOpacityInput,
} from './StrokeOpacityInput';
import { BaseSpacingField } from './BaseSpacingField';
import { BasePaddingField } from './BasePaddingField';
import { StrokeWidthField } from './StrokeWidthField';
import { BringToFrontButton } from './BringToFrontButton';
import { SendToBackButton } from './SendToBackButton';

export type Props = {
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];

  unmount: () => void;
}

function numAUTBonds(secondaryBonds: SecondaryBond[]): number {
  return secondaryBonds.filter(sb => sb.type == 'AUT').length;
}

function numGCBonds(secondaryBonds: SecondaryBond[]): number {
  return secondaryBonds.filter(sb => sb.type == 'GC').length;
}

function numGUTBonds(secondaryBonds: SecondaryBond[]): number {
  return secondaryBonds.filter(sb => sb.type == 'GUT').length;
}

function numOtherBonds(secondaryBonds: SecondaryBond[]): number {
  return secondaryBonds.filter(sb => sb.type == 'other').length;
}

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      Secondary Bonds
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
        borderColor: 'rgba(0,0,0,0.175)',
      }}
    />
  );
}

export function EditSecondaryBonds(props: Props) {
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
      <div style={{ margin: '24px 40px 8px 40px' }} >
        {props.secondaryBonds.length == 0 ? (
          <p className='unselectable' style={{ fontSize: '12px' }} >
            No secondary bonds to edit.
          </p>
        ) : (
          <div>
            {numAUTBonds(props.secondaryBonds) == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                  <AUTStrokePicker app={props.app} secondaryBonds={props.secondaryBonds} />
                  <div style={{ marginLeft: '10px' }} >
                    <AUTStrokeOpacityInput app={props.app} secondaryBonds={props.secondaryBonds} />
                  </div>
                  <div style={{ marginLeft: '8px' }} >
                    <p className={`${colorFieldStyles.label} unselectable`} >
                      AU and AT Color
                    </p>
                  </div>
                </div>
              </div>
            )}
            {numGCBonds(props.secondaryBonds) == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                  <GCStrokePicker app={props.app} secondaryBonds={props.secondaryBonds} />
                  <div style={{ marginLeft: '10px' }} >
                    <GCStrokeOpacityInput app={props.app} secondaryBonds={props.secondaryBonds} />
                  </div>
                  <div style={{ marginLeft: '8px' }} >
                    <p className={`${colorFieldStyles.label} unselectable`} >
                      GC Color
                    </p>
                  </div>
                </div>
              </div>
            )}
            {numGUTBonds(props.secondaryBonds) == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                  <GUTStrokePicker app={props.app} secondaryBonds={props.secondaryBonds} />
                  <div style={{ marginLeft: '10px' }} >
                    <GUTStrokeOpacityInput app={props.app} secondaryBonds={props.secondaryBonds} />
                  </div>
                  <div style={{ marginLeft: '8px' }} >
                    <p className={`${colorFieldStyles.label} unselectable`} >
                      GU and GT Color
                    </p>
                  </div>
                </div>
              </div>
            )}
            {numOtherBonds(props.secondaryBonds) == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                  <OtherStrokePicker app={props.app} secondaryBonds={props.secondaryBonds} />
                  <div style={{ marginLeft: '10px' }} >
                    <OtherStrokeOpacityInput app={props.app} secondaryBonds={props.secondaryBonds} />
                  </div>
                  <div style={{ marginLeft: '8px' }} >
                    <p className={`${colorFieldStyles.label} unselectable`} >
                      Noncanonical Color
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div style={{ marginTop: '10px' }} >
              <BaseSpacingField app={props.app} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <BasePaddingField app={props.app} secondaryBonds={props.secondaryBonds} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <StrokeWidthField app={props.app} secondaryBonds={props.secondaryBonds} />
            </div>
            <div style={{ marginTop: '16px' }} >
              <div style={{ display: 'flex', flexDirection: 'row' }} >
                <BringToFrontButton app={props.app} secondaryBonds={props.secondaryBonds} />
                <div style={{ width: '16px' }} />
                <SendToBackButton app={props.app} secondaryBonds={props.secondaryBonds} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
