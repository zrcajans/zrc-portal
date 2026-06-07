import React, { useEffect, useRef, useState } from 'react';

function Sidebar({
  activeMenu,
  setActiveMenu,
  isPanelOpen,
  setIsPanelOpen,
  projects,
  visibleProjects,
  projectSettings = {},
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
  const getProjectAccentColor = (projectName = '') =>
    projectSettings?.[projectName]?.color || '#ff3600';

  const [highlightedProject, setHighlightedProject] = useState(() => {
    try {
      const rawSelectedProject = window.localStorage.getItem('zrc-selected-project');
      if (!rawSelectedProject) return '';

      return JSON.parse(rawSelectedProject) || '';
    } catch (error) {
      return '';
    }
  });

  const activeProjectName = highlightedProject || projectList[0] || '';
  const isSidebarExpanded = isProjectsPanelOpen || isOtherPanelOpen;

  const [panelRenderState, setPanelRenderState] = useState({
    visible: false,
    open: false,
    kind: 'projects'
  });

  useEffect(() => {
    const nextKind = isOtherPanelOpen ? 'other' : isProjectsPanelOpen ? 'projects' : null;

    if (nextKind) {
      setPanelRenderState((previousState) => ({
        visible: true,
        open: false,
        kind: nextKind || previousState.kind
      }));

      const openTimer = window.setTimeout(() => {
        setPanelRenderState((previousState) => ({
          ...previousState,
          visible: true,
          open: true,
          kind: nextKind || previousState.kind
        }));
      }, 28);

      return () => window.clearTimeout(openTimer);
    }

    setPanelRenderState((previousState) => {
      if (!previousState.visible) return previousState;

      return {
        ...previousState,
        open: false
      };
    });

    const closeTimer = window.setTimeout(() => {
      setPanelRenderState((previousState) => {
        if (previousState.open) return previousState;

        return {
          ...previousState,
          visible: false
        };
      });
    }, 320);

    return () => window.clearTimeout(closeTimer);
  }, [isProjectsPanelOpen, isOtherPanelOpen]);

  const rememberSelectedProject = (projectName) => {
    const cleanProjectName = String(projectName || '').trim();
    setHighlightedProject(cleanProjectName);

    try {
      window.localStorage.setItem('zrc-selected-project', JSON.stringify(cleanProjectName));
    } catch (error) {
      // localStorage erişimi yoksa sessiz geç.
    }
  };

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
    rememberSelectedProject(cleanName);
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
    { id: 'Ana Sayfa', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
    { id: 'Projeler', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" /></svg> },
    { id: 'Takvimim', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> },
    { id: 'Yazışmalar', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.148.152.203.372.145.576l-.647 2.264a.75.75 0 00.942.924l2.3-.657a.75.75 0 01.58.103A8.96 8.96 0 0012 20.25z" /></svg> },
    { id: 'Diğer', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm10.5 0A2.25 2.25 0 0116.5 3.75h2.25A2.25 2.25 0 0121 6v2.25a2.25 2.25 0 01-2.25 2.25h-2.25A2.25 2.25 0 0114.25 8.25V6zM3.75 16.5A2.25 2.25 0 016 14.25h2.25A2.25 2.25 0 0110.5 16.5v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zm10.5 0A2.25 2.25 0 0116.5 14.25h2.25A2.25 2.25 0 0121 16.5v2.25A2.25 2.25 0 0118.75 21h-2.25A2.25 2.25 0 0114.25 18.75v-2.25z" /></svg> },
    { id: 'Arama', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.488 0 0010.607 10.607z" /></svg> },
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
      <style>
        {`
          .zrc-sidebar-panel {
            transform-origin: left center;
            transition:
              transform 0.30s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.24s ease;
            will-change: transform, opacity;
          }

          .zrc-sidebar-panel-open {
            transform: translateX(0);
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }

          .zrc-sidebar-panel-closed {
            transform: translateX(calc(-100% - 16px));
            opacity: 0;
            visibility: visible;
            pointer-events: none;
          }

          .zrc-sidebar-overlay {
            background: rgba(9, 9, 11, 0);
            backdrop-filter: blur(0px);
            opacity: 0;
            transition:
              background-color 0.30s ease,
              backdrop-filter 0.30s ease,
              opacity 0.30s ease;
            will-change: opacity, backdrop-filter, background-color;
          }

          .zrc-sidebar-overlay-open {
            background: rgba(9, 9, 11, 0.05);
            backdrop-filter: blur(0.7px);
            opacity: 1;
            pointer-events: auto;
          }

          .zrc-sidebar-overlay-closed {
            background: rgba(9, 9, 11, 0);
            backdrop-filter: blur(0px);
            opacity: 0;
            pointer-events: none;
          }

          .zrc-menu-glow:hover svg,
          .zrc-menu-glow:hover span {
            filter: drop-shadow(0 0 7px rgba(255,255,255,0.86));
            text-shadow: 0 0 12px rgba(255,255,255,0.72);
          }
        `}
      </style>
      {panelRenderState.visible && (
        <div
          onClick={() => setIsPanelOpen(false)}
          className={`fixed inset-0 z-[250] zrc-sidebar-overlay ${
            panelRenderState.open ? 'zrc-sidebar-overlay-open' : 'zrc-sidebar-overlay-closed'
          }`}
        />
      )}

      <aside className={`group/sidebar ${isSidebarExpanded ? 'w-[112px]' : 'w-[68px] hover:w-[112px]'} h-screen bg-[#ff3600] flex flex-col justify-between items-center py-6 shrink-0 z-[300] fixed top-0 left-0 shadow-[6px_0_28px_rgba(255,54,0,0.12)] hover:shadow-[10px_0_42px_rgba(255,54,0,0.20)] transition-[width,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible`}>
        <div className="relative z-20">
          <button
            type="button"
            onClick={() => {
              setIsPanelOpen(false);
              onProfileSelect?.();
            }}
            title={`${profileDraft?.firstName || 'ZRC AJANS'} ${profileDraft?.lastName || ''}`.trim()}
            className={`w-[44px] h-[44px] group-hover/sidebar:w-[50px] group-hover/sidebar:h-[50px] rounded-full flex items-center justify-center border-2 cursor-pointer apple-dock-effect hover-grow shadow-md overflow-hidden transition-all duration-500 ${
              activeMenu === 'Profil'
                ? 'bg-white text-[#ff3600] border-white'
                : 'bg-zinc-900 text-white border-white/20 hover:border-white'
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
          </button>
        </div>

        <nav className="flex flex-col w-full flex-1 justify-center space-y-1 relative">
          {visibleMenuItems.map((item) => {
            const isActive = activeMenu === item.id;
            const isProjectsBtn = item.id === 'Projeler';
            const isOtherBtn = item.id === 'Diğer';
            const isSearchBtn = item.id === 'Arama';

            return (
              <div key={item.id} className={`${isSidebarExpanded ? 'pl-3' : 'pl-2 group-hover/sidebar:pl-3'} w-full relative z-10 hover:z-20 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}> 
                <div
                  className={`relative z-10 origin-right transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    isActive ? 'hover:scale-[1.045]' : 'hover:scale-[1.10]'
                  }`}
                >
                  <button
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
                    className={`w-full flex flex-col items-center justify-center py-4 relative z-10 apple-dock-effect apple-dock-btn overflow-hidden transition-[background-color,color,transform,box-shadow,border-radius] duration-500 ${
                      isActive
                        ? 'bg-[#ffffff] text-[#ff3600] rounded-l-[20px] active-menu-btn shadow-none'
                        : 'text-white/80 rounded-l-[20px] zrc-menu-glow hover:text-white'
                    }`}
                    style={{ transformOrigin: 'right center' }}
                  >
                    {item.icon}
                    <span className={`text-[10.5px] tracking-tight mt-0.5 select-none overflow-hidden whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'font-black' : 'font-bold'} ${isSidebarExpanded ? 'max-h-5 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1 group-hover/sidebar:max-h-5 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-y-0'}`}>
                      {item.id}
                    </span>
                  </button>

                  {isActive && (
                    <>
                      <div className="absolute -top-4 right-0 w-4 h-4 bg-[#ffffff] pointer-events-none">
                        <div className="w-full h-full bg-[#ff3600] rounded-br-[16px]" />
                      </div>
                      <div className="absolute -bottom-4 right-0 w-4 h-4 bg-[#ffffff] pointer-events-none">
                        <div className="w-full h-full bg-[#ff3600] rounded-tr-[16px]" />
                      </div>
                    </>
                  )}
                </div>

              </div>
            );
          })}
        </nav>

        <div className="w-full h-6 mb-1" />

      </aside>

      {panelRenderState.visible && (
        <div
          ref={panelRef}
          onClick={(event) => event.stopPropagation()}
          className={`fixed left-[112px] bg-[#ffffff] border-y border-r border-zinc-200/60 shadow-[18px_12px_42px_rgba(15,23,42,0.10)] flex flex-col z-[280] zrc-sidebar-panel overflow-hidden ${
            panelRenderState.open ? 'zrc-sidebar-panel-open' : 'zrc-sidebar-panel-closed'
          } ${
            panelRenderState.kind === 'other'
              ? 'top-1/2 -translate-y-1/2 h-[260px] w-[300px] rounded-r-[20px]'
              : 'top-10 bottom-10 w-[330px] rounded-r-[20px]'
          }`}
        >
          {panelRenderState.kind === 'projects' && (
            <div className="p-5 flex flex-col h-full">
              <div className="mb-4 flex justify-between items-center shrink-0">
                <h2 className="text-[15px] font-black text-zinc-800 tracking-tight">Proje Havuzu</h2>
                <span className="text-[11px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
                  {projectList.length} Başlık
                </span>
              </div>

              <button onClick={handleCreateProject} className={`w-full text-white text-[12.5px] font-extrabold py-2.5 px-4 rounded-md shadow-sm active:scale-[0.97] transition-all duration-150 flex items-center justify-center space-x-2 shrink-0 mb-4 ${canCreateProject ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-zinc-300 cursor-not-allowed'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>{canCreateProject ? 'Yeni Proje Oluştur' : 'Sadece Yönetici Proje Açabilir'}</span>
              </button>

              <div className="w-full h-[1px] bg-zinc-100 mb-3 shrink-0" />

              <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 custom-scrollbar">
                {projectList.length === 0 && (
                  <div className="rounded-[10px] border border-zinc-200 bg-zinc-50 px-3 py-4 text-center">
                    <div className="text-[11px] font-black text-zinc-500">Görünür proje yok</div>
                    <div className="mt-1 text-[9.5px] font-bold text-zinc-400 leading-4">
                      Bu hesap için atanmış veya müşteriyle eşleşen proje bulunmuyor.
                    </div>
                  </div>
                )}

                {projectList.map((project, index) => {
                  const isCurrentProject = String(project || '') === String(activeProjectName || '');
                  const projectAccentColor = getProjectAccentColor(project);

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        rememberSelectedProject(project);
                        setSelectedProject(project);
                        setIsPanelOpen(false);
                      }}
                      className={`relative w-full min-h-[54px] px-3.5 py-2.5 rounded-[9px] cursor-pointer transition-all duration-200 group flex items-center gap-3 overflow-hidden ${
                        isCurrentProject
                          ? 'bg-zinc-50 shadow-[0_10px_24px_rgba(15,23,42,0.075)]'
                          : 'bg-white hover:bg-zinc-50 hover:shadow-[0_10px_22px_rgba(15,23,42,0.055)]'
                      }`}
                    >
                      {isCurrentProject && (
                        <span
                          className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                          style={{ backgroundColor: projectAccentColor }}
                        />
                      )}

                      <div
                        className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 transition-all ${
                          isCurrentProject ? 'text-white shadow-sm' : 'bg-zinc-50 text-zinc-500 group-hover:bg-zinc-100'
                        }`}
                        style={isCurrentProject ? { backgroundColor: projectAccentColor } : { color: projectAccentColor }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0A2.25 2.25 0 004.5 15h15a2.25 2.25 0 002.25-2.25m-19.5 0v.25A2.25 2.25 0 004.5 17.5h15a2.25 2.25 0 002.25-2.25v-.25m-16.5-10.5h3.934a1.5 1.5 0 011.06.44l1.414 1.414a1.5 1.5 0 001.06.44H19.5A2.25 2.25 0 0121.75 9v.75H2.25V6.75z" />
                        </svg>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className={`text-[12.5px] font-black truncate ${
                          isCurrentProject ? 'text-zinc-900' : 'text-zinc-700 group-hover:text-zinc-950'
                        }`}>
                          {project}
                        </div>
                        <div className="mt-0.5 text-[9.5px] font-bold text-zinc-400">
                          Proje
                        </div>
                      </div>

                      {isCurrentProject && (
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: projectAccentColor }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {panelRenderState.kind === 'other' && (
            <div className="h-full bg-white p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[14px] font-black text-zinc-900">Diğer</div>
                  <div className="mt-0.5 text-[10px] font-bold text-zinc-400">
                    Bir alan seç
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPanelOpen(false)}
                  className="w-7 h-7 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-800 hover:bg-white transition-all flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => openOtherPage('Ekip')}
                  className="w-full h-[78px] rounded-[15px] border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all px-4 flex items-center gap-3 text-left"
                >
                  <div className="w-10 h-10 rounded-[12px] bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 7.5a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-black text-zinc-800">Ekip</div>
                    <div className="mt-0.5 text-[10px] font-bold text-zinc-400 truncate">
                      Kişiler ve görev üyeleri
                    </div>
                  </div>

                  <svg className="w-4 h-4 text-zinc-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => openOtherPage('Müşteriler')}
                  className="w-full h-[78px] rounded-[15px] border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all px-4 flex items-center gap-3 text-left"
                >
                  <div className="w-10 h-10 rounded-[12px] bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.75l.001-.031m12 0A5.971 5.971 0 0012 15.75a5.971 5.971 0 00-6 2.969m12 0a8.966 8.966 0 00-6-2.219m0 0a8.966 8.966 0 00-6 2.219M15 11.25a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-black text-zinc-800">Müşteriler</div>
                    <div className="mt-0.5 text-[10px] font-bold text-zinc-400 truncate">
                      Müşteri kartları
                    </div>
                  </div>

                  <svg className="w-4 h-4 text-zinc-300 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </>
  );
}

export default Sidebar;
