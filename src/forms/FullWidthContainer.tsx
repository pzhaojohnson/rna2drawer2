import * as React from 'react';

interface Props {
  contained: React.ReactElement;
}

export function FullWidthContainer(props: Props): React.ReactElement {
  return (
    <div
      style={{
        width: '100vw',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          flexGrow: 1,
          maxHeight: '824px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            flexGrow: 1,
            maxWidth: '1200px',
            margin: '12px',
            border: '1px solid rgba(0,0,0,0.2)',
            borderRadius: '4px',
          }}
        >
          {props.contained}
        </div>
      </div>
    </div>
  );
}
