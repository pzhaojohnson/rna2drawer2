import * as React from 'react';
import { useState, useRef } from 'react';
import formStyles from './OpenRna2drawer.css';
import { ErrorMessage } from 'Forms/ErrorMessage';
import { FloatingDrawingsContainer } from 'Forms/containers/floating-drawings/FloatingDrawingsContainer';
import { DetailsToggle as _DetailsToggle } from 'Forms/buttons/DetailsToggle';
import { OldFileNotes } from './OldFileNotes';
import type { App } from 'App';
import { open } from './open';
import parseFileExtension from 'Parse/parseFileExtension';
import { removeFileExtension } from 'Parse/parseFileExtension';

/**
 * Returns the first file stored in the referenced file input
 * or undefined if there are no files stored in the referenced file input.
 */
function firstFile(fileInputRef: React.RefObject<HTMLInputElement>): File | undefined {
  return fileInputRef.current?.files ? fileInputRef.current.files[0] : undefined;
}

function updateDrawingTitle(app: App, fileName: string) {
  let titleFromFileName = removeFileExtension(fileName).trim();
  if (titleFromFileName != app.drawingTitle.unspecifiedValue) {
    // only specify if necessary since a specified title doesn't update
    // automatically as the drawing changes
    app.drawingTitle.value = titleFromFileName;
  }
}

function Header() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <p style={{ margin: '0px 92px', fontSize: '24px', fontWeight: 600, color: '#151516' }} >
        Open a Saved Drawing
      </p>
      <div style={{ marginTop: '8px' }} >
        <div
          style={{
            height: '0px',
            borderWidth: '0px 0px 1px 0px',
            borderStyle: 'solid',
            borderColor: '#dfdfed',
          }}
        />
      </div>
    </div>
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

/**
 * Creates an element that when appended to the document body
 * blocks all user interaction with the app and changes the cursor
 * style to wait.
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

export type Props = {
  app: App;

  close: () => void;
}

export function OpenRna2drawer(props: Props) {
  let hiddenFileInput = useRef<HTMLInputElement>(null);

  let [errorMessage, setErrorMessage] = useState('');

  // should be incremented every time the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  let [showDetails, setShowDetails] = useState(false);

  return (
    <FloatingDrawingsContainer
      contained={
        <div style={{ width: '920px', height: '524px', display: 'flex', flexDirection: 'column' }} >
          <Header />
          <div
            style={{
              margin: '0px 116px',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ marginTop: '42px' }} >
              <input
                ref={hiddenFileInput}
                type='file'
                onChange={event => {
                  let f: File | undefined = event.target.files ? event.target.files[0] : undefined;
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
                    setErrorMessage(error instanceof Error ? error.message : String(error));
                    setErrorMessageKey(errorMessageKey + 1);
                  }).finally(() => {
                    waitOverlay.remove();
                  });
                }}
                style={{ display: 'none' }}
              />
              <p
                className={formStyles.fileInputLabel}
                onClick={() => hiddenFileInput.current?.click()}
                style={{
                  // make file name text a slightly different color
                  color: firstFile(hiddenFileInput) ? '#09095d' : undefined,
                }}
              >
                {firstFile(hiddenFileInput)?.name ?? (
                  <span>
                    Upload a file with
                    <span className={formStyles.rna2drawerExtension} >&nbsp;.rna2drawer&nbsp;</span>
                    extension...
                  </span>
                )}
              </p>
            </div>
            {!errorMessage ? null : (
              <ErrorMessage key={errorMessageKey} style={{ marginTop: '12px', fontSize: '16px', color: '#d71111' }} >
                {errorMessage}
              </ErrorMessage>
            )}
            <div style={{ height: errorMessage ? '18px' : '42px' }} />
            <DetailsToggle onClick={() => setShowDetails(!showDetails)} />
            {showDetails ? <OldFileNotes /> : null}
          </div>
        </div>
      }
    />
  );
}
