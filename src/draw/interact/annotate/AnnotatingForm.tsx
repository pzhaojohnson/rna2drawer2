import * as React from 'react';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import ClosableContainer from '../../../forms/containers/ClosableContainer';
import BaseAnnotationFields from '../../../forms/annotate/bases/BaseAnnotationFields';

export type Props = {
  app: App;
  mode: AnnotatingMode;
  unmount: () => void;
}

function selectedBases(mode: AnnotatingMode): Base[] {
  let bs = [] as Base[];
  mode.selected.forEach(p => {
    let b = mode.strictDrawing.drawing.getBaseAtOverallPosition(p);
    if (b) {
      bs.push(b);
    }
  });
  return bs;
}

export function AnnotatingForm(props: Props): React.ReactElement {
  return (
    <ClosableContainer
      close={() => close ? close() : undefined}
      title={'Edit Bases'}
      contained={
        <div
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {BaseAnnotationFields({
            app: props.app,
            strictDrawing: props.mode.strictDrawing,
            selectedBases: () => selectedBases(props.mode),
            clearSelection: () => props.mode.clearSelection(),
            pushUndo: () => props.mode.fireShouldPushUndo(),
            changed: () => props.mode.fireChange(),
          })}
        </div>
      }
      width={'400px'}
    />
  );
}
