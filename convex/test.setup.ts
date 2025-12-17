/// <reference types="vite/client" />
/**
 * Convex Test Setup
 *
 * This file exports the modules glob for use with convex-test.
 * Required when tests are outside the convex/ folder.
 *
 * @see https://docs.convex.dev/testing/convex-test#get-started
 */
export const modules = import.meta.glob('./**/!(*.*.*)*.*s');
