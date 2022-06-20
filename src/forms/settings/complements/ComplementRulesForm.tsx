import type { App } from 'App';

import * as React from 'react';

import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { AllowedMismatchField } from './AllowedMismatchField';
import { AllowedGUTField } from './AllowedGUTField';
import { IUPACField } from './IUPACField';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  unmount: () => void;
  history: FormHistoryInterface;
}

export function ComplementRulesForm(props: Props) {
  return (
    <PartialWidthContainer
      {...props}
      title='Complement Rules'
      style={{ width: '324px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }} >
        <AllowedMismatchField {...props} />
        <div style={{ height: '14px' }} />
        <AllowedGUTField {...props} />
        <div style={{ height: '14px' }} />
        <IUPACField {...props} />
      </div>
    </PartialWidthContainer>
  );
}
