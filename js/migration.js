/**
 * @fileoverview State migration — upgrades persisted data to the current schema.
 * Pure function (except for the optional localStorage side-effect during subject migration).
 * @module migration
 */

import { CONFIG } from './config.js';
import { createInitialState } from './state.js';

/**
 * Migrate a parsed state object to the current schema.
 * Missing top-level keys are filled from {@link createInitialState}.
 *
 * @param {Object} parsed - Raw object from JSON.parse(localStorage)
 * @returns {Object} The migrated state (mutates `parsed` in-place for efficiency)
 */
export function migrateState(parsed) {
    if (!parsed.grades) parsed.grades = { semesters: [] };
    if (!parsed.notifications) parsed.notifications = [];
    if (!parsed._version) parsed._version = '3.0.0';

    // Grading schemes & templates
    if (!parsed.grading) {
        parsed.grading = createInitialState().grading;
    }

    // Flashcards
    if (!parsed.flashcards) {
        parsed.flashcards = createInitialState().flashcards;
    }

    // Topics
    if (!parsed.topics) {
        parsed.topics = [];
    }

    // Focus mode enhancements
    if (parsed.focusMode && !parsed.focusMode.mode) {
        parsed.focusMode = { ...createInitialState().focusMode, ...parsed.focusMode };
    }

    // Wellness insights
    if (!parsed.wellnessInsights) {
        parsed.wellnessInsights = createInitialState().wellnessInsights;
    }

    // Routines
    if (!parsed.routines) {
        parsed.routines = createInitialState().routines;
    }

    // Cycle tracking
    if (!parsed.cycle) {
        parsed.cycle = createInitialState().cycle;
    }

    // Subjects: migrate from string[] → object[]
    if (parsed.subjects && parsed.subjects.length > 0 && typeof parsed.subjects[0] === 'string') {
        const colorKeys = Object.keys(CONFIG.COLORS);
        parsed.subjects = parsed.subjects.map((name, idx) => ({
            id: `subj-migrated-${idx}`,
            name,
            color: colorKeys[idx % colorKeys.length],
            icon: '📘',
            weeklyGoalHours: 5
        }));
        parsed._version = '3.0.0';
    }

    return parsed;
}
