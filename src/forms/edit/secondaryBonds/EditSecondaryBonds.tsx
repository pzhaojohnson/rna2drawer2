import * as React from 'react';
import { CloseButton } from 'Forms/buttons/CloseButton';
import styles from './EditSecondaryBonds.css';
import { AppInterface as App } from 'AppInterface';
import { SecondaryBondInterface as SecondaryBond } from 'Draw/bonds/straight/SecondaryBondInterface';
import {
  AUTStrokeField,
  GCStrokeField,
  GUTStrokeField,
  OtherStrokeField,
} from './StrokeField';
import { BaseSpacingField } from './BaseSpacingField';
import { BasePaddingField } from './BasePaddingField';
import { StrokeWidthField } from './StrokeWidthField';
import { ForwardAndBackwardButtons } from './ForwardAndBackwardButtons';

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
      Edit Secondary Bonds
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

export function EditSecondaryBonds(props: Props) {
  return (
    <div
      className={styles.form}
      style={{ position: 'relative', width: '332px', height: '100%', overflow: 'auto' }}
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
        {props.secondaryBonds.length == 0 ? (
          <p className={'unselectable'} style={{ fontSize: '12px' }} >
            No secondary bonds to edit.
          </p>
        ) : (
          <div>
            {numAUTBonds(props.secondaryBonds) == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <AUTStrokeField app={props.app} secondaryBonds={props.secondaryBonds} />
              </div>
            )}
            {numGCBonds(props.secondaryBonds) == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <GCStrokeField app={props.app} secondaryBonds={props.secondaryBonds} />
              </div>
            )}
            {numGUTBonds(props.secondaryBonds) == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <GUTStrokeField app={props.app} secondaryBonds={props.secondaryBonds} />
              </div>
            )}
            {numOtherBonds(props.secondaryBonds) == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <OtherStrokeField app={props.app} secondaryBonds={props.secondaryBonds} />
              </div>
            )}
            <div style={{ marginTop: '8px' }} >
              <BaseSpacingField app={props.app} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <BasePaddingField app={props.app} secondaryBonds={props.secondaryBonds} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <StrokeWidthField app={props.app} secondaryBonds={props.secondaryBonds} />
            </div>
            <div style={{ marginTop: '16px' }} >
              <ForwardAndBackwardButtons app={props.app} secondaryBonds={props.secondaryBonds} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
