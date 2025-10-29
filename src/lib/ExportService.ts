/**
 * Alpha Issue 11: Export Bundle (ZIP)
 * Service for exporting journal data as ZIP bundle
 */

import type { JournalEntry } from './JournalService';

export interface ExportOptions {
  entries: JournalEntry[];
  includeScreenshots: boolean;
  includeShareCard: boolean;
}

/**
 * Create ZIP bundle with CSV and PNG share cards
 * Target: <800ms p95
 *
 * TODO (Issue 11 implementation):
 * - Generate CSV from entries
 * - Create PNG share cards
 * - Pre-scale large images
 * - Bundle into ZIP
 * - Use JSZip or similar library
 */
export async function createExportBundle(
  options: ExportOptions
): Promise<Blob> {
  // TODO: Implement ZIP bundling
  throw new Error('Not implemented - Issue 11');
}

/**
 * Generate PNG share card for a journal entry
 * Dimensions: 1200x630 (Open Graph standard)
 */
export async function generateShareCard(entry: JournalEntry): Promise<Blob> {
  // TODO: Implement share card generation
  // Use canvas API or similar
  throw new Error('Not implemented - Issue 11');
}

/**
 * Validate and optimize image size
 * Max dimensions: 2048x2048
 */
export async function optimizeImage(blob: Blob): Promise<Blob> {
  // TODO: Implement image optimization
  throw new Error('Not implemented - Issue 11');
}
