import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { DrawingInterface as Drawing } from '../../../../draw/DrawingInterface';
import { ClosableContainer } from '../../../containers/ClosableContainer';
import { WidthField, HeightField } from './DimensionsFields';
import { FontFamilyField } from './FontFamilyField';
import { FontSizeField } from './FontSizeField';
import { BoldFontField } from './BoldFontField';

function getDrawing(app: App): Drawing {
  return app.strictDrawing.drawing;
}

interface Props {
  app: App;
  close: () => void;
}

export function GeneralBaseStyles(props: Props): React.ReactElement {
  return (
    <ClosableContainer
      close={props.close}
      title='General Base Styles'
      contained={
        getDrawing(props.app).numBases == 0 ? (
          <p>Drawing has no bases.</p>
        ) : (
          <div>
            <WidthField app={props.app} />
            <div style={{ paddingTop: '8px' }} >
              <HeightField app={props.app} />
            </div>
            <div style={{ paddingTop: '8px' }} >
              <FontFamilyField app={props.app} />
            </div>
            <div style={{ paddingTop: '8px' }} >
              <FontSizeField app={props.app} />
            </div>
            <div style={{ paddingTop: '8px' }} >
              <BoldFontField app={props.app} />
            </div>
          </div>
        )
      }
    />
  );
}
