/**
 * MSW Server Setup for Vitest
 *
 * Configures Mock Service Worker for Node.js environment.
 * Includes handlers for WordPress, Shopify, and Wix APIs.
 */

import { setupServer } from 'msw/node';
import { wordPressHandlers } from './wordpress.handlers';
import { shopifyHandlers } from './shopify.handlers';
import { wixHandlers } from './wix.handlers';

// Create MSW server with all platform handlers
export const mswServer = setupServer(...wordPressHandlers, ...shopifyHandlers, ...wixHandlers);

// Export handlers for extending in specific tests
export { wordPressHandlers, shopifyHandlers, wixHandlers };
