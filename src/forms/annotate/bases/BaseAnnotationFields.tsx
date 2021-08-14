import * as React from 'react';
import { FieldProps as Props } from './FieldProps';
import { BaseCharacterField } from './BaseCharacterField';
import BaseColorField from './BaseColorField';
import { ForwardAndBackwardButtons } from './ForwardAndBackwardButtons';
import { HasOutlineField, allBasesHaveOutlines } from './HasOutlineField';
import OutlineRadiusField from './OutlineRadiusField';
import OutlineStrokeField from './OutlineStrokeField';
import OutlineStrokeWidthField from './OutlineStrokeWidthField';
import OutlineFillField from './OutlineFillField';

export function BaseAnnotationFields(props: Props): React.ReactElement {
  let bs = props.selectedBases();
  if (bs.length == 0) {
    return <p>No bases are selected.</p>;
  } else {
    return (
      <div>
        {bs.length != 1 ? null : (
          <div style={{ marginBottom: '12px' }} >
            {BaseCharacterField(props)}
          </div>
        )}
        {BaseColorField(props)}
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
