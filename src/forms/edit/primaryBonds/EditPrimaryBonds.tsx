import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { ClosableContainer } from '../../containers/ClosableContainer';
import { StrokeField } from './StrokeField';
import { StrokeWidthField } from './StrokeWidthField';
import { PaddingField } from './PaddingField';

interface Props {
  app: App;
  close: () => void;
}

export function EditPrimaryBonds(props: Props): React.ReactElement {
  return (
    <ClosableContainer
      close={props.close}
      title='Edit Primary Bonds'
      contained={
        props.app.strictDrawing.drawing.numPrimaryBonds == 0 ? (
          <p>Drawing has no primary bonds.</p>
        ) : (
          <div>
            <div>
              <StrokeField app={props.app} />
            </div>
            <div style={{ marginTop: '16px' }} >
              <StrokeWidthField app={props.app} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <PaddingField app={props.app} />
            </div>
          </div>
        )
      }
    />
  );
}
