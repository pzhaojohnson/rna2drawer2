import * as React from 'react';
import { CheckboxField } from '../fields/checkbox/CheckboxField';

interface Props {
  ignoringNumbers: boolean;
  ignoreNumbers: (b: boolean) => void;
  ignoringNonAugctLetters: boolean;
  ignoreNonAugctLetters: (b: boolean) => void;
  ignoringNonAlphanumerics: boolean;
  ignoreNonAlphanumerics: (b: boolean) => void;
}

export function IgnoreNumbersCheckbox(props: Props): React.ReactElement {
  return (
    <CheckboxField
      name={'Ignore Numbers'}
      initialValue={props.ignoringNumbers}
      set={b => props.ignoreNumbers(b)}
    />
  );
}

export function IgnoreNonAugctLettersCheckbox(props: Props): React.ReactElement {
  return (
    <CheckboxField
      name={'Ignore Non-AUGCT Letters'}
      initialValue={props.ignoringNonAugctLetters}
      set={b => props.ignoreNonAugctLetters(b)}
    />
  );
}

export function IgnoreNonAlphanumericsCheckbox(props: Props): React.ReactElement {
  return (
    <CheckboxField
      name={'Ignore Non-Alphanumerics'}
      initialValue={props.ignoringNonAlphanumerics}
      set={b => props.ignoreNonAlphanumerics(b)}
    />
  );
}

export function SequenceParsingDetails(props: Props): React.ReactElement {
  return (
    <div style={{ width: '360px', margin: '16px 0px 0px 12px' }} >
      <p className={'unselectable-text'} style={{ fontWeight: 600, fontSize: '14px', color: 'rgba(0,0,0,1)' }} >
        Sequence Parsing Details:
      </p>
      <div style={{ marginLeft: '8px' }} >
        <p className={'unselectable-text'} style={{ marginTop: '6px', fontSize: '12px' }} >
          All letters, numbers, and non-alphanumeric characters are read in as individual bases, unless specified to be ignored below:
        </p>
        <div style={{ margin: '6px 0 0 6px' }} >
          <IgnoreNumbersCheckbox {...props} />
          <div style={{ marginTop: '6px' }} >
            <IgnoreNonAugctLettersCheckbox {...props} />
          </div>
          <div style={{ marginTop: '6px' }} >
            <IgnoreNonAlphanumericsCheckbox {...props} />
          </div>
        </div>
        <p className={'unselectable-text'} style={{ marginTop: '6px', fontSize: '12px' }}>
          All whitespace is ignored.
        </p>
      </div>
    </div>
  );
}
