import * as React from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { ClosableContainer } from '../../../containers/ClosableContainer';
import { WidthField, HeightField } from './DimensionsFields';
import { FontFamilyField } from './FontFamilyField';
import { FontSizeField } from './FontSizeField';
import { BoldFontField } from './BoldFontField';

interface Props {
  app: App;
  close: () => void;
}

export function GeneralBaseStyles(props: Props): React.ReactElement {
  let drawing = props.app.strictDrawing.drawing;
  return (
    <ClosableContainer
      close={props.close}
      title='General Base Styles'
      contained={
        drawing.numBases == 0 ? (
          <p>Drawing has no bases.</p>
        ) : (
          <div>
            <WidthField app={props.app} />
            <div style={{ marginTop: '8px' }} >
              <HeightField app={props.app} />
            </div>
            <div style={{ marginTop: '16px' }} >
              <FontFamilyField app={props.app} />
            </div>
            <div style={{ marginTop: '16px' }} >
              <FontSizeField app={props.app} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <BoldFontField app={props.app} />
            </div>
          </div>
        )
      }
    />
  );
}
