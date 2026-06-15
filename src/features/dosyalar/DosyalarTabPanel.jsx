import React from 'react';

export default function DosyalarTabPanel(props) {
  const {
    activeTab,
    currentPermissions,
    currentAccountType,
    selectedProject,
    Dosyalar,
    w,
    full,
    flex,
    bg,
    f5f6f8,
    overflow,
    auto,
    custom,
    scrollbar,
    animate,
    fade,
    setPendingFileDeleteKey,
    max,
    mx,
    px,
    py,
    items,
    center,
    justify,
    between,
    mb,
    text,
    font,
    black,
    zinc,
    tracking,
    tight,
    mt,
    bold,
    eklenen,
    proje,
    genelinde,
    ara,
    filtrele,
    ve,
    gap,
    h,
    rounded,
    white,
    border,
    projectFiles,
    dosya,
    setActiveTab,
    hover,
    transition,
    all,
    Git,
    shadow,
    hidden,
    b,
    min,
    blue,
    shrink,
    none,
    currentColor,
    round,
    M21,
    fileSearch,
    setFileSearch,
    Dosya,
    veya,
    transparent,
    focus,
    outline,
    projectFileTypeOptions,
    setFileTypeFilter,
    whitespace,
    nowrap,
    fileTypeFilter,
    sm,
    setSelectedProjectFileKey,
    Temizle,
    grid,
    fbfcfd,
    filteredProjectFiles,
    file,
    selectedProjectFile,
    pendingFileDeleteKey,
    handleSelectProjectFile,
    group,
    left,
    ring,
    start,
    getProjectFileIconStyle,
    M19,
    truncate,
    getProjectFileSecondaryText,
    wrap,
    formatProjectFileSize,
    Patron,
    renderProfileAvatar,
    currentProfileInitials,
    getProfileNameForRecord,
    currentActorName,
    red,
    Silmek,
    tekrar,
    bas,
    colors,
    col,
    M18,
    projectFileEmptyTitle,
    projectFileEmptyDescription,
    leading,
    words,
    uppercase,
    Bilgileri,
    space,
    getProjectFileInfoRows,
    right,
    Bu,
    projedeki,
    Sadece,
    size,
    dosyalar,
    listelenir,
    projectFileTypeStats,
    item,
    bilgisi,
    yok,
    pt,
    downloadTaskFileFromSupabase,
    openTaskDetail,
    handleDeleteProjectFile,
    Tekrar,
    Bas,
    Sil,
    dashed,
    M15,
    Soldan,
    bir,
    burada
  } = props;

  return (
    activeTab === 'Dosyalar' && (
                  <div
                    className="w-full flex-1 bg-[#f5f6f8] overflow-y-auto custom-scrollbar animate-fade-in"
                    onClick={() => setPendingFileDeleteKey(null)}
                  >
                    <div className="max-w-[1180px] mx-auto px-7 py-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-[18px] font-black text-zinc-800 tracking-tight">Dosyalar</h3>
                          <p className="mt-1 text-[11px] font-bold text-zinc-400">
                            Görevlere eklenen dosyaları proje genelinde ara, filtrele ve yönet.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="h-8 px-3 rounded-full bg-white border border-zinc-200 text-[10.5px] font-black text-zinc-500 flex items-center">
                            {projectFiles.length} dosya
                          </span>

                          <button
                            type="button"
                            onClick={() => setActiveTab('Görevler')}
                            className="h-8 px-3.5 rounded-full bg-white border border-zinc-200 text-[10.5px] font-black text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 transition-all"
                          >
                            Görevlere Git
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border border-zinc-200/70 rounded-[16px] shadow-[0_10px_32px_rgba(15,23,42,0.045)] overflow-hidden">
                        <div className="h-[62px] px-5 border-b border-zinc-100 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-[280px] h-8 rounded-[8px] bg-white border border-zinc-200 flex items-center px-2.5 gap-2">
                              <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                              </svg>
                              <input
                                value={fileSearch}
                                onChange={(event) => {
                                  setFileSearch(event.target.value);
                                  setPendingFileDeleteKey(null);
                                }}
                                placeholder="Dosya, görev veya müşteri ara..."
                                className="w-full bg-transparent text-[11px] font-bold text-zinc-600 placeholder:text-zinc-300 focus:outline-none"
                              />
                            </div>

                            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar max-w-[560px]">
                              {projectFileTypeOptions.map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => {
                                    setFileTypeFilter(type);
                                    setPendingFileDeleteKey(null);
                                  }}
                                  className={`h-8 px-3 rounded-full border text-[10px] font-black whitespace-nowrap transition-all ${
                                    fileTypeFilter === type
                                      ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-sm'
                                      : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300'
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setFileSearch('');
                              setFileTypeFilter('Tümü');
                              setSelectedProjectFileKey(null);
                              setPendingFileDeleteKey(null);
                            }}
                            className="h-8 px-3 rounded-full bg-zinc-50 border border-zinc-100 text-[10px] font-black text-zinc-400 hover:text-zinc-700 transition-all"
                          >
                            Temizle
                          </button>
                        </div>

                        <div className="grid grid-cols-[1fr_330px] min-h-[520px] bg-[#fbfcfd]">
                          <div className="p-5 border-r border-zinc-100">
                            {filteredProjectFiles.length > 0 ? (
                              <div className="grid grid-cols-2 gap-3">
                                {filteredProjectFiles.map((file) => {
                                  const isSelected = selectedProjectFile?.fileKey === file.fileKey;
                                  const isPendingDelete = pendingFileDeleteKey === file.fileKey;

                                  return (
                                    <button
                                      key={file.fileKey}
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleSelectProjectFile(file);
                                      }}
                                      className={`group text-left bg-white border rounded-[12px] p-3.5 shadow-sm hover:shadow-[0_12px_26px_rgba(15,23,42,0.075)] transition-all ${
                                        isSelected
                                          ? 'border-blue-200 ring-0'
                                          : 'border-zinc-200 hover:border-zinc-300'
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className={`w-11 h-11 rounded-[11px] flex items-center justify-center shrink-0 ${getProjectFileIconStyle(file.type)}`}>
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-.988-2.387l-4.5-4.5A3.375 3.375 0 0011.625 3.75H8.25A2.25 2.25 0 006 6v12a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 18v-3.75" />
                                          </svg>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                              <div className="text-[12.5px] font-black text-zinc-750 truncate group-hover:text-zinc-900" title={file.name}>
                                                {file.name}
                                              </div>

                                              <div className="mt-1 text-[10.5px] font-bold text-zinc-400 truncate" title={getProjectFileSecondaryText(file)}>
                                                {getProjectFileSecondaryText(file)}
                                              </div>
                                            </div>

                                            <span className="shrink-0 h-5 px-2 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400">
                                              {file.type || 'Dosya'}
                                            </span>
                                          </div>

                                          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                                            <span className="h-5 px-2 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400">
                                              {formatProjectFileSize(file.size)}
                                            </span>

                                            <span className="h-5 px-2 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400">
                                              {file.columnTitle}
                                            </span>

                                            <span className="h-5 px-2 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400">
                                              {currentAccountType === 'Patron' ? file.customer : file.projectName || selectedProject}
                                            </span>
                                          </div>

                                          <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-zinc-400 min-w-0">
                                              {currentAccountType !== 'Müşteri' && (
                                                <>
                                                  <span className="w-5 h-5 rounded-full bg-[#8c5220] text-white text-[7px] font-black flex items-center justify-center shrink-0">
                                                    {renderProfileAvatar(file.avatar, currentProfileInitials)}
                                                  </span>
                                                  <span className="truncate">{getProfileNameForRecord(file, file.uploader || currentActorName)}</span>
                                                  <span>·</span>
                                                </>
                                              )}
                                              <span className="truncate">{file.date}</span>
                                            </div>

                                            {isPendingDelete ? (
                                              <span className="text-[9.5px] font-black text-red-500">
                                                Silmek için tekrar bas
                                              </span>
                                            ) : (
                                              <span className="text-[9.5px] font-black text-zinc-300 group-hover:text-zinc-500 transition-colors">
                                                Önizle
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="h-[460px] bg-white border border-zinc-200 rounded-[14px] shadow-[0_8px_24px_rgba(15,23,42,0.04)] flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.552 18.32a1.5 1.5 0 11-2.121-2.121l9.546-9.546" />
                                  </svg>
                                </div>

                                <div className="text-[14px] font-black text-zinc-700">
                                  {projectFileEmptyTitle}
                                </div>
                                <div className="text-[11px] font-bold text-zinc-400 mt-1 max-w-[360px]">
                                  {projectFileEmptyDescription}
                                </div>

                                {projectFiles.length === 0 && (
                                  <button
                                    type="button"
                                    onClick={() => setActiveTab('Görevler')}
                                    className="mt-5 h-9 px-4 rounded-full bg-[#2563eb] text-white text-[11px] font-black hover:bg-[#1d4ed8] shadow-[0_9px_20px_rgba(37,99,235,0.18)] transition-all"
                                  >
                                    Görevlere Git
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <aside className="bg-white p-5">
                            {selectedProjectFile ? (
                              <div className="h-full flex flex-col">
                                <div className="flex items-start gap-3">
                                  <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0 ${getProjectFileIconStyle(selectedProjectFile.type)}`}>
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-.988-2.387l-4.5-4.5A3.375 3.375 0 0011.625 3.75H8.25A2.25 2.25 0 006 6v12a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 18v-3.75" />
                                    </svg>
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="text-[13px] font-black text-zinc-800 leading-tight break-words">
                                      {selectedProjectFile.name}
                                    </div>
                                    <div className="mt-1 text-[10px] font-bold text-zinc-400">
                                      {selectedProjectFile.type || 'Dosya'} · {formatProjectFileSize(selectedProjectFile.size)}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-5 rounded-[13px] bg-zinc-50 border border-zinc-100 p-4">
                                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-3">
                                    Dosya Bilgileri
                                  </div>

                                  <div className="space-y-3">
                                    {getProjectFileInfoRows(selectedProjectFile).map(([label, value]) => (
                                      <div key={label} className="flex items-start justify-between gap-3">
                                        <span className="text-[10px] font-black text-zinc-400">{label}</span>
                                        <span className="text-[10.5px] font-black text-zinc-700 text-right break-words">{value || '-'}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="mt-4 rounded-[13px] bg-zinc-50 border border-zinc-100 p-4">
                                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.08em] mb-2">
                                    {currentAccountType === 'Müşteri' ? 'Dosya Özeti' : 'Tür Dağılımı'}
                                  </div>

                                  {currentAccountType === 'Müşteri' ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between h-7 rounded-[7px] px-2 bg-white">
                                        <span className="text-[10.5px] font-black text-zinc-600">Bu projedeki görünür dosya</span>
                                        <span className="text-[10px] font-black text-zinc-400">{filteredProjectFiles.length}</span>
                                      </div>
                                      <div className="text-[10px] font-bold text-zinc-400 leading-4">
                                        Sadece size açık proje ve görevlerdeki dosyalar listelenir.
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      {projectFileTypeStats.length > 0 ? (
                                        projectFileTypeStats.map((item) => (
                                          <button
                                            key={item.type}
                                            type="button"
                                            onClick={() => setFileTypeFilter(item.type)}
                                            className="w-full flex items-center justify-between h-7 rounded-[7px] px-2 hover:bg-white transition-all"
                                          >
                                            <span className="text-[10.5px] font-black text-zinc-600">{item.type}</span>
                                            <span className="text-[10px] font-black text-zinc-400">{item.count}</span>
                                          </button>
                                        ))
                                      ) : (
                                        <div className="text-[10.5px] font-bold text-zinc-400">Henüz tür bilgisi yok.</div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div className="mt-auto pt-4 space-y-2">
                                  {selectedProjectFile.storagePath && (
                                    <button
                                      type="button"
                                      onClick={() => downloadTaskFileFromSupabase(selectedProjectFile)}
                                      className="w-full h-9 rounded-full bg-[#263244] text-white text-[11px] font-black hover:bg-[#111827] shadow-[0_9px_20px_rgba(15,23,42,0.14)] transition-all"
                                    >
                                      Dosyayı İndir
                                    </button>
                                  )}

                                  {selectedProjectFile.task && (
                                    <button
                                      type="button"
                                      onClick={() => openTaskDetail(selectedProjectFile.task, selectedProjectFile.columnTitle)}
                                      className="w-full h-9 rounded-full bg-[#2563eb] text-white text-[11px] font-black hover:bg-[#1d4ed8] shadow-[0_9px_20px_rgba(37,99,235,0.18)] transition-all"
                                    >
                                      Görev Detayını Aç
                                    </button>
                                  )}

                                  {currentPermissions.manageFiles && (
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleDeleteProjectFile(selectedProjectFile);
                                      }}
                                      className={`w-full h-9 rounded-full border text-[11px] font-black transition-all ${
                                        pendingFileDeleteKey === selectedProjectFile.fileKey
                                          ? 'bg-red-500 border-red-500 text-white'
                                          : 'bg-white border-red-100 text-red-500 hover:bg-red-50'
                                      }`}
                                    >
                                      {pendingFileDeleteKey === selectedProjectFile.fileKey
                                        ? 'Silmek İçin Tekrar Bas'
                                        : 'Dosyayı Sil'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="h-full rounded-[13px] bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-14 h-14 rounded-full bg-white border border-zinc-100 text-zinc-300 flex items-center justify-center mb-3">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h9a2.25 2.25 0 002.25-2.25V12M15.75 9h3.75M15.75 9L19.5 5.25" />
                                  </svg>
                                </div>

                                <div className="text-[12px] font-black text-zinc-600">Dosya seçilmedi</div>
                                <div className="mt-1 text-[10.5px] font-bold text-zinc-400">
                                  Soldan bir dosya seçtiğinde detayları burada görünür.
                                </div>
                              </div>
                            )}
                          </aside>
                        </div>
                      </div>
                    </div>
                  </div>
                )
  );
}
