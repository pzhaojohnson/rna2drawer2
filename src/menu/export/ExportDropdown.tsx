import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { Dropdown } from '../Dropdown';
import { DroppedSeparator } from '../DroppedSeparator';
import { ExportSvgButton } from './ExportSvgButton';
import { ExportPptxButton } from './ExportPptxButton';
import { ExportLayoutStructureButton } from './ExportLayoutStructureButton';

interface Props {
  app: App;
}

export function ExportDropdown(props: Props): React.ReactElement {
  return (
    <Dropdown
      name={'Export'}
      dropped={(
        <div>
          <ExportSvgButton app={props.app} />
          <ExportPptxButton app={props.app} />
          <DroppedSeparator />
          <ExportLayoutStructureButton app={props.app} />
        </div>
      )}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
