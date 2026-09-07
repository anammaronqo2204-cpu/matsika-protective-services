/**
 * Edge-safe constants shared between middleware and server code.
 * Must stay free of Node-only imports (node:crypto, next/headers, etc.)
 * so it can be bundled into the Edge runtime.
 */
export const SESSION_COOKIE = "mps_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
