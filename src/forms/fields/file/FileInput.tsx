import * as React from 'react';
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

export function FileInput(props: Props): React.ReactElement {
  return (
    <input
      type={'file'}
      onChange={event => {
        let files = event.target.files;
        let f = files ? files[0] : undefined;
        if (f) {
          props.onLoadStart();
          let name = f.name;
          let extension = parseFileExtension(name);
          let fr = new FileReader();
          fr.addEventListener('load', () => {
            // should always be a string when readAsText is used
            if (typeof fr.result == 'string') {
              props.onLoad({ name: name, extension: extension, contents: fr.result });
            }
          });
          fr.readAsText(f);
        }
      }}
    />
  );
}
