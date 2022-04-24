import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { TextArea } from 'Forms/inputs/text/TextArea';

export type Props = {
  label?: string;

  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;

  textArea?: {
    rows?: number;
  };

  style?: React.CSSProperties;
};

/**
 * A labeled textarea element.
 */
export function TextAreaField(props: Props) {
  return (
    <FieldLabel
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...props.style,
      }}
    >
      {props.label}
      <TextArea
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        rows={props.textArea?.rows ?? 10}
        style={{ marginTop: '4px' }}
      />
    </FieldLabel>
  );
}
