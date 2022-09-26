import * as SVG from '@svgdotjs/svg.js';

import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

import * as React from 'react';
import styles from './StrokeDasharrayField.css';

import { StrokeDasharrayCheckbox } from 'Forms/edit/svg/StrokeDasharrayCheckbox';
import { EditEvent as CheckboxEditEvent } from 'Forms/edit/svg/StrokeDasharrayCheckbox';

import { StrokeDasharrayInput } from 'Forms/edit/svg/StrokeDasharrayInput';
import { EditEvent as InputEditEvent } from 'Forms/edit/svg/StrokeDasharrayInput';

import { StrokeDasharrayInfoLink } from 'Forms/edit/svg/StrokeDasharrayInfoLink';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

export type EditEvent = CheckboxEditEvent | InputEditEvent;

export type BeforeEditEvent = InputEditEvent;

export type Props = {
  /**
   * The SVG elements to edit.
   */
  elements?: SVG.Element[];

  label?: string;

  defaultDashedValue?: string;

  /**
   * Edit events are passed to the callbacks if provided by the
   * underlying components of this field.
   */
  onEdit?: (event: EditEvent) => void;
  onBeforeEdit?: (event?: BeforeEditEvent) => void;

  input?: {
    id?: string;
  };

  style?: React.CSSProperties;
};

export function StrokeDasharrayField(props: Props) {
  let elements = props.elements ?? [];
  let values: unknown[] = elements.map(ele => ele.attr('stroke-dasharray'));

  // make unique since multiple instances of this field may coexist
  let checkboxId = generateHTMLCompatibleUUID();
  let inputId = props.input?.id ?? generateHTMLCompatibleUUID();

  let checkbox = (
    <StrokeDasharrayCheckbox
      id={checkboxId}
      elements={props.elements}
      defaultDashedValue={props.defaultDashedValue}
      onEdit={props.onEdit}
      onBeforeEdit={props.onBeforeEdit}
    />
  );

  let input = (
    elements.length == 0 || values.some(equalsNone) ? (
      null
    ) : (
      <StrokeDasharrayInput
        id={inputId}
        elements={props.elements}
        onEdit={props.onEdit}
        onBeforeEdit={props.onBeforeEdit}
        style={{ margin: '0 0 0 8px' }}
      />
    )
  );

  let infoLink = !input ? null : (
    <div style={{ marginBottom: '5px' }} >
      <StrokeDasharrayInfoLink style={{ padding: '0 7px 5px 5px' }} />
    </div>
  );

  let label = (
    <FieldLabel
      htmlFor={input ? inputId : checkboxId}
      style={{
        paddingLeft: input ? '0' : '6px',
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
