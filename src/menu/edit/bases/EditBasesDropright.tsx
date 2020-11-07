import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { Dropright, trailingBorderStyles } from '../../Dropright';
import { DroppedSeparator } from '../../DroppedSeparator';
import { GeneralStylesButton } from './GeneralStylesButton';
import { BySelectionButton } from './BySelectionButton';
import { ByCharacterButton } from './ByCharacterButton';
import { ByDataButton } from './ByDataButton';
import { CapitalizeButton } from './CapitalizeButton';
import { DecapitalizeButton } from './DecapitalizeButton';
import { TsToUsButton } from './TsToUsButton';
import { UsToTsButton } from './UsToTsButton';

interface Props {
  app: App;
}

export function EditBasesDropright(props: Props): React.ReactElement {
  return (
    <Dropright
      name='Bases'
      dropped={
        <div>
          <GeneralStylesButton app={props.app} />
          <DroppedSeparator {...trailingBorderStyles} />
          <BySelectionButton app={props.app} {...trailingBorderStyles} />
          <ByCharacterButton app={props.app} {...trailingBorderStyles} />
          <ByDataButton app={props.app} {...trailingBorderStyles} />
          <DroppedSeparator {...trailingBorderStyles} />
          <CapitalizeButton app={props.app} {...trailingBorderStyles} />
          <DecapitalizeButton app={props.app} {...trailingBorderStyles} />
          <TsToUsButton app={props.app} {...trailingBorderStyles} />
          <UsToTsButton app={props.app} {...trailingBorderStyles} />
        </div>
      }
    />
  );
}
