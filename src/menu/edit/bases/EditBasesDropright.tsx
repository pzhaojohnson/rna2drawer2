import * as React from 'react';
import styles from './EditBasesDropright.css';
import { Dropright } from 'Menu/Dropright';
import { DroppedSeparator } from 'Menu/DroppedSeparator';
import type { App } from 'App';
import { GeneralStylesButton } from './GeneralStylesButton';
import { BySelectionButton } from './BySelectionButton';
import { ByCharacterButton } from './ByCharacterButton';
import { ByDataButton } from './ByDataButton';
import { CapitalizeButton } from './CapitalizeButton';
import { DecapitalizeButton } from './DecapitalizeButton';
import { TsToUsButton } from './TsToUsButton';
import { UsToTsButton } from './UsToTsButton';

export type Props = {
  app: App;
}

export function EditBasesDropright(props: Props) {
  return (
    <Dropright
      name='Bases'
      dropped={
        <div style={{ width: '256px', display: 'flex', flexDirection: 'column' }} >
          <div className={styles.whiteLeftBorder} >
            <GeneralStylesButton app={props.app} />
          </div>
          <div className={styles.grayishLeftBorder} >
            <DroppedSeparator />
            <BySelectionButton app={props.app} />
            <ByCharacterButton app={props.app} />
            <ByDataButton app={props.app} />
            <DroppedSeparator />
            <CapitalizeButton app={props.app} />
            <DecapitalizeButton app={props.app} />
            <DroppedSeparator />
            <TsToUsButton app={props.app} />
            <UsToTsButton app={props.app} />
          </div>
        </div>
      }
    />
  );
}
