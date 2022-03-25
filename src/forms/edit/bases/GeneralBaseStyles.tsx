import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';
import { FontFamilyField } from './FontFamilyField';
import { FontSizeField } from './FontSizeField';
import { BoldField } from './BoldField';
import { WidthField } from './WidthField';
import { HeightField } from './HeightField';

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];

  unmount: () => void;
  history: FormHistoryInterface;
}

export function GeneralBaseStyles(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='General Base Styles'
      style={{ width: '324px' }}
    >
      {props.bases.length == 0 ? (
        <p className={'unselectable'} style={{ fontSize: '12px' }} >
          No bases are selected.
        </p>
      ) : (
        <div>
          <FontFamilyField app={props.app} bases={props.bases} />
          <div style={{ marginTop: '8px' }} >
            <FontSizeField app={props.app} bases={props.bases} />
          </div>
          <div style={{ marginTop: '8px' }} >
            <BoldField app={props.app} bases={props.bases} />
          </div>
          <div style={{ marginTop: '16px' }} >
            <WidthField app={props.app} />
          </div>
          <div style={{ marginTop: '8px' }} >
            <HeightField app={props.app} />
          </div>
        </div>
      )}
    </PartialWidthContainer>
  );
}
