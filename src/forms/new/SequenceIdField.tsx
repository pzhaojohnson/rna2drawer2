import * as React from 'react';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { TextInput } from 'Forms/inputs/text/TextInput';

interface Props {
  initialValue: string;
  set: (v: string) => void;
}

export function SequenceIdField(props: Props): React.ReactElement {
  return (
    <FieldLabel
      style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        fontWeight: 700, color: '#1c1c1e',
        cursor: 'text',
      }}
    >
      Sequence ID
      <TextInput
        value={props.initialValue}
        onChange={event => props.set(event.target.value)}
        spellCheck={'false'}
        placeholder={'...the name of your sequence'}
        style={{ marginLeft: '8px', flexGrow: 1, fontWeight: 500, color: '#52525a' }}
      />
    </FieldLabel>
  );
}
