import React, { useEffect, useMemo, useRef, useState } from 'react';

const defaultStatusOptions = [
  { label: 'Bekliyor', bg: '#f4bd61', text: '#7a4c0f' },
  { label: 'Aktif', bg: '#064e1f', text: '#ffffff' },
  { label: 'Tamamlandı', bg: '#bcd2e8', text: '#294057' },
  { label: 'Askıya Alındı', bg: '#a78bfa', text: '#4c1d95' }
];

const priorityOptions = [
  { label: 'Düşük', color: '#46b16f' },
  { label: 'Normal', color: '#2563eb' },
  { label: 'Yüksek', color: '#f97316' },
  { label: 'Acil', color: '#ef4444' }
];

const defaultCustomerOptions = ['Müşteri Seçin...', 'Örnek Şirket', 'A Firması', 'B Holding'];

const createAvatarFromName = (name) => {
  const cleanName = String(name || '').trim();

  if (!cleanName) return 'K';

  return cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('tr-TR'))
    .join('');
};

const defaultUsers = [
  { id: 1, name: 'Enes Zariç', avatar: 'EZ' },
  { id: 2, name: 'Ahmet Yılmaz', avatar: 'AY' },
  { id: 3, name: 'Zeynep Kaya', avatar: 'ZK' },
  { id: 4, name: 'Can Öz', avatar: 'CÖ' }
];

const months = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık'
];

const monthMap = {
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

function hexToRgba(hexColor, alpha = 0.12) {
  if (!hexColor || typeof hexColor !== 'string') return `rgba(15, 23, 42, ${alpha})`;

  const cleanHex = hexColor.replace('#', '');

  if (cleanHex.length !== 6) return `rgba(15, 23, 42, ${alpha})`;

  const red = parseInt(cleanHex.slice(0, 2), 16);
  const green = parseInt(cleanHex.slice(2, 4), 16);
  const blue = parseInt(cleanHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function formatDateDisplay(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function normalizeText(value) {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c');
}

function parseDateValue(value) {
  const text = String(value || '').trim();
  if (!text) return null;

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
  }

  const numericMatch = text.match(/^(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?$/);
  if (numericMatch) {
    const day = Number(numericMatch[1]);
    const month = Number(numericMatch[2]) - 1;
    const yearText = numericMatch[3];
    const year = yearText ? Number(yearText.length === 2 ? `20${yearText}` : yearText) : new Date().getFullYear();
    return new Date(year, month, day);
  }

  const normalized = normalizeText(text);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  let day = null;
  let month = null;
  let year = null;

  tokens.forEach((token) => {
    if (/^\d+$/.test(token)) {
      const number = Number(token);
      if (number > 31) year = number;
      else if (day === null) day = number;
      return;
    }

    if (Object.prototype.hasOwnProperty.call(monthMap, token)) {
      month = monthMap[token];
    }
  });

  if (day !== null && month !== null) {
    return new Date(year || new Date().getFullYear(), month, day);
  }

  return null;
}

function toDisplayDate(value) {
  if (!value) return '';

  const parsed = parseDateValue(value);
  return parsed ? formatDateDisplay(parsed) : String(value);
}

function getCalendarDays(viewDate) {
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function FieldLabel({ children }) {
  return (
    <label className="block text-[10px] font-black text-slate-500 mb-1.5">
      {children}
    </label>
  );
}

function DateInput({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseDateValue(value) || new Date());

  useEffect(() => {
    const parsed = parseDateValue(value);
    if (parsed) setViewDate(parsed);
  }, [value]);

  const days = useMemo(() => getCalendarDays(viewDate), [viewDate]);

  const selectDate = (date) => {
    onChange(formatDateDisplay(date));
    setViewDate(date);
    setIsOpen(false);
  };

  const selectToday = () => {
    selectDate(new Date());
  };

  return (
    <div className="relative">
      <FieldLabel>
        {label} <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-[#a78bfa] text-[#7c3aed] text-[9px] ml-1">?</span>
      </FieldLabel>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="29 Mayıs 2026"
          className="w-full h-8 rounded-full border border-slate-200 bg-white px-3 pr-8 text-[11.5px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#b8d3ff] focus:ring-2 focus:ring-blue-500/10 transition-all"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[14px] font-bold text-slate-300 hover:text-slate-500"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 top-[54px] z-[900] w-[268px] rounded-[10px] bg-white border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.22)] p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              className="w-7 h-7 rounded-full hover:bg-slate-50 text-blue-500 font-black"
            >
              ‹
            </button>

            <div className="text-[12px] font-black text-slate-700">
              {months[viewDate.getMonth()]}, {viewDate.getFullYear()}
            </div>

            <button
              type="button"
              onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              className="w-7 h-7 rounded-full hover:bg-slate-50 text-blue-500 font-black"
            >
              ›
            </button>
          </div>

          <button
            type="button"
            onClick={selectToday}
            className="mx-auto mb-2 h-6 px-3 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black flex items-center justify-center"
          >
            Bugün
          </button>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['PT', 'SA', 'ÇA', 'PE', 'CU', 'CT', 'PZ'].map((dayName) => (
              <div key={dayName} className="text-[9px] font-black text-blue-500 py-1">
                {dayName}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const isCurrentMonth = day.getMonth() === viewDate.getMonth();
              const selectedDate = parseDateValue(value);
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === day.getFullYear() &&
                selectedDate.getMonth() === day.getMonth() &&
                selectedDate.getDate() === day.getDate();

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={`h-7 rounded-full text-[10.5px] font-black transition-all ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : isCurrentMonth
                        ? 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                        : 'text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomSelect({
  value,
  options,
  onChange,
  open,
  onToggle,
  onClose,
  buttonClassName = '',
  menuClassName = '',
  renderOption,
  renderValue
}) {
  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { label: option } : option
  );

  const selectedOption =
    normalizedOptions.find((option) => option.label === value) || normalizedOptions[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className={`w-full h-9 rounded-[9px] border border-slate-200 bg-white px-3 text-left flex items-center justify-between gap-2 text-[11px] font-black text-slate-600 hover:border-blue-200 hover:bg-slate-50 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-500/10 transition-all ${buttonClassName}`}
        style={
          selectedOption?.bg
            ? {
                backgroundColor: selectedOption.bg,
                color: selectedOption.text || '#ffffff',
                borderColor: 'transparent'
              }
            : undefined
        }
      >
        <span className="min-w-0 truncate flex items-center gap-2">
          {selectedOption?.color && !renderValue && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: selectedOption.color }}
            />
          )}
          <span className="truncate">
            {renderValue ? renderValue(selectedOption) : selectedOption?.label}
          </span>
        </span>

        <svg className="w-3.5 h-3.5 shrink-0 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          onClick={(event) => event.stopPropagation()}
          className={`absolute left-0 top-[42px] z-[920] min-w-full rounded-[9px] bg-white border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.18)] p-1.5 space-y-1 animate-fade-in ${menuClassName}`}
        >
          {normalizedOptions.map((option) => {
            const isSelected = option.label === value;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  onChange(option.label);
                  onClose();
                }}
                className={`w-full h-7 rounded-[6px] px-2.5 flex items-center justify-between gap-2 text-left transition-all ${
                  option.bg ? 'hover:brightness-[0.97]' : 'hover:bg-slate-50'
                }`}
                style={
                  option.bg
                    ? {
                        backgroundColor: option.bg,
                        color: option.text || '#ffffff'
                      }
                    : isSelected
                      ? {
                          backgroundColor: option.color ? hexToRgba(option.color, 0.12) : '#eff6ff'
                        }
                      : undefined
                }
              >
                <span className={`min-w-0 truncate text-[11px] font-black flex items-center gap-2 ${
                  option.bg ? '' : 'text-slate-600'
                }`}>
                  {option.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: option.color }}
                    />
                  )}
                  <span className="truncate">
                    {renderOption ? renderOption(option) : option.label}
                  </span>
                </span>

                {isSelected && (
                  <svg
                    className={`w-3.5 h-3.5 shrink-0 ${option.bg ? '' : 'text-blue-500'}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.7"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MiniUser({ user }) {
  return (
    <span className="w-6 h-6 rounded-full bg-[#8c5220] text-white text-[8px] font-black flex items-center justify-center">
      {user.avatar}
    </span>
  );
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  statusOptions: dynamicStatusOptions = [],
  teamMembers = [],
  customers = [],
  calendarDefaultDate = null,
  projectName = '',
  projectOptions = [],
  canChangeProject = false,
  onProjectChange = null
}) {
  const columnStatusOptions = (dynamicStatusOptions.length ? dynamicStatusOptions : defaultStatusOptions).map((option) =>
    typeof option === 'string' ? { label: option } : option
  );
  const defaultStatus = columnStatusOptions[0]?.label || 'Bekliyor';
  const users = (teamMembers.length ? teamMembers : defaultUsers)
    .filter((user) => user?.status !== 'Pasif')
    .map((user, index) => ({
      id: user.id || `user-${index}`,
      name: user.name || 'İsimsiz Kişi',
      avatar: user.avatar || createAvatarFromName(user.name)
    }));
  const defaultFollower = users[0] || defaultUsers[0];
  const customerListOptions = customers
    .map((customer) => customer.name)
    .filter(Boolean);
  const customerOptions = [
    'Müşteri Seçin...',
    ...(customerListOptions.length ? customerListOptions : defaultCustomerOptions.slice(1))
  ];
  const cleanProjectName = String(projectName || '').trim();
  const projectSelectOptions = Array.from(
    new Set([
      ...(cleanProjectName ? [cleanProjectName] : []),
      ...projectOptions.map((project) => String(project || '').trim()).filter(Boolean)
    ])
  );
  const selectedProjectName = cleanProjectName || projectSelectOptions[0] || 'Proje seçilmedi';

  const [form, setForm] = useState({
    title: '',
    status: defaultStatus,
    priority: 'Düşük',
    description: '',
    startDate: '',
    endDate: '',
    tags: '',
    customer: 'Müşteri Seçin...',
    assignees: [],
    followers: [defaultFollower]
  });

  const [openUserPicker, setOpenUserPicker] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [pendingRemoveUser, setPendingRemoveUser] = useState(null);

  // Ref'ler: defaultStatus ve defaultFollower, proje değişince güncellenir.
  // Bunları ref olarak tutuyoruz ki modal açıkken proje değiştiğinde
  // tüm form sıfırlanmasın, sadece status alanı güncellensin.
  const defaultStatusRef = useRef(defaultStatus);
  defaultStatusRef.current = defaultStatus;
  const defaultFollowerRef = useRef(defaultFollower);
  defaultFollowerRef.current = defaultFollower;

  // Ana form başlatma: Modal açılırken veya calendarDefaultDate değişince çalışır.
  // defaultStatus ve defaultFollower intentionally excluded from deps:
  // proje değişince form sıfırlanmasin, sadece status ayrı effect ile güncellenir.
  useEffect(() => {
    if (!isOpen) return;

    setOpenDropdown(null);
    setOpenUserPicker(null);
    setPendingRemoveUser(null);
    setIsClosing(false);

    if (initialData?.id) {
      setForm({
        title: initialData.title || '',
        status: initialData.status || defaultStatusRef.current,
        priority: initialData.priority || 'Düşük',
        description: initialData.description || initialData.richDescription || '',
        startDate: toDisplayDate(initialData.startDate || ''),
        endDate: toDisplayDate(initialData.endDate || initialData.date || ''),
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
        customer: initialData.customer || 'Müşteri Seçin...',
        assignees: initialData.assignees || [],
        followers: initialData.followers?.length ? initialData.followers : [defaultFollowerRef.current]
      });
      return;
    }

    // Takvimden tıklanınca gelen tarih sadece başlangıç tarihine yazılır.
    // Bitiş tarihi bilinçli olarak boş bırakılır.
    const calendarDate = calendarDefaultDate ? toDisplayDate(calendarDefaultDate) : '';

    setForm({
      title: '',
      status: defaultStatusRef.current,
      priority: 'Düşük',
      description: '',
      startDate: calendarDate,
      endDate: '',
      tags: '',
      customer: 'Müşteri Seçin...',
      assignees: [],
      followers: [defaultFollowerRef.current]
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData, calendarDefaultDate]);

  // Sadece status güncellemesi: Kullanıcı banner'dan proje değiştirince
  // yazdığı başlığı silmeden yalnızca durum alanını günceller.
  useEffect(() => {
    if (!isOpen || initialData?.id) return;
    setForm((prev) => ({ ...prev, status: defaultStatus }));
  }, [isOpen, initialData, defaultStatus]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setOpenDropdown(null);
    setOpenUserPicker(null);
    setPendingRemoveUser(null);
    setIsClosing(true);

    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 180);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = (name) => {
    setOpenUserPicker(null);
    setPendingRemoveUser(null);
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const toggleUser = (field, user) => {
    setForm((prev) => {
      const exists = prev[field].some((item) => item.id === user.id);
      return {
        ...prev,
        [field]: exists ? prev[field].filter((item) => item.id !== user.id) : [...prev[field], user]
      };
    });

    setPendingRemoveUser(null);
    setOpenUserPicker(null);
  };

  const removeUser = (field, userId) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((user) => user.id !== userId)
    }));

    setPendingRemoveUser(null);
    setOpenUserPicker(null);
  };

  const handleUserRemoveClick = (field, userId) => {
    const removeKey = `${field}-${userId}`;

    if (pendingRemoveUser === removeKey) {
      removeUser(field, userId);
      return;
    }

    setOpenDropdown(null);
    setOpenUserPicker(null);
    setPendingRemoveUser(removeKey);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      alert('Görev adı boş olamaz.');
      return;
    }

    const task = {
      ...(initialData || {}),
      id: initialData?.id || `task-${Date.now()}`,
      title: form.title.trim(),
      status: form.status,
      priority: form.priority,
      description: form.description.trim(),
      richDescription: form.description.trim(),
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim(),
      date: form.endDate.trim() || form.startDate.trim(),
      tags: form.tags,
      customer: form.customer === 'Müşteri Seçin...' ? '' : form.customer,
      assignees: form.assignees,
      followers: form.followers,
      avatar: initialData?.avatar || 'EZ',
      author: initialData?.author || 'Enes Zariç',
      comments: initialData?.comments || [],
      files: initialData?.files || [],
      steps: initialData?.steps || [],
      history: initialData?.history || [
        {
          id: `history-${Date.now()}`,
          type: 'created',
          text: 'Görev oluşturuldu',
          user: 'Enes Zariç',
          date: new Date().toLocaleString('tr-TR')
        }
      ]
    };

    onSave(task, form.status);
  };

  const selectedPriority = priorityOptions.find((priority) => priority.label === form.priority) || priorityOptions[0];

  return (
    <div className={`fixed inset-0 z-[700] flex items-start justify-center px-5 pt-[92px] pb-5 bg-zinc-950/40 backdrop-blur-[3.5px] ${isClosing ? 'task-modal-overlay-exit' : 'task-modal-overlay-enter'}`}>
      <style>{`
        @keyframes taskModalOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes taskModalIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes taskModalOverlayOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes taskModalOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
        }

        .task-modal-overlay-enter {
          animation: taskModalOverlayIn 160ms ease-out both;
        }

        .task-modal-overlay-exit {
          animation: taskModalOverlayOut 180ms ease-in both;
        }

        .task-modal-enter {
          animation: taskModalIn 190ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .task-modal-exit {
          animation: taskModalOut 180ms ease-in both;
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        onClick={() => {
          setOpenDropdown(null);
          setOpenUserPicker(null);
          setPendingRemoveUser(null);
        }}
        className={`w-full max-w-[690px] bg-white rounded-[13px] shadow-[0_26px_90px_rgba(15,23,42,0.24)] overflow-visible ${isClosing ? 'task-modal-exit' : 'task-modal-enter'}`}
      >
        <div className="relative h-[66px] rounded-t-[13px] bg-white border-b border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white transition-all flex items-center justify-center shadow-sm z-20"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.7" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute left-5 right-14 top-[14px]">
            <h3 className="text-[15px] font-black text-slate-800 tracking-tight">
              {initialData?.id ? 'Görev Düzenle' : 'Görev Ekle'}
            </h3>
            <p className="mt-0.5 text-[10.5px] font-bold text-slate-400">
              Temel bilgileri gir; yorum, dosya, adım ve geçmiş görev detayında yönetilir.
            </p>
          </div>
        </div>

        <div className="p-5 pt-5 pb-4">
          <div className="mb-4 rounded-[12px] bg-slate-50/80 border border-slate-100 px-3.5 py-3">
            <FieldLabel>Proje Seçimi</FieldLabel>

            <div className="flex items-center gap-3">
              <select
                value={selectedProjectName}
                disabled={!canChangeProject || projectSelectOptions.length <= 1}
                onChange={(event) => onProjectChange?.(event.target.value)}
                onClick={(event) => event.stopPropagation()}
                className={`h-9 flex-1 rounded-[10px] border px-3 text-[12px] font-black outline-none transition-all ${
                  canChangeProject && projectSelectOptions.length > 1
                    ? 'bg-white border-[#b8d3ff] text-slate-700 focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/10 cursor-pointer'
                    : 'bg-white/70 border-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                {projectSelectOptions.length > 0 ? (
                  projectSelectOptions.map((project) => (
                    <option key={`task-modal-project-${project}`} value={project}>
                      {project}
                    </option>
                  ))
                ) : (
                  <option value="Proje seçilmedi">Proje seçilmedi</option>
                )}
              </select>

              <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black ${
                canChangeProject
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {canChangeProject ? 'Değiştirilebilir' : 'Kilitli'}
              </span>
            </div>

            <div className="mt-1.5 text-[10px] font-bold text-slate-400">
              {canChangeProject
                ? 'Takvimden görev oluştururken proje seçilebilir.'
                : 'Projeler menüsünden görev oluştururken mevcut proje sabit kalır.'}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_112px_102px_38px] gap-3 items-end">
            <div>
              <FieldLabel>Ad *</FieldLabel>
              <input
                type="text"
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                className="w-full h-9 rounded-[9px] border border-[#b8d3ff] bg-white px-3 text-[12.5px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-blue-500/10 transition-all"
                autoFocus
              />
            </div>

            <div>
              <FieldLabel>Durum *</FieldLabel>
              <CustomSelect
                value={form.status}
                options={columnStatusOptions}
                onChange={(value) => updateField('status', value)}
                open={openDropdown === 'status'}
                onToggle={() => toggleDropdown('status')}
                onClose={closeDropdown}
                menuClassName="w-[150px]"
              />
            </div>

            <div>
              <FieldLabel>Öncelik *</FieldLabel>
              <CustomSelect
                value={form.priority}
                options={priorityOptions}
                onChange={(value) => updateField('priority', value)}
                open={openDropdown === 'priority'}
                onToggle={() => toggleDropdown('priority')}
                onClose={closeDropdown}
                menuClassName="w-[130px]"
                renderValue={(option) => (
                  <span className="flex items-center gap-2" style={{ color: option.color }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: option.color }} />
                    <span>{option.label}</span>
                  </span>
                )}
                renderOption={(option) => option.label}
              />
            </div>

            <div>
              <FieldLabel>Sahip</FieldLabel>
              <div className="w-8 h-8 rounded-full bg-[#8c5220] text-white text-[8px] font-black flex items-center justify-center">
                EZ
              </div>
            </div>
          </div>

          <div className="mt-3">
            <FieldLabel>Açıklama</FieldLabel>
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              className="w-full h-[82px] resize-none rounded-[9px] border border-slate-200 bg-white px-3 py-2.5 text-[12px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#b8d3ff] focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <DateInput
              label="Başlangıç Tarihi"
              value={form.startDate}
              onChange={(value) => updateField('startDate', value)}
            />

            <DateInput
              label="Bitiş Tarihi"
              value={form.endDate}
              onChange={(value) => updateField('endDate', value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <FieldLabel>Etiketler</FieldLabel>
              <input
                type="text"
                value={form.tags}
                onChange={(event) => updateField('tags', event.target.value)}
                placeholder="Etiket ekle"
                className="w-full h-8 rounded-full border border-slate-200 bg-white px-3 text-[11.5px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-blue-300"
              />
            </div>

            <div>
              <FieldLabel>Müşteri</FieldLabel>
              <CustomSelect
                value={form.customer}
                options={customerOptions}
                onChange={(value) => updateField('customer', value)}
                open={openDropdown === 'customer'}
                onToggle={() => toggleDropdown('customer')}
                onClose={closeDropdown}
                buttonClassName="h-8 rounded-full text-[11.5px] font-bold"
                menuClassName="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="relative">
              <div className="flex items-center justify-between">
                <FieldLabel>Görevliler: {form.assignees.length ? `${form.assignees.length} kişi` : 'Hiç Kimse'}</FieldLabel>
              </div>

              <div className="flex items-center gap-1.5 min-h-[28px]">
                {form.assignees.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleUserRemoveClick('assignees', user.id);
                    }}
                    className={`relative group rounded-full transition-all ${
                      pendingRemoveUser === `assignees-${user.id}` ? 'ring-2 ring-red-400 ring-offset-2' : ''
                    }`}
                    title={
                      pendingRemoveUser === `assignees-${user.id}`
                        ? `${user.name} kişisini kaldırmak için tekrar tıkla`
                        : `${user.name} kişisini kaldır`
                    }
                  >
                    <MiniUser user={user} />
                    <span className={`absolute -right-1 -top-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] leading-none font-black flex items-center justify-center transition-opacity ${
                      pendingRemoveUser === `assignees-${user.id}` ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      ×
                    </span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); setOpenDropdown(null); setPendingRemoveUser(null); setOpenUserPicker(openUserPicker === 'assignees' ? null : 'assignees'); }}
                  className="w-7 h-7 rounded-full bg-[#46b16f] text-white text-[16px] font-black flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {openUserPicker === 'assignees' && (
                <div onClick={(event) => event.stopPropagation()}
                  className="absolute left-0 top-[54px] z-[850] w-[210px] rounded-[9px] bg-white border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.16)] p-2">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleUser('assignees', user)}
                        className="w-full h-8 rounded-[7px] px-2 flex items-center gap-2 hover:bg-slate-50 text-left"
                      >
                        <MiniUser user={user} />
                        <span className="text-[11px] font-bold text-slate-600">{user.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-[11px] font-bold text-slate-400">
                      Aktif ekip üyesi yok.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center justify-between">
                <FieldLabel>Takip Edenler:</FieldLabel>
              </div>

              <div className="flex items-center justify-end gap-1.5 min-h-[28px]">
                {form.followers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleUserRemoveClick('followers', user.id);
                    }}
                    className={`relative group rounded-full transition-all ${
                      pendingRemoveUser === `followers-${user.id}` ? 'ring-2 ring-red-400 ring-offset-2' : ''
                    }`}
                    title={
                      pendingRemoveUser === `followers-${user.id}`
                        ? `${user.name} kişisini kaldırmak için tekrar tıkla`
                        : `${user.name} kişisini kaldır`
                    }
                  >
                    <MiniUser user={user} />
                    <span className={`absolute -right-1 -top-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] leading-none font-black flex items-center justify-center transition-opacity ${
                      pendingRemoveUser === `followers-${user.id}` ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      ×
                    </span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); setOpenDropdown(null); setPendingRemoveUser(null); setOpenUserPicker(openUserPicker === 'followers' ? null : 'followers'); }}
                  className="w-7 h-7 rounded-full bg-[#46b16f] text-white text-[16px] font-black flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {openUserPicker === 'followers' && (
                <div onClick={(event) => event.stopPropagation()}
                  className="absolute right-0 top-[54px] z-[850] w-[210px] rounded-[9px] bg-white border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.16)] p-2">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleUser('followers', user)}
                        className="w-full h-8 rounded-[7px] px-2 flex items-center gap-2 hover:bg-slate-50 text-left"
                      >
                        <MiniUser user={user} />
                        <span className="text-[11px] font-bold text-slate-600">{user.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-[11px] font-bold text-slate-400">
                      Aktif ekip üyesi yok.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-[58px] px-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between rounded-b-[13px]">
          <button
            type="button"
            onClick={handleClose}
            className="h-8 px-4 rounded-full bg-white border border-slate-200 text-slate-500 text-[11px] font-black hover:text-slate-800 hover:border-slate-300 transition-all"
          >
            İptal
          </button>

          <button
            type="submit"
            className="h-9 px-5 rounded-full bg-[#2563eb] text-white text-[11px] font-black hover:bg-[#1d4ed8] shadow-[0_9px_20px_rgba(37,99,235,0.22)] transition-all"
          >
            {initialData?.id ? 'Kaydet' : 'Oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
}
