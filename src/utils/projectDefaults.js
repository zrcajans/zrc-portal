// ZRC project defaults and toast helpers
// Bu dosya v505 ile App.jsx içinden ayrıldı.
// Not: createDataSnapshot App.jsx içinde bırakıldı; APP_DATA_VERSION tarafına dokunulmadı.

export const defaultBoardColumns = [
  { id: 'col-1', title: 'Yeni Görev', color: '#ffcb78', desc: 'Yeni oluşturulan görevler bu aşamada bekler.', tasks: [] },
  { id: 'col-2', title: 'Aktif', color: '#083f1f', desc: 'Bu aşamada aktif/üzerinde çalışılan işler yer alır.', tasks: [] },
  { id: 'col-3', title: 'Tamamlandı', color: '#bbcee4', desc: 'Bu aşamada tamamlanmış işler yer alır.', tasks: [] },
  { id: 'col-4', title: 'Askıya Alındı', color: '#a594ed', desc: 'Bu aşamada askıya alınmış işler yer alır.', tasks: [] }
];

export const normalizeColumnTitleForDisplay = (title = '') => {
  const cleanTitle = String(title || '').trim();
  return cleanTitle === 'Bekliyor' ? 'Yeni Görev' : cleanTitle;
};

export const createDefaultProjectBoard = () => ({
  columns: defaultBoardColumns.map((column) => ({
    ...column,
    tasks: []
  })),
  archivedTasks: []
});

export const createDefaultProjectSettings = (projectName = '') => ({
  title: projectName,
  description: '',
  customer: '',
  customerId: '',
  teamMemberIds: [],
  teamHistory: [],
  status: 'Aktif',
  color: '#ff3600'
});

export const getZrcToastMessage = (message = '', tone = 'saved') => {
  const cleanMessage = String(message || '').trim();

  if (tone === 'error') {
    return cleanMessage || 'İşlem tamamlanamadı.';
  }

  if (/profil|tercih/i.test(cleanMessage)) return 'Profil güncellendi ve kaydedildi.';
  if (/ekip|rol/i.test(cleanMessage)) return 'Ekip bilgileri güncellendi ve kaydedildi.';
  if (/müşteri|musteri/i.test(cleanMessage)) return 'Müşteri bilgileri güncellendi ve kaydedildi.';
  if (/proje/i.test(cleanMessage)) return 'Proje bilgileri güncellendi ve kaydedildi.';
  if (/görev|gorev|durum/i.test(cleanMessage)) return 'Görev güncellendi ve kaydedildi.';
  if (/not/i.test(cleanMessage)) return 'Not güncellendi ve kaydedildi.';
  if (/mesaj|yazışma|yazisma/i.test(cleanMessage)) return 'Yazışma güncellendi ve kaydedildi.';
  if (/dosya/i.test(cleanMessage)) return 'Dosya işlemi tamamlandı.';
  if (/yedek/i.test(cleanMessage)) return 'Yedekleme işlemi tamamlandı.';

  return cleanMessage || 'Güncellendi ve kaydedildi.';
};

export const showZrcUpdateToast = () => {
  return;
};
