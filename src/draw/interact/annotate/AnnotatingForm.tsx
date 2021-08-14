import * as React from 'react';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import ClosableContainer from '../../../forms/containers/ClosableContainer';
import BaseAnnotationFields from '../../../forms/annotate/bases/BaseAnnotationFields';

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

export function AnnotatingForm(mode: AnnotatingMode, close?: () => void): React.ReactElement {
  return (
    <ClosableContainer
      close={() => close ? close() : undefined}
      title={'Edit Bases'}
      contained={
        <div
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          {BaseAnnotationFields({
            strictDrawing: mode.strictDrawing,
            selectedBases: () => selectedBases(mode),
            clearSelection: () => mode.clearSelection(),
            pushUndo: () => mode.fireShouldPushUndo(),
            changed: () => mode.fireChange(),
          })}
        </div>
      }
      width={'400px'}
    />
  );
}
