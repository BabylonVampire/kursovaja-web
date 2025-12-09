export const generateAvatarColor = (name: string) => {
  if (!name) return '#4a6da7';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360;
  const s = 70 + (hash % 15);
  const l = 50 + (hash % 10);

  return `hsl(${h}, ${s}%, ${l}%)`;
};
