import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import colorFieldStyles from 'Forms/inputs/color/ColorField.css';
import type { App } from 'App';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
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

export function EditPrimaryBonds(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Primary Bonds'
      style={{ width: '324px' }}
    >
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
    </PartialWidthContainer>
  );
}
