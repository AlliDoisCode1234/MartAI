import { redirect } from 'next/navigation';

/**
 * Studio Index Page
 *
 * Redirects to the Library page, which is now the default landing page
 * for the Content Studio after the sidebar consolidation.
 */
export default function StudioPage() {
  redirect('/studio/library');
}
