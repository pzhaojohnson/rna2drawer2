import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import type { App } from 'App';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';

function isT(s: string): boolean {
  return s.toLowerCase() == 't';
}

function hasTs(drawing: Drawing): boolean {
  return drawing.bases().some(b => isT(b.text.text()));
}

export type Props = {
  app: App;
}

export function TsToUsButton(props: Props) {
  return (
    <DroppedButton
      text='Ts to Us'
      onClick={() => {
        if (hasTs(props.app.strictDrawing.drawing)) {
          props.app.pushUndo();
          props.app.strictDrawing.drawing.bases().forEach(b => {
            let s1 = b.text.text();
            if (isT(s1)) {
              let s2 = s1 == 'T' ? 'U' : 'u';

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
