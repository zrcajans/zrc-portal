import React from 'react';

import GorevlerTabPanelBoardViewArsivBlock from './blocks/GorevlerTabPanelBoardViewArsivBlock';
export default function GorevlerTabPanel(props) {
  const {
    activeTab,
    currentPermissions,
    currentAccountType,
    selectedProject,
    w,
    full,
    flex,
    col,
    animate,
    fade,
    overflow,
    hidden,
    h,
    bg,
    pr,
    items,
    center,
    justify,
    between,
    shrink,
    relative,
    max,
    md,
    px,
    gap,
    canCreateTaskInSelectedProject,
    setEditingTask,
    setIsTaskModalOpen,
    min,
    hover,
    text,
    white,
    font,
    extrabold,
    rounded,
    shadow,
    scale,
    transition,
    all,
    none,
    currentColor,
    round,
    zinc,
    showProjectSettingsControls,
    setActiveTab,
    border,
    openGlobalSearch,
    setIsEditMode,
    isEditMode,
    setOpenMenuColumnId,
    sm,
    modu,
    M3,
    setBoardView,
    boardView,
    pb,
    space,
    auto,
    custom,
    scrollbar,
    start,
    openAddStageModal,
    mt,
    group,
    kolon,
    visibleBoardColumns,
    column,
    colIdx,
    calc,
    mobileActiveColumnId,
    openMenuColumnId,
    task,
    openTaskMenuId,
    e,
    handleDrop,
    py,
    black,
    tracking,
    tight,
    backgroundColor,
    color,
    getReadableColumnColor,
    bold,
    getReadableColumnMutedColor,
    getColumnEditToolsStyle,
    handleMoveColumn,
    boardColumns,
    openEditStageModal,
    handleDeleteColumn,
    red,
    setOpenTaskMenuId,
    left,
    slate,
    handleCopyColumn,
    Kolonu,
    kopyala,
    handleArchiveColumnTasks,
    orange,
    handleArchiveColumn,
    M6,
    sil,
    selectedTasks,
    priorityOptions,
    getTaskCardDateParts,
    draggable,
    canCurrentUserModifyTask,
    openTaskDetail,
    showPermissionWarning,
    handleDragStart,
    handleDragOverTaskPreview,
    duration,
    handleTaskAction,
    Kopyala,
    Sil,
    leading,
    mb,
    Patron,
    Proje,
    wrap,
    Bit,
    end,
    renderProfileAvatar,
    createAvatarFromName,
    mobile,
    MobileTaskMoveButtons,
    handleMoveTaskToColumn,
    setMobileActiveColumnId,
    mx,
    buradan,
    geri,
    getirebilir,
    veya,
    olarak,
    silebilirsin,
    inceleyebilirsin,
    archivedTasks,
    grid,
    TR,
    digit,
    long,
    numeric,
    Tarih,
    yok,
    truncate,
    Eski,
    t,
    handleRestoreArchivedTask,
    Geri,
    Getir,
    handleDeleteArchivedTask,
    burada,
    getirmek,
    tek,
    panoya,
    index,
    tab,
  } = props;

  return (
    activeTab === 'Görevler' && (
                  <div className="w-full flex flex-col flex-1 animate-fade-in overflow-hidden h-full bg-[#f5f6f8]">
                    <div className="w-full h-[54px] pl-7 pr-[76px] bg-[#f5f6f8] flex items-center justify-between shrink-0 relative z-10 max-md:h-[44px] max-md:px-3 max-md:gap-2">
                      <div className="flex items-center gap-3.5">
                        {canCreateTaskInSelectedProject && (
                          <button
                            onClick={() => {
                              setEditingTask(null);
                              setIsTaskModalOpen(true);
                            }}
                            className="h-9 min-w-[126px] bg-[#3cad6e] hover:bg-[#329b60] text-white text-[12.5px] font-extrabold pl-4 pr-3 rounded-full shadow-[0_6px_14px_rgba(60,173,110,0.14)] active:scale-[0.98] transition-all flex items-center justify-between gap-3.5 max-md:h-8 max-md:min-w-0 max-md:px-3 max-md:text-[11px] max-md:gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>Oluştur</span>
                            <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </button>
                        )}

                        <div className="flex items-center gap-2 text-zinc-500">
                          {showProjectSettingsControls && (
                            <button onClick={() => setActiveTab('Ayarlar')} className="w-9 h-9 rounded-full border border-zinc-200/80 bg-white hover:bg-white hover:text-zinc-800 hover:border-zinc-300 transition-all flex items-center justify-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]" title="Pano Ayarları">
                              <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.094c.55 0 1.02.398 1.11.94l.149.894c.07.424.35.78.748.944.073.03.145.06.216.093.39.18.846.135 1.205-.102l.758-.5a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.5.757c-.237.36-.282.816-.102 1.206.033.071.064.143.093.216.164.398.52.678.944.748l.894.149c.542.09.94.56.94 1.11v1.094c0 .55-.398 1.02-.94 1.11l-.894.149c-.424.07-.78.35-.944.748-.03.073-.06.145-.093.216-.18.39-.135.846.102 1.205l.5.758c.32.448.27 1.061-.12 1.45l-.774.773a1.125 1.125 0 01-1.45.12l-.757-.5c-.36-.237-.816-.282-1.206-.102a5.22 5.22 0 01-.216.093c-.398.164-.678.52-.748.944l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.02-.398-1.11-.94l-.149-.894c-.07-.424-.35-.78-.748-.944a5.3 5.3 0 01-.216-.093c-.39-.18-.846-.135-1.205.102l-.758.5a1.125 1.125 0 01-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.5-.757c.237-.36.282-.816.102-1.206a5.22 5.22 0 01-.093-.216c-.164-.398-.52-.678-.944-.748l-.894-.149c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.78-.35.944-.748.03-.073.06-.145.093-.216.18-.39.135-.846-.102-1.205l-.5-.758a1.125 1.125 0 01.12-1.45l.774-.773a1.125 1.125 0 011.45-.12l.757.5c.36.237.816.282 1.206.102.071-.033.143-.064.216-.093.398-.164.678-.52.748-.944l.149-.894z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={openGlobalSearch}
                            className="w-9 h-9 rounded-full border border-zinc-200/80 bg-white hover:bg-white hover:text-zinc-800 hover:border-zinc-300 transition-all flex items-center justify-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                            title="Ara"
                          >
                            <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </button>

                          <button className="w-9 h-9 rounded-full border border-zinc-200/80 bg-white hover:bg-white hover:text-zinc-800 hover:border-zinc-300 transition-all flex items-center justify-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]" title="Filtrele">
                            <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 20.5v-6.068a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                            </svg>
                          </button>

                          {currentPermissions.manageColumns && (
                            <button
                              onClick={() => {
                                setIsEditMode(!isEditMode);
                                setOpenMenuColumnId(null);
                              }}
                              className={`w-9 h-9 rounded-full border transition-all flex items-center justify-center shadow-sm ${
                                isEditMode
                                  ? 'bg-[#ff3600] text-white border-[#ff3600]'
                                  : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800 hover:border-zinc-300'
                              }`}
                              title="Kolon düzenleme modu"
                            >
                              <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                              </svg>
                            </button>
                          )}

                          <button className="w-9 h-9 rounded-full border border-zinc-200/80 bg-white hover:bg-white hover:text-zinc-800 hover:border-zinc-300 transition-all flex items-center justify-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]" title="Görünüm">
                            <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 9.75h16.5M3.75 14.25h16.5M3.75 18.75h16.5" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-2">
                        <button
                          onClick={() => setBoardView('Tüm Görevler')}
                          className={`h-9 px-3.5 rounded-full text-[10.5px] font-extrabold select-none transition-all ${
                            boardView === 'Tüm Görevler' ? 'bg-[#1d5fd3] text-white shadow-[0_8px_18px_rgba(29,95,211,0.18)]' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                          }`}
                        >
                          Tüm Görevler
                        </button>

                        <button
                          onClick={() => setBoardView('Üyelere Göre')}
                          className={`h-9 px-3.5 rounded-full text-[10.5px] font-extrabold select-none transition-all ${
                            boardView === 'Üyelere Göre' ? 'bg-[#1d5fd3] text-white shadow-[0_8px_18px_rgba(29,95,211,0.18)]' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                          }`}
                        >
                          Üyelere Göre
                        </button>

                        <button
                          onClick={() => setBoardView('Arşiv')}
                          className={`h-9 px-3.5 rounded-full text-[10.5px] font-extrabold select-none transition-all ${
                            boardView === 'Arşiv' ? 'bg-[#1d5fd3] text-white shadow-[0_8px_18px_rgba(29,95,211,0.18)]' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                          }`}
                        >
                          Arşiv
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 pl-5 pr-[76px] pt-1.5 pb-5 flex space-x-5 bg-[#f5f6f8] overflow-x-auto overflow-y-hidden h-full custom-scrollbar items-start max-md:px-3 max-md:pt-1 max-md:pb-[112px] max-md:space-x-0 max-md:overflow-hidden">
                      {(boardView === 'Tüm Görevler' || boardView === 'Üyelere Göre') && isEditMode && currentPermissions.manageColumns && (
                        <button
                          type="button"
                          onClick={openAddStageModal}
                          className="w-[38px] h-[34px] mt-[2px] rounded-[4px] bg-[#2f8ee8] hover:bg-[#2476c3] text-white shadow-[0_8px_18px_rgba(47,142,232,0.22)] transition-all active:scale-[0.96] flex items-center justify-center shrink-0 group"
                          title="Yeni kolon ekle"
                        >
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      )}

                      {(boardView === 'Tüm Görevler' || boardView === 'Üyelere Göre') &&
                        visibleBoardColumns.map((column, colIdx) => (
                          <div
                            key={column.id}
                            className={`w-[270px] shrink-0 flex flex-col max-h-[calc(100vh-145px)] relative max-md:w-full max-md:max-h-[calc(100vh-258px)] ${mobileActiveColumnId && mobileActiveColumnId !== column.id ? 'max-md:hidden' : ''} ${
                              openMenuColumnId === column.id || column.tasks.some((task) => task.id === openTaskMenuId)
                                ? 'z-[300]'
                                : 'z-10'
                            }`}
onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, column.id)}
                          >
                            <div
                              className="w-full px-3 py-1.5 flex items-center justify-between text-[10.5px] font-black select-none tracking-tight shrink-0 h-[34px] rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.045)] relative z-[260]"
                              style={{ backgroundColor: column.color }}
                            >
                              <div className="flex items-center space-x-1">
                                <span style={{ color: getReadableColumnColor(column.color) }}>
                                  {column.title}
                                </span>
                                <span
                                  className="opacity-80 font-bold"
                                  style={{ color: getReadableColumnMutedColor(column.color) }}
                                >
                                  ({column.tasks.length})
                                </span>
                              </div>

                              <div className="flex items-center space-x-1.5 opacity-90 relative">
                                {isEditMode && currentPermissions.manageColumns ? (
                                  <div
                                    className="flex items-center gap-1 px-1.5 py-1 rounded-[8px] text-[12px] animate-fade-in z-20"
                                    style={getColumnEditToolsStyle(column.color)}
                                  >
                                    <button type="button" onClick={() => handleMoveColumn(colIdx, -1)} className="w-8 h-7 rounded-[6px] transition-colors hover:bg-black/10 disabled:opacity-30" disabled={colIdx === 0}>
                                      ‹
                                    </button>
                                    <button type="button" onClick={() => handleMoveColumn(colIdx, 1)} className="w-8 h-7 rounded-[6px] transition-colors hover:bg-black/10 disabled:opacity-30" disabled={colIdx === boardColumns.length - 1}>
                                      ›
                                    </button>
                                    <button type="button" onClick={() => openEditStageModal(column)} className="w-8 h-7 rounded-[6px] hover:bg-black/10 transition-colors">
                                      ✎
                                    </button>
                                    <button type="button" onClick={() => handleDeleteColumn(column.id)} className="w-8 h-7 rounded-[6px] hover:bg-red-500/20 transition-colors">
                                      ×
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    {canCreateTaskInSelectedProject && (
                                      <button
                                        type="button"
                                        className="hover:opacity-100 font-black text-[13px] px-1"
                                        style={{ color: getReadableColumnColor(column.color) }}
                                        onClick={() => {
                                          setEditingTask(null);
                                          setIsTaskModalOpen(true);
                                        }}
                                      >
                                        +
                                      </button>
                                    )}

                                    {currentPermissions.manageColumns && (
                                      <button
                                        type="button"
                                        style={{ color: getReadableColumnColor(column.color) }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenMenuColumnId(openMenuColumnId === column.id ? null : column.id);
                                          setOpenTaskMenuId(null);
                                        }}
                                        className="hover:opacity-100 text-[9.5px] font-black px-0.5 tracking-tight focus:outline-none cursor-pointer"
                                      >
                                        •••
                                      </button>
                                    )}

                                    {currentPermissions.manageColumns && openMenuColumnId === column.id && (
                                      <div
                                        onClick={(event) => event.stopPropagation()}
                                        className="absolute right-0 top-8 bg-white border border-zinc-200 shadow-[0_18px_45px_rgba(15,23,42,0.18)] rounded-[10px] p-1.5 w-[190px] z-[500] text-zinc-700 font-semibold text-[11px] animate-fade-in text-left max-h-none overflow-visible"
                                      >
                                        <button
                                          type="button"
                                          onClick={() => openEditStageModal(column)}
                                          className="w-full h-8 px-2.5 rounded-[7px] hover:bg-zinc-50 transition-all flex items-center gap-2 text-left"
                                        >
                                          <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L9.75 16.902 6 18l1.098-3.75L16.862 4.487z" />
                                          </svg>
                                          Düzenle
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setIsEditMode(true);
                                            setOpenMenuColumnId(null);
                                          }}
                                          className="w-full h-8 px-2.5 rounded-[7px] hover:bg-zinc-50 transition-all flex items-center gap-2 text-left"
                                        >
                                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75L3.75 7.5 7.5 11.25M3.75 7.5h16.5M16.5 12.75l3.75 3.75-3.75 3.75M20.25 16.5H3.75" />
                                          </svg>
                                          Sıralama modu
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleCopyColumn(column, colIdx)}
                                          className="w-full h-8 px-2.5 rounded-[7px] hover:bg-zinc-50 transition-all flex items-center gap-2 text-left"
                                        >
                                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 8.25h9A1.5 1.5 0 0118.75 9.75v9a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 15.75h-.75a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5h9a1.5 1.5 0 011.5 1.5V6" />
                                          </svg>
                                          Kolonu kopyala
                                        </button>

                                        <div className="h-px bg-zinc-100 my-1" />

                                        <button
                                          type="button"
                                          onClick={() => handleArchiveColumnTasks(column)}
                                          className="w-full h-8 px-2.5 rounded-[7px] hover:bg-zinc-50 transition-all flex items-center justify-between gap-2 text-left"
                                        >
                                          <span className="flex items-center gap-2">
                                            <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M5.25 7.5v11.25A1.5 1.5 0 006.75 20.25h10.5a1.5 1.5 0 001.5-1.5V7.5M9 11.25h6" />
                                            </svg>
                                            Görevleri arşivle
                                          </span>
                                          <span className="text-[9px] text-zinc-400 font-black">{column.tasks.length}</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleArchiveColumn(column)}
                                          className="w-full h-8 px-2.5 rounded-[7px] hover:bg-zinc-50 transition-all flex items-center gap-2 text-left"
                                        >
                                          <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632A2.25 2.25 0 0117.38 20.25H6.62a2.25 2.25 0 01-2.245-2.118L3.75 7.5M9.75 11.25h4.5M3 7.5h18M8.25 7.5V5.625A1.875 1.875 0 0110.125 3.75h3.75A1.875 1.875 0 0115.75 5.625V7.5" />
                                          </svg>
                                          Kolonu arşivle
                                        </button>

                                        <div className="h-px bg-zinc-100 my-1" />

                                        <button
                                          type="button"
                                          onClick={() => handleDeleteColumn(column.id)}
                                          className="w-full h-8 px-2.5 rounded-[7px] hover:bg-red-50 text-red-600 transition-all flex items-center gap-2 text-left font-black"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M10 11v6M14 11v6M9 7V5.75A1.75 1.75 0 0110.75 4h2.5A1.75 1.75 0 0115 5.75V7m-8 0l.75 12A2 2 0 009.75 21h4.5a2 2 0 002-1.875L17 7" />
                                          </svg>
                                          Kolonu sil
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            <div className={`w-full mt-2.5 space-y-1.5 flex-1 pr-0.5 pb-24 ${
                                column.tasks.some((task) => task.id === openTaskMenuId) || openMenuColumnId === column.id
                                  ? 'overflow-visible'
                                  : 'overflow-y-auto custom-scrollbar'
                              }`} onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, column.id)}>
                              {column.tasks.map((task) => {
                                const isSelected = selectedTasks.includes(task.id);
                                const prioColor = priorityOptions.find((p) => p.label === task.priority)?.color || '#9ca3af';
                                const taskCardDateParts = getTaskCardDateParts(task);

                                return (
                                  <div
                                    key={task.id}
                                    data-zrc-task-card="true"
                                    data-zrc-task-id={task.id}
                                    draggable={Boolean(currentPermissions.editTasks && canCurrentUserModifyTask(task, selectedProject))}
                                    onClick={() => {
                                      if (isEditMode) return;
                                      openTaskDetail(task, column.title);
                                    }}
                                    onDragStart={(e) => {
                                      if (!currentPermissions.editTasks || !canCurrentUserModifyTask(task, selectedProject)) {
                                        e.preventDefault();
                                        showPermissionWarning('Bu görev sana atanmadığı için durumunu değiştiremezsin.');
                                        return;
                                      }
                                      handleDragStart(e, task.id, column.id);
                                    }}
                                    /* === ZRC DROP BETWEEN TASKS CARD HANDLERS START === */
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();

                                      const rect = e.currentTarget.getBoundingClientRect();
                                      const middleY = rect.top + rect.height / 2;
                                      const deadZonePx = Math.min(22, Math.max(10, rect.height * 0.22));
                                      const previousPlacement = e.currentTarget.dataset.zrcDropPlacement;
                                      let placement = previousPlacement === 'after' ? 'after' : 'before';

                                      if (!previousPlacement || e.clientY < middleY - deadZonePx) {
                                        placement = 'before';
                                      } else if (!previousPlacement || e.clientY > middleY + deadZonePx) {
                                        placement = 'after';
                                      }

                                      if (typeof document !== 'undefined') {
                                        document
                                          .querySelectorAll('.zrc-task-drop-before, .zrc-task-drop-after')
                                          .forEach((element) => {
                                            if (element === e.currentTarget) return;
                                            element.classList.remove('zrc-task-drop-before');
                                            element.classList.remove('zrc-task-drop-after');
                                            if (element?.dataset) delete element.dataset.zrcDropPlacement;
                                          });
                                      }

                                      e.currentTarget.dataset.zrcDropPlacement = placement;
                                      e.currentTarget.classList.toggle('zrc-task-drop-before', placement === 'before');
                                      e.currentTarget.classList.toggle('zrc-task-drop-after', placement === 'after');

                                      if (typeof handleDragOverTaskPreview === 'function') {
                                        handleDragOverTaskPreview(e, column.id, task.id, placement);
                                      }
                                    }}
                                    onDragLeave={(e) => {
                                      if (e.currentTarget.contains(e.relatedTarget)) return;

                                      e.currentTarget.classList.remove('zrc-task-drop-before');
                                      e.currentTarget.classList.remove('zrc-task-drop-after');
                                      if (e.currentTarget?.dataset) delete e.currentTarget.dataset.zrcDropPlacement;
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();

                                      const rect = e.currentTarget.getBoundingClientRect();
                                      const storedPlacement = e.currentTarget.dataset.zrcDropPlacement;
                                      const placement = storedPlacement === 'after'
                                        ? 'after'
                                        : storedPlacement === 'before'
                                          ? 'before'
                                          : e.clientY > rect.top + rect.height / 2
                                            ? 'after'
                                            : 'before';

                                      if (typeof document !== 'undefined') {
                                        document
                                          .querySelectorAll('.zrc-task-drop-before, .zrc-task-drop-after')
                                          .forEach((element) => {
                                            element.classList.remove('zrc-task-drop-before');
                                            element.classList.remove('zrc-task-drop-after');
                                            if (element?.dataset) delete element.dataset.zrcDropPlacement;
                                          });
                                      }

                                      handleDrop(e, column.id, task.id, placement);
                                    }}
                                    /* === ZRC DROP BETWEEN TASKS CARD HANDLERS END === */
                                    className={`w-full bg-white p-3.5 rounded-[3px] border border-zinc-100 shadow-[0_6px_16px_rgba(15,23,42,0.055)] hover:shadow-[0_10px_24px_rgba(15,23,42,0.09)] transition-all duration-200 group relative ${isEditMode ? 'cursor-default opacity-70 hover:shadow-[0_6px_16px_rgba(15,23,42,0.055)]' : 'cursor-pointer'} ${openTaskMenuId === task.id ? 'z-[400]' : 'z-10'} ${
                                      isSelected ? 'border-[#3b82f6] border-2 bg-zinc-50' : 'border-zinc-200/50'
                                    }`}
                                  >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[3px]" style={{ backgroundColor: prioColor }} />

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenTaskMenuId(openTaskMenuId === task.id ? null : task.id);
                                        setOpenMenuColumnId(null);
                                      }}
                                      className="absolute top-2.5 right-2.5 w-4.5 h-4.5 rounded-full text-zinc-300 group-hover:text-zinc-500 hover:bg-zinc-100 transition-all z-20 flex items-center justify-center"
                                      title="Görev menüsü"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <circle cx="10" cy="4" r="1.5" />
                                        <circle cx="10" cy="10" r="1.5" />
                                        <circle cx="10" cy="16" r="1.5" />
                                      </svg>
                                    </button>

                                    {openTaskMenuId === task.id && (
                                      <div
                                        onClick={(event) => event.stopPropagation()}
                                        className="absolute right-0 top-[calc(100%+7px)] w-[170px] bg-white border border-slate-200 rounded-[10px] shadow-[0_18px_45px_rgba(15,23,42,0.18)] p-1.5 z-[500] animate-overlay-in"
                                      >
                                        <button
                                          type="button"
                                          onClick={() => handleTaskAction('detay', column.id, task)}
                                          className="w-full h-8 px-2.5 rounded-[7px] text-left text-[11px] font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                                        >
                                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          </svg>
                                          Detayı aç
                                        </button>

                                        {currentPermissions.editTasks && canCurrentUserModifyTask(task, selectedProject) && (
                                          <button
                                            type="button"
                                            onClick={() => handleTaskAction('duzenle', column.id, task)}
                                            className="w-full h-8 px-2.5 rounded-[7px] text-left text-[11px] font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                                          >
                                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L9.75 16.902 6 18l1.098-3.75L16.862 4.487z" />
                                            </svg>
                                            Düzenle
                                          </button>
                                        )}

                                        {canCreateTaskInSelectedProject && (currentAccountType !== 'Ekip Üyesi' || canCurrentUserModifyTask(task, selectedProject)) && (
                                          <button
                                            type="button"
                                            onClick={() => handleTaskAction('kopyala', column.id, task)}
                                            className="w-full h-8 px-2.5 rounded-[7px] text-left text-[11px] font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                                          >
                                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 8.25h9A1.5 1.5 0 0118.75 9.75v9a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 15.75h-.75a1.5 1.5 0 01-1.5-1.5v-9a1.5 1.5 0 011.5-1.5h9a1.5 1.5 0 011.5 1.5V6" />
                                            </svg>
                                            Kopyala
                                          </button>
                                        )}

                                        {currentPermissions.deleteTasks && (
                                          <>
                                            <div className="h-px bg-slate-100 my-1" />

                                            <button
                                              type="button"
                                              onClick={() => handleTaskAction('arsivle', column.id, task)}
                                              className="w-full h-8 px-2.5 rounded-[7px] text-left text-[11px] font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                                            >
                                              <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M5.25 7.5v11.25A1.5 1.5 0 006.75 20.25h10.5a1.5 1.5 0 001.5-1.5V7.5M9 11.25h6" />
                                              </svg>
                                              Arşivle
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => handleTaskAction('sil', column.id, task)}
                                              className="w-full h-8 px-2.5 rounded-[7px] text-left text-[11px] font-black text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                                            >
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M10 11v6M14 11v6M9 7V5.75A1.75 1.75 0 0110.75 4h2.5A1.75 1.75 0 0115 5.75V7m-8 0l.75 12A2 2 0 009.75 21h4.5a2 2 0 002-1.875L17 7" />
                                              </svg>
                                              Sil
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    )}

                                    <h4 className="text-[13.5px] font-extrabold text-zinc-800 leading-snug mb-2 pr-6 pl-1 tracking-tight">{task.title}</h4>
                                    {currentAccountType === 'Patron' && task.customer && task.customer !== 'Müşteri Seçin...' && (
                                      <div className="text-[11.5px] font-bold text-zinc-500 mb-2 pl-1">
                                        {currentAccountType === 'Patron' ? 'Müşteri' : 'Proje'}: <span className="text-zinc-700">{task.customer}</span>
                                      </div>
                                    )}

                                    <div className="flex flex-col space-y-1 pl-1">
                                      {taskCardDateParts.hasAnyDate && (
                                        <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-black text-zinc-400">
                                          {taskCardDateParts.startDate && (
                                            <span className="px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-100">
                                              Baş: {taskCardDateParts.startDate}
                                            </span>
                                          )}

                                          {taskCardDateParts.endDate && (
                                            <span className={`px-2 py-0.5 rounded-full border ${task.isDateUrgent ? 'bg-red-50 border-red-100 text-red-500' : 'bg-zinc-50 border-zinc-100 text-zinc-400'}`}>
                                              Bit: {taskCardDateParts.endDate}{task.isDateUrgent ? ', 15:00' : ''}
                                            </span>
                                          )}
                                        </div>
                                      )}

                                      <div className="flex justify-between items-end mt-1">
                                        <div className="flex -space-x-1.5">
                                          {task.assignees?.map((a) => (
                                            <div
                                              key={a.id}
                                              className="w-7 h-7 rounded-full bg-[#8c5220] border-2 border-white flex items-center justify-center text-white text-[8px] font-black shadow-sm overflow-hidden"
                                              title={a.name}
                                            >
                                              {renderProfileAvatar(a.avatar, createAvatarFromName(a.name))}
                                            </div>
                                          ))}

                                        </div>
                                      </div>
                                    </div>

                                    {/* zrc-v517d-mobile-task-move-buttons-component */}
                                    <MobileTaskMoveButtons
                                      task={task}
                                      column={column}
                                      visibleBoardColumns={visibleBoardColumns}
                                      currentPermissions={currentPermissions}
                                      selectedProject={selectedProject}
                                      canCurrentUserModifyTask={canCurrentUserModifyTask}
                                      handleMoveTaskToColumn={handleMoveTaskToColumn}
                                      setMobileActiveColumnId={setMobileActiveColumnId}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                                            {/* zrc-v523-block-boardview-arsiv */}
                      <GorevlerTabPanelBoardViewArsivBlock {...props} />
                    </div>

                    {/* zrc-v454c-mobile-column-strip */}
                    {(boardView === 'Tüm Görevler' || boardView === 'Üyelere Göre') && visibleBoardColumns.length > 0 && (
                      <div className="md:hidden fixed left-0 right-0 bottom-0 z-[620] px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] bg-white/92 backdrop-blur-xl border-t border-zinc-200 shadow-[0_-16px_42px_rgba(15,23,42,0.12)]">
                        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                          {visibleBoardColumns.map((column, index) => {
                            const isActiveMobileColumn = mobileActiveColumnId === column.id || (!mobileActiveColumnId && index === 0);

                            return (
                              <button
                                key={`mobile-column-tab-${column.id}`}
                                type="button"
                                onClick={() => setMobileActiveColumnId(column.id)}
                                className={`shrink-0 h-10 px-3.5 rounded-[14px] border text-[10px] font-black transition-all flex items-center gap-2 ${
                                  isActiveMobileColumn
                                    ? 'bg-[#101827] text-white border-[#101827] shadow-[0_10px_22px_rgba(15,23,42,0.18)]'
                                    : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                                }`}
                              >
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: column.color }}
                                />
                                <span className="max-w-[126px] truncate">{column.title}</span>
                                <span className={`h-5 min-w-5 px-1.5 rounded-full text-[9px] flex items-center justify-center ${
                                  isActiveMobileColumn ? 'bg-white/16 text-white' : 'bg-white text-zinc-400 border border-zinc-200'
                                }`}>
                                  {column.tasks.length}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
  );
}
