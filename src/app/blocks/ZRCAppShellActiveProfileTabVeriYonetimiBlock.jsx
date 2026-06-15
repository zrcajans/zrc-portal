import React from 'react';

export default function ZRCAppShellActiveProfileTabVeriYonetimiBlock(props) {
  const {
    currentAccountType,
    activeProfileTab,
    Veri,
    flex,
    items,
    start,
    justify,
    between,
    gap,
    mb,
    text,
    font,
    black,
    current,
    mt,
    semibold,
    leading,
    Proje,
    ekip,
    ve,
    bildirim,
    verilerini,
    yedekle,
    veya,
    geri,
    h,
    px,
    rounded,
    full,
    bg,
    f6f7fb,
    border,
    e5e8ee,
    center,
    shrink,
    v,
    APP_DATA_VERSION,
    grid,
    dataManagementStats,
    data,
    management,
    edf0f4,
    fafbfc,
    py,
    uppercase,
    tracking,
    Supabase,
    Kontrol,
    Merkezi,
    Storage,
    manuel,
    senkronu,
    tek,
    yerden,
    kontrol,
    et,
    wrap,
    end,
    runSupabaseHealthCheck,
    supabaseHealthLoading,
    supabaseBackupLoading,
    white,
    cursor,
    not,
    allowed,
    transition,
    all,
    runFullSupabaseRefresh,
    ff3600,
    Yenile,
    downloadSupabaseBackupSnapshot,
    Yedek,
    copySupabaseBackupSnapshot,
    dfe4ec,
    b7d4ff,
    Kopyala,
    migrateLocalDataToSupabase,
    eef6ff,
    cfe4ff,
    Yereli,
    e,
    Aktar,
    handleInstallPwa,
    Telefon,
    bilgisayara,
    uygulama,
    gibi,
    kur,
    pwaInstallStatus,
    installed,
    Kurulu,
    isIosDevice,
    iPhone,
    Kurulum,
    Mobil,
    getSupabaseHealthSummary,
    Son,
    toplu,
    supabaseLastFullRefreshAt,
    TR,
    yok,
    supabaseLastBackupAt,
    profilePreferences,
    Yerel,
    verisini,
    getSupabaseRealtimeClass,
    supabaseRealtimeStatus,
    supabaseLastRealtimeAt,
    getPwaInstallClass,
    PWA,
    kurulum,
    durumu,
    supabaseHealthReport,
    getSupabaseHealthStateClass,
    bold,
    truncate,
    Detay,
    Yedekleme,
    Mevcut,
    olarak,
    indir,
    panoya,
    kopyala,
    downloadCurrentDataSnapshot,
    copyCurrentDataSnapshot,
    Veriyi,
    Geri,
    Daha,
    indirilen,
    mevcut,
    verinin,
    yazar,
    ref,
    dataImportInputRef,
    file,
    accept,
    application,
    json,
    handleDataImportFile,
    hidden,
    red,
    Tehlikeli,
    veriyi,
    proje,
    temizler,
    resetLocalApplicationData,
    Patron,
    amber,
    sadece,
    aktiftir
  } = props;

  return (
    activeProfileTab === 'Veri Yönetimi' && (
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                          <div className="text-[14px] font-black text-current">Veri Yönetimi</div>
                          <div className="mt-1 text-[10.5px] font-semibold text-[#7c8798] leading-4">
                            Proje, görev, ekip, müşteri, yazışma ve bildirim verilerini yedekle veya geri yükle.
                          </div>
                        </div>

                        <span className="h-8 px-3 rounded-full bg-[#f6f7fb] border border-[#e5e8ee] text-[10px] font-black text-[#7c8798] flex items-center shrink-0">
                          Veri sürümü v{APP_DATA_VERSION}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {dataManagementStats.map(([label, value]) => (
                          <div key={`data-management-${label}`} className="rounded-[8px] border border-[#edf0f4] bg-[#fafbfc] px-3 py-3">
                            <div className="text-[20px] font-black text-current">{value}</div>
                            <div className="mt-1 text-[9px] font-black text-[#9aa3b1] uppercase tracking-[0.06em]">{label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 rounded-[10px] border border-[#e5e8ee] bg-[#fafbfc] p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-[12px] font-black text-current">Supabase Kontrol Merkezi</div>
                            <div className="mt-1 text-[10px] font-semibold text-[#7c8798] leading-4">
                              Veritabanı tablolarını, Storage erişimini ve manuel senkronu tek yerden kontrol et.
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={runSupabaseHealthCheck}
                              disabled={supabaseHealthLoading || supabaseBackupLoading}
                              className="h-9 px-4 rounded-full bg-[#263244] text-white text-[10px] font-black disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#111827] transition-all"
                            >
                              {supabaseHealthLoading ? 'Kontrol...' : 'Sağlık Kontrolü'}
                            </button>

                            <button
                              type="button"
                              onClick={runFullSupabaseRefresh}
                              disabled={supabaseHealthLoading || supabaseBackupLoading}
                              className="h-9 px-4 rounded-full bg-[#ff3600] border border-[#ff3600] text-white text-[10px] font-black disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#ff3600] hover:text-white transition-all"
                            >
                              Tümünü Yenile
                            </button>

                            <button
                              type="button"
                              onClick={downloadSupabaseBackupSnapshot}
                              disabled={supabaseHealthLoading || supabaseBackupLoading}
                              className="h-9 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#38a86b] transition-all"
                            >
                              {supabaseBackupLoading ? 'Yedek...' : 'Supabase Yedeği'}
                            </button>

                            <button
                              type="button"
                              onClick={copySupabaseBackupSnapshot}
                              disabled={supabaseHealthLoading || supabaseBackupLoading}
                              className="h-9 px-4 rounded-full bg-white border border-[#dfe4ec] text-[#394150] text-[10px] font-black disabled:opacity-60 disabled:cursor-not-allowed hover:border-[#b7d4ff] transition-all"
                            >
                              Yedeği Kopyala
                            </button>

                            <button
                              type="button"
                              onClick={migrateLocalDataToSupabase}
                              disabled={supabaseHealthLoading || supabaseBackupLoading}
                              className="h-9 px-4 rounded-full bg-[#eef6ff] border border-[#cfe4ff] text-[#1769c2] text-[10px] font-black disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#1769c2] hover:text-white transition-all"
                            >
                              Yereli Supabase’e Aktar
                            </button>

                            <button
                              type="button"
                              onClick={handleInstallPwa}
                              className="h-9 px-4 rounded-full bg-[#101827] text-white text-[10px] font-black hover:bg-[#000] transition-all"
                              title="Telefon veya bilgisayara uygulama gibi kur"
                            >
                              {pwaInstallStatus.state === 'installed' ? 'Kurulu' : isIosDevice() ? 'iPhone Kurulum' : 'Mobil Kurulum'}
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[9.5px] font-black text-[#7c8798]">
                          <span className="px-2.5 py-1 rounded-full bg-white border border-[#edf0f4]">
                            {getSupabaseHealthSummary()}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white border border-[#edf0f4]">
                            Son toplu yenileme: {supabaseLastFullRefreshAt ? new Date(supabaseLastFullRefreshAt).toLocaleString('tr-TR') : 'Henüz yok'}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white border border-[#edf0f4]">
                            Son Supabase yedeği: {(supabaseLastBackupAt || profilePreferences.lastSupabaseBackupAt) ? new Date(supabaseLastBackupAt || profilePreferences.lastSupabaseBackupAt).toLocaleString('tr-TR') : 'Henüz yok'}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white border border-[#edf0f4]">
                            Yerel aktarım: tarayıcı verisini Supabase’e taşır
                          </span>
                          <span className={`px-2.5 py-1 rounded-full border ${getSupabaseRealtimeClass()}`}>
                            {supabaseRealtimeStatus.label}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white border border-[#edf0f4]">
                            Son canlı senkron: {supabaseLastRealtimeAt ? new Date(supabaseLastRealtimeAt).toLocaleString('tr-TR') : 'Henüz yok'}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full border ${getPwaInstallClass()}`}
                            title="Mobil/PWA kurulum durumu"
                          >
                            {pwaInstallStatus.label}
                          </span>
                        </div>

                        {supabaseHealthReport.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {supabaseHealthReport.map((row) => (
                              <div
                                key={row.key}
                                className={`rounded-[8px] border px-3 py-2 ${getSupabaseHealthStateClass(row.state)}`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-black">{row.label}</span>
                                  <span className="text-[9px] font-black uppercase">{row.state}</span>
                                </div>
                                <div className="mt-1 text-[9.5px] font-bold opacity-80 truncate">
                                  {row.detail || 'Detay yok'}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-[1.2fr_0.8fr] gap-4">
                        <div className="rounded-[8px] border border-[#edf0f4] bg-white p-4">
                          <div className="text-[12px] font-black text-current">Yedekleme</div>
                          <div className="mt-1 text-[10px] font-semibold text-[#7c8798] leading-4">
                            Mevcut tarayıcı verisini JSON yedeği olarak indir veya panoya kopyala.
                          </div>

                          <div className="mt-4 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={downloadCurrentDataSnapshot}
                              className="h-9 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all"
                            >
                              Yedeği İndir
                            </button>

                            <button
                              type="button"
                              onClick={copyCurrentDataSnapshot}
                              className="h-9 px-4 rounded-full bg-[#ff3600] border border-[#ff3600] text-white text-[10px] font-black hover:bg-[#ff3600] hover:text-white transition-all"
                            >
                              Veriyi Kopyala
                            </button>
                          </div>

                          <div className="mt-3 text-[9.5px] font-bold text-[#9aa3b1]">
                            Son yedek: {profilePreferences.lastDataExportAt ? new Date(profilePreferences.lastDataExportAt).toLocaleString('tr-TR') : 'Henüz yok'}
                          </div>
                        </div>

                        <div className="rounded-[8px] border border-[#edf0f4] bg-white p-4">
                          <div className="text-[12px] font-black text-current">Geri Yükleme</div>
                          <div className="mt-1 text-[10px] font-semibold text-[#7c8798] leading-4">
                            Daha önce indirilen JSON yedeği mevcut verinin üzerine yazar.
                          </div>

                          <input
                            ref={dataImportInputRef}
                            type="file"
                            accept="application/json,.json"
                            onChange={handleDataImportFile}
                            className="hidden"
                          />

                          <button
                            type="button"
                            onClick={() => dataImportInputRef.current?.click()}
                            className="mt-4 h-9 px-4 rounded-full bg-[#f6f7fb] border border-[#dfe4ec] text-[#394150] text-[10px] font-black hover:border-[#b7d4ff] transition-all"
                          >
                            Yedeği Geri Yükle
                          </button>

                          <div className="mt-3 text-[9.5px] font-bold text-[#9aa3b1]">
                            Son geri yükleme: {profilePreferences.lastDataImportAt ? new Date(profilePreferences.lastDataImportAt).toLocaleString('tr-TR') : 'Henüz yok'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-[8px] border border-red-100 bg-red-50/60 p-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-[12px] font-black text-red-600">Tehlikeli Bölge</div>
                          <div className="mt-1 text-[10px] font-semibold text-red-500/80">
                            Yerel veriyi sıfırlamak tarayıcıdaki proje, görev, müşteri, ekip ve mesajları temizler.
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={resetLocalApplicationData}
                          className="h-9 px-4 rounded-full bg-white border border-red-200 text-red-500 text-[10px] font-black hover:bg-red-100 transition-all shrink-0"
                        >
                          Yerel Veriyi Sıfırla
                        </button>
                      </div>

                      {currentAccountType !== 'Patron' && (
                        <div className="mt-4 rounded-[8px] border border-amber-100 bg-amber-50 px-4 py-3 text-[10.5px] font-bold text-amber-700">
                          Veri yönetimi işlemleri sadece Patron hesabında aktiftir.
                        </div>
                      )}
                    </div>
                  )
  );
}
