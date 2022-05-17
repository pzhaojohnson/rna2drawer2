import type { App } from 'App';

import * as React from 'react';
import styles from './FindMotifsButton.css';

import { FindMotifsForm } from 'Forms/motifs/FindMotifsForm';
import { v4 as uuidv4 } from 'uuid';

const formKey = uuidv4();

function FindIcon() {
  return (
    <svg
      version="1.1" xmlns="http://www.w3.org/2000/svg"
      width="14px" height="14px" viewBox="0 0 12.78 12.78"
    >
      <circle
        r="4.5" cx="5" cy="5" strokeWidth="1"
        stroke="#07074b" fillOpacity="0"
      />
      <line
        x1="8.54" y1="8.54" x2="12.07" y2="12.07" strokeWidth="1"
        stroke="#07074b"
      />
    </svg>
  );
}

export type Props = {
  // a reference to the whole app
  app: App;
};

export function FindMotifsButton(props: Props) {
  let handleClick = () => {
    props.app.formContainer.renderForm(
      formProps => (
        <FindMotifsForm {...formProps} app={props.app} />
      ),
      { key: formKey },
    );
  };

  return (
    <div className={styles.findMotifsButton} onClick={handleClick} >
      <FindIcon />
      <p className={styles.findMotifsButtonText} >
        Find Motifs
      </p>
    </div>
  );
}
