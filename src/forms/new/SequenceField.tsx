import * as React from 'react';
import fieldStyles from './SequenceField.css';
import fieldLabelStyles from './FieldLabel.css';
import { TextButton } from 'Forms/buttons/TextButton';

interface Props {
  initialValue: string;
  set: (s: string) => void;
  toggleParsingDetails: () => void;
  flexGrow: number;
}

export function SequenceField(props: Props): React.ReactElement {
  return (
    <div style={{ flexGrow: props.flexGrow, display: 'flex', flexDirection: 'column' }} >
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'row' }} >
        <label
          className={fieldLabelStyles.fieldLabel}
          htmlFor='sequence'
          style={{ flexGrow: 1, cursor: 'text' }}
        >
          Sequence
        </label>
        <div style={{ marginRight: '3px' }} >
          <TextButton
            text='Details...'
            onClick={() => props.toggleParsingDetails()}
            style={{ fontWeight: 500, color: '#090980' }}
          />
        </div>
      </div>
      <textarea
        id='sequence'
        className={fieldStyles.textArea}
        value={props.initialValue}
        onChange={event => props.set(event.target.value)}
        spellCheck={'false'}
        placeholder={
          '...an RNA or DNA sequence "ACCUUCUGCCAGAGGU"'
          + '  ...input parameters are to the right'
        }
      />
    </div>
  );
}
