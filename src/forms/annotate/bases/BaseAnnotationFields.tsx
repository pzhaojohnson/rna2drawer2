import * as React from 'react';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotationInterface';
import { FieldProps } from './FieldProps';
import { CharacterField } from './CharacterField';
import { FillPicker } from './FillPicker';
import { FillOpacityInput } from './FillOpacityInput';
import { BringToFrontButton } from './BringToFrontButton';
import { SendToBackButton } from './SendToBackButton';
import { OutlineField, allHaveOutlines } from './OutlineField';
import { RadiusField as OutlineRadiusField } from './outlines/RadiusField';
import OutlineStrokeField from './OutlineStrokeField';
import { StrokeWidthField as OutlineStrokeWidthField } from './outlines/StrokeWidthField';
import { FillPicker as OutlineFillPicker } from './outlines/FillPicker';
import { FillOpacityInput as OutlineFillOpacityInput } from './outlines/FillOpacityInput';

export type Props = FieldProps & { app: App }

function outlines(bases: Base[]): CircleBaseAnnotation[] {
  let os: CircleBaseAnnotation[] = [];
  bases.forEach(b => {
    if (b.outline) {
      os.push(b.outline);
    }
  });
  return os;
}

export function BaseAnnotationFields(props: Props): React.ReactElement {
  let bs = props.selectedBases();
  let os = outlines(bs);
  if (bs.length == 0) {
    return <p>No bases are selected.</p>;
  } else {
    return (
      <div>
        {bs.length != 1 ? null : (
          <div style={{ marginBottom: '12px' }} >
            <CharacterField app={props.app} base={bs[0]} />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <FillPicker app={props.app} bases={bs} />
          <div style={{ marginLeft: '12px' }} >
            <FillOpacityInput app={props.app} bases={bs} />
          </div>
          <div style={{ marginLeft: '8px' }} >
            <p className={`${colorFieldStyles.label} unselectable`} >
              Color
            </p>
          </div>
        </div>
        <div style={{ marginTop: '16px' }} >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <BringToFrontButton app={props.app} bases={bs} />
            <div style={{ width: '16px' }} />
            <SendToBackButton app={props.app} bases={bs} />
          </div>
        </div>
        <div style={{ marginTop: '16px' }} >
          <OutlineField app={props.app} bases={bs} />
        </div>
        {!allHaveOutlines(bs) ? null : (
          <div style={{ marginLeft: '16px' }} >
            <div style={{ marginTop: '12px' }} >
              <OutlineRadiusField app={props.app} outlines={os} />
            </div>
            <div style={{ marginTop: '12px' }} >
              {OutlineStrokeField(props)}
            </div>
            <div style={{ marginTop: '12px' }} >
              <OutlineStrokeWidthField app={props.app} outlines={os} />
            </div>
            <div style={{ marginTop: '12px' }} >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <OutlineFillPicker app={props.app} outlines={os} />
                <div style={{ marginLeft: '12px' }} >
                  <OutlineFillOpacityInput app={props.app} outlines={os} />
                </div>
                <div style={{ marginLeft: '8px' }} >
                  <p className={`${colorFieldStyles.label} unselectable`} >
                    Fill
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BaseAnnotationFields;
