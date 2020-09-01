import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { Dropdown } from '../Dropdown';
import { ExportSvgButton } from './ExportSvgButton';
import { ExportPptxButton } from './ExportPptxButton';

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
        </div>
      )}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
