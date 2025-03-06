export function truncateString(input: string, maxLength: number = 75): string {
  if (input.length <= maxLength) {
    return input;
  }
  return input.substring(0, maxLength) + "...";
}
