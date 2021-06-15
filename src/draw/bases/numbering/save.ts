import {
  BaseNumberingInterface as BaseNumbering,
  SavableState,
} from './BaseNumberingInterface';

export function savableState(bn: BaseNumbering): SavableState {
  return {
    className: 'BaseNumbering',
    textId: String(bn.text.id()),
    lineId: String(bn.line.id()),
  };
}
