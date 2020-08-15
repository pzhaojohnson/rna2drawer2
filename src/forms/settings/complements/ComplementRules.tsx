import * as React from 'react';
import ClosableContainer from '../../ClosableContainer';
const uuidv1 = require('uuid/v1');
import Title from '../../Title';
import Underline from '../../Underline';
import IncludeGUTField from './IncludeGUTField';
import AllowedMismatchField from './AllowedMismatchField';
import App from '../../../App';

export function ComplementRules(app: App): React.ReactElement {
  return (
    <ClosableContainer
      close={() => app.unmountCurrForm()}
      children={[
        <div
          key={uuidv1()}
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Title text={'Complement Rules'} margin={'16px 32px 0px 32px'} />
          <Underline margin={'8px 16px 0px 16px'} />
          <div style={{ margin: '24px 40px 0px 40px' }} >
            <div>
              {IncludeGUTField(app)}
            </div>
            <div style={{ marginTop: '16px' }} >
              {AllowedMismatchField(app)}
            </div>
          </div>
        </div>
      ]}
    />
  );
}

export default ComplementRules;
