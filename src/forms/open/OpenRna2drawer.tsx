import * as React from 'react';
import { useState, useRef } from 'react';
import formStyles from './OpenRna2drawer.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { FloatingDrawingsContainer } from 'Forms/containers/floatingDrawings/FloatingDrawingsContainer';
import closedFolder from './closedFolder.svg';
import openFolder from './openFolder.svg';
import { SolidButton } from 'Forms/buttons/SolidButton';
import type { App } from 'App';
import { open } from './open';
import parseFileExtension from 'Parse/parseFileExtension';
import { removeFileExtension } from 'Parse/parseFileExtension';

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

  let [fileUploaded, setFileUploaded] = useState(false);

  let [fileName, setFileName] = useState('');
  let [fileExtension, setFileExtension] = useState('');
  let [fileContents, setFileContents] = useState('');

  // use String object to rerender every time the error message is set
  let [errorMessage, setErrorMessage] = useState<String>(new String(''));

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
              alignItems: 'flex-start',
            }}
          >
            <div style={{ marginTop: '32px' }} >
              <input
                ref={hiddenFileInput}
                type='file'
                onChange={event => {
                  let files = event.target.files;
                  if (files) {
                    let f = files[0];
                    if (f) {
                      let fr = new FileReader();
                      fr.addEventListener('load', () => {
                        // should always be a string when readAsText is used
                        if (typeof fr.result == 'string') {
                          setFileName(f.name);
                          setFileExtension(parseFileExtension(f.name));
                          setFileContents(fr.result);
                          setFileUploaded(true);
                          setErrorMessage(new String(''));
                        }
                      })
                      fr.readAsText(f);
                    }
                  }
                }}
                style={{ display: 'none' }}
              />
              <div
                className={formStyles.fileInput}
                onClick={() => hiddenFileInput.current?.click()}
                style={{ minWidth: '256px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              >
                <img
                  className={formStyles.folderIcon}
                  src={fileUploaded ? openFolder : closedFolder}
                  alt='File Folder'

                  // file drag and drop not implemented yet
                  onDragOver={event => event.preventDefault()}
                  onDrop={event => event.preventDefault()}
                />
                <p
                  className={fileUploaded ? formStyles.fileName : formStyles.fileInputLabel}
                  style={{ marginLeft: '10px' }}
                >
                  {fileUploaded ? fileName : 'Upload a file with .rna2drawer extension...'}
                </p>
              </div>
            </div>
            <div style={{ marginTop: '32px' }} >
              <SolidButton
                text='Submit'
                onClick={() => {
                  if (!fileUploaded) {
                    setErrorMessage(new String('No file uploaded.'));
                    return;
                  }

                  if (fileExtension.toLowerCase().indexOf('rna2drawer') != 0) {
                    setErrorMessage(new String('File must have a .rna2drawer extension.'));
                    return;
                  }

                  let opened = open(props.app, { extension: fileExtension, contents: fileContents });
                  if (!opened) {
                    setErrorMessage(new String('Invalid RNA2Drawer file.'));
                    return;
                  }

                  updateDrawingTitle(props.app, fileName);
                  props.close();
                  // prevent coming back to this form or preceding forms
                  props.app.formContainer.clearHistory();
                  props.app.refresh();
                }}
              />
            </div>
            {!errorMessage.valueOf() ? null : (
              <div key={Math.random()} style={{ marginTop: '6px' }} >
                <p className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`} >
                  {errorMessage.valueOf()}
                </p>
              </div>
            )}
            <DetailsToggle onClick={() => setShowDetails(!showDetails)} />
            {showDetails ? <OldFileNotes /> : null}
          </div>
        </div>
      }
    />
  );
}
