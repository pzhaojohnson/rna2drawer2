import type { App } from 'App';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import colorFieldStyles from 'Forms/inputs/color/ColorField.css';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';
import { BaseSpacingField } from './BaseSpacingField';
import { BasePaddingField } from './BasePaddingField';
import { StrokeWidthField } from './StrokeWidthField';
import { StrokeLinecapField } from './StrokeLinecapField';
import { DotifyAndSquarifyButtons } from './DotifyAndSquarifyButtons';
import { BringToFrontButton } from './BringToFrontButton';
import { SendToBackButton } from './SendToBackButton';

export type Props = {
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditSecondaryBondsForm(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Secondary Bonds'
      style={{ width: '324px' }}
    >
      {props.secondaryBonds.length == 0 ? (
        <p className='unselectable' style={{ fontSize: '12px' }} >
          No secondary bonds to edit.
        </p>
      ) : (
        <div>
          <div style={{ paddingBottom: '8px' }} >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              <StrokePicker app={props.app} secondaryBonds={props.secondaryBonds} />
              <div style={{ marginLeft: '10px' }} >
                <StrokeOpacityInput app={props.app} secondaryBonds={props.secondaryBonds} />
              </div>
              <div style={{ marginLeft: '8px' }} >
                <p className={`${colorFieldStyles.label} unselectable`} >
                  Color
                </p>
              </div>
            </div>
          </div>
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
            <StrokeLinecapField app={props.app} secondaryBonds={props.secondaryBonds} />
          </div>
          <div style={{ margin: '8px 0px 0px 40px' }} >
            <DotifyAndSquarifyButtons app={props.app} secondaryBonds={props.secondaryBonds} />
          </div>
          <div style={{ marginTop: '16px' }} >
            <div style={{ display: 'flex', flexDirection: 'row' }} >
              <BringToFrontButton app={props.app} secondaryBonds={props.secondaryBonds} />
              <div style={{ width: '18px' }} />
              <SendToBackButton app={props.app} secondaryBonds={props.secondaryBonds} />
            </div>
          </div>
        </div>
      )}
    </PartialWidthContainer>
  );
}
