/**
 * Content Exporters
 *
 * Unified exports for all content export formats.
 * Supports WordPress XML (WXR), CSV, and Markdown.
 */

// WordPress XML exports
export {
  toWordPressXML,
  contentPieceToWXR,
  type WXRItem,
  type WXRExportOptions,
} from './toWordPressXML';

// CSV exports
export {
  toCSV,
  contentPiecesToCSV,
  toShopifyBlogCSV,
  toShopifyPageCSV,
  type CSVRow,
  type CSVExportOptions,
} from './toCSV';

// Markdown exports
export { toMarkdown, contentPieceToMarkdown, type MarkdownExportOptions } from './toMarkdown';

// ============================================================================
// Unified Export Types
// ============================================================================

import type { ExportFormat } from '../constants/integrations';

export interface ContentPieceForExport {
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  contentType: string;
  tags?: string[];
  author?: string;
  publishDate?: Date;
  status?: string;
  createdAt?: number;
}

export interface ExportResult {
  content: string;
  filename: string;
  mimeType: string;
}

// ============================================================================
// Unified Export Function
// ============================================================================

import { contentPieceToWXR } from './toWordPressXML';
import { contentPiecesToCSV, toShopifyBlogCSV, toShopifyPageCSV } from './toCSV';
import { contentPieceToMarkdown } from './toMarkdown';

/**
 * Export content piece(s) in specified format
 */
export function exportContent(
  pieces: ContentPieceForExport | ContentPieceForExport[],
  format: ExportFormat
): ExportResult {
  const pieceArray = Array.isArray(pieces) ? pieces : [pieces];
  const firstPiece = pieceArray[0];
  const baseFilename =
    firstPiece.slug || firstPiece.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  switch (format) {
    case 'wordpress-xml':
      return {
        content: contentPieceToWXR(firstPiece),
        filename: `${baseFilename}.xml`,
        mimeType: 'application/xml',
      };

    case 'csv':
      return {
        content: contentPiecesToCSV(pieceArray),
        filename: pieceArray.length > 1 ? 'content-export.csv' : `${baseFilename}.csv`,
        mimeType: 'text/csv',
      };

    case 'shopify-csv': {
      // Determine if it's blog or page content
      const postTypes = ['blog', 'blogVersus', 'blogVideo', 'contentRefresh'];
      const isBlog = postTypes.includes(firstPiece.contentType);
      return {
        content: isBlog ? toShopifyBlogCSV(pieceArray) : toShopifyPageCSV(pieceArray),
        filename: pieceArray.length > 1 ? 'shopify-export.csv' : `${baseFilename}.csv`,
        mimeType: 'text/csv',
      };
    }

    case 'markdown':
      return {
        content: contentPieceToMarkdown(firstPiece),
        filename: `${baseFilename}.md`,
        mimeType: 'text/markdown',
      };

    case 'json':
      return {
        content: JSON.stringify(pieceArray, null, 2),
        filename: pieceArray.length > 1 ? 'content-export.json' : `${baseFilename}.json`,
        mimeType: 'application/json',
      };

    case 'pdf':
      // PDF export would require a library like puppeteer or pdfkit
      // For now, return HTML that can be printed to PDF
      return {
        content: `<!DOCTYPE html>
<html>
<head>
  <title>${firstPiece.title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    h1 { margin-bottom: 0.5rem; }
    .meta { color: #666; margin-bottom: 2rem; }
  </style>
</head>
<body>
  <h1>${firstPiece.title}</h1>
  <div class="meta">Type: ${firstPiece.contentType} | Status: ${firstPiece.status || 'draft'}</div>
  ${firstPiece.content}
</body>
</html>`,
        filename: `${baseFilename}.html`,
        mimeType: 'text/html',
      };

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Trigger browser download for export
 */
export function downloadExport(result: ExportResult): void {
  const blob = new Blob([result.content], { type: result.mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = result.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
