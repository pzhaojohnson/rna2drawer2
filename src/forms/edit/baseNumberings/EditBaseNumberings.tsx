import * as React from 'react';
import { CloseButton } from 'Forms/buttons/CloseButton';
import formStyles from './EditBaseNumberings.css';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseNumberingInterface as BaseNumbering } from 'Draw/bases/number/BaseNumberingInterface';
import { FontFamilyField } from './FontFamilyField';
import { FontSizeField } from './FontSizeField';
import { BoldField } from './BoldField';
import { ColorPicker } from './ColorPicker';
import { OpacityInput } from './OpacityInput';
import { LineWidthField } from './LineWidthField';
import { LineLengthField } from './LineLengthField';
import { BasePaddingField } from './BasePaddingField';
import { OffsetField } from './OffsetField';
import { AnchorField } from './AnchorField';
import { IncrementField } from './IncrementField';

function baseNumberings(drawing: Drawing): BaseNumbering[] {
  let bns: BaseNumbering[] = [];
  drawing.bases().forEach(b => {
    if (b.numbering) {
      bns.push(b.numbering);
    }
  });
  return bns;
}

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      Edit Numbering
    </p>
  );
}

function TitleUnderline() {
  return (
    <div
      style={{
        height: '0px',
        borderWidth: '0px 0px 1px 0px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.2)',
      }}
    />
  );
}

export interface Props {
  app: App;
  unmount: () => void;
}

export function EditBaseNumberings(props: Props) {
  let bns = baseNumberings(props.app.strictDrawing.drawing);
  return (
    <div
      className={formStyles.form}
      style={{ position: 'relative', width: '336px', height: '100%', overflow: 'auto' }}
    >
      <div style={{ position: 'absolute', top: '0px', right: '0px' }} >
        <CloseButton
          onClick={() => props.unmount()}
        />
      </div>
      <div style={{ margin: '16px 32px 0px 32px' }} >
        <Title />
      </div>
      <div style={{ margin: '8px 16px 0px 16px' }} >
        <TitleUnderline />
      </div>
      <div style={{ margin: '24px 40px 0px 40px' }} >
        {bns.length == 0 ? null : (
          <div style={{ marginBottom: '24px' }} >
            <FontFamilyField app={props.app} baseNumberings={bns} />
            <div style={{ marginTop: '8px' }} >
              <FontSizeField app={props.app} baseNumberings={bns} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <BoldField app={props.app} baseNumberings={bns} />
            </div>
            <div style={{ marginTop: '24px' }} >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <ColorPicker app={props.app} baseNumberings={bns} />
                <div style={{ marginLeft: '12px' }} >
                  <OpacityInput app={props.app} baseNumberings={bns} />
                </div>
                <div style={{ marginLeft: '8px' }} >
                  <p className={`${colorFieldStyles.label} unselectable`} >
                    Color
                  </p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '24px' }} >
              <LineWidthField app={props.app} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <LineLengthField app={props.app} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <BasePaddingField app={props.app} />
            </div>
          </div>
        )}
        <OffsetField app={props.app} />
        <div style={{ marginTop: '8px' }} >
          <AnchorField app={props.app} />
        </div>
        <div style={{ marginTop: '8px' }} >
          <IncrementField app={props.app} />
        </div>
      </div>
    </div>
  );
}
