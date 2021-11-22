import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { FoldingModeInterface as FoldingMode } from 'Draw/interact/fold/FoldingModeInterface';
import { AnnotatingModeInterface as AnnotatingMode } from 'Draw/interact/annotate/AnnotatingModeInterface';

type ApplicableModes = [FoldingMode, AnnotatingMode];

function applicableModes(app: App): ApplicableModes {
  return [
    app.strictDrawingInteraction.foldingMode,
    app.strictDrawingInteraction.annotatingMode,
  ];
}

function deselectingOnDblclick(app: App): boolean {
  let allModesAre = true;
  applicableModes(app).forEach(mode => {
    allModesAre = !mode.deselectingOnDblclick ? false : allModesAre;
  });
  return allModesAre;
}

export type Props = {
  app: App;
}

export function DeselectOnDblclickButton(props: Props) {
  return (
    <DroppedButton
      text='Deselect on Double-Click'
      checked={deselectingOnDblclick(props.app)}
      onClick={() => {
        let toggleTo = !deselectingOnDblclick(props.app);
        applicableModes(props.app).forEach(mode => mode.deselectingOnDblclick = toggleTo);
        props.app.renderPeripherals();
      }}
    />
  );
}
