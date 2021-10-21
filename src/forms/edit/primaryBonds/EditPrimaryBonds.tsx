import * as React from 'react';
import { CloseButton } from 'Forms/buttons/CloseButton';
import styles from './EditPrimaryBonds.css';
import { AppInterface as App } from 'AppInterface';
import { PrimaryBondInterface as PrimaryBond } from 'Draw/bonds/straight/PrimaryBondInterface';
import { StrokeField } from './StrokeField';
import { StrokeWidthField } from './StrokeWidthField';
import { BasePaddingField } from './BasePaddingField';
import { ForwardAndBackwardButtons } from './ForwardAndBackwardButtons';

export type Props = {
  app: App;

  // the primary bonds to edit
  primaryBonds: PrimaryBond[];

  unmount: () => void;
}

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      Edit Primary Bonds
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

export function EditPrimaryBonds(props: Props) {
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
        {props.primaryBonds.length == 0 ? (
          <p className={'unselectable'} style={{ fontSize: '12px' }} >
            No primary bonds to edit.
          </p>
        ) : (
          <div>
            <StrokeField app={props.app} primaryBonds={props.primaryBonds} />
            <div style={{ marginTop: '16px' }} >
              <StrokeWidthField app={props.app} primaryBonds={props.primaryBonds} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <BasePaddingField app={props.app} primaryBonds={props.primaryBonds} />
            </div>
            <div style={{ marginTop: '16px' }} >
              <ForwardAndBackwardButtons app={props.app} primaryBonds={props.primaryBonds} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
