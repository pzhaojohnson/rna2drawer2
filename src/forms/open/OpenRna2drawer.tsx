import * as React from 'react';
import { useState, useRef } from 'react';
import formStyles from './OpenRna2drawer.css';
import { ErrorMessage } from 'Forms/ErrorMessage';
import { FloatingDrawingsContainer } from 'Forms/containers/floatingDrawings/FloatingDrawingsContainer';
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
  app.unspecifyDrawingTitle();
  if (titleFromFileName != app.unspecifiedDrawingTitle()) {
    // only specify if necessary since a specified title doesn't update
    // automatically as the drawing changes
    app.drawingTitle = titleFromFileName;
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
            borderColor: 'rgba(0,0,0,0.15)',
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
    <p className={formStyles.detailsToggle} onClick={props.onClick} >
      Details...
    </p>
  );
}

function OldFileNotes() {
  return (
    <div className={formStyles.oldFileNotes} style={{ marginTop: '12px' }} >
      <p className='unselectable' >
        <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
        Not all aspects of a drawing from the first version of RNA2Drawer will be preserved. The following will be preserved:
      </p>
      <div style={{ margin: '6px 0px 0px 18px' }} >
        <p className='unselectable' >
          (1) The sequence and its ID, (2) the secondary structure, (3) tertiary interactions and their colors,
          (4) base numbering and the numbering offset, and (5) base colors and outlines.
        </p>
      </div>
    </div>
  );
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

                  f.text().then(text => {
                    let fileExtension = parseFileExtension(fileName);
                    if (fileExtension.toLowerCase().indexOf('rna2drawer') != 0) {
                      throw new Error('File must have a .rna2drawer extension.');
                    }

                    let opened = open(props.app, { extension: fileExtension, contents: text });
                    if (!opened) {
                      throw new Error('Invalid RNA2Drawer file.');
                    }

                    updateDrawingTitle(props.app, fileName);
                    props.close();
                    // prevent coming back to this form or preceding forms
                    props.app.formContainer.clearHistory();
                    props.app.refresh();
                  }).catch(error => {
                    setErrorMessage(error instanceof Error ? error.message : String(error));
                    setErrorMessageKey(errorMessageKey + 1);
                  });
                }}
                style={{ display: 'none' }}
              />
              <p
                className={formStyles.fileInputLabel}
                onClick={() => hiddenFileInput.current?.click()}
                style={{
                  // make file name text a slightly different color
                  color: firstFile(hiddenFileInput) ? '#070766' : undefined,
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
              <ErrorMessage key={errorMessageKey} style={{ marginTop: '6px' }} >
                {errorMessage}
              </ErrorMessage>
            )}
            <DetailsToggle onClick={() => setShowDetails(!showDetails)} />
            {showDetails ? <OldFileNotes /> : null}
          </div>
        </div>
      }
    />
  );
}
