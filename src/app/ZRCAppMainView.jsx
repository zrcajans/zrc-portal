import React from 'react';

export default function ZRCAppMainView(props) {
  const {activeTab, boardView, currentPermissions, currentAccountType, selectedProject, APP_DATA_VERSION, DosyalarTabPanel, GanttCizelgesiTabPanel, GorevlerTabPanel, MobileWorkspace, RaporlarTabPanel, Sidebar, StageModal, TakvimTabPanel, TaskDetailModal, TaskModal, TopNavbar, ZRCAppShellActiveContentMenuDigerActiveTabMusterilerShowCustomerManagementPageSection, ZRCAppShellActiveProfileTabHesapBlock, ZRCAppShellActiveProfileTabVeriYonetimiBlock, ZRCAppShellCalendarViewAyBlock, ZRCAppShellCalendarViewAyBlock2, ZRCAppShellCalendarViewGunBlock, ZRCAppShellCalendarViewHaftaBlock, ZRCAppShellCalendarViewHaftaBlock2, ZRCAppShellIsMessagesOpenSection, ZamanCizelgesiTabPanel, activeContentMenu, activeMenu, activeProfileTab, activeTeamMembers, addProfileEmailAccount, addTaskComment, archivedTasks, availableProjectTeamMembers, boardColumns, calendarDisplayOptions, calendarFocusedDate, calendarGridDays, calendarHeaderTitle, calendarMonthDate, calendarNewTaskDate, calendarTaskModalContext, calendarView, calendarWeekDays, canCreateChatGroups, canCurrentUserModifyTask, canSendSelectedChatMessage, changeCalendarTaskModalProject, changeCalendarView, chatGroupDraft, chatGroupSearch, chatPageDraft, closeCustomerEditModal, closeGlobalSearch, closeTaskDetail, closeTeamMemberEditModal, column, columnTitle, copyCredentialTextForCustomer, copyCredentialTextForMember, copyCurrentDataSnapshot, copySupabaseBackupSnapshot, createAvatarFromName, createChatGroupFromPage, createCustomerFromCenter, createPortal, createQuickNoteFromHome, createTeamMemberFromCenter, createUsernameFromMember, currentActorAvatar, currentActorId, currentActorName, currentCustomerKeys, currentIds, currentProfileInitials, currentUserId, currentUserRole, customStyles, customer, customerDraft, customerEditDraft, customerLinkNoneLabel, customerLinkOptions, customerName, customerPageItems, customers, data, dataImportInputRef, dataManagementStats, date, day, deleteCustomerFromCenter, deleteQuickNoteFromHome, deleteTaskComment, deleteTaskStoredFileFromSupabase, deleteTeamMemberFromCenter, detailTaskInfo, downloadCurrentDataSnapshot, downloadSupabaseBackupSnapshot, downloadTaskFileFromSupabase, editTaskFromDetail, editingColumn, editingCustomer, editingQuickNoteId, editingTask, editingTeamMember, emailAccountDraft, file, filteredChatGroups, filteredGlobalSearchItems, formatCalendarDate, formatCalendarWeekday, formatDateForTaskModal, formatMenuCalendarTaskTime, formatMenuCalendarWeekHeader, getAccountTypeFromRole, getCustomerById, getCustomerByName, getCustomerIdByName, getCustomerLinkedAccount, getCustomerNameById, getMemberLinkedCustomer, getMenuCalendarAllDayTasks, getMenuCalendarHolidayLabel, getMenuCalendarTasksForDay, getMenuCalendarTasksForHour, getMobileTaskCardAssignees, getPremiumCalendarDotStyle, getPremiumCalendarTaskStyle, getProjectMessageDateLabel, getProjectNameForTask, getPwaInstallClass, getQuickNoteDetail, getQuickNoteTitle, getReadableColumnColor, getSupabaseHealthStateClass, getSupabaseHealthSummary, getSupabaseRealtimeClass, globalSearchFilterOptions, globalSearchPlaceholder, globalSearchQuery, goToNextCalendarPeriod, goToPreviousCalendarPeriod, group, handleArchiveProject, handleBulkArchive, handleBulkDelete, handleCalendarDayClick, handleDataImportFile, handleDeleteProject, handleGlobalSearchItemClick, handleInstallPwa, handleLogout, handleMainClick, handleMessageClick, handleNotificationClick, handleProfileAvatarChange, handleSaveProjectSettings, handleSaveStage, handleSaveTask, handleSendChatPageMessage, handleSendProjectMessage, handleSidebarProjectsChange, homeAssignedTasks, index, isCalendarDisplayMenuOpen, isChatActionMenuOpen, isChatGroupModalOpen, isCurrentProfileRecord, isGlobalSearchOpen, isIosDevice, isMenuCalendarFilterOpen, isMenuCalendarStatusOpen, isMessageTaskPickerOpen, isMessagesOpen, isMobileProjectPickerOpen, isMobileTaskWizardOpen, isNotificationsOpen, isPanelOpen, isProjectMessageVisibleForCurrentUser, isProjectTeamPickerOpen, isQuickNoteComposerOpen, isQuickNoteSearchOpen, isSameCalendarDay, isStageModalOpen, isTaskModalOpen, items, linkedCustomer, loadActivityLogsFromSupabase, markAllMessagesAsRead, markAllNotificationsAsRead, markSuspiciousEventAsMine, member, menuCalendarHours, menuCalendarListGroups, menuCalendarStatusFilter, menuCalendarStatusOptions, message, messageDraft, messageItems, messageLinkedTaskId, messageTaskOptions, migrateLocalDataToSupabase, mobileTaskWizardData, mobileTaskWizardStep, month, moveMobileTaskToActiveColumn, nextProfileDraft, normalizeColumnTitleForDisplay, normalizeCredentialText, normalizeTeamRole, note, notificationEmptyDescription, notificationItems, notificationPanelSummary, now, openCustomerEditModal, openGlobalSearch, openHomeCalendarQuickTaskForDate, openHomeTaskDetail, openMenuCalendarQuickTask, openMenuCalendarTask, openMessagesPanel, openQuickNoteComposerForEdit, openTeamMemberEditModal, passiveTeamMembers, password, pendingCustomerDeleteId, pendingDeleteQuickNoteId, pendingProfileDelete, pendingTeamDeleteId, profile, profileAvatarInputRef, profileDraft, profilePreferences, projectMessages, projectName, projectSettings, projectSettingsDraft, projects, pwaInstallStatus, quickNoteDraft, quickNoteSearch, quickNoteTitleDraft, quickNotes, readMessageIds, readNotificationIds, removeProfileEmailAccount, removeProfileSession, renderProfileAvatar, renderProfileSelect, renderSoftSelect, renderSupabaseConnectionBadge, resetLocalApplicationData, resetQuickNoteComposer, runFullSupabaseRefresh, runSupabaseHealthCheck, saveCustomerEdit, saveProfileSection, saveTeamMemberEdit, selectedChatGroup, selectedChatGroupId, selectedChatMessages, selectedCustomer, selectedCustomerId, selectedMessageTask, selectedProjectTeamMembers, selectedTasks, selectedTeamMemberId, setActiveContentMenu, setActiveMenu, setActiveProfileTab, setActiveTab, setCalendarDisplayOptions, setCalendarFocusedDate, setCalendarMonthDate, setCalendarNewTaskDate, setCalendarTaskModalContext, setCalendarView, setChatGroupDraft, setChatGroupSearch, setChatPageDraft, setCustomerDraft, setCustomerEditDraft, setEditingColumn, setEditingTask, setEmailAccountDraft, setGlobalSearchFilter, setGlobalSearchQuery, setIsCalendarDisplayMenuOpen, setIsChatActionMenuOpen, setIsChatGroupModalOpen, setIsGlobalSearchOpen, setIsMenuCalendarFilterOpen, setIsMenuCalendarStatusOpen, setIsMessageTaskPickerOpen, setIsMessagesOpen, setIsMobileProjectPickerOpen, setIsMobileTaskWizardOpen, setIsNotificationsOpen, setIsPanelOpen, setIsProjectTeamPickerOpen, setIsQuickNoteComposerOpen, setIsQuickNoteSearchOpen, setIsStageModalOpen, setIsTaskModalOpen, setMenuCalendarStatusFilter, setMessageDraft, setMessageLinkedTaskId, setMobileTaskWizardData, setMobileTaskWizardStep, setPendingCustomerDeleteId, setPendingDeleteQuickNoteId, setPendingProfileDelete, setPendingTeamDeleteId, setProfileDraft, setProfilePreferences, setProjectSettingsDraft, setProjects, setQuickNoteDraft, setQuickNoteSearch, setQuickNoteTitleDraft, setSelectedChatGroupId, setSelectedCustomerId, setSelectedProject, setSelectedTasks, setSelectedTeamMemberId, setTeamMemberDraft, setTeamMemberEditDraft, setTeamMembers, showCustomerManagementPage, showProjectSettingsControls, showTeamManagementPage, statusOptions, supabaseBackupLoading, supabaseHealthLoading, supabaseHealthReport, supabaseLastBackupAt, supabaseLastFullRefreshAt, supabaseLastRealtimeAt, supabaseRealtimeStatus, task, taskModalTeamMembers, teamMemberDraft, teamMemberEditDraft, teamMembers, teamRoleOptions, text, todayStart, toggleProfilePreference, toggleTeamMemberStatus, total, unreadMessageCount, unreadNotificationCount, updateTaskFromDetail, uploadTaskFilesToSupabase, visibleProfileTabs, visibleProjectNames, visibleProjectTabs} = props;

  return (

    <div className="min-h-screen flex bg-[#f5f6f8] antialiased selection:bg-[#ff3600] overflow-x-hidden relative font-[Inter]">
      {customStyles}
      {renderSupabaseConnectionBadge()}

      <style>{`
        .zrc-main-shell > div:not([class*="fixed"]) {
          padding-left: 44px;
          box-sizing: border-box;
        }

        .zrc-project-board-page,
        .zrc-team-center-page,
        .zrc-customer-center-page {
          padding-left: 0 !important;
          box-sizing: border-box;
        }

        .zrc-project-board-page > div:not([class*="fixed"]) {
          padding-left: 44px !important;
          box-sizing: border-box;
        }

        .zrc-team-center-page,
        .zrc-customer-center-page {
          width: 100%;
        }

        .zrc-team-center-page > .zrc-center-card,
        .zrc-customer-center-page > .zrc-center-card {
          margin-left: auto !important;
          margin-right: auto !important;
        }
      `}</style>

      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        projects={projects}
        visibleProjects={visibleProjectNames}
        projectSettings={projectSettings}
        setProjects={handleSidebarProjectsChange}
        setSelectedProject={(project) => {
          setSelectedProject(project);
          setActiveContentMenu('Projeler');
          setActiveTab('Görevler');
          setPendingTeamDeleteId(null);
          setPendingCustomerDeleteId(null);
        }}
        onSearchClick={openGlobalSearch}
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        profileDraft={profileDraft}
        permissions={currentPermissions}
        currentUserRole={currentUserRole}
        currentAccountType={currentAccountType}
        currentUserId={currentUserId}
        onProfileSelect={() => {
          setActiveMenu('Profil');
          setActiveContentMenu('Profil');
          setActiveTab('Görevler');
          setIsPanelOpen(false);
          setIsNotificationsOpen(false);
          setIsMessagesOpen(false);
          setIsGlobalSearchOpen(false);
          setPendingTeamDeleteId(null);
          setPendingCustomerDeleteId(null);
        }}
        onProjectMenuSelect={() => {
          setPendingTeamDeleteId(null);
          setPendingCustomerDeleteId(null);
        }}
        onSimpleMenuSelect={(menuId) => {
          setActiveContentMenu(menuId);
          setActiveTab('Görevler');
          setIsPanelOpen(false);
          setIsNotificationsOpen(false);
          setIsMessagesOpen(false);
          setIsGlobalSearchOpen(false);
          setPendingTeamDeleteId(null);
          setPendingCustomerDeleteId(null);
        }}
        onOtherSectionSelect={(section) => {
          setActiveContentMenu('Diğer');
          setActiveTab(section);
          setIsPanelOpen(false);
          setIsNotificationsOpen(false);
          setIsMessagesOpen(false);
          setIsGlobalSearchOpen(false);
          setPendingTeamDeleteId(null);
          setPendingCustomerDeleteId(null);
        }}
      />

      <main onClick={handleMainClick} className="zrc-main-shell flex-1 pl-[68px] min-h-screen bg-white transition-colors duration-300 flex flex-col overflow-hidden">
        <TopNavbar
          unreadNotificationCount={unreadNotificationCount}
          isNotificationsOpen={isNotificationsOpen}
          onToggleNotifications={(event) => {
            event.stopPropagation();
            setIsMessagesOpen(false);
            setIsNotificationsOpen((prev) => {
              const nextState = !prev;

              if (nextState) {
                loadActivityLogsFromSupabase();
              }

              return nextState;
            });
          }}
          unreadMessageCount={unreadMessageCount}
          isMessagesOpen={isMessagesOpen}
          activeContentMenu={activeContentMenu}
          onToggleMessages={(event) => {
            event.stopPropagation();
            openMessagesPanel();
          }}
          onLogout={handleLogout}
        />


        
        
        <MobileWorkspace
          unreadNotificationCount={unreadNotificationCount}
          loadActivityLogsFromSupabase={loadActivityLogsFromSupabase}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          visibleProjectNames={visibleProjectNames}
          projects={projects}
          isMobileProjectPickerOpen={isMobileProjectPickerOpen}
          setIsMobileProjectPickerOpen={setIsMobileProjectPickerOpen}
          boardColumns={boardColumns}
          normalizeColumnTitleForDisplay={normalizeColumnTitleForDisplay}
          renderProfileAvatar={renderProfileAvatar}
          createAvatarFromName={createAvatarFromName}
          getMobileTaskCardAssignees={getMobileTaskCardAssignees}
          moveMobileTaskToActiveColumn={moveMobileTaskToActiveColumn}
          setMobileTaskWizardData={setMobileTaskWizardData}
          setMobileTaskWizardStep={setMobileTaskWizardStep}
          setIsMobileTaskWizardOpen={setIsMobileTaskWizardOpen}
          isMobileTaskWizardOpen={isMobileTaskWizardOpen}
          mobileTaskWizardStep={mobileTaskWizardStep}
          mobileTaskWizardData={mobileTaskWizardData}
          activeTeamMembers={activeTeamMembers}
          teamMembers={teamMembers}
          normalizeTeamRole={normalizeTeamRole}
          handleSaveTask={handleSaveTask}
          setActiveMenu={setActiveMenu}
          setActiveContentMenu={setActiveContentMenu}
          setActiveTab={setActiveTab}
          setIsPanelOpen={setIsPanelOpen}
          setIsMessagesOpen={setIsMessagesOpen}
          setIsNotificationsOpen={setIsNotificationsOpen}
          setIsGlobalSearchOpen={setIsGlobalSearchOpen}
        />

                {/* zrc-v526-section-ismessagesopen */}
        <ZRCAppShellIsMessagesOpenSection
          isMessagesOpen={typeof isMessagesOpen !== 'undefined' ? isMessagesOpen : undefined}
          fixed={typeof fixed !== 'undefined' ? fixed : undefined}
          inset={typeof inset !== 'undefined' ? inset : undefined}
          z={typeof z !== 'undefined' ? z : undefined}
          setIsMessagesOpen={typeof setIsMessagesOpen !== 'undefined' ? setIsMessagesOpen : undefined}
          setIsMessageTaskPickerOpen={typeof setIsMessageTaskPickerOpen !== 'undefined' ? setIsMessageTaskPickerOpen : undefined}
          activeContentMenu={typeof activeContentMenu !== 'undefined' ? activeContentMenu : undefined}
          Projeler={typeof Projeler !== 'undefined' ? Projeler : undefined}
          left={typeof left !== 'undefined' ? left : undefined}
          translate={typeof translate !== 'undefined' ? translate : undefined}
          w={typeof w !== 'undefined' ? w : undefined}
          bg={typeof bg !== 'undefined' ? bg : undefined}
          white={typeof white !== 'undefined' ? white : undefined}
          border={typeof border !== 'undefined' ? border : undefined}
          zinc={typeof zinc !== 'undefined' ? zinc : undefined}
          rounded={typeof rounded !== 'undefined' ? rounded : undefined}
          shadow={typeof shadow !== 'undefined' ? shadow : undefined}
          overflow={typeof overflow !== 'undefined' ? overflow : undefined}
          hidden={typeof hidden !== 'undefined' ? hidden : undefined}
          animate={typeof animate !== 'undefined' ? animate : undefined}
          fade={typeof fade !== 'undefined' ? fade : undefined}
          absolute={typeof absolute !== 'undefined' ? absolute : undefined}
          top={typeof top !== 'undefined' ? top : undefined}
          h={typeof h !== 'undefined' ? h : undefined}
          rotate={typeof rotate !== 'undefined' ? rotate : undefined}
          l={typeof l !== 'undefined' ? l : undefined}
          t={typeof t !== 'undefined' ? t : undefined}
          px={typeof px !== 'undefined' ? px : undefined}
          b={typeof b !== 'undefined' ? b : undefined}
          flex={typeof flex !== 'undefined' ? flex : undefined}
          items={typeof items !== 'undefined' ? items : undefined}
          center={typeof center !== 'undefined' ? center : undefined}
          justify={typeof justify !== 'undefined' ? justify : undefined}
          between={typeof between !== 'undefined' ? between : undefined}
          text={typeof text !== 'undefined' ? text : undefined}
          font={typeof font !== 'undefined' ? font : undefined}
          black={typeof black !== 'undefined' ? black : undefined}
          Mesajlar={typeof Mesajlar !== 'undefined' ? Mesajlar : undefined}
          mt={typeof mt !== 'undefined' ? mt : undefined}
          bold={typeof bold !== 'undefined' ? bold : undefined}
          unreadMessageCount={typeof unreadMessageCount !== 'undefined' ? unreadMessageCount : undefined}
          mesaj={typeof mesaj !== 'undefined' ? mesaj : undefined}
          mesajlar={typeof mesajlar !== 'undefined' ? mesajlar : undefined}
          okundu={typeof okundu !== 'undefined' ? okundu : undefined}
          markAllMessagesAsRead={typeof markAllMessagesAsRead !== 'undefined' ? markAllMessagesAsRead : undefined}
          full={typeof full !== 'undefined' ? full : undefined}
          transition={typeof transition !== 'undefined' ? transition : undefined}
          all={typeof all !== 'undefined' ? all : undefined}
          Okundu={typeof Okundu !== 'undefined' ? Okundu : undefined}
          Yap={typeof Yap !== 'undefined' ? Yap : undefined}
          max={typeof max !== 'undefined' ? max : undefined}
          auto={typeof auto !== 'undefined' ? auto : undefined}
          custom={typeof custom !== 'undefined' ? custom : undefined}
          scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
          fbfcfd={typeof fbfcfd !== 'undefined' ? fbfcfd : undefined}
          messageItems={typeof messageItems !== 'undefined' ? messageItems : undefined}
          space={typeof space !== 'undefined' ? space : undefined}
          readMessageIds={typeof readMessageIds !== 'undefined' ? readMessageIds : undefined}
          handleMessageClick={typeof handleMessageClick !== 'undefined' ? handleMessageClick : undefined}
          blue={typeof blue !== 'undefined' ? blue : undefined}
          start={typeof start !== 'undefined' ? start : undefined}
          gap={typeof gap !== 'undefined' ? gap : undefined}
          shrink={typeof shrink !== 'undefined' ? shrink : undefined}
          renderProfileAvatar={typeof renderProfileAvatar !== 'undefined' ? renderProfileAvatar : undefined}
          currentProfileInitials={typeof currentProfileInitials !== 'undefined' ? currentProfileInitials : undefined}
          min={typeof min !== 'undefined' ? min : undefined}
          truncate={typeof truncate !== 'undefined' ? truncate : undefined}
          Mesaj={typeof Mesaj !== 'undefined' ? Mesaj : undefined}
          clamp={typeof clamp !== 'undefined' ? clamp : undefined}
          getProjectMessageDateLabel={typeof getProjectMessageDateLabel !== 'undefined' ? getProjectMessageDateLabel : undefined}
          col={typeof col !== 'undefined' ? col : undefined}
          mb={typeof mb !== 'undefined' ? mb : undefined}
          none={typeof none !== 'undefined' ? none : undefined}
          currentColor={typeof currentColor !== 'undefined' ? currentColor : undefined}
          round={typeof round !== 'undefined' ? round : undefined}
          M8={typeof M8 !== 'undefined' ? M8 : undefined}
          M21={typeof M21 !== 'undefined' ? M21 : undefined}
          yok={typeof yok !== 'undefined' ? yok : undefined}
          proje={typeof proje !== 'undefined' ? proje : undefined}
          yaz={typeof yaz !== 'undefined' ? yaz : undefined}
          handleSendProjectMessage={typeof handleSendProjectMessage !== 'undefined' ? handleSendProjectMessage : undefined}
          relative={typeof relative !== 'undefined' ? relative : undefined}
          selectedMessageTask={typeof selectedMessageTask !== 'undefined' ? selectedMessageTask : undefined}
          Genel={typeof Genel !== 'undefined' ? Genel : undefined}
          M6={typeof M6 !== 'undefined' ? M6 : undefined}
          isMessageTaskPickerOpen={typeof isMessageTaskPickerOpen !== 'undefined' ? isMessageTaskPickerOpen : undefined}
          right={typeof right !== 'undefined' ? right : undefined}
          bottom={typeof bottom !== 'undefined' ? bottom : undefined}
          setMessageLinkedTaskId={typeof setMessageLinkedTaskId !== 'undefined' ? setMessageLinkedTaskId : undefined}
          messageLinkedTaskId={typeof messageLinkedTaskId !== 'undefined' ? messageLinkedTaskId : undefined}
          messageTaskOptions={typeof messageTaskOptions !== 'undefined' ? messageTaskOptions : undefined}
          end={typeof end !== 'undefined' ? end : undefined}
          messageDraft={typeof messageDraft !== 'undefined' ? messageDraft : undefined}
          setMessageDraft={typeof setMessageDraft !== 'undefined' ? setMessageDraft : undefined}
          Enter={typeof Enter !== 'undefined' ? Enter : undefined}
          Proje={typeof Proje !== 'undefined' ? Proje : undefined}
          resize={typeof resize !== 'undefined' ? resize : undefined}
          py={typeof py !== 'undefined' ? py : undefined}
          outline={typeof outline !== 'undefined' ? outline : undefined}
          submit={typeof submit !== 'undefined' ? submit : undefined}
          cursor={typeof cursor !== 'undefined' ? cursor : undefined}
          not={typeof not !== 'undefined' ? not : undefined}
          allowed={typeof allowed !== 'undefined' ? allowed : undefined}
        />

        {isNotificationsOpen && (
          <div
            onClick={(event) => event.stopPropagation()}
            style={{ top: activeContentMenu === 'Projeler' ? 43 : 55 }}
            className="zrc-notification-panel fixed left-1/2 -translate-x-1/2 z-[680] w-[360px] bg-white border border-zinc-200 rounded-[14px] shadow-[0_24px_70px_rgba(15,23,42,0.20)] overflow-hidden animate-fade-in"
          >
            <span className="absolute -top-1.5 left-[57%] -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-l border-t border-zinc-200" />
            <div className="h-[54px] px-4 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="text-[13px] font-black text-zinc-800">Bildirimler</div>
                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                  {notificationPanelSummary}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={loadActivityLogsFromSupabase}
                  className="h-7 px-3 rounded-full bg-white border border-zinc-100 text-[9.5px] font-black text-zinc-500 hover:text-zinc-900 hover:border-zinc-200 transition-all"
                >
                  Yenile
                </button>

                {notificationItems.length > 0 && unreadNotificationCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="h-7 px-3 rounded-full bg-zinc-900 border border-zinc-900 text-[9.5px] font-black text-white hover:bg-zinc-700 transition-all"
                  >
                    Tümünü okundu yap
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto custom-scrollbar p-2">
              {notificationItems.length > 0 ? (
                <div className="space-y-1.5">
                  {notificationItems.map((notification) => {
                    const isRead = readNotificationIds.includes(notification.id);

                    return (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left rounded-[10px] border p-3 transition-all ${
                          isRead
                            ? 'bg-white border-zinc-100 hover:bg-zinc-50'
                            : 'bg-blue-50/45 border-blue-100 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-[10px] border flex items-center justify-center shrink-0 overflow-hidden ${getNotificationTone(notification.type)}`}>
                            {notification.source === 'activity' && notification.avatar ? (
                              renderProfileAvatar(notification.avatar, currentProfileInitials)
                            ) : notification.type === 'comment' && notification.avatar ? (
                              renderProfileAvatar(notification.avatar, currentProfileInitials)
                            ) : notification.type === 'comment' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.924-.924 5.972 5.972 0 001.057-4.035A8.287 8.287 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                              </svg>
                            ) : notification.type === 'file' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.552 18.32a1.5 1.5 0 11-2.121-2.121l9.546-9.546" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 21a9 9 0 100-18 9 9 0 000 18z" />
                              </svg>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-[11.5px] font-black text-zinc-800 truncate">
                                {notification.title}
                              </div>

                              {!isRead && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                              )}
                            </div>

                            <div className="mt-0.5 text-[11px] font-bold text-zinc-600 truncate">
                              {notification.text}
                            </div>

                            <div className="mt-1 text-[9.5px] font-bold text-zinc-400 truncate">
                              {currentAccountType === 'Patron'
                                ? notification.meta
                                : notification.projectName || notification.meta}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[220px] flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-300 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022 23.848 23.848 0 005.455 1.31m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                  </div>

                  <div className="text-[12px] font-black text-zinc-600">Bildirim yok</div>
                  <div className="mt-1 text-[10.5px] font-bold text-zinc-400">
                    {notificationEmptyDescription}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isGlobalSearchOpen && (
          <div
            className="fixed inset-0 z-[690] bg-zinc-950/25 backdrop-blur-[2px] flex items-start justify-center pt-[82px] animate-fade-in"
            onClick={closeGlobalSearch}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="w-[720px] max-w-[calc(100vw-150px)] bg-white border border-zinc-200 rounded-[17px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-hidden"
            >
              <div className="h-[66px] px-5 border-b border-zinc-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-[11px] bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                  </svg>
                </div>

                <input
                  autoFocus
                  value={globalSearchQuery}
                  onChange={(event) => setGlobalSearchQuery(event.target.value)}
                  placeholder={globalSearchPlaceholder}
                  className="w-full bg-transparent text-[16px] font-black text-zinc-800 placeholder:text-zinc-300 focus:outline-none"
                />

                <button
                  type="button"
                  onClick={closeGlobalSearch}
                  className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                  {globalSearchFilterOptions.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setGlobalSearchFilter(filter)}
                      className={`h-8 px-3 rounded-full border text-[10px] font-black whitespace-nowrap transition-all ${
                        globalSearchFilter === filter
                          ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-sm'
                          : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="text-[10px] font-black text-zinc-400 shrink-0">
                  {globalSearchQuery.trim() ? `${filteredGlobalSearchItems.length} sonuç` : 'Son görevler'}
                </div>
              </div>

              <div className="max-h-[430px] overflow-y-auto custom-scrollbar p-3">
                {filteredGlobalSearchItems.length > 0 ? (
                  <div className="space-y-1.5">
                    {filteredGlobalSearchItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleGlobalSearchItemClick(item)}
                        className="w-full rounded-[12px] border border-zinc-100 bg-white hover:bg-zinc-50 hover:border-zinc-200 p-3 text-left transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-[11px] border flex items-center justify-center shrink-0 ${getGlobalSearchTypeStyle(item.type)}`}>
                            {item.type === 'Dosya' ? (
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.552 18.32a1.5 1.5 0 11-2.121-2.121l9.546-9.546" />
                              </svg>
                            ) : item.type === 'Yorum' ? (
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.924-.924 5.972 5.972 0 001.057-4.035A8.287 8.287 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                              </svg>
                            ) : (
                              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M8.25 4.5h7.5A2.25 2.25 0 0118 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-7.5A2.25 2.25 0 016 17.25V6.75A2.25 2.25 0 018.25 4.5z" />
                              </svg>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-[12.5px] font-black text-zinc-800 truncate group-hover:text-zinc-950">
                                  {item.title}
                                </div>
                                <div className="mt-0.5 text-[10.5px] font-bold text-zinc-500 truncate">
                                  {item.subtitle}
                                </div>
                              </div>

                              <span className="h-5 px-2 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400 shrink-0">
                                {item.type}
                              </span>
                            </div>

                            <div className="mt-2 text-[9.5px] font-bold text-zinc-400 truncate">
                              {item.meta}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-[240px] flex flex-col items-center justify-center text-center">
                    <div className="w-15 h-15 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-300 flex items-center justify-center mb-3">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                      </svg>
                    </div>

                    <div className="text-[13px] font-black text-zinc-700">Sonuç bulunamadı</div>
                    <div className="mt-1 text-[10.5px] font-bold text-zinc-400 max-w-[330px]">
                      {currentAccountType === 'Patron'
                        ? 'Başka bir görev adı, müşteri, dosya, yorum veya kolon adıyla tekrar ara.'
                        : 'Sadece erişimin olan projelerde arama yapılır. Başka bir görev, dosya veya yorum adıyla tekrar ara.'}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-[42px] px-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                <div className="text-[9.5px] font-bold text-zinc-400">
                  {currentAccountType === 'Patron' ? 'Enter gerekmez, yazdıkça arar.' : 'Arama sadece erişimin olan kayıtları gösterir.'}
                </div>
                <div className="text-[9.5px] font-black text-zinc-400">ESC ile kapat</div>
              </div>
            </div>
          </div>
        )}

        {activeContentMenu === 'Ana Sayfa' ? (
          <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#f3f4f6] animate-fade-in">
            <div className="min-h-full pl-4 pr-[76px] pt-4 pb-8">
              <div className="max-w-[1560px] mx-auto grid grid-cols-[minmax(430px,0.96fr)_minmax(520px,0.78fr)] items-start gap-6">
                <div className="min-w-0">
                  <section className="mb-8">
                    <div className="h-7 mb-2 flex items-center gap-2">
                      <h2 className="text-[13px] font-bold text-[#293241] tracking-[-0.01em]">Size Atanan Görevler</h2>
                      <span className="h-[18px] min-w-[27px] px-2 rounded-full bg-[#f28b57] text-white text-[9px] font-black flex items-center justify-center leading-none">
                        {homeAssignedTasks.length}
                      </span>
                    </div>

                    <div className="zrc-home-card bg-white rounded-[13px] shadow-[0_12px_32px_rgba(30,43,70,0.06)] overflow-hidden">
                      <div className="h-[46px] px-5 border-b border-[#eef1f5] bg-[#ffffff] grid grid-cols-[36px_minmax(0,1fr)_142px] items-center">
                        <div className="text-[10.5px] font-black text-[#9aa4b2]"> </div>
                        <div className="text-[13px] font-bold text-[#8c96a6] flex items-center gap-1.5">
                          Durum / Ad
                          <span className="text-[9px] text-[#a9b2bf] leading-none">◆</span>
                        </div>
                        <div className="text-right text-[13px] font-bold text-[#8c96a6] flex items-center justify-end gap-1.5">
                          Bitiş
                          <span className="text-[9px] text-[#a9b2bf] leading-none">◆</span>
                        </div>
                      </div>

                      <div>
                        {homeAssignedTasks.length > 0 ? (
                          homeAssignedTasks.slice(0, 3).map((task, index) => (
                            <button
                              key={`home-assigned-photoshop-${task.projectName}-${task.id}`}
                              type="button"
                              onClick={() => openHomeTaskDetail(task)}
                              className="w-full h-[40px] px-5 grid grid-cols-[36px_minmax(0,1fr)_142px] items-center border-b border-[#eef1f5] hover:bg-[#fafbfc] transition-all text-left"
                            >
                              <div className="text-[12px] font-semibold text-[#8b94a3]">{index + 1}.</div>
                              <div className="min-w-0 flex items-center gap-2.5">
                                <span
                                  className="w-[10px] h-[10px] rounded-full shrink-0"
                                  style={{ backgroundColor: task.homeDate && task.homeDate < todayStart ? '#ef4444' : task.columnColor || '#f6b15f' }}
                                />
                                <span className="min-w-0 text-[13px] font-semibold text-[#3d4552] truncate tracking-[-0.01em]">
                                  {task.title}
                                </span>
                              </div>

                              <div className="text-right text-[12.5px] font-semibold text-[#444b57] truncate">
                                {task.homeDate
                                  ? `${new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(task.homeDate)}, ${new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(task.homeDate)}`
                                  : '-'}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="h-[120px] flex items-center justify-center text-[12px] font-semibold text-[#98a1b2]">
                            Gösterilecek görev yok
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveContentMenu('Projeler');
                          setActiveMenu('Projeler');
                          setActiveTab('Görevler');
                        }}
                        className="h-[38px] w-full bg-[#fbfcfd] text-[12px] font-semibold text-[#a1aab8] hover:text-[#2f66cf] hover:bg-[#f8fafc] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="text-[10px] leading-none">⌄</span>
                        Daha Fazla Göster
                      </button>
                    </div>
                  </section>

                  <section>
                    <div className="h-7 mb-2 flex items-center justify-between">
                      <h2 className="text-[13px] font-bold text-[#293241] tracking-[-0.01em]">Yapışkan Notlar</h2>

                      <div className="flex items-center gap-1.5 text-[#b7bfcc]">
                        <button
                          type="button"
                          onClick={() => setIsQuickNoteSearchOpen((prev) => !prev)}
                          className={`w-7 h-7 rounded-[7px] transition-all flex items-center justify-center ${
                            isQuickNoteSearchOpen ? 'bg-white text-[#55ace8] shadow-sm' : 'hover:bg-white hover:text-[#55ace8]'
                          }`}
                          title="Notlarda ara"
                        >
                          <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (!isQuickNoteComposerOpen) {
                              resetQuickNoteComposer();
                            }
                            setIsQuickNoteComposerOpen((prev) => !prev);
                          }}
                          className={`w-7 h-7 rounded-[7px] transition-all flex items-center justify-center ${
                            isQuickNoteComposerOpen ? 'bg-[#55ace8] text-white shadow-sm' : 'hover:bg-white hover:text-[#55ace8]'
                          }`}
                          title="Yeni hızlı not"
                        >
                          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="zrc-home-card relative bg-white rounded-[13px] shadow-[0_12px_32px_rgba(30,43,70,0.06)] overflow-visible">
                      {(isQuickNoteSearchOpen || isQuickNoteComposerOpen) && (
                        <div className={`${isQuickNoteSearchOpen ? 'px-4 pt-4 space-y-3' : 'h-0'} relative z-[640]`}>
                          {isQuickNoteSearchOpen && (
                            <div className="h-[38px] rounded-[12px] bg-[#f7f9fc] border border-[#e7ebf1] px-3 flex items-center gap-2">
                              <svg className="w-[15px] h-[15px] text-[#9aa4b2] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Z" />
                              </svg>
                              <input
                                value={quickNoteSearch}
                                onChange={(event) => setQuickNoteSearch(event.target.value)}
                                placeholder="Notlarda hızlı ara..."
                                className="min-w-0 flex-1 h-full bg-transparent text-[12px] font-semibold text-[#3d4552] placeholder:text-[#b6beca] outline-none"
                              />
                              {quickNoteSearch.trim() && (
                                <button
                                  type="button"
                                  onClick={() => setQuickNoteSearch('')}
                                  className="w-6 h-6 rounded-full text-[#a9b2bf] hover:bg-white hover:text-[#ef4444] transition-all flex items-center justify-center"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          )}

                          {isQuickNoteComposerOpen && (
                            <form
                              onSubmit={createQuickNoteFromHome}
                              className="zrc-note-composer-float absolute right-1 top-[-44px] z-[680] w-[382px] max-w-[calc(100vw-48px)] rounded-[18px] shadow-[0_28px_56px_rgba(55,81,145,0.22)] p-4 overflow-hidden"
                              style={{
                                backgroundColor: '#f7f4ea',
                                backgroundImage:
                                  'radial-gradient(circle at 14% 18%, rgba(47,102,207,0.13) 0 1px, transparent 1.2px), radial-gradient(circle at 82% 24%, rgba(255,54,0,0.11) 0 1px, transparent 1.3px), radial-gradient(circle at 38% 76%, rgba(41,50,65,0.08) 0 1px, transparent 1.3px), linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(238,247,255,0.92) 42%, rgba(255,245,235,0.95) 100%)',
                                backgroundSize: '26px 26px, 31px 31px, 35px 35px, 100% 100%'
                              }}
                            >
                              <div className="absolute -top-2 right-7 w-4 h-4 rotate-45 bg-[#f8f5ed]" />
                              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#5fb7ff]/22 blur-2xl" />
                              <div className="absolute -bottom-12 -left-10 w-28 h-28 rounded-full bg-[#ff7a45]/14 blur-2xl" />
                              <div className="absolute inset-0 opacity-[0.18] pointer-events-none bg-[linear-gradient(90deg,rgba(41,50,65,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(41,50,65,0.06)_1px,transparent_1px)] bg-[length:18px_18px]" />
                              <div className="absolute top-3 right-4 w-11 h-2 rounded-full bg-white/80 shadow-[0_5px_14px_rgba(66,86,130,0.14)] rotate-[3deg]" />

                              <div className="relative z-10 flex items-start gap-3">
                                <div className="zrc-note-mini-float mt-1 w-9 h-9 rounded-[12px] bg-[#2f66cf] text-white shadow-[0_10px_22px_rgba(47,102,207,0.22)] flex items-center justify-center">
                                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10a2 2 0 0 1 2 2v12l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2Z" />
                                  </svg>
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="text-[10px] font-black text-[#778399] mb-2">
                                    {editingQuickNoteId ? 'Notu düzenle' : 'Yeni hızlı not'}
                                  </div>

                                  <input
                                    value={quickNoteTitleDraft}
                                    onChange={(event) => setQuickNoteTitleDraft(event.target.value)}
                                    placeholder="Başlık"
                                    className="w-full h-[34px] bg-white/74 backdrop-blur rounded-[12px] px-3 text-[13px] font-black text-[#334155] placeholder:text-[#9aa8bd] outline-none focus:bg-white/95 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                                  />

                                  <textarea
                                    value={quickNoteDraft}
                                    onChange={(event) => setQuickNoteDraft(event.target.value)}
                                    onKeyDown={(event) => {
                                      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                                        event.preventDefault();
                                        createQuickNoteFromHome(event);
                                      }
                                    }}
                                    placeholder="Detaylı açıklama yaz..."
                                    rows={4}
                                    className="mt-2 w-full resize-none bg-white/70 backdrop-blur rounded-[13px] px-3 py-2.5 text-[12.5px] font-semibold leading-5 text-[#334155] placeholder:text-[#9aa8bd] outline-none focus:bg-white/94 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                                  />

                                  <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-[#7b8799]">
                                      {editingQuickNoteId ? 'Başlık + detay güncellenecek' : 'Başlık + detay olarak sabitlenecek'}
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          resetQuickNoteComposer();
                                          setIsQuickNoteComposerOpen(false);
                                        }}
                                        className="h-[28px] px-3 rounded-full bg-white/70 text-[#7b8799] text-[10px] font-black hover:bg-white transition-all"
                                      >
                                        Vazgeç
                                      </button>

                                      <button
                                        type="submit"
                                        className="h-[28px] px-4 rounded-full bg-[#2f66cf] text-white text-[10px] font-black hover:bg-[#285cc0] active:scale-[0.98] transition-all shadow-[0_10px_18px_rgba(47,102,207,0.18)]"
                                      >
                                        {editingQuickNoteId ? 'Güncelle' : 'Sabitle'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          )}
                        </div>
                      )}

                      <div className={`${
                        quickNotes.filter((note) =>
                          !quickNoteSearch.trim() ||
                          `${getQuickNoteTitle(note)} ${getQuickNoteDetail(note)}`.toLocaleLowerCase('tr-TR').includes(quickNoteSearch.trim().toLocaleLowerCase('tr-TR'))
                        ).length > 0 ? 'max-h-[330px] overflow-y-auto custom-scrollbar p-4' : 'p-4'
                      }`}>
                        {quickNotes.filter((note) =>
                          !quickNoteSearch.trim() ||
                          `${getQuickNoteTitle(note)} ${getQuickNoteDetail(note)}`.toLocaleLowerCase('tr-TR').includes(quickNoteSearch.trim().toLocaleLowerCase('tr-TR'))
                        ).length > 0 ? (
                          <div className="grid grid-cols-1 gap-2.5">
                            {quickNotes
                              .filter((note) =>
                                !quickNoteSearch.trim() ||
                                `${getQuickNoteTitle(note)} ${getQuickNoteDetail(note)}`.toLocaleLowerCase('tr-TR').includes(quickNoteSearch.trim().toLocaleLowerCase('tr-TR'))
                              )
                              .map((note) => (
                                <div
                                  key={note.id}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => openQuickNoteComposerForEdit(note)}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                      event.preventDefault();
                                      openQuickNoteComposerForEdit(note);
                                    }
                                  }}
                                  className="min-h-[46px] rounded-[11px] bg-[#fcfdff] px-3 py-2 transition-all hover:-translate-y-[1px] hover:shadow-[0_10px_22px_rgba(30,43,70,0.06)] cursor-pointer"
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#40aee8] shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[11.5px] font-black leading-5 text-[#354052] truncate">
                                        {getQuickNoteTitle(note)}
                                      </div>
                                      {getQuickNoteDetail(note) && (
                                        <div className="text-[10.5px] font-semibold leading-4 text-[#7b8799] line-clamp-2 whitespace-pre-wrap">
                                          {getQuickNoteDetail(note)}
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setPendingDeleteQuickNoteId(note.id);
                                      }}
                                      className="w-5 h-5 rounded-[5px] text-[#c2c8d2] hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
                                    >
                                      ×
                                    </button>
                                  </div>

                                  {pendingDeleteQuickNoteId === note.id && (
                                    <div
                                      onClick={(event) => event.stopPropagation()}
                                      className="mt-2 ml-3 rounded-[10px] bg-[#fff5f5] px-2.5 py-2 flex items-center justify-between gap-2"
                                    >
                                      <span className="text-[10px] font-bold text-[#b42318]">Bu not silinsin mi?</span>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setPendingDeleteQuickNoteId(null)}
                                          className="h-[24px] px-2.5 rounded-full bg-white text-[#7b8799] text-[9px] font-black hover:bg-[#f8fafc] transition-all"
                                        >
                                          Vazgeç
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteQuickNoteFromHome(note.id)}
                                          className="h-[24px] px-2.5 rounded-full bg-[#ef4444] text-white text-[9px] font-black hover:bg-[#dc2626] transition-all"
                                        >
                                          Sil
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="h-[296px] flex flex-col items-center justify-center text-center">
                            <div className="relative w-[244px] h-[130px] mb-5">
                              <div className="absolute left-[38px] top-[14px] w-[74px] h-[76px] bg-[#eef1f5] rounded-[2px]" />
                              <div className="absolute left-[82px] top-[0px] w-[78px] h-[62px] bg-[#f2f4f7] rounded-[2px]" />
                              <div className="absolute left-[92px] top-[52px] w-[104px] h-[70px] bg-[#fbfcfd] rounded-[2px] border border-[#eceff4]" />
                              <div className="absolute left-[112px] top-[68px] w-[58px] h-[3px] rounded bg-[#d9dee7]" />
                              <div className="absolute left-[112px] top-[86px] w-[86px] h-[3px] rounded bg-[#d9dee7]" />
                              <div className="absolute left-[112px] top-[104px] w-[58px] h-[3px] rounded bg-[#d9dee7]" />
                              <div className="absolute left-[16px] top-[42px] space-y-4">
                                <span className="block w-[4px] h-[4px] rounded-full bg-[#40aee8]" />
                                <span className="block w-[4px] h-[4px] rounded-full bg-[#40aee8]" />
                                <span className="block w-[4px] h-[4px] rounded-full bg-[#40aee8]" />
                              </div>
                              <div className="absolute right-[36px] top-[28px] w-[26px] h-[26px] rounded-full bg-[#2f3a45]" />
                              <div className="absolute right-[20px] top-[26px] w-[24px] h-[30px] rounded-full bg-[#2f3a45]" />
                              <div className="absolute right-[42px] top-[52px] w-[32px] h-[46px] bg-[#27aee9] rounded-t-[18px]" />
                              <div className="absolute right-[64px] top-[76px] w-[34px] h-[6px] bg-[#27aee9] rounded-full -rotate-[13deg]" />
                              <div className="absolute right-[42px] top-[96px] w-[8px] h-[40px] bg-[#bdc3cc] rotate-[4deg] origin-top" />
                              <div className="absolute right-[62px] top-[96px] w-[8px] h-[40px] bg-[#bdc3cc] -rotate-[14deg] origin-top" />
                              <div className="absolute right-[70px] top-[130px] w-[22px] h-[4px] bg-[#2f3a45] rounded-full" />
                              <div className="absolute right-[32px] top-[130px] w-[20px] h-[4px] bg-[#2f3a45] rounded-full" />
                            </div>
                            <div className="text-[13px] font-semibold text-[#2f3744]">
                              {quickNoteSearch.trim() ? 'Aramanızla eşleşen not yok.' : 'Görüntülenecek hiçbir notunuz yok!'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>

                <section className="min-w-0">
                  <div className="h-7 mb-2 flex items-center justify-between">
                    <h2 className="text-[13px] font-bold text-[#293241] tracking-[-0.01em]">Takvimim</h2>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsCalendarDisplayMenuOpen((prev) => !prev);
                        }}
                        className="h-[27px] px-3 rounded-[6px] bg-[#2f66cf] text-white text-[11px] font-bold hover:bg-[#285cc0] transition-all flex items-center gap-2.5 shadow-[0_8px_18px_rgba(47,102,207,0.18)]"
                      >
                        Gösterim Şekli
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h12M10 19h4" />
                        </svg>
                      </button>

                      {isCalendarDisplayMenuOpen && (
                        <div
                          onClick={(menuEvent) => menuEvent.stopPropagation()}
                          className="absolute right-0 top-[40px] z-[620] w-[248px] rounded-[10px] bg-white border border-[#e6e9ee] shadow-[0_18px_38px_rgba(15,23,42,0.14)] px-4 py-3"
                        >
                          <div className="absolute -top-2 right-[72px] w-4 h-4 rotate-45 bg-white border-l border-t border-[#e6e9ee]" />

                          <div className="space-y-2.5 relative z-10">
                            {[
                              {
                                label: 'Uzun Süreli Görevleri Gizle',
                                checked: calendarDisplayOptions.hideLongTasks,
                                keyName: 'hideLongTasks'
                              },
                              {
                                label: 'Tamamlanmış Görevleri Gizle',
                                checked: calendarDisplayOptions.hideCompletedTasks,
                                keyName: 'hideCompletedTasks'
                              },
                              {
                                label: 'Arşivlenmiş Görevleri Gizle',
                                checked: calendarDisplayOptions.hideArchivedTasks,
                                keyName: 'hideArchivedTasks'
                              }
                            ].map((option) => (
                              <button
                                key={`home-display-option-${option.keyName}`}
                                type="button"
                                onClick={() =>
                                  setCalendarDisplayOptions((prev) => ({
                                    ...prev,
                                    [option.keyName]: !prev[option.keyName]
                                  }))
                                }
                                className="w-full flex items-center gap-2.5 text-left text-[13px] font-bold text-[#7a8495] hover:text-[#4b5563] transition-all"
                              >
                                <span
                                  className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    option.checked
                                      ? 'bg-[#4fbd7d] border-[#4fbd7d] text-white'
                                      : 'bg-white border-[#c4ccd7] text-transparent'
                                  }`}
                                >
                                  <svg className="w-[12px] h-[12px]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="zrc-home-card min-h-[660px] bg-white rounded-[13px] shadow-[0_12px_32px_rgba(30,43,70,0.06)] overflow-hidden">
                    <div className="h-[64px] px-6 border-b border-[#eceff4] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={goToPreviousCalendarPeriod}
                          className="w-8 h-8 rounded-[6px] text-[#293241] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[28px] leading-none"
                        >
                          ‹
                        </button>

                        <div className="min-w-[168px] text-center text-[20px] font-bold text-[#293241] capitalize tracking-[-0.02em]">
                          {calendarHeaderTitle}
                        </div>

                        <button
                          type="button"
                          onClick={goToNextCalendarPeriod}
                          className="w-8 h-8 rounded-[6px] text-[#293241] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[28px] leading-none"
                        >
                          ›
                        </button>
                      </div>

                      <div className="h-[26px] rounded-full flex items-center gap-2">
                        {['Ay', 'Hafta', 'Gün', 'Liste'].map((viewName) => (
                          <button
                            key={`home-calendar-view-${viewName}`}
                            type="button"
                            onClick={() => changeCalendarView(viewName)}
                            className={`h-[24px] px-4 rounded-full text-[11px] font-bold transition-all ${
                              calendarView === viewName
                                ? 'bg-[#56a8e8] text-white shadow-sm'
                                : 'bg-[#f0f1f3] text-[#8f98a6] hover:bg-[#e8eaee]'
                            }`}
                          >
                            {viewName}
                          </button>
                        ))}
                      </div>
                    </div>

                                        {/* zrc-v523-block-calendarview-ay */}
                    <ZRCAppShellCalendarViewAyBlock2
                      calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                      Ay={typeof Ay !== 'undefined' ? Ay : undefined}
                      grid={typeof grid !== 'undefined' ? grid : undefined}
                      h={typeof h !== 'undefined' ? h : undefined}
                      bg={typeof bg !== 'undefined' ? bg : undefined}
                      white={typeof white !== 'undefined' ? white : undefined}
                      border={typeof border !== 'undefined' ? border : undefined}
                      b={typeof b !== 'undefined' ? b : undefined}
                      eceff4={typeof eceff4 !== 'undefined' ? eceff4 : undefined}
                      Pzt={typeof Pzt !== 'undefined' ? Pzt : undefined}
                      Sal={typeof Sal !== 'undefined' ? Sal : undefined}
                      Per={typeof Per !== 'undefined' ? Per : undefined}
                      Cum={typeof Cum !== 'undefined' ? Cum : undefined}
                      Cmt={typeof Cmt !== 'undefined' ? Cmt : undefined}
                      Paz={typeof Paz !== 'undefined' ? Paz : undefined}
                      home={typeof home !== 'undefined' ? home : undefined}
                      calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                      head={typeof head !== 'undefined' ? head : undefined}
                      flex={typeof flex !== 'undefined' ? flex : undefined}
                      items={typeof items !== 'undefined' ? items : undefined}
                      center={typeof center !== 'undefined' ? center : undefined}
                      justify={typeof justify !== 'undefined' ? justify : undefined}
                      text={typeof text !== 'undefined' ? text : undefined}
                      font={typeof font !== 'undefined' ? font : undefined}
                      semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                      repeat={typeof repeat !== 'undefined' ? repeat : undefined}
                      calendarGridDays={typeof calendarGridDays !== 'undefined' ? calendarGridDays : undefined}
                      getMenuCalendarTasksForDay={typeof getMenuCalendarTasksForDay !== 'undefined' ? getMenuCalendarTasksForDay : undefined}
                      calendarMonthDate={typeof calendarMonthDate !== 'undefined' ? calendarMonthDate : undefined}
                      isSameCalendarDay={typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined}
                      todayStart={typeof todayStart !== 'undefined' ? todayStart : undefined}
                      month={typeof month !== 'undefined' ? month : undefined}
                      tabIndex={typeof tabIndex !== 'undefined' ? tabIndex : undefined}
                      data={typeof data !== 'undefined' ? data : undefined}
                      zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                      formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                      openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                      onMouseUp={typeof onMouseUp !== 'undefined' ? onMouseUp : undefined}
                      Enter={typeof Enter !== 'undefined' ? Enter : undefined}
                      min={typeof min !== 'undefined' ? min : undefined}
                      px={typeof px !== 'undefined' ? px : undefined}
                      py={typeof py !== 'undefined' ? py : undefined}
                      left={typeof left !== 'undefined' ? left : undefined}
                      transition={typeof transition !== 'undefined' ? transition : undefined}
                      all={typeof all !== 'undefined' ? all : undefined}
                      fafcff={typeof fafcff !== 'undefined' ? fafcff : undefined}
                      overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                      hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                      cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                      pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                      fbfcfe={typeof fbfcfe !== 'undefined' ? fbfcfe : undefined}
                      start={typeof start !== 'undefined' ? start : undefined}
                      end={typeof end !== 'undefined' ? end : undefined}
                      w={typeof w !== 'undefined' ? w : undefined}
                      rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                      full={typeof full !== 'undefined' ? full : undefined}
                      c4cbd5={typeof c4cbd5 !== 'undefined' ? c4cbd5 : undefined}
                      mt={typeof mt !== 'undefined' ? mt : undefined}
                      space={typeof space !== 'undefined' ? space : undefined}
                      cal={typeof cal !== 'undefined' ? cal : undefined}
                      openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                      gap={typeof gap !== 'undefined' ? gap : undefined}
                      e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                      l={typeof l !== 'undefined' ? l : undefined}
                      shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                      getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                      shrink={typeof shrink !== 'undefined' ? shrink : undefined}
                      getPremiumCalendarDotStyle={typeof getPremiumCalendarDotStyle !== 'undefined' ? getPremiumCalendarDotStyle : undefined}
                      black={typeof black !== 'undefined' ? black : undefined}
                      current={typeof current !== 'undefined' ? current : undefined}
                      truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                      formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                      bold={typeof bold !== 'undefined' ? bold : undefined}
                      b8bfca={typeof b8bfca !== 'undefined' ? b8bfca : undefined}
                    />

                                        {/* zrc-v523-block-calendarview-hafta */}
                    <ZRCAppShellCalendarViewHaftaBlock2
                      calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                      Hafta={typeof Hafta !== 'undefined' ? Hafta : undefined}
                      bg={typeof bg !== 'undefined' ? bg : undefined}
                      white={typeof white !== 'undefined' ? white : undefined}
                      grid={typeof grid !== 'undefined' ? grid : undefined}
                      h={typeof h !== 'undefined' ? h : undefined}
                      border={typeof border !== 'undefined' ? border : undefined}
                      b={typeof b !== 'undefined' ? b : undefined}
                      edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                      calendarWeekDays={typeof calendarWeekDays !== 'undefined' ? calendarWeekDays : undefined}
                      isSameCalendarDay={typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined}
                      todayStart={typeof todayStart !== 'undefined' ? todayStart : undefined}
                      home={typeof home !== 'undefined' ? home : undefined}
                      week={typeof week !== 'undefined' ? week : undefined}
                      head={typeof head !== 'undefined' ? head : undefined}
                      data={typeof data !== 'undefined' ? data : undefined}
                      zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                      calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                      formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                      openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                      text={typeof text !== 'undefined' ? text : undefined}
                      center={typeof center !== 'undefined' ? center : undefined}
                      font={typeof font !== 'undefined' ? font : undefined}
                      bold={typeof bold !== 'undefined' ? bold : undefined}
                      transition={typeof transition !== 'undefined' ? transition : undefined}
                      all={typeof all !== 'undefined' ? all : undefined}
                      f8fbff={typeof f8fbff !== 'undefined' ? f8fbff : undefined}
                      fafcff={typeof fafcff !== 'undefined' ? fafcff : undefined}
                      formatCalendarDate={typeof formatCalendarDate !== 'undefined' ? formatCalendarDate : undefined}
                      formatCalendarWeekday={typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined}
                      px={typeof px !== 'undefined' ? px : undefined}
                      flex={typeof flex !== 'undefined' ? flex : undefined}
                      items={typeof items !== 'undefined' ? items : undefined}
                      getMenuCalendarAllDayTasks={typeof getMenuCalendarAllDayTasks !== 'undefined' ? getMenuCalendarAllDayTasks : undefined}
                      allday={typeof allday !== 'undefined' ? allday : undefined}
                      gap={typeof gap !== 'undefined' ? gap : undefined}
                      overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                      hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                      cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                      pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                      onPointerUp={typeof onPointerUp !== 'undefined' ? onPointerUp : undefined}
                      openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                      w={typeof w !== 'undefined' ? w : undefined}
                      full={typeof full !== 'undefined' ? full : undefined}
                      rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                      left={typeof left !== 'undefined' ? left : undefined}
                      black={typeof black !== 'undefined' ? black : undefined}
                      current={typeof current !== 'undefined' ? current : undefined}
                      truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                      max={typeof max !== 'undefined' ? max : undefined}
                      auto={typeof auto !== 'undefined' ? auto : undefined}
                      custom={typeof custom !== 'undefined' ? custom : undefined}
                      scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
                      menuCalendarHours={typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined}
                      pt={typeof pt !== 'undefined' ? pt : undefined}
                      semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                      getMenuCalendarTasksForHour={typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined}
                      relative={typeof relative !== 'undefined' ? relative : undefined}
                      repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                      linear={typeof linear !== 'undefined' ? linear : undefined}
                      gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                      fff_0={typeof fff_0 !== 'undefined' ? fff_0 : undefined}
                      fff_8px={typeof fff_8px !== 'undefined' ? fff_8px : undefined}
                      fbfbfb_8px={typeof fbfbfb_8px !== 'undefined' ? fbfbfb_8px : undefined}
                      fbfbfb_16px={typeof fbfbfb_16px !== 'undefined' ? fbfbfb_16px : undefined}
                      absolute={typeof absolute !== 'undefined' ? absolute : undefined}
                      right={typeof right !== 'undefined' ? right : undefined}
                      top={typeof top !== 'undefined' ? top : undefined}
                      min={typeof min !== 'undefined' ? min : undefined}
                      e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                      l={typeof l !== 'undefined' ? l : undefined}
                      py={typeof py !== 'undefined' ? py : undefined}
                      shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                      getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                      formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                    />

                                        {/* zrc-v523-block-calendarview-gun */}
                    <ZRCAppShellCalendarViewGunBlock
                      calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                      bg={typeof bg !== 'undefined' ? bg : undefined}
                      white={typeof white !== 'undefined' ? white : undefined}
                      data={typeof data !== 'undefined' ? data : undefined}
                      zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                      calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                      day={typeof day !== 'undefined' ? day : undefined}
                      formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                      calendarFocusedDate={typeof calendarFocusedDate !== 'undefined' ? calendarFocusedDate : undefined}
                      openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                      w={typeof w !== 'undefined' ? w : undefined}
                      full={typeof full !== 'undefined' ? full : undefined}
                      h={typeof h !== 'undefined' ? h : undefined}
                      grid={typeof grid !== 'undefined' ? grid : undefined}
                      border={typeof border !== 'undefined' ? border : undefined}
                      b={typeof b !== 'undefined' ? b : undefined}
                      edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                      fafcff={typeof fafcff !== 'undefined' ? fafcff : undefined}
                      transition={typeof transition !== 'undefined' ? transition : undefined}
                      all={typeof all !== 'undefined' ? all : undefined}
                      flex={typeof flex !== 'undefined' ? flex : undefined}
                      items={typeof items !== 'undefined' ? items : undefined}
                      center={typeof center !== 'undefined' ? center : undefined}
                      justify={typeof justify !== 'undefined' ? justify : undefined}
                      text={typeof text !== 'undefined' ? text : undefined}
                      font={typeof font !== 'undefined' ? font : undefined}
                      bold={typeof bold !== 'undefined' ? bold : undefined}
                      formatCalendarWeekday={typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined}
                      px={typeof px !== 'undefined' ? px : undefined}
                      cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                      pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                      getMenuCalendarAllDayTasks={typeof getMenuCalendarAllDayTasks !== 'undefined' ? getMenuCalendarAllDayTasks : undefined}
                      home={typeof home !== 'undefined' ? home : undefined}
                      allday={typeof allday !== 'undefined' ? allday : undefined}
                      openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                      mr={typeof mr !== 'undefined' ? mr : undefined}
                      rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                      e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                      l={typeof l !== 'undefined' ? l : undefined}
                      left={typeof left !== 'undefined' ? left : undefined}
                      black={typeof black !== 'undefined' ? black : undefined}
                      current={typeof current !== 'undefined' ? current : undefined}
                      truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                      shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                      getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                      max={typeof max !== 'undefined' ? max : undefined}
                      overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                      auto={typeof auto !== 'undefined' ? auto : undefined}
                      custom={typeof custom !== 'undefined' ? custom : undefined}
                      scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
                      menuCalendarHours={typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined}
                      getMenuCalendarTasksForHour={typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined}
                      pt={typeof pt !== 'undefined' ? pt : undefined}
                      semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                      relative={typeof relative !== 'undefined' ? relative : undefined}
                      repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                      linear={typeof linear !== 'undefined' ? linear : undefined}
                      gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                      fff_0={typeof fff_0 !== 'undefined' ? fff_0 : undefined}
                      fff_8px={typeof fff_8px !== 'undefined' ? fff_8px : undefined}
                      fbfbfb_8px={typeof fbfbfb_8px !== 'undefined' ? fbfbfb_8px : undefined}
                      fbfbfb_16px={typeof fbfbfb_16px !== 'undefined' ? fbfbfb_16px : undefined}
                      absolute={typeof absolute !== 'undefined' ? absolute : undefined}
                      right={typeof right !== 'undefined' ? right : undefined}
                      top={typeof top !== 'undefined' ? top : undefined}
                      min={typeof min !== 'undefined' ? min : undefined}
                      py={typeof py !== 'undefined' ? py : undefined}
                      hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                      formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                    />

                    {calendarView === 'Liste' && (
                      <div className="bg-white min-h-[590px]">
                        {menuCalendarListGroups.length > 0 ? (
                          menuCalendarListGroups.map((group) => (
                            <div key={`home-list-group-${group.day.toISOString()}`}>
                              <button
                                type="button"
                                data-zrc-calendar-day={formatDateForTaskModal(group.day)}
                                onClick={(event) => openHomeCalendarQuickTaskForDate(group.day, event)}
                                className="w-full h-[30px] px-3.5 bg-[#f1f3f6] border-b border-[#d6dce5] hover:bg-[#e9edf3] transition-all flex items-center justify-between"
                              >
                                <div className="text-[10.5px] font-bold text-[#374151] capitalize">
                                  {new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(group.day)}
                                </div>
                                <div className="text-[10px] font-bold text-[#374151]">
                                  {formatMenuCalendarWeekHeader(group.day)}
                                </div>
                              </button>

                              {group.tasks.map((task) => (
                                <button
                                  key={`home-list-task-${group.day.toISOString()}-${task.projectName}-${task.id}`}
                                  type="button"
                                  onClick={() => openMenuCalendarTask(task)}
                                  className="w-full h-[34px] grid grid-cols-[64px_1fr] items-center border-b border-[#e6e9ef] text-left hover:bg-[#fafcff]"
                                >
                                  <div className="px-3 text-[10px] font-bold text-[#596270]">
                                    {formatMenuCalendarTaskTime(task) || ' '}
                                  </div>
                                  <div className="min-w-0 text-[10px] font-semibold text-[#596270] truncate">
                                    <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: task.columnColor || '#55ace8' }} />
                                    {task.title}
                                  </div>
                                </button>
                              ))}
                            </div>
                          ))
                        ) : (
                          <div className="h-[240px] flex items-center justify-center text-[11px] font-semibold text-[#9aa3b1]">
                            Bu aralıkta planlı görev yok.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : activeContentMenu === 'Takvimim' ? (
          <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(47,102,207,0.05),transparent_34%),linear-gradient(180deg,#f7f8fb_0%,#eef1f5_100%)] overflow-hidden animate-fade-in">
            <div className="h-full pl-5 pr-[76px] pt-4 pb-6 overflow-y-auto custom-scrollbar">
              <div className="h-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={openMenuCalendarQuickTask}
                  className="h-8 px-4 rounded-full bg-[#1f9d61] text-white text-[10.5px] font-black hover:bg-[#188b55] transition-all flex items-center gap-2 shadow-[0_10px_24px_rgba(31,157,97,0.18)]"
                >
                  Görev Oluştur
                  <span className="text-[13px] leading-none">+</span>
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuCalendarFilterOpen((prev) => !prev);
                    setIsMenuCalendarStatusOpen(false);
                  }}
                  className="relative h-8 px-4 rounded-full bg-[#2563eb] text-white text-[10.5px] font-black hover:bg-[#1d56d6] transition-all flex items-center gap-2 shadow-[0_10px_24px_rgba(37,99,235,0.18)]"
                >
                  Filtreler
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
                  </svg>

                  {isMenuCalendarFilterOpen && (
                    <div
                      onClick={(filterEvent) => filterEvent.stopPropagation()}
                      className="absolute right-0 top-[34px] z-[650] w-[300px] rounded-[4px] bg-white border border-[#e1e5eb] shadow-[0_18px_45px_rgba(15,23,42,0.16)] text-left overflow-visible"
                    >
                      <div className="p-3">
                        <div className="text-[12px] font-black text-[#374151]">Filtreler</div>

                        <div className="mt-3 text-[10px] font-black text-[#7f8a9b]">Gösterim Şekli</div>

                        <div className="mt-2 space-y-2">
                          {[
                            {
                              label: 'Uzun Süreli Görevleri Gizle',
                              checked: calendarDisplayOptions.hideLongTasks,
                              keyName: 'hideLongTasks'
                            },
                            {
                              label: 'Tamamlanmış Görevleri Gizle',
                              checked: calendarDisplayOptions.hideCompletedTasks,
                              keyName: 'hideCompletedTasks'
                            },
                            {
                              label: 'Arşivlenmiş Görevleri Gizle',
                              checked: calendarDisplayOptions.hideArchivedTasks,
                              keyName: 'hideArchivedTasks'
                            }
                          ].map((option) => (
                            <button
                              key={option.keyName}
                              type="button"
                              onClick={() =>
                                setCalendarDisplayOptions((prev) => ({
                                  ...prev,
                                  [option.keyName]: !prev[option.keyName]
                                }))
                              }
                              className="w-full h-6 flex items-center gap-2 text-[10.5px] font-bold text-[#667085] hover:text-[#374151]"
                            >
                              <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                option.checked
                                  ? 'bg-[#4fbd7d] border-[#4fbd7d] text-white'
                                  : 'bg-white border-[#cbd2dc] text-transparent'
                              }`}>
                                ✓
                              </span>
                              {option.label}
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 text-[10px] font-black text-[#7f8a9b]">Durumlar</div>

                        <div className="relative mt-1.5">
                          <button
                            type="button"
                            onClick={() => setIsMenuCalendarStatusOpen((prev) => !prev)}
                            className="w-full h-8 rounded-[14px] bg-white border border-[#dfe3ea] px-3 flex items-center justify-between text-[10px] font-bold text-[#555f70]"
                          >
                            {menuCalendarStatusFilter}
                            <svg className="w-3 h-3 text-[#98a1b2]" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {isMenuCalendarStatusOpen && (
                            <div className="absolute left-0 right-0 top-[34px] z-[670] bg-white border border-[#dfe3ea] rounded-[4px] shadow-[0_14px_32px_rgba(15,23,42,0.14)] overflow-hidden">
                              {menuCalendarStatusOptions.map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => {
                                    setMenuCalendarStatusFilter(status);
                                    setIsMenuCalendarStatusOpen(false);
                                  }}
                                  className={`w-full h-8 px-3 text-left text-[10px] font-bold hover:bg-[#f7f8fa] ${
                                    menuCalendarStatusFilter === status ? 'text-[#2f66cf]' : 'text-[#555f70]'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 text-[10px] font-black text-[#7f8a9b]">İlgili</div>

                        <div className="mt-2 space-y-2">
                          {projects.slice(0, 5).map((projectName) => (
                            <div key={`calendar-filter-project-${projectName}`} className="h-6 flex items-center gap-2 text-[10.5px] font-bold text-[#667085]">
                              <span className="w-4 h-4 rounded-full bg-[#4fbd7d] text-white flex items-center justify-center text-[9px]">✓</span>
                              <span className="truncate">{projectName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>

              <div className="mt-3 bg-white border border-white/80 rounded-[18px] shadow-[0_24px_60px_rgba(15,23,42,0.08)] overflow-hidden ring-1 ring-slate-200/70">
                <div className="h-[56px] px-5 flex items-center justify-between border-b border-[#edf0f4] bg-white/95">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goToPreviousCalendarPeriod}
                      className="w-8 h-8 rounded-full text-[#3b4452] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[20px] leading-none"
                    >
                      ‹
                    </button>

                    <div className="text-[15px] font-black text-[#303949] min-w-[160px] capitalize">
                      {calendarHeaderTitle}
                    </div>

                    <button
                      type="button"
                      onClick={goToNextCalendarPeriod}
                      className="w-8 h-8 rounded-full text-[#3b4452] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[20px] leading-none"
                    >
                      ›
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        setCalendarMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
                        setCalendarFocusedDate(now);
                      }}
                      className="h-6 px-3 rounded-full bg-[#f1f2f4] text-[9px] font-black text-[#b4bbc7] hover:text-[#6b7280] transition-all"
                    >
                      Bugün
                    </button>
                  </div>

                  <div className="h-7 p-0.5 rounded-full bg-[#eef0f4] flex items-center gap-0.5">
                    {['Ay', 'Hafta', 'Gün', 'Liste'].map((view) => (
                      <button
                        key={`menu-calendar-view-${view}`}
                        type="button"
                        onClick={() => setCalendarView(view)}
                        className={`h-6 px-3 rounded-full text-[9px] font-black transition-all ${
                          calendarView === view
                            ? 'bg-[#55ace8] text-white shadow-sm'
                            : 'text-[#8f98a6] hover:bg-white hover:text-[#4b5563]'
                        }`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>

                                {/* zrc-v523-block-calendarview-ay */}
                <ZRCAppShellCalendarViewAyBlock
                  calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                  Ay={typeof Ay !== 'undefined' ? Ay : undefined}
                  grid={typeof grid !== 'undefined' ? grid : undefined}
                  h={typeof h !== 'undefined' ? h : undefined}
                  bg={typeof bg !== 'undefined' ? bg : undefined}
                  white={typeof white !== 'undefined' ? white : undefined}
                  border={typeof border !== 'undefined' ? border : undefined}
                  b={typeof b !== 'undefined' ? b : undefined}
                  edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                  Pzt={typeof Pzt !== 'undefined' ? Pzt : undefined}
                  Sal={typeof Sal !== 'undefined' ? Sal : undefined}
                  Per={typeof Per !== 'undefined' ? Per : undefined}
                  Cum={typeof Cum !== 'undefined' ? Cum : undefined}
                  Cmt={typeof Cmt !== 'undefined' ? Cmt : undefined}
                  Paz={typeof Paz !== 'undefined' ? Paz : undefined}
                  px={typeof px !== 'undefined' ? px : undefined}
                  flex={typeof flex !== 'undefined' ? flex : undefined}
                  items={typeof items !== 'undefined' ? items : undefined}
                  center={typeof center !== 'undefined' ? center : undefined}
                  justify={typeof justify !== 'undefined' ? justify : undefined}
                  text={typeof text !== 'undefined' ? text : undefined}
                  font={typeof font !== 'undefined' ? font : undefined}
                  black={typeof black !== 'undefined' ? black : undefined}
                  repeat={typeof repeat !== 'undefined' ? repeat : undefined}
                  calendarGridDays={typeof calendarGridDays !== 'undefined' ? calendarGridDays : undefined}
                  getMenuCalendarTasksForDay={typeof getMenuCalendarTasksForDay !== 'undefined' ? getMenuCalendarTasksForDay : undefined}
                  getMenuCalendarHolidayLabel={typeof getMenuCalendarHolidayLabel !== 'undefined' ? getMenuCalendarHolidayLabel : undefined}
                  calendarMonthDate={typeof calendarMonthDate !== 'undefined' ? calendarMonthDate : undefined}
                  isSameCalendarDay={typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined}
                  todayStart={typeof todayStart !== 'undefined' ? todayStart : undefined}
                  menu={typeof menu !== 'undefined' ? menu : undefined}
                  calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                  month={typeof month !== 'undefined' ? month : undefined}
                  handleCalendarDayClick={typeof handleCalendarDayClick !== 'undefined' ? handleCalendarDayClick : undefined}
                  data={typeof data !== 'undefined' ? data : undefined}
                  zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                  formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                  relative={typeof relative !== 'undefined' ? relative : undefined}
                  left={typeof left !== 'undefined' ? left : undefined}
                  overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                  hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                  f8fbff={typeof f8fbff !== 'undefined' ? f8fbff : undefined}
                  transition={typeof transition !== 'undefined' ? transition : undefined}
                  all={typeof all !== 'undefined' ? all : undefined}
                  cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                  pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                  fbfcfe={typeof fbfcfe !== 'undefined' ? fbfcfe : undefined}
                  repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                  linear={typeof linear !== 'undefined' ? linear : undefined}
                  gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                  fafafa_0={typeof fafafa_0 !== 'undefined' ? fafafa_0 : undefined}
                  fafafa_6px={typeof fafafa_6px !== 'undefined' ? fafafa_6px : undefined}
                  f6f6f6_6px={typeof f6f6f6_6px !== 'undefined' ? f6f6f6_6px : undefined}
                  f6f6f6_12px={typeof f6f6f6_12px !== 'undefined' ? f6f6f6_12px : undefined}
                  start={typeof start !== 'undefined' ? start : undefined}
                  between={typeof between !== 'undefined' ? between : undefined}
                  w={typeof w !== 'undefined' ? w : undefined}
                  rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                  c5cad3={typeof c5cad3 !== 'undefined' ? c5cad3 : undefined}
                  mt={typeof mt !== 'undefined' ? mt : undefined}
                  leading={typeof leading !== 'undefined' ? leading : undefined}
                  space={typeof space !== 'undefined' ? space : undefined}
                  openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                  full={typeof full !== 'undefined' ? full : undefined}
                  gap={typeof gap !== 'undefined' ? gap : undefined}
                  e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                  l={typeof l !== 'undefined' ? l : undefined}
                  shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                  translate={typeof translate !== 'undefined' ? translate : undefined}
                  getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                  shrink={typeof shrink !== 'undefined' ? shrink : undefined}
                  getPremiumCalendarDotStyle={typeof getPremiumCalendarDotStyle !== 'undefined' ? getPremiumCalendarDotStyle : undefined}
                  current={typeof current !== 'undefined' ? current : undefined}
                  formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                  min={typeof min !== 'undefined' ? min : undefined}
                  truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                />

                                {/* zrc-v523-block-calendarview-hafta */}
                <ZRCAppShellCalendarViewHaftaBlock
                  calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                  Hafta={typeof Hafta !== 'undefined' ? Hafta : undefined}
                  bg={typeof bg !== 'undefined' ? bg : undefined}
                  white={typeof white !== 'undefined' ? white : undefined}
                  grid={typeof grid !== 'undefined' ? grid : undefined}
                  h={typeof h !== 'undefined' ? h : undefined}
                  border={typeof border !== 'undefined' ? border : undefined}
                  b={typeof b !== 'undefined' ? b : undefined}
                  edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                  calendarWeekDays={typeof calendarWeekDays !== 'undefined' ? calendarWeekDays : undefined}
                  week={typeof week !== 'undefined' ? week : undefined}
                  head={typeof head !== 'undefined' ? head : undefined}
                  setCalendarFocusedDate={typeof setCalendarFocusedDate !== 'undefined' ? setCalendarFocusedDate : undefined}
                  text={typeof text !== 'undefined' ? text : undefined}
                  center={typeof center !== 'undefined' ? center : undefined}
                  font={typeof font !== 'undefined' ? font : undefined}
                  black={typeof black !== 'undefined' ? black : undefined}
                  formatCalendarDate={typeof formatCalendarDate !== 'undefined' ? formatCalendarDate : undefined}
                  formatCalendarWeekday={typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined}
                  px={typeof px !== 'undefined' ? px : undefined}
                  flex={typeof flex !== 'undefined' ? flex : undefined}
                  items={typeof items !== 'undefined' ? items : undefined}
                  bold={typeof bold !== 'undefined' ? bold : undefined}
                  getMenuCalendarAllDayTasks={typeof getMenuCalendarAllDayTasks !== 'undefined' ? getMenuCalendarAllDayTasks : undefined}
                  getMenuCalendarHolidayLabel={typeof getMenuCalendarHolidayLabel !== 'undefined' ? getMenuCalendarHolidayLabel : undefined}
                  allday={typeof allday !== 'undefined' ? allday : undefined}
                  data={typeof data !== 'undefined' ? data : undefined}
                  zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                  calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                  formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                  openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                  gap={typeof gap !== 'undefined' ? gap : undefined}
                  overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                  hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                  cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                  pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                  f8fbff={typeof f8fbff !== 'undefined' ? f8fbff : undefined}
                  repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                  linear={typeof linear !== 'undefined' ? linear : undefined}
                  gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                  fafafa_0={typeof fafafa_0 !== 'undefined' ? fafafa_0 : undefined}
                  fafafa_6px={typeof fafafa_6px !== 'undefined' ? fafafa_6px : undefined}
                  f6f6f6_6px={typeof f6f6f6_6px !== 'undefined' ? f6f6f6_6px : undefined}
                  f6f6f6_12px={typeof f6f6f6_12px !== 'undefined' ? f6f6f6_12px : undefined}
                  truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                  openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                  w={typeof w !== 'undefined' ? w : undefined}
                  full={typeof full !== 'undefined' ? full : undefined}
                  rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                  e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                  l={typeof l !== 'undefined' ? l : undefined}
                  left={typeof left !== 'undefined' ? left : undefined}
                  current={typeof current !== 'undefined' ? current : undefined}
                  shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                  getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                  max={typeof max !== 'undefined' ? max : undefined}
                  auto={typeof auto !== 'undefined' ? auto : undefined}
                  custom={typeof custom !== 'undefined' ? custom : undefined}
                  scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
                  menuCalendarHours={typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined}
                  pt={typeof pt !== 'undefined' ? pt : undefined}
                  semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                  getMenuCalendarTasksForHour={typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined}
                  relative={typeof relative !== 'undefined' ? relative : undefined}
                  fff_0={typeof fff_0 !== 'undefined' ? fff_0 : undefined}
                  fff_8px={typeof fff_8px !== 'undefined' ? fff_8px : undefined}
                  fbfbfb_8px={typeof fbfbfb_8px !== 'undefined' ? fbfbfb_8px : undefined}
                  fbfbfb_16px={typeof fbfbfb_16px !== 'undefined' ? fbfbfb_16px : undefined}
                  absolute={typeof absolute !== 'undefined' ? absolute : undefined}
                  right={typeof right !== 'undefined' ? right : undefined}
                  top={typeof top !== 'undefined' ? top : undefined}
                  min={typeof min !== 'undefined' ? min : undefined}
                  py={typeof py !== 'undefined' ? py : undefined}
                  transition={typeof transition !== 'undefined' ? transition : undefined}
                  all={typeof all !== 'undefined' ? all : undefined}
                  formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                />

                {calendarView === 'Gün' && (
                  <div className="bg-white">
                    <div className="h-[36px] grid grid-cols-[54px_1fr] border-b border-[#edf0f4]">
                      <div className="border-r border-[#edf0f4]" />
                      <div className="flex items-center justify-center text-[10px] font-black text-[#9aa3b1]">
                        {formatCalendarWeekday(calendarFocusedDate)}
                      </div>
                    </div>

                    <div className="h-[32px] grid grid-cols-[54px_1fr] border-b border-[#edf0f4]">
                      <div className="px-2 flex items-center text-[10px] font-bold text-[#4b5563] border-r border-[#edf0f4]">
                        Tüm Gün
                      </div>
                      <div className="px-2 flex items-center bg-[repeating-linear-gradient(135deg,#fafafa_0,#fafafa_6px,#f6f6f6_6px,#f6f6f6_12px)]">
                        {getMenuCalendarHolidayLabel(calendarFocusedDate) && (
                          <span className="text-[10px] font-black text-[#374151]">
                            {getMenuCalendarHolidayLabel(calendarFocusedDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[560px] overflow-y-auto custom-scrollbar">
                      {menuCalendarHours.map((hour) => {
                        const hourTasks = getMenuCalendarTasksForHour(calendarFocusedDate, hour);

                        return (
                          <div key={`day-hour-${hour}`} className="grid grid-cols-[54px_1fr] h-[48px] border-b border-[#edf0f4]">
                            <div className="px-2 pt-1.5 text-[10px] font-semibold text-[#4b5563] border-r border-[#edf0f4]">
                              {hour}:00
                            </div>
                            <div className="relative bg-[repeating-linear-gradient(135deg,#fff_0,#fff_8px,#fbfbfb_8px,#fbfbfb_16px)]">
                              {hourTasks.map((task) => (
                                <button
                                  key={`day-task-${task.projectName}-${task.id}`}
                                  type="button"
                                  data-calendar-task-button="true"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openMenuCalendarTask(task);
                                  }}
                                  className="absolute left-1 right-6 top-1 min-h-[32px] rounded-[8px] border border-[#e4e9f1] border-l-[3px] bg-white px-2 py-1 text-left text-[8px] font-black text-current overflow-hidden shadow-[0_8px_18px_rgba(15,23,42,0.055)] hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition-all"
                                  style={getPremiumCalendarTaskStyle(task)}
                                >
                                  <div className="opacity-80">{formatMenuCalendarTaskTime(task)}</div>
                                  <div className="truncate">{task.title}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {calendarView === 'Liste' && (
                  <div className="bg-white min-h-[560px]">
                    {menuCalendarListGroups.length > 0 ? (
                      menuCalendarListGroups.map((group) => (
                        <div key={`list-group-${group.day.toISOString()}`}>
                          <div className="h-[30px] px-3.5 bg-[#f1f3f6] border-b border-[#d6dce5] flex items-center justify-between">
                            <div className="text-[10.5px] font-black text-[#374151] capitalize">
                              {new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(group.day)}
                            </div>
                            <div className="text-[10px] font-black text-[#374151]">
                              {formatMenuCalendarWeekHeader(group.day)}
                            </div>
                          </div>

                          {group.tasks.map((task) => (
                            <button
                              key={`list-task-${group.day.toISOString()}-${task.projectName}-${task.id}`}
                              type="button"
                              onClick={() => openMenuCalendarTask(task)}
                              className="w-full min-h-[38px] grid grid-cols-[64px_1fr] items-center bg-white border-b border-[#edf0f4] border-l-[3px] text-left hover:bg-[#f8fafc] transition-all"
                            >
                              <div className="px-3 text-[10px] font-black text-slate-600">
                                {formatMenuCalendarTaskTime(task) || ' '}
                              </div>
                              <div className="min-w-0 text-[10px] font-black text-current truncate">
                                <span className="inline-block w-2 h-2 rounded-full mr-2 shadow-[0_0_0_2px_rgba(15,23,42,0.04)]" style={getPremiumCalendarDotStyle(task)} />
                                {task.title}
                              </div>
                            </button>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="h-[240px] flex items-center justify-center text-[11px] font-bold text-[#9aa3b1]">
                        Bu aralıkta planlı görev yok.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeContentMenu === 'Yazışmalar' ? (
          <div className="w-full h-full bg-[#f2f3f5] overflow-hidden animate-fade-in">
            <div className="h-full px-4 pt-3 pb-6">
              <div className="h-full bg-white border border-[#e4e7ec] rounded-[7px] shadow-[0_10px_30px_rgba(15,23,42,0.06)] overflow-hidden flex">
                <aside className="w-[255px] border-r border-[#e8ebf0] bg-white flex flex-col">
                  <div className="h-[52px] px-4 flex items-center justify-between shrink-0">
                    <div className="text-[15px] font-bold text-current">Mesajlar</div>

                    <div className="relative flex items-center gap-1.5">
                      <button
                        type="button"
                        className="w-7 h-7 rounded-[5px] text-[#b3bbc7] hover:bg-[#f5f7fa] hover:text-[#687386] transition-all flex items-center justify-center"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      </button>

                      {canCreateChatGroups && (
                        <>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setIsChatActionMenuOpen((prev) => !prev);
                            }}
                            className="w-7 h-7 rounded-[5px] text-[#b3bbc7] hover:bg-[#f5f7fa] hover:text-[#687386] transition-all flex items-center justify-center"
                          >
                            ⋮
                          </button>

                          {isChatActionMenuOpen && (
                            <div
                              onClick={(event) => event.stopPropagation()}
                              className="absolute right-0 top-[30px] z-[620] w-[170px] bg-white border border-[#dfe3ea] rounded-[4px] shadow-[0_14px_34px_rgba(15,23,42,0.16)] overflow-hidden py-1"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setIsChatGroupModalOpen(true);
                                  setIsChatActionMenuOpen(false);
                                }}
                                className="w-full h-8 px-3 text-left text-[11px] font-bold text-[#394150] hover:bg-[#f6f8fb] flex items-center gap-2"
                              >
                                <span className="text-[#6f7a89]">⊞</span>
                                Yeni Yazışma Grubu
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pb-2">
                    <input
                      value={chatGroupSearch}
                      onChange={(event) => setChatGroupSearch(event.target.value)}
                      placeholder="Yazışma ara..."
                      className="w-full h-8 rounded-[4px] border border-[#e4e7ec] bg-[#fafbfc] px-2.5 text-[10px] font-semibold text-[#45505f] placeholder:text-[#b4bbc7] focus:outline-none focus:border-[#b7d4ff] focus:bg-white"
                    />
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                    {filteredChatGroups.map((group) => {
                      const isSelected = selectedChatGroupId === group.id;
                      const groupMessages = projectMessages
                        .filter((message) => message.chatGroupId === group.id)
                        .filter(isProjectMessageVisibleForCurrentUser);
                      const lastMessage = groupMessages[groupMessages.length - 1];

                      return (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => setSelectedChatGroupId(group.id)}
                          className={`w-full h-[58px] px-4 flex items-center gap-3 text-left border-b border-[#f0f2f5] transition-all ${
                            isSelected ? 'bg-[#f2f7ff]' : 'bg-white hover:bg-[#fafbfc]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#a9ddf4] border border-[#6fbce2] flex items-center justify-center shrink-0 overflow-hidden">
                            <div className="relative w-full h-full">
                              <span className="absolute left-[7px] top-[7px] w-3 h-3 rounded-full bg-[#2e8fc5]" />
                              <span className="absolute right-[6px] top-[8px] w-3 h-3 rounded-full bg-[#51b2dc]" />
                              <span className="absolute left-[5px] bottom-[5px] w-[22px] h-[12px] rounded-t-full bg-[#2e8fc5]/80" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-[11.5px] font-bold text-[#2f3847] truncate">{group.name}</div>
                            <div className="mt-0.5 text-[9px] font-semibold text-[#9aa3b1] truncate">
                              {lastMessage ? lastMessage.text : group.type === 'project' ? 'Proje yazışma grubu' : 'Özel yazışma grubu'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {canCreateChatGroups && (
                    <div className="p-4 border-t border-[#edf0f4] shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsChatGroupModalOpen(true)}
                        className="w-full h-8 rounded-[5px] bg-[#4aa5e8] text-white text-[10px] font-black hover:bg-[#3c98dc] transition-all flex items-center justify-center gap-2"
                      >
                        Yeni Yazışma Grubu
                        <span className="text-[14px] leading-none">+</span>
                      </button>
                    </div>
                  )}
                </aside>

                <section className="flex-1 min-w-0 bg-white flex flex-col">
                  {selectedChatGroup ? (
                    <>
                      <div className="h-[54px] px-5 border-b border-[#edf0f4] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#a9ddf4] border border-[#6fbce2] flex items-center justify-center text-[9px] font-black text-[#1f6c96]">
                            {selectedChatGroup.avatar || createAvatarFromName(selectedChatGroup.name)}
                          </div>

                          <div>
                            <div className="text-[14px] font-black text-current">{selectedChatGroup.name}</div>
                            <div className="mt-0.5 text-[9.5px] font-bold text-[#9aa3b1]">
                              {(selectedChatGroup.members || []).length} üye
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedChatGroupId('')}
                          className="h-7 px-3 rounded-[4px] bg-[#f4f6f8] text-[9px] font-black text-[#7d8795] hover:text-[#394150]"
                        >
                          Kapat
                        </button>
                      </div>

                      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-[#fbfcfe] p-5">
                        {selectedChatMessages.length > 0 ? (
                          <div className="space-y-3">
                            {selectedChatMessages.map((message) => {
                              const isMe = isCurrentProfileRecord(message);

                              return (
                                <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[520px] rounded-[8px] px-3 py-2 shadow-sm ${
                                    isMe ? 'bg-[#4aa5e8] text-white' : 'bg-white border border-[#e4e7ec] text-[#394150]'
                                  }`}>
                                    <div className={`text-[9px] font-black mb-1 ${isMe ? 'text-white/75' : 'text-[#9aa3b1]'}`}>
                                      {message.sender || 'Ekip'} · {getProjectMessageDateLabel(message.createdAt)}
                                    </div>
                                    <div className="text-[11px] font-semibold leading-5">{message.text}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-full min-h-[360px] flex items-center justify-center">
                            <div className="text-center max-w-[420px]">
                              <div className="mx-auto w-[160px] h-[110px] relative mb-5">
                                <div className="absolute left-8 top-2 w-[100px] h-[58px] border-[3px] border-[#d8edff] bg-[#f8fcff]" />
                                <div className="absolute left-[58px] top-[48px] w-[62px] h-[48px] rounded-t-[28px] bg-[#5f91f3]" />
                                <div className="absolute left-[70px] top-[38px] w-[28px] h-[28px] rounded-full bg-[#263244]" />
                                <div className="absolute left-[40px] top-[10px] w-[28px] h-[28px] bg-[#4d82ff] rotate-[-20deg]" />
                                <div className="absolute right-[28px] top-[18px] w-[48px] h-[26px] rounded-[5px] bg-[#4d82ff]" />
                                <div className="absolute left-[48px] bottom-0 w-[86px] h-[2px] bg-[#b8d9ff]" />
                              </div>

                              <div className="text-[18px] font-black text-current">Yazışmalar</div>
                              <p className="mt-2 text-[11px] font-semibold leading-5 text-[#3f4858]">
                                {canSendSelectedChatMessage
                                  ? 'Bu yazışma grubunda henüz mesaj yok. İlk mesajı yazarak konuşmayı başlat.'
                                  : 'Bu yazışma grubunda henüz mesaj yok.'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {canSendSelectedChatMessage && (
                        <form onSubmit={handleSendChatPageMessage} className="h-[62px] px-4 border-t border-[#edf0f4] bg-white flex items-center gap-2 shrink-0">
                          <input
                            value={chatPageDraft}
                            onChange={(event) => setChatPageDraft(event.target.value)}
                            placeholder="Mesaj yaz..."
                            className="flex-1 h-10 rounded-[6px] border border-[#e4e7ec] bg-[#fafbfc] px-3 text-[11px] font-semibold text-[#394150] placeholder:text-[#b4bbc7] focus:outline-none focus:border-[#b7d4ff] focus:bg-white"
                          />

                          <button
                            type="submit"
                            disabled={!chatPageDraft.trim()}
                            className={`h-10 px-4 rounded-[6px] text-white text-[10px] font-black transition-all ${
                              chatPageDraft.trim()
                                ? 'bg-[#4aa5e8] hover:bg-[#3c98dc]'
                                : 'bg-zinc-300 cursor-not-allowed'
                            }`}
                          >
                            Gönder
                          </button>
                        </form>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 min-h-0 flex items-center justify-center">
                      <div className="text-center max-w-[560px] px-6">
                        <div className="mx-auto w-[260px] h-[155px] relative mb-7">
                          <div className="absolute left-[56px] top-0 w-[136px] h-[78px] border-[4px] border-[#d8edff] bg-[#f9fdff]" />
                          <div className="absolute left-[94px] top-[62px] w-[76px] h-[62px] rounded-t-[34px] bg-[#5f91f3]" />
                          <div className="absolute left-[110px] top-[48px] w-[32px] h-[32px] rounded-full bg-[#263244]" />
                          <div className="absolute left-[70px] top-[14px] w-[40px] h-[40px] bg-[#4d82ff] rotate-[-20deg]" />
                          <div className="absolute right-[58px] top-[26px] w-[66px] h-[34px] rounded-[5px] bg-[#4d82ff]" />
                          <div className="absolute left-[72px] bottom-0 w-[140px] h-[2px] bg-[#b8d9ff]" />
                        </div>

                        <div className="text-[18px] font-black text-current">Yazışmalar</div>
                        <p className="mt-2 text-[11px] font-semibold leading-5 text-[#3f4858]">
                          Yazışmalarınızı görüntülemek ve yazışmaya başlamak için soldaki yazışma listesinden bir yazışmayı seçin.
                        </p>

                        <div className="mt-8 text-[18px] font-black text-current">Yazışma Grupları</div>
                        <p className="mt-2 text-[11px] font-semibold leading-5 text-[#3f4858]">
                          {canCreateChatGroups
                            ? 'Soldaki liste mevcut projelerinizden otomatik oluşur. Ayrıca özel yazışma grubu da oluşturabilirsiniz.'
                            : 'Soldaki listede sadece erişiminiz olan proje yazışmaları görünür.'}
                        </p>

                        {canCreateChatGroups && (
                          <button
                            type="button"
                            onClick={() => setIsChatGroupModalOpen(true)}
                            className="mt-5 h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all inline-flex items-center gap-2"
                          >
                            Yazışma Grubu Oluştur
                            <span className="text-[13px] leading-none">+</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>

            {isChatGroupModalOpen && canCreateChatGroups && (
              <div className="fixed inset-0 z-[760] bg-zinc-950/45 flex items-start justify-center pt-[115px]" onClick={() => setIsChatGroupModalOpen(false)}>
                <form
                  onSubmit={createChatGroupFromPage}
                  onClick={(event) => event.stopPropagation()}
                  className="w-[390px] bg-white rounded-[15px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-hidden"
                >
                  <div className="h-12 px-5 flex items-center justify-center relative">
                    <div className="text-[12px] font-black text-current flex items-center gap-1.5">
                      <span className="text-[#7d8795]">⌕</span>
                      Yazışma Grubu
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsChatGroupModalOpen(false)}
                      className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#eef0f4] text-[#778293] hover:bg-white hover:text-current transition-all shadow-sm"
                    >
                      ×
                    </button>
                  </div>

                  <div className="px-5 pb-5">
                    <label className="block text-[10px] font-black text-[#677282] mb-1.5">Grup Adı</label>
                    <input
                      value={chatGroupDraft}
                      onChange={(event) => setChatGroupDraft(event.target.value)}
                      placeholder="Grup adını girin..."
                      autoFocus
                      className="w-full h-8 rounded-[8px] border border-[#8bbcff] px-3 text-[10px] font-semibold text-[#394150] placeholder:text-[#aab3c0] focus:outline-none focus:ring-2 focus:ring-[#dcebff]"
                    />

                    <div className="mt-4 text-[10px] font-black text-[#677282] mb-1.5">Grup Üyeleri</div>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full bg-[#45b978] text-white text-[18px] leading-none font-bold hover:bg-[#38a86b] transition-all flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <div className="h-[50px] px-5 bg-[#f8f9fb] border-t border-[#edf0f4] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsChatGroupModalOpen(false)}
                      className="h-8 px-4 rounded-full bg-[#eef0f4] text-[10px] font-black text-[#667085] hover:bg-[#e3e7ee] transition-all flex items-center gap-3"
                    >
                      Kapat
                      <span>×</span>
                    </button>

                    <button
                      type="submit"
                      className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all flex items-center gap-3"
                    >
                      Kaydet
                      <span>▣</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : activeContentMenu === 'Profil' ? (
          <div className="zrc-profile-page-safe-v326 zrc-profile-page-safe-v328 w-full h-full min-h-0 bg-[#f2f3f5] overflow-y-auto custom-scrollbar animate-fade-in">
            <div className="zrc-profile-shell-safe-v326 zrc-profile-shell-safe-v328 max-w-[1240px] mx-auto px-5 py-4 pb-20 space-y-4 min-w-[980px]">
              <div className="zrc-profile-header-card-safe-v328 bg-white border border-[#e5e8ee] rounded-[8px] shadow-[0_8px_24px_rgba(15,23,42,0.06)] px-5 py-4">
                <div className="grid grid-cols-[300px_1fr] gap-7 items-center">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => profileAvatarInputRef.current?.click()}
                        className="group relative w-[118px] h-[118px] rounded-[12px] border-[3px] border-[#7c4dff] bg-[#4a3920] shadow-sm flex items-center justify-center overflow-hidden"
                      >
                        {profileDraft.avatarDataUrl ? (
                          <img
                            src={profileDraft.avatarDataUrl}
                            alt="Profil"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="relative w-[86px] h-[74px]">
                            <div className="absolute inset-x-1 top-2 h-[54px] rounded-[50%] bg-[#b7a482]" />
                            <div className="absolute left-6 top-10 w-3 h-3 rounded-full bg-[#263244]" />
                            <div className="absolute right-6 top-10 w-3 h-3 rounded-full bg-[#263244]" />
                            <div className="absolute left-9 top-[53px] w-5 h-2 rounded-b-full border-b-2 border-[#263244]" />
                            <div className="absolute left-1 top-0 w-11 h-9 rounded-full bg-[#8b7a5c] rotate-[-18deg]" />
                            <div className="absolute right-1 top-0 w-11 h-9 rounded-full bg-[#8b7a5c] rotate-[18deg]" />
                          </div>
                        )}

                        <span className="absolute inset-x-0 bottom-0 h-8 bg-zinc-950/55 text-white text-[9px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Resmi Değiştir
                        </span>
                      </button>

                      <input
                        ref={profileAvatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileAvatarChange}
                        className="hidden"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-[13px] font-black text-current">Profil Detayları</div>
                      <div className="mt-1 text-[11px] font-bold text-[#7c8798] truncate">
                        {profileDraft.firstName} {profileDraft.lastName}
                      </div>
                      <div className="mt-2 text-[10px] font-bold text-[#9aa3b1]">
                        {profileDraft.email}
                      </div>
                      {profilePreferences.lastSavedAt && (
                        <div className="mt-2 text-[10px] font-black text-[#45b978]">Kaydedildi</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                    <label className="block">
                      <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">Ad</span>
                      <input
                        value={profileDraft.firstName}
                        onChange={(event) => setProfileDraft((prev) => ({ ...prev, firstName: event.target.value }))}
                        className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">Soyad</span>
                      <input
                        value={profileDraft.lastName}
                        onChange={(event) => setProfileDraft((prev) => ({ ...prev, lastName: event.target.value }))}
                        className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                      />
                    </label>

                    {renderProfileSelect({
                      id: 'profile-language',
                      label: 'Dil',
                      value: profileDraft.language,
                      options: ['Türkçe', 'English'],
                      onChange: (value) => setProfileDraft((prev) => ({ ...prev, language: value }))
                    })}

                    {renderProfileSelect({
                      id: 'profile-status',
                      label: 'Durum',
                      value: profileDraft.status,
                      options: ['Hiçbiri', 'Müsait', 'Meşgul', 'Rahatsız Etmeyin'],
                      onChange: (value) => setProfileDraft((prev) => ({ ...prev, status: value }))
                    })}

                    <label className="block col-span-3">
                      <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">İş Ünvanı</span>
                      <input
                        value={profileDraft.title}
                        onChange={(event) => setProfileDraft((prev) => ({ ...prev, title: event.target.value }))}
                        className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                      />
                    </label>

                    <div className="flex items-end justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="h-8 px-4 rounded-full bg-white border border-zinc-200 text-zinc-500 text-[10px] font-black hover:text-[#ff3600] hover:border-[#ff3600] transition-all"
                      >
                        Kullanıcı Değiştir
                      </button>

                      <button
                        type="button"
                        onClick={saveProfileSection}
                        className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all flex items-center gap-2"
                      >
                        Güncelle
                        <span>▣</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="zrc-profile-tab-card-safe-v328 bg-white border border-[#e5e8ee] rounded-[8px] shadow-[0_8px_24px_rgba(15,23,42,0.06)] overflow-hidden">
                <div className="h-[46px] px-5 border-b border-[#e5e8ee] flex items-end">
                  <div className="flex items-end gap-6 overflow-x-auto custom-scrollbar">
                    {visibleProfileTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveProfileTab(tab)}
                        className={`relative h-[46px] px-1 text-[11.5px] font-bold transition-all whitespace-nowrap ${
                          activeProfileTab === tab ? 'text-[#8e69e8]' : 'text-[#7c8798] hover:text-[#394150]'
                        }`}
                      >
                        {tab}
                        {activeProfileTab === tab && (
                          <span className="absolute left-0 right-0 -bottom-px h-[4px] rounded-t-full bg-[#a98bf4]" />
                        )}
                      </button>
                    ))}
                  </div>

                </div>

                <div className="zrc-profile-tab-content-safe-v328 p-5">
                                    {/* zrc-v523-block-activeprofiletab-hesap */}
                  <ZRCAppShellActiveProfileTabHesapBlock
                    activeProfileTab={typeof activeProfileTab !== 'undefined' ? activeProfileTab : undefined}
                    Hesap={typeof Hesap !== 'undefined' ? Hesap : undefined}
                    space={typeof space !== 'undefined' ? space : undefined}
                    text={typeof text !== 'undefined' ? text : undefined}
                    font={typeof font !== 'undefined' ? font : undefined}
                    black={typeof black !== 'undefined' ? black : undefined}
                    current={typeof current !== 'undefined' ? current : undefined}
                    mb={typeof mb !== 'undefined' ? mb : undefined}
                    E={typeof E !== 'undefined' ? E : undefined}
                    Posta={typeof Posta !== 'undefined' ? Posta : undefined}
                    Bilgilerini={typeof Bilgilerini !== 'undefined' ? Bilgilerini : undefined}
                    grid={typeof grid !== 'undefined' ? grid : undefined}
                    gap={typeof gap !== 'undefined' ? gap : undefined}
                    block={typeof block !== 'undefined' ? block : undefined}
                    a1aabb={typeof a1aabb !== 'undefined' ? a1aabb : undefined}
                    posta={typeof posta !== 'undefined' ? posta : undefined}
                    profileDraft={typeof profileDraft !== 'undefined' ? profileDraft : undefined}
                    setProfileDraft={typeof setProfileDraft !== 'undefined' ? setProfileDraft : undefined}
                    w={typeof w !== 'undefined' ? w : undefined}
                    full={typeof full !== 'undefined' ? full : undefined}
                    h={typeof h !== 'undefined' ? h : undefined}
                    rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                    border={typeof border !== 'undefined' ? border : undefined}
                    e4e7ec={typeof e4e7ec !== 'undefined' ? e4e7ec : undefined}
                    px={typeof px !== 'undefined' ? px : undefined}
                    semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                    outline={typeof outline !== 'undefined' ? outline : undefined}
                    none={typeof none !== 'undefined' ? none : undefined}
                    b7d4ff={typeof b7d4ff !== 'undefined' ? b7d4ff : undefined}
                    password={typeof password !== 'undefined' ? password : undefined}
                    mt={typeof mt !== 'undefined' ? mt : undefined}
                    bold={typeof bold !== 'undefined' ? bold : undefined}
                    adresini={typeof adresini !== 'undefined' ? adresini : undefined}
                    girmelisiniz={typeof girmelisiniz !== 'undefined' ? girmelisiniz : undefined}
                    flex={typeof flex !== 'undefined' ? flex : undefined}
                    justify={typeof justify !== 'undefined' ? justify : undefined}
                    end={typeof end !== 'undefined' ? end : undefined}
                    saveProfileSection={typeof saveProfileSection !== 'undefined' ? saveProfileSection : undefined}
                    bg={typeof bg !== 'undefined' ? bg : undefined}
                    white={typeof white !== 'undefined' ? white : undefined}
                    transition={typeof transition !== 'undefined' ? transition : undefined}
                    all={typeof all !== 'undefined' ? all : undefined}
                    t={typeof t !== 'undefined' ? t : undefined}
                    edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                    pt={typeof pt !== 'undefined' ? pt : undefined}
                    currentPassword={typeof currentPassword !== 'undefined' ? currentPassword : undefined}
                    newPassword={typeof newPassword !== 'undefined' ? newPassword : undefined}
                    Yeni={typeof Yeni !== 'undefined' ? Yeni : undefined}
                    repeatPassword={typeof repeatPassword !== 'undefined' ? repeatPassword : undefined}
                    tekrar={typeof tekrar !== 'undefined' ? tekrar : undefined}
                    keyName={typeof keyName !== 'undefined' ? keyName : undefined}
                    renderProfileSelect={typeof renderProfileSelect !== 'undefined' ? renderProfileSelect : undefined}
                    profile={typeof profile !== 'undefined' ? profile : undefined}
                    date={typeof date !== 'undefined' ? date : undefined}
                    format={typeof format !== 'undefined' ? format : undefined}
                    Tarih={typeof Tarih !== 'undefined' ? Tarih : undefined}
                    DD={typeof DD !== 'undefined' ? DD : undefined}
                    MM={typeof MM !== 'undefined' ? MM : undefined}
                    YYYY={typeof YYYY !== 'undefined' ? YYYY : undefined}
                    time={typeof time !== 'undefined' ? time : undefined}
                    Zaman={typeof Zaman !== 'undefined' ? Zaman : undefined}
                    Saat={typeof Saat !== 'undefined' ? Saat : undefined}
                    AM={typeof AM !== 'undefined' ? AM : undefined}
                    timezone={typeof timezone !== 'undefined' ? timezone : undefined}
                    Dilimi={typeof Dilimi !== 'undefined' ? Dilimi : undefined}
                    UTC={typeof UTC !== 'undefined' ? UTC : undefined}
                    items={typeof items !== 'undefined' ? items : undefined}
                    center={typeof center !== 'undefined' ? center : undefined}
                    haneli={typeof haneli !== 'undefined' ? haneli : undefined}
                    kod={typeof kod !== 'undefined' ? kod : undefined}
                    isteyerek={typeof isteyerek !== 'undefined' ? isteyerek : undefined}
                    hesap={typeof hesap !== 'undefined' ? hesap : undefined}
                    e5e7eb={typeof e5e7eb !== 'undefined' ? e5e7eb : undefined}
                    setProfilePreferences={typeof setProfilePreferences !== 'undefined' ? setProfilePreferences : undefined}
                    profilePreferences={typeof profilePreferences !== 'undefined' ? profilePreferences : undefined}
                    red={typeof red !== 'undefined' ? red : undefined}
                    Sil={typeof Sil !== 'undefined' ? Sil : undefined}
                    silme={typeof silme !== 'undefined' ? silme : undefined}
                    geri={typeof geri !== 'undefined' ? geri : undefined}
                    setPendingProfileDelete={typeof setPendingProfileDelete !== 'undefined' ? setPendingProfileDelete : undefined}
                    pendingProfileDelete={typeof pendingProfileDelete !== 'undefined' ? pendingProfileDelete : undefined}
                    Emin={typeof Emin !== 'undefined' ? Emin : undefined}
                    misin={typeof misin !== 'undefined' ? misin : undefined}
                  />

                  {activeProfileTab === 'E-Posta Bildirimi' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[14px] font-black text-current">E-Posta Bildirimi</div>
                        <button
                          type="button"
                          onClick={() =>
                            setProfilePreferences((prev) => ({
                              ...prev,
                              emailInstant: false,
                              emailChat: false,
                              emailActivity: false,
                              emailLeave: false,
                              emailReminder: false,
                              emailImportant: false,
                              lastSavedAt: new Date().toISOString()
                            }))
                          }
                          className="h-8 px-4 rounded-full bg-red-600 text-white text-[10px] font-black"
                        >
                          E-posta Bildirimlerini Kapat
                        </button>
                      </div>

                      <div className="h-10 px-3 rounded-[4px] border border-blue-200 bg-blue-50 flex items-center text-[10.5px] font-semibold text-[#475467]">
                        ⓘ Uygulama açık değilse bildirimler e-posta ile gönderilir.
                      </div>

                      <div className="mt-4 divide-y divide-[#edf0f4]">
                        {[
                          ['emailInstant', 'E-posta Bildirimlerini Anlık Olarak Gönder'],
                          ['emailChat', 'Yazışma Bildirimlerini Gönder'],
                          ['emailActivity', 'Aktivite Bildirimlerini Gönder'],
                          ['emailLeave', 'İzin Talebi Bildirimlerini Gönder'],
                          ['emailReminder', 'Son Tarihi Yaklaşan İşler için Hatırlatma Gönder'],
                          ['emailImportant', 'Yönettiğim Projelerdeki Önemli Bildirimleri Gönder']
                        ].map(([keyName, label]) => (
                          <button
                            key={keyName}
                            type="button"
                            onClick={() => toggleProfilePreference(keyName)}
                            className="w-full h-10 flex items-center gap-2 text-left"
                          >
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                              profilePreferences[keyName] ? 'bg-[#45b978] border-[#45b978] text-white' : 'bg-white border-[#cbd2dc] text-transparent'
                            }`}>
                              ✓
                            </span>
                            <span className="text-[10.5px] font-bold text-[#394150]">{label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button type="button" onClick={saveProfileSection} className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black">
                          Ayarları kaydet
                        </button>
                      </div>
                    </div>
                  )}

                  {activeProfileTab === 'Tarayıcı Bildirimi' && (
                    <div>
                      <div className="text-[14px] font-black text-current mb-2">Web Tarayıcısı Bildirimleri</div>
                      <div className="text-[10.5px] font-semibold text-[#7c8798] mb-4">
                        Aktivite ve chat bildirimlerini bilgisayar ekranınızın köşesinde görebilirsiniz.
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleProfilePreference('browserEnabled')}
                        className={`w-full h-10 px-3 rounded-[4px] border flex items-center text-[10.5px] font-semibold ${
                          profilePreferences.browserEnabled
                            ? 'border-emerald-200 bg-emerald-50 text-[#28664b]'
                            : 'border-blue-200 bg-blue-50 text-[#475467]'
                        }`}
                      >
                        {profilePreferences.browserEnabled ? '✓ Web tarayıcısı bildirimleri aktif.' : '○ Web tarayıcısı bildirimleri kapalı.'}
                      </button>

                      <div className="mt-5 grid grid-cols-[1fr_200px] gap-4 items-center border-t border-[#edf0f4] pt-5">
                        <div>
                          <div className="text-[12px] font-black text-current">Rahatsız Etme Modu</div>
                          <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">
                            Aktifken bildirim sesi kapatılır.
                          </div>
                        </div>

                        {renderProfileSelect({
                          id: 'profile-do-not-disturb',
                          label: 'Mod',
                          value: profilePreferences.doNotDisturb,
                          options: ['Kapalı', 'Açık', 'Hafta içi 18:00 sonrası'],
                          wrapperClassName: 'w-[200px]',
                          onChange: (value) =>
                            setProfilePreferences((prev) => ({
                              ...prev,
                              doNotDisturb: value,
                              lastSavedAt: new Date().toISOString()
                            }))
                        })}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button type="button" onClick={saveProfileSection} className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black">
                          Güncelle
                        </button>
                      </div>
                    </div>
                  )}

                  {activeProfileTab === 'E-Posta Kutusu' && (
                    <div>
                      <div className="text-[14px] font-black text-current mb-2">E-posta Hesapları</div>
                      <div className="text-[10.5px] font-semibold text-[#7c8798] mb-4">
                        E-posta hesabı ekleyerek toplantı ve takvim kayıtlarını takip edebilirsiniz.
                      </div>

                      <form onSubmit={addProfileEmailAccount} className="h-10 flex items-center gap-2">
                        <input
                          value={emailAccountDraft}
                          onChange={(event) => setEmailAccountDraft(event.target.value)}
                          placeholder="ornek@firma.com"
                          className="flex-1 h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                        />
                        <button type="submit" className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black">
                          E-posta Hesabı Ekle +
                        </button>
                      </form>

                      <div className="mt-5">
                        {profilePreferences.emailAccounts.length > 0 ? (
                          <div className="border border-[#edf0f4] rounded-[6px] overflow-hidden">
                            {profilePreferences.emailAccounts.map((account) => (
                              <div key={account.id} className="h-12 px-3 border-b last:border-b-0 border-[#edf0f4] flex items-center justify-between">
                                <div>
                                  <div className="text-[11px] font-black text-[#394150]">{account.email}</div>
                                  <div className="text-[9px] font-bold text-[#45b978]">{account.status}</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeProfileEmailAccount(account.id)}
                                  className="h-8 px-3 rounded-full border border-red-200 text-red-500 text-[9.5px] font-black hover:bg-red-50"
                                >
                                  Kaldır
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-[210px] flex flex-col items-center justify-center text-center">
                            <div className="w-[108px] h-[74px] rounded-[6px] bg-[#f4f7fb] border border-[#edf0f4] flex items-center justify-center text-[36px]">
                              ✉
                            </div>
                            <div className="mt-4 text-[10.5px] font-semibold text-[#475467]">
                              Henüz hiçbir e-posta hesabınız bağlanmadı.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeProfileTab === 'Özelleştirmeler' && (
                    <div>
                      <div className="text-[14px] font-black text-current mb-5">Özelleştirmeler</div>

                      <div className="flex items-center justify-between border-b border-[#edf0f4] pb-5">
                        <div>
                          <div className="text-[12px] font-black text-current">Uygulama Teması</div>
                          <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">Tema tercihini kaydeder.</div>
                        </div>

                        <div className="h-9 rounded-full bg-[#e5e7eb] p-0.5 flex">
                          {['Açık Mod', 'Koyu Mod', 'Sistem Varsayılanı'].map((theme) => (
                            <button
                              key={theme}
                              type="button"
                              onClick={() => {
                                const nextProfileDraft = { ...profileDraft, theme };
                                setProfileDraft((prev) => ({ ...prev, theme }));
                                saveProfileSection({ profileDraft: nextProfileDraft });
                              }}
                              className={`h-8 px-4 rounded-full text-[10px] font-black ${profileDraft.theme === theme ? 'bg-[#45b978] text-white' : 'text-[#6b7280]'}`}
                            >
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-5">
                        <div className="text-[12px] font-black text-current">Navigasyon Rengi</div>
                        <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">
                          Bu seçim şimdilik profil tercihi olarak kaydedilir; sistem rengini değiştirmez.
                        </div>

                        <div className="mt-4 grid grid-cols-5 gap-3">
                          {[
                            ['Gece Siyahı', '#1f2937'],
                            ['Kadife Üzüm', '#6d2556'],
                            ['Kızıl Tuğla', '#7c2d2d'],
                            ['Yakut Alevi', '#be123c'],
                            ['Orman Yosunu', '#486b55'],
                            ['Cubicl Mavisi', '#2f66cf'],
                            ['Çelik Mavi', '#536b7b'],
                            ['Derin Deniz', '#27706c'],
                            ['Kehribar Işığı', '#c26b23'],
                            ['Kurşun Gri', '#4b5563']
                          ].map(([name, color]) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => {
                                const nextProfileDraft = { ...profileDraft, color: name };
                                setProfileDraft((prev) => ({ ...prev, color: name }));
                                saveProfileSection({ profileDraft: nextProfileDraft });
                              }}
                              className={`h-8 rounded-full border px-3 flex items-center gap-2 text-[10px] font-bold ${
                                profileDraft.color === name ? 'border-[#2f66cf] text-[#2f66cf]' : 'border-[#d7dce5] text-[#394150]'
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                                    {/* zrc-v523-block-activeprofiletab-veri-yonetimi */}
                  <ZRCAppShellActiveProfileTabVeriYonetimiBlock
                    currentAccountType={typeof currentAccountType !== 'undefined' ? currentAccountType : undefined}
                    activeProfileTab={typeof activeProfileTab !== 'undefined' ? activeProfileTab : undefined}
                    Veri={typeof Veri !== 'undefined' ? Veri : undefined}
                    flex={typeof flex !== 'undefined' ? flex : undefined}
                    items={typeof items !== 'undefined' ? items : undefined}
                    start={typeof start !== 'undefined' ? start : undefined}
                    justify={typeof justify !== 'undefined' ? justify : undefined}
                    between={typeof between !== 'undefined' ? between : undefined}
                    gap={typeof gap !== 'undefined' ? gap : undefined}
                    mb={typeof mb !== 'undefined' ? mb : undefined}
                    text={typeof text !== 'undefined' ? text : undefined}
                    font={typeof font !== 'undefined' ? font : undefined}
                    black={typeof black !== 'undefined' ? black : undefined}
                    current={typeof current !== 'undefined' ? current : undefined}
                    mt={typeof mt !== 'undefined' ? mt : undefined}
                    semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                    leading={typeof leading !== 'undefined' ? leading : undefined}
                    Proje={typeof Proje !== 'undefined' ? Proje : undefined}
                    ekip={typeof ekip !== 'undefined' ? ekip : undefined}
                    ve={typeof ve !== 'undefined' ? ve : undefined}
                    bildirim={typeof bildirim !== 'undefined' ? bildirim : undefined}
                    verilerini={typeof verilerini !== 'undefined' ? verilerini : undefined}
                    yedekle={typeof yedekle !== 'undefined' ? yedekle : undefined}
                    veya={typeof veya !== 'undefined' ? veya : undefined}
                    geri={typeof geri !== 'undefined' ? geri : undefined}
                    h={typeof h !== 'undefined' ? h : undefined}
                    px={typeof px !== 'undefined' ? px : undefined}
                    rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                    full={typeof full !== 'undefined' ? full : undefined}
                    bg={typeof bg !== 'undefined' ? bg : undefined}
                    f6f7fb={typeof f6f7fb !== 'undefined' ? f6f7fb : undefined}
                    border={typeof border !== 'undefined' ? border : undefined}
                    e5e8ee={typeof e5e8ee !== 'undefined' ? e5e8ee : undefined}
                    center={typeof center !== 'undefined' ? center : undefined}
                    shrink={typeof shrink !== 'undefined' ? shrink : undefined}
                    v={typeof v !== 'undefined' ? v : undefined}
                    APP_DATA_VERSION={typeof APP_DATA_VERSION !== 'undefined' ? APP_DATA_VERSION : undefined}
                    grid={typeof grid !== 'undefined' ? grid : undefined}
                    dataManagementStats={typeof dataManagementStats !== 'undefined' ? dataManagementStats : undefined}
                    data={typeof data !== 'undefined' ? data : undefined}
                    management={typeof management !== 'undefined' ? management : undefined}
                    edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                    fafbfc={typeof fafbfc !== 'undefined' ? fafbfc : undefined}
                    py={typeof py !== 'undefined' ? py : undefined}
                    uppercase={typeof uppercase !== 'undefined' ? uppercase : undefined}
                    tracking={typeof tracking !== 'undefined' ? tracking : undefined}
                    Supabase={typeof Supabase !== 'undefined' ? Supabase : undefined}
                    Kontrol={typeof Kontrol !== 'undefined' ? Kontrol : undefined}
                    Merkezi={typeof Merkezi !== 'undefined' ? Merkezi : undefined}
                    Storage={typeof Storage !== 'undefined' ? Storage : undefined}
                    manuel={typeof manuel !== 'undefined' ? manuel : undefined}
                    senkronu={typeof senkronu !== 'undefined' ? senkronu : undefined}
                    tek={typeof tek !== 'undefined' ? tek : undefined}
                    yerden={typeof yerden !== 'undefined' ? yerden : undefined}
                    kontrol={typeof kontrol !== 'undefined' ? kontrol : undefined}
                    et={typeof et !== 'undefined' ? et : undefined}
                    wrap={typeof wrap !== 'undefined' ? wrap : undefined}
                    end={typeof end !== 'undefined' ? end : undefined}
                    runSupabaseHealthCheck={typeof runSupabaseHealthCheck !== 'undefined' ? runSupabaseHealthCheck : undefined}
                    supabaseHealthLoading={typeof supabaseHealthLoading !== 'undefined' ? supabaseHealthLoading : undefined}
                    supabaseBackupLoading={typeof supabaseBackupLoading !== 'undefined' ? supabaseBackupLoading : undefined}
                    white={typeof white !== 'undefined' ? white : undefined}
                    cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                    not={typeof not !== 'undefined' ? not : undefined}
                    allowed={typeof allowed !== 'undefined' ? allowed : undefined}
                    transition={typeof transition !== 'undefined' ? transition : undefined}
                    all={typeof all !== 'undefined' ? all : undefined}
                    runFullSupabaseRefresh={typeof runFullSupabaseRefresh !== 'undefined' ? runFullSupabaseRefresh : undefined}
                    ff3600={typeof ff3600 !== 'undefined' ? ff3600 : undefined}
                    Yenile={typeof Yenile !== 'undefined' ? Yenile : undefined}
                    downloadSupabaseBackupSnapshot={typeof downloadSupabaseBackupSnapshot !== 'undefined' ? downloadSupabaseBackupSnapshot : undefined}
                    Yedek={typeof Yedek !== 'undefined' ? Yedek : undefined}
                    copySupabaseBackupSnapshot={typeof copySupabaseBackupSnapshot !== 'undefined' ? copySupabaseBackupSnapshot : undefined}
                    dfe4ec={typeof dfe4ec !== 'undefined' ? dfe4ec : undefined}
                    b7d4ff={typeof b7d4ff !== 'undefined' ? b7d4ff : undefined}
                    Kopyala={typeof Kopyala !== 'undefined' ? Kopyala : undefined}
                    migrateLocalDataToSupabase={typeof migrateLocalDataToSupabase !== 'undefined' ? migrateLocalDataToSupabase : undefined}
                    eef6ff={typeof eef6ff !== 'undefined' ? eef6ff : undefined}
                    cfe4ff={typeof cfe4ff !== 'undefined' ? cfe4ff : undefined}
                    Yereli={typeof Yereli !== 'undefined' ? Yereli : undefined}
                    e={typeof e !== 'undefined' ? e : undefined}
                    Aktar={typeof Aktar !== 'undefined' ? Aktar : undefined}
                    handleInstallPwa={typeof handleInstallPwa !== 'undefined' ? handleInstallPwa : undefined}
                    Telefon={typeof Telefon !== 'undefined' ? Telefon : undefined}
                    bilgisayara={typeof bilgisayara !== 'undefined' ? bilgisayara : undefined}
                    uygulama={typeof uygulama !== 'undefined' ? uygulama : undefined}
                    gibi={typeof gibi !== 'undefined' ? gibi : undefined}
                    kur={typeof kur !== 'undefined' ? kur : undefined}
                    pwaInstallStatus={typeof pwaInstallStatus !== 'undefined' ? pwaInstallStatus : undefined}
                    installed={typeof installed !== 'undefined' ? installed : undefined}
                    Kurulu={typeof Kurulu !== 'undefined' ? Kurulu : undefined}
                    isIosDevice={typeof isIosDevice !== 'undefined' ? isIosDevice : undefined}
                    iPhone={typeof iPhone !== 'undefined' ? iPhone : undefined}
                    Kurulum={typeof Kurulum !== 'undefined' ? Kurulum : undefined}
                    Mobil={typeof Mobil !== 'undefined' ? Mobil : undefined}
                    getSupabaseHealthSummary={typeof getSupabaseHealthSummary !== 'undefined' ? getSupabaseHealthSummary : undefined}
                    Son={typeof Son !== 'undefined' ? Son : undefined}
                    toplu={typeof toplu !== 'undefined' ? toplu : undefined}
                    supabaseLastFullRefreshAt={typeof supabaseLastFullRefreshAt !== 'undefined' ? supabaseLastFullRefreshAt : undefined}
                    TR={typeof TR !== 'undefined' ? TR : undefined}
                    yok={typeof yok !== 'undefined' ? yok : undefined}
                    supabaseLastBackupAt={typeof supabaseLastBackupAt !== 'undefined' ? supabaseLastBackupAt : undefined}
                    profilePreferences={typeof profilePreferences !== 'undefined' ? profilePreferences : undefined}
                    Yerel={typeof Yerel !== 'undefined' ? Yerel : undefined}
                    verisini={typeof verisini !== 'undefined' ? verisini : undefined}
                    getSupabaseRealtimeClass={typeof getSupabaseRealtimeClass !== 'undefined' ? getSupabaseRealtimeClass : undefined}
                    supabaseRealtimeStatus={typeof supabaseRealtimeStatus !== 'undefined' ? supabaseRealtimeStatus : undefined}
                    supabaseLastRealtimeAt={typeof supabaseLastRealtimeAt !== 'undefined' ? supabaseLastRealtimeAt : undefined}
                    getPwaInstallClass={typeof getPwaInstallClass !== 'undefined' ? getPwaInstallClass : undefined}
                    PWA={typeof PWA !== 'undefined' ? PWA : undefined}
                    kurulum={typeof kurulum !== 'undefined' ? kurulum : undefined}
                    durumu={typeof durumu !== 'undefined' ? durumu : undefined}
                    supabaseHealthReport={typeof supabaseHealthReport !== 'undefined' ? supabaseHealthReport : undefined}
                    getSupabaseHealthStateClass={typeof getSupabaseHealthStateClass !== 'undefined' ? getSupabaseHealthStateClass : undefined}
                    bold={typeof bold !== 'undefined' ? bold : undefined}
                    truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                    Detay={typeof Detay !== 'undefined' ? Detay : undefined}
                    Yedekleme={typeof Yedekleme !== 'undefined' ? Yedekleme : undefined}
                    Mevcut={typeof Mevcut !== 'undefined' ? Mevcut : undefined}
                    olarak={typeof olarak !== 'undefined' ? olarak : undefined}
                    indir={typeof indir !== 'undefined' ? indir : undefined}
                    panoya={typeof panoya !== 'undefined' ? panoya : undefined}
                    kopyala={typeof kopyala !== 'undefined' ? kopyala : undefined}
                    downloadCurrentDataSnapshot={typeof downloadCurrentDataSnapshot !== 'undefined' ? downloadCurrentDataSnapshot : undefined}
                    copyCurrentDataSnapshot={typeof copyCurrentDataSnapshot !== 'undefined' ? copyCurrentDataSnapshot : undefined}
                    Veriyi={typeof Veriyi !== 'undefined' ? Veriyi : undefined}
                    Geri={typeof Geri !== 'undefined' ? Geri : undefined}
                    Daha={typeof Daha !== 'undefined' ? Daha : undefined}
                    indirilen={typeof indirilen !== 'undefined' ? indirilen : undefined}
                    mevcut={typeof mevcut !== 'undefined' ? mevcut : undefined}
                    verinin={typeof verinin !== 'undefined' ? verinin : undefined}
                    yazar={typeof yazar !== 'undefined' ? yazar : undefined}
                    ref={typeof ref !== 'undefined' ? ref : undefined}
                    dataImportInputRef={typeof dataImportInputRef !== 'undefined' ? dataImportInputRef : undefined}
                    file={typeof file !== 'undefined' ? file : undefined}
                    accept={typeof accept !== 'undefined' ? accept : undefined}
                    application={typeof application !== 'undefined' ? application : undefined}
                    json={typeof json !== 'undefined' ? json : undefined}
                    handleDataImportFile={typeof handleDataImportFile !== 'undefined' ? handleDataImportFile : undefined}
                    hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                    red={typeof red !== 'undefined' ? red : undefined}
                    Tehlikeli={typeof Tehlikeli !== 'undefined' ? Tehlikeli : undefined}
                    veriyi={typeof veriyi !== 'undefined' ? veriyi : undefined}
                    proje={typeof proje !== 'undefined' ? proje : undefined}
                    temizler={typeof temizler !== 'undefined' ? temizler : undefined}
                    resetLocalApplicationData={typeof resetLocalApplicationData !== 'undefined' ? resetLocalApplicationData : undefined}
                    Patron={typeof Patron !== 'undefined' ? Patron : undefined}
                    amber={typeof amber !== 'undefined' ? amber : undefined}
                    sadece={typeof sadece !== 'undefined' ? sadece : undefined}
                    aktiftir={typeof aktiftir !== 'undefined' ? aktiftir : undefined}
                  />

                  {activeProfileTab === 'Oturumlar' && (
                    <div>
                      <div className="text-[14px] font-black text-current mb-4">Aktif Oturumlar</div>

                      <div className="overflow-hidden border border-[#edf0f4] rounded-[6px]">
                        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_150px] h-9 bg-[#fafbfc] border-b border-[#edf0f4] items-center px-3 text-[10px] font-black text-[#6b7280]">
                          <div>Cihaz Tipi</div>
                          <div>İşletim Sistemi</div>
                          <div>Tarayıcı</div>
                          <div>Giriş Tarihi</div>
                          <div>Konum</div>
                          <div></div>
                        </div>

                        {profilePreferences.sessions.length > 0 ? (
                          profilePreferences.sessions.map((session) => (
                            <div key={session.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_150px] h-11 border-b last:border-b-0 border-[#edf0f4] items-center px-3 text-[10px] font-semibold text-[#394150]">
                              <div>▱ {session.device}</div>
                              <div>{session.os}</div>
                              <div>{session.browser}</div>
                              <div>{session.date}</div>
                              <div>{session.location}</div>
                              <button
                                type="button"
                                onClick={() => removeProfileSession(session.id)}
                                className="h-8 px-3 rounded-full bg-red-600 text-white text-[9px] font-black"
                              >
                                Oturumu Sonlandır
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="h-16 flex items-center justify-center text-[10.5px] font-bold text-[#9aa3b1]">
                            Aktif oturum yok.
                          </div>
                        )}
                      </div>

                      <div className="text-[14px] font-black text-current mt-7 mb-4">Son 2 Ay İçindeki Şüpheli Etkinlikler</div>

                      <div className="overflow-hidden border border-[#edf0f4] rounded-[6px]">
                        {profilePreferences.suspiciousEvents.length > 0 ? (
                          profilePreferences.suspiciousEvents.map((event) => (
                            <div key={event.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_150px] h-11 border-b last:border-b-0 border-[#edf0f4] items-center px-3 text-[10px] font-semibold text-[#394150]">
                              <div>▱ {event.device}</div>
                              <div>{event.os}</div>
                              <div>{event.browser}</div>
                              <div>{event.date}</div>
                              <div>{event.location}</div>
                              <div>{event.event}</div>
                              <button
                                type="button"
                                onClick={() => markSuspiciousEventAsMine(event.id)}
                                className="h-8 px-3 rounded-full bg-[#55ace8] text-white text-[9px] font-black"
                              >
                                Etkinlik Bana Ait
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="h-16 flex items-center justify-center text-[10.5px] font-bold text-[#9aa3b1]">
                            Şüpheli etkinlik yok.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (activeContentMenu === 'Projeler' || activeContentMenu === 'Diğer') ? (
          selectedProject ? (
            <div className="zrc-project-board-page w-full h-full min-h-0 bg-white animate-fade-in flex flex-col flex-1 overflow-hidden">
                            {activeContentMenu === 'Projeler' && (
<div className="w-full px-7 flex items-end justify-center shrink-0 h-[56px] bg-white relative z-20 border-b border-[#f5f6f8]">
                <div className="flex items-end justify-center gap-1">
                  {visibleProjectTabs.map((tab) => {
                    const tabWidths = {
                      'Görevler': 'min-w-[86px]',
                      'Dosyalar': 'min-w-[94px]',
                      'Gantt Çizelgesi': 'min-w-[128px]',
                      'Zaman Çizelgesi': 'min-w-[138px]',
                      'Takvim': 'min-w-[82px]',
                      'Raporlar': 'min-w-[90px]',
                      'Ayarlar': 'min-w-[84px]'
                    };

                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${tabWidths[tab]} h-[36px] px-3.5 text-[12px] font-extrabold tracking-tight rounded-t-xl rounded-b-none focus:outline-none select-none transition-all border border-b-0 ${
                          activeTab === tab
                            ? 'bg-[#f5f6f8] text-[#ff3600] border-[#f5f6f8] border-b-[#f5f6f8] shadow-none'
                            : 'bg-white text-zinc-400 border-[#f5f6f8] hover:text-zinc-700 hover:bg-zinc-50 hover:border-[#f5f6f8]'
                        }`}
                      >
                        <span className="relative inline-flex items-center justify-center">
                          {tab}
                          {activeTab === tab && (
                            <span className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+5px)] w-1.5 h-1.5 rounded-full bg-[#ff3600]" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

              <div className="flex-1 min-h-0 bg-[#f5f6f8] flex flex-col overflow-hidden h-full">
                                {/* zrc-v521-feature-gorevler */}
                <GorevlerTabPanel {...zrcFeatureSpreadProps} />



                                {/* zrc-v521-feature-takvim */}
                <TakvimTabPanel {...zrcFeatureSpreadProps} />


                                {/* zrc-v521-feature-zaman_cizelgesi */}
                <ZamanCizelgesiTabPanel {...zrcFeatureSpreadProps} />

                                {/* zrc-v521-feature-dosyalar */}
                <DosyalarTabPanel {...zrcFeatureSpreadProps} />



                                {/* zrc-v521-feature-gantt_cizelgesi */}
                <GanttCizelgesiTabPanel {...zrcFeatureSpreadProps} />


                                {/* zrc-v521-feature-raporlar */}
                <RaporlarTabPanel {...zrcFeatureSpreadProps} />

                {activeContentMenu === 'Diğer' && activeTab === 'Ekip' && showTeamManagementPage && (
                  <div className="zrc-team-center-page w-full h-full overflow-y-auto custom-scrollbar bg-[#f5f6f8] animate-fade-in">
                    <div className="zrc-center-card max-w-[1180px] mx-auto px-8 py-7">
                      <div className="rounded-[22px] bg-white border border-zinc-200 p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-6">
                          <div>
                            <div className="text-[10px] font-black tracking-[0.22em] uppercase text-[#ff3600]">Diğer / Ekip</div>
                            <h1 className="mt-1.5 text-[25px] font-black tracking-tight text-zinc-900">Ekip Yönetimi</h1>
                            <p className="mt-1.5 text-[11.5px] font-bold text-zinc-400 max-w-[520px]">
                              Görevlerde seçilecek kişileri buradan yönet. Pasif kişiler seçim listesinde görünmez.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-[86px] rounded-[14px] bg-[#fff3ef] border border-[#ff3600] p-3">
                              <div className="text-[21px] font-black text-[#ff3600]">{teamMembers.length}</div>
                              <div className="text-[9px] font-black text-white/80">Toplam</div>
                            </div>

                            <div className="w-[86px] rounded-[14px] bg-emerald-50 border border-emerald-100 p-3">
                              <div className="text-[21px] font-black text-emerald-600">{activeTeamMembers.length}</div>
                              <div className="text-[9px] font-black text-emerald-500/70">Aktif</div>
                            </div>

                            <div className="w-[86px] rounded-[14px] bg-zinc-50 border border-zinc-200 p-3">
                              <div className="text-[21px] font-black text-zinc-600">{passiveTeamMembers.length}</div>
                              <div className="text-[9px] font-black text-zinc-400">Pasif</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        {[
                          {
                            role: 'Yönetici',
                            desc: 'Projeler, kolonlar, görev silme, ekip ve müşteri yönetimi açık.',
                            active: currentUserRole === 'Yönetici'
                          },
                          {
                            role: 'Ekip Üyesi',
                            desc: 'Görev oluşturur/düzenler, dosya ekler, yorum ve yazışma kullanır.',
                            active: currentUserRole === 'Ekip Üyesi'
                          },
                          {
                            role: 'Müşteri/Misafir',
                            desc: 'Sadece görüntüleme, yorum ve yazışma odaklı sınırlı erişim.',
                            active: currentUserRole === 'Müşteri/Misafir'
                          }
                        ].map((item) => (
                          <div
                            key={item.role}
                            className={`rounded-[15px] border p-3 ${
                              item.active
                                ? 'bg-[#fff8f5] border-[#ff3600] shadow-sm'
                                : 'bg-white border-zinc-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={`h-6 px-2.5 rounded-full border text-[9px] font-black flex items-center ${getTeamRoleTone(item.role)}`}>
                                {item.role}
                              </span>
                              {item.active && (
                                <span className="text-[9px] font-black text-[#ff3600]">Aktif rolün</span>
                              )}
                            </div>
                            <p className="mt-2 text-[10px] font-bold text-zinc-400 leading-4">{item.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 grid grid-cols-[360px_minmax(0,1fr)] gap-5">
                        <form onSubmit={createTeamMemberFromCenter} className={`bg-white border border-zinc-200 rounded-[20px] p-5 shadow-sm h-fit ${!currentPermissions.manageTeam ? 'opacity-70' : ''}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="text-[15px] font-black text-zinc-800">Yeni Kişi</div>
                              <div className="mt-1 text-[10.5px] font-bold text-zinc-400">Kullanıcı adı ve şifre ile giriş hesabı oluştur</div>
                            </div>

                            <div className="w-11 h-11 rounded-[15px] bg-[#ff3600] text-white flex items-center justify-center">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {teamMemberDraft.role !== 'Müşteri/Misafir' ? (
                              <input
                                value={teamMemberDraft.name}
                                onChange={(event) => setTeamMemberDraft((prev) => ({
                                  ...prev,
                                  name: event.target.value,
                                  username: prev.username || normalizeCredentialText(event.target.value)
                                }))}
                                placeholder="Ad Soyad"
                                className="w-full h-11 rounded-[13px] border border-zinc-200 bg-zinc-50 px-4 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />
                            ) : (
                              <div className="rounded-[13px] border border-blue-100 bg-blue-50/55 px-3.5 py-3">
                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.08em]">Ad Soyad otomatik</div>
                                <div className="mt-1 text-[12px] font-black text-zinc-700">
                                  {getCustomerNameById(teamMemberDraft.customerId) || 'Aşağıdan müşteri seç'}
                                </div>
                                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                                  Müşteri/Misafir hesabında isim bağlı müşteri kartından alınır.
                                </div>
                              </div>
                            )}

                            {renderSoftSelect({
                              id: 'team-new-role',
                              value: teamMemberDraft.role,
                              options: teamRoleOptions,
                              onChange: (role) => setTeamMemberDraft((prev) => ({
                                ...prev,
                                role,
                                name: role === 'Müşteri/Misafir' ? '' : prev.name,
                                customerId: role === 'Müşteri/Misafir' ? prev.customerId : ''
                              })),
                              buttonClassName: 'h-11 rounded-[13px] bg-zinc-50 border border-zinc-200 px-4 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-[#ff3600]'
                            })}

                            {teamMemberDraft.role === 'Müşteri/Misafir' && renderSoftSelect({
                              id: 'team-new-customer-link',
                              label: 'Bağlı Müşteri',
                              value: getCustomerNameById(teamMemberDraft.customerId) || customerLinkNoneLabel,
                              options: customerLinkOptions,
                              onChange: (customerName) => {
                                const selectedCustomerId = customerName === customerLinkNoneLabel ? '' : getCustomerIdByName(customerName);
                                const selectedCustomer = getCustomerById(selectedCustomerId);

                                setTeamMemberDraft((prev) => ({
                                  ...prev,
                                  customerId: selectedCustomerId,
                                  username: prev.username || normalizeCredentialText(selectedCustomer?.name || '')
                                }));
                              },
                              buttonClassName: 'h-11 rounded-[13px] bg-zinc-50 border border-zinc-200 px-4 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-[#ff3600]'
                            })}

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                value={teamMemberDraft.username}
                                onChange={(event) => setTeamMemberDraft((prev) => ({ ...prev, username: normalizeCredentialText(event.target.value) }))}
                                placeholder="Kullanıcı adı"
                                className="w-full h-11 rounded-[13px] border border-zinc-200 bg-zinc-50 px-4 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />

                              <input
                                value={teamMemberDraft.password}
                                onChange={(event) => setTeamMemberDraft((prev) => ({ ...prev, password: event.target.value }))}
                                placeholder="Şifre"
                                className="w-full h-11 rounded-[13px] border border-zinc-200 bg-zinc-50 px-4 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="mt-4 w-full h-11 rounded-[13px] bg-[#ff3600] text-white text-[12px] font-black hover:bg-[#e03000] active:scale-[0.98] transition-all shadow-sm"
                          >
                            {currentPermissions.manageTeam ? 'Kişiyi Ekle' : 'Sadece Yönetici Ekleyebilir'}
                          </button>
                        </form>

                        <div className="bg-white border border-zinc-200 rounded-[18px] shadow-sm overflow-hidden">
                          <div className="h-12 px-4 border-b border-zinc-100 flex items-center justify-between">
                            <div>
                              <div className="text-[13.5px] font-black text-zinc-800">Ekip Listesi</div>
                              <div className="mt-0.5 text-[9.5px] font-bold text-zinc-400">Seç, düzenle veya durum değiştir</div>
                            </div>

                            <span className="h-6 px-2.5 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400 flex items-center">
                              {teamMembers.length} kişi
                            </span>
                          </div>

                          <div className="p-2.5 space-y-1 max-h-[calc(100vh-330px)] min-h-[360px] overflow-y-auto custom-scrollbar">
                            {teamMembers.length > 0 ? (
                              teamMembers.map((member) => {
                                const isPassive = member.status === 'Pasif';
                                const isPendingDelete = pendingTeamDeleteId === member.id;
                                const isSelected = selectedTeamMemberId === member.id;

                                return (
                                  <div
                                    key={member.id}
                                    onClick={() => setSelectedTeamMemberId(member.id)}
                                    className={`rounded-[10px] border transition-all cursor-pointer overflow-hidden ${
                                      isSelected
                                        ? 'bg-white border-zinc-300 shadow-[0_1px_0_rgba(15,23,42,0.03)]'
                                        : 'bg-white border-transparent hover:bg-zinc-50 hover:border-zinc-200'
                                    }`}
                                  >
                                    <div className="h-[46px] px-2.5 flex items-center gap-2.5">
                                      <div className={`w-7 h-7 rounded-[9px] text-white text-[8px] font-black flex items-center justify-center shrink-0 overflow-hidden ${
                                        isPassive ? 'bg-zinc-300' : 'bg-[#8c5220]'
                                      }`}>
                                        {renderProfileAvatar(member.avatar, createAvatarFromName(member.name))}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className={`text-[11.5px] font-black truncate ${isPassive ? 'text-zinc-400' : 'text-zinc-800'}`}>
                                          {normalizeTeamRole(member.role) === 'Müşteri/Misafir'
                                            ? getMemberLinkedCustomer(member)?.name || member.name
                                            : member.name}
                                        </div>
                                        <div className={`mt-0.5 inline-flex max-w-full h-5 px-2 rounded-full border text-[8px] font-black truncate ${getTeamRoleTone(member.role)}`}>
                                          {normalizeTeamRole(member.role)}
                                        </div>
                                      </div>

                                      <span className={`h-6 px-2 rounded-[8px] text-[8px] font-black border shrink-0 ${
                                        isPassive
                                          ? 'bg-zinc-50 border-zinc-200 text-zinc-400'
                                          : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                      }`}>
                                        {isPassive ? 'Pasif' : 'Aktif'}
                                      </span>

                                      <svg className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-zinc-500' : 'text-zinc-300'}`} fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>

                                    {isSelected && (
                                      <div className="h-[32px] px-2.5 border-t border-zinc-100 bg-zinc-50/60 flex items-center gap-2">
                                        <div className="min-w-0 flex-1 flex items-center gap-1.5 text-[8.5px] font-bold text-zinc-400">
                                          <span className="truncate">{member.email || 'E-posta yok'}</span>
                                          <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                                          <span className="truncate">@{member.username || createUsernameFromMember(member)}</span>
                                          <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                                          <span className={`h-5 px-2 rounded-full border text-[8px] font-black flex items-center shrink-0 ${getTeamRoleTone(member.role)}`}>
                                            {getAccountTypeFromRole(member.role)}
                                          </span>
                                          {normalizeTeamRole(member.role) === 'Müşteri/Misafir' && (
                                            <>
                                              <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                                              <span className="truncate">
                                                {getCustomerNameById(member.customerId) || getMemberLinkedCustomer(member)?.name || 'Müşteri bağlı değil'}
                                              </span>
                                            </>
                                          )}
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                          <button
                                            type="button"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              copyCredentialTextForMember(member);
                                            }}
                                            className="h-6 px-2.5 rounded-[8px] bg-[#ff3600] border border-[#ff3600] text-white hover:bg-[#ff3600] hover:text-white text-[8px] font-black transition-all"
                                          >
                                            Giriş Bilgisi
                                          </button>

                                          <button
                                            type="button"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              openTeamMemberEditModal(member);
                                            }}
                                            className="h-6 px-2.5 rounded-[8px] bg-white border border-zinc-200 text-zinc-600 hover:text-blue-600 hover:border-blue-100 text-[8px] font-black transition-all"
                                          >
                                            Düzenle
                                          </button>

                                          <button
                                            type="button"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              toggleTeamMemberStatus(member.id);
                                            }}
                                            className="h-6 px-2.5 rounded-[8px] bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-800 text-[8px] font-black transition-all"
                                          >
                                            {isPassive ? 'Aktif Yap' : 'Pasif Yap'}
                                          </button>

                                          <button
                                            type="button"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              deleteTeamMemberFromCenter(member.id);
                                            }}
                                            className={`h-6 px-2.5 rounded-[8px] text-[8px] font-black border transition-all ${
                                              isPendingDelete
                                                ? 'bg-red-500 border-red-500 text-white'
                                                : 'bg-white border-zinc-200 text-zinc-500 hover:text-red-500 hover:border-red-100'
                                            }`}
                                          >
                                            {isPendingDelete ? 'Tekrar' : 'Sil'}
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="h-[250px] rounded-[16px] bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                                <div className="text-[13px] font-black text-zinc-700">Henüz kişi yok</div>
                                <div className="mt-1 text-[10.5px] font-bold text-zinc-400">Sol taraftaki formdan ekip üyesi ekle.</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                                {/* zrc-v526-section-activecontentmenu-diger-activetab-musteriler-showcustomermanagementpage */}
                <ZRCAppShellActiveContentMenuDigerActiveTabMusterilerShowCustomerManagementPageSection
                  activeTab={typeof activeTab !== 'undefined' ? activeTab : undefined}
                  activeContentMenu={typeof activeContentMenu !== 'undefined' ? activeContentMenu : undefined}
                  showCustomerManagementPage={typeof showCustomerManagementPage !== 'undefined' ? showCustomerManagementPage : undefined}
                  zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                  center={typeof center !== 'undefined' ? center : undefined}
                  page={typeof page !== 'undefined' ? page : undefined}
                  w={typeof w !== 'undefined' ? w : undefined}
                  full={typeof full !== 'undefined' ? full : undefined}
                  h={typeof h !== 'undefined' ? h : undefined}
                  overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                  auto={typeof auto !== 'undefined' ? auto : undefined}
                  custom={typeof custom !== 'undefined' ? custom : undefined}
                  scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
                  bg={typeof bg !== 'undefined' ? bg : undefined}
                  f5f6f8={typeof f5f6f8 !== 'undefined' ? f5f6f8 : undefined}
                  animate={typeof animate !== 'undefined' ? animate : undefined}
                  fade={typeof fade !== 'undefined' ? fade : undefined}
                  card={typeof card !== 'undefined' ? card : undefined}
                  max={typeof max !== 'undefined' ? max : undefined}
                  mx={typeof mx !== 'undefined' ? mx : undefined}
                  px={typeof px !== 'undefined' ? px : undefined}
                  py={typeof py !== 'undefined' ? py : undefined}
                  rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                  white={typeof white !== 'undefined' ? white : undefined}
                  border={typeof border !== 'undefined' ? border : undefined}
                  zinc={typeof zinc !== 'undefined' ? zinc : undefined}
                  shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                  sm={typeof sm !== 'undefined' ? sm : undefined}
                  flex={typeof flex !== 'undefined' ? flex : undefined}
                  items={typeof items !== 'undefined' ? items : undefined}
                  justify={typeof justify !== 'undefined' ? justify : undefined}
                  between={typeof between !== 'undefined' ? between : undefined}
                  gap={typeof gap !== 'undefined' ? gap : undefined}
                  text={typeof text !== 'undefined' ? text : undefined}
                  font={typeof font !== 'undefined' ? font : undefined}
                  black={typeof black !== 'undefined' ? black : undefined}
                  tracking={typeof tracking !== 'undefined' ? tracking : undefined}
                  uppercase={typeof uppercase !== 'undefined' ? uppercase : undefined}
                  ff3600={typeof ff3600 !== 'undefined' ? ff3600 : undefined}
                  mt={typeof mt !== 'undefined' ? mt : undefined}
                  tight={typeof tight !== 'undefined' ? tight : undefined}
                  bold={typeof bold !== 'undefined' ? bold : undefined}
                  ekle={typeof ekle !== 'undefined' ? ekle : undefined}
                  ve={typeof ve !== 'undefined' ? ve : undefined}
                  takip={typeof takip !== 'undefined' ? takip : undefined}
                  et={typeof et !== 'undefined' ? et : undefined}
                  shrink={typeof shrink !== 'undefined' ? shrink : undefined}
                  customers={typeof customers !== 'undefined' ? customers : undefined}
                  fff3ef={typeof fff3ef !== 'undefined' ? fff3ef : undefined}
                  customerPageItems={typeof customerPageItems !== 'undefined' ? customerPageItems : undefined}
                  Liste={typeof Liste !== 'undefined' ? Liste : undefined}
                  grid={typeof grid !== 'undefined' ? grid : undefined}
                  space={typeof space !== 'undefined' ? space : undefined}
                  createCustomerFromCenter={typeof createCustomerFromCenter !== 'undefined' ? createCustomerFromCenter : undefined}
                  mb={typeof mb !== 'undefined' ? mb : undefined}
                  Yeni={typeof Yeni !== 'undefined' ? Yeni : undefined}
                  none={typeof none !== 'undefined' ? none : undefined}
                  currentColor={typeof currentColor !== 'undefined' ? currentColor : undefined}
                  round={typeof round !== 'undefined' ? round : undefined}
                  M12={typeof M12 !== 'undefined' ? M12 : undefined}
                  customerDraft={typeof customerDraft !== 'undefined' ? customerDraft : undefined}
                  setCustomerDraft={typeof setCustomerDraft !== 'undefined' ? setCustomerDraft : undefined}
                  outline={typeof outline !== 'undefined' ? outline : undefined}
                  Yetkili={typeof Yetkili !== 'undefined' ? Yetkili : undefined}
                  Telefon={typeof Telefon !== 'undefined' ? Telefon : undefined}
                  normalizeCredentialText={typeof normalizeCredentialText !== 'undefined' ? normalizeCredentialText : undefined}
                  orange={typeof orange !== 'undefined' ? orange : undefined}
                  leading={typeof leading !== 'undefined' ? leading : undefined}
                  girersen={typeof girersen !== 'undefined' ? girersen : undefined}
                  bu={typeof bu !== 'undefined' ? bu : undefined}
                  da={typeof da !== 'undefined' ? da : undefined}
                  Not={typeof Not !== 'undefined' ? Not : undefined}
                  resize={typeof resize !== 'undefined' ? resize : undefined}
                  submit={typeof submit !== 'undefined' ? submit : undefined}
                  e03000={typeof e03000 !== 'undefined' ? e03000 : undefined}
                  scale={typeof scale !== 'undefined' ? scale : undefined}
                  transition={typeof transition !== 'undefined' ? transition : undefined}
                  all={typeof all !== 'undefined' ? all : undefined}
                  Ekle={typeof Ekle !== 'undefined' ? Ekle : undefined}
                  selectedCustomer={typeof selectedCustomer !== 'undefined' ? selectedCustomer : undefined}
                  copyCredentialTextForCustomer={typeof copyCredentialTextForCustomer !== 'undefined' ? copyCredentialTextForCustomer : undefined}
                  Bilgisi={typeof Bilgisi !== 'undefined' ? Bilgisi : undefined}
                  createAvatarFromName={typeof createAvatarFromName !== 'undefined' ? createAvatarFromName : undefined}
                  min={typeof min !== 'undefined' ? min : undefined}
                  truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                  yok={typeof yok !== 'undefined' ? yok : undefined}
                  blue={typeof blue !== 'undefined' ? blue : undefined}
                  emerald={typeof emerald !== 'undefined' ? emerald : undefined}
                  Biten={typeof Biten !== 'undefined' ? Biten : undefined}
                  hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                  b={typeof b !== 'undefined' ? b : undefined}
                  Listesi={typeof Listesi !== 'undefined' ? Listesi : undefined}
                  veya={typeof veya !== 'undefined' ? veya : undefined}
                  sil={typeof sil !== 'undefined' ? sil : undefined}
                  calc={typeof calc !== 'undefined' ? calc : undefined}
                  pendingCustomerDeleteId={typeof pendingCustomerDeleteId !== 'undefined' ? pendingCustomerDeleteId : undefined}
                  task={typeof task !== 'undefined' ? task : undefined}
                  setSelectedCustomerId={typeof setSelectedCustomerId !== 'undefined' ? setSelectedCustomerId : undefined}
                  cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                  pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                  transparent={typeof transparent !== 'undefined' ? transparent : undefined}
                  red={typeof red !== 'undefined' ? red : undefined}
                  geciken={typeof geciken !== 'undefined' ? geciken : undefined}
                  transform={typeof transform !== 'undefined' ? transform : undefined}
                  rotate={typeof rotate !== 'undefined' ? rotate : undefined}
                  M9={typeof M9 !== 'undefined' ? M9 : undefined}
                  t={typeof t !== 'undefined' ? t : undefined}
                  getCustomerLinkedAccount={typeof getCustomerLinkedAccount !== 'undefined' ? getCustomerLinkedAccount : undefined}
                  Otomatik={typeof Otomatik !== 'undefined' ? Otomatik : undefined}
                  openCustomerEditModal={typeof openCustomerEditModal !== 'undefined' ? openCustomerEditModal : undefined}
                  deleteCustomerFromCenter={typeof deleteCustomerFromCenter !== 'undefined' ? deleteCustomerFromCenter : undefined}
                  Tekrar={typeof Tekrar !== 'undefined' ? Tekrar : undefined}
                  Sil={typeof Sil !== 'undefined' ? Sil : undefined}
                  dashed={typeof dashed !== 'undefined' ? dashed : undefined}
                  col={typeof col !== 'undefined' ? col : undefined}
                  Sol={typeof Sol !== 'undefined' ? Sol : undefined}
                  taraftaki={typeof taraftaki !== 'undefined' ? taraftaki : undefined}
                  formdan={typeof formdan !== 'undefined' ? formdan : undefined}
                />

                {activeTab === 'Ayarlar' && showProjectSettingsControls && (
                  <div className="w-full flex-1 bg-[#f5f6f8] overflow-y-auto custom-scrollbar animate-fade-in">
                    <div className="max-w-[980px] mx-auto px-7 py-7">
                      <div className="bg-white border border-zinc-200/70 rounded-[16px] shadow-[0_10px_32px_rgba(15,23,42,0.045)] overflow-hidden">
                        <div className="h-[70px] px-6 border-b border-zinc-100 flex items-center justify-between">
                          <div>
                            <h3 className="text-[15px] font-black text-zinc-800 tracking-tight">Proje Ayarları</h3>
                            <p className="mt-0.5 text-[11px] font-bold text-zinc-400">Seçili projenin temel bilgilerini düzenle.</p>
                          </div>

                          <div
                            className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white shadow-sm"
                            style={{ backgroundColor: projectSettingsDraft.color || '#ff3600' }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5M6 5.25h12A2.25 2.25 0 0120.25 7.5v9A2.25 2.25 0 0118 18.75H6A2.25 2.25 0 013.75 16.5v-9A2.25 2.25 0 016 5.25z" />
                            </svg>
                          </div>
                        </div>

                        <div className="p-6 grid grid-cols-[1fr_280px] gap-6">
                          <div className="space-y-2.5">
                            <label className="block">
                              <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-1.5">Proje Adı</span>
                              <input
                                value={projectSettingsDraft.title}
                                onChange={(event) => setProjectSettingsDraft((prevDraft) => ({ ...prevDraft, title: event.target.value }))}
                                className="w-full h-10 rounded-[9px] bg-zinc-50 border border-zinc-200 px-3 text-[12.5px] font-bold text-zinc-700 focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 transition-all"
                              />
                            </label>

                            <label className="block">
                              <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-1.5">Açıklama</span>
                              <textarea
                                value={projectSettingsDraft.description}
                                onChange={(event) => setProjectSettingsDraft((prevDraft) => ({ ...prevDraft, description: event.target.value }))}
                                placeholder="Bu proje hakkında kısa açıklama..."
                                className="w-full h-[92px] resize-none rounded-[9px] bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 text-[12px] font-medium text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-500/5 transition-all custom-scrollbar"
                              />
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                              {renderSoftSelect({
                                id: 'project-settings-customer',
                                label: 'Müşteri',
                                value: projectSettingsDraft.customer || 'Müşteri Yok',
                                options: ['Müşteri Yok', ...customers.map((customer) => customer.name)],
                                onChange: (customerName) => {
                                  const linkedCustomer = getCustomerByName(customerName);

                                  setProjectSettingsDraft((prevDraft) => ({
                                    ...prevDraft,
                                    customer: customerName === 'Müşteri Yok' ? '' : customerName,
                                    customerId: linkedCustomer?.id || ''
                                  }));
                                },
                                wrapperClassName: 'block',
                                buttonClassName: 'h-10 rounded-[9px] bg-zinc-50 border border-zinc-200 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-blue-300'
                              })}

                              {renderSoftSelect({
                                id: 'project-settings-status',
                                label: 'Durum',
                                value: projectSettingsDraft.status,
                                options: ['Aktif', 'Beklemede', 'Tamamlandı', 'Arşiv'],
                                onChange: (status) => setProjectSettingsDraft((prevDraft) => ({ ...prevDraft, status })),
                                wrapperClassName: 'block',
                                buttonClassName: 'h-10 rounded-[9px] bg-zinc-50 border border-zinc-200 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-blue-300'
                              })}
                            </div>

                            <div className="relative rounded-[13px] border border-zinc-200 bg-zinc-50/70 p-3">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em]">Proje Ekibi</div>
                                  <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                                    Kurucu hesap listelenmez; sadece projede çalışacak ekip üyeleri seçilir.
                                  </div>
                                </div>

                                <span className="h-6 px-2.5 rounded-full bg-white border border-zinc-200 text-[9px] font-black text-zinc-500">
                                  {selectedProjectTeamMembers.length} kişi
                                </span>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2 min-h-[38px] rounded-[10px] bg-white border border-zinc-200 px-2 py-2">
                                {selectedProjectTeamMembers.length > 0 ? (
                                  selectedProjectTeamMembers.map((member) => (
                                    <div
                                      key={`selected-project-member-${member.id}`}
                                      className="h-8 pl-1.5 pr-2 rounded-full bg-zinc-50 border border-zinc-200 flex items-center gap-2 shadow-[0_6px_14px_rgba(15,23,42,0.035)]"
                                    >
                                      <span className="w-6 h-6 rounded-full bg-zinc-800 text-white text-[8px] font-black flex items-center justify-center overflow-hidden shrink-0">
                                        {renderProfileAvatar(member.avatar, createAvatarFromName(member.name))}
                                      </span>
                                      <span className="text-[10px] font-black text-zinc-700 max-w-[130px] truncate">
                                        {member.name}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!currentPermissions.manageProjectSettings) return;

                                          setProjectSettingsDraft((prevDraft) => {
                                            const currentIds = Array.isArray(prevDraft.teamMemberIds) ? prevDraft.teamMemberIds.map(String) : [];

                                            return {
                                              ...prevDraft,
                                              teamMemberIds: currentIds.filter((id) => id !== String(member.id))
                                            };
                                          });
                                        }}
                                        disabled={!currentPermissions.manageProjectSettings}
                                        className="w-5 h-5 rounded-full bg-white text-zinc-400 hover:text-[#ff3600] hover:bg-[#fff3ef] flex items-center justify-center text-[13px] font-black transition-all disabled:opacity-40"
                                        title="Projeden çıkar"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <div className="h-8 px-2 flex items-center text-[10px] font-bold text-zinc-400">
                                    Henüz ekip üyesi eklenmedi.
                                  </div>
                                )}
                              </div>

                              <div className="mt-2 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!currentPermissions.manageProjectSettings) return;
                                    setIsProjectTeamPickerOpen(true);
                                  }}
                                  disabled={!currentPermissions.manageProjectSettings || availableProjectTeamMembers.length === 0}
                                  className={`h-7 px-3.5 rounded-[8px] text-[10px] font-black flex items-center justify-center gap-1.5 transition-all ${
                                    currentPermissions.manageProjectSettings && availableProjectTeamMembers.length > 0
                                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-[0_8px_16px_rgba(15,23,42,0.10)]'
                                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                  }`}
                                >
                                  <span className="text-[13px] leading-none">+</span>
                                  <span>{availableProjectTeamMembers.length > 0 ? 'Ekip Üyesi Ekle' : 'Eklenebilir üye yok'}</span>
                                </button>
                              </div>

                              {isProjectTeamPickerOpen && currentPermissions.manageProjectSettings && availableProjectTeamMembers.length > 0 &&
                                createPortal((
                                  <div
                                    className="fixed inset-0 z-[2147483000] flex items-center justify-center bg-slate-900/35 backdrop-blur-[3px]"
                                  onMouseDown={(event) => {
                                    if (event.target === event.currentTarget) {
                                      setIsProjectTeamPickerOpen(false);
                                    }
                                  }}
                                >
                                  <div
                                    className="w-[360px] max-w-[calc(100vw-32px)] rounded-[18px] border border-zinc-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] overflow-hidden"
                                    onMouseDown={(event) => event.stopPropagation()}
                                  >
                                    <div className="h-12 px-4 border-b border-zinc-100 bg-zinc-50/80 flex items-center justify-between gap-3">
                                      <div>
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.08em]">Ekip Üyesi Seç</div>
                                        <div className="mt-0.5 text-[8.5px] font-bold text-zinc-400">
                                          Zaten ekli olan kişiler listelenmez.
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => setIsProjectTeamPickerOpen(false)}
                                        className="w-7 h-7 rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 flex items-center justify-center text-[15px] font-black transition-all"
                                        title="Kapat"
                                      >
                                        ×
                                      </button>
                                    </div>

                                    <div className="max-h-[260px] overflow-y-auto custom-scrollbar p-2">
                                      {availableProjectTeamMembers.map((member) => (
                                        <button
                                          key={`available-project-member-${member.id}`}
                                          type="button"
                                          onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();

                                            setProjectSettingsDraft((prevDraft) => {
                                              const currentIds = Array.isArray(prevDraft.teamMemberIds) ? prevDraft.teamMemberIds.map(String) : [];
                                              const memberId = String(member.id);

                                              if (currentIds.includes(memberId)) return prevDraft;

                                              return {
                                                ...prevDraft,
                                                teamMemberIds: [...currentIds, memberId]
                                              };
                                            });

                                            setIsProjectTeamPickerOpen(false);
                                          }}
                                          className="w-full min-h-[46px] rounded-[13px] px-2.5 py-2 flex items-center gap-2.5 text-left hover:bg-zinc-50 active:bg-zinc-100 transition-all"
                                        >
                                          <span className="w-9 h-9 rounded-full bg-zinc-900 text-white text-[9px] font-black flex items-center justify-center overflow-hidden shrink-0">
                                            {renderProfileAvatar(member.avatar, createAvatarFromName(member.name))}
                                          </span>

                                          <span className="min-w-0 flex-1">
                                            <span className="block text-[11.5px] font-black text-zinc-700 truncate">{member.name}</span>
                                            <span className="block text-[8.5px] font-bold text-zinc-400 truncate">@{member.username || createUsernameFromMember(member)}</span>
                                          </span>

                                          <span className="w-7 h-7 rounded-full bg-[#fff3ef] text-[#ff3600] text-[16px] font-black flex items-center justify-center shrink-0">
                                            +
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  </div>
                                ),
                                  document.body
                                )}
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={handleArchiveProject}
                                className="h-9 px-4 rounded-full bg-white border border-orange-100 text-orange-500 hover:bg-orange-50 text-[11px] font-black transition-all"
                              >
                                Arşivle
                              </button>

                              <button
                                type="button"
                                onClick={handleDeleteProject}
                                className="h-9 px-4 rounded-full bg-white border border-red-100 text-red-500 hover:bg-red-50 text-[11px] font-black transition-all"
                              >
                                Sil
                              </button>

                              <button
                                type="button"
                                onClick={handleSaveProjectSettings}
                                className="h-9 px-5 rounded-full bg-[#2563eb] text-white text-[11px] font-black hover:bg-[#1d4ed8] shadow-[0_9px_20px_rgba(37,99,235,0.18)] transition-all"
                              >
                                Kaydet
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            <div className="rounded-[14px] border border-zinc-200 bg-zinc-50 p-4">
                              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-3">Proje Rengi</div>

                              <div className="flex items-center gap-2 flex-wrap">
                                {['#ff3600', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#0f172a', '#64748b'].map((color) => (
                                  <button
                                    key={color}
                                    type="button"
                                    onClick={() => setProjectSettingsDraft((prevDraft) => ({ ...prevDraft, color }))}
                                    className={`w-7 h-7 rounded-full border transition-all ${
                                      projectSettingsDraft.color === color
                                        ? 'border-zinc-900 ring-2 ring-zinc-900 scale-110'
                                        : 'border-white hover:scale-110 hover:ring-4 hover:ring-zinc-900/5'
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}

                                <input
                                  type="color"
                                  value={projectSettingsDraft.color}
                                  onChange={(event) => setProjectSettingsDraft((prevDraft) => ({ ...prevDraft, color: event.target.value }))}
                                  className="w-8 h-8 rounded-full border border-zinc-200 bg-white p-1 cursor-pointer"
                                />
                              </div>
                            </div>

                            <div className="rounded-[14px] border border-zinc-200 bg-white p-4">
                              <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-3">Özet</div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-zinc-400">Kolon</span>
                                  <span className="text-zinc-700">{boardColumns.length}</span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-zinc-400">Aktif görev</span>
                                  <span className="text-zinc-700">{boardColumns.reduce((total, column) => total + column.tasks.length, 0)}</span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-zinc-400">Arşiv</span>
                                  <span className="text-zinc-700">{archivedTasks.length}</span>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span className="text-zinc-400">Durum</span>
                                  <span className="text-zinc-700">{projectSettingsDraft.status}</span>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-[14px] border border-zinc-200 bg-white p-4">
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em]">Proje Geçmişi</div>
                                <span className="h-5 px-2 rounded-full bg-zinc-50 border border-zinc-100 text-[8px] font-black text-zinc-400">
                                  {(projectSettingsDraft.teamHistory || []).length}
                                </span>
                              </div>

                              <div className="space-y-2 max-h-[190px] overflow-y-auto custom-scrollbar pr-1">
                                {(projectSettingsDraft.teamHistory || []).length > 0 ? (
                                  (projectSettingsDraft.teamHistory || []).slice(0, 8).map((entry) => (
                                    <div key={entry.id} className="rounded-[11px] bg-zinc-50 border border-zinc-100 p-2.5">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className={`text-[9px] font-black ${
                                          entry.type === 'team-remove' ? 'text-red-500' : 'text-[#ff3600]'
                                        }`}>
                                          {entry.title}
                                        </div>
                                        <div className="text-[8px] font-black text-zinc-300">{entry.time}</div>
                                      </div>

                                      <div className="mt-1 text-[9.5px] font-bold text-zinc-500 leading-4">
                                        {entry.description}
                                      </div>

                                      <div className="mt-1 text-[8px] font-black text-zinc-300">
                                        {entry.actor || 'Sistem'} · {entry.date}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="h-16 rounded-[11px] bg-zinc-50 border border-dashed border-zinc-200 flex items-center justify-center text-[9.5px] font-black text-zinc-400">
                                    Henüz ekip geçmişi yok
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-center animate-fade-in p-8">
              <h2 className="text-[15px] font-black text-zinc-700 tracking-tight">Görüntülenecek Proje Seçilmedi</h2>
            </div>
          )
        ) : (
          <div className="w-full min-h-screen flex flex-col items-center justify-center text-center animate-fade-in p-8 bg-[#f5f6f8]">
            <h2 className="text-[15px] font-black text-zinc-700 tracking-tight select-none">Bu Sayfa Boş</h2>
          </div>
        )}

        {selectedTasks.length > 0 && currentPermissions.deleteTasks && boardView === 'Tüm Görevler' && activeContentMenu === 'Projeler' && (
          <div className="fixed bottom-6 right-6 bg-white border border-zinc-200 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-xl p-5 w-[380px] z-[90] animate-modal">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[13px] font-black text-zinc-800">{selectedTasks.length} Görev Seçildi</h4>

              <button onClick={() => setSelectedTasks([])} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                ×
              </button>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <button onClick={handleBulkArchive} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-3.5 py-1.5 rounded-md text-[10.5px] font-bold shadow-sm">
                Arşivle
              </button>

              <button onClick={handleBulkDelete} className="bg-[#ef4444] hover:bg-[#dc2626] text-white px-3.5 py-1.5 rounded-md text-[10.5px] font-bold shadow-sm">
                Sil
              </button>
            </div>
          </div>
        )}
      </main>

      {editingTeamMember && (
        <div
          className="fixed inset-0 z-[760] bg-zinc-950/25 backdrop-blur-[2px] flex items-center justify-center animate-fade-in"
          onClick={closeTeamMemberEditModal}
        >
          <form
            onSubmit={saveTeamMemberEdit}
            onClick={(event) => event.stopPropagation()}
            className="w-[460px] bg-white border border-zinc-200 rounded-[18px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-visible"
          >
            <div className="h-14 px-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-black text-zinc-800">Kişi Düzenle</div>
                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">Ekip üyesi bilgilerini güncelle</div>
              </div>

              <button
                type="button"
                onClick={closeTeamMemberEditModal}
                className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-white hover:text-zinc-900 transition-all flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-3">
              {teamMemberEditDraft.role !== 'Müşteri/Misafir' ? (
                <input
                  value={teamMemberEditDraft.name}
                  onChange={(event) => setTeamMemberEditDraft((prev) => ({
                    ...prev,
                    name: event.target.value,
                    username: prev.username || normalizeCredentialText(event.target.value)
                  }))}
                  placeholder="Ad Soyad"
                  className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                />
              ) : (
                <div className="rounded-[12px] border border-blue-100 bg-blue-50/55 px-3 py-2.5">
                  <div className="text-[9.5px] font-black text-blue-500 uppercase tracking-[0.08em]">Ad Soyad otomatik</div>
                  <div className="mt-1 text-[12px] font-black text-zinc-700">
                    {getCustomerNameById(teamMemberEditDraft.customerId) || 'Aşağıdan müşteri seç'}
                  </div>
                  <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                    İsim bağlı müşteri kartından güncellenir.
                  </div>
                </div>
              )}

              {renderSoftSelect({
                id: 'team-edit-role',
                value: teamMemberEditDraft.role,
                options: teamRoleOptions,
                onChange: (role) => setTeamMemberEditDraft((prev) => ({
                  ...prev,
                  role,
                  name: role === 'Müşteri/Misafir' ? '' : prev.name,
                  customerId: role === 'Müşteri/Misafir' ? prev.customerId : ''
                })),
                buttonClassName: 'h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-[#ff3600]'
              })}

              {teamMemberEditDraft.role === 'Müşteri/Misafir' && renderSoftSelect({
                id: 'team-edit-customer-link',
                label: 'Bağlı Müşteri',
                value: getCustomerNameById(teamMemberEditDraft.customerId) || customerLinkNoneLabel,
                options: customerLinkOptions,
                onChange: (customerName) => {
                  const selectedCustomerId = customerName === customerLinkNoneLabel ? '' : getCustomerIdByName(customerName);
                  const selectedCustomer = getCustomerById(selectedCustomerId);

                  setTeamMemberEditDraft((prev) => ({
                    ...prev,
                    customerId: selectedCustomerId,
                    username: prev.username || normalizeCredentialText(selectedCustomer?.name || ''),
                    email: prev.email || selectedCustomer?.email || ''
                  }));
                },
                buttonClassName: 'h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 hover:bg-white hover:border-[#ff3600]'
              })}

              <input
                value={teamMemberEditDraft.email}
                onChange={(event) => setTeamMemberEditDraft((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="E-posta"
                className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  value={teamMemberEditDraft.username}
                  onChange={(event) => setTeamMemberEditDraft((prev) => ({ ...prev, username: normalizeCredentialText(event.target.value) }))}
                  placeholder="Kullanıcı adı"
                  className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                />

                <input
                  value={teamMemberEditDraft.password}
                  onChange={(event) => setTeamMemberEditDraft((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Şifre"
                  className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                />
              </div>
            </div>

            <div className="h-14 px-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeTeamMemberEditModal}
                className="h-9 px-4 rounded-[11px] bg-white border border-zinc-200 text-[11px] font-black text-zinc-500 hover:text-zinc-800 transition-all"
              >
                İptal
              </button>

              <button
                type="submit"
                className="h-9 px-5 rounded-[11px] bg-[#ff3600] text-white text-[11px] font-black hover:bg-[#e03000] active:scale-[0.98] transition-all"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {editingCustomer && (
        <div
          className="fixed inset-0 z-[760] bg-zinc-950/25 backdrop-blur-[2px] flex items-center justify-center animate-fade-in"
          onClick={closeCustomerEditModal}
        >
          <form
            onSubmit={saveCustomerEdit}
            onClick={(event) => event.stopPropagation()}
            className="w-[430px] bg-white border border-zinc-200 rounded-[18px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-hidden"
          >
            <div className="h-14 px-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-black text-zinc-800">Müşteri Düzenle</div>
                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">Bilgileri güncelle</div>
              </div>

              <button
                type="button"
                onClick={closeCustomerEditModal}
                className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:bg-white hover:text-zinc-900 transition-all flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-3">
              <input
                value={customerEditDraft.name}
                onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Müşteri adı"
                className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
              />

              <input
                value={customerEditDraft.contact}
                onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, contact: event.target.value }))}
                placeholder="Yetkili kişi"
                className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
              />
              <input
                value={customerEditDraft.phone}
                onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Telefon"
                className="w-full h-10 rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
              />


              
              <textarea
                value={customerEditDraft.note}
                onChange={(event) => setCustomerEditDraft((prev) => ({ ...prev, note: event.target.value }))}
                placeholder="Not"
                rows={3}
                className="w-full resize-none rounded-[12px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
              />
            </div>

            <div className="h-14 px-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeCustomerEditModal}
                className="h-9 px-4 rounded-[11px] bg-white border border-zinc-200 text-[11px] font-black text-zinc-500 hover:text-zinc-800 transition-all"
              >
                İptal
              </button>

              <button
                type="submit"
                className="h-9 px-5 rounded-[11px] bg-[#ff3600] text-white text-[11px] font-black hover:bg-[#e03000] active:scale-[0.98] transition-all"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      <TaskDetailModal
        isOpen={Boolean(detailTaskInfo)}
        task={detailTaskInfo?.task}
        columnTitle={detailTaskInfo?.columnTitle}
        onClose={closeTaskDetail}
        onEdit={editTaskFromDetail}
        onUpdate={updateTaskFromDetail}
        onAddComment={addTaskComment}
        onDeleteComment={deleteTaskComment}
        canEditTask={Boolean(currentPermissions.editTasks && detailTaskInfo?.task && canCurrentUserModifyTask(detailTaskInfo.task, getProjectNameForTask(detailTaskInfo.task) || selectedProject))}
        canManageFiles={Boolean(currentPermissions.manageFiles && detailTaskInfo?.task && canCurrentUserModifyTask(detailTaskInfo.task, getProjectNameForTask(detailTaskInfo.task) || selectedProject))}
        canComment={Boolean(currentPermissions.comment && detailTaskInfo?.task && canCurrentUserModifyTask(detailTaskInfo.task, getProjectNameForTask(detailTaskInfo.task) || selectedProject))}
        currentAccountType={currentAccountType}
        currentActorId={currentActorId}
        currentActorName={currentActorName}
        currentActorAvatar={currentActorAvatar}
        onUploadFiles={uploadTaskFilesToSupabase}
        onDownloadFile={downloadTaskFileFromSupabase}
        onDeleteFile={deleteTaskStoredFileFromSupabase}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setCalendarNewTaskDate(null);
          setCalendarTaskModalContext({
            isOpen: false,
            pendingOpen: false,
            projectName: '',
            date: ''
          });
        }}
        onSave={handleSaveTask}
        initialData={editingTask}
        calendarDefaultDate={calendarNewTaskDate}
        projectName={calendarTaskModalContext.isOpen ? calendarTaskModalContext.projectName : selectedProject}
        projectOptions={visibleProjectNames}
        canChangeProject={Boolean(calendarTaskModalContext.isOpen && !editingTask)}
        onProjectChange={changeCalendarTaskModalProject}
        statusOptions={boardColumns.map((column) => ({
          label: column.title,
          bg: column.color,
          text: getReadableColumnColor(column.color)
        }))}
        teamMembers={taskModalTeamMembers}
        customers={currentAccountType === 'Müşteri' ? customers.filter((customer) => currentCustomerKeys.includes(normalizeCredentialText(customer.id)) || currentCustomerKeys.includes(normalizeCredentialText(customer.name))) : customers}
      />

      <StageModal
        isOpen={isStageModalOpen}
        onClose={() => {
          setIsStageModalOpen(false);
          setEditingColumn(null);
        }}
        onSave={handleSaveStage}
        columnData={editingColumn}
      />
    </div>
  );
}
