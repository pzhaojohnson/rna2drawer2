import * as React from 'react';
import type { App } from 'App';
import { FloatingDrawingsContainer } from 'Forms/containers/floating-drawings/FloatingDrawingsContainer';
import { EnterDotBracketSection } from './EnterDotBracketSection';

function Header() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <p style={{ margin: '0px 106px', fontSize: '24px', fontWeight: 600, color: 'rgb(11, 11, 11)' }} >
        Create a New Drawing
      </p>
      <div style={{ marginTop: '8px' }} >
        <div
          style={{
            height: '0px',
            borderWidth: '0px 0px 1px 0px',
            borderStyle: 'solid',
            borderColor: 'rgba(223, 223, 236, 0.93)',
          }}
        />
      </div>
    </div>
  );
}

interface Props {
  app: App;
  close: () => void;
}

export function EnterDotBracketForm(props: Props): React.ReactElement {
  return (
    <FloatingDrawingsContainer
      contained={
        <div style={{ width: '960px', height: '598px', display: 'flex', flexDirection: 'column' }} >
          <Header />
          <EnterDotBracketSection app={props.app} close={props.close} />
        </div>
      }
    />
  );
}
