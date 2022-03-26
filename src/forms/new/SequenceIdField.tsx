import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';

interface Props {
  initialValue: string;
  set: (v: string) => void;
}

export function SequenceIdField(props: Props): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <p
        className={'unselectable'}
        style={{ marginRight: '8px', fontSize: '12px', display: 'inline-block' }}
      >
        Sequence ID
      </p>
      <input
        type={'text'}
        className={`${textFieldStyles.input}`}
        value={props.initialValue}
        onChange={event => props.set(event.target.value)}
        spellCheck={'false'}
        placeholder={'...the name of your sequence'}
        style={{ flexGrow: 1 }}
      />
    </div>
  );
}
