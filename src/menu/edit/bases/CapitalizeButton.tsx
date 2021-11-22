import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';

function isUpperCase(s: string): boolean {
  return s == s.toUpperCase();
}

function onlyHasUpperCases(drawing: Drawing): boolean {
  return drawing.bases().every(b => isUpperCase(b.text.text()));
}

export type Props = {
  app: App;
}

export function CapitalizeButton(props: Props) {
  return (
    <DroppedButton
      text='UPPERCASE'
      onClick={() => {
        if (!onlyHasUpperCases(props.app.strictDrawing.drawing)) {
          props.app.pushUndo();
          props.app.strictDrawing.drawing.bases().forEach(b => {
            let s = b.text.text();
            if (!isUpperCase(s)) {

              // remember center coordinates of text
              let bbox = b.text.bbox();
              let center = { x: bbox.cx, y: bbox.cy };

              // capitalize
              b.text.clear();
              b.text.plain(s.toUpperCase());

              // recenter text
              b.text.center(center.x, center.y);
            }
          });
          props.app.refresh();
        }
      }}
    />
  );
}
