import * as React from 'react';
import { NonnegativeNumberField } from '../../fields/text/NonnegativeNumberField';
import { AppInterface as App } from '../../../AppInterface';

interface Props {
  app: App;
}

export function BaseSpacingField(props: Props) {
  return (
    <NonnegativeNumberField
      name='Base Spacing'
      initialValue={
        props.app.strictDrawing.generalLayoutProps().basePairBondLength
      }
      set={bs => {
        let generalProps = props.app.strictDrawing.generalLayoutProps();
        if (bs != generalProps.basePairBondLength) {
          props.app.pushUndo();
          generalProps.basePairBondLength = bs;
          props.app.strictDrawing.setGeneralLayoutProps(generalProps);
          props.app.strictDrawing.updateLayout();
          props.app.drawingChangedNotByInteraction();
        }
      }}
    />
  );
}
