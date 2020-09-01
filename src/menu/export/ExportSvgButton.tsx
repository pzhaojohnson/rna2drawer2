import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import DroppedButton from '../DroppedButton';
import renderExportSvgInApp from '../../forms/export/svg/renderExportSvgInApp';

interface Props {
  app: App;
}

export function ExportSvgButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'SVG'}
      onClick={() => renderExportSvgInApp(props.app)}
    />
  );
}
