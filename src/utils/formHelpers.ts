//Function to convert Comma separated values into a array of strings for use in a JSON payload.
export const sanitizeCommaSeparated = (input: string | undefined): string[] => {
  if (!input) return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '');
};
