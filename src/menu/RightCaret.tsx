import * as React from 'react';

export type Props = {
  style?: {
    height?: string;
    padding?: string;
  }
}

export function RightCaret(props: Props) {
  return (
    <svg
      viewBox="0 0 3.89 6.72" xmlns="http://www.w3.org/2000/svg" overflow="hidden"
      style={{
        height: props.style?.height ?? '16px',
        padding: props.style?.padding ?? '0px 4px',
      }}
    >
      <path
        d="M 0.53 0.53 L 3.36 3.36 L 0.53 6.19" strokeWidth="0.75"
        stroke="#38383c" fillOpacity="0"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
