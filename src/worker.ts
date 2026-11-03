import { contact } from './data/contact';
import { offers } from './data/offers';
import { normalizePhoneNumber, phoneValidationMessage } from './lib/contact-validation';

interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
}

interface WorkerEnvironment {
  ASSETS: { fetch(request: Request): Promise<Response> };
  MAILER: { send(message: EmailMessage): Promise<{ messageId: string }> };
  CALLBACK_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

interface CallbackResponse {
  success?: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

const maximumBodyBytes = 8_192;
const maximumNameLength = 100;
const maximumMessageLength = 1_000;

function jsonResponse(status: number, body: CallbackResponse, extraHeaders: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

function readTextField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}

function cleanText(value: string, multiline: boolean): string {
  const normalized = value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();

  return multiline ? normalized : normalized.replace(/\s+/g, ' ');
}

function sourcePage(request: Request): string {
  const requestUrl = new URL(request.url);
  const referrer = request.headers.get('Referer');

  if (referrer) {
    try {
      const referrerUrl = new URL(referrer);
      if (referrerUrl.origin === requestUrl.origin) return referrerUrl.href;
    } catch {
      // Ignore malformed or cross-origin referrers.
    }
  }

  return new URL('/kontakt/', requestUrl.origin).href;
}

async function handleCallback(request: Request, env: WorkerEnvironment): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse(405, { message: 'Ta metoda nie jest obsługiwana.' }, { Allow: 'POST' });
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');
  if (origin) {
    try {
      if (new URL(origin).origin !== requestUrl.origin) {
        return jsonResponse(403, { message: 'Nie udało się zweryfikować źródła formularza.' });
      }
    } catch {
      return jsonResponse(403, { message: 'Nie udało się zweryfikować źródła formularza.' });
    }
  }

  const declaredLength = request.headers.get('Content-Length');
  if (declaredLength && Number(declaredLength) > maximumBodyBytes) {
    return jsonResponse(413, { message: 'Wiadomość jest za duża. Skróć jej treść i spróbuj ponownie.' });
  }

  const contentType = (request.headers.get('Content-Type') ?? '').toLowerCase();
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
    return jsonResponse(415, { message: 'Nieobsługiwany format formularza.' });
  }

  let rateLimit: { success: boolean };
  try {
    rateLimit = await env.CALLBACK_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP')?.trim() || 'unknown' });
  } catch {
    return jsonResponse(503, { message: 'Formularz jest chwilowo niedostępny. Spróbuj ponownie później.' });
  }

  if (!rateLimit.success) {
    return jsonResponse(429, { message: 'Wysłano już kilka próśb z tego połączenia. Spróbuj ponownie za chwilę.' });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse(400, { message: 'Nie udało się odczytać formularza. Sprawdź dane i spróbuj ponownie.' });
  }

  if (readTextField(form, 'website').trim()) {
    return jsonResponse(400, { message: 'Nie udało się przetworzyć formularza. Sprawdź dane i spróbuj ponownie.' });
  }

  const rawPhone = readTextField(form, 'phone').trim();
  const normalizedPhone = normalizePhoneNumber(rawPhone);
  const name = cleanText(readTextField(form, 'name'), false);
  const message = cleanText(readTextField(form, 'message'), true);
  const selectedOffer = readTextField(form, 'package').trim();
  const fieldErrors: Record<string, string> = {};

  if (!normalizedPhone) fieldErrors.phone = phoneValidationMessage;
  if (name.length > maximumNameLength) fieldErrors.name = 'Imię może mieć maksymalnie 100 znaków.';
  if (message.length > maximumMessageLength) fieldErrors.message = 'Wiadomość może mieć maksymalnie 1000 znaków.';
  if (selectedOffer && selectedOffer !== 'unknown' && !offers.some((offer) => offer.slug === selectedOffer)) {
    fieldErrors.package = 'Wybierz jedną z dostępnych opcji.';
  }
  if (readTextField(form, 'privacyAcknowledgement') !== 'yes') {
    fieldErrors.privacyAcknowledgement = 'Potwierdź zapoznanie się z informacją o przetwarzaniu danych.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return jsonResponse(422, {
      message: 'Sprawdź wskazane pola i popraw dane.',
      fieldErrors,
    });
  }

  const recipient = contact.email.trim();
  const sender = contact.emailFrom.trim();
  if (!recipient || !sender || !env.MAILER) {
    return jsonResponse(503, {
      message: 'Prośba nie została wysłana. Formularz wymaga jeszcze konfiguracji skrzynki kontaktowej.',
    });
  }

  const offer = offers.find((item) => item.slug === selectedOffer);
  const messageLines = [
    'Rodzaj: prośba o oddzwonienie',
    `Numer telefonu: ${normalizedPhone}`,
    `Imię: ${name || 'Nie podano'}`,
    `Zainteresowanie: ${offer?.name ?? 'Nie wskazano'}`,
    'Opis:',
    ...(message ? message.split('\n').map((line) => `  ${line}`) : ['  Nie podano']),
    `Data zgłoszenia (UTC): ${new Date().toISOString()}`,
    `Strona: ${sourcePage(request)}`,
  ];

  try {
    await env.MAILER.send({
      to: recipient,
      from: sender,
      subject: 'Prośba o oddzwonienie',
      text: messageLines.join('\n'),
    });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error('Callback email delivery failed', errorName);
    return jsonResponse(502, { message: 'Nie udało się wysłać prośby. Twoje dane pozostały w formularzu — spróbuj ponownie.' });
  }

  return jsonResponse(200, {
    success: true,
    message: 'Dziękujemy! Otrzymaliśmy prośbę o kontakt. Odezwie się do Ciebie człowiek z naszego zespołu.',
  });
}

export default {
  async fetch(request: Request, env: WorkerEnvironment): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/callback') return handleCallback(request, env);
    return env.ASSETS.fetch(request);
  },
};
