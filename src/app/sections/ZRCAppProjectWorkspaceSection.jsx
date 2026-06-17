import DosyalarScreen from '../../features/dosyalar/DosyalarScreen';
import GanttCizelgesiScreen from '../../features/gantt_cizelgesi/GanttCizelgesiScreen';
import GorevlerScreen from '../../features/gorevler/GorevlerScreen';
import RaporlarScreen from '../../features/raporlar/RaporlarScreen';
import TakvimScreen from '../../features/takvim/TakvimScreen';
import ZamanCizelgesiScreen from '../../features/zaman_cizelgesi/ZamanCizelgesiScreen';
import { createAvatarFromName, renderProfileAvatar } from '../../utils/avatarHelpers';
import { createUsernameFromMember, getAccountTypeFromRole, getTeamRoleTone, normalizeCredentialText, normalizeTeamRole, teamRoleOptions } from '../../utils/teamHelpers';
import ZRCAppShellProjectSettingsControlsBlock from '../blocks/ZRCAppShellProjectSettingsControlsBlock';
import ZRCAppShellTeamManagementPageBlock from '../blocks/ZRCAppShellTeamManagementPageBlock';
import ZRCAppShellActiveContentMenuDigerActiveTabMusterilerShowCustomerManagementPageSection from './ZRCAppShellActiveContentMenuDigerActiveTabMusterilerShowCustomerManagementPageSection';

export default function ZRCAppProjectWorkspaceSection({
  activeContentMenu,
  activeTab,
  activeTeamMembers,
  archivedTasks,
  availableProjectTeamMembers,
  boardColumns,
  copyCredentialTextForCustomer,
  copyCredentialTextForMember,
  createCustomerFromCenter,
  createTeamMemberFromCenter,
  currentPermissions,
  currentUserRole,
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
  selectedProject,
  selectedProjectTeamMembers,
  selectedTeamMemberId,
  setActiveTab,
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
  teamMembers,
  toggleTeamMemberStatus,
  visibleProjectTabs,
  zrcFeatureSpreadProps,
}) {
  return (
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
                <GorevlerScreen {...zrcFeatureSpreadProps} />



                                {/* zrc-v521-feature-takvim */}
                <TakvimScreen {...zrcFeatureSpreadProps} />


                                {/* zrc-v521-feature-zaman_cizelgesi */}
                <ZamanCizelgesiScreen {...zrcFeatureSpreadProps} />

                                {/* zrc-v521-feature-dosyalar */}
                <DosyalarScreen {...zrcFeatureSpreadProps} />



                                {/* zrc-v521-feature-gantt_cizelgesi */}
                <GanttCizelgesiScreen {...zrcFeatureSpreadProps} />


                                {/* zrc-v521-feature-raporlar */}
                <RaporlarScreen {...zrcFeatureSpreadProps} />

                <ZRCAppShellTeamManagementPageBlock
                  activeContentMenu={activeContentMenu}
                  activeTab={activeTab}
                  showTeamManagementPage={showTeamManagementPage}
                  teamMembers={teamMembers}
                  activeTeamMembers={activeTeamMembers}
                  passiveTeamMembers={passiveTeamMembers}
                  currentUserRole={currentUserRole}
                  getTeamRoleTone={getTeamRoleTone}
                  currentPermissions={currentPermissions}
                  createTeamMemberFromCenter={createTeamMemberFromCenter}
                  teamMemberDraft={teamMemberDraft}
                  setTeamMemberDraft={setTeamMemberDraft}
                  normalizeCredentialText={normalizeCredentialText}
                  getCustomerNameById={getCustomerNameById}
                  renderSoftSelect={renderSoftSelect}
                  teamRoleOptions={teamRoleOptions}
                  customerLinkNoneLabel={customerLinkNoneLabel}
                  customerLinkOptions={customerLinkOptions}
                  getCustomerIdByName={getCustomerIdByName}
                  getCustomerById={getCustomerById}
                  selectedTeamMemberId={selectedTeamMemberId}
                  pendingTeamDeleteId={pendingTeamDeleteId}
                  setSelectedTeamMemberId={setSelectedTeamMemberId}
                  copyCredentialTextForMember={copyCredentialTextForMember}
                  openTeamMemberEditModal={openTeamMemberEditModal}
                  toggleTeamMemberStatus={toggleTeamMemberStatus}
                  deleteTeamMemberFromCenter={deleteTeamMemberFromCenter}
                  renderProfileAvatar={renderProfileAvatar}
                  createAvatarFromName={createAvatarFromName}
                  normalizeTeamRole={normalizeTeamRole}
                  getMemberLinkedCustomer={getMemberLinkedCustomer}
                  getAccountTypeFromRole={getAccountTypeFromRole}
                  createUsernameFromMember={createUsernameFromMember}
                />

                                {/* zrc-v526-section-activecontentmenu-diger-activetab-musteriler-showcustomermanagementpage */}
                <ZRCAppShellActiveContentMenuDigerActiveTabMusterilerShowCustomerManagementPageSection
                  activeTab={activeTab}
                  activeContentMenu={activeContentMenu}
                  showCustomerManagementPage={showCustomerManagementPage}
                  customers={customers}
                  customerPageItems={customerPageItems}
                  createCustomerFromCenter={createCustomerFromCenter}
                  customerDraft={customerDraft}
                  setCustomerDraft={setCustomerDraft}
                  normalizeCredentialText={normalizeCredentialText}
                  selectedCustomer={selectedCustomer}
                  copyCredentialTextForCustomer={copyCredentialTextForCustomer}
                  createAvatarFromName={createAvatarFromName}
                  pendingCustomerDeleteId={pendingCustomerDeleteId}
                  setSelectedCustomerId={setSelectedCustomerId}
                  getCustomerLinkedAccount={getCustomerLinkedAccount}
                  openCustomerEditModal={openCustomerEditModal}
                  deleteCustomerFromCenter={deleteCustomerFromCenter}
                />

                <ZRCAppShellProjectSettingsControlsBlock
                  activeTab={activeTab}
                  showProjectSettingsControls={showProjectSettingsControls}
                  projectSettingsDraft={projectSettingsDraft}
                  setProjectSettingsDraft={setProjectSettingsDraft}
                  selectedProjectTeamMembers={selectedProjectTeamMembers}
                  availableProjectTeamMembers={availableProjectTeamMembers}
                  isProjectTeamPickerOpen={isProjectTeamPickerOpen}
                  setIsProjectTeamPickerOpen={setIsProjectTeamPickerOpen}
                  currentPermissions={currentPermissions}
                  customers={customers}
                  boardColumns={boardColumns}
                  archivedTasks={archivedTasks}
                  renderSoftSelect={renderSoftSelect}
                  getCustomerByName={getCustomerByName}
                  renderProfileAvatar={renderProfileAvatar}
                  createAvatarFromName={createAvatarFromName}
                  createUsernameFromMember={createUsernameFromMember}
                  handleArchiveProject={handleArchiveProject}
                  handleDeleteProject={handleDeleteProject}
                  handleSaveProjectSettings={handleSaveProjectSettings}
                />
              </div>
            </div>
          ) : (
            <div className="w-full min-h-screen flex flex-col items-center justify-center text-center animate-fade-in p-8">
              <h2 className="text-[15px] font-black text-zinc-700 tracking-tight">Görüntülenecek Proje Seçilmedi</h2>
            </div>
          )
  );
}
