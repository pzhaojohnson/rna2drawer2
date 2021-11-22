import * as React from 'react';
import rightCaret from './rightCaret.svg';

export type Props = {
  style?: {
    height?: string;
    padding?: string;
  }
}

export function RightCaret(props: Props) {
  return (
    <img
      src={rightCaret}
      alt='Right Caret'
      style={{
        height: props.style?.height ?? '16px',
        padding: props.style?.padding ?? '0px 4px',
      }}
    />
  );
}
