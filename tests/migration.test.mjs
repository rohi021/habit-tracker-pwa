/**
 * @fileoverview State migration tests.
 * @module migration.test
 */

import { describe, it, assert } from './test-harness.mjs';
import { createInitialState } from '../js/state.js';
import { migrateState } from '../js/migration.js';
import { CONFIG } from '../js/config.js';

export async function migrationTests() {

    await describe('migrateState — missing top-level fields', async () => {
        await it('adds grades when missing', () => {
            const parsed = {};
            migrateState(parsed);
            assert.deepEqual(parsed.grades, { semesters: [] });
        });

        await it('adds notifications when missing', () => {
            const parsed = {};
            migrateState(parsed);
            assert(Array.isArray(parsed.notifications));
            assert.equal(parsed.notifications.length, 0);
        });

        await it('sets _version to 3.0.0 when missing', () => {
            const parsed = {};
            migrateState(parsed);
            assert.equal(parsed._version, '3.0.0');
        });

        await it('preserves existing _version', () => {
            const parsed = { _version: '2.5.0' };
            migrateState(parsed);
            assert.equal(parsed._version, '2.5.0');
        });
    });

    await describe('migrateState — grading', async () => {
        await it('adds default grading when missing', () => {
            const parsed = {};
            migrateState(parsed);
            assert(parsed.grading, 'grading should exist');
            assert.equal(parsed.grading.activeSchemeId, 'default-india-10');
            assert(Array.isArray(parsed.grading.schemes));
            assert(Array.isArray(parsed.grading.templates));
        });

        await it('preserves existing grading', () => {
            const parsed = { grading: { activeSchemeId: 'custom', schemes: [], templates: [] } };
            migrateState(parsed);
            assert.equal(parsed.grading.activeSchemeId, 'custom');
        });
    });

    await describe('migrateState — flashcards', async () => {
        await it('adds default flashcards when missing', () => {
            const parsed = {};
            migrateState(parsed);
            assert(parsed.flashcards, 'flashcards should exist');
            assert(Array.isArray(parsed.flashcards.decks));
            assert(Array.isArray(parsed.flashcards.cards));
        });

        await it('preserves existing flashcards', () => {
            const parsed = { flashcards: { decks: [{ id: 'd1' }], cards: [], reviews: [], ui: {} } };
            migrateState(parsed);
            assert.equal(parsed.flashcards.decks.length, 1);
        });
    });

    await describe('migrateState — topics', async () => {
        await it('adds empty topics when missing', () => {
            const parsed = {};
            migrateState(parsed);
            assert(Array.isArray(parsed.topics));
            assert.equal(parsed.topics.length, 0);
        });
    });

    await describe('migrateState — focusMode', async () => {
        await it('upgrades legacy focusMode without mode field', () => {
            const parsed = { focusMode: { active: true, habitId: 'h1' } };
            migrateState(parsed);
            assert.equal(parsed.focusMode.mode, 'off');
            assert.equal(parsed.focusMode.active, true);
            assert.equal(parsed.focusMode.habitId, 'h1');
        });

        await it('preserves focusMode that already has mode', () => {
            const parsed = { focusMode: { mode: 'deepWork', active: true } };
            migrateState(parsed);
            assert.equal(parsed.focusMode.mode, 'deepWork');
        });
    });

    await describe('migrateState — wellnessInsights', async () => {
        await it('adds default wellnessInsights when missing', () => {
            const parsed = {};
            migrateState(parsed);
            assert(parsed.wellnessInsights, 'wellnessInsights should exist');
            assert(parsed.wellnessInsights.thresholds);
        });
    });

    await describe('migrateState — routines', async () => {
        await it('adds default routines when missing', () => {
            const parsed = {};
            migrateState(parsed);
            assert(parsed.routines);
            assert(Array.isArray(parsed.routines.items));
            assert(Array.isArray(parsed.routines.routineOrder));
        });
    });

    await describe('migrateState — cycle', async () => {
        await it('adds default cycle when missing', () => {
            const parsed = {};
            migrateState(parsed);
            assert(parsed.cycle);
            assert.equal(parsed.cycle.enabled, false);
            assert(Array.isArray(parsed.cycle.periods));
        });
    });

    await describe('migrateState — subjects string→object migration', async () => {
        await it('converts string[] subjects to object[]', () => {
            const parsed = { subjects: ['Math', 'Physics', 'Chemistry'] };
            migrateState(parsed);

            assert.equal(parsed.subjects.length, 3);
            assert.typeOf(parsed.subjects[0], 'object');
            assert.equal(parsed.subjects[0].name, 'Math');
            assert.equal(parsed.subjects[1].name, 'Physics');
            assert.equal(parsed.subjects[2].name, 'Chemistry');
            // each should have required fields
            assert(parsed.subjects[0].id, 'should have id');
            assert(parsed.subjects[0].color, 'should have color');
            assert.equal(parsed.subjects[0].icon, '📘');
            assert.equal(parsed.subjects[0].weeklyGoalHours, 5);
        });

        await it('does not re-migrate object[] subjects', () => {
            const parsed = {
                subjects: [{ id: 's1', name: 'Math', color: 'indigo', icon: '📐', weeklyGoalHours: 10 }]
            };
            migrateState(parsed);
            assert.equal(parsed.subjects[0].id, 's1');
            assert.equal(parsed.subjects[0].icon, '📐');
        });

        await it('handles empty subjects array', () => {
            const parsed = { subjects: [] };
            migrateState(parsed);
            assert.equal(parsed.subjects.length, 0);
        });
    });

    await describe('migrateState — idempotency', async () => {
        await it('running twice produces same result', () => {
            const parsed = { subjects: ['Art'], focusMode: { active: false } };
            migrateState(parsed);
            const snapshot = JSON.stringify(parsed);
            migrateState(parsed);
            assert.equal(JSON.stringify(parsed), snapshot);
        });
    });
}
