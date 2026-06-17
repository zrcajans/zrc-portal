import { ProfileSelect, SoftSelect } from '../../components/common/SelectControls';

export const renderZRCProfileSelect = (props, openProfileDropdown, setOpenProfileDropdown) => (
  <ProfileSelect
    {...props}
    openProfileDropdown={openProfileDropdown}
    setOpenProfileDropdown={setOpenProfileDropdown}
  />
);

export const renderZRCSoftSelect = (props, openProfileDropdown, setOpenProfileDropdown) => (
  <SoftSelect
    {...props}
    openProfileDropdown={openProfileDropdown}
    setOpenProfileDropdown={setOpenProfileDropdown}
  />
);
