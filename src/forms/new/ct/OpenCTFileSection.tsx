import type { App } from 'App';

import { openCTFile } from './openCTFile';

import * as React from 'react';
import { useState } from 'react';

import styles from './OpenCTFileSection.css';

import { CTFileInput } from './CTFileInput';

// the underlying error message component
import { ErrorMessage as _ErrorMessage } from 'Forms/ErrorMessage';

// the underlying details toggle component
import { DetailsToggle as _DetailsToggle } from 'Forms/buttons/DetailsToggle';

function ErrorMessage(
  props: {
    children?: React.ReactNode,
  },
) {
  return (
    <_ErrorMessage
      style={{ marginTop: '12px', fontSize: '16px', color: '#d71111' }}
    >
      {props.children}
    </_ErrorMessage>
  );
}

function DetailsToggle(
  props: {
    onClick: () => void,
  },
) {
  return (
    <_DetailsToggle
      onClick={props.onClick}
      style={{
        margin: '40px 440px 0px 0px', padding: '1px 14px',
        fontSize: '12px', fontWeight: 500,
      }}
    >
      Details
    </_DetailsToggle>
  );
}

function Details() {
  return (
    <div style={{ marginTop: '40px' }} >
      <p className={styles.detailsText} >
        CT files are produced by some RNA structure prediction programs&nbsp;
        such as Mfold.
      </p>
      <p className={styles.detailsText} style={{ marginTop: '8px' }} >
        If a CT file contains multiple structures,&nbsp;
        only the first structure in the CT file will be drawn.
      </p>
    </div>
  );
}

/**
 * Creates a div element that can be appended to the document body to
 * block all pointer interaction with the rest of the app and change the
 * cursor style to "wait".
 */
function createWaitOverlay() {
  let waitOverlay = document.createElement('div');
  waitOverlay.style.position = 'fixed';
  waitOverlay.style.top = '0px';
  waitOverlay.style.right = '0px';
  waitOverlay.style.bottom = '0px';
  waitOverlay.style.left = '0px';
  waitOverlay.style.cursor = 'wait';
  return waitOverlay;
}

/**
 * Creates an error message string from an unknown error value that was
 * thrown.
 */
function createErrorMessageString(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * A callback to close this form section.
   *
   * Is called after successfully opening a CT file in the app.
   */
  close: () => void;
};

export function OpenCTFileSection(props: Props) {
  let app = props.app;

  let [errorMessageString, setErrorMessageString] = useState('');
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  let [showDetails, setShowDetails] = useState(false);

  let waitOverlay = createWaitOverlay();

  let handleSuccess = () => {
    props.close();
    // prevent coming back to this form and preceding forms
    app.formContainer.clearHistory();
    app.refresh();
  };

  let handleFailure = (error: unknown) => {
    setErrorMessageString(createErrorMessageString(error));
    setErrorMessageKey(errorMessageKey + 1);
  };

  let ctFileInput = (
    <CTFileInput
      onChange={event => {
        if (event.target.file) {
          let ctFile = event.target.file;
          document.body.appendChild(waitOverlay);
          openCTFile({ ctFile, app })
            .then(handleSuccess)
            .catch(handleFailure)
            .finally(() => waitOverlay.remove());
        }
      }}
    />
  );

  let errorMessage = errorMessageString ? (
    <ErrorMessage key={errorMessageKey} >
      {errorMessageString}
    </ErrorMessage>
  ) : null;

  let detailsToggle = (
    <DetailsToggle onClick={() => setShowDetails(!showDetails)} />
  );

  return (
    <div className={styles.openCTFileSection} >
      {ctFileInput}
      {errorMessage}
      {detailsToggle}
      {showDetails ? <Details /> : null}
    </div>
  );
}
