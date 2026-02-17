import { describe, it, expect } from 'vitest';
import { exportJSON, importJSON } from '../../utils/exportImport';
import { AppDataSchema } from '../../schemas/app.schema';

describe('exportImport', () => {
  it('exportJSON produces valid JSON', () => {
    const data = AppDataSchema.parse({});
    const json = exportJSON(data);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('importJSON validates data correctly', () => {
    const data = AppDataSchema.parse({});
    const json = exportJSON(data);
    const result = importJSON(json);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data._version).toBe('4.0.0');
    }
  });

  it('importJSON rejects invalid JSON', () => {
    const result = importJSON('not json');
    expect(result.success).toBe(false);
  });

  it('importJSON detects encrypted files', () => {
    const result = importJSON(JSON.stringify({ encrypted: true, data: 'abc' }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('encrypted');
    }
  });

  it('importJSON handles partial data gracefully', () => {
    const result = importJSON(JSON.stringify({ assignments: [], studySessions: [] }));
    expect(result.success).toBe(true);
  });
});
