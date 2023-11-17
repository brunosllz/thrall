export function capitalizeFirstLetter(value: string) {
  if (typeof value !== 'string') {
    return 'Invalid input. Please provide a valid string.';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}
