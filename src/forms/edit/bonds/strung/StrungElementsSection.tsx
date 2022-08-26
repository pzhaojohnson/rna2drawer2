import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';

import { removeStrungElementsAtIndex } from 'Forms/edit/bonds/strung/removeStrungElementsAtIndex';

import * as React from 'react';

import { IndexSection } from 'Forms/edit/bonds/strung/IndexSection';

import { AddStrungElementButton } from 'Forms/edit/bonds/strung/AddStrungElementButton';

// specifies which index sections are collapsed
let collapsedIndices = new Set<number>();

type IndexSectionHeaderClick = {
  /**
   * The index of the index section.
   */
  index: number;
};

type IndexSectionRemoveButtonClick = {
  /**
   * The index of the index section.
   */
  index: number;
};

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
  state: {
    collapsedIndices: Set<number>;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      collapsedIndices: new Set<number>(collapsedIndices),
    };
  }

  componentWillUnmount() {
    collapsedIndices = new Set(this.state.collapsedIndices);
  }

  handleIndexSectionHeaderClick(event: IndexSectionHeaderClick) {
    let index = event.index;
    let collapsedIndices = new Set(this.state.collapsedIndices);
    if (collapsedIndices.has(index)) {
      collapsedIndices.delete(index);
    } else {
      collapsedIndices.add(index);
    }
    this.setState({ collapsedIndices });
  }

  handleIndexSectionRemoveButtonClick(event: IndexSectionRemoveButtonClick) {
    this.props.app.pushUndo();
    let bonds = this.props.bonds;
    let index = event.index;
    removeStrungElementsAtIndex({ bonds, index });
    this.props.app.refresh();
  }

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
            <IndexSection
              {...this.props}
              strungElementsIndex={i}
              isCollapsed={this.state.collapsedIndices.has(i)}
              onHeaderClick={() => {
                this.handleIndexSectionHeaderClick({ index: i });
              }}
              onRemoveButtonClick={() => {
                this.handleIndexSectionRemoveButtonClick({ index: i });
              }}
            />
          </div>
        ))}
        <AddStrungElementButton {...this.props} />
      </div>
    );
  }
}
