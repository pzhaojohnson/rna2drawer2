import * as React from 'react';
import { CloseButton } from 'Forms/buttons/CloseButton';
import formStyles from './EditNumbering.css';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseNumberingInterface as BaseNumbering } from 'Draw/bases/number/BaseNumberingInterface';
import { FontFamilyField } from 'Forms/edit/bases/numberings/FontFamilyField';
import { FontSizeField } from 'Forms/edit/bases/numberings/FontSizeField';
import { BoldField } from 'Forms/edit/bases/numberings/BoldField';
import { ColorPicker } from 'Forms/edit/bases/numberings/ColorPicker';
import { OpacityInput } from 'Forms/edit/bases/numberings/OpacityInput';
import { LineWidthField } from 'Forms/edit/bases/numberings/LineWidthField';
import { LineLengthField } from 'Forms/edit/bases/numberings/LineLengthField';
import { BasePaddingField } from 'Forms/edit/bases/numberings/BasePaddingField';
import { NumberingOffsetInput } from 'Forms/edit/sequence/NumberingOffsetInput';
import { NumberingAnchorInput } from 'Forms/edit/sequence/NumberingAnchorInput';
import { NumberingIncrementInput } from 'Forms/edit/sequence/NumberingIncrementInput';
import { atIndex } from 'Array/at';

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
      Numbering
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
        borderColor: 'rgba(0,0,0,0.175)',
      }}
    />
  );
}

export interface Props {
  app: App;
  unmount: () => void;
}

export function EditNumbering(props: Props) {
  let bns = baseNumberings(props.app.strictDrawing.drawing);
  let firstSequence = atIndex(props.app.strictDrawing.drawing.sequences, 0);
  if (props.app.strictDrawing.drawing.sequences.length > 1) {
    console.error('Unable to edit the numbering properties of more than one sequence.');
  }
  return (
    <div
      className={formStyles.form}
      style={{ position: 'relative', width: '324px', height: '100%', overflow: 'auto' }}
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
                <div style={{ marginLeft: '10px' }} >
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
              <LineWidthField app={props.app} baseNumberings={bns} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <LineLengthField app={props.app} baseNumberings={bns} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <BasePaddingField app={props.app} baseNumberings={bns} />
            </div>
          </div>
        )}
        {!firstSequence ? null : (
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              <NumberingOffsetInput app={props.app} sequence={firstSequence} />
              <div style={{ marginLeft: '8px' }} >
                <p className={`${textFieldStyles.label} unselectable`} >
                  Offset
                </p>
              </div>
            </div>
            <div style={{ marginTop: '8px' }} >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <NumberingAnchorInput app={props.app} sequence={firstSequence} />
                <div style={{ marginLeft: '8px' }} >
                  <p className={`${textFieldStyles.label} unselectable`} >
                    Anchor
                  </p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '8px' }} >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <NumberingIncrementInput app={props.app} sequence={firstSequence} />
                <div style={{ marginLeft: '8px' }} >
                  <p className={`${textFieldStyles.label} unselectable`} >
                    Increment
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
