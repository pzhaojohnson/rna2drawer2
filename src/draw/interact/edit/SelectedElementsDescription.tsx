import { DrawingElementInterface as DrawingElement } from './DrawingElementInterface';

import { Base } from 'Draw/bases/Base';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import * as React from 'react';
import styles from './SelectedElementsDescription.css';

let singularTypeNames = new Map<Function, string>();
singularTypeNames.set(Base, 'Base');
singularTypeNames.set(BaseNumbering, 'Numbering');
singularTypeNames.set(PrimaryBond, 'Primary Bond');
singularTypeNames.set(SecondaryBond, 'Secondary Bond');
singularTypeNames.set(TertiaryBond, 'Tertiary Bond');

let pluralTypeNames = new Map<Function, string>();
pluralTypeNames.set(Base, 'Bases');
pluralTypeNames.set(BaseNumbering, 'Numberings');
pluralTypeNames.set(PrimaryBond, 'Primary Bonds');
pluralTypeNames.set(SecondaryBond, 'Secondary Bonds');
pluralTypeNames.set(TertiaryBond, 'Tertiary Bonds');

export type Props = {

  // constructor function for the type of element currently being edited
  editingType: Function;

  selectedElements: DrawingElement[];

  style?: {
    margin?: string;
  }
}

// a paragraph element describing the currently selected elements
export function SelectedElementsDescription(props: Props) {
  let filtered = props.selectedElements.filter(ele => ele instanceof props.editingType);
  let n = filtered.length;

  let typeName;
  if (n == 1) {
    typeName = singularTypeNames.get(props.editingType);
  } else {
    typeName = pluralTypeNames.get(props.editingType);
  }
  if (typeName == undefined) {
    typeName = n == 1 ? 'Element' : 'Elements';
  }

  return (
    <p className={styles.selectedElementsDescription} style={props.style} >
      {`${n} ${typeName} selected.`}
    </p>
  );
}
