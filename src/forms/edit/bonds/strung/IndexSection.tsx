import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';

import { strungElementsAtIndex } from 'Forms/edit/bonds/strung/strungElementsAtIndex';

import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { IndexHeader } from 'Forms/edit/bonds/strung/IndexHeader';
import { RemoveStrungElementsButton } from 'Forms/edit/bonds/strung/RemoveStrungElementsButton';

import { IndexFields } from 'Forms/edit/bonds/strung/IndexFields';

let collapsedIndices = new Set<number>();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The bonds containing the strung elements to edit.
   */
  bonds: Bond[];

  /**
   * Strung elements at this index in the strung elements arrays of the
   * bonds are to be edited.
   */
  strungElementsIndex: number;
};

/**
 * Section for editing the strung elements at a specified index in the
 * strung elements arrays of bonds.
 */
export function IndexSection(props: Props) {
  let strungElements = strungElementsAtIndex({
    bonds: props.bonds,
    index: props.strungElementsIndex,
  });

  let [isCollapsed, setIsCollapsed] = useState(
    collapsedIndices.has(props.strungElementsIndex)
  );

  let header = (
    <IndexHeader
      {...props}
      strungElements={strungElements}
      bracketDirection={isCollapsed ? 'right' : 'down'}
      onClick={() => setIsCollapsed(!isCollapsed)}
    />
  );

  let removeButton = (
    <RemoveStrungElementsButton {...props} strungElements={strungElements} />
  );

  let fields = <IndexFields {...props} />;

  useEffect(() => {
    return () => {
      if (isCollapsed) {
        collapsedIndices.add(props.strungElementsIndex);
      } else {
        collapsedIndices.delete(props.strungElementsIndex);
      }
    };
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }} >
        {header}
        {removeButton}
      </div>
      {isCollapsed ? null : fields}
    </div>
  );
}
