import { redirect } from 'next/navigation';

/**
 * /join Route - Legacy Redirect
 *
 * This route previously served as the standalone waitlist page.
 * Now redirects to the canonical landing page at / to:
 * - Preserve any existing links/bookmarks
 * - Consolidate SEO equity
 * - Reduce maintenance of duplicate content
 *
 * Board Decision: GTM-039 (Feb 3, 2026)
 */
export default function JoinPage() {
  redirect('/');
}
