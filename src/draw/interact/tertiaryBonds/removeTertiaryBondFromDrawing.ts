interface TertiaryBond {
  id: string;
  hasBeenRemoved: () => boolean;
}

interface Drawing {
  removeTertiaryBondById: (id: string) => void;
}

function removeTertiaryBondFromDrawing(tb: TertiaryBond, drawing: Drawing) {
  if (!tb || !drawing) {
    return;
  }
  if (tb.hasBeenRemoved()) {
    return;
  }
  drawing.removeTertiaryBondById(tb.id);
}

export default removeTertiaryBondFromDrawing;
