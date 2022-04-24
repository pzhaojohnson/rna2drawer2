import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

export type Props = {
  label?: string;

  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  style?: React.CSSProperties;
};

/**
 * A labeled checkbox input element.
 */
export function CheckboxField(props: Props) {
  return (
    <FieldLabel
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...props.style,
      }}
    >
      <input
        type='checkbox'
        checked={props.checked}
        onChange={props.onChange}
        style={{ marginRight: '6px' }}
      />
      {props.label}
    </FieldLabel>
  );
}
