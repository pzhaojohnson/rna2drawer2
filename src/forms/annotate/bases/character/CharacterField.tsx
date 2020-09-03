import * as React from 'react';
import { TextField } from '../../../fields/text/TextField';

interface Props {
  initialValue: string;
  onInput?: () => void;
  onValidInput?: () => void;
  onInvalidInput?: () => void;
  set: (c: string) => void;
}

export function CharacterField(props: Props): React.ReactElement {
  return (
    <TextField
      name={'Character'}
      initialValue={props.initialValue}
      checkValue={s => {
        if (s.trim().length != 1) {
          return 'Must be a single character.';
        }
        return '';
      }}
      onInput={props.onInput}
      onValidInput={props.onValidInput}
      onInvalidInput={props.onInvalidInput}
      set={c => props.set(c.trim())}
    />
  );
}
