import { Rna2drawer1 } from './parseRna2drawer1';
import { StrictDrawingInterface as StrictDrawing } from '../../draw/StrictDrawingInterface';
import { pixelsToPoints } from '../../export/pixelsToPoints';

function addTertiaryInteractions(sd: StrictDrawing, rna2drawer1: Rna2drawer1) {
  let seq = sd.drawing.getSequenceById(rna2drawer1.sequenceId);
  if (seq) {
    rna2drawer1.tertiaryInteractions.forEach(ti => {
      let p51 = Math.min(...ti.side1);
      let p31 = Math.max(...ti.side1);
      let p52 = Math.min(...ti.side2);
      let p32 = Math.max(...ti.side2);
      let size1 = p31 - p51 + 1;
      let size2 = p32 - p52 + 1;
      for (let i = 0; i < Math.max(size1, size2); i++) {
        let p1 = Math.min(p51 + i, p31);
        let p2 = Math.max(p32 - i, p52);
        let b5 = seq?.getBaseAtPosition(Math.min(p1, p2));
        let b3 = seq?.getBaseAtPosition(Math.max(p1, p2));
        if (b5 && b3) {
          let tb = sd.drawing.addTertiaryBond(b5, b3);
          tb.setStroke(ti.color.toHex());
          tb.setStrokeWidth(1.5);
          tb.setStrokeOpacity(0.25);
        }
      }
    });
  }
}

function addBaseColors(sd: StrictDrawing, rna2drawer1: Rna2drawer1) {
  let seq = sd.drawing.getSequenceById(rna2drawer1.sequenceId);
  if (seq) {
    seq.forEachBase((b, p) => {
      let color = rna2drawer1.baseColors[p - 1];
      if (color) {
        b.fill = color.toHex();
      }
    });
  }
}

function addBaseOutlines(sd: StrictDrawing, rna2drawer1: Rna2drawer1) {
  let seq = sd.drawing.getSequenceById(rna2drawer1.sequenceId);
  if (seq) {
    seq.forEachBase((b, p) => {
      let outline = rna2drawer1.baseOutlines[p - 1];
      if (outline) {
        let o = b.addCircleOutline();
        o.sendToBack();
        o.radius = outline.relativeRadius * pixelsToPoints(b.fontSize);
        o.stroke = outline.stroke.toHex();
        o.strokeWidth = outline.strokeWidth;
        o.strokeOpacity = outline.strokeOpacity;
        o.fill = outline.fill.toHex();
        o.fillOpacity = outline.fillOpacity;
      }
    });
  }
}

export function addRna2drawer1(sd: StrictDrawing, rna2drawer1: Rna2drawer1) {
  sd.appendStructure({
    id: rna2drawer1.sequenceId,
    characters: rna2drawer1.characters,
    secondaryPartners: rna2drawer1.secondaryStructure.secondaryPartners,
    tertiaryPartners: rna2drawer1.secondaryStructure.tertiaryPartners,
  });
  addTertiaryInteractions(sd, rna2drawer1);
  let seq = sd.drawing.getSequenceById(rna2drawer1.sequenceId);
  if (seq) {
    seq.numberingOffset = rna2drawer1.numberingOffset;
    seq.numberingAnchor = rna2drawer1.numberingAnchor;
    seq.numberingIncrement = rna2drawer1.numberingIncrement;
  }
  sd.drawing.adjustBaseNumbering();
  addBaseColors(sd, rna2drawer1);
  addBaseOutlines(sd, rna2drawer1);
}

export default addRna2drawer1;
