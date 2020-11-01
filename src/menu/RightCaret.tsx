import * as React from 'react';
import rightCaret from '../icons/rightCaret.svg';

interface Props {
  height?: string;
  padding?: string;
}

export function RightCaret(props: Props): React.ReactElement {
  return (
    <img
      src={rightCaret}
      alt={'Right Caret'}
      style={{
        height: props.height ?? '16px',
        padding: props.padding ?? '0px 4px 0px 4px',
      }}
    />
  );
}
