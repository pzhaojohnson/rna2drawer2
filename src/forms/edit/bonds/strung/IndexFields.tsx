import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';

import type { StrungElement } from 'Draw/bonds/strung/StrungElement';
import type { StrungText } from 'Draw/bonds/strung/StrungElement';
import type { StrungCircle } from 'Draw/bonds/strung/StrungElement';
import type { StrungTriangle } from 'Draw/bonds/strung/StrungElement';
import type { StrungRectangle } from 'Draw/bonds/strung/StrungElement';

import { strungElementsAtIndex } from 'Forms/edit/bonds/strung/strungElementsAtIndex';

import * as React from 'react';

import { TypeSelect } from 'Forms/edit/bonds/strung/TypeSelect';

import { TextField } from 'Forms/edit/bonds/strung/TextField';
import { FontFamilySelect } from 'Forms/edit/bonds/strung/FontFamilySelect';
import { FontSizeField } from 'Forms/edit/bonds/strung/FontSizeField';
import { FontWeightField } from 'Forms/edit/bonds/strung/FontWeightField';

import { FillColorField } from 'Forms/edit/bonds/strung/FillColorField';

import { RadiusField } from 'Forms/edit/bonds/strung/RadiusField';

import { WidthField } from 'Forms/edit/bonds/strung/WidthField';
import { HeightField } from 'Forms/edit/bonds/strung/HeightField';

import { TailsHeightField } from 'Forms/edit/bonds/strung/TailsHeightField';

import { BorderRadiusField } from 'Forms/edit/bonds/strung/BorderRadiusField';

import { StrokeColorField } from 'Forms/edit/bonds/strung/StrokeColorField';
import { StrokeWidthField } from 'Forms/edit/bonds/strung/StrokeWidthField';

import { RotationField } from 'Forms/edit/bonds/strung/RotationField';

import { DisplacementFromCenterField } from 'Forms/edit/bonds/strung/DisplacementFromCenterField';
import { DisplacementFromCurveField } from 'Forms/edit/bonds/strung/DisplacementFromCurveField';

function categorizeStrungElements(strungElements: StrungElement[]) {
  let strungTexts: StrungText[] = [];
  let strungCircles: StrungCircle[] = [];
  let strungTriangles: StrungTriangle[] = [];
  let strungRectangles: StrungRectangle[] = [];

  strungElements.forEach(strungElement => {
    if (strungElement.type == 'StrungText') {
      strungTexts.push(strungElement);
    } else if (strungElement.type == 'StrungCircle') {
      strungCircles.push(strungElement);
    } else if (strungElement.type == 'StrungTriangle') {
      strungTriangles.push(strungElement);
    } else if (strungElement.type == 'StrungRectangle') {
      strungRectangles.push(strungElement);
    }
  });

  let haveWidthAndHeight = [...strungTriangles, ...strungRectangles];
  let haveStroke = [...strungCircles, ...strungTriangles, ...strungRectangles];
  let haveRotation = [...strungTriangles, ...strungRectangles];

  return {
    strungTexts,
    strungCircles,
    strungTriangles,
    strungRectangles,
    haveWidthAndHeight,
    haveStroke,
    haveRotation,
  };
}

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

  style?: React.CSSProperties;
};

/**
 * Fields for editing the strung elements at a specified index in the
 * strung elements arrays of bonds.
 */
export function IndexFields(props: Props) {
  let strungElements = strungElementsAtIndex({
    bonds: props.bonds,
    index: props.strungElementsIndex,
  });

  let {
    strungTexts,
    strungCircles,
    strungTriangles,
    strungRectangles,
    haveWidthAndHeight,
    haveStroke,
    haveRotation,
  } = categorizeStrungElements(strungElements);

  let fieldProps = {
    app: props.app,
    strungElements,
    bonds: props.bonds,
    strungElementsIndex: props.strungElementsIndex,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...props.style }} >
      <TypeSelect {...fieldProps} />
      {strungTexts.length < strungElements.length ? null : (
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <TextField {...fieldProps} strungElements={strungTexts} />
          <FontFamilySelect {...fieldProps} strungElements={strungTexts} />
          <FontSizeField {...fieldProps} strungElements={strungTexts} />
          <FontWeightField {...fieldProps} strungElements={strungTexts} />
        </div>
      )}
      <FillColorField {...fieldProps} />
      {strungCircles.length < strungElements.length ? null : (
        <RadiusField {...fieldProps} strungElements={strungCircles} />
      )}
      {haveWidthAndHeight.length < strungElements.length ? null : (
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <WidthField {...fieldProps} strungElements={haveWidthAndHeight} />
          <HeightField {...fieldProps} strungElements={haveWidthAndHeight} />
        </div>
      )}
      {strungTriangles.length < strungElements.length ? null : (
        <TailsHeightField {...fieldProps} strungElements={strungTriangles} />
      )}
      {strungRectangles.length < strungElements.length ? null : (
        <BorderRadiusField {...fieldProps} strungElements={strungRectangles} />
      )}
      {haveStroke.length < strungElements.length ? null : (
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <StrokeColorField {...fieldProps} strungElements={haveStroke} />
          <StrokeWidthField {...fieldProps} strungElements={haveStroke} />
        </div>
      )}
      {haveRotation.length < strungElements.length ? null : (
        <RotationField {...fieldProps} strungElements={haveRotation} />
      )}
      <DisplacementFromCenterField {...fieldProps} />
      <DisplacementFromCurveField {...fieldProps} />
    </div>
  );
}
