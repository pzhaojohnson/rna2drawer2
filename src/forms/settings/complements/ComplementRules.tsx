import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { AppInterface as App } from 'AppInterface';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { IncludeGUTField } from './IncludeGUTField';
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
        <IncludeGUTField app={props.app} />
      </div>
    </PartialWidthContainer>
  );
}
