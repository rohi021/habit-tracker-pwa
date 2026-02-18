/**
 * @fileoverview Date, statistics, and habit utility functions.
 * Pure functions — no side effects, no DOM access.
 * @module dateUtils
 */

/**
 * Date utilities for key generation, parsing, and formatting.
 * @namespace
 */
export const DateUtils = {
    /**
     * Get ISO date string (YYYY-MM-DD) for a given date.
     * @param {Date} [date=new Date()] - The date to format
     * @returns {string} ISO date string
     */
    toKey: (date = new Date()) => date.toISOString().split('T')[0],

    /**
     * Get the number of days in a month.
     * @param {number} year  - Full year
     * @param {number} month - Month (0-indexed)
     * @returns {number}
     */
    daysInMonth: (year, month) => new Date(year, month + 1, 0).getDate(),

    /**
     * Get a Date object for N days ago.
     * @param {number} days - Number of days ago
     * @returns {Date}
     */
    daysAgo: (days) => {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d;
    },

    /**
     * Check if a date key matches today.
     * @param {string} dateKey - ISO date string
     * @returns {boolean}
     */
    isToday: (dateKey) => dateKey === DateUtils.toKey(),

    /**
     * Get day of week (0 = Sunday, 6 = Saturday).
     * @param {string} dateKey - ISO date string
     * @returns {number}
     */
    dayOfWeek: (dateKey) => new Date(dateKey).getDay(),

    /**
     * Format a date for display.
     * @param {Date|string} date
     * @param {Intl.DateTimeFormatOptions} [options]
     * @returns {string}
     */
    format: (date, options = { month: 'short', day: 'numeric' }) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('en-US', options);
    },

    /**
     * Parse a YYYY-MM-DD key to a Date at noon (avoids timezone shifts).
     * @param {string} dateKey
     * @returns {Date}
     */
    parseKey: (dateKey) => new Date(dateKey + 'T12:00:00'),

    /**
     * Add N days to a date (returns a new Date).
     * @param {Date} date
     * @param {number} n
     * @returns {Date}
     */
    addDays: (date, n) => {
        const d = new Date(date);
        d.setDate(d.getDate() + n);
        return d;
    },

    /**
     * Get start of week for a given date.
     * @param {Date} date
     * @param {number} [weekStartsOn=0] - 0 = Sunday, 1 = Monday
     * @returns {Date}
     */
    startOfWeek: (date, weekStartsOn = 0) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
        d.setDate(d.getDate() - diff);
        d.setHours(0, 0, 0, 0);
        return d;
    },
};

/**
 * Statistical utility functions.
 * @namespace
 */
export const StatsUtils = {
    /**
     * Calculate arithmetic mean.
     * @param {number[]} values
     * @returns {number}
     */
    mean: (values) => {
        if (values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    },

    /**
     * Calculate standard deviation.
     * @param {number[]} values
     * @returns {number}
     */
    stdDev: (values) => {
        if (values.length < 2) return 0;
        const avg = StatsUtils.mean(values);
        const squareDiffs = values.map(v => Math.pow(v - avg, 2));
        return Math.sqrt(StatsUtils.mean(squareDiffs));
    },

    /**
     * Calculate Pearson correlation coefficient between two arrays.
     * @param {number[]} x
     * @param {number[]} y
     * @returns {number} Correlation (-1 to 1)
     */
    pearsonCorrelation: (x, y) => {
        if (x.length !== y.length || x.length < 3) return 0;

        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
        const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
        const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt(
            (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
        );

        if (denominator === 0) return 0;
        return numerator / denominator;
    },

    /**
     * Calculate linear regression slope (trend direction).
     * @param {number[]} values
     * @returns {{ slope: number, direction: 'up'|'down'|'stable' }}
     */
    trend: (values) => {
        if (values.length < 3) return { slope: 0, direction: 'stable' };

        const n = values.length;
        const xMean = (n - 1) / 2;
        const yMean = StatsUtils.mean(values);

        let numerator = 0;
        let denominator = 0;

        for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (values[i] - yMean);
            denominator += (i - xMean) * (i - xMean);
        }

        const slope = denominator !== 0 ? numerator / denominator : 0;
        const direction = slope > 0.05 ? 'up' : slope < -0.05 ? 'down' : 'stable';

        return { slope, direction };
    },

    /**
     * Detect anomalies using Z-score.
     * @param {number[]} values
     * @param {number} [threshold=2]
     * @returns {number[]} Indices of anomalies
     */
    detectAnomalies: (values, threshold = 2) => {
        const mean = StatsUtils.mean(values);
        const std = StatsUtils.stdDev(values);

        if (std === 0) return [];

        return values
            .map((v, i) => ({ index: i, zScore: Math.abs((v - mean) / std) }))
            .filter(({ zScore }) => zScore > threshold)
            .map(({ index }) => index);
    },

    /**
     * Calculate moving average.
     * @param {number[]} values
     * @param {number} [window=7]
     * @returns {number[]}
     */
    movingAverage: (values, window = 7) => {
        return values.map((_, i, arr) => {
            const start = Math.max(0, i - window + 1);
            const slice = arr.slice(start, i + 1);
            return StatsUtils.mean(slice);
        });
    }
};

/**
 * Habit-specific calculation utilities.
 * @namespace
 */
export const HabitUtils = {
    /**
     * Calculate current streak for a habit.
     * @param {Object<string, boolean>} data - Habit completion data keyed by date
     * @returns {number} Current streak length
     */
    calculateStreak: (data) => {
        if (!data || Object.keys(data).length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();

        const todayKey = DateUtils.toKey(currentDate);
        if (!data[todayKey]) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        for (let i = 0; i < 365; i++) {
            const key = DateUtils.toKey(currentDate);
            if (data[key]) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    },

    /**
     * Calculate longest streak ever.
     * @param {Object<string, boolean>} data
     * @returns {number}
     */
    calculateLongestStreak: (data) => {
        if (!data) return 0;

        const dates = Object.keys(data).sort();
        if (dates.length === 0) return 0;

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < dates.length; i++) {
            const prevDate = new Date(dates[i - 1]);
            const currDate = new Date(dates[i]);
            const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }

        return maxStreak;
    },

    /**
     * Calculate completion rate for a time period.
     * @param {Object<string, boolean>} data
     * @param {number} [days=30]
     * @returns {number} Completion rate 0-100
     */
    calculateCompletionRate: (data, days = 30) => {
        if (!data) return 0;

        let completed = 0;
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = DateUtils.toKey(date);
            if (data[key]) completed++;
        }

        return Math.round((completed / days) * 100);
    },

    /**
     * Get completion data as array for analysis.
     * @param {Object<string, boolean>} data
     * @param {number} [days=30]
     * @returns {number[]} Array of 1s and 0s
     */
    getCompletionArray: (data, days = 30) => {
        const result = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const key = DateUtils.toKey(date);
            result.push(data?.[key] ? 1 : 0);
        }

        return result;
    },

    /**
     * Find best performing day of week.
     * @param {Object<string, boolean>} data
     * @returns {{ day: number, rate: number }|null}
     */
    findBestDay: (data) => {
        if (!data) return null;

        const dayStats = [0, 0, 0, 0, 0, 0, 0].map(() => ({ completed: 0, total: 0 }));

        Object.keys(data).forEach(key => {
            const day = DateUtils.dayOfWeek(key);
            dayStats[day].total++;
            if (data[key]) dayStats[day].completed++;
        });

        let bestDay = 0;
        let bestRate = 0;

        dayStats.forEach((stat, day) => {
            if (stat.total > 0) {
                const rate = stat.completed / stat.total;
                if (rate > bestRate) {
                    bestRate = rate;
                    bestDay = day;
                }
            }
        });

        return { day: bestDay, rate: Math.round(bestRate * 100) };
    },

    /**
     * Find worst performing day of week.
     * @param {Object<string, boolean>} data
     * @returns {{ day: number, rate: number }|null}
     */
    findWorstDay: (data) => {
        if (!data) return null;

        const dayStats = [0, 0, 0, 0, 0, 0, 0].map(() => ({ completed: 0, total: 0 }));

        Object.keys(data).forEach(key => {
            const day = DateUtils.dayOfWeek(key);
            dayStats[day].total++;
            if (data[key]) dayStats[day].completed++;
        });

        let worstDay = 0;
        let worstRate = 1;

        dayStats.forEach((stat, day) => {
            if (stat.total >= 2) {
                const rate = stat.completed / stat.total;
                if (rate < worstRate) {
                    worstRate = rate;
                    worstDay = day;
                }
            }
        });

        return { day: worstDay, rate: Math.round(worstRate * 100) };
    }
};
