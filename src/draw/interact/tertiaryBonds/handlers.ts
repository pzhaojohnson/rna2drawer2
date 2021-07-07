import { TertiaryBondsInteractionInterface as TertiaryBondsInteraction } from './TertiaryBondsInteractionInterface';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import {
  highlightTertiaryBond,
  dehighlightTertiaryBond,
} from './highlight';

export function handleMouseoverOnTertiaryBond(interaction: TertiaryBondsInteraction, tb: TertiaryBond) {
  interaction.hovered = tb.id;
  if (!interaction.dragging) {
    highlightTertiaryBond(tb);
  }
}

export function handleMouseoutOnTertiaryBond(interaction: TertiaryBondsInteraction, tb: TertiaryBond) {
  interaction.hovered = undefined;
  if (!interaction.selected.has(tb.id)) {
    dehighlightTertiaryBond(tb);
  }
}

export function handleMousedownOnTertiaryBond(interaction: TertiaryBondsInteraction, tb: TertiaryBond) {
  let alreadySelected = interaction.selected.has(tb.id);
  interaction.selected.add(tb.id);
  interaction.dragging = true;
  interaction.dragged = false;
  if (!alreadySelected) {
    interaction.fireChange();
  }
}

export function handleMousedownOnDrawing(interaction: TertiaryBondsInteraction) {
  if (!interaction.hovered && interaction.selected.size > 0) {
    let tbs = interaction.drawing.getTertiaryBondsByIds(interaction.selected);
    tbs.forEach(tb => dehighlightTertiaryBond(tb));
    interaction.selected.clear();
    interaction.dragging = false;
    interaction.dragged = false;
    interaction.fireChange();
  }
}

interface Movement {
  x: number;
  y: number;
}

export function handleMousemove(interaction: TertiaryBondsInteraction, event: MouseEvent, m: Movement) {
  if (interaction.selected.size > 0 && interaction.dragging) {
    let z = interaction.drawing.zoom;
    let shift = {
      x: 2 * m.x / z,
      y: 2 * m.y / z,
    };
    if (Number.isFinite(shift.x) && Number.isFinite(shift.y)) {
      if (!interaction.dragged) {
        interaction.fireShouldPushUndo();
      }
      let tbs = interaction.drawing.getTertiaryBondsByIds(interaction.selected);
      tbs.forEach(tb => tb.shiftControl(shift.x, shift.y));
      interaction.dragged = true;
      interaction.fireChange();
    }
  }
}

export function handleMouseup(interaction: TertiaryBondsInteraction) {
  interaction.dragging = false;
}

export function removeSelected(interaction: TertiaryBondsInteraction) {
  if (interaction.selected.size > 0) {
    interaction.fireShouldPushUndo();
    interaction.selected.forEach(id => {
      interaction.drawing.removeTertiaryBondById(id);
    });
    interaction.selected.clear();
    interaction.fireChange();
  }
}

export function refresh(interaction: TertiaryBondsInteraction) {
  let drawing = interaction.drawing;
  drawing.forEachTertiaryBond(tb => {
    if (tb.id == interaction.hovered || interaction.selected.has(tb.id)) {
      highlightTertiaryBond(tb);
    } else {
      dehighlightTertiaryBond(tb);
    }
  });
  if (interaction.hovered) {
    let tb = drawing.getTertiaryBondById(interaction.hovered);
    if (!tb) {
      interaction.hovered = undefined;
    }
  }
  let toDeselect = [] as string[];
  interaction.selected.forEach(id => {
    let tb = drawing.getTertiaryBondById(id);
    if (!tb) {
      toDeselect.push(id);
    }
  });
  toDeselect.forEach(id => interaction.selected.delete(id));
  interaction.fireChange();
}

export function reset(interaction: TertiaryBondsInteraction) {
  let drawing = interaction.drawing;
  if (interaction.hovered) {
    let tb = drawing.getTertiaryBondById(interaction.hovered);
    if (tb) {
      dehighlightTertiaryBond(tb);
    }
    interaction.hovered = undefined;
  }
  let tbs = drawing.getTertiaryBondsByIds(interaction.selected);
  tbs.forEach(tb => dehighlightTertiaryBond(tb));
  interaction.selected.clear();
  interaction.dragging = false;
  interaction.dragged = false;
  interaction.fireChange();
}
