import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';

function isU(s: string): boolean {
  return s.toLowerCase() == 'u';
}

function hasUs(drawing: Drawing): boolean {
  return drawing.bases().some(b => isU(b.text.text()));
}

export type Props = {
  app: App;
}

export function UsToTsButton(props: Props) {
  return (
    <DroppedButton
      text='Us to Ts'
      onClick={() => {
        if (hasUs(props.app.strictDrawing.drawing)) {
          props.app.pushUndo();
          props.app.strictDrawing.drawing.bases().forEach(b => {
            let s1 = b.text.text();
            if (isU(s1)) {
              let s2 = s1 == 'U' ? 'T' : 't';

              // remember center coordinates of text
              let bbox = b.text.bbox();
              let center = { x: bbox.cx, y: bbox.cy };

              // change letter
              b.text.clear();
              b.text.plain(s2);

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
