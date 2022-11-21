import type { App } from 'App';

import * as React from 'react';
import { useState } from 'react';

import styles from './OpenSavedDrawingForm.css';

import { FloatingDrawingsContainer } from 'Forms/containers/floating-drawings/FloatingDrawingsContainer';

import { DrawingFileInput } from './DrawingFileInput';

import { ErrorMessage as _ErrorMessage } from 'Forms/ErrorMessage';

import { DetailsToggle as _DetailsToggle } from 'Forms/buttons/DetailsToggle';

import { OldFileNotes } from './OldFileNotes';

import { parseFileExtension } from 'Parse/parseFileExtension';
import { removeFileExtension } from 'Parse/parseFileExtension';

import { open } from './open';

import { createWaitOverlay } from 'Utilities/createWaitOverlay';

function updateDrawingTitle(app: App, fileName: string) {
  let titleFromFileName = removeFileExtension(fileName).trim();
  if (titleFromFileName != app.drawingTitle.unspecifiedValue) {
    // only specify if necessary since a specified title doesn't update
    // automatically as the drawing changes
    app.drawingTitle.value = titleFromFileName;
  }
}

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
  app: App;

  close: () => void;
}

export function OpenSavedDrawingForm(props: Props) {
  let [errorMessageString, setErrorMessageString] = useState('');

  // to be incremented when the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  let [showDetails, setShowDetails] = useState(false);

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

  let oldFileNotes = showDetails ? <OldFileNotes /> : null;

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

                let fileName = f.name;

                let waitOverlay = createWaitOverlay();
                document.body.appendChild(waitOverlay);

                f.text().then(text => {
                  let fileExtension = parseFileExtension(fileName);
                  if (fileExtension.toLowerCase().indexOf('rna2drawer') != 0) {
                    throw new Error('File must have .rna2drawer extension.');
                  }

                  let opened = open(props.app, { extension: fileExtension, contents: text });
                  if (!opened) {
                    throw new Error('Invalid .rna2drawer file.');
                  }

                  updateDrawingTitle(props.app, fileName);
                  props.close();
                  // prevent coming back to this form or preceding forms
                  props.app.formContainer.clearHistory();
                  props.app.refresh();
                }).catch(error => {
                  setErrorMessageString(error instanceof Error ? error.message : String(error));
                  setErrorMessageKey(errorMessageKey + 1);
                }).finally(() => {
                  waitOverlay.remove();
                });
              }}
            />
            {errorMessage}
            {detailsToggleSpacer}
            {detailsToggle}
            {oldFileNotes}
          </div>
        </div>
      }
    />
  );
}
