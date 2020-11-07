import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DrawingInterface as Drawing } from '../../../draw/DrawingInterface';
import { BaseNumberingInterface as BaseNumbering } from '../../../draw/BaseNumberingInterface';
import { ClosableContainer } from '../../containers/ClosableContainer';
import { OffsetField } from './OffsetField';
import { AnchorField } from './AnchorField';
import { IncrementField } from './IncrementField';
import { ColorField } from './ColorField';
import { FontFamilyField } from './FontFamilyField';
import { FontSizeField } from './FontSizeField';
import { BoldFontField } from './BoldFontField';
import { LineWidthField } from './LineWidthField';
import { LineLengthField } from './LineLengthField';
import { BasePaddingField } from './BasePaddingField';

export function getBaseNumberings(drawing: Drawing): BaseNumbering[] {
  let bns = [] as BaseNumbering[];
  drawing.forEachBase(b => {
    if (b.numbering) {
      bns.push(b.numbering);
    }
  });
  return bns;
}

interface Props {
  app: App;
  close: () => void;
}

export function EditBaseNumbering(props: Props): React.ReactElement {
  let bns = getBaseNumberings(props.app.strictDrawing.drawing);
  let fieldProps = {
    getBaseNumberings: () => [...bns],
    pushUndo: () => props.app.pushUndo(),
    changed: () => props.app.drawingChangedNotByInteraction(),
  };
  return (
    <ClosableContainer
      close={props.close}
      title='Edit Numbering'
      contained={
        <div
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {OffsetField.create(props.app)}
          <div style={{ marginTop: '8px' }} >
            {AnchorField.create(props.app)}
          </div>
          <div style={{ marginTop: '8px' }} >
            {IncrementField.create(props.app)}
          </div>
          {bns.length == 0 ? null : (
            <div>
              <div style={{ marginTop: '20px' }} >
                <ColorField {...fieldProps} />
              </div>
              <div style={{ marginTop: '20px' }} >
                <FontFamilyField {...fieldProps} />
              </div>
              <div style={{ marginTop: '20px' }} >
                <FontSizeField {...fieldProps} />
              </div>
              <div style={{ marginTop: '8px' }} >
                <BoldFontField {...fieldProps} />
              </div>
              <div style={{ marginTop: '20px' }} >
                <LineWidthField {...fieldProps} />
              </div>
              <div style={{ marginTop: '8px' }} >
                <LineLengthField {...fieldProps} />
              </div>
              <div style={{ marginTop: '8px' }} >
                <BasePaddingField {...fieldProps} />
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}
