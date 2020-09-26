import { AppInterface as App } from '../../../AppInterface';
import { TertiaryBondInterface as TertiaryBond } from '../../../draw/QuadraticBezierBondInterface';

export function getSelectedTertiaryBonds(app: App): TertiaryBond[] {
  let drawing = app.strictDrawing.drawing;
  let interaction = app.strictDrawingInteraction.tertiaryBondsInteraction;
  return drawing.getTertiaryBondsByIds(interaction.selected);
}
