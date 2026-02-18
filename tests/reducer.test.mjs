/**
 * @fileoverview Deterministic reducer tests.
 * @module reducer.test
 */

import { describe, it, assert } from './test-harness.mjs';
import { createInitialState, ActionTypes, appReducer } from '../js/state.js';

export async function reducerTests() {

    await describe('createInitialState', async () => {
        await it('returns an object with expected top-level keys', () => {
            const state = createInitialState();
            assert.typeOf(state, 'object');
            assert(Array.isArray(state.habitOrder), 'habitOrder should be an array');
            assert.typeOf(state.habits, 'object');
            assert.equal(state.view, 'dashboard');
            assert.equal(state.isLoading, true);
            assert.equal(state.xp, 0);
            assert.equal(state.level, 1);
            assert.equal(state._version, '3.0.0');
        });

        await it('returns a fresh object each call (no shared references)', () => {
            const a = createInitialState();
            const b = createInitialState();
            assert(a !== b, 'should be different objects');
            assert(a.habits !== b.habits);
        });
    });

    await describe('ActionTypes', async () => {
        await it('is frozen', () => {
            assert(Object.isFrozen(ActionTypes), 'ActionTypes should be frozen');
        });

        await it('contains expected action types', () => {
            assert.equal(ActionTypes.ADD_HABIT, 'ADD_HABIT');
            assert.equal(ActionTypes.TOGGLE_HABIT, 'TOGGLE_HABIT');
            assert.equal(ActionTypes.UNDO, 'UNDO');
            assert.equal(ActionTypes.REDO, 'REDO');
            assert.equal(ActionTypes.LOAD_STATE, 'LOAD_STATE');
            assert.equal(ActionTypes.RESET_STATE, 'RESET_STATE');
        });
    });

    await describe('appReducer — ADD_HABIT', async () => {
        await it('adds a habit and returns new state', () => {
            const state = createInitialState();
            const next = appReducer(state, {
                type: ActionTypes.ADD_HABIT,
                payload: { name: 'Meditate', color: 'purple', category: 'Mindfulness' }
            });

            const ids = Object.keys(next.habits);
            assert.equal(ids.length, 1);
            assert.equal(next.habits[ids[0]].name, 'Meditate');
            assert.equal(next.habits[ids[0]].color, 'purple');
            assert.equal(next.habitOrder.length, 1);
        });

        await it('pushes onto undo stack', () => {
            const state = createInitialState();
            const next = appReducer(state, {
                type: ActionTypes.ADD_HABIT,
                payload: { name: 'Run' }
            });
            assert.equal(next.undoStack.length, 1);
            assert.deepEqual(next.redoStack, []);
        });
    });

    await describe('appReducer — TOGGLE_HABIT', async () => {
        await it('marks a habit as done for today', () => {
            let state = createInitialState();
            state = appReducer(state, {
                type: ActionTypes.ADD_HABIT,
                payload: { name: 'Read' }
            });
            const id = Object.keys(state.habits)[0];
            const today = new Date().toISOString().split('T')[0];

            const toggled = appReducer(state, {
                type: ActionTypes.TOGGLE_HABIT,
                payload: { id, date: today }
            });

            assert.equal(toggled.habits[id].data[today], true);
        });

        await it('un-marks a habit when toggled again', () => {
            let state = createInitialState();
            state = appReducer(state, {
                type: ActionTypes.ADD_HABIT,
                payload: { name: 'Read' }
            });
            const id = Object.keys(state.habits)[0];
            const today = new Date().toISOString().split('T')[0];

            let toggled = appReducer(state, {
                type: ActionTypes.TOGGLE_HABIT,
                payload: { id, date: today }
            });
            toggled = appReducer(toggled, {
                type: ActionTypes.TOGGLE_HABIT,
                payload: { id, date: today }
            });

            assert(!toggled.habits[id].data[today], 'should be untoggled');
        });
    });

    await describe('appReducer — UPDATE_HABIT', async () => {
        await it('updates habit name and color', () => {
            let state = createInitialState();
            state = appReducer(state, {
                type: ActionTypes.ADD_HABIT,
                payload: { name: 'Old Name', color: 'indigo' }
            });
            const id = Object.keys(state.habits)[0];

            const updated = appReducer(state, {
                type: ActionTypes.UPDATE_HABIT,
                payload: { id, updates: { name: 'New Name', color: 'emerald' } }
            });

            assert.equal(updated.habits[id].name, 'New Name');
            assert.equal(updated.habits[id].color, 'emerald');
        });
    });

    await describe('appReducer — DELETE_HABIT', async () => {
        await it('removes habit from state', () => {
            let state = createInitialState();
            state = appReducer(state, {
                type: ActionTypes.ADD_HABIT,
                payload: { name: 'Delete Me' }
            });
            const id = Object.keys(state.habits)[0];

            const deleted = appReducer(state, {
                type: ActionTypes.DELETE_HABIT,
                payload: { id }
            });

            assert.equal(Object.keys(deleted.habits).length, 0);
            assert.equal(deleted.habitOrder.length, 0);
        });
    });

    await describe('appReducer — UNDO / REDO', async () => {
        await it('undo restores previous habits state', () => {
            let state = createInitialState();
            const original = { ...state };

            state = appReducer(state, {
                type: ActionTypes.ADD_HABIT,
                payload: { name: 'Temp' }
            });
            assert.equal(Object.keys(state.habits).length, 1);

            const undone = appReducer(state, { type: ActionTypes.UNDO });
            assert.equal(Object.keys(undone.habits).length, 0);
            assert.equal(undone.redoStack.length, 1);
        });

        await it('redo re-applies after undo', () => {
            let state = createInitialState();
            state = appReducer(state, {
                type: ActionTypes.ADD_HABIT,
                payload: { name: 'Temp' }
            });
            const afterAdd = state;

            state = appReducer(state, { type: ActionTypes.UNDO });
            assert.equal(Object.keys(state.habits).length, 0);

            state = appReducer(state, { type: ActionTypes.REDO });
            assert.equal(Object.keys(state.habits).length, 1);
        });
    });

    await describe('appReducer — SET_VIEW', async () => {
        await it('changes the active view', () => {
            const state = createInitialState();
            const next = appReducer(state, {
                type: ActionTypes.SET_VIEW,
                payload: 'study'
            });
            assert.equal(next.view, 'study');
        });
    });

    await describe('appReducer — ADD_EXPENSE', async () => {
        await it('adds an expense entry', () => {
            const state = createInitialState();
            const next = appReducer(state, {
                type: ActionTypes.ADD_EXPENSE,
                payload: { amount: 50, category: 'Food', description: 'Lunch', date: '2025-01-15' }
            });
            assert.equal(next.expenses.length, 1);
            assert.equal(next.expenses[0].amount, 50);
            assert.equal(next.expenses[0].category, 'Food');
        });
    });

    await describe('appReducer — LOG_WATER', async () => {
        await it('increments water count for today', () => {
            const state = createInitialState();
            const today = new Date().toISOString().split('T')[0];
            const next = appReducer(state, {
                type: ActionTypes.LOG_WATER,
                payload: { date: today, glasses: 1 }
            });
            assert.equal(next.waterLog[today], 1);
        });
    });

    await describe('appReducer — LOAD_STATE', async () => {
        await it('merges payload into state and sets isLoading false', () => {
            const state = createInitialState();
            const next = appReducer(state, {
                type: ActionTypes.LOAD_STATE,
                payload: { xp: 500, level: 5 }
            });
            assert.equal(next.xp, 500);
            assert.equal(next.level, 5);
            assert.equal(next.isLoading, false);
        });
    });

    await describe('appReducer — RESET_STATE', async () => {
        await it('returns a fresh initial state', () => {
            let state = createInitialState();
            state = appReducer(state, {
                type: ActionTypes.ADD_HABIT,
                payload: { name: 'Temp' }
            });
            const reset = appReducer(state, { type: ActionTypes.RESET_STATE });
            assert.equal(Object.keys(reset.habits).length, 0);
            assert.equal(reset.xp, 0);
            assert.equal(reset.isLoading, true);
        });
    });

    await describe('appReducer — UPDATE_SETTINGS', async () => {
        await it('merges new settings into state.settings', () => {
            const state = createInitialState();
            const next = appReducer(state, {
                type: ActionTypes.UPDATE_SETTINGS,
                payload: { theme: 'light', currency: '$' }
            });
            assert.equal(next.settings.theme, 'light');
            assert.equal(next.settings.currency, '$');
            // untouched settings preserved
            assert.equal(next.settings.soundEnabled, true);
        });
    });

    await describe('appReducer — unknown action', async () => {
        await it('returns state unchanged for unknown action type', () => {
            const state = createInitialState();
            const next = appReducer(state, { type: 'DOES_NOT_EXIST' });
            assert(state === next, 'should return same reference');
        });
    });
}
