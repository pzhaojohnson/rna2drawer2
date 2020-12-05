import * as React from 'react';
import { CheckboxField } from '../fields/CheckboxField';

interface Props {
  ignoringNumbers: boolean;
  ignoreNumbers: (b: boolean) => void;
  ignoringNonAugctLetters: boolean;
  ignoreNonAugctLetters: (b: boolean) => void;
  ignoringNonAlphanumerics: boolean;
  ignoreNonAlphanumerics: (b: boolean) => void;
}

export function SequenceParsingDetails(props: Props): React.ReactElement {
  return (
    <div style={{ width: '360px', margin: '16px 0px 0px 12px' }} >
      <p className={'unselectable-text'} style={{ fontWeight: 600, fontSize: '14px' }} >
        Sequence Parsing Details:
      </p>
      <div style={{ marginLeft: '8px' }} >
        <p className={'unselectable-text'} style={{ marginTop: '6px', fontSize: '12px' }} >
          All letters, numbers, and non-alphanumeric characters are read in as individual bases, unless specified to be ignored below:
        </p>
        <div style={{ marginTop: '8px' }} >
          <CheckboxField
            name={'Ignore Numbers'}
            initialValue={props.ignoringNumbers}
            set={b => props.ignoreNumbers(b)}
          />
        </div>
        <div style={{ marginTop: '4px' }} >
          <CheckboxField
            name={'Ignore Non-AUGCT Letters'}
            initialValue={props.ignoringNonAugctLetters}
            set={b => props.ignoreNonAugctLetters(b)}
          />
        </div>
        <div style={{ marginTop: '4px' }} >
          <CheckboxField
            name={'Ignore Non-Alphanumerics'}
            initialValue={props.ignoringNonAlphanumerics}
            set={b => props.ignoreNonAlphanumerics(b)}
          />
        </div>
        <p className={'unselectable-text'} style={{ marginTop: '10px', fontSize: '12px' }}>
          All whitespace is ignored.
        </p>
      </div>
    </div>
  );
}
