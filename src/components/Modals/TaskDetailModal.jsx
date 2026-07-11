import { useEffect, useRef, useState } from 'react';
import { createAvatarFromName, renderProfileAvatar } from '../../utils/avatarHelpers';
import { formatZrcDate, formatZrcDateRange } from '../../utils/dateDisplayHelpers';

const createTaskDetailHistoryId = () =>
  `history-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function TaskDetailModal({ isOpen, task, columnTitle, onClose, onEdit, onUpdate, onAddComment, onDeleteComment, canEditTask = true, canManageFiles = true, canComment = true, currentAccountType = 'Patron', currentActorId = 'anonymous-user', currentActorName = 'Kullanıcı', currentActorAvatar = 'KU', onUploadFiles = null, onDownloadFile = null, onDeleteFile = null }) {
  const [isClosing, setIsClosing] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('Detaylar');
  const [commentText, setCommentText] = useState('');
  const [openCommentMenuId, setOpenCommentMenuId] = useState(null);
  const [newStepText, setNewStepText] = useState('');
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const lastSavedDescriptionRef = useRef('');
  const commentsEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const closeTimerRef = useRef(null);

  const handleClose = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setIsClosing(false);
      onClose();
    }, 160);
  };

  const getDetailProfileNameForRecord = (record = {}, fallback = 'Kullanıcı') => {
    if (
      record.userId === currentActorId ||
      record.author === currentActorName ||
      record.sender === currentActorName ||
      record.actor === currentActorName
    ) {
      return currentActorName;
    }

    return record.author || record.user || record.sender || record.actor || record.uploader || fallback;
  };

  const getDetailProfileAvatarForRecord = (record = {}, fallback = 'K') => {
    if (
      record.userId === currentActorId ||
      record.author === currentActorName ||
      record.sender === currentActorName ||
      record.actor === currentActorName
    ) {
      return currentActorAvatar;
    }

    return record.avatar || fallback;
  };

  const renderDetailProfileAvatar = (avatar, fallback = 'K') => {
    return renderProfileAvatar(avatar, fallback);
  };

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setActiveDetailTab('Detaylar');
      setCommentText('');
      setOpenCommentMenuId(null);
      setNewStepText('');
      setIsUploadingFiles(false);
      setDescriptionDraft(task?.description || '');
      lastSavedDescriptionRef.current = task?.description || '';
    }
  }, [isOpen, task?.id]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscapeKey = (event) => {
      if (event.key !== 'Escape') return;

      event.preventDefault();
      handleClose();
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (isOpen && activeDetailTab === 'Yorumlar') {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isOpen, activeDetailTab, task?.comments?.length]);

  useEffect(() => {
    if (isOpen) {
      setDescriptionDraft(task?.description || '');
      lastSavedDescriptionRef.current = task?.description || '';
    }
  }, [isOpen, task?.id]);

  if (!isOpen && !isClosing) return null;
  if (!task) return null;

  const sendComment = async () => {
    if (!canComment) return;

    const cleanComment = commentText.trim();
    if (!cleanComment) return;

    const saved = await onAddComment(task.id, cleanComment);
    if (!saved) return;

    setCommentText('');
    setOpenCommentMenuId(null);

    window.setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 80);
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '-';

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileTypeLabel = (fileName = '') => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) return 'Görsel';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return 'Video';
    if (['pdf'].includes(extension)) return 'PDF';
    if (['doc', 'docx'].includes(extension)) return 'Word';
    if (['xls', 'xlsx'].includes(extension)) return 'Excel';
    if (['ppt', 'pptx'].includes(extension)) return 'Sunum';

    return extension ? extension.toUpperCase() : 'Dosya';
  };

  const handleFilesSelected = async (event) => {
    if (!canManageFiles) {
      event.target.value = '';
      return;
    }

    const inputElement = event.target;
    const selectedFiles = Array.from(inputElement.files || []);
    if (!selectedFiles.length) return;

    const now = new Date();
    setIsUploadingFiles(true);

    try {
      let newFiles = [];

      if (typeof onUploadFiles === 'function') {
        newFiles = await onUploadFiles(task, selectedFiles, getFileTypeLabel);

        if (!Array.isArray(newFiles) || newFiles.length === 0) {
          await window.zrcAlert('Dosyalar Supabase’e yüklenemedi; görev kaydına eklenmedi.');
          return;
        }
      } else {
        newFiles = selectedFiles.map((file) => ({
          id: globalThis.crypto?.randomUUID?.() || `file-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: file.name,
          type: getFileTypeLabel(file.name),
          size: file.size,
          uploader: currentActorName,
          avatar: currentActorAvatar,
          userId: currentActorId,
          date: `${now.getDate()} ${now.toLocaleString('tr-TR', { month: 'long' })} ${now.getFullYear()}`,
          time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }));
      }

      await onUpdate(
        task.id,
        { files: [...(task.files || []), ...newFiles] },
        {
          id: createTaskDetailHistoryId(),
          type: 'file',
          title: selectedFiles.length > 1 ? `${selectedFiles.length} dosya eklendi` : 'Dosya eklendi',
          description: selectedFiles.map((file) => file.name).join(', '),
          actor: currentActorName,
          avatar: currentActorAvatar,
          userId: currentActorId,
          date: `${now.getDate()} ${now.toLocaleString('tr-TR', { month: 'long' })} ${now.getFullYear()}`,
          time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        }
      );
    } finally {
      setIsUploadingFiles(false);
      inputElement.value = '';
    }
  };

  const deleteTaskFile = async (fileId) => {
    if (!canManageFiles) return;

    const deletedFile = (task.files || []).find((file) => file.id === fileId);

    if (deletedFile && typeof onDeleteFile === 'function') {
      const deleted = await onDeleteFile(deletedFile);

      if (!deleted) {
        await window.zrcAlert('Dosya Supabase’den silinemedi; görev kaydı değiştirilmedi.');
        return;
      }
    }

    await onUpdate(
      task.id,
      {
        files: (task.files || []).filter((file) => file.id !== fileId)
      },
      {
        id: createTaskDetailHistoryId(),
        type: 'file-delete',
        title: 'Dosya silindi',
        description: deletedFile?.name || '',
        actor: currentActorName,
        avatar: currentActorAvatar,
        userId: currentActorId,
        date: `${new Date().getDate()} ${new Date().toLocaleString('tr-TR', { month: 'long' })} ${new Date().getFullYear()}`,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
    );
  };

  const addTaskStep = async () => {
    if (!canEditTask) return;

    const cleanStep = newStepText.trim();
    if (!cleanStep) return;

    const newStep = {
      id: globalThis.crypto?.randomUUID?.() || `step-${Date.now()}`,
      text: cleanStep,
      completed: false
    };

    const saved = await onUpdate(
      task.id,
      { steps: [...(task.steps || []), newStep] },
      {
        id: createTaskDetailHistoryId(),
        type: 'step',
        title: 'Adım eklendi',
        description: cleanStep,
        actor: currentActorName,
        avatar: currentActorAvatar,
        userId: currentActorId,
        date: `${new Date().getDate()} ${new Date().toLocaleString('tr-TR', { month: 'long' })} ${new Date().getFullYear()}`,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
    );

    if (saved) setNewStepText('');
  };

  const toggleTaskStep = async (stepId) => {
    if (!canEditTask) return;

    const selectedStep = (task.steps || []).find((step) => step.id === stepId);
    const willComplete = !selectedStep?.completed;

    await onUpdate(
      task.id,
      {
        steps: (task.steps || []).map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        )
      },
      {
        id: createTaskDetailHistoryId(),
        type: 'step',
        title: willComplete ? 'Adım tamamlandı' : 'Adım tekrar açıldı',
        description: selectedStep?.text || '',
        actor: currentActorName,
        avatar: currentActorAvatar,
        userId: currentActorId,
        date: `${new Date().getDate()} ${new Date().toLocaleString('tr-TR', { month: 'long' })} ${new Date().getFullYear()}`,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
    );
  };

  const deleteTaskStep = async (stepId) => {
    if (!canEditTask) return;

    const deletedStep = (task.steps || []).find((step) => step.id === stepId);

    await onUpdate(
      task.id,
      {
        steps: (task.steps || []).filter((step) => step.id !== stepId)
      },
      {
        id: createTaskDetailHistoryId(),
        type: 'step-delete',
        title: 'Adım silindi',
        description: deletedStep?.text || '',
        actor: currentActorName,
        avatar: currentActorAvatar,
        userId: currentActorId,
        date: `${new Date().getDate()} ${new Date().toLocaleString('tr-TR', { month: 'long' })} ${new Date().getFullYear()}`,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
    );
  };

  const completedStepsCount = (task.steps || []).filter((step) => step.completed).length;
  const totalStepsCount = (task.steps || []).length;
  const stepsProgress = totalStepsCount > 0 ? Math.round((completedStepsCount / totalStepsCount) * 100) : 0;

  const saveDescriptionDraft = async () => {
    if (!canEditTask) return;

    const currentValue = descriptionDraft;
    const previousValue = lastSavedDescriptionRef.current;

    if (currentValue === previousValue) return;

    const saved = await onUpdate(
      task.id,
      { description: currentValue },
      {
        id: createTaskDetailHistoryId(),
        type: 'description',
        title: 'Açıklama güncellendi',
        description: currentValue ? 'Görev açıklaması düzenlendi.' : 'Görev açıklaması temizlendi.',
        actor: currentActorName,
        avatar: currentActorAvatar,
        userId: currentActorId,
        date: `${new Date().getDate()} ${new Date().toLocaleString('tr-TR', { month: 'long' })} ${new Date().getFullYear()}`,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
    );

    if (saved) lastSavedDescriptionRef.current = currentValue;
  };

  const getHistoryIcon = (type) => {
    if (type === 'comment') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }

    if (type === 'file') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.56 18.31a1.5 1.5 0 11-2.122-2.122l9.879-9.879" />
        </svg>
      );
    }

    if (type === 'step') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
    }

    if (type === 'description') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L9.75 16.902 6 18l1.098-3.75L16.862 4.487z" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M10 11v6M14 11v6M9 7V5.75A1.75 1.75 0 0110.75 4h2.5A1.75 1.75 0 0115 5.75V7m-8 0l.75 12A2 2 0 009.75 21h4.5a2 2 0 002-1.875L17 7" />
      </svg>
    );
  };

  const taskHistory = task.history || [];

  const assignees = task.assignees || [];
  const followers = task.followers || [];
  const taskTags = Array.isArray(task.tags)
    ? task.tags
    : String(task.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
  const visibleDate = formatZrcDateRange(
    task.startDate || task.start_date || '',
    task.endDate || task.end_date || task.dueDate || task.due_date || task.date || '',
    { fallback: '' }
  );

  const detailTabs = ['Detaylar', 'Yorumlar', 'Dosyalar', 'Adımlar', 'Geçmiş'];

  return (
    <div
      className={`fixed inset-0 z-[540] flex items-start justify-center px-5 pt-[92px] pb-5 bg-zinc-950/40 backdrop-blur-[3.5px] ${isClosing ? 'animate-overlay-out' : 'animate-overlay-in'}`}
      onMouseDown={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
        className={`w-full max-w-[790px] max-h-[82vh] bg-white rounded-[13px] shadow-[0_26px_90px_rgba(15,23,42,0.24)] overflow-visible flex flex-col ${isClosing ? 'animate-modal-out' : 'animate-modal'}`}
      >
        <div className="relative h-[90px] bg-white border-b border-slate-100 shrink-0">
          <button
            type="button"
            aria-label="Görev detayını kapat"
            onClick={handleClose}
            className="absolute right-3 top-3 w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white transition-all flex items-center justify-center shadow-sm z-30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.7" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute left-5 right-5 top-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-6 px-3 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 flex items-center">
                  {columnTitle || 'Görev'}
                </span>

                {task.priority && (
                  <span className="h-6 px-3 rounded-full bg-orange-50 text-[10px] font-black text-orange-600 flex items-center">
                    {task.priority}
                  </span>
                )}
              </div>

              <h3 id="task-detail-modal-title" className="text-[17px] font-black text-slate-800 tracking-tight truncate">
                {task.title}
              </h3>
            </div>

            {canEditTask && (
              <button
                type="button"
                onClick={onEdit}
                className="h-7 px-3.5 rounded-full bg-[#2563eb] text-white text-[10.5px] font-black hover:bg-[#1d4ed8] shadow-[0_8px_18px_rgba(37,99,235,0.22)] transition-all shrink-0 mr-10"
              >
                Düzenle
              </button>
            )}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-end gap-5">
            {detailTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveDetailTab(tab)}
                className={`relative h-[34px] min-w-[62px] px-1 text-[10.5px] font-extrabold transition-all ${
                  activeDetailTab === tab ? 'text-slate-700' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
                {activeDetailTab === tab && (
                  <span className="absolute left-3 right-3 bottom-0 h-[2px] rounded-full bg-[#30b969]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f7f8fa]">
          {!canEditTask && currentAccountType === 'Ekip Üyesi' && (
            <div className="mx-4 mt-4 rounded-[10px] border border-zinc-200 bg-white px-3.5 py-2.5 text-[11px] font-black text-zinc-500">
              Bu görev sana atanmadığı için sadece görüntüleyebilirsin.
            </div>
          )}

          {activeDetailTab === 'Detaylar' ? (
            <div className="grid grid-cols-[1fr_250px] gap-4 p-4">
              <section className="bg-white border border-slate-200 rounded-[10px] p-4 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.08em] mb-2">
                  Açıklama
                </div>

                {canEditTask ? (
                  <textarea
                    value={descriptionDraft}
                    onChange={(event) => {
                      setDescriptionDraft(event.target.value);
                      onUpdate(task.id, { description: event.target.value });
                    }}
                    onBlur={saveDescriptionDraft}
                    placeholder="Bu görev için açıklama ekle..."
                    className="w-full min-h-[120px] resize-none rounded-[8px] bg-slate-50 border border-slate-100 p-3 text-[12.5px] font-medium text-slate-600 leading-relaxed placeholder:text-slate-300 focus:outline-none focus:border-[#46b16f]/50 focus:ring-4 focus:ring-[#46b16f]/5 transition-all custom-scrollbar"
                  />
                ) : (
                  <div className="min-h-[120px] rounded-[8px] bg-slate-50 border border-slate-100 p-3 text-[12.5px] font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {task.description || 'Açıklama eklenmemiş.'}
                  </div>
                )}

                {taskTags.length > 0 && (
                  <div className="mt-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.08em] mb-2">
                      Etiketler
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {taskTags.map((tag) => (
                        <span
                          key={tag}
                          className="h-7 px-3 rounded-full bg-zinc-100 text-zinc-700 text-[10.5px] font-black flex items-center"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <aside className="space-y-2.5">
                <section className="bg-white border border-slate-200 rounded-[10px] p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.08em] mb-3">
                    Görev Bilgileri
                  </div>

                  <div className="space-y-2.5 text-[11.5px] font-bold">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Durum</span>
                      <span className="text-slate-700">{columnTitle || '-'}</span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Tarih</span>
                      <span className="text-slate-700 text-right">{visibleDate || '-'}</span>
                    </div>

                    {currentAccountType === 'Patron' && (
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-400">Müşteri</span>
                        <span className="text-slate-700 text-right truncate max-w-[135px]">
                          {task.customer && task.customer !== 'Müşteri Seçin...' ? task.customer : '-'}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Öncelik</span>
                      <span className="text-slate-700">{task.priority || '-'}</span>
                    </div>
                  </div>
                </section>

                <section className="bg-white border border-slate-200 rounded-[10px] p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.08em] mb-3">
                    Görevliler
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {assignees.length > 0 ? (
                      assignees.map((user) => (
                        <div key={user.id} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full pl-1 pr-3 py-1">
                          <span className="w-5 h-5 rounded-full bg-[#8c5220] text-white text-[8px] font-black flex items-center justify-center">
                            {user.avatar}
                          </span>
                          <span className="text-[10.5px] font-black text-slate-600">{user.name}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">Kimse atanmadı.</span>
                    )}
                  </div>
                </section>

                <section className="bg-white border border-slate-200 rounded-[10px] p-3.5 shadow-[0_8px_22px_rgba(15,23,42,0.035)]">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.08em] mb-3">
                    Takip Edenler
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {followers.length > 0 ? (
                      followers.map((user) => (
                        <div key={user.id} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full pl-1 pr-3 py-1">
                          <span className="w-5 h-5 rounded-full bg-[#8c5220] text-white text-[8px] font-black flex items-center justify-center">
                            {user.avatar}
                          </span>
                          <span className="text-[10.5px] font-black text-slate-600">{user.name}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">Takipçi yok.</span>
                    )}
                  </div>
                </section>
              </aside>
            </div>
          ) : activeDetailTab === 'Yorumlar' ? (
            <div className="p-4">
              <section className="bg-white rounded-[10px] shadow-[0_8px_22px_rgba(15,23,42,0.025)] overflow-visible">
                <div className="h-[52px] px-4 border-b border-slate-100/60 flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-black text-slate-700">Yorumlar</div>
                    <div className="text-[10px] font-bold text-slate-400">
                      Enter gönderir, Shift + Enter alt satıra geçer
                    </div>
                  </div>

                  <span className="h-7 px-3 rounded-full bg-slate-50 text-[10px] font-black text-slate-400 flex items-center">
                    {(task.comments || []).length} yorum
                  </span>
                </div>

                <div className="h-[260px] overflow-y-auto custom-scrollbar p-4 space-y-2.5 bg-slate-50/45">
                  {(task.comments || []).length > 0 ? (
                    task.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 group/comment">
                        <div className="w-8 h-8 rounded-full bg-[#8c5220] text-white text-[9.5px] font-black flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                          {renderDetailProfileAvatar(getDetailProfileAvatarForRecord(comment, createAvatarFromName(getDetailProfileNameForRecord(comment, 'EK'))), createAvatarFromName(getDetailProfileNameForRecord(comment, 'EK')))}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11.5px] font-black text-slate-700">{getDetailProfileNameForRecord(comment, 'Kullanıcı')}</span>
                            <span className="h-5 px-2 rounded-full bg-slate-100/70 text-[9px] font-black text-slate-400 flex items-center">
                              {formatZrcDate(comment.date, { fallback: comment.date || '' })}
                            </span>
                            <span className="h-5 px-2 rounded-full bg-slate-100/70 text-[9px] font-black text-slate-400 flex items-center">
                              {comment.time}
                            </span>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="inline-block max-w-full rounded-[10px] rounded-tl-[3px] bg-white px-3 py-2 text-[12px] font-medium text-slate-600 leading-relaxed shadow-[0_6px_16px_rgba(15,23,42,0.045)] whitespace-pre-wrap">
                              {comment.text}
                            </div>

                            {canEditTask && (
                              <div className="relative opacity-0 group-hover/comment:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => setOpenCommentMenuId(openCommentMenuId === comment.id ? null : comment.id)}
                                  className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white border border-transparent flex items-center justify-center"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                  </svg>
                                </button>

                                {openCommentMenuId === comment.id && (
                                  <div className="absolute right-0 top-[calc(100%+5px)] w-28 bg-white border border-slate-200 rounded-[8px] shadow-[0_14px_34px_rgba(15,23,42,0.16)] p-1 z-[30]">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onDeleteComment(task.id, comment.id);
                                        setOpenCommentMenuId(null);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-[6px] text-left text-[10.5px] font-black text-red-500 hover:bg-red-50 transition-all"
                                    >
                                      Yorumu sil
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.924-.924 5.972 5.972 0 001.057-4.035A8.287 8.287 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                      </div>
                      <div className="text-[12px] font-black text-slate-600">Henüz yorum yok</div>
                      <div className="text-[10.5px] font-bold text-slate-400 mt-1">İlk yorumu sen yaz.</div>
                    </div>
                  )}
                  <div ref={commentsEndRef} />
                </div>

                {canComment && (
                  <div className="p-3 border-t border-slate-100/60 bg-white">
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#8c5220] text-white text-[9.5px] font-black flex items-center justify-center shrink-0">
                        EZ
                      </div>

                      <textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            sendComment();
                          }
                        }}
                        placeholder="Yorum yaz..."
                        className="flex-1 h-[42px] max-h-[90px] resize-none rounded-[10px] border border-transparent bg-slate-100/70 px-3 py-2 text-[12px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#46b16f]/50 focus:ring-4 focus:ring-[#46b16f]/5 transition-all custom-scrollbar"
                      />

                      <button
                        type="button"
                        onClick={sendComment}
                        disabled={!commentText.trim()}
                        className="h-[42px] px-4 rounded-[10px] bg-[#46b16f] text-white text-[11px] font-black hover:bg-[#329a5c] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_9px_20px_rgba(70,177,111,0.20)]"
                      >
                        Gönder
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          ) : activeDetailTab === 'Dosyalar' ? (
            <div className="p-4">
              <section className="bg-white border border-slate-200 rounded-[10px] shadow-[0_8px_22px_rgba(15,23,42,0.035)] overflow-hidden">
                <div className="h-[58px] px-4 border-b border-slate-100/60 flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-black text-slate-700">Dosyalar</div>
                    <div className="text-[10px] font-bold text-slate-400">
                      Bu göreve ait görsel, PDF, video ve çalışma dosyaları
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-7 px-3 rounded-full bg-slate-50 text-[10px] font-black text-slate-400 flex items-center">
                      {(task.files || []).length} dosya
                    </span>

                    {canManageFiles && (
                      <>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 px-3.5 rounded-full bg-[#2563eb] text-white text-[10.5px] font-black hover:bg-[#1d4ed8] shadow-[0_8px_18px_rgba(37,99,235,0.18)] transition-all flex items-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V3.75m0 0L7.5 8.25M12 3.75l4.5 4.5M3.75 16.5v1.875A1.875 1.875 0 005.625 20.25h12.75a1.875 1.875 0 001.875-1.875V16.5" />
                          </svg>
                          {isUploadingFiles ? 'Yükleniyor...' : 'Dosya Yükle'}
                        </button>

                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFilesSelected}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="min-h-[320px] bg-[#fbfcfd] p-4">
                  {(task.files || []).length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {(task.files || []).map((file) => (
                        <div
                          key={file.id}
                          className="group relative bg-white border border-slate-200 rounded-[10px] p-3 shadow-sm hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-[10px] bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-.988-2.387l-4.5-4.5A3.375 3.375 0 0011.625 3.75H8.25A2.25 2.25 0 006 6v12a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 18v-3.75" />
                              </svg>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="text-[12px] font-black text-slate-700 truncate" title={file.name}>
                                {file.name}
                              </div>

                              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                <span className="h-5 px-2 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400">
                                  {file.type}
                                </span>
                                <span className="h-5 px-2 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400">
                                  {formatFileSize(file.size)}
                                </span>
                              </div>

                              <div className="mt-2 flex items-center gap-1.5 text-[9.5px] font-bold text-slate-400">
                                <span className="w-5 h-5 rounded-full bg-[#8c5220] text-white text-[7px] font-black flex items-center justify-center">
                                  {file.avatar || createAvatarFromName(file.uploader || currentActorName)}
                                </span>
                                <span>{file.uploader}</span>
                                <span>·</span>
                                <span>{formatZrcDate(file.date, { fallback: file.date || '' })}</span>
                                <span>{file.time}</span>
                              </div>
                            </div>

                            {canManageFiles && (
                              <div className="relative">
                                <button
                                  type="button"
                                  className="w-7 h-7 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-all"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                  </svg>
                                </button>

                                <div className="absolute right-0 top-[calc(100%+5px)] w-32 bg-white border border-slate-200 rounded-[8px] shadow-[0_14px_34px_rgba(15,23,42,0.16)] p-1 z-[30] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
                                  <button
                                    type="button"
                                    onClick={() => onDownloadFile?.(file)}
                                    className="w-full px-2.5 py-1.5 rounded-[6px] text-left text-[10.5px] font-black text-slate-600 hover:bg-slate-50 transition-all"
                                  >
                                    İndir
                                  </button>
                                  <button
                                    type="button"
                                    className="w-full px-2.5 py-1.5 rounded-[6px] text-left text-[10.5px] font-black text-slate-600 hover:bg-slate-50 transition-all"
                                  >
                                    Yeniden adlandır
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteTaskFile(file.id)}
                                    className="w-full px-2.5 py-1.5 rounded-[6px] text-left text-[10.5px] font-black text-red-500 hover:bg-red-50 transition-all"
                                  >
                                    Sil
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 rounded-full bg-white border border-slate-200 text-slate-300 flex items-center justify-center shadow-sm mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.56 18.31a1.5 1.5 0 11-2.122-2.122l9.879-9.879" />
                        </svg>
                      </div>

                      <div className="text-[13px] font-black text-slate-600">
                        Bu göreve henüz dosya eklenmedi
                      </div>

                      <div className="text-[10.5px] font-bold text-slate-400 mt-1 max-w-[300px]">
                        Tasarım, brief, PDF, video veya çalışma dosyalarını buraya ekleyebilirsin.
                      </div>

                      {canManageFiles && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-4 h-8 px-4 rounded-full bg-[#2563eb] text-white text-[10.5px] font-black hover:bg-[#1d4ed8] shadow-[0_8px_18px_rgba(37,99,235,0.18)] transition-all"
                        >
                          Dosya Yükle
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : activeDetailTab === 'Adımlar' ? (
            <div className="p-4">
              <section className="bg-white rounded-[10px] shadow-[0_8px_22px_rgba(15,23,42,0.025)] overflow-hidden">
                <div className="h-[64px] px-4 border-b border-slate-100/60 flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-black text-slate-700">Adımlar</div>
                    <div className="text-[10px] font-bold text-slate-400">
                      Görevi küçük yapılacaklara böl ve ilerlemeyi takip et
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[11px] font-black text-slate-700">
                        {completedStepsCount}/{totalStepsCount} tamamlandı
                      </div>
                      <div className="text-[9.5px] font-bold text-slate-400">
                        %{stepsProgress} ilerleme
                      </div>
                    </div>

                    <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#46b16f] transition-all duration-300"
                        style={{ width: `${stepsProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/45 min-h-[320px]">
                  {canEditTask && (
                    <div className="flex items-center gap-2 bg-white rounded-[10px] p-2 shadow-[0_6px_16px_rgba(15,23,42,0.035)]">
                      <input
                        value={newStepText}
                        onChange={(event) => setNewStepText(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            addTaskStep();
                          }
                        }}
                        placeholder="Yeni adım ekle..."
                        className="flex-1 h-9 px-3 rounded-[8px] bg-slate-50 border border-transparent text-[12px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#46b16f]/5 transition-all"
                      />

                      <button
                        type="button"
                        onClick={addTaskStep}
                        disabled={!newStepText.trim()}
                        className="h-9 px-4 rounded-[8px] bg-[#46b16f] text-white text-[10.5px] font-black hover:bg-[#329a5c] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        Ekle
                      </button>
                    </div>
                  )}

                  {(task.steps || []).length > 0 ? (
                    <div className="mt-4 space-y-2.5">
                      {(task.steps || []).map((step, index) => (
                        <div
                          key={step.id}
                          className={`group flex items-center gap-3 bg-white rounded-[10px] px-2.5 py-1.5 shadow-[0_6px_16px_rgba(15,23,42,0.035)] transition-all ${
                            step.completed ? 'opacity-70' : 'hover:shadow-[0_10px_22px_rgba(15,23,42,0.06)]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleTaskStep(step.id)}
                            disabled={!canEditTask}
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                              step.completed
                                ? 'bg-[#46b16f] border-[#46b16f] text-white'
                                : 'bg-white border-slate-300 text-transparent'
                            } ${canEditTask ? 'hover:border-[#46b16f]' : 'cursor-default'}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>

                          <div className="w-5 h-5 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black flex items-center justify-center shrink-0">
                            {index + 1}
                          </div>

                          <div
                            className={`flex-1 min-w-0 text-[12.5px] font-bold transition-all ${
                              step.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                            }`}
                          >
                            {step.text}
                          </div>

                          {canEditTask && (
                            <button
                              type="button"
                              onClick={() => deleteTaskStep(step.id)}
                              className="w-7 h-7 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M10 11v6M14 11v6M9 7V5.75A1.75 1.75 0 0110.75 4h2.5A1.75 1.75 0 0115 5.75V7m-8 0l.75 12A2 2 0 009.75 21h4.5a2 2 0 002-1.875L17 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[230px] flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 rounded-full bg-white text-slate-300 flex items-center justify-center shadow-sm mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>

                      <div className="text-[13px] font-black text-slate-600">
                        Henüz adım eklenmedi
                      </div>

                      <div className="text-[10.5px] font-bold text-slate-400 mt-1 max-w-[310px]">
                        {canEditTask ? 'Görevi parçalara bölmek için yukarıdan ilk adımı ekleyebilirsin.' : 'Bu görev için henüz adım oluşturulmamış.'}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : activeDetailTab === 'Geçmiş' ? (
            <div className="p-4">
              <section className="bg-white rounded-[10px] shadow-[0_8px_22px_rgba(15,23,42,0.025)] overflow-hidden">
                <div className="h-[58px] px-4 border-b border-slate-100/60 flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-black text-slate-700">Geçmiş</div>
                    <div className="text-[10px] font-bold text-slate-400">
                      Görev üzerinde yapılan işlemler otomatik kaydedilir
                    </div>
                  </div>

                  <span className="h-7 px-3 rounded-full bg-slate-50 text-[10px] font-black text-slate-400 flex items-center">
                    {taskHistory.length} kayıt
                  </span>
                </div>

                <div className="min-h-[320px] bg-slate-50/45 p-4">
                  {taskHistory.length > 0 ? (
                    <div className="relative pl-5">
                      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-slate-200" />

                      <div className="space-y-2.5">
                        {taskHistory.map((item) => (
                          <div key={item.id} className="relative">
                            <div className={`absolute -left-[19px] top-2 w-7 h-7 rounded-full shadow-sm flex items-center justify-center ${
                              item.type?.includes('delete')
                                ? 'bg-red-50 text-red-500'
                                : item.type === 'step'
                                  ? 'bg-green-50 text-green-600'
                                  : item.type === 'file'
                                    ? 'bg-zinc-100 text-zinc-700'
                                    : item.type === 'comment'
                                      ? 'bg-indigo-50 text-indigo-600'
                                      : 'bg-zinc-100 text-zinc-700'
                            }`}>
                              {getHistoryIcon(item.type)}
                            </div>

                            <div className="bg-white rounded-[10px] px-3.5 py-3 shadow-[0_6px_16px_rgba(15,23,42,0.035)]">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-[12px] font-black text-slate-700">
                                    {item.title}
                                  </div>

                                  {item.description && (
                                    <div className="mt-1 text-[11px] font-medium text-slate-500 leading-relaxed whitespace-pre-wrap">
                                      {item.description}
                                    </div>
                                  )}
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="text-[9.5px] font-black text-slate-400">
                                    {formatZrcDate(item.date, { fallback: item.date || '' })}
                                  </div>
                                  <div className="text-[9.5px] font-black text-slate-300 mt-0.5">
                                    {item.time}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-[#8c5220] text-white text-[7px] font-black flex items-center justify-center">
                                  {item.avatar || createAvatarFromName(item.actor || currentActorName)}
                                </span>
                                <span className="text-[9.5px] font-black text-slate-400">
                                  {item.actor || currentActorName}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 rounded-full bg-white text-slate-300 flex items-center justify-center shadow-sm mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                        </svg>
                      </div>

                      <div className="text-[13px] font-black text-slate-600">
                        Henüz geçmiş kaydı yok
                      </div>

                      <div className="text-[10.5px] font-bold text-slate-400 mt-1 max-w-[330px]">
                        Açıklama, yorum, dosya veya adım işlemleri yapıldığında burada timeline olarak görünecek.
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div className="h-[320px] flex flex-col items-center justify-center text-center text-slate-400">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                </svg>
              </div>
              <div className="text-[13px] font-black text-slate-600">{activeDetailTab}</div>
              <div className="text-[11px] font-bold mt-1">Bu bölüm sonraki adımda geliştirilecek.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;
