import { query, mutation } from '../_generated/server';
import { v } from 'convex/values';
import { getMyOrganizations as getTeamsOrgs } from '../teams/teams';

// ALIAS ENDPOINT TO PREVENT PRODUCTION CRASH
// Production frontend is out of sync and expects organizations/organizations
// This routes those calls appropriately until the frontend is deployed.

export const getMyOrganizations = getTeamsOrgs;
