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
      viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" overflow="hidden"
      style={{
        height: props.style?.height ?? '16px',
        padding: props.style?.padding ?? '0px 4px',
      }}
    >
      <path
        d="M36.06 76.187 31.817 71.945 55.825 47.937 31.816 23.922 36.059 19.68 64.31 47.937 36.06 76.187Z"
        fill="#333333"
      />
    </svg>
  );
}
