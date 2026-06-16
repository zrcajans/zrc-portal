// Profile Tab Navigation Buttons Block
// Pure JSX rendering of profile tab buttons

export default function ZRCAppShellProfileTabButtonsBlock({
  visibleProfileTabs = [],
  activeProfileTab = 'Hesap',
  setActiveProfileTab = () => {}
}) {
  return (
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
  );
}
