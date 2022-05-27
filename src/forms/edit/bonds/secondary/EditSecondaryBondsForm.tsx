import type { App } from 'App';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { StrokeField } from './StrokeField';
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
          <StrokeField {...props} />
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
