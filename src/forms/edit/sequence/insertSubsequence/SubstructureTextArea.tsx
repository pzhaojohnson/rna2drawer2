import * as React from 'react';
import styles from './SubstructureTextArea.css';
import { FieldDescription } from 'Forms/inputs/labels/FieldDescription';

export type Props = {
  value: string,
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
};

export function SubstructureTextArea(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <textarea
        className={styles.substructureTextArea}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        rows={9}
      />
      <FieldDescription style={{ margin: '6px 0 0 16px' }} >
        ...in dot-bracket notation "(((...)))"
      </FieldDescription>
    </div>
  );
}
