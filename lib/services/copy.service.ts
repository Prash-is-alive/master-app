/**
 * Common Copy Service
 * 
 * This service provides common copy-to-clipboard functionality that can be used
 * across all modules in the application. It integrates with the TOON service
 * to copy data in TOON format.
 */

import { ToonService } from './toon.service';

/**
 * Copy data to clipboard in TOON format
 * This method uses the common TOON service to encode data before copying.
 * For module-specific transformations (like removing IDs), use the module's
 * specific TOON conversion function and pass the result to copyToClipboard.
 * 
 * @param data - The data object to copy (will be converted to TOON format)
 * @returns Promise that resolves when copy is successful, rejects on error
 */
export async function copyToClipboardAsToon<T>(data: T): Promise<void> {
  try {
    const toonString = ToonService.encode(data);
    await navigator.clipboard.writeText(toonString);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
}

/**
 * Copy plain text or pre-formatted TOON string to clipboard
 * Use this when you've already converted data to TOON format using module-specific functions
 * 
 * @param text - The text string to copy (can be TOON formatted string or plain text)
 * @returns Promise that resolves when copy is successful, rejects on error
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
}

