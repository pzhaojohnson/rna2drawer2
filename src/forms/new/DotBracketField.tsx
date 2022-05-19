import * as React from 'react';
import fieldStyles from './DotBracketField.css';
import fieldLabelStyles from './FieldLabel.css';
import { TextButton } from 'Forms/buttons/TextButton';

interface Props {
  initialValue: string;
  set: (s: string) => void;
  toggleParsingDetails: () => void;
  flexGrow: number;
}

export function DotBracketField(props: Props): React.ReactElement {
  return (
    <div style={{ flexGrow: props.flexGrow, display: 'flex', flexDirection: 'column' }} >
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'row' }} >
        <label
          className={fieldLabelStyles.fieldLabel}
          htmlFor='structure'
          style={{ flexGrow: 1, cursor: 'text' }}
        >
          Structure
        </label>
        <div style={{ marginRight: '3px' }} >
          <TextButton
            text='Details...'
            onClick={() => props.toggleParsingDetails()}
            style={{ fontWeight: 500, color: '#090972' }}
          />
        </div>
      </div>
      <textarea
        id='structure'
        className={fieldStyles.textArea}
        value={props.initialValue}
        onChange={event => props.set(event.target.value)}
        spellCheck={'false'}
        placeholder={
          '...the structure in dot-bracket notation "(((((......)))))"'
          + '  ...also called "Vienna" format by Mfold and RNAfold'
        }
      />
    </div>
  );
}
