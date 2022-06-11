import * as React from 'react';
import styles from './SubstructureTextArea.css';

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
        placeholder='...in dot-bracket notation "(((...)))"'
      />
    </div>
  );
}
