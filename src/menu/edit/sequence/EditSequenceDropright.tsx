import * as React from 'react';
import styles from './EditSequenceDropright.css';
import { Dropright } from 'Menu/Dropright';
import { DroppedSeparator } from 'Menu/DroppedSeparator';
import { AppInterface as App } from 'AppInterface';
import { EditSequenceIdButton } from './EditSequenceIdButton';
import { InsertSubsequenceButton } from './InsertSubsequenceButton';
import { RemoveSubsequenceButton } from './RemoveSubsequenceButton';

export type Props = {
  app: App;
}

export function EditSequenceDropright(props: Props) {
  return (
    <Dropright
      name='Sequence'
      dropped={
        <div style={{ width: '256px', display: 'flex', flexDirection: 'column' }} >
          <div className={styles.whiteLeftBorder} >
            <EditSequenceIdButton app={props.app} />
          </div>
          <div className={styles.grayishLeftBorder} >
            <DroppedSeparator />
            <InsertSubsequenceButton app={props.app} />
            <RemoveSubsequenceButton app={props.app} />
          </div>
        </div>
      }
    />
  );
}
