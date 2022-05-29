import type { App } from 'App';

import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { RotationField } from './RotationField';
import { FlatOutermostLoopField } from './FlatOutermostLoopField';

import { hasFlatOutermostLoop } from './hasFlatOutermostLoop';
import { TerminiGapField } from './TerminiGapField';

export type Props = {
  app: App; // a reference to the whole app

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditLayoutForm(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Layout'
      style={{ width: '330px' }}
    >
      <div style={{ display: 'flex' }} >
        <RotationField app={props.app} />
      </div>
      <div style={{ marginTop: '14px', display: 'flex' }} >
        <FlatOutermostLoopField app={props.app} />
      </div>
      {hasFlatOutermostLoop(props.app.strictDrawing) ? null : (
        <div style={{ marginTop: '14px', display: 'flex' }} >
          <TerminiGapField app={props.app} />
        </div>
      )}
    </PartialWidthContainer>
  );
}
