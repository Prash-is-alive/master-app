/**
 * Common TOON Service
 * 
 * This service provides common TOON (Token-Oriented Object Notation) encoding/decoding
 * functionality that can be used across all modules in the application.
 * 
 * Each module can extend this service with module-specific methods for converting
 * their data structures to/from TOON format.
 */

import { encode, decode, type JsonValue } from '@toon-format/toon';

/**
 * Common TOON Service class
 * Provides base encoding and decoding functionality
 */
export class ToonService {
  /**
   * Encode data to TOON format
   * @param data - The data object to encode
   * @returns TOON formatted string
   */
  static encode(data: unknown): string {
    return encode(data);
  }

  /**
   * Decode TOON format string to data
   * @param toonString - The TOON formatted string
   * @returns Decoded data as JsonValue
   */
  static decode(toonString: string): JsonValue {
    return decode(toonString);
  }
}

/**
 * Default export for convenience
 */
export default ToonService;

