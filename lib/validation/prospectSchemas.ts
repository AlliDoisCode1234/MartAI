import { z } from 'zod';

export const urlEntrySchema = z.object({
  label: z
    .string()
    .min(2, 'Label is required')
    .max(80, 'Label is too long'),
  value: z
    .string()
    .url('Enter a valid URL (https://...)')
    .max(2048, 'URL is too long'),
});

export const prospectIntakeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  companyName: z.string().min(1, 'Company name is required'),
  monthlyRevenue: z.string().min(1, 'Select a revenue range'),
  marketingFrustration: z
    .string()
    .min(10, 'Share at least 10 characters')
    .max(2000, 'Keep it under 2000 characters'),
  investedBefore: z.enum(['yes', 'no']),
  timeline: z.string().min(1, 'Timeline is required'),
  source: z.string().optional(),
});

export const prospectDetailsSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  topPriority: z
    .string()
    .min(10, 'Share at least 10 characters')
    .max(2000),
  marketingTried: z
    .string()
    .min(10, 'Share at least 10 characters')
    .max(2000),
  goals: z.string().min(10, 'Describe at least 10 characters').max(2000),
  supportNeeds: z
    .array(z.string())
    .min(1, 'Select at least one marketing support need'),
  idealOutcome: z.string().min(10, 'Describe your ideal outcome'),
  additionalNotes: z.string().optional(),
  hearAbout: z.string().min(2, 'Let us know how you heard about us'),
  sendSms: z
    .string()
    .optional()
    .transform((val) => (val?.trim() ? val.trim() : undefined)),
  urls: z
    .array(urlEntrySchema)
    .min(1, 'Add at least one URL we can review')
    .max(10, 'You can submit up to 10 links per prospect'),
});

export const prospectDetailsDraftSchema = prospectDetailsSchema
  .partial()
  .extend({
    urls: z
      .array(
        urlEntrySchema.partial().transform((value) => ({
          label: value.label,
          value: value.value,
        }))
      )
      .optional(),
  });

export type ProspectIntakeValues = z.infer<typeof prospectIntakeSchema>;
export type ProspectDetailsValues = z.infer<typeof prospectDetailsSchema>;
export type UrlEntryValues = z.infer<typeof urlEntrySchema>;

