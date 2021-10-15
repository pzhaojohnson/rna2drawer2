import * as React from 'react';
import { Checkbox } from 'Forms/fields/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/fields/checkbox/CheckboxField.css';
import { AppInterface as App } from 'AppInterface';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

export type Props = {
  app: App;
}

function isBold(bn: BaseNumberingInterface): boolean {
  let fw = bn.text.attr('font-weight');
  if (typeof fw == 'string') {
    return fw == 'bold';
  } else if (typeof fw == 'number') {
    return fw >= 700;
  } else {
    return false;
  }
}

function allBaseNumberingsAreBold(props: Props): boolean {
  let allAreBold = true;
  props.app.strictDrawing.drawing.bases().forEach(b => {
    if (b.numbering && !isBold(b.numbering)) {
      allAreBold = false;
    }
  });
  return allAreBold;
}

function allBaseNumberingsAreNotBold(props: Props): boolean {
  let allAreNotBold = true;
  props.app.strictDrawing.drawing.bases().forEach(b => {
    if (b.numbering && isBold(b.numbering)) {
      allAreNotBold = false;
    }
  });
  return allAreNotBold;
}

function makeAllBaseNumberingsBoldIfShould(props: Props) {
  if (!allBaseNumberingsAreBold(props)) {
    props.app.pushUndo();
    props.app.strictDrawing.drawing.bases().forEach(b => {
      if (b.numbering) {
        b.numbering.text.attr({ 'font-weight': 700 });
      }
    });
    BaseNumbering.recommendedDefaults.text['font-weight'] = 700;
    props.app.drawingChangedNotByInteraction();
  }
}

function makeAllBaseNumberingsNotBoldIfShould(props: Props) {
  if (!allBaseNumberingsAreNotBold(props)) {
    props.app.pushUndo();
    props.app.strictDrawing.drawing.bases().forEach(b => {
      if (b.numbering) {
        b.numbering.text.attr({ 'font-weight': 400 });
      }
    });
    BaseNumbering.recommendedDefaults.text['font-weight'] = 400;
    props.app.drawingChangedNotByInteraction();
  }
}

export function BoldField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <Checkbox
        checked={allBaseNumberingsAreBold(props)}
        onChange={event => {
          if (event.target.checked) {
            makeAllBaseNumberingsBoldIfShould(props);
          } else {
            makeAllBaseNumberingsNotBoldIfShould(props);
          }
        }}
      />
      <p
        className={`${checkboxFieldStyles.label} unselectable`}
        style={{ marginLeft: '6px' }}
      >
        Bold
      </p>
    </div>
  );
}
