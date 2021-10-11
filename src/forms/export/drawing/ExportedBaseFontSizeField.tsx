import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';

export type Props = {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
}

export function ExportedBaseFontSizeField(props: Props) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          className={textFieldStyles.input}
          type='text'
          value={props.value}
          onChange={event => props.onChange(event.target.value)}
          spellCheck='false'
          style={{ width: '32px', textAlign: 'left' }}
        />
        <p
          className={textFieldStyles.label}
          style={{ marginLeft: '8px' }}
        >
          Exported Font Size of Bases
        </p>
      </div>
      {!props.errorMessage ? null : (
        <p
          key={Math.random()}
          className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
          style={{ marginTop: '3px' }}
        >
          {props.errorMessage}
        </p>
      )}
      <p
        className='unselectable'
        style={{ marginTop: '6px', fontSize: '12px', fontStyle: 'italic' }}
      >
        Scale the exported drawing according to the font size of bases.
      </p>
    </div>
  );
}
