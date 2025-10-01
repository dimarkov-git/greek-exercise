/**
 * Testing utilities for MSW
 *
 * This module is specifically for testing and should only be imported in test files.
 * It's separated from the main API module to avoid bundling msw/node in browser builds.
 *
 * @module shared/api/testing
 */

import {createServer as createServerImpl} from './testing-server'

export const createServer = createServerImpl
