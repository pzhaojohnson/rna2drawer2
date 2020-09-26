import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { ClosableContainer } from '../../containers/ClosableContainer';
import { getSelectedTertiaryBonds } from './getSelectedTertiaryBonds';
import { StrokeField } from './StrokeField';
import { StrokeWidthField } from './StrokeWidthField';
import { DashedField } from './DashedField';
import { PaddingField1, PaddingField2 } from './PaddingFields';

interface Props {
  app: App;
  close: () => void;
}

export function EditTertiaryBonds(props: Props): React.ReactElement {
  return (
    <ClosableContainer
      close={props.close}
      title={'Edit Tertiary Bonds'}
      contained={
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          {getSelectedTertiaryBonds(props.app).length == 0 ? (
            <p>No tertiary bonds are selected.</p>
          ) : (
            <div>
              <StrokeField app={props.app} />
              <div style={{ marginTop: '16px' }} >
                <StrokeWidthField app={props.app} />
              </div>
              <div style={{ marginTop: '16px' }} >
                <DashedField app={props.app} />
              </div>
              <div style={{ marginTop: '16px' }} >
                <PaddingField1 app={props.app} />
              </div>
              <div style={{ marginTop: '16px' }} >
                <PaddingField2 app={props.app} />
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
