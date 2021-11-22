import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { offerFileForDownload } from 'Utilities/offerFileForDownload';

export type Props = {
  app: App;
}

export function SaveButton(props: Props) {
  return (
    <DroppedButton
      text='Save'
      onClick={() => {
        let name = document.title ? document.title : 'Drawing';
        offerFileForDownload({
          name: name + '.rna2drawer2',
          type: 'text/plain',
          contents: props.app.strictDrawing.savableString,
        });
      }}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
