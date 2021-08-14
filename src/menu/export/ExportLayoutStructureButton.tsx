import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { DroppedButton } from '../DroppedButton';
import { download } from 'Utilities/download';

function getLayoutDotBracket(app: App): string {
  let partners = app.strictDrawing.layoutPartners();
  let dtbr = '';
  partners.forEach((q, i) => {
    let p = i + 1;
    if (typeof q == 'number') {
      dtbr += p < q ? '(' : ')';
    } else {
      dtbr += '.';
    }
  });
  return dtbr;
}

interface Props {
  app: App;
}

export function ExportLayoutStructureButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text='Layout Structure'
      onClick={() => {
        let name = document.title ? document.title : 'Drawing';
        let ids = props.app.strictDrawing.drawing.sequenceIds().join(', ');
        let seq = props.app.strictDrawing.drawing.overallCharacters;
        let dtbr = getLayoutDotBracket(props.app);
        download({
          name: name + '.txt',
          type: 'text/plain',
          contents: '>' + ids + '\n' + seq + '\n' + dtbr,
        });
      }}
    />
  );
}
