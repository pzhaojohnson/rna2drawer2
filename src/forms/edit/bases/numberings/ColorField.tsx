import type { App } from 'App';
import type { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

import * as React from 'react';
import colorFieldStyles from 'Forms/inputs/color/ColorField.css';
import { ColorPicker } from './ColorPicker';
import { OpacityInput } from './OpacityInput';

export type Props = {
  app: App; // a reference to the whole app

  // the base numberings to edit
  baseNumberings: BaseNumbering[];
};

export function ColorField(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <ColorPicker app={props.app} baseNumberings={props.baseNumberings} />
      <div style={{ marginLeft: '10px' }} >
        <OpacityInput app={props.app} baseNumberings={props.baseNumberings} />
      </div>
      <div style={{ marginLeft: '8px' }} >
        <p className={`${colorFieldStyles.label} unselectable`} >
          Color
        </p>
      </div>
    </div>
  );
}
