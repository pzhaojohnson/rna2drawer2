import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';

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
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={props.ignoringNumbers}
        onChange={event => props.ignoreNumbers(event.target.checked)}
      />
      <div style={{ marginLeft: '6px' }} >
        <p className={`${checkboxFieldStyles.label} unselectable`} >
          Ignore Numbers
        </p>
      </div>
    </div>
  );
}

export function IgnoreNonAugctLettersCheckbox(props: Props): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={props.ignoringNonAugctLetters}
        onChange={event => props.ignoreNonAugctLetters(event.target.checked)}
      />
      <div style={{ marginLeft: '6px' }} >
        <p className={`${checkboxFieldStyles.label} unselectable`} >
          Ignore Non-AUGCT Letters
        </p>
      </div>
    </div>
  );
}

export function IgnoreNonAlphanumericsCheckbox(props: Props): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={props.ignoringNonAlphanumerics}
        onChange={event => props.ignoreNonAlphanumerics(event.target.checked)}
      />
      <div style={{ marginLeft: '6px' }} >
        <p className={`${checkboxFieldStyles.label} unselectable`} >
          Ignore Non-Alphanumerics
        </p>
      </div>
    </div>
  );
}

export function SequenceParsingDetails(props: Props): React.ReactElement {
  return (
    <div style={{ width: '360px', margin: '16px 0px 0px 12px' }} >
      <p className={'unselectable'} style={{ fontWeight: 600, fontSize: '14px', color: 'rgba(0,0,0,1)' }} >
        Sequence Parsing Details
      </p>
      <div style={{ marginLeft: '8px' }} >
        <p className={'unselectable'} style={{ marginTop: '6px', fontSize: '12px' }} >
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
        <p className={'unselectable'} style={{ marginTop: '8px', fontSize: '12px' }}>
          All whitespace is ignored.
        </p>
      </div>
    </div>
  );
}
