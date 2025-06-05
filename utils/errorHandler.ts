export function handleError(error: unknown, defaultMessage: string) {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(defaultMessage);
}
