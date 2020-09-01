import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import Dropdown from '../Dropdown';
import TopButton from '../TopButton';
import { ExportSvgButton } from './ExportSvgButton';
import { ExportPptxButton } from './ExportPptxButton';

interface Props {
  app: App;
}

export function ExportDropdown(props: Props): React.ReactElement {
  let drawing = props.app.strictDrawing;
  return (
    <Dropdown
      topButton={
        <TopButton
          text={'Export'}
          disabled={drawing.isEmpty()}
        />
      }
      dropped={drawing.isEmpty() ? <div></div> : (
        <div>
          <ExportSvgButton app={props.app} />
          <ExportPptxButton app={props.app} />
        </div>
      )}
    />
  );
}
