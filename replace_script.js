const fs = require('fs');
const filePath = 'src/app/ZRCAppShell.jsx';
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Import statements at line 131 (0-indexed 130)
const imports = `import ZRCAppShellActiveProfileTabHesapBlock from './blocks/ZRCAppShellActiveProfileTabHesapBlock';
import ZRCAppShellActiveProfileTabProjeAyarlariBlock from './blocks/ZRCAppShellActiveProfileTabProjeAyarlariBlock';
import CustomerEditModal from '../features/customers/components/CustomerEditModal';
import TeamMemberEditModal from '../features/team/components/TeamMemberEditModal';`;
lines[130] = imports;

// Proje Ayarlari: 15564 to 15912 -> indices 15563 to 15911
const projeAyarlari = `                <ZRCAppShellActiveProfileTabProjeAyarlariBlock
                  activeTab={activeTab}
                  showProjectSettingsControls={showProjectSettingsControls}
                  projectSettingsDraft={projectSettingsDraft}
                  setProjectSettingsDraft={setProjectSettingsDraft}
                  customers={customers}
                  getCustomerByName={getCustomerByName}
                  renderSoftSelect={renderSoftSelect}
                  selectedProjectTeamMembers={selectedProjectTeamMembers}
                  currentPermissions={currentPermissions}
                  setIsProjectTeamPickerOpen={setIsProjectTeamPickerOpen}
                  isProjectTeamPickerOpen={isProjectTeamPickerOpen}
                  availableProjectTeamMembers={availableProjectTeamMembers}
                  renderProfileAvatar={renderProfileAvatar}
                  createAvatarFromName={createAvatarFromName}
                  createUsernameFromMember={createUsernameFromMember}
                  handleArchiveProject={handleArchiveProject}
                  handleDeleteProject={handleDeleteProject}
                  handleSaveProjectSettings={handleSaveProjectSettings}
                  boardColumns={boardColumns}
                  archivedTasks={archivedTasks}
                />`;

// Kişi Düzenle: 15949 to 16072 -> indices 15948 to 16071
const kisiDuzenle = `      <TeamMemberEditModal
        editingTeamMember={editingTeamMember}
        closeTeamMemberEditModal={closeTeamMemberEditModal}
        saveTeamMemberEdit={saveTeamMemberEdit}
        teamMemberEditDraft={teamMemberEditDraft}
        setTeamMemberEditDraft={setTeamMemberEditDraft}
        normalizeCredentialText={normalizeCredentialText}
        getCustomerNameById={getCustomerNameById}
        teamRoleOptions={teamRoleOptions}
        renderSoftSelect={renderSoftSelect}
        customerLinkNoneLabel={customerLinkNoneLabel}
        customerLinkOptions={customerLinkOptions}
        getCustomerIdByName={getCustomerIdByName}
        getCustomerById={getCustomerById}
      />`;

// Müşteri Düzenle: 16074 to 16149 -> indices 16073 to 16148
const musteriDuzenle = `      <CustomerEditModal
        editingCustomer={editingCustomer}
        closeCustomerEditModal={closeCustomerEditModal}
        saveCustomerEdit={saveCustomerEdit}
        customerEditDraft={customerEditDraft}
        setCustomerEditDraft={setCustomerEditDraft}
      />`;

// Replace bottom to top to avoid shifting indices
lines.splice(16073, 16148 - 16073 + 1, musteriDuzenle);
lines.splice(15948, 16071 - 15948 + 1, kisiDuzenle);
lines.splice(15563, 15911 - 15563 + 1, projeAyarlari);

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Done!');
