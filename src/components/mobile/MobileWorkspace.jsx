import React, { useState } from 'react';
import MobilePremiumHeader from './MobilePremiumHeader';
import MobileProjectPicker from './MobileProjectPicker';
import MobileTaskSection from './MobileTaskSection';
import MobileTaskWizard from './MobileTaskWizard';
import MobileAssignedTasks from './MobileAssignedTasks';

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
  setIsGlobalSearchOpen,
  homeAssignedTasks = [],
  onOpenAssignedTask
}) {
  const [activeMobilePage, setActiveMobilePage] = useState('projects');

  const closeFloatingPanels = () => {
    setIsPanelOpen(false);
    setIsMessagesOpen(false);
    setIsGlobalSearchOpen(false);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage !== 'projects' && nextPage !== 'assigned') return;

    setActiveMobilePage(nextPage);
    setIsMobileProjectPickerOpen(false);
    closeFloatingPanels();
    setIsNotificationsOpen(false);
  };

  return (
    <>
      <div className={`zrc-mobile-simple-workspace zrc-mobile-page-${activeMobilePage}`}>
        <MobilePremiumHeader
          activePage={activeMobilePage}
          assignedTaskCount={homeAssignedTasks.length}
          unreadNotificationCount={unreadNotificationCount}
          onChangePage={handlePageChange}
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

        {activeMobilePage === 'projects' ? (
          <>
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
          </>
        ) : (
          <MobileAssignedTasks
            tasks={homeAssignedTasks}
            onOpenTask={onOpenAssignedTask || onOpenTaskDetail}
          />
        )}
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
