export const toDMS = (degrees = 0) => {
  const d = Math.floor(degrees);
  const m = Math.floor((degrees - d) * 60);
  const s = (degrees - d - m / 60) * 3600;

  return `${d}° ${Math.abs(m)}' ${Math.round(Number(s))}"`;
};
