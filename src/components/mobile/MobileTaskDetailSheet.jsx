import { useEffect, useRef, useState } from 'react';
import { formatZrcDate } from '../../utils/dateDisplayHelpers';

const createMobileTaskDescriptionHistory = (description = '') => {
  const now = new Date();

  return {
    id: `history-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: 'description',
    title: description ? 'Açıklama güncellendi' : 'Açıklama kaldırıldı',
    description: description ? 'Görev açıklaması düzenlendi.' : 'Görev açıklaması temizlendi.',
    date: `${now.getDate()} ${now.toLocaleString('tr-TR', { month: 'long' })} ${now.getFullYear()}`,
    time: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  };
};

export default function MobileTaskDetailSheet({
  task,
  columnTitle = '',
  assignees = [],
  taskSteps = [],
  onClose,
  onUpdateTaskDescription
}) {
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [saveState, setSaveState] = useState('idle');
  const lastSavedDescriptionRef = useRef('');
  const saveTimerRef = useRef(null);

  const taskTitle = task?.title || 'Adsız görev';
  const taskStartDate = formatZrcDate(task?.startDate || task?.start_date, { fallback: '' });
  const taskDueDate = formatZrcDate(
    task?.dueDate || task?.due_date || task?.endDate || task?.end_date,
    { fallback: '' }
  );
  const safeAssignees = Array.isArray(assignees) ? assignees : [];
  const safeTaskSteps = Array.isArray(taskSteps) ? taskSteps : [];
  const canEditDescription = typeof onUpdateTaskDescription === 'function';
  const hasDescriptionChanges = descriptionDraft !== lastSavedDescriptionRef.current;

  useEffect(() => {
    const nextDescription = String(task?.description || task?.detail || '');
    setDescriptionDraft(nextDescription);
    lastSavedDescriptionRef.current = nextDescription;
    setSaveState('idle');
  }, [task?.id, task?.description, task?.detail]);

  useEffect(() => () => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
  }, []);

  if (!task) return null;

  const updateSaveState = (state) => {
    setSaveState(state);

    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    if (state === 'saved' || state === 'error') {
      saveTimerRef.current = window.setTimeout(() => setSaveState('idle'), 2200);
    }
  };

  const saveDescription = async () => {
    if (!canEditDescription || !hasDescriptionChanges || saveState === 'saving') return false;

    const nextDescription = descriptionDraft;
    updateSaveState('saving');

    const saved = await onUpdateTaskDescription(
      task,
      nextDescription,
      createMobileTaskDescriptionHistory(nextDescription.trim())
    );

    if (!saved) {
      updateSaveState('error');
      return false;
    }

    lastSavedDescriptionRef.current = nextDescription;
    updateSaveState('saved');
    return true;
  };

  return (
    <div
      className="zrc-mobile-task-detail-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="zrc-mobile-task-detail-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`${taskTitle} görev detayı`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="zrc-mobile-task-detail-sheet-head">
          <div className="zrc-mobile-task-detail-sheet-status">
            <i style={{ backgroundColor: task.columnColor || '#3b82f6' }} />
            <span>{columnTitle || task.columnTitle || task.status || 'Görev detayı'}</span>
          </div>

          <button
            type="button"
            className="zrc-mobile-task-detail-sheet-close"
            aria-label="Görev detayını kapat"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <h2>{taskTitle}</h2>

        <div className={`zrc-mobile-task-detail-block ${String(descriptionDraft || '').trim() ? '' : 'is-empty'}`}>
          <div className="zrc-mobile-task-detail-block-title-row">
            <strong>Açıklama</strong>
            {canEditDescription && (
              <span className={`zrc-mobile-task-detail-save-status is-${saveState}`} aria-live="polite">
                {saveState === 'saving'
                  ? 'Kaydediliyor'
                  : saveState === 'saved'
                    ? 'Kaydedildi'
                    : saveState === 'error'
                      ? 'Kaydedilemedi'
                      : hasDescriptionChanges
                        ? 'Değişiklik var'
                        : ''}
              </span>
            )}
          </div>

          {canEditDescription ? (
            <>
              <textarea
                className="zrc-mobile-task-detail-description-input"
                value={descriptionDraft}
                onChange={(event) => setDescriptionDraft(event.target.value)}
                onBlur={saveDescription}
                placeholder="Bu görev için açıklama ekle..."
                rows={5}
              />
              <button
                type="button"
                className="zrc-mobile-task-detail-description-save"
                disabled={!hasDescriptionChanges || saveState === 'saving'}
                onClick={saveDescription}
              >
                {saveState === 'saving' ? 'Kaydediliyor' : 'Açıklamayı Kaydet'}
              </button>
            </>
          ) : (
            <p>{String(descriptionDraft || '').trim() || 'Bu görev için açıklama eklenmemiş.'}</p>
          )}
        </div>

        <div className="zrc-mobile-task-detail-meta-grid">
          <div>
            <small>Başlangıç</small>
            <b>{taskStartDate || 'Belirtilmedi'}</b>
          </div>
          <div>
            <small>Bitiş</small>
            <b>{taskDueDate || 'Belirtilmedi'}</b>
          </div>
        </div>

        <div className="zrc-mobile-task-detail-block">
          <strong>Görevliler</strong>
          {safeAssignees.length > 0 ? (
            <div className="zrc-mobile-task-detail-assignees">
              {safeAssignees.map((person) => (
                <span key={person.id || person.email || person.name}>
                  {person.name || 'İsimsiz kullanıcı'}
                </span>
              ))}
            </div>
          ) : (
            <p>Görevli kişi yok.</p>
          )}
        </div>

        {safeTaskSteps.length > 0 && (
          <div className="zrc-mobile-task-detail-block">
            <strong>Adımlar</strong>
            <ul className="zrc-mobile-task-detail-steps">
              {safeTaskSteps.map((step, index) => (
                <li key={step.id || `${step.title || step.text || 'adim'}-${index}`}>
                  {step.title || step.text || step.name || `Adım ${index + 1}`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
