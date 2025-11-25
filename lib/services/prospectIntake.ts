import type {
  ProspectDetailsValues,
  ProspectIntakeValues,
} from '@/lib/validation/prospectSchemas';

const ACCEPT_HEADER: HeadersInit = {
  Accept: 'application/json',
};

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const hasBody = options.body !== undefined;
  const headers: HeadersInit = {
    ...ACCEPT_HEADER,
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return (data ?? {}) as T;
}

export async function createProspectDraft(
  initial?: Partial<ProspectIntakeValues>,
) {
  return request<{ success: boolean; prospectId: string }>('/api/prospects', {
    method: 'POST',
    body: JSON.stringify({
      ...initial,
      status: initial?.status ?? 'draft',
    }),
  });
}

export async function saveProspectDraft(
  prospectId: string,
  values: Partial<ProspectIntakeValues>,
  options?: { markSubmitted?: boolean },
) {
  return request<{ success: boolean; prospectId: string }>('/api/prospects', {
    method: 'PATCH',
    body: JSON.stringify({
      prospectId,
      ...values,
      ...(options?.markSubmitted ? { markSubmitted: true } : {}),
    }),
  });
}

export async function loadProspectRecord(prospectId: string) {
  return request<{ prospect?: any; detail?: any; urls?: any[] }>(
    `/api/prospects?id=${prospectId}`,
  );
}

export async function saveProspectDetailsDraft(
  prospectId: string,
  values: Partial<ProspectDetailsValues>,
) {
  return request<{ success: boolean; prospectId: string }>(
    '/api/prospect-details',
    {
      method: 'POST',
      body: JSON.stringify({
        prospectId,
        ...values,
      }),
    },
  );
}

export async function submitProspectDetails(
  prospectId: string,
  values: ProspectDetailsValues,
) {
  return request<{
    success: boolean;
    prospect?: any;
    detail?: any;
    urls?: any[];
  }>('/api/prospect-details', {
    method: 'POST',
    body: JSON.stringify({
      prospectId,
      ...values,
      markCompleted: true,
    }),
  });
}

