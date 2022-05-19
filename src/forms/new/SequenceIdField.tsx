import * as React from 'react';
import fieldLabelStyles from './FieldLabel.css';
import { TextInput } from 'Forms/inputs/text/TextInput';

interface Props {
  initialValue: string;
  set: (v: string) => void;
}

export function SequenceIdField(props: Props): React.ReactElement {
  return (
    <label
      className={fieldLabelStyles.fieldLabel}
      style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        cursor: 'text',
      }}
    >
      Sequence ID
      <TextInput
        value={props.initialValue}
        onChange={event => props.set(event.target.value)}
        spellCheck={'false'}
        placeholder={'...the name of your sequence'}
        style={{ marginLeft: '8px', flexGrow: 1, fontWeight: 500, color: '#626268' }}
      />
    </label>
  );
}
