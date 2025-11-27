"use client";

import { request } from "@/lib/services/httpClient";
import type { Prospect, ProspectDetail, SubmittedUrl } from "@/types";

export interface ProspectRecord {
  prospect: Prospect;
  detail?: ProspectDetail | null;
  urls?: SubmittedUrl[];
}

export interface ProspectQueryOptions {
  status?: string;
}

export interface RunAnalysisPayload {
  prospectId?: string;
  projectId?: string;
  url?: string;
  force?: boolean;
}

export interface RunAnalysisResponse {
  success: boolean;
  reportId: string;
  keywordIdeasCreated?: number;
  metrics?: Record<string, unknown>;
}

export async function fetchAdminProspects(options: ProspectQueryOptions = {}) {
  const query = options.status ? `?status=${encodeURIComponent(options.status)}` : "";
  return request<{ prospects: ProspectRecord[] }>(
    `/api/admin/prospects${query}`,
  );
}

export async function runMartAiAnalysis(payload: RunAnalysisPayload) {
  return request<RunAnalysisResponse>("/api/ai/analyze", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


