import * as React from 'react';
import { useState, useRef } from 'react';
import formStyles from './OpenSavedDrawingForm.css';
import { ErrorMessage as _ErrorMessage } from 'Forms/ErrorMessage';
import { FloatingDrawingsContainer } from 'Forms/containers/floating-drawings/FloatingDrawingsContainer';
import { DetailsToggle as _DetailsToggle } from 'Forms/buttons/DetailsToggle';
import { OldFileNotes } from './OldFileNotes';
import type { App } from 'App';
import { open } from './open';
import parseFileExtension from 'Parse/parseFileExtension';
import { removeFileExtension } from 'Parse/parseFileExtension';
import { createWaitOverlay } from 'Utilities/createWaitOverlay';

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
  let title = (
    <p
      style={{
        margin: '0px 92px',
        fontSize: '24px', fontWeight: 600, color: '#151516',
      }}
    >
      Open a Saved Drawing
    </p>
  );

  let underline = (
    <div
      style={{
        marginTop: '8px',
        height: '0px',
        borderWidth: '0px 0px 1px 0px',
        borderStyle: 'solid',
        borderColor: 'hsla(240, 23%, 88%, 1)',
      }}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      {title}
      {underline}
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
  let hiddenFileInput = useRef<HTMLInputElement>(null);

  let [errorMessageString, setErrorMessageString] = useState('');

  // should be incremented every time the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  let [showDetails, setShowDetails] = useState(false);

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
            <div className={formStyles.fileInput} onClick={() => hiddenFileInput.current?.click()} >
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
                    setErrorMessageString(error instanceof Error ? error.message : String(error));
                    setErrorMessageKey(errorMessageKey + 1);
                  }).finally(() => {
                    waitOverlay.remove();
                  });
                }}
                style={{ display: 'none' }}
              />
              <p
                className={formStyles.fileInputLabel}
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
            {!errorMessageString ? null : (
              <ErrorMessage key={errorMessageKey} >
                {errorMessageString}
              </ErrorMessage>
            )}
            {detailsToggleSpacer}
            {detailsToggle}
            {oldFileNotes}
          </div>
        </div>
      }
    />
  );
}
