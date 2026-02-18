/**
 * @fileoverview Lightweight test harness — zero dependencies.
 * Works identically in Node ≥ 18 and in the browser.
 * @module test-harness
 */

/** @type {{ passed: number, failed: number, errors: Array<{ suite: string, name: string, error: Error }> }} */
const results = { passed: 0, failed: 0, errors: [] };

let _currentSuite = '';

/**
 * Declare a test suite (for grouping output only).
 * @param {string} name
 * @param {() => void | Promise<void>} fn
 */
export async function describe(name, fn) {
    _currentSuite = name;
    log(`\n▸ ${name}`);
    await fn();
    _currentSuite = '';
}

/**
 * Declare a single test case.
 * @param {string} name
 * @param {() => void | Promise<void>} fn
 */
export async function it(name, fn) {
    try {
        await fn();
        results.passed++;
        log(`  ✓ ${name}`);
    } catch (/** @type {*} */ err) {
        results.failed++;
        results.errors.push({ suite: _currentSuite, name, error: err });
        log(`  ✗ ${name}`);
        log(`    → ${err?.message ?? err}`);
    }
}

/**
 * Assert a condition is truthy.
 * @param {*} value
 * @param {string} [msg]
 */
export function assert(value, msg) {
    if (!value) throw new Error(msg || `Expected truthy, got ${JSON.stringify(value)}`);
}

/**
 * Assert deep equality (JSON-based).
 * @param {*} actual
 * @param {*} expected
 * @param {string} [msg]
 */
assert.equal = function equal(actual, expected, msg) {
    if (actual !== expected) {
        throw new Error(
            msg || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
        );
    }
};

/**
 * Assert deep structural equality via JSON round-trip.
 * @param {*} actual
 * @param {*} expected
 * @param {string} [msg]
 */
assert.deepEqual = function deepEqual(actual, expected, msg) {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) {
        throw new Error(msg || `Deep equal failed.\n  Actual:   ${a}\n  Expected: ${b}`);
    }
};

/**
 * Assert that a value is of a given type.
 * @param {*} value
 * @param {string} type - e.g. 'string', 'number', 'object'
 * @param {string} [msg]
 */
assert.typeOf = function typeOf(value, type, msg) {
    const actual = typeof value;
    if (actual !== type) {
        throw new Error(msg || `Expected type "${type}", got "${actual}"`);
    }
};

/**
 * Print summary and return exit code.
 * @returns {number} 0 if all passed, 1 otherwise
 */
export function summarize() {
    log('\n' + '─'.repeat(40));
    log(`Results: ${results.passed} passed, ${results.failed} failed`);
    if (results.errors.length > 0) {
        log('\nFailures:');
        for (const { suite, name, error } of results.errors) {
            log(`  [${suite}] ${name}`);
            log(`    ${error?.message ?? error}`);
        }
    }
    log('─'.repeat(40));
    return results.failed === 0 ? 0 : 1;
}

/** @returns {{ passed: number, failed: number, errors: Array }} */
export function getResults() {
    return { ...results };
}

// Environment-aware logger
function log(msg) {
    if (typeof document !== 'undefined' && document.getElementById('test-output')) {
        const el = document.getElementById('test-output');
        el.textContent += msg + '\n';
    }
    // Always log to console (works in both Node and browser)
    console.log(msg);
}
