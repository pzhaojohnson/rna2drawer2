import * as React from 'react';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';
import { AppInterface as App } from 'AppInterface';
import { FieldProps } from './FieldProps';
import { CharacterField } from './CharacterField';
import { FillPicker } from './FillPicker';
import { FillOpacityInput } from './FillOpacityInput';
import { ForwardAndBackwardButtons } from './ForwardAndBackwardButtons';
import { HasOutlineField, allBasesHaveOutlines } from './HasOutlineField';
import OutlineRadiusField from './OutlineRadiusField';
import OutlineStrokeField from './OutlineStrokeField';
import OutlineStrokeWidthField from './OutlineStrokeWidthField';
import OutlineFillField from './OutlineFillField';

export type Props = FieldProps & { app: App }

export function BaseAnnotationFields(props: Props): React.ReactElement {
  let bs = props.selectedBases();
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
          <ForwardAndBackwardButtons {...props} />
        </div>
        <div style={{ marginTop: '16px' }} >
          {HasOutlineField(props)}
        </div>
        {!allBasesHaveOutlines(props.selectedBases()) ? null : (
          <div style={{ marginLeft: '16px' }} >
            <div style={{ marginTop: '12px' }} >
              {OutlineRadiusField(props)}
            </div>
            <div style={{ marginTop: '12px' }} >
              {OutlineStrokeField(props)}
            </div>
            <div style={{ marginTop: '12px' }} >
              {OutlineStrokeWidthField(props)}
            </div>
            <div style={{ marginTop: '12px' }} >
              {OutlineFillField(props)}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BaseAnnotationFields;
