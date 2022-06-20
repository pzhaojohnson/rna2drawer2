import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import { Props as TextInputFieldProps } from 'Forms/inputs/text/TextInputField';

export type Props = (
  Omit<TextInputFieldProps, 'onKeyUp'>
  & {
    onEnterKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  }
);

export function EndPositionField(props: Props) {
  let valueLength = props.value?.length ?? 0;

  return (
    <TextInputField
      {...props}
      label='End Position'
      onKeyUp={event => {
        if (event.key.toLowerCase() == 'enter') {
          props.onEnterKeyUp(event);
        }
      }}
      input={{ style: { width: `${Math.max(valueLength, 8)}ch` } }}
      style={{ alignSelf: 'flex-start', margin: '8px 8px 0 0' }}
    />
  );
}
