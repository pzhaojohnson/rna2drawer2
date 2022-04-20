import * as React from 'react';

export type ChangeEvent = {
  target: {
    checked: boolean;
  }
}

export type Props = {
  checked: boolean;
  onChange: (event: ChangeEvent) => void;
}

export function Checkbox(props: Props) {
  return (
    <input
      type='checkbox'
      checked={props.checked}
      onChange={props.onChange}
    />
  );
}
