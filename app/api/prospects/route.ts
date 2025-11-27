import { NextRequest, NextResponse } from 'next/server';
import { validateApiSecurity } from '@/lib/apiSecurity';
import { secureResponse } from '@/lib/authMiddleware';
import { callConvexMutation, callConvexQuery, api } from '@/lib/convexClient';
import {
  prospectIntakeSchema,
} from '@/lib/validation/prospectSchemas';

const draftSchema = prospectIntakeSchema.partial();

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
    const module = getProspectsModule();

    const payload = draftSchema.parse(body);

    const prospectId = await callConvexMutation(
      module.createProspect,
      {
        ...payload,
        status: body.status ?? 'draft',
      }
    );

    return secureResponse(
      NextResponse.json({
        success: true,
        prospectId,
      })
    );
  } catch (error: any) {
    console.error('Create prospect error:', error);
    const message =
      error?.issues?.[0]?.message || error?.message || 'Failed to create prospect';
    return secureResponse(
      NextResponse.json({ error: message }, { status: 400 })
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const security = await validateApiSecurity(request, {
      requireOrigin: true,
      allowedMethods: ['PATCH'],
      allowedContentTypes: ['application/json'],
    });

    if (!security.valid) {
      return secureResponse(
        NextResponse.json({ error: security.error }, { status: 401 })
      );
    }

    const body = await request.json();
    const { prospectId, markSubmitted, ...rest } = body;
    if (!prospectId) {
      return secureResponse(
        NextResponse.json({ error: 'prospectId is required' }, { status: 400 })
      );
    }

    const schema = markSubmitted ? prospectIntakeSchema : draftSchema;
    const data = schema.parse(rest);

    const module = getProspectsModule();
    await callConvexMutation(module.updateProspect, {
      prospectId,
      ...data,
      status: markSubmitted ? 'initial_submitted' : undefined,
    });

    return secureResponse(
      NextResponse.json({ success: true, prospectId })
    );
  } catch (error: any) {
    console.error('Update prospect error:', error);
    const message =
      error?.issues?.[0]?.message || error?.message || 'Failed to update prospect';
    return secureResponse(
      NextResponse.json({ error: message }, { status: 400 })
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const security = await validateApiSecurity(request, {
      requireOrigin: true,
      allowedMethods: ['GET'],
    });

    if (!security.valid) {
      return secureResponse(
        NextResponse.json({ error: security.error }, { status: 401 })
      );
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return secureResponse(
        NextResponse.json({ error: 'id query parameter required' }, { status: 400 })
      );
    }

    const module = getProspectsModule();
    const record = await callConvexQuery(module.getProspect, {
      prospectId: id,
    });

    if (!record) {
      return secureResponse(
        NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
      );
    }

    return secureResponse(NextResponse.json(record));
  } catch (error: any) {
    console.error('Fetch prospect error:', error);
    return secureResponse(
      NextResponse.json(
        { error: error?.message || 'Failed to load prospect' },
        { status: 500 }
      )
    );
  }
}

