import React from 'react';
import MobilePremiumHeader from './MobilePremiumHeader';
import MobileProjectPicker from './MobileProjectPicker';
import MobileTaskSection from './MobileTaskSection';
import MobileTaskWizard from './MobileTaskWizard';

export default function MobileWorkspace({
  unreadNotificationCount,
  loadActivityLogsFromSupabase,
  selectedProject,
  setSelectedProject,
  visibleProjectNames,
  projects,
  isMobileProjectPickerOpen,
  setIsMobileProjectPickerOpen,
  boardColumns,
  normalizeColumnTitleForDisplay,
  renderProfileAvatar,
  createAvatarFromName,
  getMobileTaskCardAssignees,
  moveMobileTaskToActiveColumn,
  onOpenTaskDetail,
  setMobileTaskWizardData,
  setMobileTaskWizardStep,
  setIsMobileTaskWizardOpen,
  isMobileTaskWizardOpen,
  mobileTaskWizardStep,
  mobileTaskWizardData,
  activeTeamMembers,
  teamMembers,
  normalizeTeamRole,
  handleSaveTask,
  setActiveMenu,
  setActiveContentMenu,
  setActiveTab,
  setIsPanelOpen,
  setIsMessagesOpen,
  setIsNotificationsOpen,
  setIsGlobalSearchOpen
}) {
  const closeFloatingPanels = () => {
    setIsPanelOpen(false);
    setIsMessagesOpen(false);
    setIsGlobalSearchOpen(false);
  };

  return (
    <>
      <div className="zrc-mobile-simple-workspace">
        <MobilePremiumHeader
          unreadNotificationCount={unreadNotificationCount}
          onToggleNotifications={(event) => {
            event.stopPropagation();
            closeFloatingPanels();

            setIsNotificationsOpen((prev) => {
              const nextState = !prev;

              if (nextState && typeof loadActivityLogsFromSupabase === 'function') {
                loadActivityLogsFromSupabase();
              }

              return nextState;
            });
          }}
        />

        <MobileProjectPicker
          selectedProject={selectedProject}
          visibleProjectNames={visibleProjectNames}
          projects={projects}
          isOpen={isMobileProjectPickerOpen}
          setIsOpen={setIsMobileProjectPickerOpen}
          onSelectProject={(project) => {
            setSelectedProject(project);
            setActiveMenu('Projeler');
            setActiveContentMenu('Projeler');
            setActiveTab('Görevler');
            setIsMobileProjectPickerOpen(false);
            setIsPanelOpen(false);
            setIsMessagesOpen(false);
            setIsNotificationsOpen(false);
            setIsGlobalSearchOpen(false);
          }}
        />

        <MobileTaskSection
          selectedProject={selectedProject}
          boardColumns={boardColumns}
          normalizeColumnTitleForDisplay={normalizeColumnTitleForDisplay}
          renderProfileAvatar={renderProfileAvatar}
          createAvatarFromName={createAvatarFromName}
          getMobileTaskCardAssignees={getMobileTaskCardAssignees}
          moveMobileTaskToActiveColumn={moveMobileTaskToActiveColumn}
          onOpenTaskDetail={onOpenTaskDetail}
          setMobileTaskWizardData={setMobileTaskWizardData}
          setMobileTaskWizardStep={setMobileTaskWizardStep}
          setIsMobileTaskWizardOpen={setIsMobileTaskWizardOpen}
        />
      </div>

      <MobileTaskWizard
        isOpen={isMobileTaskWizardOpen}
        onClose={() => setIsMobileTaskWizardOpen(false)}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        mobileTaskWizardStep={mobileTaskWizardStep}
        setMobileTaskWizardStep={setMobileTaskWizardStep}
        mobileTaskWizardData={mobileTaskWizardData}
        setMobileTaskWizardData={setMobileTaskWizardData}
        activeTeamMembers={activeTeamMembers}
        teamMembers={teamMembers}
        normalizeTeamRole={normalizeTeamRole}
        boardColumns={boardColumns}
        handleSaveTask={handleSaveTask}
      />
    </>
  );
}
