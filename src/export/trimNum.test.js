import { trimNum } from './trimNum';

describe('trimNum function', () => {
  it('number needs trimming', () => {
    let n = 5.1294719287124;
    let trimmed = Number(
      n.toFixed(6)
    );
    expect(trimmed).not.toEqual(n);
    expect(trimNum(n, 6)).toEqual(trimmed);
  });

  it('number does not need trimming', () => {
    let n = 0.12;
    let trimmed = Number(
      n.toFixed(6)
    );
    expect(trimmed).toEqual(n);
    expect(trimNum(n, 6)).toEqual(n);
  });
});
