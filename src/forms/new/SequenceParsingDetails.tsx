import * as React from 'react';
import { CheckboxField } from 'Forms/inputs/checkbox/CheckboxField';

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
      label='Ignore Numbers'
      checked={props.ignoringNumbers}
      onChange={event => props.ignoreNumbers(event.target.checked)}
    />
  );
}

export function IgnoreNonAugctLettersCheckbox(props: Props): React.ReactElement {
  return (
    <CheckboxField
      label='Ignore Non-AUGCT Letters'
      checked={props.ignoringNonAugctLetters}
      onChange={event => props.ignoreNonAugctLetters(event.target.checked)}
    />
  );
}

export function IgnoreNonAlphanumericsCheckbox(props: Props): React.ReactElement {
  return (
    <CheckboxField
      label='Ignore Non-Alphanumerics'
      checked={props.ignoringNonAlphanumerics}
      onChange={event => props.ignoreNonAlphanumerics(event.target.checked)}
    />
  );
}

export function SequenceParsingDetails(props: Props): React.ReactElement {
  return (
    <div style={{ width: '360px', margin: '24px 0px 0px 12px' }} >
      <p className={'unselectable'} style={{ fontWeight: 600, fontSize: '14px', color: '#1e1e23' }} >
        Sequence Parsing Details
      </p>
      <div style={{ marginLeft: '8px' }} >
        <div style={{ height: '6px' }} />
        <p className={'unselectable'} style={{ fontSize: '12px', fontWeight: 500, color: '#393941' }} >
          All letters, numbers, and non-alphanumeric characters are read in as individual bases, unless specified to be ignored.
        </p>
        <div style={{ margin: '8px 0 0 8px' }} >
          <IgnoreNumbersCheckbox {...props} />
          <div style={{ marginTop: '6px' }} >
            <IgnoreNonAugctLettersCheckbox {...props} />
          </div>
          <div style={{ marginTop: '6px' }} >
            <IgnoreNonAlphanumericsCheckbox {...props} />
          </div>
        </div>
        <div style={{ height: '8px' }} />
        <p className={'unselectable'} style={{ fontSize: '12px', fontWeight: 500, color: '#393941' }}>
          All whitespace is ignored.
        </p>
      </div>
    </div>
  );
}
