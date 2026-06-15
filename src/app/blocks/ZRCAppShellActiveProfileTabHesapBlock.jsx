import React from 'react';

export default function ZRCAppShellActiveProfileTabHesapBlock(props) {
  const {
    activeProfileTab,
    Hesap,
    space,
    text,
    font,
    black,
    current,
    mb,
    E,
    Posta,
    Bilgilerini,
    grid,
    gap,
    block,
    a1aabb,
    posta,
    profileDraft,
    setProfileDraft,
    w,
    full,
    h,
    rounded,
    border,
    e4e7ec,
    px,
    semibold,
    outline,
    none,
    b7d4ff,
    password,
    mt,
    bold,
    adresini,
    girmelisiniz,
    flex,
    justify,
    end,
    saveProfileSection,
    bg,
    white,
    transition,
    all,
    t,
    edf0f4,
    pt,
    currentPassword,
    newPassword,
    Yeni,
    repeatPassword,
    tekrar,
    keyName,
    renderProfileSelect,
    profile,
    date,
    format,
    Tarih,
    DD,
    MM,
    YYYY,
    time,
    Zaman,
    Saat,
    AM,
    timezone,
    Dilimi,
    UTC,
    items,
    center,
    haneli,
    kod,
    isteyerek,
    hesap,
    e5e7eb,
    setProfilePreferences,
    profilePreferences,
    red,
    Sil,
    silme,
    geri,
    setPendingProfileDelete,
    pendingProfileDelete,
    Emin,
    misin
  } = props;

  return (
    activeProfileTab === 'Hesap' && (
                    <div className="space-y-6">
                      <section>
                        <div className="text-[14px] font-black text-current mb-4">Hesap Ayarları</div>

                        <div className="text-[12px] font-black text-current mb-3">E-Posta Bilgilerini Güncelle</div>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="block">
                            <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">E-posta</span>
                            <input
                              value={profileDraft.email}
                              onChange={(event) => setProfileDraft((prev) => ({ ...prev, email: event.target.value }))}
                              className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                            />
                          </label>

                          <label className="block">
                            <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">Şifre</span>
                            <input
                              type="password"
                              value={profileDraft.password}
                              onChange={(event) => setProfileDraft((prev) => ({ ...prev, password: event.target.value }))}
                              placeholder="Şifre"
                              className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                            />
                            <div className="mt-1.5 text-[10px] font-bold text-[#7c8798]">E-posta adresini değiştirebilmek için şifre girmelisiniz.</div>
                          </label>
                        </div>

                        <div className="mt-3 flex justify-end">
                          <button type="button" onClick={saveProfileSection} className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all">
                            Güncelle
                          </button>
                        </div>
                      </section>

                      <section className="border-t border-[#edf0f4] pt-5">
                        <div className="text-[12px] font-black text-current mb-3">Şifreni Değiştir</div>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            ['currentPassword', 'Güncel şifre'],
                            ['newPassword', 'Yeni şifre'],
                            ['repeatPassword', 'Yeni şifre (tekrar)']
                          ].map(([keyName, label]) => (
                            <label key={keyName} className="block">
                              <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">{keyName === 'currentPassword' ? 'Şifre' : label}</span>
                              <input
                                type="password"
                                value={profileDraft[keyName]}
                                onChange={(event) => setProfileDraft((prev) => ({ ...prev, [keyName]: event.target.value }))}
                                placeholder={label}
                                className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                              />
                            </label>
                          ))}
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button type="button" onClick={saveProfileSection} className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all">
                            Güncelle
                          </button>
                        </div>
                      </section>

                      <section className="border-t border-[#edf0f4] pt-5">
                        <div className="text-[12px] font-black text-current mb-3">Yerelleştirme Ayarları</div>
                        <div className="grid grid-cols-3 gap-4">
                          {renderProfileSelect({
                            id: 'profile-date-format',
                            label: 'Tarih Formatı',
                            value: profileDraft.dateFormat,
                            options: ['DD/MM/YYYY (30/05/2026)', 'MM/DD/YYYY (05/30/2026)'],
                            onChange: (value) => setProfileDraft((prev) => ({ ...prev, dateFormat: value }))
                          })}

                          {renderProfileSelect({
                            id: 'profile-time-format',
                            label: 'Zaman Formatı',
                            value: profileDraft.timeFormat,
                            options: ['24-Saat Formatı (02:21)', '12-Saat Formatı (02:21 AM)'],
                            onChange: (value) => setProfileDraft((prev) => ({ ...prev, timeFormat: value }))
                          })}

                          {renderProfileSelect({
                            id: 'profile-timezone',
                            label: 'Zaman Dilimi',
                            value: profileDraft.timezone,
                            options: ['UTC+03:00', 'UTC+00:00', 'UTC+01:00'],
                            onChange: (value) => setProfileDraft((prev) => ({ ...prev, timezone: value }))
                          })}
                        </div>

                        <div className="mt-3 flex justify-end">
                          <button type="button" onClick={saveProfileSection} className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all">
                            Güncelle
                          </button>
                        </div>
                      </section>

                      <section className="border-t border-[#edf0f4] pt-5 grid grid-cols-[1fr_auto] gap-4 items-center">
                        <div>
                          <div className="text-[12px] font-black text-current">2 Adımlı Doğrulama</div>
                          <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">
                            Girişte 6 haneli kod isteyerek hesap güvenliğini artırır.
                          </div>
                        </div>

                        <div className="h-8 rounded-full bg-[#e5e7eb] p-0.5 flex">
                          {[
                            ['Açık', true],
                            ['Kapalı', false]
                          ].map(([label, value]) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() =>
                                setProfilePreferences((prev) => ({
                                  ...prev,
                                  twoFactorEnabled: value,
                                  lastSavedAt: new Date().toISOString()
                                }))
                              }
                              className={`h-7 px-4 rounded-full text-[10px] font-black ${
                                profilePreferences.twoFactorEnabled === value
                                  ? value
                                    ? 'bg-[#45b978] text-white'
                                    : 'bg-red-600 text-white'
                                  : 'text-[#6b7280]'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </section>

                      <section className="border-t border-[#edf0f4] pt-5 grid grid-cols-[1fr_auto] gap-4 items-center">
                        <div>
                          <div className="text-[12px] font-black text-current">Hesabı Sil</div>
                          <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">
                            Hesabınızı silme işlemi geri alınamaz.
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPendingProfileDelete((prev) => !prev)}
                          className={`h-8 px-4 rounded-full border text-[10px] font-black ${
                            pendingProfileDelete
                              ? 'bg-red-600 border-red-600 text-white'
                              : 'border-red-300 text-red-500 hover:bg-red-50'
                          }`}
                        >
                          {pendingProfileDelete ? 'Emin misin?' : 'Sil'}
                        </button>
                      </section>
                    </div>
                  )
  );
}
