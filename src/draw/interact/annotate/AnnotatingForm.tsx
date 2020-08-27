import * as React from 'react';
import { BaseInterface as Base } from '../../BaseInterface';
import { AnnotatingModeInterface as AnnotatingMode } from './AnnotatingModeInterface';
import ClosableContainer from '../../../forms/containers/ClosableContainer';
import Title from '../../../forms/Title';
import Underline from '../../../forms/Underline';
import BaseAnnotationFields from '../../../forms/annotate/bases/BaseAnnotationFields';
const uuidv1 = require('uuid/v1');

function selectedBases(mode: AnnotatingMode): Base[] {
  let bs = [] as Base[];
  mode.selected.forEach(p => {
    let b = mode.drawing.getBaseAtOverallPosition(p);
    if (b) {
      bs.push(b);
    }
  });
  return bs;
}

export function AnnotatingForm(mode: AnnotatingMode, close?: () => void): React.ReactElement {
  return (
    <ClosableContainer
      close={() => close ? close() : undefined}
      children={[(
        <div
          key={uuidv1()}
          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Title text={'Annotate Bases'} margin={'16px 32px 0px 32px'} />
          <Underline margin={'8px 16px 0px 16px'} />
          <div style={{ margin: '24px 40px 0px 40px' }} >
            {BaseAnnotationFields(
              () => selectedBases(mode),
              () => mode.fireShouldPushUndo(),
              () => mode.fireChange(),
            )}
          </div>
        </div>
      )]}
      width={'400px'}
    />
  );
}
