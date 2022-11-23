import type { App } from 'App';

import * as React from 'react';
import { useState } from 'react';

import styles from './OpenSavedDrawingForm.css';

import { FloatingDrawingsContainer } from 'Forms/containers/floating-drawings/FloatingDrawingsContainer';

import { DrawingFileInput } from './DrawingFileInput';

import { ErrorMessage as _ErrorMessage } from 'Forms/ErrorMessage';

import { DetailsToggle as _DetailsToggle } from 'Forms/buttons/DetailsToggle';

import { OldDrawingNotes } from './OldDrawingNotes';

import { openSavedDrawing } from './openSavedDrawing';

import { createWaitOverlay } from 'Utilities/createWaitOverlay';

function Header() {
  let title = (
    <p className={styles.title} >
      Open a Saved Drawing
    </p>
  );

  let titleUnderline = <div className={styles.titleUnderline} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      {title}
      {titleUnderline}
    </div>
  );
}

/**
 * Creates an error message string from a thrown value.
 */
function createErrorMessageString(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else {
    return String(error);
  }
}

function ErrorMessage(
  props: {
    children?: React.ReactNode,
  },
) {
  return (
    <_ErrorMessage
      style={{
        marginTop: '12px',
        fontSize: '16px', color: '#d71111',
      }}
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
        marginRight: '440px', padding: '1px 14px',
        fontSize: '12px', fontWeight: 500,
      }}
    >
      Details
    </_DetailsToggle>
  );
}

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * A callback to close the form.
   */
  close: () => void;
}

export function OpenSavedDrawingForm(props: Props) {
  let app = props.app;

  let [errorMessageString, setErrorMessageString] = useState('');

  // to be incremented whenever the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  let [showDetails, setShowDetails] = useState(false);

  // to be called when a saved drawing is successfully opened
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

  let errorMessage = errorMessageString ? (
    <ErrorMessage key={errorMessageKey} >
      {errorMessageString}
    </ErrorMessage>
  ) : null;

  let detailsToggleSpacer = (
    <div style={{ height: errorMessageString ? '18px' : '42px' }} />
  );

  let detailsToggle = (
    <DetailsToggle
      onClick={() => setShowDetails(!showDetails)}
    />
  );

  let oldDrawingNotes = showDetails ? <OldDrawingNotes /> : null;

  let waitOverlay = createWaitOverlay();

  return (
    <FloatingDrawingsContainer
      contained={
        <div className={styles.content} >
          <Header />
          <div className={styles.body} >
            <DrawingFileInput
              onChange={event => {
                let f = event.target.file;
                if (!f) {
                  return;
                }

                document.body.appendChild(waitOverlay);

                openSavedDrawing({ app, savedDrawing: f })
                  .then(handleSuccess)
                  .catch(handleFailure)
                  .finally(() => waitOverlay.remove());
              }}
            />
            {errorMessage}
            {detailsToggleSpacer}
            {detailsToggle}
            {oldDrawingNotes}
          </div>
        </div>
      }
    />
  );
}
