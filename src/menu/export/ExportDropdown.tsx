import * as React from 'react';
import { Dropdown } from 'Menu/Dropdown';
import { DroppedSeparator } from 'Menu/DroppedSeparator';
import { AppInterface as App } from 'AppInterface';
import { ExportSvgButton } from './ExportSvgButton';
import { ExportPptxButton } from './ExportPptxButton';
import { ExportLayoutStructureButton } from './ExportLayoutStructureButton';

export type Props = {
  app: App;
}

export function ExportDropdown(props: Props) {
  return (
    <Dropdown
      name='Export'
      dropped={
        <div style={{ width: '256px', display: 'flex', flexDirection: 'column' }} >
          <ExportSvgButton app={props.app} />
          <ExportPptxButton app={props.app} />
          <DroppedSeparator />
          <ExportLayoutStructureButton app={props.app} />
        </div>
      }
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
