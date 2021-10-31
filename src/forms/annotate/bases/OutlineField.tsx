import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { addCircleOutline, removeCircleOutline } from 'Draw/bases/annotate/circle/add';
import { sendToBack as sendOutlineToBack } from 'Draw/bases/annotate/circle/z';
import { MostRecentOutlineProps } from './MostRecentOutlineProps';

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];
}

export function allHaveOutlines(bases: Base[]): boolean {
  return bases.filter(b => !b.outline).length == 0;
}

function addOutlines(bases: Base[]) {
  bases.forEach(b => {
    let hadOutline = b.outline ? true : false;

    // don't overwrite preexisting outlines
    if (!b.outline) {
      addCircleOutline(b);
    }

    // check that outline was added successfully
    // and don't overwrite the values of preexisting outlines
    if (b.outline && !hadOutline) {
      b.outline.circle.attr({
        'r': MostRecentOutlineProps.radius,
        'stroke': MostRecentOutlineProps.stroke,
        'stroke-width': MostRecentOutlineProps.strokeWidth,
        'stroke-opacity': MostRecentOutlineProps.strokeOpacity,
        'fill': MostRecentOutlineProps.fill,
        'fill-opacity': MostRecentOutlineProps.fillOpacity,
      });
      sendOutlineToBack(b.outline);
    }
  });
}

function removeOutlines(bases: Base[]) {
  bases.forEach(b => removeCircleOutline(b));
}

export function OutlineField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={allHaveOutlines(props.bases)}
        onChange={event => {
          props.app.pushUndo();
          if (event.target.checked) {
            addOutlines(props.bases);
          } else {
            removeOutlines(props.bases);
          }
          props.app.drawingChangedNotByInteraction();
        }}
      />
      <p
        className={`${checkboxFieldStyles.label} unselectable`}
        style={{ marginLeft: '6px' }}
      >
        Outline
      </p>
    </div>
  );
}
