import * as React from 'react';
import type { App } from 'App';
import { Base } from 'Draw/bases/Base';
import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { EditBases } from 'Forms/edit/bases/EditBases';

export type Props = {
  app: App;
  mode: AnnotatingMode;
  unmount: () => void;
  history: FormHistoryInterface;
}

function selectedBases(mode: AnnotatingMode): Base[] {
  let bs = [] as Base[];
  mode.selected.forEach(p => {
    let b = mode.strictDrawing.drawing.getBaseAtOverallPosition(p);
    if (b instanceof Base) {
      bs.push(b);
    }
  });
  return bs;
}

export function AnnotatingForm(props: Props): React.ReactElement {
  return (
    <EditBases
      app={props.app}
      bases={selectedBases(props.mode)}
      unmount={props.unmount}
      history={props.history}
    />
  );
}
