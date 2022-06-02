import type { App } from 'App';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import { isDot } from 'Draw/bonds/straight/dotify';
import { dotify } from 'Draw/bonds/straight/dotify';

import { isSquare } from 'Draw/bonds/straight/dotify';
import { squarify } from 'Draw/bonds/straight/dotify';

import * as React from 'react';
import styles from './ShapeField.css';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

export type Props = {
  app: App; // a reference to the whole app

  secondaryBonds: SecondaryBond[]; // the secondary bonds to edit
};

function LineOption(props: Props) {
  let strictDrawing = props.app.strictDrawing;

  let isToggled = (
    props.secondaryBonds.every(sb => !isDot(sb))
    && props.secondaryBonds.every(sb => !isSquare(sb))
  );

  return (
    <p
      className={`
        ${styles.shapeOption}
        ${isToggled ? styles.toggledShapeOption : styles.untoggledShapeOption}
      `}
      onClick={() => {
        if (isToggled) {
          return; // do nothing
        }

        props.app.pushUndo();

        // how big bases are approximately
        let baseSize = (strictDrawing.baseWidth + strictDrawing.baseHeight) / 2;

        let basePadding = baseSize * (6 / 13.5);
        props.secondaryBonds.forEach(sb => {
          sb.basePadding1 = basePadding;
          sb.basePadding2 = basePadding;
          sb.line.attr('stroke-linecap', 'butt');
        });

        props.app.refresh();
      }}
    >
      Line
    </p>
  );
}

function DotOption(props: Props) {
  let isToggled = props.secondaryBonds.every(sb => isDot(sb));

  return (
    <p
      className={`
        ${styles.shapeOption}
        ${isToggled ? styles.toggledShapeOption : styles.untoggledShapeOption}
      `}
      onClick={() => {
        if (isToggled) {
          return; // do nothing
        }

        props.app.pushUndo();
        props.secondaryBonds.forEach(sb => dotify(sb));
        props.app.refresh();
      }}
    >
      Dot
    </p>
  );
}

function SquareOption(props: Props) {
  let isToggled = props.secondaryBonds.every(sb => isSquare(sb));

  return (
    <p
      className={`
        ${styles.shapeOption}
        ${isToggled ? styles.toggledShapeOption : styles.untoggledShapeOption}
      `}
      onClick={() => {
        if (isToggled) {
          return; // do nothing
        }

        props.app.pushUndo();
        props.secondaryBonds.forEach(sb => squarify(sb));
        props.app.refresh();
      }}
    >
      Square
    </p>
  );
}

export function ShapeField(props: Props) {
  return (
    <div className={styles.shapeField} >
      <FieldLabel>
        Shape:
      </FieldLabel>
      <div className={styles.labelSpacer} />
      <LineOption {...props} />
      <div className={styles.optionsSpacer} />
      <DotOption {...props} />
      <div className={styles.optionsSpacer} />
      <SquareOption {...props} />
    </div>
  );
}
