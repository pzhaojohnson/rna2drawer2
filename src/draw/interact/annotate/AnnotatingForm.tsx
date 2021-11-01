import * as React from 'react';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import { AnnotateBases } from 'Forms/annotate/bases/AnnotateBases';

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
    <AnnotateBases
      app={props.app}
      bases={selectedBases(props.mode)}
      unmount={props.unmount}
    />
  );
}
