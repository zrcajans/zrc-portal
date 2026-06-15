// ZRC auto extracted safe helpers
// Bu dosya v511 ile App.jsx içinden güvenli adaylardan oluşturuldu.

export const getSupabaseSafeDate = (value = '') => {
    const cleanValue = String(value || '').trim();

    if (!cleanValue) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) return cleanValue;

    const padDatePart = (number) => String(number).padStart(2, '0');
    const toIsoDate = (date) => {
      if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;

      return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
    };

    const numericMatch = cleanValue.match(/^(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?$/);
    if (numericMatch) {
      const day = Number(numericMatch[1]);
      const month = Number(numericMatch[2]) - 1;
      const yearText = numericMatch[3];
      const year = yearText ? Number(yearText.length === 2 ? `20${yearText}` : yearText) : new Date().getFullYear();

      return toIsoDate(new Date(year, month, day));
    }

    const lowerText = cleanValue.toLocaleLowerCase('tr-TR');
    const turkishMonths = {
      ocak: 0,
      şubat: 1,
      subat: 1,
      mart: 2,
      nisan: 3,
      mayıs: 4,
      mayis: 4,
      haziran: 5,
      temmuz: 6,
      ağustos: 7,
      agustos: 7,
      eylül: 8,
      eylul: 8,
      ekim: 9,
      kasım: 10,
      kasim: 10,
      aralık: 11,
      aralik: 11
    };

    const turkishDateMatch = lowerText.match(/(\d{1,2})\s+(ocak|şubat|subat|mart|nisan|mayıs|mayis|haziran|temmuz|ağustos|agustos|eylül|eylul|ekim|kasım|kasim|aralık|aralik)(?:\s+(\d{4}))?/i);

    if (turkishDateMatch) {
      const day = Number(turkishDateMatch[1]);
      const month = turkishMonths[turkishDateMatch[2]];
      const year = turkishDateMatch[3] ? Number(turkishDateMatch[3]) : new Date().getFullYear();

      return toIsoDate(new Date(year, month, day));
    }

    return null;
  };
