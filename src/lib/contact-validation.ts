export const phoneValidationMessage = 'Podaj poprawny numer telefonu, na przykład +48 600 000 000.';

export function normalizePhoneNumber(value: string): string | null {
  const candidate = value.trim();
  if (candidate.length > 40 || !/^\+?[\d\s().-]+$/.test(candidate)) return null;

  const digits = candidate.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return null;

  return candidate.startsWith('+') ? `+${digits}` : digits;
}
