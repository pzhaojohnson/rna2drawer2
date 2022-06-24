export class ValuesWrapper<T> {
  readonly values: T[];

  constructor(values: T[]) {
    this.values = values;
  }

  /**
   * If all values are the same value, returns that value.
   * Otherwise returns undefined.
   *
   * (Uses the Set constructor to differentiate values.)
   *
   * Returns undefined if the array of values is empty.
   */
  get commonValue(): T | undefined {
    let valuesSet = new Set(this.values);

    if (valuesSet.size == 1) {
      return valuesSet.values().next().value;
    } else {
      return undefined;
    }
  }
}
