import { sha256 } from './hashing';

export function requestHash(input: unknown): string {
  return sha256(JSON.stringify(input));
}
