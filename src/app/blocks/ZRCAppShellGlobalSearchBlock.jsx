export default function ZRCAppShellGlobalSearchBlock({
  isGlobalSearchOpen,
  setIsGlobalSearchOpen,
  globalSearchQuery,
  setGlobalSearchQuery,
  globalSearchResults,
  navigateGlobalSearchResult,
}) {
  return (
    <>
      {isGlobalSearchOpen && (
                <div
                  className="fixed inset-0 z-[690] bg-zinc-950/25 backdrop-blur-[2px] flex items-start justify-center pt-[82px] animate-fade-in"
                  onClick={closeGlobalSearch}
                >
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="w-[720px] max-w-[calc(100vw-150px)] bg-white border border-zinc-200 rounded-[17px] shadow-[0_28px_90px_rgba(15,23,42,0.24)] overflow-hidden"
                  >
                    <div className="h-[66px] px-5 border-b border-zinc-100 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[11px] bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                        </svg>
                      </div>
      
                      <input
                        autoFocus
                        value={globalSearchQuery}
                        onChange={(event) => setGlobalSearchQuery(event.target.value)}
                        placeholder={globalSearchPlaceholder}
                        className="w-full bg-transparent text-[16px] font-black text-zinc-800 placeholder:text-zinc-300 focus:outline-none"
                      />
      
                      <button
                        type="button"
                        onClick={closeGlobalSearch}
                        className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
      
                    <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                        {globalSearchFilterOptions.map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setGlobalSearchFilter(filter)}
                            className={`h-8 px-3 rounded-full border text-[10px] font-black whitespace-nowrap transition-all ${
                              globalSearchFilter === filter
                                ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-sm'
                                : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
      
                      <div className="text-[10px] font-black text-zinc-400 shrink-0">
                        {globalSearchQuery.trim() ? `${filteredGlobalSearchItems.length} sonuç` : 'Son görevler'}
                      </div>
                    </div>
      
                    <div className="max-h-[430px] overflow-y-auto custom-scrollbar p-3">
                      {filteredGlobalSearchItems.length > 0 ? (
                        <div className="space-y-1.5">
                          {filteredGlobalSearchItems.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleGlobalSearchItemClick(item)}
                              className="w-full rounded-[12px] border border-zinc-100 bg-white hover:bg-zinc-50 hover:border-zinc-200 p-3 text-left transition-all group"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-[11px] border flex items-center justify-center shrink-0 ${getGlobalSearchTypeStyle(item.type)}`}>
                                  {item.type === 'Dosya' ? (
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94a3 3 0 114.243 4.243L8.552 18.32a1.5 1.5 0 11-2.121-2.121l9.546-9.546" />
                                    </svg>
                                  ) : item.type === 'Yorum' ? (
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.924-.924 5.972 5.972 0 001.057-4.035A8.287 8.287 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M8.25 4.5h7.5A2.25 2.25 0 0118 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-7.5A2.25 2.25 0 016 17.25V6.75A2.25 2.25 0 018.25 4.5z" />
                                    </svg>
                                  )}
                                </div>
      
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="text-[12.5px] font-black text-zinc-800 truncate group-hover:text-zinc-950">
                                        {item.title}
                                      </div>
                                      <div className="mt-0.5 text-[10.5px] font-bold text-zinc-500 truncate">
                                        {item.subtitle}
                                      </div>
                                    </div>
      
                                    <span className="h-5 px-2 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400 shrink-0">
                                      {item.type}
                                    </span>
                                  </div>
      
                                  <div className="mt-2 text-[9.5px] font-bold text-zinc-400 truncate">
                                    {item.meta}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="h-[240px] flex flex-col items-center justify-center text-center">
                          <div className="w-15 h-15 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-300 flex items-center justify-center mb-3">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
                            </svg>
                          </div>
      
                          <div className="text-[13px] font-black text-zinc-700">Sonuç bulunamadı</div>
                          <div className="mt-1 text-[10.5px] font-bold text-zinc-400 max-w-[330px]">
                            {currentAccountType === 'Patron'
                              ? 'Başka bir görev adı, müşteri, dosya, yorum veya kolon adıyla tekrar ara.'
                              : 'Sadece erişimin olan projelerde arama yapılır. Başka bir görev, dosya veya yorum adıyla tekrar ara.'}
                          </div>
                        </div>
                      )}
                    </div>
      
                    <div className="h-[42px] px-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                      <div className="text-[9.5px] font-bold text-zinc-400">
                        {currentAccountType === 'Patron' ? 'Enter gerekmez, yazdıkça arar.' : 'Arama sadece erişimin olan kayıtları gösterir.'}
                      </div>
                      <div className="text-[9.5px] font-black text-zinc-400">ESC ile kapat</div>
                    </div>
                  </div>
                </div>
              )}
    </>
  );
}
