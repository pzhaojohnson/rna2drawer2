import type { App } from 'App';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import { Values } from 'Draw/bonds/straight/values';
import { values } from 'Draw/bonds/straight/values';

import { isDot } from 'Draw/bonds/straight/dotify';
import { dotify } from 'Draw/bonds/straight/dotify';

import { isSquare } from 'Draw/bonds/straight/dotify';
import { squarify } from 'Draw/bonds/straight/dotify';

import * as React from 'react';
import styles from './ShapeField.css';
import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

/**
 * Updates the recommended defaults for values that control the shape
 * of a secondary bond and that are different from the given previous
 * values. (Updates recommended defaults for basePadding1, basePadding2,
 * line stroke-linecap and line stroke-width.)
 *
 * (Updates recommended defaults for secondary bonds of the same type
 * as the given secondary bond.)
 */
function updateRecommendedDefaultsForChangedValues(secondaryBond: SecondaryBond, prevValues: Values) {
  let recommendedDefaults = SecondaryBond.recommendedDefaults[secondaryBond.type];
  let currValues = values(secondaryBond);

  if (currValues.basePadding1 != prevValues.basePadding1) {
    recommendedDefaults.basePadding1 = currValues.basePadding1;
  }
  if (currValues.basePadding2 != prevValues.basePadding2) {
    recommendedDefaults.basePadding2 = currValues.basePadding2;
  }
  if (currValues.line['stroke-linecap'] != prevValues.line['stroke-linecap']) {
    recommendedDefaults.line['stroke-linecap'] = currValues.line['stroke-linecap'];
  }
  if (currValues.line['stroke-width'] != prevValues.line['stroke-width']) {
    recommendedDefaults.line['stroke-width'] = currValues.line['stroke-width'];
  }
}

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

        props.secondaryBonds.forEach(sb => {
          let prevValues = values(sb);

          let basePadding = baseSize * (6 / 13.5);
          sb.basePadding1 = basePadding;
          sb.basePadding2 = basePadding;
          sb.line.attr('stroke-linecap', 'butt');

          updateRecommendedDefaultsForChangedValues(sb, prevValues);
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
        props.secondaryBonds.forEach(sb => {
          let prevValues = values(sb);
          dotify(sb);
          updateRecommendedDefaultsForChangedValues(sb, prevValues);
        });
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
        props.secondaryBonds.forEach(sb => {
          let prevValues = values(sb);
          squarify(sb);
          updateRecommendedDefaultsForChangedValues(sb, prevValues);
        });
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
