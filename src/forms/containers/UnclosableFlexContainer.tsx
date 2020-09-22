import * as React from 'react';
import { Underline } from './Underline';

interface Props {
  title: string;
  contained: React.ReactElement;
}

export function UnclosableFlexContainer(props: Props): React.ReactElement {
  return (
    <div
      style={{
        width: '100vw',
        height: '100%',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxHeight: '816px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            margin: '8px',
            maxWidth: '1200px',
            flexGrow: 1,
            border: '1px solid rgba(0,0,0,0.3)',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ margin: '32px 96px 32px 96px', flexGrow: 1, display: 'flex', flexDirection: 'column' }} >
            <div style={{ padding: '0px 24px 0px 24px'}} >
              <p className={'unselectable-text'} style={{fontSize: '24px' }} >
                {props.title}
              </p>
            </div>
            <Underline margin={'8px 0px 0px 0px'} />
            <div style={{ margin: '24px 40px 0px 40px', flexGrow: 1, display: 'flex', flexDirection: 'column' }} >
              {props.contained}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
