import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { ClosableContainer } from '../../containers/ClosableContainer';
import {
  getAutBonds,
  AutStrokeField,
  getGcBonds,
  GcStrokeField,
  getGutBonds,
  GutStrokeField,
  getOtherBonds,
  OtherStrokeField,
} from './StrokeFields';
import { StrokeWidthField } from './StrokeWidthField';
import { PaddingField } from './PaddingField';

interface Props {
  app: App;
  close: () => void;
}

export function EditSecondaryBonds(props: Props): React.ReactElement {
  return (
    <ClosableContainer
      close={props.close}
      title='Edit Secondary Bonds'
      contained={
        props.app.strictDrawing.drawing.numSecondaryBonds == 0 ? (
          <p>Drawing has no secondary bonds.</p>
        ) : (
          <div>
            {getAutBonds(props.app).length == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <AutStrokeField app={props.app} />
              </div>
            )}
            {getGcBonds(props.app).length == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <GcStrokeField app={props.app} />
              </div>
            )}
            {getGutBonds(props.app).length == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <GutStrokeField app={props.app} />
              </div>
            )}
            {getOtherBonds(props.app).length == 0 ? null : (
              <div style={{ paddingBottom: '8px' }} >
                <OtherStrokeField app={props.app} />
              </div>
            )}
            <div style={{ paddingBottom: '8px' }} >
              <StrokeWidthField app={props.app} />
            </div>
            <PaddingField app={props.app} />
          </div>
        )
      }
    />
  );
}
