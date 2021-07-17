import * as React from 'react';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { BaseCharacterField } from './BaseCharacterField';
import BaseColorField from './BaseColorField';
import { ForwardAndBackwardButtons } from './ForwardAndBackwardButtons';
import { HasOutlineField, allBasesHaveOutlines } from './HasOutlineField';
import OutlineRadiusField from './OutlineRadiusField';
import OutlineStrokeField from './OutlineStrokeField';
import OutlineStrokeWidthField from './OutlineStrokeWidthField';
import OutlineFillField from './OutlineFillField';

export function BaseAnnotationFields(selectedBases: () => Base[], pushUndo: () => void, changed: () => void): React.ReactElement {
  let bs = selectedBases();
  if (bs.length == 0) {
    return <p>No bases are selected.</p>;
  } else {
    let fieldProps = {
      selectedBases: selectedBases,
      pushUndo: pushUndo,
      changed: changed,
    };
    return (
      <div>
        {bs.length != 1 ? null : (
          <div style={{ marginBottom: '12px' }} >
            {BaseCharacterField(selectedBases, pushUndo, changed)}
          </div>
        )}
        {BaseColorField(selectedBases, pushUndo, changed)}
        <div style={{ marginTop: '16px' }} >
          <ForwardAndBackwardButtons {...fieldProps} />
        </div>
        <div style={{ marginTop: '16px' }} >
          {HasOutlineField(selectedBases, pushUndo, changed)}
        </div>
        {!allBasesHaveOutlines(selectedBases()) ? null : (
          <div style={{ marginLeft: '16px' }} >
            <div style={{ marginTop: '12px' }} >
              {OutlineRadiusField(selectedBases, pushUndo, changed)}
            </div>
            <div style={{ marginTop: '12px' }} >
              {OutlineStrokeField(selectedBases, pushUndo, changed)}
            </div>
            <div style={{ marginTop: '12px' }} >
              {OutlineStrokeWidthField(selectedBases, pushUndo, changed)}
            </div>
            <div style={{ marginTop: '12px' }} >
              {OutlineFillField(selectedBases, pushUndo, changed)}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BaseAnnotationFields;
