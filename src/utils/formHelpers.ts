export const sanitizeCommaSeparated = (input: string | undefined): string[] => {
  if (!input) return [];
  return input
    .split(',')
    .map(s => s.trim())
    .filter(s => s !== '');
};