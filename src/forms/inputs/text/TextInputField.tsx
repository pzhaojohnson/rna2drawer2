import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { TextInput } from 'Forms/inputs/text/TextInput';

export type Props = {
  label?: string;

  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  // for specifying attributes of the text input element of the field
  textInput?: {
    style?: React.CSSProperties;
  };

  style?: React.CSSProperties;
};

/**
 * A labeled text input element.
 */
export function TextInputField(props: Props) {
  return (
    <FieldLabel
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...props.style,
      }}
    >
      <TextInput
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        onKeyUp={props.onKeyUp}
        style={{
          marginRight: '8px',
          ...props.textInput?.style,
        }}
      />
      {props.label}
    </FieldLabel>
  );
}
