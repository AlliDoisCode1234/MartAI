/**
 * Project Form Types
 *
 * Shared types for project creation forms.
 * Used by NewProjectPage and its child step components.
 */

export interface ProjectFormValues {
  name: string;
  websiteUrl: string;
  industry?: string;
  targetAudience?: string;
  businessGoals?: string;
  competitors?: string;
}
