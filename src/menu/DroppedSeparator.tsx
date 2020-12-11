import * as React from 'react';

interface Props {
  backgroundColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
}

export function DroppedSeparator(props: Props): React.ReactElement {
  return (
    <div
      style={{
        borderStyle: props.borderStyle,
        borderWidth: props.borderWidth,
        borderColor: props.borderColor,
        backgroundColor: props.backgroundColor ?? '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: '0px',
          borderWidth: '0px 0px 1px 0px',
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.125)',
          margin: '0px 4px 0px 4px',
        }}
      ></div>
    </div>
  );
}

export default DroppedSeparator;
