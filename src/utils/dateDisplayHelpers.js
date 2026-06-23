// ZRC — Yalnızca kullanıcıya gösterilen tarih metinleri için ortak yardımcılar.

const TURKISH_MONTHS = {
  ocak: 0, şubat: 1, subat: 1, mart: 2, nisan: 3, mayıs: 4, mayis: 4,
  haziran: 5, temmuz: 6, ağustos: 7, agustos: 7, eylül: 8, eylul: 8,
  ekim: 9, kasım: 10, kasim: 10, aralık: 11, aralik: 11
};

const createSafeLocalDate = (year, monthIndex, day) => {
  const date = new Date(year, monthIndex, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

export const parseZrcDisplayDate = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getTime());
  }

  const text = String(value || '').trim();
  if (!text) return null;

  // YYYY-MM-DD: UTC gün kayması olmadan yerel tarihe dönüştür.
  const isoDateMatch = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|[T\s])/);
  if (isoDateMatch) {
    const localDate = createSafeLocalDate(
      Number(isoDateMatch[1]),
      Number(isoDateMatch[2]) - 1,
      Number(isoDateMatch[3])
    );
    if (localDate) return localDate;
  }

  // 05/09/2026, 05.09.2026 ve saat ekli benzer kayıtlar.
  const numericDateMatch = text.match(/^(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?/);
  if (numericDateMatch) {
    const day = Number(numericDateMatch[1]);
    const monthIndex = Number(numericDateMatch[2]) - 1;
    const yearText = numericDateMatch[3];
    const year = yearText
      ? Number(yearText.length === 2 ? `20${yearText}` : yearText)
      : new Date().getFullYear();
    const localDate = createSafeLocalDate(year, monthIndex, day);
    if (localDate) return localDate;
  }

  // 5 Eylül 2026 / 5 Eylül gibi önceki kayıtlar.
  const normalized = text
    .toLocaleLowerCase('tr-TR')
    .replace(/[,.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const turkishDateMatch = normalized.match(
    /(\d{1,2})\s+(ocak|şubat|subat|mart|nisan|mayıs|mayis|haziran|temmuz|ağustos|agustos|eylül|eylul|ekim|kasım|kasim|aralık|aralik)(?:\s+(\d{2,4}))?/
  );

  if (turkishDateMatch) {
    const day = Number(turkishDateMatch[1]);
    const monthIndex = TURKISH_MONTHS[turkishDateMatch[2]];
    const yearText = turkishDateMatch[3];
    const year = yearText
      ? Number(yearText.length === 2 ? `20${yearText}` : yearText)
      : new Date().getFullYear();
    const localDate = createSafeLocalDate(year, monthIndex, day);
    if (localDate) return localDate;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatZrcDate = (value, { year = 'auto', fallback = '' } = {}) => {
  const date = parseZrcDisplayDate(value);
  if (!date) return fallback;

  const includeYear = year === 'always' || (
    year === 'auto' && date.getFullYear() !== new Date().getFullYear()
  );

  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    ...(includeYear ? { year: 'numeric' } : {})
  }).format(date);
};

export const formatZrcTime = (value, { fallback = '' } = {}) => {
  const date = parseZrcDisplayDate(value);
  if (!date) return fallback;

  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatZrcDateTime = (value, { year = 'auto', fallback = '' } = {}) => {
  const date = parseZrcDisplayDate(value);
  if (!date) return fallback;

  return `${formatZrcDate(date, { year })} · ${formatZrcTime(date)}`;
};

export const formatZrcDateRange = (startValue, endValue, { year = 'auto', fallback = '' } = {}) => {
  const startDate = parseZrcDisplayDate(startValue);
  const endDate = parseZrcDisplayDate(endValue);

  if (!startDate && !endDate) return fallback;
  if (!startDate) return formatZrcDate(endDate, { year, fallback });
  if (!endDate) return formatZrcDate(startDate, { year, fallback });

  const startLabel = formatZrcDate(startDate, { year, fallback });
  const endLabel = formatZrcDate(endDate, { year, fallback });

  return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
};
