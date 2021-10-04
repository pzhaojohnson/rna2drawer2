import * as React from 'react';
import { useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import styles from './ColorPicker.css';
import * as SVG from '@svgdotjs/svg.js';
import { parseColors } from './parseColors';
import { FiniteList } from './FiniteList';

const colorsPerRow = 8;

let fixedColors = parseColors([
  '#800000', '#FF0000', '#F5A623', '#FFF000', '#C56200', '#8B572A', '#194D33', '#228B22',
  '#7ED321', '#B8E986', '#FDA1FF', '#BD10E0', '#9013FE', '#4A148C', '#111DD6', '#009CE0',
  '#73D8FF', '#50E3C2', '#000000', '#4A4A4A', '#9B9B9B', '#D3D3D3', '#FFFFFF',
]);

let recentColors = new FiniteList<SVG.Color>(
  (2 * colorsPerRow) + (colorsPerRow - (fixedColors.length % colorsPerRow))
);

export type Value = {
  color: SVG.Color;
  alpha?: number;
}

function valuesAreEqual(v1: Value, v2: Value): boolean {
  return (
    v1.color.toHex() == v2.color.toHex()
    && v1.alpha == v2.alpha
  );
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
  value: Value;
  onClick: () => void;
}

function Swatch(props: SwatchProps) {
  return (
    <div
      className={styles.swatch}
      onClick={() => props.onClick()}
    >
      <div
        className={styles.swatchColoring}
        style={{ background: toRgba(props.value) }}
      />
    </div>
  );
}

export type Props = {
  value: Value;
  onChange?: (v: Value) => void;
  onChangeComplete?: (v: Value) => void;
  disableAlpha?: boolean;
}

export function ColorPicker(props: Props) {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div style={{ display: 'inline-block' }} >
        <Swatch
          value={props.value}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {!isOpen ? null : (
        <div style={{ position: 'absolute', zIndex: 2 }} >
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
          />
          <SketchPicker
            presetColors={fixedColors.concat(recentColors.values()).map(c => c.toHex())}
            color={toRgba(props.value)}
            onChange={result => {
              if (props.onChange) {
                let v = toValue(result);
                if (v) {
                  props.onChange(v);
                }
              }
            }}
            onChangeComplete={result => {
              if (props.onChangeComplete) {
                let v = toValue(result);
                if (v) {
                  props.onChangeComplete(v);

                  // only on change complete to avoid remembering too many recent colors
                  recentColors.push(v.color);
                }
              }
            }}
            disableAlpha={props.disableAlpha}
          />
        </div>
      )}
    </div>
  );
}
