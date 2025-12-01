import { NextRequest, NextResponse } from 'next/server';
import { validateApiSecurity } from '@/lib/apiSecurity';
import { secureResponse } from '@/lib/authMiddleware';
import { callConvexMutation, api } from '@/lib/convexClient';
import {
  prospectDetailsSchema,
  prospectDetailsDraftSchema,
} from '@/lib/validation/prospectSchemas';

export const dynamic = 'force-dynamic';

let apiLocal: typeof api = api;
if (typeof window === 'undefined') {
  if (!apiLocal) {
    try {
      apiLocal = require('@/convex/_generated/api')?.api;
    } catch {
      apiLocal = null as any;
    }
  }
}

function getProspectsModule() {
  if (!apiLocal) {
    throw new Error('Convex not configured');
  }
  return (apiLocal as any)['prospects/prospects'];
}

export async function POST(request: NextRequest) {
  try {
    const security = await validateApiSecurity(request, {
      requireOrigin: true,
      allowedMethods: ['POST'],
      allowedContentTypes: ['application/json'],
    });

    if (!security.valid) {
      return secureResponse(
        NextResponse.json({ error: security.error }, { status: 401 })
      );
    }

    const body = await request.json();
    const { prospectId, markCompleted, ...rest } = body;

    if (!prospectId) {
      return secureResponse(
        NextResponse.json({ error: 'prospectId is required' }, { status: 400 })
      );
    }

    const schema = markCompleted ? prospectDetailsSchema : prospectDetailsDraftSchema;
    const payload = schema.parse(rest);

    const prospectsModule = getProspectsModule();

    if (markCompleted) {
      const result = await callConvexMutation(prospectsModule.completeProspectIntake, {
        prospectId,
        ...payload,
      });

      return secureResponse(NextResponse.json(result));
    }

    await callConvexMutation(prospectsModule.saveProspectDetails, {
      prospectId,
      ...payload,
    });

    return secureResponse(
      NextResponse.json({ success: true, prospectId })
    );
  } catch (error: any) {
    console.error('Save prospect details error:', error);
    const message =
      error?.issues?.[0]?.message || error?.message || 'Failed to save prospect details';
    return secureResponse(
      NextResponse.json({ error: message }, { status: 400 })
    );
  }
}

