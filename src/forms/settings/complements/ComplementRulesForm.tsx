import type { App } from 'App';

import * as React from 'react';

import { PartialWidthContainer } from 'Forms/containers/partial-width/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { AllowedMismatchField } from './AllowedMismatchField';
import { AllowedGUTField } from './AllowedGUTField';
import { IUPACField } from './IUPACField';

export type Props = {
  unmount: () => void;
  history: FormHistoryInterface;

  /**
   * A reference to the whole app.
   */
  app: App;
}

export function ComplementRulesForm(props: Props) {
  return (
    <PartialWidthContainer
      {...props}
      title='Complement Rules'
      style={{ width: '328px' }}
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
