import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { Dropright, trailingBorderStyles } from '../../Dropright';
import { DroppedSeparator } from '../../DroppedSeparator';
import { EditSequenceIdButton } from './EditSequenceIdButton';
import { InsertSubsequenceButton } from './InsertSubsequenceButton';
import { RemoveSubsequenceButton } from './RemoveSubsequenceButton';

interface Props {
  app: App;
}

export function EditSequenceDropright(props: Props): React.ReactElement {
  return (
    <Dropright
      name='Sequence'
      dropped={
        <div>
          <EditSequenceIdButton app={props.app} />
          <DroppedSeparator {...trailingBorderStyles} />
          <InsertSubsequenceButton app={props.app} {...trailingBorderStyles} />
          <RemoveSubsequenceButton app={props.app} {...trailingBorderStyles} />
        </div>
      }
    />
  );
}
