import React from 'react';

export default function MobileTaskWizard({
  isOpen,
  onClose,
  selectedProject,
  setSelectedProject,
  mobileTaskWizardStep,
  setMobileTaskWizardStep,
  mobileTaskWizardData,
  setMobileTaskWizardData,
  activeTeamMembers,
  teamMembers,
  normalizeTeamRole,
  boardColumns,
  handleSaveTask
}) {
  if (!isOpen) return null;

  const closeWizard = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <>
      <div
        className="zrc-mobile-wizard-overlay"
        onClick={closeWizard}
      />

      <div className="zrc-mobile-wizard-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="zrc-mobile-wizard-header">
          <div>
            <small>Hızlı Görev Akışı</small>
            <h3>Görev Oluştur</h3>
          </div>

          <button
            type="button"
            className="zrc-mobile-wizard-close"
            onClick={closeWizard}
          >
            ×
          </button>
        </div>

        <div className="zrc-mobile-wizard-steps">
          <span className={mobileTaskWizardStep === 1 ? 'is-active' : ''}>1</span>
          <span className={mobileTaskWizardStep === 2 ? 'is-active' : ''}>2</span>
          <span className={mobileTaskWizardStep === 3 ? 'is-active' : ''}>3</span>
          <span className={mobileTaskWizardStep === 4 ? 'is-active' : ''}>4</span>
        </div>

        {mobileTaskWizardStep === 1 && (
          <div className="zrc-mobile-wizard-body">
            <div className="zrc-mobile-wizard-title">1 — Proje</div>
            <div className="zrc-mobile-wizard-desc">
              Görev, şu an açık olan projeye oluşturulacak. Projeyi değiştirmek için önce üstteki proje seçimini kullan.
            </div>

            <div className="zrc-mobile-wizard-current-project">
              <small>Seçili proje</small>
              <strong>{selectedProject || 'Proje seçilmedi'}</strong>
            </div>
          </div>
        )}

        {mobileTaskWizardStep === 2 && (
          <div className="zrc-mobile-wizard-body">
            <div className="zrc-mobile-wizard-title">2 — Görev Adı</div>
            <div className="zrc-mobile-wizard-desc">Oluşturulacak görevin adını yaz.</div>

            <label className="zrc-mobile-wizard-field">
              <span>Görev adı</span>
              <input
                type="text"
                value={mobileTaskWizardData.taskTitle}
                placeholder="Örn: Instagram post tasarımı"
                onChange={(event) => {
                  setMobileTaskWizardData((prev) => ({
                    ...prev,
                    taskTitle: event.target.value
                  }));
                }}
              />
            </label>
          </div>
        )}

        {mobileTaskWizardStep === 4 && (
          <div className="zrc-mobile-wizard-body">
            <div className="zrc-mobile-wizard-title">3 — Tarihler</div>
            <div className="zrc-mobile-wizard-desc">Başlangıç ve bitiş tarihini gir.</div>

            <label className="zrc-mobile-wizard-field">
              <span>Başlangıç Tarihi</span>
              <input
                type="date"
                value={mobileTaskWizardData.startDate}
                onChange={(event) => {
                  const value = event.target.value;

                  setMobileTaskWizardData((prev) => ({
                    ...prev,
                    startDate: value
                  }));
                }}
              />
            </label>

            <label className="zrc-mobile-wizard-field">
              <span>Bitiş Tarihi</span>
              <input
                type="date"
                value={mobileTaskWizardData.endDate}
                onChange={(event) => {
                  const value = event.target.value;

                  setMobileTaskWizardData((prev) => ({
                    ...prev,
                    endDate: value
                  }));
                }}
              />
            </label>
          </div>
        )}

        {mobileTaskWizardStep === 3 && (
          <div className="zrc-mobile-wizard-body">
            <div className="zrc-mobile-wizard-title">4 — Görevli Seçimi</div>
            <div className="zrc-mobile-wizard-desc">Bir veya birden fazla görevli seç.</div>

            <div className="zrc-mobile-wizard-options">
              {(Array.isArray(activeTeamMembers) ? activeTeamMembers : (Array.isArray(teamMembers) ? teamMembers : []))
                .filter((member) => normalizeTeamRole(member?.role) !== 'Müşteri/Misafir')
                .map((member) => {
                  const memberId = member.id || member.user_id || member.username || member.name;
                  const memberName = member.name || member.username || 'İsimsiz kullanıcı';
                  const isSelected = (mobileTaskWizardData.assigneeIds || []).includes(memberId);

                  return (
                    <button
                      key={memberId}
                      type="button"
                      className={`zrc-mobile-wizard-option ${isSelected ? 'is-active' : ''}`}
                      onClick={() => {
                        setMobileTaskWizardData((prev) => {
                          const currentIds = Array.isArray(prev.assigneeIds) ? prev.assigneeIds : [];
                          const currentAssignees = Array.isArray(prev.assignees) ? prev.assignees : [];

                          if (currentIds.includes(memberId)) {
                            return {
                              ...prev,
                              assigneeIds: currentIds.filter((id) => id !== memberId),
                              assignees: currentAssignees.filter((item) => item.id !== memberId)
                            };
                          }

                          return {
                            ...prev,
                            assigneeIds: [...currentIds, memberId],
                            assignees: [
                              ...currentAssignees,
                              {
                                id: memberId,
                                name: memberName,
                                role: normalizeTeamRole(member?.role || 'Ekip Üyesi'),
                                username: member?.username || '',
                                email: member?.email || '',
                                avatar: member?.avatar || member?.avatarUrl || member?.photoUrl || member?.imageUrl || member?.profileImageUrl || member?.avatar_url || member?.photo_url || ''
                              }
                            ]
                          };
                        });
                      }}
                    >
                      <span>{memberName}</span>
                      {isSelected && <b>Seçildi</b>}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        <div className="zrc-mobile-wizard-footer">
          <button
            type="button"
            className="zrc-mobile-wizard-secondary"
            onClick={() => {
              if (mobileTaskWizardStep === 1) {
                closeWizard();
              } else {
                setMobileTaskWizardStep((prev) => prev - 1);
              }
            }}
          >
            {mobileTaskWizardStep === 1 ? 'Kapat' : 'Geri'}
          </button>

          {mobileTaskWizardStep < 4 ? (
            <button
              type="button"
              className="zrc-mobile-wizard-primary"
              onClick={() => {
                if (mobileTaskWizardStep === 1 && !selectedProject) return;
                if (mobileTaskWizardStep === 2 && !String(mobileTaskWizardData.taskTitle || '').trim()) return;

                setMobileTaskWizardStep((prev) => prev + 1);
              }}
            >
              Devam
            </button>
          ) : (
            <button
              type="button"
              className="zrc-mobile-wizard-primary"
              onClick={async () => {
                const targetProjectName = selectedProject || mobileTaskWizardData.projectName;
                const targetColumn = boardColumns?.[0] || {};
                const targetStatus = targetColumn?.title || 'Yeni Görev';
                const selectedAssignees = Array.isArray(mobileTaskWizardData.assignees)
                  ? mobileTaskWizardData.assignees
                  : [];

                if (!targetProjectName) return;
                if (!String(mobileTaskWizardData.taskTitle || '').trim()) return;

                if (targetProjectName !== selectedProject) {
                  setSelectedProject(targetProjectName);
                }

                const didSave = await handleSaveTask({
                  title: String(mobileTaskWizardData.taskTitle || '').trim(),
                  project: targetProjectName,
                  projectName: targetProjectName,
                  status: targetStatus,
                  columnTitle: targetStatus,
                  priority: 'Düşük',
                  description: '',
                  startDate: mobileTaskWizardData.startDate || '',
                  dueDate: mobileTaskWizardData.endDate || '',
                  endDate: mobileTaskWizardData.endDate || '',
                  assignees: selectedAssignees,
                  assignedTo: selectedAssignees.map((item) => item.name).filter(Boolean).join(', '),
                  createdFrom: 'mobile-simple-wizard'
                });

                if (!didSave) return;

                closeWizard();
                setMobileTaskWizardStep(1);
                setMobileTaskWizardData({
                  projectName: targetProjectName,
                  taskTitle: '',
                  startDate: '',
                  endDate: '',
                  assigneeIds: [],
                  assignees: []
                });
              }}
            >
              Görevi Oluştur
            </button>
          )}
        </div>
      </div>
    </>
  );
}
