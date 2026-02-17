import { AppDataSchema, type AppData } from '../schemas/app.schema';
import { encryptData, decryptData } from './crypto';

/** Export data as JSON string */
export function exportJSON(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

/** Export data as encrypted JSON */
export async function exportEncryptedJSON(data: AppData, passphrase: string): Promise<string> {
  const json = JSON.stringify(data);
  const encrypted = await encryptData(json, passphrase);
  return JSON.stringify({ encrypted: true, version: '4.0.0', data: encrypted });
}

/** Import and validate data from JSON string */
export function importJSON(jsonStr: string): { success: true; data: AppData } | { success: false; error: string } {
  try {
    const raw = JSON.parse(jsonStr);
    // Check if encrypted
    if (raw.encrypted) {
      return { success: false, error: 'This file is encrypted. Please use the encrypted import option.' };
    }
    const result = AppDataSchema.safeParse(raw);
    if (!result.success) {
      return { success: false, error: `Validation failed: ${result.error.issues.map((i) => i.message).join(', ')}` };
    }
    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Invalid JSON format' };
  }
}

/** Import encrypted JSON */
export async function importEncryptedJSON(
  jsonStr: string,
  passphrase: string,
): Promise<{ success: true; data: AppData } | { success: false; error: string }> {
  try {
    const wrapper = JSON.parse(jsonStr);
    if (!wrapper.encrypted || !wrapper.data) {
      return { success: false, error: 'Not an encrypted backup file.' };
    }
    const decrypted = await decryptData(wrapper.data, passphrase);
    return importJSON(decrypted);
  } catch {
    return { success: false, error: 'Decryption failed. Check your passphrase.' };
  }
}

/** Trigger file download in browser */
export function downloadFile(content: string, filename: string, mimeType = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Generate ICS calendar string from events */
export function generateICS(
  events: Array<{ title: string; start: string; end?: string; description?: string }>,
): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//StudentOS//v4.0//EN',
    'CALSCALE:GREGORIAN',
  ];

  for (const event of events) {
    const startDate = new Date(event.start);
    const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 60 * 60 * 1000);
    lines.push('BEGIN:VEVENT');
    lines.push(`DTSTART:${formatICSDate(startDate)}`);
    lines.push(`DTEND:${formatICSDate(endDate)}`);
    lines.push(`SUMMARY:${escapeICS(event.title)}`);
    if (event.description) lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
    lines.push(`UID:${crypto.randomUUID()}@studentos`);
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeICS(text: string): string {
  return text.replace(/[\\;,\n]/g, (c) => (c === '\n' ? '\\n' : '\\' + c));
}
