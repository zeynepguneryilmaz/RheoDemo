
export const logSpace = (start: number, stop: number, num: number): number[] => {
  const logStart = Math.log10(start);
  const logStop = Math.log10(stop);
  const step = (logStop - logStart) / (num - 1);
  return Array.from({ length: num }, (_, i) => Math.pow(10, logStart + i * step));
};

export const linSpace = (start: number, stop: number, num: number): number[] => {
  const step = (stop - start) / (num - 1);
  return Array.from({ length: num }, (_, i) => start + i * step);
};

export const trapezoidArea = (x: number[], y: number[]): number => {
  let area = 0;
  for (let i = 0; i < x.length - 1; i++) {
    area += 0.5 * (y[i] + y[i + 1]) * Math.abs(x[i + 1] - x[i]);
  }
  return area;
};
