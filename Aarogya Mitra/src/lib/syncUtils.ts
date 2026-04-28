/**
 * Utility for retrying asynchronous operations with exponential backoff.
 * @param fn The async function to retry.
 * @param attempts Maximum number of attempts.
 * @param delay Initial delay in milliseconds.
 * @returns The result of the operation.
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  attempts = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (e) {
    if (attempts <= 1) throw e;
    console.warn(`Sync failed, retrying in ${delay}ms... (${attempts - 1} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, attempts - 1, delay * 2);
  }
};

/**
 * Splits an array into smaller chunks.
 * @param array The array to chunk.
 * @param size The size of each chunk.
 * @returns An array of chunks.
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
