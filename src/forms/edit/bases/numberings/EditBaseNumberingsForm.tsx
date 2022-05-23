import type { App } from 'App';
import type { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { FontFamilyField } from './FontFamilyField';
import { FontSizeField } from './FontSizeField';
import { BoldField } from './BoldField';
import { ColorField } from './ColorField';
import { LineWidthField } from './LineWidthField';
import { LineLengthField } from './LineLengthField';
import { BasePaddingField } from './BasePaddingField';

export interface Props {
  unmount: () => void;
  history: FormHistoryInterface;

  // a reference to the whole app
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumbering[];
}

export function EditBaseNumberingsForm(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Numberings'
      style={{ width: '324px' }}
    >
      {props.baseNumberings.length == 0 ? null : (
        <div style={{ marginBottom: '16px' }} >
          <FontFamilyField {...props} />
          <FontSizeField {...props} />
          <BoldField {...props} />
          <ColorField {...props} />
          <LineWidthField {...props} />
          <LineLengthField {...props} />
          <BasePaddingField {...props} />
        </div>
      )}
    </PartialWidthContainer>
  );
}
