import * as React from 'react';
import styles from './SubsequenceField.css';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

export type Props = {
  value: string,
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
  onBlur: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
};

export function SubsequenceField(props: Props) {
  return (
    <FieldLabel style={{ display: 'flex', flexDirection: 'column' }} >
      Subsequence
      <textarea
        className={styles.subsequenceTextArea}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        rows={9}
        placeholder='...an RNA or DNA subsequence "CUGCCA"'
      />
    </FieldLabel>
  );
}
