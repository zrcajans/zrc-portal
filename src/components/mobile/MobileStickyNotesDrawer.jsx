import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getQuickNoteDetail, getQuickNoteTitle } from '../../utils/dashboardHelpers';

const getNoteTimestamp = (note = {}) => {
  const parsed = new Date(note.updatedAt || note.createdAt || 0).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function MobileStickyNotesDrawer({
  quickNotes = [],
  createQuickNoteFromMobile,
  deleteQuickNoteFromHome
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [detailDraft, setDetailDraft] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const notes = useMemo(
    () => (
      Array.isArray(quickNotes)
        ? [...quickNotes].sort((firstNote, secondNote) => getNoteTimestamp(secondNote) - getNoteTimestamp(firstNote))
        : []
    ),
    [quickNotes]
  );

  const closeDrawer = () => {
    setIsOpen(false);
    setIsComposerOpen(false);
    setPendingDeleteId(null);
  };

  const openComposer = () => {
    setPendingDeleteId(null);
    setIsComposerOpen(true);
  };

  const resetComposer = () => {
    setTitleDraft('');
    setDetailDraft('');
    setIsComposerOpen(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if ((!titleDraft.trim() && !detailDraft.trim()) || isSaving) return;
    if (typeof createQuickNoteFromMobile !== 'function') return;

    setIsSaving(true);

    try {
      const didSave = await createQuickNoteFromMobile({
        title: titleDraft,
        detail: detailDraft
      });

      if (didSave) {
        resetComposer();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!noteId || isDeletingId || typeof deleteQuickNoteFromHome !== 'function') return;

    setIsDeletingId(noteId);

    try {
      await deleteQuickNoteFromHome(noteId);
      setPendingDeleteId(null);
    } finally {
      setIsDeletingId(null);
    }
  };

  const drawer = (
    <div className="zrc-mobile-sticky-notes-root" aria-live="polite">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="zrc-mobile-sticky-notes-edge-tab"
        aria-label={`Yapışkan notları aç${notes.length ? `, ${notes.length} not` : ''}`}
      >
        <span className="zrc-mobile-sticky-notes-edge-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.15">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h10A2.25 2.25 0 0 1 19.25 6v12.25L15 16l-3 2-3-2-4.25 2.25V6A2.25 2.25 0 0 1 7 3.75Z" />
            <path strokeLinecap="round" d="M9 8.5h6M9 11.5h4.5" />
          </svg>
        </span>
        {notes.length > 0 ? <span className="zrc-mobile-sticky-notes-edge-count">{notes.length > 9 ? '9+' : notes.length}</span> : null}
        <span className="zrc-mobile-sticky-notes-edge-text">NOTLAR</span>
      </button>

      <div
        className={`zrc-mobile-sticky-notes-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={closeDrawer}
        aria-hidden={!isOpen}
      />

      <aside
        className={`zrc-mobile-sticky-notes-drawer${isOpen ? ' is-open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Yapışkan notlar"
      >
        <div className="zrc-mobile-sticky-notes-drawer-head">
          <div className="zrc-mobile-sticky-notes-head-brand">
            <span className="zrc-mobile-sticky-notes-head-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.75h10A2.25 2.25 0 0 1 19.25 6v12.25L15 16l-3 2-3-2-4.25 2.25V6A2.25 2.25 0 0 1 7 3.75Z" />
              </svg>
            </span>
            <div>
              <div className="zrc-mobile-sticky-notes-kicker">ZRC Hızlı Alan</div>
              <h2>Yapışkan Notlar</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="zrc-mobile-sticky-notes-close"
            aria-label="Yapışkan notları kapat"
          >
            ×
          </button>
        </div>

        <div className="zrc-mobile-sticky-notes-summary">
          <span>{notes.length ? `${notes.length} notun var` : 'Henüz not yok'}</span>
          <button
            type="button"
            onClick={openComposer}
            className="zrc-mobile-sticky-notes-new-button"
          >
            <span aria-hidden="true">+</span>
            Yeni not
          </button>
        </div>

        {isComposerOpen ? (
          <form className="zrc-mobile-sticky-notes-composer" onSubmit={handleSave}>
            <input
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              placeholder="Not başlığı"
              maxLength={84}
              autoFocus
            />

            <textarea
              value={detailDraft}
              onChange={(event) => setDetailDraft(event.target.value)}
              placeholder="Kısa notunu yaz..."
              rows={4}
              maxLength={1200}
            />

            <div className="zrc-mobile-sticky-notes-composer-actions">
              <button type="button" onClick={resetComposer} className="is-quiet">
                Vazgeç
              </button>
              <button type="submit" disabled={isSaving || (!titleDraft.trim() && !detailDraft.trim())}>
                {isSaving ? 'Kaydediliyor...' : 'Sabitle'}
              </button>
            </div>
          </form>
        ) : null}

        <div className="zrc-mobile-sticky-notes-list">
          {notes.length > 0 ? notes.map((note) => {
            const noteTitle = getQuickNoteTitle(note);
            const noteDetail = getQuickNoteDetail(note);
            const isDeletePending = pendingDeleteId === note.id;
            const isDeleting = isDeletingId === note.id;

            return (
              <article key={note.id} className="zrc-mobile-sticky-note-card">
                <div className="zrc-mobile-sticky-note-card-top">
                  <span className="zrc-mobile-sticky-note-pin" aria-hidden="true" />
                  <h3>{noteTitle}</h3>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(isDeletePending ? null : note.id)}
                    className="zrc-mobile-sticky-note-delete-trigger"
                    aria-label={`${noteTitle} notunu sil`}
                  >
                    ×
                  </button>
                </div>

                {noteDetail ? <p>{noteDetail}</p> : null}

                {isDeletePending ? (
                  <div className="zrc-mobile-sticky-note-delete-confirm">
                    <span>Bu not silinsin mi?</span>
                    <div>
                      <button type="button" onClick={() => setPendingDeleteId(null)}>Vazgeç</button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        disabled={isDeleting}
                        className="is-danger"
                      >
                        {isDeleting ? 'Siliniyor...' : 'Sil'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          }) : (
            <div className="zrc-mobile-sticky-notes-empty">
              <div className="zrc-mobile-sticky-notes-empty-icon" aria-hidden="true">✦</div>
              <strong>İlk notunu ekle</strong>
              <span>Mobilde yazdığın notlar masaüstünde de görünür.</span>
            </div>
          )}
        </div>
      </aside>
    </div>
  );

  if (typeof document === 'undefined') return drawer;

  return createPortal(drawer, document.body);
}
