import * as React from 'react';
import { DetailsToggle as _DetailsToggle } from 'Forms/buttons/DetailsToggle';

export type Props = {
  onClick?: () => void;

  style?: React.CSSProperties;
};

export function DetailsToggle(props: Props) {
  return (
    <_DetailsToggle
      onClick={props.onClick}
      style={{
        margin: '0 2px 0 0',
        padding: '1px 14px',
        fontSize: '11px',
        fontWeight: 500,
        ...props.style,
      }}
    >
      Details
    </_DetailsToggle>
  );
}
