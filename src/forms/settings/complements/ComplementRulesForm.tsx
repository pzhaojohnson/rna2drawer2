import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import type { App } from 'App';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { AllowedGUTField } from './AllowedGUTField';
import { IUPACField } from './IUPACField';
import { AllowedMismatchField } from './AllowedMismatchField';

export type Props = {
  app: App;
  unmount: () => void;
  history: FormHistoryInterface;
}

export function ComplementRulesForm(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Complement Rules'
      style={{ width: '324px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }} >
        <AllowedMismatchField app={props.app} />
        <div style={{ marginTop: '12px' }} >
          <AllowedGUTField app={props.app} />
        </div>
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column' }} >
          <IUPACField app={props.app} />
        </div>
      </div>
    </PartialWidthContainer>
  );
}
