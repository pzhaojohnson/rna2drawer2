import * as React from 'react';

interface Props {
  margin?: string;
}

export function Underline(props: Props): React.ReactElement {
  return (
    <div
      style={{
        margin: props.margin,
        height: '0px',
        borderWidth: '0px 0px 1px 0px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.125)',
      }}
    ></div>
  );
}

export default Underline;
