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
import { ForwardBackwardButtons } from './ForwardBackwardButtons';

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
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <StrokeField {...props} />
          <div style={{ marginTop: '8px', display: 'flex' }} >
            <BaseSpacingField {...props} />
          </div>
          <div style={{ marginTop: '8px', display: 'flex' }} >
            <BasePaddingField {...props} />
          </div>
          <div style={{ marginTop: '8px', display: 'flex' }} >
            <StrokeWidthField {...props} />
          </div>
          <div style={{ marginTop: '16px' }} >
            <StrokeLinecapField {...props} />
          </div>
          <div style={{ margin: '8px 0px 0px 40px' }} >
            <DotifyAndSquarifyButtons {...props} />
          </div>
          <div style={{ marginTop: '16px' }} >
            <ForwardBackwardButtons {...props} />
          </div>
        </div>
      )}
    </PartialWidthContainer>
  );
}
