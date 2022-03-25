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

export function ComplementRules(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Complement Rules'
      style={{ width: '324px' }}
    >
      <AllowedMismatchField app={props.app} />
      <div style={{ marginTop: '12px' }} >
        <AllowedGUTField app={props.app} />
      </div>
      <div style={{ marginTop: '12px' }} >
        <IUPACField app={props.app} />
      </div>
    </PartialWidthContainer>
  );
}
