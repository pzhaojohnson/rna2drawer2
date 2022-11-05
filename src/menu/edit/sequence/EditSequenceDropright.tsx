import * as React from 'react';
import styles from './EditSequenceDropright.css';
import { Dropright } from 'Menu/Dropright';
import { DroppedSeparator } from 'Menu/DroppedSeparator';
import type { App } from 'App';
import { EditSequenceIdButton } from './EditSequenceIdButton';
import { AddSubsequenceButton } from './AddSubsequenceButton';
import { RemoveSubsequenceButton } from './RemoveSubsequenceButton';

export type Props = {
  app: App;
}

export function EditSequenceDropright(props: Props) {
  return (
    <Dropright
      name='Sequence'
      dropped={
        <div style={{ width: '294px', display: 'flex', flexDirection: 'column' }} >
          <div className={styles.topContainer} >
            <EditSequenceIdButton app={props.app} />
          </div>
          <div className={styles.bottomContainer} >
            <DroppedSeparator />
            <AddSubsequenceButton app={props.app} />
            <RemoveSubsequenceButton app={props.app} />
          </div>
        </div>
      }
    />
  );
}
