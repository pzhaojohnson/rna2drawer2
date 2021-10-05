import * as React from 'react';
import ClosableContainer from '../../containers/ClosableContainer';
import { IncludeGUTField } from './IncludeGUTField';
import { AllowedMismatchField } from './AllowedMismatchField';
import { AppInterface as App } from '../../../AppInterface';

export function ComplementRules(app: App): React.ReactElement {
  return (
    <ClosableContainer
      close={() => app.unmountCurrForm()}
      title={'Complement Rules'}
      contained={
        <div
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <IncludeGUTField app={app} />
          <div style={{ marginTop: '16px' }} >
            <AllowedMismatchField app={app} />
          </div>
        </div>
      }
    />
  );
}

export default ComplementRules;
