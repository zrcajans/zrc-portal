// ZRC dashboard/date/search/quick-note helper functions
// Bu dosya v504 ile App.jsx içinden ayrıldı.

export const parseTaskDateValue = (value) => {
    if (!value) return null;

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value;
    }

    const text = String(value).trim();
    if (!text) return null;

    const isoDate = new Date(text);
    if (!Number.isNaN(isoDate.getTime())) {
      return isoDate;
    }

    const numericMatch = text.match(/^(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?$/);
    if (numericMatch) {
      const day = Number(numericMatch[1]);
      const month = Number(numericMatch[2]) - 1;
      const yearText = numericMatch[3];
      const year = yearText ? Number(yearText.length === 2 ? `20${yearText}` : yearText) : new Date().getFullYear();
      const date = new Date(year, month, day);

      if (!Number.isNaN(date.getTime())) return date;
    }

    const lowerText = text.toLocaleLowerCase('tr-TR');
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
      const date = new Date(year, month, day);

      if (!Number.isNaN(date.getTime())) return date;
    }

    const today = new Date();

    if (lowerText.includes('bugün')) {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

    if (lowerText.includes('yarın')) {
      return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    }

    return null;
  };

export const formatCalendarDate = (date) => {
    if (!date) return '-';

    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

export const formatCalendarWeekday = (date) => {
    if (!date) return '';

    return new Intl.DateTimeFormat('tr-TR', {
      weekday: 'short'
    }).format(date);
  };

export const getCalendarPriorityStyle = (priority) => {
    if (priority === 'Acil') return 'bg-slate-50 text-slate-700 border-slate-200';
    if (priority === 'Yüksek') return 'bg-slate-50 text-slate-700 border-slate-200';
    if (priority === 'Düşük') return 'bg-slate-50 text-slate-700 border-slate-200';

    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

export const normalizeHexColor = (color = '#ff3600') => {
    const cleanColor = String(color || '#ff3600').trim();

    if (/^#[0-9a-fA-F]{6}$/.test(cleanColor)) return cleanColor;
    if (/^#[0-9a-fA-F]{3}$/.test(cleanColor)) {
      return `#${cleanColor
        .slice(1)
        .split('')
        .map((char) => `${char}${char}`)
        .join('')}`;
    }

    return '#ff3600';
  };

export const mixHexWithWhite = (color = '#ff3600', amount = 0.78) => {
    const hex = normalizeHexColor(color).replace('#', '');
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);

    const mixed = [red, green, blue].map((channel) =>
      Math.round(channel + (255 - channel) * amount)
        .toString(16)
        .padStart(2, '0')
    );

    return `#${mixed.join('')}`;
  };

export const isTaskCompletedForCalendar = (task) => {
    const statusText = String(task.status || '').toLocaleLowerCase('tr-TR');
    return task.completed === true || statusText.includes('tamam');
  };

export const isTaskLongForCalendar = (task) => {
    if (!task.calendarStartDate || !task.calendarEndDate) return false;

    const oneDay = 1000 * 60 * 60 * 24;
    const difference = Math.abs(task.calendarEndDate.getTime() - task.calendarStartDate.getTime());

    return difference > oneDay;
  };

export const doesTaskOverlapCalendarRange = (task, rangeStart, rangeEnd) => {
    if (!task || !rangeStart || !rangeEnd) return false;

    const taskStart = task.calendarStartDate || task.homeDate || task.calendarEndDate;
    const taskEnd = task.calendarEndDate || task.homeDate || task.calendarStartDate;

    if (!taskStart || !taskEnd) return false;

    return taskStart <= rangeEnd && taskEnd >= rangeStart;
  };

export const getCalendarTaskStartDate = (task) => {
    const date =
      parseTaskDateValue(task.startDate || task.start || task.baslangicTarihi) ||
      parseTaskDateValue(
        task.endDate ||
          task.dueDate ||
          task.deadline ||
          task.deadlineDate ||
          task.bitisTarihi ||
          task.finishDate ||
          task.date ||
          task.displayDate ||
          task.taskDate
      );

    if (!date) return null;

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

export const getCalendarTaskEndDate = (task) => {
    const date =
      parseTaskDateValue(
        task.endDate ||
          task.dueDate ||
          task.deadline ||
          task.deadlineDate ||
          task.bitisTarihi ||
          task.finishDate ||
          task.date ||
          task.displayDate ||
          task.taskDate
      ) ||
      getCalendarTaskStartDate(task);

    if (!date) return null;

    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  };

export const formatDateForTaskModal = (date) => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

export const getReportTaskDate = (task) => {
    return parseTaskDateValue(task.endDate || task.dueDate || task.deadline || task.bitisTarihi || task.date);
  };

export const getReportPercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

export const getTimeChartDateKey = (date) => {
    if (!date) return '';

    return formatDateForTaskModal(date);
  };

export const getStartOfWeekForTimeChart = (date) => {
    const weekStart = new Date(date);
    const offset = (weekStart.getDay() + 6) % 7;
    weekStart.setDate(weekStart.getDate() - offset);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  };

export const getTaskPossibleDateValues = (task) => [
    task.endDate,
    task.dueDate,
    task.deadline,
    task.deadlineDate,
    task.bitisTarihi,
    task.finishDate,
    task.date,
    task.displayDate,
    task.taskDate,
    task.startDate,
    task.start,
    task.baslangicTarihi,
    task.createdDate
  ];

export const getFirstValidTaskDate = (task, fields = []) => {
    const values = fields.length ? fields.map((field) => task[field]) : getTaskPossibleDateValues(task);

    for (const value of values) {
      const parsedDate = parseTaskDateValue(value);
      if (parsedDate) return parsedDate;
    }

    return null;
  };

export const getTimeChartTaskDate = (task) => {
    return getFirstValidTaskDate(task);
  };

export const getTimeChartTaskStartDate = (task) => {
    const date =
      getFirstValidTaskDate(task, ['startDate', 'start', 'baslangicTarihi']) ||
      getTimeChartTaskDate(task);

    if (!date) return null;

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

export const getTimeChartTaskEndDate = (task) => {
    const date =
      getFirstValidTaskDate(task, ['endDate', 'dueDate', 'deadline', 'deadlineDate', 'bitisTarihi', 'finishDate', 'date', 'displayDate', 'taskDate']) ||
      getTimeChartTaskStartDate(task);

    if (!date) return null;

    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  };

export const doesTimeChartTaskOverlapPeriod = (task, period) => {
    const startDate = getTimeChartTaskStartDate(task);
    const endDate = getTimeChartTaskEndDate(task);

    if (!startDate && !endDate) return false;

    const taskStart = startDate || endDate;
    const taskEnd = endDate || startDate;

    return taskStart <= period.end && taskEnd >= period.start;
  };

export const getTimeChartTaskColor = (task) => {
    if (task.priority === 'Acil') return 'bg-red-100 text-red-700 border-red-200';
    if (task.priority === 'Yüksek') return 'bg-zinc-900 text-white border-zinc-900';
    if (task.priority === 'Düşük') return 'bg-emerald-100 text-emerald-700 border-emerald-200';

    return 'bg-violet-100 text-violet-700 border-violet-200';
  };

export const getGanttTaskStartDate = (task) => {
    const date = getTimeChartTaskStartDate(task);
    if (!date) return null;

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

export const getGanttTaskEndDate = (task) => {
    const date = getTimeChartTaskEndDate(task) || getGanttTaskStartDate(task);
    if (!date) return null;

    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  };

export const getNotificationTaskDate = (task) => {
    return (
      getCalendarTaskEndDate(task) ||
      getCalendarTaskStartDate(task) ||
      getTimeChartTaskEndDate(task) ||
      getTimeChartTaskStartDate(task)
    );
  };

export const getNotificationDateLabel = (date) => {
    if (!date) return 'Tarih yok';

    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

export const getNotificationTone = (type) => {
    if (type === 'overdue') return 'bg-red-50 text-red-600 border-red-100';
    if (type === 'today') return 'bg-zinc-100 text-zinc-700 border-blue-100';
    if (type === 'soon') return 'bg-zinc-100 text-zinc-700 border-orange-100';
    if (type === 'comment') return 'bg-violet-50 text-violet-600 border-violet-100';
    if (type === 'file') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (type === 'assignment') return 'bg-sky-50 text-sky-600 border-sky-100';
    if (type === 'status') return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    if (type === 'message') return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    if (type === 'task') return 'bg-lime-50 text-lime-600 border-lime-100';

    return 'bg-zinc-50 text-zinc-500 border-zinc-100';
  };

export const normalizeSearchText = (value) => String(value || '').toLocaleLowerCase('tr-TR');

export const getGlobalSearchTypeStyle = (type) => {
    if (type === 'Dosya') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (type === 'Yorum') return 'bg-violet-50 text-violet-600 border-violet-100';
    if (type === 'Not') return 'bg-zinc-100 text-zinc-700 border-orange-100';

    return 'bg-zinc-100 text-zinc-700 border-blue-100';
  };

export const parseQuickNoteContent = (note = {}) => {
    if (note.title || note.detail) {
      return {
        title: String(note.title || '').trim() || 'Başlıksız not',
        detail: String(note.detail || '')
      };
    }

    const rawText = String(note.text || '');

    if (rawText.startsWith('__ZRC_NOTE_V2__')) {
      try {
        const parsed = JSON.parse(rawText.replace('__ZRC_NOTE_V2__', ''));

        return {
          title: String(parsed.title || '').trim() || 'Başlıksız not',
          detail: String(parsed.detail || '')
        };
      } catch {
        return {
          title: 'Başlıksız not',
          detail: rawText
        };
      }
    }

    const lines = rawText.split('\n');
    const firstLine = String(lines[0] || '').trim();

    return {
      title: firstLine || 'Başlıksız not',
      detail: lines.slice(1).join('\n').trim()
    };
  };

export const getQuickNoteTitle = (note = {}) => parseQuickNoteContent(note).title;

export const getQuickNoteDetail = (note = {}) => parseQuickNoteContent(note).detail;

export const buildQuickNoteText = (title = '', detail = '') =>
    `__ZRC_NOTE_V2__${JSON.stringify({
      title: String(title || '').trim(),
      detail: String(detail || '').trim()
    })}`;
