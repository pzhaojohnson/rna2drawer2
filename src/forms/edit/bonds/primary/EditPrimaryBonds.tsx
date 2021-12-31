import * as React from 'react';
import { CloseButton } from 'Forms/buttons/CloseButton';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { BackwardForwardButtons } from 'Forms/history/BackwardForwardButtons';
import formStyles from './EditPrimaryBonds.css';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';
import { AppInterface as App } from 'AppInterface';
import { PrimaryBondInterface as PrimaryBond } from 'Draw/bonds/straight/PrimaryBondInterface';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';
import { StrokeWidthField } from './StrokeWidthField';
import { BasePaddingField } from './BasePaddingField';
import { ForwardAndBackwardButtons } from './ForwardAndBackwardButtons';

export type Props = {
  app: App;

  // the primary bonds to edit
  primaryBonds: PrimaryBond[];

  unmount: () => void;
  history: FormHistoryInterface;
}

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      Primary Bonds
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

export function EditPrimaryBonds(props: Props) {
  return (
    <div
      className={formStyles.form}
      style={{ position: 'relative', width: '324px', height: '100%', overflow: 'auto' }}
    >
      <div style={{ position: 'absolute', top: '0px', right: '0px' }} >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start' }} >
          <BackwardForwardButtons {...props.history} />
          <CloseButton onClick={() => props.unmount()} />
        </div>
      </div>
      <div style={{ margin: '16px 32px 0px 32px' }} >
        <Title />
      </div>
      <div style={{ margin: '8px 16px 0px 16px' }} >
        <TitleUnderline />
      </div>
      <div style={{ margin: '24px 40px 8px 40px' }} >
        {props.primaryBonds.length == 0 ? (
          <p className={'unselectable'} style={{ fontSize: '12px' }} >
            No primary bonds to edit.
          </p>
        ) : (
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              <StrokePicker app={props.app} primaryBonds={props.primaryBonds} />
              <div style={{ marginLeft: '10px' }} >
                <StrokeOpacityInput app={props.app} primaryBonds={props.primaryBonds} />
              </div>
              <div style={{ marginLeft: '8px' }} >
                <p className={`${colorFieldStyles.label} unselectable`} >
                  Color
                </p>
              </div>
            </div>
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
