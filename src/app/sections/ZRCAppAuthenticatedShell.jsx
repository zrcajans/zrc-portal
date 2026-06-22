import Sidebar from '../../components/Layout/Sidebar';
import TopNavbar from '../../components/Layout/TopNavbar';
import MobileWorkspace from '../../components/mobile/MobileWorkspace';
import { resolveMobileTaskCardAssignees } from '../../utils/mobileTaskAssignees';
import ZRCAppShellAutoUiBlock01 from '../blocks/ZRCAppShellAutoUiBlock01';
import ZRCAppShellGlobalSearchBlock from '../blocks/ZRCAppShellGlobalSearchBlock';
import { ZRCAppGlobalStyles } from '../styles/ZRCAppGlobalStyles';
import ZRCAppBulkTaskActionsBar from './ZRCAppBulkTaskActionsBar';
import ZRCAppHomeDashboardSection from './ZRCAppHomeDashboardSection';
import ZRCAppMenuCalendarSection from './ZRCAppMenuCalendarSection';
import ZRCAppMessagesPageSection from './ZRCAppMessagesPageSection';
import ZRCAppModalLayer from './ZRCAppModalLayer';
import ZRCPremiumCursor from '../../components/common/ZRCPremiumCursor';
import ZRCAppProfilePageSection from './ZRCAppProfilePageSection';
import ZRCAppProjectWorkspaceSection from './ZRCAppProjectWorkspaceSection';
import ZRCAppShellIsMessagesOpenSection from './ZRCAppShellIsMessagesOpenSection';

export default function ZRCAppAuthenticatedShell({
    teamMembers,
    createAvatarFromName,
    renderSupabaseConnectionBadge,
    activeMenu,
    setActiveMenu,
    isPanelOpen,
    setIsPanelOpen,
    projects,
    visibleProjectNames,
    projectSettings,
    handleSidebarProjectsChange,
    setSelectedProject,
    setActiveContentMenu,
    setActiveTab,
    setPendingTeamDeleteId,
    setPendingCustomerDeleteId,
    openGlobalSearch,
    setTeamMembers,
    profileDraft,
    currentPermissions,
    currentUserRole,
    currentAccountType,
    currentUserId,
    setIsNotificationsOpen,
    setIsMessagesOpen,
    setIsGlobalSearchOpen,
    handleMainClick,
    unreadNotificationCount,
    isNotificationsOpen,
    loadActivityLogsFromSupabase,
    unreadMessageCount,
    isMessagesOpen,
    activeContentMenu,
    openMessagesPanel,
    handleLogout,
    selectedProject,
    isMobileProjectPickerOpen,
    setIsMobileProjectPickerOpen,
    boardColumns,
    normalizeColumnTitleForDisplay,
    renderProfileAvatar,
    moveMobileTaskToActiveColumn,
    setMobileTaskWizardData,
    setMobileTaskWizardStep,
    setIsMobileTaskWizardOpen,
    isMobileTaskWizardOpen,
    mobileTaskWizardStep,
    mobileTaskWizardData,
    activeTeamMembers,
    normalizeTeamRole,
    handleSaveTask,
    fixed,
    inset,
    z,
    setIsMessageTaskPickerOpen,
    Projeler,
    left,
    translate,
    w,
    bg,
    white,
    border,
    zinc,
    rounded,
    shadow,
    overflow,
    hidden,
    animate,
    fade,
    absolute,
    top,
    h,
    rotate,
    l,
    t,
    px,
    b,
    flex,
    items,
    center,
    justify,
    between,
    text,
    font,
    black,
    Mesajlar,
    mt,
    bold,
    mesaj,
    mesajlar,
    okundu,
    markAllMessagesAsRead,
    clearAllMessages,
    full,
    transition,
    all,
    Okundu,
    Yap,
    max,
    auto,
    custom,
    scrollbar,
    fbfcfd,
    messageItems,
    space,
    readMessageIds,
    handleMessageClick,
    blue,
    start,
    gap,
    shrink,
    currentProfileInitials,
    min,
    truncate,
    Mesaj,
    clamp,
    getProjectMessageDateLabel,
    col,
    mb,
    none,
    currentColor,
    round,
    M8,
    M21,
    yok,
    proje,
    yaz,
    handleSendProjectMessage,
    relative,
    selectedMessageTask,
    Genel,
    M6,
    isMessageTaskPickerOpen,
    right,
    bottom,
    setMessageLinkedTaskId,
    messageLinkedTaskId,
    messageTaskOptions,
    end,
    messageDraft,
    setMessageDraft,
    Enter,
    Proje,
    resize,
    py,
    outline,
    submit,
    cursor,
    not,
    allowed,
    Bildirim,
    Bildirimler,
    Yenile,
    d,
    event,
    fill,
    handleNotificationClick,
    isRead,
    markAllNotificationsAsRead,
    notification,
    notificationEmptyDescription,
    notificationItems,
    notificationPanelSummary,
    onClick,
    readNotificationIds,
    stroke,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth,
    viewBox,
    yap,
    isGlobalSearchOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    globalSearchResults,
    navigateGlobalSearchResult,
    calendarDisplayOptions,
    calendarFocusedDate,
    calendarGridDays,
    calendarHeaderTitle,
    calendarMonthDate,
    calendarView,
    calendarWeekDays,
    changeCalendarView,
    createQuickNoteFromHome,
    deleteQuickNoteFromHome,
    editingQuickNoteId,
    formatMenuCalendarTaskTime,
    formatMenuCalendarWeekHeader,
    getMenuCalendarAllDayTasks,
    getMenuCalendarTasksForDay,
    getMenuCalendarTasksForHour,
    getPremiumCalendarDotStyle,
    getPremiumCalendarTaskStyle,
    goToNextCalendarPeriod,
    goToPreviousCalendarPeriod,
    homeAssignedTasks,
    isCalendarDisplayMenuOpen,
    isQuickNoteComposerOpen,
    isQuickNoteSearchOpen,
    isSameCalendarDay,
    menuCalendarHours,
    menuCalendarListGroups,
    openHomeCalendarQuickTaskForDate,
    openHomeTaskDetail,
    openMenuCalendarTask,
    openQuickNoteComposerForEdit,
    pendingDeleteQuickNoteId,
    quickNoteDraft,
    quickNoteSearch,
    quickNoteTitleDraft,
    quickNotes,
    resetQuickNoteComposer,
    setCalendarDisplayOptions,
    setIsCalendarDisplayMenuOpen,
    setIsQuickNoteComposerOpen,
    setIsQuickNoteSearchOpen,
    setPendingDeleteQuickNoteId,
    setQuickNoteDraft,
    setQuickNoteSearch,
    setQuickNoteTitleDraft,
    todayStart,
    getMenuCalendarHolidayLabel,
    handleCalendarDayClick,
    isMenuCalendarFilterOpen,
    isMenuCalendarStatusOpen,
    menuCalendarStatusFilter,
    menuCalendarStatusOptions,
    openMenuCalendarQuickTask,
    setCalendarFocusedDate,
    setCalendarMonthDate,
    setCalendarView,
    setIsMenuCalendarFilterOpen,
    setIsMenuCalendarStatusOpen,
    setMenuCalendarStatusFilter,
    canCreateChatGroups,
    canSendSelectedChatMessage,
    chatGroupDraft,
    chatGroupSearch,
    chatPageDraft,
    createChatGroupFromPage,
    filteredChatGroups,
    handleSendChatPageMessage,
    isChatActionMenuOpen,
    isChatGroupModalOpen,
    isCurrentProfileRecord,
    isProjectMessageVisibleForCurrentUser,
    projectMessages,
    selectedChatGroup,
    selectedChatGroupId,
    selectedChatMessages,
    setChatGroupDraft,
    setChatGroupSearch,
    setChatPageDraft,
    setIsChatActionMenuOpen,
    setIsChatGroupModalOpen,
    setSelectedChatGroupId,
    activeProfileTab,
    addProfileEmailAccount,
    emailAccountDraft,
    handleProfileAvatarChange,
    markSuspiciousEventAsMine,
    pendingProfileDelete,
    profileAvatarInputRef,
    profilePreferences,
    removeProfileEmailAccount,
    removeProfileSession,
    renderProfileSelect,
    saveProfileSection,
    setActiveProfileTab,
    setEmailAccountDraft,
    setPendingProfileDelete,
    setProfileDraft,
    setProfilePreferences,
    toggleProfilePreference,
    visibleProfileTabs,
    activeTab,
    archivedTasks,
    availableProjectTeamMembers,
    copyCredentialTextForCustomer,
    copyCredentialTextForMember,
    createCustomerFromCenter,
    createTeamMemberFromCenter,
    customerDraft,
    customerLinkNoneLabel,
    customerLinkOptions,
    customerPageItems,
    customers,
    deleteCustomerFromCenter,
    deleteTeamMemberFromCenter,
    getCustomerById,
    getCustomerByName,
    getCustomerIdByName,
    getCustomerLinkedAccount,
    getCustomerNameById,
    getMemberLinkedCustomer,
    handleArchiveProject,
    handleDeleteProject,
    handleSaveProjectSettings,
    isProjectTeamPickerOpen,
    openCustomerEditModal,
    openTeamMemberEditModal,
    passiveTeamMembers,
    pendingCustomerDeleteId,
    pendingTeamDeleteId,
    projectSettingsDraft,
    renderSoftSelect,
    selectedCustomer,
    selectedProjectTeamMembers,
    selectedTeamMemberId,
    setCustomerDraft,
    setIsProjectTeamPickerOpen,
    setProjectSettingsDraft,
    setSelectedCustomerId,
    setSelectedTeamMemberId,
    setTeamMemberDraft,
    showCustomerManagementPage,
    showProjectSettingsControls,
    showTeamManagementPage,
    teamMemberDraft,
    toggleTeamMemberStatus,
    visibleProjectTabs,
    zrcFeatureSpreadProps,
    boardView,
    handleBulkArchive,
    handleBulkDelete,
    selectedTasks,
    setSelectedTasks,
    addTaskComment,
    calendarNewTaskDate,
    calendarTaskModalContext,
    canCurrentUserModifyTask,
    changeCalendarTaskModalProject,
    closeCustomerEditModal,
    closeTaskDetail,
    closeTeamMemberEditModal,
    currentActorAvatar,
    currentActorId,
    currentActorName,
    currentCustomerKeys,
    customerEditDraft,
    deleteTaskComment,
    deleteTaskStoredFileFromSupabase,
    detailTaskInfo,
    downloadTaskFileFromSupabase,
    editTaskFromDetail,
    editingColumn,
    editingCustomer,
    editingTask,
    editingTeamMember,
    getProjectNameForTask,
    handleSaveStage,
    isStageModalOpen,
    isTaskModalOpen,
    saveCustomerEdit,
    saveTeamMemberEdit,
    setCalendarNewTaskDate,
    setCalendarTaskModalContext,
    setCustomerEditDraft,
    setEditingColumn,
    setEditingTask,
    setIsStageModalOpen,
    setIsTaskModalOpen,
    setTeamMemberEditDraft,
    taskModalTeamMembers,
    teamMemberEditDraft,
    updateTaskFromDetail,
    uploadTaskFilesToSupabase
}) {
  const getMobileTaskCardAssignees = (task = {}) =>
    resolveMobileTaskCardAssignees(task, teamMembers, createAvatarFromName);

  return (<div className="min-h-screen flex bg-[#f5f6f8] antialiased selection:bg-[#ff3600] overflow-x-hidden relative font-[Inter]">
      <ZRCAppGlobalStyles />
      <ZRCPremiumCursor />
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
          clearAllMessages={typeof clearAllMessages !== 'undefined' ? clearAllMessages : undefined}
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

        <ZRCAppShellAutoUiBlock01
        Bildirim={typeof Bildirim !== 'undefined' ? Bildirim : undefined}
        Bildirimler={typeof Bildirimler !== 'undefined' ? Bildirimler : undefined}
        Yenile={typeof Yenile !== 'undefined' ? Yenile : undefined}
        activeContentMenu={typeof activeContentMenu !== 'undefined' ? activeContentMenu : undefined}
        currentAccountType={typeof currentAccountType !== 'undefined' ? currentAccountType : undefined}
        currentProfileInitials={typeof currentProfileInitials !== 'undefined' ? currentProfileInitials : undefined}
        d={typeof d !== 'undefined' ? d : undefined}
        event={typeof event !== 'undefined' ? event : undefined}
        fill={typeof fill !== 'undefined' ? fill : undefined}
        handleNotificationClick={typeof handleNotificationClick !== 'undefined' ? handleNotificationClick : undefined}
        isNotificationsOpen={typeof isNotificationsOpen !== 'undefined' ? isNotificationsOpen : undefined}
        isRead={typeof isRead !== 'undefined' ? isRead : undefined}
        loadActivityLogsFromSupabase={typeof loadActivityLogsFromSupabase !== 'undefined' ? loadActivityLogsFromSupabase : undefined}
        markAllNotificationsAsRead={typeof markAllNotificationsAsRead !== 'undefined' ? markAllNotificationsAsRead : undefined}
        notification={typeof notification !== 'undefined' ? notification : undefined}
        notificationEmptyDescription={typeof notificationEmptyDescription !== 'undefined' ? notificationEmptyDescription : undefined}
        notificationItems={typeof notificationItems !== 'undefined' ? notificationItems : undefined}
        notificationPanelSummary={typeof notificationPanelSummary !== 'undefined' ? notificationPanelSummary : undefined}
        okundu={typeof okundu !== 'undefined' ? okundu : undefined}
        onClick={typeof onClick !== 'undefined' ? onClick : undefined}
        readNotificationIds={typeof readNotificationIds !== 'undefined' ? readNotificationIds : undefined}
        renderProfileAvatar={typeof renderProfileAvatar !== 'undefined' ? renderProfileAvatar : undefined}
        stroke={typeof stroke !== 'undefined' ? stroke : undefined}
        strokeLinecap={typeof strokeLinecap !== 'undefined' ? strokeLinecap : undefined}
        strokeLinejoin={typeof strokeLinejoin !== 'undefined' ? strokeLinejoin : undefined}
        strokeWidth={typeof strokeWidth !== 'undefined' ? strokeWidth : undefined}
        unreadNotificationCount={typeof unreadNotificationCount !== 'undefined' ? unreadNotificationCount : undefined}
        viewBox={typeof viewBox !== 'undefined' ? viewBox : undefined}
        yap={typeof yap !== 'undefined' ? yap : undefined}
        yok={typeof yok !== 'undefined' ? yok : undefined}
      />

        <ZRCAppShellGlobalSearchBlock
        isGlobalSearchOpen={isGlobalSearchOpen}
        setIsGlobalSearchOpen={setIsGlobalSearchOpen}
        globalSearchQuery={globalSearchQuery}
        setGlobalSearchQuery={setGlobalSearchQuery}
        globalSearchResults={globalSearchResults}
        navigateGlobalSearchResult={navigateGlobalSearchResult}
      />

        {activeContentMenu === 'Ana Sayfa' ? (
          <ZRCAppHomeDashboardSection
            calendarDisplayOptions={calendarDisplayOptions}
            calendarFocusedDate={calendarFocusedDate}
            calendarGridDays={calendarGridDays}
            calendarHeaderTitle={calendarHeaderTitle}
            calendarMonthDate={calendarMonthDate}
            calendarView={calendarView}
            calendarWeekDays={calendarWeekDays}
            changeCalendarView={changeCalendarView}
            createQuickNoteFromHome={createQuickNoteFromHome}
            deleteQuickNoteFromHome={deleteQuickNoteFromHome}
            editingQuickNoteId={editingQuickNoteId}
            formatMenuCalendarTaskTime={formatMenuCalendarTaskTime}
            formatMenuCalendarWeekHeader={formatMenuCalendarWeekHeader}
            getMenuCalendarAllDayTasks={getMenuCalendarAllDayTasks}
            getMenuCalendarTasksForDay={getMenuCalendarTasksForDay}
            getMenuCalendarTasksForHour={getMenuCalendarTasksForHour}
            getPremiumCalendarDotStyle={getPremiumCalendarDotStyle}
            getPremiumCalendarTaskStyle={getPremiumCalendarTaskStyle}
            goToNextCalendarPeriod={goToNextCalendarPeriod}
            goToPreviousCalendarPeriod={goToPreviousCalendarPeriod}
            homeAssignedTasks={homeAssignedTasks}
            isCalendarDisplayMenuOpen={isCalendarDisplayMenuOpen}
            isQuickNoteComposerOpen={isQuickNoteComposerOpen}
            isQuickNoteSearchOpen={isQuickNoteSearchOpen}
            isSameCalendarDay={isSameCalendarDay}
            menuCalendarHours={menuCalendarHours}
            menuCalendarListGroups={menuCalendarListGroups}
            openHomeCalendarQuickTaskForDate={openHomeCalendarQuickTaskForDate}
            openHomeTaskDetail={openHomeTaskDetail}
            openMenuCalendarTask={openMenuCalendarTask}
            openQuickNoteComposerForEdit={openQuickNoteComposerForEdit}
            pendingDeleteQuickNoteId={pendingDeleteQuickNoteId}
            quickNoteDraft={quickNoteDraft}
            quickNoteSearch={quickNoteSearch}
            quickNoteTitleDraft={quickNoteTitleDraft}
            quickNotes={quickNotes}
            resetQuickNoteComposer={resetQuickNoteComposer}
            setActiveContentMenu={setActiveContentMenu}
            setActiveMenu={setActiveMenu}
            setActiveTab={setActiveTab}
            setCalendarDisplayOptions={setCalendarDisplayOptions}
            setIsCalendarDisplayMenuOpen={setIsCalendarDisplayMenuOpen}
            setIsQuickNoteComposerOpen={setIsQuickNoteComposerOpen}
            setIsQuickNoteSearchOpen={setIsQuickNoteSearchOpen}
            setPendingDeleteQuickNoteId={setPendingDeleteQuickNoteId}
            setQuickNoteDraft={setQuickNoteDraft}
            setQuickNoteSearch={setQuickNoteSearch}
            setQuickNoteTitleDraft={setQuickNoteTitleDraft}
            todayStart={todayStart}
          />
        ) : activeContentMenu === 'Takvimim' ? (
          <ZRCAppMenuCalendarSection
            calendarDisplayOptions={calendarDisplayOptions}
            calendarFocusedDate={calendarFocusedDate}
            calendarGridDays={calendarGridDays}
            calendarHeaderTitle={calendarHeaderTitle}
            calendarMonthDate={calendarMonthDate}
            calendarView={calendarView}
            calendarWeekDays={calendarWeekDays}
            formatMenuCalendarTaskTime={formatMenuCalendarTaskTime}
            formatMenuCalendarWeekHeader={formatMenuCalendarWeekHeader}
            getMenuCalendarAllDayTasks={getMenuCalendarAllDayTasks}
            getMenuCalendarHolidayLabel={getMenuCalendarHolidayLabel}
            getMenuCalendarTasksForDay={getMenuCalendarTasksForDay}
            getMenuCalendarTasksForHour={getMenuCalendarTasksForHour}
            getPremiumCalendarDotStyle={getPremiumCalendarDotStyle}
            getPremiumCalendarTaskStyle={getPremiumCalendarTaskStyle}
            goToNextCalendarPeriod={goToNextCalendarPeriod}
            goToPreviousCalendarPeriod={goToPreviousCalendarPeriod}
            handleCalendarDayClick={handleCalendarDayClick}
            isMenuCalendarFilterOpen={isMenuCalendarFilterOpen}
            isMenuCalendarStatusOpen={isMenuCalendarStatusOpen}
            isSameCalendarDay={isSameCalendarDay}
            menuCalendarHours={menuCalendarHours}
            menuCalendarListGroups={menuCalendarListGroups}
            menuCalendarStatusFilter={menuCalendarStatusFilter}
            menuCalendarStatusOptions={menuCalendarStatusOptions}
            openHomeCalendarQuickTaskForDate={openHomeCalendarQuickTaskForDate}
            openMenuCalendarQuickTask={openMenuCalendarQuickTask}
            openMenuCalendarTask={openMenuCalendarTask}
            projects={projects}
            setCalendarDisplayOptions={setCalendarDisplayOptions}
            setCalendarFocusedDate={setCalendarFocusedDate}
            setCalendarMonthDate={setCalendarMonthDate}
            setCalendarView={setCalendarView}
            setIsMenuCalendarFilterOpen={setIsMenuCalendarFilterOpen}
            setIsMenuCalendarStatusOpen={setIsMenuCalendarStatusOpen}
            setMenuCalendarStatusFilter={setMenuCalendarStatusFilter}
            todayStart={todayStart}
          />
        ) : activeContentMenu === 'Yazışmalar' ? (
          <ZRCAppMessagesPageSection
            canCreateChatGroups={canCreateChatGroups}
            canSendSelectedChatMessage={canSendSelectedChatMessage}
            chatGroupDraft={chatGroupDraft}
            chatGroupSearch={chatGroupSearch}
            chatPageDraft={chatPageDraft}
            createChatGroupFromPage={createChatGroupFromPage}
            filteredChatGroups={filteredChatGroups}
            getProjectMessageDateLabel={getProjectMessageDateLabel}
            handleSendChatPageMessage={handleSendChatPageMessage}
            isChatActionMenuOpen={isChatActionMenuOpen}
            isChatGroupModalOpen={isChatGroupModalOpen}
            isCurrentProfileRecord={isCurrentProfileRecord}
            isProjectMessageVisibleForCurrentUser={isProjectMessageVisibleForCurrentUser}
            projectMessages={projectMessages}
            selectedChatGroup={selectedChatGroup}
            selectedChatGroupId={selectedChatGroupId}
            selectedChatMessages={selectedChatMessages}
            setChatGroupDraft={setChatGroupDraft}
            setChatGroupSearch={setChatGroupSearch}
            setChatPageDraft={setChatPageDraft}
            setIsChatActionMenuOpen={setIsChatActionMenuOpen}
            setIsChatGroupModalOpen={setIsChatGroupModalOpen}
            setSelectedChatGroupId={setSelectedChatGroupId}
          />
        ) : activeContentMenu === 'Profil' ? (
          <ZRCAppProfilePageSection
            activeProfileTab={activeProfileTab}
            addProfileEmailAccount={addProfileEmailAccount}
            emailAccountDraft={emailAccountDraft}
            handleLogout={handleLogout}
            handleProfileAvatarChange={handleProfileAvatarChange}
            markSuspiciousEventAsMine={markSuspiciousEventAsMine}
            pendingProfileDelete={pendingProfileDelete}
            profileAvatarInputRef={profileAvatarInputRef}
            profileDraft={profileDraft}
            profilePreferences={profilePreferences}
            removeProfileEmailAccount={removeProfileEmailAccount}
            removeProfileSession={removeProfileSession}
            renderProfileSelect={renderProfileSelect}
            saveProfileSection={saveProfileSection}
            setActiveProfileTab={setActiveProfileTab}
            setEmailAccountDraft={setEmailAccountDraft}
            setPendingProfileDelete={setPendingProfileDelete}
            setProfileDraft={setProfileDraft}
            setProfilePreferences={setProfilePreferences}
            toggleProfilePreference={toggleProfilePreference}
            visibleProfileTabs={visibleProfileTabs}
          />
        ) : (activeContentMenu === 'Projeler' || activeContentMenu === 'Diğer') ? (
          <ZRCAppProjectWorkspaceSection
            activeContentMenu={activeContentMenu}
            activeTab={activeTab}
            activeTeamMembers={activeTeamMembers}
            archivedTasks={archivedTasks}
            availableProjectTeamMembers={availableProjectTeamMembers}
            boardColumns={boardColumns}
            copyCredentialTextForCustomer={copyCredentialTextForCustomer}
            copyCredentialTextForMember={copyCredentialTextForMember}
            createCustomerFromCenter={createCustomerFromCenter}
            createTeamMemberFromCenter={createTeamMemberFromCenter}
            currentPermissions={currentPermissions}
            currentUserRole={currentUserRole}
            customerDraft={customerDraft}
            customerLinkNoneLabel={customerLinkNoneLabel}
            customerLinkOptions={customerLinkOptions}
            customerPageItems={customerPageItems}
            customers={customers}
            deleteCustomerFromCenter={deleteCustomerFromCenter}
            deleteTeamMemberFromCenter={deleteTeamMemberFromCenter}
            getCustomerById={getCustomerById}
            getCustomerByName={getCustomerByName}
            getCustomerIdByName={getCustomerIdByName}
            getCustomerLinkedAccount={getCustomerLinkedAccount}
            getCustomerNameById={getCustomerNameById}
            getMemberLinkedCustomer={getMemberLinkedCustomer}
            handleArchiveProject={handleArchiveProject}
            handleDeleteProject={handleDeleteProject}
            handleSaveProjectSettings={handleSaveProjectSettings}
            isProjectTeamPickerOpen={isProjectTeamPickerOpen}
            openCustomerEditModal={openCustomerEditModal}
            openTeamMemberEditModal={openTeamMemberEditModal}
            passiveTeamMembers={passiveTeamMembers}
            pendingCustomerDeleteId={pendingCustomerDeleteId}
            pendingTeamDeleteId={pendingTeamDeleteId}
            projectSettingsDraft={projectSettingsDraft}
            renderSoftSelect={renderSoftSelect}
            selectedCustomer={selectedCustomer}
            selectedProject={selectedProject}
            selectedProjectTeamMembers={selectedProjectTeamMembers}
            selectedTeamMemberId={selectedTeamMemberId}
            setActiveTab={setActiveTab}
            setCustomerDraft={setCustomerDraft}
            setIsProjectTeamPickerOpen={setIsProjectTeamPickerOpen}
            setProjectSettingsDraft={setProjectSettingsDraft}
            setSelectedCustomerId={setSelectedCustomerId}
            setSelectedTeamMemberId={setSelectedTeamMemberId}
            setTeamMemberDraft={setTeamMemberDraft}
            showCustomerManagementPage={showCustomerManagementPage}
            showProjectSettingsControls={showProjectSettingsControls}
            showTeamManagementPage={showTeamManagementPage}
            teamMemberDraft={teamMemberDraft}
            teamMembers={teamMembers}
            toggleTeamMemberStatus={toggleTeamMemberStatus}
            visibleProjectTabs={visibleProjectTabs}
            zrcFeatureSpreadProps={zrcFeatureSpreadProps}
          />
        ) : (
          <div className="w-full min-h-screen flex flex-col items-center justify-center text-center animate-fade-in p-8 bg-[#f5f6f8]">
            <h2 className="text-[15px] font-black text-zinc-700 tracking-tight select-none">Bu Sayfa Boş</h2>
          </div>
        )}

          <ZRCAppBulkTaskActionsBar
            activeContentMenu={activeContentMenu}
            boardView={boardView}
            currentPermissions={currentPermissions}
            handleBulkArchive={handleBulkArchive}
            handleBulkDelete={handleBulkDelete}
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
          />
      </main>

          <ZRCAppModalLayer
            addTaskComment={addTaskComment}
            boardColumns={boardColumns}
            calendarNewTaskDate={calendarNewTaskDate}
            calendarTaskModalContext={calendarTaskModalContext}
            canCurrentUserModifyTask={canCurrentUserModifyTask}
            changeCalendarTaskModalProject={changeCalendarTaskModalProject}
            closeCustomerEditModal={closeCustomerEditModal}
            closeTaskDetail={closeTaskDetail}
            closeTeamMemberEditModal={closeTeamMemberEditModal}
            currentAccountType={currentAccountType}
            currentActorAvatar={currentActorAvatar}
            currentActorId={currentActorId}
            currentActorName={currentActorName}
            currentCustomerKeys={currentCustomerKeys}
            currentPermissions={currentPermissions}
            customerEditDraft={customerEditDraft}
            customerLinkNoneLabel={customerLinkNoneLabel}
            customerLinkOptions={customerLinkOptions}
            customers={customers}
            deleteTaskComment={deleteTaskComment}
            deleteTaskStoredFileFromSupabase={deleteTaskStoredFileFromSupabase}
            detailTaskInfo={detailTaskInfo}
            downloadTaskFileFromSupabase={downloadTaskFileFromSupabase}
            editTaskFromDetail={editTaskFromDetail}
            editingColumn={editingColumn}
            editingCustomer={editingCustomer}
            editingTask={editingTask}
            editingTeamMember={editingTeamMember}
            getCustomerById={getCustomerById}
            getCustomerIdByName={getCustomerIdByName}
            getCustomerNameById={getCustomerNameById}
            getProjectNameForTask={getProjectNameForTask}
            handleSaveStage={handleSaveStage}
            handleSaveTask={handleSaveTask}
            isStageModalOpen={isStageModalOpen}
            isTaskModalOpen={isTaskModalOpen}
            renderSoftSelect={renderSoftSelect}
            saveCustomerEdit={saveCustomerEdit}
            saveTeamMemberEdit={saveTeamMemberEdit}
            selectedProject={selectedProject}
            setCalendarNewTaskDate={setCalendarNewTaskDate}
            setCalendarTaskModalContext={setCalendarTaskModalContext}
            setCustomerEditDraft={setCustomerEditDraft}
            setEditingColumn={setEditingColumn}
            setEditingTask={setEditingTask}
            setIsStageModalOpen={setIsStageModalOpen}
            setIsTaskModalOpen={setIsTaskModalOpen}
            setTeamMemberEditDraft={setTeamMemberEditDraft}
            taskModalTeamMembers={taskModalTeamMembers}
            teamMemberEditDraft={teamMemberEditDraft}
            updateTaskFromDetail={updateTaskFromDetail}
            uploadTaskFilesToSupabase={uploadTaskFilesToSupabase}
            visibleProjectNames={visibleProjectNames}
          />
    </div>);
}
