import * as React from 'react';
import { useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import styles from './ColorPicker.css';
import * as SVG from '@svgdotjs/svg.js';
import { PresetColorsList } from './PresetColorsList';
import { interpretColors } from './interpretColors';

let fixedColors = interpretColors([
  '#800000', '#ff0000', '#f5a623', '#fff000', '#c56200', '#8b572a', '#194d33', '#228b22',
  '#7ed321', '#b8e986', '#fda1ff', '#bd10e0', '#9013fe', '#4a148c', '#111dd6', '#009ce0',
  '#73d8ff', '#50e3c2', '#000000', '#4a4a4a', '#9b9b9b', '#d3d3d3', '#ffffff',
]);

let presetColorsPerRow = 8;

let presetColors = new PresetColorsList({
  fixedColors: fixedColors,
  maxRecentColors: (2 * presetColorsPerRow) + (presetColorsPerRow - (fixedColors.length % presetColorsPerRow)),
});

export type Value = {
  color: SVG.Color;
  alpha?: number;
}

function toRgba(v: Value): string {
  return `rgba(${v.color.r}, ${v.color.g}, ${v.color.b}, ${v.alpha ?? 1})`;
}

// returns undefined if unable to convert to a value
function toValue(result: ColorResult): Value | undefined {
  try {
    let rgb = result.rgb;
    return {
      color: new SVG.Color(rgb.r, rgb.g, rgb.b, 'rgb'),
      alpha: rgb.a,
    };
  } catch (error) {
    console.error(error);
    console.error(`Unable to process color result: ${result}.`);
  }
}

type SwatchProps = {
  value?: Value;
  onMouseDown: () => void;
}

function Swatch(props: SwatchProps) {
  return (
    <div
      className={styles.swatch}
      onMouseDown={() => props.onMouseDown()}
    >
      <div
        className={styles.swatchColoring}
        style={{
          background: props.value ? toRgba(props.value) : 'rgba(255,255,255,0)',
        }}
      />
    </div>
  );
}

export type CloseEvent = {
  target: {
    value: Value | undefined;
  }
}

export type Props = {
  value?: Value | SVG.Color;
  onClose?: (event: CloseEvent) => void;
  disableAlpha?: boolean;
}

export function ColorPicker(props: Props) {
  let [value, setValue] = useState<Value | undefined>(
    props.value instanceof SVG.Color ? { color: props.value } : props.value
  );

  let [isOpen, setIsOpen] = useState(false);

  return (
    <div className={isOpen ? styles.isOpen : undefined} >
      <Swatch
        value={value}
        onMouseDown={() => setIsOpen(!isOpen)}
      />
      {!isOpen ? null : (
        <div style={{ position: 'absolute', zIndex: 2 }} >
          <div
            onClick={() => {
              setIsOpen(false);

              if (props.onClose) {
                props.onClose({ target: { value: value } });
              }

              // only on close to avoid remembering too many colors
              if (value) {
                presetColors.remember(value.color);
              }
            }}
            style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
          />
          <div style={{ marginTop: '3px' }} >
            <SketchPicker
              presetColors={presetColors.values().map(c => c.toHex())}
              color={value ? toRgba(value) : undefined}
              onChange={result => {
                let v = toValue(result);
                if (v) {
                  setValue(v);
                }
              }}
              disableAlpha={props.disableAlpha}
            />
          </div>
        </div>
      )}
    </div>
  );
}
