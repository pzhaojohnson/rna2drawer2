import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';

function isLowerCase(s: string): boolean {
  return s == s.toLowerCase();
}

function onlyHasLowerCases(drawing: Drawing): boolean {
  return drawing.bases().every(b => isLowerCase(b.text.text()));
}

export type Props = {
  app: App;
}

export function DecapitalizeButton(props: Props) {
  return (
    <DroppedButton
      text='lowercase'
      onClick={() => {
        if (!onlyHasLowerCases(props.app.strictDrawing.drawing)) {
          props.app.pushUndo();
          props.app.strictDrawing.drawing.bases().forEach(b => {
            let s = b.text.text();
            if (!isLowerCase(s)) {

              // remember center coordinates of text
              let bbox = b.text.bbox();
              let center = { x: bbox.cx, y: bbox.cy };

              // decapitalize
              b.text.clear();
              b.text.plain(s.toLowerCase());

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
