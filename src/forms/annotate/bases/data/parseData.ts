export function parseData(rawData: string): number[] | undefined {
  let data = [] as number[];
  let allParsable = true;
  rawData.split(/[,|\s]/).forEach(v => {
    v = v.trim();
    if (v) {
      let n = Number(v);
      if (Number.isFinite(n)) {
        data.push(n);
      } else {
        allParsable = false;
      }
    }
  });
  return allParsable ? data : undefined;
}
