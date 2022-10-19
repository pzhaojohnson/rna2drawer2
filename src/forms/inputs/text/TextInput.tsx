import * as React from 'react';

import styles from './TextInput.css';

import { measureTextWidth } from 'Utilities/measureTextWidth';

export type FontPropertyName = (
  'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'fontStyle'
);

/**
 * Font properties must be compatible with measureTextWidth function.
 */
export type CSSProperties = (
  Omit<React.CSSProperties, FontPropertyName>
  & { [key in FontPropertyName]?: string }
);

export type Props = {
  id?: string;

  value?: string;

  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  placeholder?: string;
  spellCheck?: boolean | 'true' | 'false';
  style?: CSSProperties;
};

/**
 * A text input element.
 *
 * (Meant to help standardize the CSS styles of text input elements
 * in forms.)
 *
 * By default width is scaled to fit the current value with pixel
 * accuracy.
 *
 * By default also has a min-width of 6ch.
 */
export function TextInput(props: Props) {
  let fontFamily = props.style?.fontFamily ?? '"Open Sans", sans-serif';
  let fontSize = props.style?.fontSize ?? '12px';
  let fontWeight = props.style?.fontWeight ?? '500';
  let fontStyle = props.style?.fontStyle ?? 'normal';

  let width = measureTextWidth({
    text: props.value ?? '',
    fontFamily, fontSize, fontWeight, fontStyle,
  });

  width = Math.ceil(width); // ensure is an integer

  let minWidth = '6ch';

  return (
    <input
      type='text'
      id={props.id}
      className={styles.textInput}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onKeyUp={props.onKeyUp}
      placeholder={props.placeholder}
      spellCheck={props.spellCheck}
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle,
        width: `${width}px`,
        minWidth,
        ...props.style,
      }}
    />
  );
}
