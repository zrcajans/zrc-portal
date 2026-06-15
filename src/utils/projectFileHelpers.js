// ZRC project file helper functions
// Bu dosya v503 ile App.jsx içinden ayrıldı.

export const formatProjectFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '-';

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

export const getProjectFileIconStyle = (type = '') => {
    if (type === 'Görsel') return 'bg-emerald-50 text-emerald-600';
    if (type === 'Video') return 'bg-purple-50 text-purple-600';
    if (type === 'PDF') return 'bg-red-50 text-red-600';
    if (type === 'Word') return 'bg-zinc-100 text-zinc-700';
    if (type === 'Excel') return 'bg-green-50 text-green-600';
    if (type === 'Sunum') return 'bg-zinc-100 text-zinc-700';

    return 'bg-slate-50 text-slate-500';
  };

export const buildProjectFileSecondaryText = (
  file = {},
  {
    currentAccountType = '',
    selectedProject = ''
  } = {}
) => {
  if (currentAccountType === 'Patron') return file.taskTitle || 'Görev yok';
  if (currentAccountType === 'Müşteri') return file.projectName || selectedProject || 'Proje dosyası';

  return file.taskTitle || file.projectName || selectedProject || 'Görev dosyası';
};

export const buildProjectFileInfoRows = (
  file = {},
  {
    currentAccountType = '',
    selectedProject = '',
    currentProfileName = ''
  } = {}
) => {
  if (currentAccountType === 'Patron') {
    return [
      ['Bağlı Görev', file.taskTitle],
      ['Kolon', file.columnTitle],
      ['Müşteri', file.customer],
      ['Yükleyen', file.uploader || currentProfileName],
      ['Tarih', `${file.date || '-'} ${file.time || ''}`]
    ];
  }

  if (currentAccountType === 'Müşteri') {
    return [
      ['Bağlı Görev', file.taskTitle],
      ['Proje', file.projectName || selectedProject],
      ['Tür', file.type || 'Dosya'],
      ['Tarih', `${file.date || '-'} ${file.time || ''}`]
    ];
  }

  return [
    ['Bağlı Görev', file.taskTitle],
    ['Kolon', file.columnTitle],
    ['Proje', file.projectName || selectedProject],
    ['Yükleyen', file.uploader || currentProfileName],
    ['Tarih', `${file.date || '-'} ${file.time || ''}`]
  ];
};
