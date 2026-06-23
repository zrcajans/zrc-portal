import { useEffect, useMemo, useState } from 'react';

const GLOBAL_SEARCH_FILTERS = ['Tümü', 'Görev', 'Dosya', 'Yorum', 'Not'];

const normalizeGlobalSearchText = (value) => (
  String(value || '')
    .toLocaleLowerCase('tr-TR')
    .trim()
);

export default function ZRCAppShellGlobalSearchBlock({
  isGlobalSearchOpen,
  setIsGlobalSearchOpen,
  globalSearchQuery,
  setGlobalSearchQuery,
  globalSearchResults,
  navigateGlobalSearchResult,
}) {
  const [activeFilter, setActiveFilter] = useState('Tümü');

  const closeGlobalSearch = () => {
    if (typeof setIsGlobalSearchOpen === 'function') {
      setIsGlobalSearchOpen(false);
    }

    if (typeof setGlobalSearchQuery === 'function') {
      setGlobalSearchQuery('');
    }

    setActiveFilter('Tümü');
  };

  useEffect(() => {
    if (!isGlobalSearchOpen) {
      setActiveFilter('Tümü');
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeGlobalSearch();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen, setGlobalSearchQuery]);

  const visibleSearchItems = useMemo(() => {
    const query = normalizeGlobalSearchText(globalSearchQuery);
    const sourceItems = Array.isArray(globalSearchResults) ? globalSearchResults : [];

    return sourceItems
      .filter((item) => activeFilter === 'Tümü' || item?.type === activeFilter)
      .filter((item) => {
        if (!query) return true;

        return normalizeGlobalSearchText([
          item?.title,
          item?.subtitle,
          item?.meta,
          item?.searchText,
          item?.projectName,
        ].join(' ')).includes(query);
      });
  }, [activeFilter, globalSearchQuery, globalSearchResults]);

  const handleResultClick = (item) => {
    if (typeof navigateGlobalSearchResult === 'function') {
      navigateGlobalSearchResult(item);
      return;
    }

    closeGlobalSearch();
  };

  if (!isGlobalSearchOpen) return null;

  return (
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
            value={globalSearchQuery || ''}
            onChange={(event) => {
              if (typeof setGlobalSearchQuery === 'function') {
                setGlobalSearchQuery(event.target.value);
              }
            }}
            placeholder="Görev, dosya, müşteri veya yorum ara..."
            className="w-full bg-transparent text-[16px] font-black text-zinc-800 placeholder:text-zinc-300 focus:outline-none"
          />

          <button
            type="button"
            onClick={closeGlobalSearch}
            className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all flex items-center justify-center"
            aria-label="Aramayı kapat"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {GLOBAL_SEARCH_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`h-8 px-3 rounded-full border text-[10px] font-black whitespace-nowrap transition-all ${
                  activeFilter === filter
                    ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-sm'
                    : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="text-[10px] font-black text-zinc-400 shrink-0">
            {visibleSearchItems.length} sonuç
          </div>
        </div>

        <div className="max-h-[430px] overflow-y-auto custom-scrollbar p-3">
          {visibleSearchItems.length > 0 ? (
            <div className="space-y-1.5">
              {visibleSearchItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleResultClick(item)}
                  className="w-full text-left px-4 py-3 rounded-[12px] border border-transparent hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.12em]">{item.type || 'Kayıt'}</span>
                        <span className="text-[13px] font-black text-zinc-800 truncate">{item.title || 'Adsız kayıt'}</span>
                      </div>

                      {item.subtitle ? (
                        <div className="mt-1 text-[11px] font-bold text-zinc-500 truncate">{item.subtitle}</div>
                      ) : null}
                    </div>

                    {item.meta ? (
                      <span className="max-w-[160px] text-right text-[9px] font-bold text-zinc-400 leading-4">{item.meta}</span>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="text-[13px] font-black text-zinc-500">Sonuç bulunamadı</div>
              <div className="mt-1 text-[11px] font-bold text-zinc-350">Farklı bir kelime veya filtre deneyebilirsin.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
