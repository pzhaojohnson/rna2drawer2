import * as React from 'react';
import { createRef, useRef, useState } from 'react';
import styles from './FileField.css';
import closedFolder from './closedFolder.svg';
import openFolder from './openFolder.svg';
import parseFileExtension from '../../../parse/parseFileExtension';

interface FileProps {
  name: string;
  extension: string;
  contents: string;
}

interface Props {
  onLoadStart: () => void;
  onLoad: (f: FileProps) => void;
}

export class HiddenFileInput extends React.Component<Props> {
  input: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    this.input = createRef<HTMLInputElement>();
  }
  
  click() {
    this.input.current?.click();
  }

  render() {
    return (
      <input
        ref={this.input}
        type={'file'}
        onChange={event => {
          let files = event.target.files;
          let f = files ? files[0] : undefined;
          if (f) {
            this.props.onLoadStart();
            let name = f.name;
            let extension = parseFileExtension(name);
            let fr = new FileReader();
            fr.addEventListener('load', () => {
              // should always be a string when readAsText is used
              if (typeof fr.result == 'string') {
                this.props.onLoad({ name: name, extension: extension, contents: fr.result });
              }
            });
            fr.readAsText(f);
          }
        }}
        style={{ display: 'none' }}
      />
    );
  }
}

export function FileField(props: Props): React.ReactElement {
  let hiddenInput = useRef<HiddenFileInput>(null);
  let [fileName, setFileName] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }} >
      <HiddenFileInput
        ref={hiddenInput}
        onLoadStart={props.onLoadStart}
        onLoad={f => {
          setFileName(f.name);
          props.onLoad(f);
        }}
      />
      <div
        className={styles.clickable}
        onClick={() => hiddenInput.current?.click()}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <img
          className={styles.folderIcon}
          src={fileName ? openFolder : closedFolder}
          alt='File Folder'
          
          // Prevent default behavior in case the user tries to drop a file.
          // Might want to allow file dropping in the future.
          onDragOver={event => event.preventDefault()}
          onDrop={event => event.preventDefault()}
        />
        <p
          className={styles.label}
          style={{
            marginLeft: fileName ? '6px' : '8px',
            fontSize: fileName ? '14px' : '16px',
            fontStyle: fileName ? 'normal' : 'italic',
            color: fileName ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)',
          }}
        >
          {fileName ? fileName : 'Upload a file...'}
        </p>
      </div>
    </div>
  );
}
