import * as React from 'react';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { TextField } from '../../fields/text/TextField';

export function BaseCharacterField(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement | null {
  let bs = selectedBases();
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
          let bs = selectedBases();
          let b = bs[0];
          if (bs.length == 1 && b && b.character != c) {
            pushUndo();
            b.character = c;
            changed();
          }
        }}
      />
    );
  }
}
