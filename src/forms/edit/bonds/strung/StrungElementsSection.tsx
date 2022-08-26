import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';

import * as React from 'react';

import { IndexSection } from 'Forms/edit/bonds/strung/IndexSection';

import { AddStrungElementButton } from 'Forms/edit/bonds/strung/AddStrungElementButton';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The bonds whose strung elements are to be edited.
   */
  bonds: Bond[];
};

/**
 * A section for editing the strung elements of bonds.
 */
export class StrungElementsSection extends React.Component<Props> {
  render() {
    let strungElementsArrayLengths = this.props.bonds.map(
      bond => bond.strungElements.length
    );

    let minStrungElementsArrayLength = Math.min(...strungElementsArrayLengths);

    let indices: number[] = [];
    for (let i = 0; i < minStrungElementsArrayLength; i++) {
      indices.push(i);
    }

    return (
      <div>
        {indices.map(i => (
          <div key={i} style={{ marginBottom: '24px' }} >
            <IndexSection {...this.props} strungElementsIndex={i} />
          </div>
        ))}
        <AddStrungElementButton {...this.props} />
      </div>
    );
  }
}
