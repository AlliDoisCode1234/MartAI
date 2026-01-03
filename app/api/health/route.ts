/**
 * Health Check API Endpoint
 *
 * Used for:
 * - Monitoring and uptime checks
 * - OWASP ZAP baseline verification
 * - Deployment verification
 */

import { NextResponse } from 'next/server';

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  environment: string;
  timestamp: string;
  version: string;
}

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  let environment = 'development';
  if (siteUrl.includes('staging')) {
    environment = 'staging';
  } else if (siteUrl.includes('phoo.ai') && !siteUrl.includes('staging')) {
    environment = 'production';
  }

  const response: HealthResponse = {
    status: 'healthy',
    environment,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
