import * as SVG from '@svgdotjs/svg.js';

import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

import * as React from 'react';
import styles from './StrokeDasharrayField.css';

import { StrokeDasharrayCheckbox } from 'Forms/edit/svg/StrokeDasharrayCheckbox';

import { StrokeDasharrayInput } from 'Forms/edit/svg/StrokeDasharrayInput';
import { EditEvent } from 'Forms/edit/svg/StrokeDasharrayInput';

import { StrokeDasharrayInfoLink } from 'Forms/edit/svg/StrokeDasharrayInfoLink';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

const checkboxId = 'stroke-dasharray-checkbox';
const inputId = 'stroke-dasharray-input';

export type Props = {
  /**
   * The SVG elements to edit.
   */
  elements?: SVG.Element[];

  label?: string;

  /**
   * Edit events are passed to the callbacks if provided by the
   * underlying components of this field.
   */
  onEdit?: (event?: EditEvent) => void;
  onBeforeEdit?: (event?: EditEvent) => void;

  style?: React.CSSProperties;
};

export function StrokeDasharrayField(props: Props) {
  let elements = props.elements ?? [];
  let values: unknown[] = elements.map(ele => ele.attr('stroke-dasharray'));

  let checkbox = (
    <StrokeDasharrayCheckbox
      id={checkboxId}
      elements={props.elements}
      onEdit={props.onEdit}
      onBeforeEdit={props.onBeforeEdit}
    />
  );

  let input = (
    elements.length == 0 || values.every(equalsNone) ? (
      null
    ) : (
      <StrokeDasharrayInput
        id={inputId}
        elements={props.elements}
        onEdit={props.onEdit}
        onBeforeEdit={props.onBeforeEdit}
        style={{ margin: '0 5px 0 8px' }}
      />
    )
  );

  let infoLink = !input ? null : (
    <div style={{ marginBottom: '6px' }} >
      <StrokeDasharrayInfoLink />
    </div>
  );

  let label = (
    <FieldLabel
      htmlFor={input ? inputId : checkboxId}
      style={{
        paddingLeft: input ? '7px' : '6px',
        cursor: input ? 'text' : 'pointer',
      }}
    >
      {props.label}
    </FieldLabel>
  );

  return (
    <div className={styles.strokeDasharrayField} style={props.style} >
      {checkbox}
      {input}
      {infoLink}
      {label}
    </div>
  );
}
