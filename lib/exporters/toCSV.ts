/**
 * CSV Exporter
 *
 * Generates CSV format for content export.
 * Compatible with:
 * - Shopify bulk import apps (Magefan, BulkFlow)
 * - Spreadsheet applications (Excel, Google Sheets)
 * - Generic CMS import tools
 */

export interface CSVRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface CSVExportOptions {
  rows: CSVRow[];
  columns?: string[];
  includeHeader?: boolean;
}

/**
 * Escape a CSV field value
 */
function escapeCSVField(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  // If contains comma, newline, or quote, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Generate CSV from rows
 */
export function toCSV(options: CSVExportOptions): string {
  const { rows, includeHeader = true } = options;

  if (rows.length === 0) {
    return '';
  }

  // Determine columns from first row or use provided columns
  const columns = options.columns || Object.keys(rows[0]);

  const lines: string[] = [];

  // Add header row
  if (includeHeader) {
    lines.push(columns.map(escapeCSVField).join(','));
  }

  // Add data rows
  rows.forEach((row) => {
    const values = columns.map((col) => escapeCSVField(row[col]));
    lines.push(values.join(','));
  });

  return lines.join('\n');
}

/**
 * Convert content pieces to generic CSV
 */
export function contentPiecesToCSV(
  pieces: Array<{
    title: string;
    content: string;
    excerpt?: string;
    slug?: string;
    contentType: string;
    status?: string;
    createdAt?: number;
  }>
): string {
  const rows = pieces.map((piece) => ({
    title: piece.title,
    slug: piece.slug || piece.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    content_type: piece.contentType,
    status: piece.status || 'draft',
    excerpt: piece.excerpt || '',
    content: piece.content,
    created_at: piece.createdAt ? new Date(piece.createdAt).toISOString() : '',
  }));

  return toCSV({
    rows,
    columns: ['title', 'slug', 'content_type', 'status', 'excerpt', 'content', 'created_at'],
  });
}

/**
 * Shopify-specific CSV format for blog posts
 * Compatible with Magefan Blog App and Blog Importer
 */
export function toShopifyBlogCSV(
  pieces: Array<{
    title: string;
    content: string;
    excerpt?: string;
    slug?: string;
    tags?: string[];
    author?: string;
    publishDate?: Date;
  }>
): string {
  const rows = pieces.map((piece) => ({
    Title: piece.title,
    Handle: piece.slug || piece.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    'Body HTML': piece.content,
    Excerpt: piece.excerpt || '',
    Author: piece.author || 'Admin',
    Tags: piece.tags?.join(', ') || '',
    Published: 'true',
    'Published At': piece.publishDate ? piece.publishDate.toISOString() : new Date().toISOString(),
  }));

  return toCSV({
    rows,
    columns: [
      'Title',
      'Handle',
      'Body HTML',
      'Excerpt',
      'Author',
      'Tags',
      'Published',
      'Published At',
    ],
  });
}

/**
 * Shopify-specific CSV format for pages
 * Compatible with BulkFlow and similar apps
 */
export function toShopifyPageCSV(
  pieces: Array<{
    title: string;
    content: string;
    slug?: string;
  }>
): string {
  const rows = pieces.map((piece) => ({
    Title: piece.title,
    Handle: piece.slug || piece.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    'Body HTML': piece.content,
    Published: 'true',
  }));

  return toCSV({
    rows,
    columns: ['Title', 'Handle', 'Body HTML', 'Published'],
  });
}
