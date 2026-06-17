import StageModal from '../../components/Modals/StageModal';
import TaskDetailModal from '../../components/Modals/TaskDetailModal';
import TaskModal from '../../components/Modals/TaskModal';
import { getReadableColumnColor } from '../../utils/colorHelpers';
import { normalizeCredentialText, teamRoleOptions } from '../../utils/teamHelpers';
import ZRCAppShellEditModalsBlock from '../blocks/ZRCAppShellEditModalsBlock';

export default function ZRCAppModalLayer({
  addTaskComment,
  boardColumns,
  calendarNewTaskDate,
  calendarTaskModalContext,
  canCurrentUserModifyTask,
  changeCalendarTaskModalProject,
  closeCustomerEditModal,
  closeTaskDetail,
  closeTeamMemberEditModal,
  currentAccountType,
  currentActorAvatar,
  currentActorId,
  currentActorName,
  currentCustomerKeys,
  currentPermissions,
  customerEditDraft,
  customerLinkNoneLabel,
  customerLinkOptions,
  customers,
  deleteTaskComment,
  deleteTaskStoredFileFromSupabase,
  detailTaskInfo,
  downloadTaskFileFromSupabase,
  editTaskFromDetail,
  editingColumn,
  editingCustomer,
  editingTask,
  editingTeamMember,
  getCustomerById,
  getCustomerIdByName,
  getCustomerNameById,
  getProjectNameForTask,
  handleSaveStage,
  handleSaveTask,
  isStageModalOpen,
  isTaskModalOpen,
  renderSoftSelect,
  saveCustomerEdit,
  saveTeamMemberEdit,
  selectedProject,
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
  uploadTaskFilesToSupabase,
  visibleProjectNames,
}) {
  return (
    <>
      <ZRCAppShellEditModalsBlock
        editingTeamMember={editingTeamMember}
        closeTeamMemberEditModal={closeTeamMemberEditModal}
        saveTeamMemberEdit={saveTeamMemberEdit}
        teamMemberEditDraft={teamMemberEditDraft}
        setTeamMemberEditDraft={setTeamMemberEditDraft}
        normalizeCredentialText={normalizeCredentialText}
        renderSoftSelect={renderSoftSelect}
        teamRoleOptions={teamRoleOptions}
        getCustomerNameById={getCustomerNameById}
        customerLinkNoneLabel={customerLinkNoneLabel}
        customerLinkOptions={customerLinkOptions}
        getCustomerIdByName={getCustomerIdByName}
        getCustomerById={getCustomerById}
        editingCustomer={editingCustomer}
        closeCustomerEditModal={closeCustomerEditModal}
        saveCustomerEdit={saveCustomerEdit}
        customerEditDraft={customerEditDraft}
        setCustomerEditDraft={setCustomerEditDraft}
      />

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
    </>
  );
}
