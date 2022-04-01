import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import textFieldStyles from 'Forms/inputs/text/TextField.css';
import colorFieldStyles from 'Forms/inputs/color/ColorField.css';
import type { App } from 'App';
import type { Drawing } from 'Draw/Drawing';
import type { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { FontFamilyField } from 'Forms/edit/bases/numberings/FontFamilyField';
import { FontSizeField } from 'Forms/edit/bases/numberings/FontSizeField';
import { BoldField } from 'Forms/edit/bases/numberings/BoldField';
import { ColorPicker } from 'Forms/edit/bases/numberings/ColorPicker';
import { OpacityInput } from 'Forms/edit/bases/numberings/OpacityInput';
import { LineWidthField } from 'Forms/edit/bases/numberings/LineWidthField';
import { LineLengthField } from 'Forms/edit/bases/numberings/LineLengthField';
import { BasePaddingField } from 'Forms/edit/bases/numberings/BasePaddingField';
import { NumberingOffsetInput } from 'Forms/edit/sequence/NumberingOffsetInput';
import { NumberingIncrementInput } from 'Forms/edit/sequence/NumberingIncrementInput';
import { numberingIncrement } from 'Draw/sequences/numberingIncrement';
import { NumberingAnchorInput } from 'Forms/edit/sequence/NumberingAnchorInput';
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

export interface Props {
  app: App;
  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditNumbering(props: Props) {
  let bns = baseNumberings(props.app.strictDrawing.drawing);
  let firstSequence = atIndex(props.app.strictDrawing.drawing.sequences, 0);
  if (props.app.strictDrawing.drawing.sequences.length > 1) {
    console.error('Unable to edit the numbering properties of more than one sequence.');
  }
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Numbering'
      style={{ width: '324px' }}
    >
      {bns.length == 0 ? null : (
        <div style={{ marginBottom: '16px' }} >
          <FontFamilyField app={props.app} baseNumberings={bns} />
          <div style={{ marginTop: '8px' }} >
            <FontSizeField app={props.app} baseNumberings={bns} />
          </div>
          <div style={{ marginTop: '8px' }} >
            <BoldField app={props.app} baseNumberings={bns} />
          </div>
          <div style={{ marginTop: '16px' }} >
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
          <div style={{ marginTop: '16px' }} >
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
              <NumberingIncrementInput app={props.app} sequence={firstSequence} />
              <div style={{ marginLeft: '8px' }} >
                <p className={`${textFieldStyles.label} unselectable`} >
                  Increment
                </p>
              </div>
            </div>
          </div>
          {numberingIncrement(firstSequence) == undefined ? null : (
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
          )}
        </div>
      )}
    </PartialWidthContainer>
  );
}
