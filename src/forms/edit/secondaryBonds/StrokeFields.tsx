import * as React from 'react';
import { SecondaryBondInterface as SecondaryBond } from '../../../draw/StraightBondInterface';
import { ColorField } from '../../fields/color/ColorField';
import { FieldProps as SpecificFieldProps } from './FieldProps';
import { getAtIndex } from '../../../array/getAtIndex';
import { parseColor } from '../../../parse/parseColor';

interface GeneralFieldProps {
  name: string;
  getBonds: () => SecondaryBond[];
  pushUndo: () => void;
  changed: () => void;
}

function StrokeField(props: GeneralFieldProps): React.ReactElement | null {
  let bs = props.getBonds();
  if (bs.length == 0) {
    return null;
  } else {
    let first = getAtIndex(bs, 0);
    let firstStroke = first ? parseColor(first.stroke) : undefined;
    return (
      <ColorField
        name={props.name}
        initialValue={firstStroke ? { color: firstStroke.toHex(), opacity: 1 } : undefined}
        set={co => {
          let s = parseColor(co.color);
          if (s) {
            let bs = props.getBonds();
            if (bs.length > 0) {
              let first = getAtIndex(bs, 0);
              let firstStroke = first ? parseColor(first.stroke) : undefined;
              if (!firstStroke || s.toHex() != firstStroke.toHex()) {
                props.pushUndo();
                bs.forEach(b => {
                  if (s) {
                    b.stroke = s.toHex();
                  }
                });
                props.changed();
              }
            }
          }
        }}
        disableAlpha={true}
      />
    );
  }
}

export function AutStrokeField(props: SpecificFieldProps): React.ReactElement | null {
  return (
    <StrokeField
      name='AUT Color'
      getBonds={() => props.getSecondaryBondsByType().aut}
      pushUndo={props.pushUndo}
      changed={props.changed}
    />
  );
}

export function GcStrokeField(props: SpecificFieldProps): React.ReactElement | null {
  return (
    <StrokeField
      name='GC Color'
      getBonds={() => props.getSecondaryBondsByType().gc}
      pushUndo={props.pushUndo}
      changed={props.changed}
    />
  );
}

export function GutStrokeField(props: SpecificFieldProps): React.ReactElement | null {
  return (
    <StrokeField
      name='GUT Color'
      getBonds={() => props.getSecondaryBondsByType().gut}
      pushUndo={props.pushUndo}
      changed={props.changed}
    />
  );
}

export function OtherStrokeField(props: SpecificFieldProps): React.ReactElement | null {
  return (
    <StrokeField
      name='Noncanonical Color'
      getBonds={() => props.getSecondaryBondsByType().other}
      pushUndo={props.pushUndo}
      changed={props.changed}
    />
  );
}
