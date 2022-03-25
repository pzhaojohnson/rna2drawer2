import type { App } from 'App';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { DrawingElementInterface as DrawingElement } from './DrawingElementInterface';

import { Base } from 'Draw/bases/Base';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import * as React from 'react';

import { EditBases } from 'Forms/edit/bases/EditBases';
import { EditBaseNumberings } from 'Forms/edit/bases/numberings/EditBaseNumberings';
import { EditPrimaryBonds } from 'Forms/edit/bonds/primary/EditPrimaryBonds';
import { EditSecondaryBonds } from 'Forms/edit/bonds/secondary/EditSecondaryBonds';
import { EditTertiaryBonds } from 'Forms/edit/bonds/tertiary/EditTertiaryBonds';

function filterBases(eles: DrawingElement[]): Base[] {
  let bs: Base[] = [];
  eles.forEach(ele => {
    if (ele instanceof Base) {
      bs.push(ele);
    }
  });
  return bs;
}

function filterBaseNumberings(eles: DrawingElement[]): BaseNumbering[] {
  let bns: BaseNumbering[] = [];
  eles.forEach(ele => {
    if (ele instanceof BaseNumbering) {
      bns.push(ele);
    }
  });
  return bns;
}

function filterPrimaryBonds(eles: DrawingElement[]): PrimaryBond[] {
  let pbs: PrimaryBond[] = [];
  eles.forEach(ele => {
    if (ele instanceof PrimaryBond) {
      pbs.push(ele);
    }
  });
  return pbs;
}

function filterSecondaryBonds(eles: DrawingElement[]): SecondaryBond[] {
  let sbs: SecondaryBond[] = [];
  eles.forEach(ele => {
    if (ele instanceof SecondaryBond) {
      sbs.push(ele);
    }
  });
  return sbs;
}

function filterTertiaryBonds(eles: DrawingElement[]): TertiaryBond[] {
  let tbs: TertiaryBond[] = [];
  eles.forEach(ele => {
    if (ele instanceof TertiaryBond) {
      tbs.push(ele);
    }
  });
  return tbs;
}

export type Props = {
  unmount: () => void;
  history: FormHistoryInterface;

  // a reference to the whole app
  app: App;

  // constructor function for the type of element being edited
  editingType: Function;

  // the elements to edit
  // (only elements of the specified editing type will be edited)
  elements: DrawingElement[];
}

// returns null for an unrecognized editing type
export function EditingForm(props: Props) {
  if (props.editingType == Base) {
    return <EditBases {...props} bases={filterBases(props.elements)} />;
  } else if (props.editingType == BaseNumbering) {
    return <EditBaseNumberings {...props} baseNumberings={filterBaseNumberings(props.elements)} />
  } else if (props.editingType == PrimaryBond) {
    return <EditPrimaryBonds {...props} primaryBonds={filterPrimaryBonds(props.elements)} />
  } else if (props.editingType == SecondaryBond) {
    return <EditSecondaryBonds {...props} secondaryBonds={filterSecondaryBonds(props.elements)} />
  } else if (props.editingType == TertiaryBond) {
    return <EditTertiaryBonds {...props} tertiaryBonds={filterTertiaryBonds(props.elements)} />
  } else {
    return null;
  }
}
