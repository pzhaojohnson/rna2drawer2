import * as React from 'react';

interface Props {
  text: string;
  onClick: () => void;
}

export function ActionButton(props: Props): React.ReactElement {
  return (
    <button
      className={'action-button'}
      onClick={() => props.onClick()}
      style={{
        borderRadius: '2px',
        padding: '4px 32px 4px 32px',
        fontSize: '12px',
        color: 'white',
      }}
    >
      {props.text}
    </button>
  );
}
