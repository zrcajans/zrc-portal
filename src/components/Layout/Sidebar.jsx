import React, { useRef } from 'react';

function Sidebar({
  activeMenu,
  setActiveMenu,
  isPanelOpen,
  setIsPanelOpen,
  projects,
  visibleProjects,
  setProjects,
  setSelectedProject,
  onSearchClick,
  teamMembers = [],
  onProjectMenuSelect,
  profileDraft,
  permissions,
  currentUserRole,
  currentAccountType,
  onProfileSelect,
  onSimpleMenuSelect,
  onOtherSectionSelect
}) {
  const panelRef = useRef(null);
  const projectsButtonRef = useRef(null);
  const otherButtonRef = useRef(null);

  const profileInitials = `${profileDraft?.firstName?.[0] || 'E'}${profileDraft?.lastName?.[0] || 'Z'}`.toUpperCase();

  const isProjectsPanelOpen = activeMenu === 'Projeler' && isPanelOpen;
  const isOtherPanelOpen = activeMenu === 'Diğer' && isPanelOpen;
  const activeTeamCount = teamMembers.filter((member) => member.status !== 'Pasif').length;
  const canCreateProject = permissions?.manageProjects !== false;
  const projectList = Array.isArray(visibleProjects) ? visibleProjects : projects;

  const handleCreateProject = () => {
    if (!canCreateProject) {
      alert('Yeni proje oluşturma yetkisi sadece Yönetici rolünde var.');
      return;
    }

    const projectName = prompt('Yeni Proje Adını Girin:');
    const cleanName = projectName?.trim();

    if (!cleanName) return;

    if (projects.some((project) => project.toLowerCase() === cleanName.toLowerCase())) {
      alert('Bu isimde bir proje zaten var.');
      return;
    }

    setProjects((prevProjects) => [...prevProjects, cleanName]);
    setSelectedProject(cleanName);
    setActiveMenu('Projeler');
    setIsPanelOpen(false);
  };

  const openOtherPage = (section) => {
    onOtherSectionSelect?.(section);
    setActiveMenu('Diğer');
    setIsPanelOpen(false);
  };

  const menuItems = [
    { id: 'Ana Sayfa', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
    { id: 'Projeler', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" /></svg> },
    { id: 'Takvimim', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> },
    { id: 'Yazışmalar', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.148.152.203.372.145.576l-.647 2.264a.75.75 0 00.942.924l2.3-.657a.75.75 0 01.58.103A8.96 8.96 0 0012 20.25z" /></svg> },
    { id: 'Diğer', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm10.5 0A2.25 2.25 0 0116.5 3.75h2.25A2.25 2.25 0 0121 6v2.25a2.25 2.25 0 01-2.25 2.25h-2.25A2.25 2.25 0 0114.25 8.25V6zM3.75 16.5A2.25 2.25 0 016 14.25h2.25A2.25 2.25 0 0110.5 16.5v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zm10.5 0A2.25 2.25 0 0116.5 14.25h2.25A2.25 2.25 0 0121 16.5v2.25A2.25 2.25 0 0118.75 21h-2.25A2.25 2.25 0 0114.25 18.75v-2.25z" /></svg> },
    { id: 'Arama', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.488 0 0010.607 10.607z" /></svg> },
  ];

  const allowedMenusByRole = {
    Yönetici: ['Ana Sayfa', 'Projeler', 'Takvimim', 'Yazışmalar', 'Diğer', 'Arama'],
    'Ekip Üyesi': ['Ana Sayfa', 'Projeler', 'Takvimim', 'Yazışmalar', 'Arama'],
    'Müşteri/Misafir': ['Ana Sayfa', 'Projeler', 'Yazışmalar', 'Arama']
  };

  const visibleMenuItems = menuItems.filter((item) =>
    (allowedMenusByRole[currentUserRole] || allowedMenusByRole['Ekip Üyesi']).includes(item.id)
  );

  return (
    <>
      {(isProjectsPanelOpen || isOtherPanelOpen) && (
        <div
          onClick={() => setIsPanelOpen(false)}
          className="fixed inset-0 bg-slate-950/6 z-[250] animate-overlay-in"
        />
      )}

      <aside className="w-[96px] h-screen bg-[#f5f6f8] flex flex-col items-center justify-center shrink-0 z-[300] fixed top-0 left-0 pointer-events-none">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-[72px] rounded-[26px] bg-transparent px-0 py-0 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              setIsPanelOpen(false);
              onProfileSelect?.();
            }}
            title={`${profileDraft?.firstName || 'Enes'} ${profileDraft?.lastName || 'Zariç'}`}
            className={`group relative w-[64px] h-[52px] rounded-[18px] flex items-center justify-center cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden ${
              activeMenu === 'Profil'
                ? 'bg-[#ff3600] text-white shadow-[0_14px_26px_rgba(255,54,0,0.26)] scale-[1.03]'
                : 'bg-white text-[#ff3600] border border-slate-200 shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:scale-105 hover:shadow-[0_14px_28px_rgba(255,54,0,0.14)]'
            }`}
          >
            {profileDraft?.avatarDataUrl ? (
              <img
                src={profileDraft.avatarDataUrl}
                alt="Profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[12px] font-black tracking-[-0.04em]">{profileInitials}</span>
            )}
            <span className="absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_22px_rgba(255,54,0,0.18)]" />
          </button>

          <div className="my-3" />

          <nav className="flex flex-col items-center gap-2 relative">
            {visibleMenuItems.map((item) => {
              const isActive = activeMenu === item.id;
              const isProjectsBtn = item.id === 'Projeler';
              const isOtherBtn = item.id === 'Diğer';
              const isSearchBtn = item.id === 'Arama';

              return (
                <button
                  key={item.id}
                  ref={isProjectsBtn ? projectsButtonRef : isOtherBtn ? otherButtonRef : null}
                  onClick={() => {
                    if (isProjectsBtn) {
                      onProjectMenuSelect?.();

                      if (activeMenu === 'Projeler') {
                        setIsPanelOpen(!isPanelOpen);
                      } else {
                        setActiveMenu('Projeler');
                        setIsPanelOpen(true);
                      }
                      return;
                    }

                    if (isOtherBtn) {
                      if (activeMenu === 'Diğer') {
                        setIsPanelOpen(!isPanelOpen);
                      } else {
                        setActiveMenu('Diğer');
                        setIsPanelOpen(true);
                      }
                      return;
                    }

                    if (isSearchBtn) {
                      setActiveMenu('Arama');
                      setIsPanelOpen(false);
                      onSearchClick?.();
                      return;
                    }

                    setActiveMenu(item.id);
                    setIsPanelOpen(false);
                    onSimpleMenuSelect?.(item.id);
                  }}
                  className={`group relative w-[64px] min-h-[56px] rounded-[18px] flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isActive
                      ? 'bg-[#ff3600] text-white scale-[1.03] shadow-[0_13px_26px_rgba(255,54,0,0.25)]'
                      : 'bg-white text-slate-500 border border-slate-200 shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:text-[#ff3600] hover:scale-[1.05] hover:bg-white hover:border-[#ff3600]/18 hover:shadow-[0_13px_26px_rgba(255,54,0,0.12)]'
                  }`}
                  aria-label={item.id}
                  title={item.id}
                >
                  <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_6px_rgba(255,54,0,0.30)]">
                    {item.icon}
                  </span>
                  <span className={`relative z-10 max-w-[58px] truncate text-[8.8px] leading-none tracking-tight select-none ${isActive ? 'font-black text-white' : 'font-extrabold text-slate-500 group-hover:text-[#ff3600]'}`}>
                    {item.id}
                  </span>

                  {isActive && (
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-[#ff3600] shadow-[0_0_12px_rgba(255,54,0,0.38)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div
          ref={panelRef}
          onClick={(event) => event.stopPropagation()}
          className={`absolute left-[96px] pointer-events-auto bg-white border border-slate-200 shadow-[22px_18px_55px_rgba(15,23,42,0.14)] flex flex-col z-[360] mac-genie-panel overflow-hidden ${
            isProjectsPanelOpen || isOtherPanelOpen ? 'genie-expanded' : 'genie-collapsed'
          } ${
            isOtherPanelOpen
              ? 'top-1/2 -translate-y-1/2 h-[274px] w-[310px] rounded-[24px]'
              : 'top-3 bottom-3 w-[340px] rounded-[26px]'
          }`}
        >
          {isProjectsPanelOpen && (
            <div className="p-5 flex flex-col h-full">
              <div className="mb-4 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-[15px] font-black text-slate-900 tracking-tight">Proje Havuzu</h2>
                  <div className="mt-0.5 text-[10px] font-bold text-slate-400">Aktif projeler</div>
                </div>
                <span className="text-[11px] font-black text-[#ff3600] bg-[#fff3ef] border border-[#ff3600]/10 px-2 py-1 rounded-full">
                  {projectList.length} Başlık
                </span>
              </div>

              <div className="mb-3 h-9 px-3 rounded-[13px] bg-slate-50 border border-slate-100 flex items-center justify-between text-[9px] font-black text-slate-400">
                <span>Aktif Rol</span>
                <span className="text-[#ff3600]">{currentAccountType || currentUserRole || 'Patron'}</span>
              </div>

              <button onClick={handleCreateProject} className={`w-full text-white text-[12.5px] font-extrabold py-2.5 px-4 rounded-[14px] active:scale-[0.98] transition-all duration-150 flex items-center justify-center space-x-2 shrink-0 mb-4 ${canCreateProject ? 'bg-[#ff3600] hover:bg-[#e03000] shadow-[0_14px_28px_rgba(255,54,0,0.22)]' : 'bg-slate-300 cursor-not-allowed'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>{canCreateProject ? 'Yeni Proje Oluştur' : 'Sadece Yönetici Proje Açabilir'}</span>
              </button>

              <div className="w-full h-[1px] bg-slate-100 mb-3 shrink-0" />

              <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 custom-scrollbar">
                {projectList.length === 0 && (
                  <div className="rounded-[16px] border border-slate-200 bg-slate-50 px-3 py-4 text-center">
                    <div className="text-[11px] font-black text-slate-500">Görünür proje yok</div>
                    <div className="mt-1 text-[9.5px] font-bold text-slate-400 leading-4">
                      Bu hesap için atanmış veya müşteriyle eşleşen proje bulunmuyor.
                    </div>
                  </div>
                )}

                {projectList.map((project, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedProject(project);
                      setIsPanelOpen(false);
                    }}
                    className="w-full p-3 bg-white border border-slate-200/70 rounded-[15px] hover:border-[#ff3600]/20 hover:bg-[#fff8f6] cursor-pointer transition-all duration-200 group flex items-center justify-between shadow-[0_7px_20px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div className="w-8 h-8 rounded-[12px] bg-[#fff3ef] flex items-center justify-center text-[#ff3600] shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0A2.25 2.25 0 004.5 15h15a2.25 2.25 0 002.25-2.25m-19.5 0v.25A2.25 2.25 0 004.5 17.5h15a2.25 2.25 0 002.25-2.25v-.25m-16.5-10.5h3.934a1.5 1.5 0 011.06.44l1.414 1.414a1.5 1.5 0 001.06.44H19.5A2.25 2.25 0 0121.75 9v.75H2.25V6.75z" />
                        </svg>
                      </div>
                      <span className="text-[12px] font-bold text-slate-700 truncate group-hover:text-slate-900">
                        {project}
                      </span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 ml-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {isOtherPanelOpen && (
            <div className="h-full bg-white p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[14px] font-black text-slate-900">Diğer</div>
                  <div className="mt-0.5 text-[10px] font-bold text-slate-400">
                    Bir alan seç · {activeTeamCount} aktif kişi
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPanelOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-white transition-all flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => openOtherPage('Ekip')}
                  className="w-full h-[82px] rounded-[18px] border border-slate-200 bg-white hover:bg-[#fff8f6] hover:border-[#ff3600]/20 transition-all px-4 flex items-center gap-3 text-left shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                >
                  <div className="w-11 h-11 rounded-[15px] bg-[#fff3ef] text-[#ff3600] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 7.5a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-black text-slate-800">Ekip</div>
                    <div className="mt-0.5 text-[10px] font-bold text-slate-400 truncate">
                      Kişiler ve görev üyeleri
                    </div>
                  </div>

                  <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => openOtherPage('Müşteriler')}
                  className="w-full h-[82px] rounded-[18px] border border-slate-200 bg-white hover:bg-[#fff8f6] hover:border-[#ff3600]/20 transition-all px-4 flex items-center gap-3 text-left shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                >
                  <div className="w-11 h-11 rounded-[15px] bg-[#fff3ef] text-[#ff3600] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.75l.001-.031m12 0A5.971 5.971 0 0012 15.75a5.971 5.971 0 00-6 2.969m12 0a8.966 8.966 0 00-6-2.219m0 0a8.966 8.966 0 00-6 2.219M15 11.25a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-black text-slate-800">Müşteriler</div>
                    <div className="mt-0.5 text-[10px] font-bold text-slate-400 truncate">
                      Müşteri kartları
                    </div>
                  </div>

                  <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

        </div>
      </aside>
    </>
  );
}

export default Sidebar;
