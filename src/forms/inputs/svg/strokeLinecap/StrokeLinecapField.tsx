import { StrokeLinecapValue } from 'Forms/inputs/svg/strokeLinecap/strokeLinecap';

import * as React from 'react';
import { useState } from 'react';
import styles from './StrokeLinecapField.css';

type Option = {
  value: StrokeLinecapValue;
  textContent: string;
};

let options: Option[] = [
  {
    value: 'butt',
    textContent: 'None',
  },
  {
    value: 'round',
    textContent: 'Round',
  },
  {
    value: 'square',
    textContent: 'Square',
  },
];

type OptionButtonProps = {
  option: Option;
  isToggled: boolean;
  onClick: () => void;
};

function OptionButton(props: OptionButtonProps) {
  return (
    <p
      className={`
        ${styles.optionButton}
        ${props.isToggled ? styles.toggledOptionButton : styles.untoggledOptionButton}
      `}
      onClick={props.onClick}
    >
      {props.option.textContent}
    </p>
  );
}

export type ChangeEvent = {
  target: {
    value: StrokeLinecapValue,
  },
};

export type StrokeLinecapSelectProps = {
  value?: unknown;
  onChange: (event: ChangeEvent) => void;
};

export function StrokeLinecapSelect(props: StrokeLinecapSelectProps) {
  let [value, setValue] = useState(props.value);
  return (
    <div className={styles.strokeLinecapSelect} >
      {options.map((option, i) => (
        <OptionButton
          key={i}
          option={option}
          isToggled={option.value == value}
          onClick={() => {
            setValue(option.value);
            props.onChange({ target: { value: option.value } });
          }}
        />
      ))}
    </div>
  );
}

export type StrokeLinecapFieldProps = StrokeLinecapSelectProps;

export function StrokeLinecapField(props: StrokeLinecapFieldProps) {
  return (
    <div className={styles.strokeLinecapField} >
      <p className={styles.strokeLinecapFieldLabel} >
        Line Cap:
      </p>
      <StrokeLinecapSelect {...props} />
    </div>
  );
}
