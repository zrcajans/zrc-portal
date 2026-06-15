import React from 'react';

export default function ZRCAppShellActiveContentMenuDigerActiveTabMusterilerShowCustomerManagementPageSection(props) {
  const {
    activeTab,
    activeContentMenu,
    showCustomerManagementPage,
    zrc,
    center,
    page,
    w,
    full,
    h,
    overflow,
    auto,
    custom,
    scrollbar,
    bg,
    f5f6f8,
    animate,
    fade,
    card,
    max,
    mx,
    px,
    py,
    rounded,
    white,
    border,
    zinc,
    shadow,
    sm,
    flex,
    items,
    justify,
    between,
    gap,
    text,
    font,
    black,
    tracking,
    uppercase,
    ff3600,
    mt,
    tight,
    bold,
    ekle,
    ve,
    takip,
    et,
    shrink,
    customers,
    fff3ef,
    customerPageItems,
    Liste,
    grid,
    space,
    createCustomerFromCenter,
    mb,
    Yeni,
    none,
    currentColor,
    round,
    M12,
    customerDraft,
    setCustomerDraft,
    outline,
    Yetkili,
    Telefon,
    normalizeCredentialText,
    orange,
    leading,
    girersen,
    bu,
    da,
    Not,
    resize,
    submit,
    e03000,
    scale,
    transition,
    all,
    Ekle,
    selectedCustomer,
    copyCredentialTextForCustomer,
    Bilgisi,
    createAvatarFromName,
    min,
    truncate,
    yok,
    blue,
    emerald,
    Biten,
    hidden,
    b,
    Listesi,
    veya,
    sil,
    calc,
    pendingCustomerDeleteId,
    task,
    setSelectedCustomerId,
    cursor,
    pointer,
    transparent,
    red,
    geciken,
    transform,
    rotate,
    M9,
    t,
    getCustomerLinkedAccount,
    Otomatik,
    openCustomerEditModal,
    deleteCustomerFromCenter,
    Tekrar,
    Sil,
    dashed,
    col,
    Sol,
    taraftaki,
    formdan
  } = props;

  return (
    activeContentMenu === 'Diğer' && activeTab === 'Müşteriler' && showCustomerManagementPage && (
                  <div className="zrc-customer-center-page w-full h-full overflow-y-auto custom-scrollbar bg-[#f5f6f8] animate-fade-in">
                    <div className="zrc-center-card max-w-[1120px] mx-auto px-6 py-5">
                      <div className="rounded-[22px] bg-white border border-zinc-200 px-5 py-4 shadow-sm">
                        <div className="flex items-center justify-between gap-5">
                          <div>
                            <div className="text-[10px] font-black tracking-[0.22em] uppercase text-[#ff3600]">Diğer / Müşteriler</div>
                            <h1 className="mt-1 text-[24px] font-black tracking-tight text-zinc-900">Müşteri Yönetimi</h1>
                            <p className="mt-1 text-[11px] font-bold text-zinc-400">
                              Müşterileri ekle, durumlarını yönet ve görev bağlantılarını takip et.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-[86px] rounded-[13px] bg-zinc-950 text-white px-3 py-2.5">
                              <div className="text-[20px] font-black">{customers.length}</div>
                              <div className="text-[8.5px] font-black text-white/45">Kayıt</div>
                            </div>

                            <div className="w-[86px] rounded-[13px] bg-[#fff3ef] border border-[#ff3600] px-3 py-2.5">
                              <div className="text-[20px] font-black text-[#ff3600]">{customerPageItems.length}</div>
                              <div className="text-[8.5px] font-black text-white/80">Liste</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-[320px_minmax(0,1fr)] gap-4">
                        <div className="space-y-4">
                          <form onSubmit={createCustomerFromCenter} className="bg-white border border-zinc-200 rounded-[18px] p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-[13.5px] font-black text-zinc-800">Yeni Müşteri</div>
                                <div className="mt-0.5 text-[10px] font-bold text-zinc-400">Müşteri kartı ve isteğe bağlı giriş hesabı oluştur</div>
                              </div>

                              <div className="w-9 h-9 rounded-[12px] bg-[#ff3600] text-white flex items-center justify-center">
                                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.6" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <input
                                value={customerDraft.name}
                                onChange={(event) => setCustomerDraft((prev) => ({ ...prev, name: event.target.value }))}
                                placeholder="Müşteri adı"
                                className="w-full h-9 rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />

                              <input
                                value={customerDraft.contact}
                                onChange={(event) => setCustomerDraft((prev) => ({ ...prev, contact: event.target.value }))}
                                placeholder="Yetkili kişi"
                                className="w-full h-9 rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />
                              <input
                                value={customerDraft.phone}
                                onChange={(event) => setCustomerDraft((prev) => ({ ...prev, phone: event.target.value }))}
                                placeholder="Telefon"
                                className="w-full h-9 rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  value={customerDraft.username}
                                  onChange={(event) => setCustomerDraft((prev) => ({ ...prev, username: normalizeCredentialText(event.target.value) }))}
                                  placeholder="Müşteri kullanıcı adı"
                                  className="h-9 rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                                />

                                <input
                                  value={customerDraft.password}
                                  onChange={(event) => setCustomerDraft((prev) => ({ ...prev, password: event.target.value }))}
                                  placeholder="Müşteri şifresi"
                                  className="h-9 rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                                />
                              </div>

                              <div className="rounded-[11px] border border-orange-100 bg-orange-50 px-3 py-2 text-[10px] font-bold text-orange-600 leading-4">
                                Kullanıcı adı ve şifre girersen bu müşteri için giriş hesabı da açılır.
                              </div>


                              
                              <textarea
                                value={customerDraft.note}
                                onChange={(event) => setCustomerDraft((prev) => ({ ...prev, note: event.target.value }))}
                                placeholder="Not"
                                rows={2}
                                className="w-full resize-none rounded-[11px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] font-bold text-zinc-700 placeholder:text-zinc-300 focus:outline-none focus:border-[#ff3600] focus:bg-white"
                              />
                            </div>

                            <button
                              type="submit"
                              className="mt-3 w-full h-9 rounded-[11px] bg-[#ff3600] text-white text-[11px] font-black hover:bg-[#e03000] active:scale-[0.98] transition-all shadow-sm"
                            >
                              Müşteri Ekle
                            </button>
                          </form>

                          {selectedCustomer && (
                            <div className="bg-white border border-zinc-200 rounded-[18px] p-4 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="text-[13.5px] font-black text-zinc-800">Seçili Müşteri</div>
                                <button
                                  type="button"
                                  onClick={() => copyCredentialTextForCustomer(selectedCustomer)}
                                  className="h-6 px-2.5 rounded-full bg-[#fff3ef] border border-[#ff3600] text-[9px] font-black text-[#ff3600] hover:bg-[#ff3600] hover:text-white transition-all"
                                >
                                  Giriş Bilgisi
                                </button>
                              </div>

                              <div className="mt-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[13px] bg-[#ff3600] text-white flex items-center justify-center text-[11px] font-black">
                                  {selectedCustomer.avatar || createAvatarFromName(selectedCustomer.name)}
                                </div>

                                <div className="min-w-0">
                                  <div className="text-[13px] font-black text-zinc-800 truncate">{selectedCustomer.name}</div>
                                  <div className="mt-0.5 text-[10px] font-bold text-zinc-400 truncate">
                                    {selectedCustomer.contact || 'Yetkili yok'}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 space-y-1.5 text-[10.5px] font-bold">

                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-zinc-400">Telefon</span>
                                  <span className="text-zinc-700 truncate">{selectedCustomer.phone || '-'}</span>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-3 gap-2">
                                <div className="rounded-[10px] bg-zinc-50 border border-zinc-100 p-2">
                                  <div className="text-[14px] font-black text-zinc-800">{selectedCustomer.taskStats?.total || 0}</div>
                                  <div className="text-[8px] font-black text-zinc-400">Görev</div>
                                </div>

                                <div className="rounded-[10px] bg-blue-50 border border-blue-100 p-2">
                                  <div className="text-[14px] font-black text-blue-600">{selectedCustomer.taskStats?.active || 0}</div>
                                  <div className="text-[8px] font-black text-blue-400">Açık</div>
                                </div>

                                <div className="rounded-[10px] bg-emerald-50 border border-emerald-100 p-2">
                                  <div className="text-[14px] font-black text-emerald-600">{selectedCustomer.taskStats?.completed || 0}</div>
                                  <div className="text-[8px] font-black text-emerald-500/70">Biten</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-[18px] shadow-sm overflow-hidden">
                          <div className="h-11 px-4 border-b border-zinc-100 flex items-center justify-between">
                            <div>
                              <div className="text-[13px] font-black text-zinc-800">Müşteri Listesi</div>
                              <div className="mt-0.5 text-[9px] font-bold text-zinc-400">Seç, düzenle veya sil</div>
                            </div>

                            <span className="h-6 px-2.5 rounded-full bg-zinc-50 border border-zinc-100 text-[9px] font-black text-zinc-400 flex items-center">
                              {customerPageItems.length} kayıt
                            </span>
                          </div>

                          <div className="p-2.5 space-y-1 max-h-[calc(100vh-325px)] min-h-[360px] overflow-y-auto custom-scrollbar">
                            {customerPageItems.length > 0 ? (
                              customerPageItems.map((customer) => {
                                const isPendingDelete = pendingCustomerDeleteId === customer.id;
                                const isSelected = selectedCustomer?.id === customer.id;
                                const isAutoCustomer = customer.source === 'task';

                                return (
                                  <div
                                    key={customer.id}
                                    onClick={() => setSelectedCustomerId(customer.id)}
                                    className={`rounded-[10px] border transition-all cursor-pointer overflow-hidden ${
                                      isSelected
                                        ? 'bg-white border-zinc-300 shadow-[0_1px_0_rgba(15,23,42,0.03)]'
                                        : 'bg-white border-transparent hover:bg-zinc-50 hover:border-zinc-200'
                                    }`}
                                  >
                                    <div className="h-[46px] px-2.5 flex items-center gap-2.5">
                                      <div className="w-7 h-7 rounded-[9px] bg-zinc-100 text-zinc-600 text-[8px] font-black flex items-center justify-center shrink-0">
                                        {customer.avatar || createAvatarFromName(customer.name)}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className="text-[11.5px] font-black text-zinc-800 truncate">
                                          {customer.name}
                                        </div>
                                        <div className="mt-0.5 text-[8.5px] font-bold text-zinc-400 truncate">
                                          {customer.contact || customer.email || customer.phone || 'İletişim yok'}
                                        </div>
                                      </div>

                                      <div className="hidden xl:flex items-center gap-1 text-[9px] font-black text-zinc-400 shrink-0">
                                        <span>{customer.taskStats?.total || 0}</span>
                                        <span className="text-zinc-200">/</span>
                                        <span>{customer.taskStats?.active || 0}</span>
                                        <span className="text-zinc-200">/</span>
                                        <span>{customer.taskStats?.completed || 0}</span>
                                      </div>

                                      {customer.taskStats?.overdue > 0 && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" title={`${customer.taskStats.overdue} geciken`} />
                                      )}

                                      <svg className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-zinc-500' : 'text-zinc-300'}`} fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>

                                    {isSelected && (
                                      <div className="h-[32px] px-2.5 border-t border-zinc-100 bg-zinc-50/60 flex items-center gap-2">
                                        <div className="min-w-0 flex-1 flex items-center gap-1.5 text-[8.5px] font-bold text-zinc-400">
                                          <span className="truncate">{customer.phone || 'Telefon yok'}</span>
                                          <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                                          <span className="truncate">
                                            {getCustomerLinkedAccount(customer)?.username ? `@${getCustomerLinkedAccount(customer)?.username}` : 'Kullanıcı adı yok'}
                                          </span>
                                        </div>

                                        {isAutoCustomer ? (
                                          <span className="h-6 px-2 rounded-[8px] bg-white border border-zinc-100 text-zinc-400 text-[8px] font-black shrink-0 flex items-center">
                                            Otomatik
                                          </span>
                                        ) : (
                                          <div className="flex items-center gap-1 shrink-0">
                                            <button
                                              type="button"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                copyCredentialTextForCustomer(customer);
                                              }}
                                              className="h-6 px-2.5 rounded-[8px] bg-[#ff3600] border border-[#ff3600] text-white hover:bg-[#ff3600] hover:text-white text-[8px] font-black transition-all"
                                            >
                                              Giriş Bilgisi
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                openCustomerEditModal(customer);
                                              }}
                                              className="h-6 px-2.5 rounded-[8px] bg-white border border-zinc-200 text-zinc-600 hover:text-blue-600 hover:border-blue-100 text-[8px] font-black transition-all"
                                            >
                                              Düzenle
                                            </button>

                                            <button
                                              type="button"
                                              onClick={(event) => {
                                                event.stopPropagation();
                                                deleteCustomerFromCenter(customer.id);
                                              }}
                                              className={`h-6 px-2.5 rounded-[8px] text-[8px] font-black border transition-all ${
                                                isPendingDelete
                                                  ? 'bg-red-500 border-red-500 text-white'
                                                  : 'bg-white border-zinc-200 text-zinc-500 hover:text-red-500 hover:border-red-100'
                                              }`}
                                            >
                                              {isPendingDelete ? 'Tekrar' : 'Sil'}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="h-[250px] rounded-[16px] bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                                <div className="text-[13px] font-black text-zinc-700">Henüz müşteri yok</div>
                                <div className="mt-1 text-[10.5px] font-bold text-zinc-400">Sol taraftaki formdan müşteri ekle.</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
  );
}
