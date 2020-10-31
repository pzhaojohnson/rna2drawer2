import * as React from 'react';
import { IntegerField } from '../../fields/text/IntegerField';
import { TextareaField } from '../../fields/text/TextareaField';
import { CheckboxField } from '../../fields/CheckboxField';

interface Inputs {
  insertPosition: number;
  subsequence: string;
  ignoreNumbers: boolean;
  ignoreNonAugctLetters: boolean;
  ignoreNonAlphanumerics: boolean;
}

interface Props {
  initialValue: Inputs;
  onInput?: () => void;
  onValidInput?: () => void;
  onInvalidInput?: () => void;
  set: (inputs: Inputs) => void;
}

export function InsertPositionField(props: Props): React.ReactElement {
  return (
    <IntegerField
      name={'Position to Insert At'}
      initialValue={props.initialValue.insertPosition}
      onInput={props.onInput}
      onValidInput={props.onValidInput}
      onInvalidInput={props.onInvalidInput}
      set={i => props.set({
        ...props.initialValue,
        insertPosition: i,
      })}
    />
  );
}

export function SubsequenceField(props: Props): React.ReactElement {
  return (
    <TextareaField
      name={'Subsequence'}
      initialValue={props.initialValue.subsequence}
      onInput={props.onInput}
      set={ss => props.set({
        ...props.initialValue,
        subsequence: ss,
      })}
      rows={12}
    />
  );
}

export function IgnoreNumbersField(props: Props): React.ReactElement {
  return (
    <CheckboxField
      name={'Ignore Numbers'}
      initialValue={props.initialValue.ignoreNumbers}
      set={b => props.set({
        ...props.initialValue,
        ignoreNumbers: b,
      })}
    />
  );
}

export function IgnoreNonAugctLettersField(props: Props): React.ReactElement {
  return (
    <CheckboxField
      name={'Ignore Non-AUGCT Letters'}
      initialValue={props.initialValue.ignoreNonAugctLetters}
      set={b => props.set({
        ...props.initialValue,
        ignoreNonAugctLetters: b,
      })}
    />
  );
}

export function IgnoreNonAlphanumericsField(props: Props): React.ReactElement {
  return (
    <CheckboxField
      name={'Ignore Non-Alphanumerics'}
      initialValue={props.initialValue.ignoreNonAlphanumerics}
      set={b => props.set({
        ...props.initialValue,
        ignoreNonAlphanumerics: b,
      })}
    />
  );
}

export function Fields(props: Props): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <InsertPositionField {...props} />
      <div style={{ marginTop: '12px' }} >
        <SubsequenceField {...props} />
      </div>
      <p style={{ marginTop: '12px' }} >
        Unless specified to be ignored below,
        all letters, numbers and non-alphanumeric characters are read in as individual bases.
      </p>
      <div style={{ margin: '8px 0px 0px 8px' }} >
        <IgnoreNumbersField {...props} />
        <div style={{ marginTop: '4px' }} >
          <IgnoreNonAugctLettersField {...props} />
        </div>
        <div style={{ marginTop: '4px' }} >
          <IgnoreNonAlphanumericsField {...props} />
        </div>
      </div>
      <p style={{ marginTop: '8px' }} >
        All whitespace is ignored.
      </p>
    </div>
  );
}
