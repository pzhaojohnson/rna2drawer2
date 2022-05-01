import type { App } from 'App';

import { Base } from 'Draw/bases/Base';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

import * as React from 'react';
import { useState } from 'react';
import styles from './EditingTypeSelect.css';

let types = [
  Base,
  PrimaryBond,
  SecondaryBond,
  TertiaryBond,
  BaseNumbering,
];

let typeLabels = new Map<Function, string>();
typeLabels.set(Base, 'Bases');
typeLabels.set(PrimaryBond, 'Primary Bonds');
typeLabels.set(SecondaryBond, 'Secondary Bonds');
typeLabels.set(TertiaryBond, 'Tertiary Bonds');
typeLabels.set(BaseNumbering, 'Numberings');

function CurrentTypeView(
  props: {
    type: Function,
    onClick: () => void,
  },
) {
  return (
    <p className={styles.currentTypeView} onClick={props.onClick} >
      {typeLabels.get(props.type) ?? props.type.name}
    </p>
  );
}

function TypeOption(
  props: {
    type: Function,
    isToggled: boolean;
    onClick: () => void,
    style?: React.CSSProperties,
  },
) {
  return (
    <p
      className={`
        ${styles.typeOption}
        ${props.isToggled ? styles.toggledTypeOption : styles.untoggledTypeOption}
      `}
      onClick={props.onClick}
      style={props.style}
    >
      {typeLabels.get(props.type) ?? props.type.name}
    </p>
  );
}

export type Props = {
  app: App; // a reference to the whole app
};

/**
 * Controls the type of element being edited by the editing tool.
 */
export function EditingTypeSelect(props: Props) {
  let editingTool = props.app.strictDrawingInteraction.editingTool;

  let [isOpen, setIsOpen] = useState(false);

  return (
    !isOpen ? (
      <CurrentTypeView
        type={editingTool.editingType}
        onClick={() => setIsOpen(true)}
      />
    ) : (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <TypeOption
          type={editingTool.editingType}
          isToggled={true}
          onClick={() => setIsOpen(false)}
        />
        {types.filter(t => t != editingTool.editingType).map((t, i) => (
          <TypeOption
            key={i}
            type={t}
            isToggled={false}
            onClick={() => {
              editingTool.editingType = t;
              setIsOpen(false);
            }}
            style={{ marginLeft: '2px' }}
          />
        ))}
      </div>
    )
  );
}
