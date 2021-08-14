import * as React from 'react';
import { FieldProps as Props } from './FieldProps';
import { TextField } from '../../fields/text/TextField';

export function BaseCharacterField(props: Props): React.ReactElement | null {
  let bs = props.selectedBases();
  let b = bs[0];
  if (bs.length != 1 || !b) {
    return null;
  } else {
    return (
      <TextField
        name={'Character'}
        initialValue={b.character}
        checkValue={s => {
          if (s.trim().length != 1) {
            return 'Must be a single character.';
          }
          return '';
        }}
        set={c => {
          c = c.trim();
          let bs = props.selectedBases();
          let b = bs[0];
          if (bs.length == 1 && b && b.character != c) {
            props.pushUndo();
            b.character = c;
            props.changed();
          }
        }}
      />
    );
  }
}
