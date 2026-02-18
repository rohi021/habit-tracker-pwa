#!/usr/bin/env node
/**
 * @fileoverview Node CLI test runner — zero external dependencies.
 * Usage:  node tests/run-tests.mjs
 * @module run-tests
 */

import { summarize } from './test-harness.mjs';
import { reducerTests } from './reducer.test.mjs';
import { migrationTests } from './migration.test.mjs';

// Polyfill crypto.randomUUID for Node < 19 if needed
if (typeof globalThis.crypto === 'undefined') {
    const { webcrypto } = await import('node:crypto');
    globalThis.crypto = webcrypto;
}

console.log('StudentOS — Test Suite');
console.log('='.repeat(40));

await reducerTests();
await migrationTests();

const exitCode = summarize();
process.exit(exitCode);
