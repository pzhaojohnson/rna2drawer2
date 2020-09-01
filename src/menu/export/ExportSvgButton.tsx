import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
const uuidv1 = require('uuid/v1');
import renderExportSvgInApp from '../../forms/export/svg/renderExportSvgInApp';

interface Props {
  app: App;
}

export function ExportSvgButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      key={uuidv1()}
      text={'SVG'}
      onClick={() => renderExportSvgInApp(props.app)}
    />
  );
}
