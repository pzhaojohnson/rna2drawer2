import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from 'AppInterface';
import { CloseButton } from 'Forms/buttons/CloseButton';
import { IncludeGUTField } from './IncludeGUTField';
import { AllowedMismatchField } from './AllowedMismatchField';

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      Complement Rules
    </p>
  );
}

function TitleUnderline() {
  return (
    <div
      style={{
        height: '0px',
        borderWidth: '0px 0px 1px 0px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.2)',
      }}
    />
  );
}

export type Props = {
  app: App;
}

export function ComplementRules(props: Props) {
  let [isOpen, setIsOpen] = useState(true);
  return !isOpen ? null : (
    <div style={{ position: 'relative', width: '400px', display: 'flex', flexDirection: 'column' }} >
      <div style={{ position: 'absolute', top: '0px', right: '0px' }} >
        <CloseButton
          onClick={() => setIsOpen(false)}
        />
      </div>
      <div style={{ margin: '16px 32px 0px 32px' }} >
        <Title />
      </div>
      <div style={{ margin: '8px 16px 0px 16px' }} >
        <TitleUnderline />
      </div>
      <div style={{ margin: '24px 40px 0px 40px' }} >
        <IncludeGUTField app={props.app} />
        <div style={{ marginTop: '16px' }} >
          <AllowedMismatchField app={props.app} />
        </div>
      </div>
    </div>
  );
}
