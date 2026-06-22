import ZRCAppShellActiveProfileTabHesapBlock from '../blocks/ZRCAppShellActiveProfileTabHesapBlock';
import { ZRCAppShellActiveProfileTabEPostaBildirimiBlock, ZRCAppShellActiveProfileTabEPostaKutusuBlock, ZRCAppShellActiveProfileTabOturumlarBlock, ZRCAppShellActiveProfileTabOzellestirmelerBlock, ZRCAppShellActiveProfileTabTarayiciBildirimiBlock } from '../blocks/ZRCAppShellActiveProfileTabSecondaryBlocks';
import ZRCAppShellProfileTabButtonsBlock from '../blocks/ZRCAppShellProfileTabButtonsBlock';

export default function ZRCAppProfilePageSection({
  AM,
  Bilgilerini,
  DD,
  Dilimi,
  E,
  Emin,
  Hesap,
  MM,
  Posta,
  Saat,
  Sil,
  Tarih,
  UTC,
  YYYY,
  Yeni,
  Zaman,
  a1aabb,
  activeProfileTab,
  addProfileEmailAccount,
  adresini,
  all,
  b7d4ff,
  bg,
  black,
  block,
  bold,
  border,
  center,
  current,
  currentPassword,
  date,
  e4e7ec,
  e5e7eb,
  edf0f4,
  emailAccountDraft,
  end,
  flex,
  font,
  format,
  full,
  gap,
  geri,
  girmelisiniz,
  grid,
  h,
  handleLogout,
  handleProfileAvatarChange,
  haneli,
  hesap,
  isteyerek,
  items,
  justify,
  keyName,
  kod,
  markSuspiciousEventAsMine,
  mb,
  misin,
  mt,
  newPassword,
  none,
  outline,
  password,
  pendingProfileDelete,
  posta,
  profile,
  profileAvatarInputRef,
  profileDraft,
  profilePreferences,
  pt,
  px,
  red,
  removeProfileEmailAccount,
  removeProfileSession,
  renderProfileSelect,
  repeatPassword,
  rounded,
  saveProfileSection,
  semibold,
  setActiveProfileTab,
  setEmailAccountDraft,
  setPendingProfileDelete,
  setProfileDraft,
  setProfilePreferences,
  silme,
  space,
  t,
  tekrar,
  text,
  time,
  timezone,
  toggleProfilePreference,
  transition,
  visibleProfileTabs,
  w,
  white,
}) {
  return (
          <div className="zrc-profile-page-safe-v326 zrc-profile-page-safe-v328 w-full h-full min-h-0 bg-[#f2f3f5] overflow-y-auto custom-scrollbar animate-fade-in">
            <div className="zrc-profile-shell-safe-v326 zrc-profile-shell-safe-v328 max-w-[1240px] mx-auto px-5 py-4 pb-20 space-y-4 min-w-[980px]">
              <div className="zrc-profile-header-card-safe-v328 bg-white border border-[#e5e8ee] rounded-[8px] shadow-[0_8px_24px_rgba(15,23,42,0.06)] px-5 py-4">
                <div className="grid grid-cols-[300px_1fr] gap-7 items-center">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => profileAvatarInputRef.current?.click()}
                        className="group relative w-[118px] h-[118px] rounded-[12px] border-[3px] border-[#7c4dff] bg-[#4a3920] shadow-sm flex items-center justify-center overflow-hidden"
                      >
                        {profileDraft.avatarDataUrl ? (
                          <img
                            src={profileDraft.avatarDataUrl}
                            alt="Profil"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="relative w-[86px] h-[74px]">
                            <div className="absolute inset-x-1 top-2 h-[54px] rounded-[50%] bg-[#b7a482]" />
                            <div className="absolute left-6 top-10 w-3 h-3 rounded-full bg-[#263244]" />
                            <div className="absolute right-6 top-10 w-3 h-3 rounded-full bg-[#263244]" />
                            <div className="absolute left-9 top-[53px] w-5 h-2 rounded-b-full border-b-2 border-[#263244]" />
                            <div className="absolute left-1 top-0 w-11 h-9 rounded-full bg-[#8b7a5c] rotate-[-18deg]" />
                            <div className="absolute right-1 top-0 w-11 h-9 rounded-full bg-[#8b7a5c] rotate-[18deg]" />
                          </div>
                        )}

                        <span className="absolute inset-x-0 bottom-0 h-8 bg-zinc-950/55 text-white text-[9px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Resmi Değiştir
                        </span>
                      </button>

                      <input
                        ref={profileAvatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileAvatarChange}
                        className="hidden"
                      />

                      {profileDraft.pendingAvatarDataUrl && (
                        <div className="mt-2 max-w-[148px] text-center text-[9px] leading-3 font-bold text-[#f08a3c]">
                          Yeni fotoğraf seçildi. Güncelle&apos;ye basınca uygulanacak.
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-[13px] font-black text-current">Profil Detayları</div>
                      <div className="mt-1 text-[11px] font-bold text-[#7c8798] truncate">
                        {profileDraft.firstName} {profileDraft.lastName}
                      </div>
                      <div className="mt-2 text-[10px] font-bold text-[#9aa3b1]">
                        {profileDraft.email}
                      </div>
                      {profilePreferences.lastSavedAt && (
                        <div className="mt-2 text-[10px] font-black text-[#45b978]">Kaydedildi</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                    <label className="block">
                      <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">Ad</span>
                      <input
                        value={profileDraft.firstName}
                        onChange={(event) => setProfileDraft((prev) => ({ ...prev, firstName: event.target.value }))}
                        className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">Soyad</span>
                      <input
                        value={profileDraft.lastName}
                        onChange={(event) => setProfileDraft((prev) => ({ ...prev, lastName: event.target.value }))}
                        className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                      />
                    </label>

                    {renderProfileSelect({
                      id: 'profile-language',
                      label: 'Dil',
                      value: profileDraft.language,
                      options: ['Türkçe', 'English'],
                      onChange: (value) => setProfileDraft((prev) => ({ ...prev, language: value }))
                    })}

                    {renderProfileSelect({
                      id: 'profile-status',
                      label: 'Durum',
                      value: profileDraft.status,
                      options: ['Hiçbiri', 'Müsait', 'Meşgul', 'Rahatsız Etmeyin'],
                      onChange: (value) => setProfileDraft((prev) => ({ ...prev, status: value }))
                    })}

                    <label className="block col-span-3">
                      <span className="block text-[10px] font-black text-[#a1aabb] mb-1.5">İş Ünvanı</span>
                      <input
                        value={profileDraft.title}
                        onChange={(event) => setProfileDraft((prev) => ({ ...prev, title: event.target.value }))}
                        className="w-full h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
                      />
                    </label>

                    <div className="flex items-end justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="h-8 px-4 rounded-full bg-white border border-zinc-200 text-zinc-500 text-[10px] font-black hover:text-[#ff3600] hover:border-[#ff3600] transition-all"
                      >
                        Kullanıcı Değiştir
                      </button>

                      <button
                        type="button"
                        onClick={saveProfileSection}
                        className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black hover:bg-[#38a86b] transition-all flex items-center gap-2"
                      >
                        Güncelle
                        <span>▣</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="zrc-profile-tab-card-safe-v328 bg-white border border-[#e5e8ee] rounded-[8px] shadow-[0_8px_24px_rgba(15,23,42,0.06)] overflow-hidden">
                <ZRCAppShellProfileTabButtonsBlock
                  visibleProfileTabs={visibleProfileTabs}
                  activeProfileTab={activeProfileTab}
                  setActiveProfileTab={setActiveProfileTab}
                />

                <div className="zrc-profile-tab-content-safe-v328 p-5">
                                    {/* zrc-v523-block-activeprofiletab-hesap */}
                  <ZRCAppShellActiveProfileTabHesapBlock
                    activeProfileTab={typeof activeProfileTab !== 'undefined' ? activeProfileTab : undefined}
                    Hesap={typeof Hesap !== 'undefined' ? Hesap : undefined}
                    space={typeof space !== 'undefined' ? space : undefined}
                    text={typeof text !== 'undefined' ? text : undefined}
                    font={typeof font !== 'undefined' ? font : undefined}
                    black={typeof black !== 'undefined' ? black : undefined}
                    current={typeof current !== 'undefined' ? current : undefined}
                    mb={typeof mb !== 'undefined' ? mb : undefined}
                    E={typeof E !== 'undefined' ? E : undefined}
                    Posta={typeof Posta !== 'undefined' ? Posta : undefined}
                    Bilgilerini={typeof Bilgilerini !== 'undefined' ? Bilgilerini : undefined}
                    grid={typeof grid !== 'undefined' ? grid : undefined}
                    gap={typeof gap !== 'undefined' ? gap : undefined}
                    block={typeof block !== 'undefined' ? block : undefined}
                    a1aabb={typeof a1aabb !== 'undefined' ? a1aabb : undefined}
                    posta={typeof posta !== 'undefined' ? posta : undefined}
                    profileDraft={typeof profileDraft !== 'undefined' ? profileDraft : undefined}
                    setProfileDraft={typeof setProfileDraft !== 'undefined' ? setProfileDraft : undefined}
                    w={typeof w !== 'undefined' ? w : undefined}
                    full={typeof full !== 'undefined' ? full : undefined}
                    h={typeof h !== 'undefined' ? h : undefined}
                    rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                    border={typeof border !== 'undefined' ? border : undefined}
                    e4e7ec={typeof e4e7ec !== 'undefined' ? e4e7ec : undefined}
                    px={typeof px !== 'undefined' ? px : undefined}
                    semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                    outline={typeof outline !== 'undefined' ? outline : undefined}
                    none={typeof none !== 'undefined' ? none : undefined}
                    b7d4ff={typeof b7d4ff !== 'undefined' ? b7d4ff : undefined}
                    password={typeof password !== 'undefined' ? password : undefined}
                    mt={typeof mt !== 'undefined' ? mt : undefined}
                    bold={typeof bold !== 'undefined' ? bold : undefined}
                    adresini={typeof adresini !== 'undefined' ? adresini : undefined}
                    girmelisiniz={typeof girmelisiniz !== 'undefined' ? girmelisiniz : undefined}
                    flex={typeof flex !== 'undefined' ? flex : undefined}
                    justify={typeof justify !== 'undefined' ? justify : undefined}
                    end={typeof end !== 'undefined' ? end : undefined}
                    saveProfileSection={typeof saveProfileSection !== 'undefined' ? saveProfileSection : undefined}
                    bg={typeof bg !== 'undefined' ? bg : undefined}
                    white={typeof white !== 'undefined' ? white : undefined}
                    transition={typeof transition !== 'undefined' ? transition : undefined}
                    all={typeof all !== 'undefined' ? all : undefined}
                    t={typeof t !== 'undefined' ? t : undefined}
                    edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                    pt={typeof pt !== 'undefined' ? pt : undefined}
                    currentPassword={typeof currentPassword !== 'undefined' ? currentPassword : undefined}
                    newPassword={typeof newPassword !== 'undefined' ? newPassword : undefined}
                    Yeni={typeof Yeni !== 'undefined' ? Yeni : undefined}
                    repeatPassword={typeof repeatPassword !== 'undefined' ? repeatPassword : undefined}
                    tekrar={typeof tekrar !== 'undefined' ? tekrar : undefined}
                    keyName={typeof keyName !== 'undefined' ? keyName : undefined}
                    renderProfileSelect={typeof renderProfileSelect !== 'undefined' ? renderProfileSelect : undefined}
                    profile={typeof profile !== 'undefined' ? profile : undefined}
                    date={typeof date !== 'undefined' ? date : undefined}
                    format={typeof format !== 'undefined' ? format : undefined}
                    Tarih={typeof Tarih !== 'undefined' ? Tarih : undefined}
                    DD={typeof DD !== 'undefined' ? DD : undefined}
                    MM={typeof MM !== 'undefined' ? MM : undefined}
                    YYYY={typeof YYYY !== 'undefined' ? YYYY : undefined}
                    time={typeof time !== 'undefined' ? time : undefined}
                    Zaman={typeof Zaman !== 'undefined' ? Zaman : undefined}
                    Saat={typeof Saat !== 'undefined' ? Saat : undefined}
                    AM={typeof AM !== 'undefined' ? AM : undefined}
                    timezone={typeof timezone !== 'undefined' ? timezone : undefined}
                    Dilimi={typeof Dilimi !== 'undefined' ? Dilimi : undefined}
                    UTC={typeof UTC !== 'undefined' ? UTC : undefined}
                    items={typeof items !== 'undefined' ? items : undefined}
                    center={typeof center !== 'undefined' ? center : undefined}
                    haneli={typeof haneli !== 'undefined' ? haneli : undefined}
                    kod={typeof kod !== 'undefined' ? kod : undefined}
                    isteyerek={typeof isteyerek !== 'undefined' ? isteyerek : undefined}
                    hesap={typeof hesap !== 'undefined' ? hesap : undefined}
                    e5e7eb={typeof e5e7eb !== 'undefined' ? e5e7eb : undefined}
                    setProfilePreferences={typeof setProfilePreferences !== 'undefined' ? setProfilePreferences : undefined}
                    profilePreferences={typeof profilePreferences !== 'undefined' ? profilePreferences : undefined}
                    red={typeof red !== 'undefined' ? red : undefined}
                    Sil={typeof Sil !== 'undefined' ? Sil : undefined}
                    silme={typeof silme !== 'undefined' ? silme : undefined}
                    geri={typeof geri !== 'undefined' ? geri : undefined}
                    setPendingProfileDelete={typeof setPendingProfileDelete !== 'undefined' ? setPendingProfileDelete : undefined}
                    pendingProfileDelete={typeof pendingProfileDelete !== 'undefined' ? pendingProfileDelete : undefined}
                    Emin={typeof Emin !== 'undefined' ? Emin : undefined}
                    misin={typeof misin !== 'undefined' ? misin : undefined}
                  />

                  <ZRCAppShellActiveProfileTabEPostaBildirimiBlock
                    activeProfileTab={activeProfileTab}
                    setProfilePreferences={setProfilePreferences}
                    profilePreferences={profilePreferences}
                    toggleProfilePreference={toggleProfilePreference}
                    saveProfileSection={saveProfileSection}
                  />

                  <ZRCAppShellActiveProfileTabTarayiciBildirimiBlock
                    activeProfileTab={activeProfileTab}
                    toggleProfilePreference={toggleProfilePreference}
                    profilePreferences={profilePreferences}
                    renderProfileSelect={renderProfileSelect}
                    setProfilePreferences={setProfilePreferences}
                    saveProfileSection={saveProfileSection}
                  />

                  <ZRCAppShellActiveProfileTabEPostaKutusuBlock
                    activeProfileTab={activeProfileTab}
                    addProfileEmailAccount={addProfileEmailAccount}
                    emailAccountDraft={emailAccountDraft}
                    setEmailAccountDraft={setEmailAccountDraft}
                    profilePreferences={profilePreferences}
                    removeProfileEmailAccount={removeProfileEmailAccount}
                  />

                  <ZRCAppShellActiveProfileTabOzellestirmelerBlock
                    activeProfileTab={activeProfileTab}
                    profileDraft={profileDraft}
                    setProfileDraft={setProfileDraft}
                    saveProfileSection={saveProfileSection}
                  />

                  <ZRCAppShellActiveProfileTabOturumlarBlock
                    activeProfileTab={activeProfileTab}
                    profilePreferences={profilePreferences}
                    removeProfileSession={removeProfileSession}
                    markSuspiciousEventAsMine={markSuspiciousEventAsMine}
                  />
                </div>
              </div>
            </div>
          </div>
  );
}
