import React from 'react';

export function ZRCAppShellActiveProfileTabEPostaBildirimiBlock({
  activeProfileTab,
  setProfilePreferences,
  profilePreferences,
  toggleProfilePreference,
  saveProfileSection
}) {
  if (activeProfileTab !== 'E-Posta Bildirimi') return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[14px] font-black text-current">E-Posta Bildirimi</div>
        <button
          type="button"
          onClick={() =>
            setProfilePreferences((prev) => ({
              ...prev,
              emailInstant: false,
              emailChat: false,
              emailActivity: false,
              emailLeave: false,
              emailReminder: false,
              emailImportant: false,
              lastSavedAt: new Date().toISOString()
            }))
          }
          className="h-8 px-4 rounded-full bg-red-600 text-white text-[10px] font-black"
        >
          E-posta Bildirimlerini Kapat
        </button>
      </div>

      <div className="h-10 px-3 rounded-[4px] border border-blue-200 bg-blue-50 flex items-center text-[10.5px] font-semibold text-[#475467]">
        ⓘ Uygulama açık değilse bildirimler e-posta ile gönderilir.
      </div>

      <div className="mt-4 divide-y divide-[#edf0f4]">
        {[
          ['emailInstant', 'E-posta Bildirimlerini Anlık Olarak Gönder'],
          ['emailChat', 'Yazışma Bildirimlerini Gönder'],
          ['emailActivity', 'Aktivite Bildirimlerini Gönder'],
          ['emailLeave', 'İzin Talebi Bildirimlerini Gönder'],
          ['emailReminder', 'Son Tarihi Yaklaşan İşler için Hatırlatma Gönder'],
          ['emailImportant', 'Yönettiğim Projelerdeki Önemli Bildirimleri Gönder']
        ].map(([keyName, label]) => (
          <button
            key={keyName}
            type="button"
            onClick={() => toggleProfilePreference(keyName)}
            className="w-full h-10 flex items-center gap-2 text-left"
          >
            <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
              profilePreferences[keyName] ? 'bg-[#45b978] border-[#45b978] text-white' : 'bg-white border-[#cbd2dc] text-transparent'
            }`}>
              ✓
            </span>
            <span className="text-[10.5px] font-bold text-[#394150]">{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={() => saveProfileSection()} className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black">
          Ayarları kaydet
        </button>
      </div>
    </div>
  );
}

export function ZRCAppShellActiveProfileTabTarayiciBildirimiBlock({
  activeProfileTab,
  toggleProfilePreference,
  profilePreferences,
  renderProfileSelect,
  setProfilePreferences,
  saveProfileSection
}) {
  if (activeProfileTab !== 'Tarayıcı Bildirimi') return null;

  return (
    <div>
      <div className="text-[14px] font-black text-current mb-2">Web Tarayıcısı Bildirimleri</div>
      <div className="text-[10.5px] font-semibold text-[#7c8798] mb-4">
        Aktivite ve chat bildirimlerini bilgisayar ekranınızın köşesinde görebilirsiniz.
      </div>

      <button
        type="button"
        onClick={() => toggleProfilePreference('browserEnabled')}
        className={`w-full h-10 px-3 rounded-[4px] border flex items-center text-[10.5px] font-semibold ${
          profilePreferences.browserEnabled
            ? 'border-emerald-200 bg-emerald-50 text-[#28664b]'
            : 'border-blue-200 bg-blue-50 text-[#475467]'
        }`}
      >
        {profilePreferences.browserEnabled ? '✓ Web tarayıcısı bildirimleri aktif.' : '○ Web tarayıcısı bildirimleri kapalı.'}
      </button>

      <div className="mt-5 grid grid-cols-[1fr_200px] gap-4 items-center border-t border-[#edf0f4] pt-5">
        <div>
          <div className="text-[12px] font-black text-current">Rahatsız Etme Modu</div>
          <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">
            Aktifken bildirim sesi kapatılır.
          </div>
        </div>

        {renderProfileSelect({
          id: 'profile-do-not-disturb',
          label: 'Mod',
          value: profilePreferences.doNotDisturb,
          options: ['Kapalı', 'Açık', 'Hafta içi 18:00 sonrası'],
          wrapperClassName: 'w-[200px]',
          onChange: (value) =>
            setProfilePreferences((prev) => ({
              ...prev,
              doNotDisturb: value,
              lastSavedAt: new Date().toISOString()
            }))
        })}
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={() => saveProfileSection()} className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black">
          Güncelle
        </button>
      </div>
    </div>
  );
}

export function ZRCAppShellActiveProfileTabEPostaKutusuBlock({
  activeProfileTab,
  addProfileEmailAccount,
  emailAccountDraft,
  setEmailAccountDraft,
  profilePreferences,
  removeProfileEmailAccount
}) {
  if (activeProfileTab !== 'E-Posta Kutusu') return null;

  return (
    <div>
      <div className="text-[14px] font-black text-current mb-2">E-posta Hesapları</div>
      <div className="text-[10.5px] font-semibold text-[#7c8798] mb-4">
        E-posta hesabı ekleyerek toplantı ve takvim kayıtlarını takip edebilirsiniz.
      </div>

      <form onSubmit={addProfileEmailAccount} className="h-10 flex items-center gap-2">
        <input
          value={emailAccountDraft}
          onChange={(event) => setEmailAccountDraft(event.target.value)}
          placeholder="ornek@firma.com"
          className="flex-1 h-8 rounded-[15px] border border-[#e4e7ec] px-3 text-[10.5px] font-semibold text-[#394150] focus:outline-none focus:border-[#b7d4ff]"
        />
        <button type="submit" className="h-8 px-4 rounded-full bg-[#45b978] text-white text-[10px] font-black">
          E-posta Hesabı Ekle +
        </button>
      </form>

      <div className="mt-5">
        {profilePreferences.emailAccounts.length > 0 ? (
          <div className="border border-[#edf0f4] rounded-[6px] overflow-hidden">
            {profilePreferences.emailAccounts.map((account) => (
              <div key={account.id} className="h-12 px-3 border-b last:border-b-0 border-[#edf0f4] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-black text-[#394150]">{account.email}</div>
                  <div className="text-[9px] font-bold text-[#45b978]">{account.status}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeProfileEmailAccount(account.id)}
                  className="h-8 px-3 rounded-full border border-red-200 text-red-500 text-[9.5px] font-black hover:bg-red-50"
                >
                  Kaldır
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[210px] flex flex-col items-center justify-center text-center">
            <div className="w-[108px] h-[74px] rounded-[6px] bg-[#f4f7fb] border border-[#edf0f4] flex items-center justify-center text-[36px]">
              ✉
            </div>
            <div className="mt-4 text-[10.5px] font-semibold text-[#475467]">
              Henüz hiçbir e-posta hesabınız bağlanmadı.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ZRCAppShellActiveProfileTabOzellestirmelerBlock({
  activeProfileTab,
  profileDraft,
  setProfileDraft,
  saveProfileSection
}) {
  if (activeProfileTab !== 'Özelleştirmeler') return null;

  return (
    <div>
      <div className="text-[14px] font-black text-current mb-5">Özelleştirmeler</div>

      <div className="flex items-center justify-between border-b border-[#edf0f4] pb-5">
        <div>
          <div className="text-[12px] font-black text-current">Uygulama Teması</div>
          <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">Tema tercihini kaydeder.</div>
        </div>

        <div className="h-9 rounded-full bg-[#e5e7eb] p-0.5 flex">
          {['Açık Mod', 'Koyu Mod', 'Sistem Varsayılanı'].map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => {
                const nextProfileDraft = { ...profileDraft, theme };
                setProfileDraft((prev) => ({ ...prev, theme }));
                saveProfileSection({ profileDraft: nextProfileDraft });
              }}
              className={`h-8 px-4 rounded-full text-[10px] font-black ${profileDraft.theme === theme ? 'bg-[#45b978] text-white' : 'text-[#6b7280]'}`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-5">
        <div className="text-[12px] font-black text-current">Navigasyon Rengi</div>
        <div className="mt-1 text-[10px] font-semibold text-[#7c8798]">
          Bu seçim şimdilik profil tercihi olarak kaydedilir; sistem rengini değiştirmez.
        </div>

        <div className="mt-4 grid grid-cols-5 gap-3">
          {[
            ['Gece Siyahı', '#1f2937'],
            ['Kadife Üzüm', '#6d2556'],
            ['Kızıl Tuğla', '#7c2d2d'],
            ['Yakut Alevi', '#be123c'],
            ['Orman Yosunu', '#486b55'],
            ['Cubicl Mavisi', '#2f66cf'],
            ['Çelik Mavi', '#536b7b'],
            ['Derin Deniz', '#27706c'],
            ['Kehribar Işığı', '#c26b23'],
            ['Kurşun Gri', '#4b5563']
          ].map(([name, color]) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                const nextProfileDraft = { ...profileDraft, color: name };
                setProfileDraft((prev) => ({ ...prev, color: name }));
                saveProfileSection({ profileDraft: nextProfileDraft });
              }}
              className={`h-8 rounded-full border px-3 flex items-center gap-2 text-[10px] font-bold ${
                profileDraft.color === name ? 'border-[#2f66cf] text-[#2f66cf]' : 'border-[#d7dce5] text-[#394150]'
              }`}
            >
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ZRCAppShellActiveProfileTabOturumlarBlock({
  activeProfileTab,
  profilePreferences,
  removeProfileSession,
  markSuspiciousEventAsMine
}) {
  if (activeProfileTab !== 'Oturumlar') return null;

  return (
    <div>
      <div className="text-[14px] font-black text-current mb-4">Aktif Oturumlar</div>

      <div className="overflow-hidden border border-[#edf0f4] rounded-[6px]">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_150px] h-9 bg-[#fafbfc] border-b border-[#edf0f4] items-center px-3 text-[10px] font-black text-[#6b7280]">
          <div>Cihaz Tipi</div>
          <div>İşletim Sistemi</div>
          <div>Tarayıcı</div>
          <div>Giriş Tarihi</div>
          <div>Konum</div>
          <div></div>
        </div>

        {profilePreferences.sessions.length > 0 ? (
          profilePreferences.sessions.map((session) => (
            <div key={session.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_150px] h-11 border-b last:border-b-0 border-[#edf0f4] items-center px-3 text-[10px] font-semibold text-[#394150]">
              <div>▱ {session.device}</div>
              <div>{session.os}</div>
              <div>{session.browser}</div>
              <div>{session.date}</div>
              <div>{session.location}</div>
              <button
                type="button"
                onClick={() => removeProfileSession(session.id)}
                className="h-8 px-3 rounded-full bg-red-600 text-white text-[9px] font-black"
              >
                Oturumu Sonlandır
              </button>
            </div>
          ))
        ) : (
          <div className="h-16 flex items-center justify-center text-[10.5px] font-bold text-[#9aa3b1]">
            Aktif oturum yok.
          </div>
        )}
      </div>

      <div className="text-[14px] font-black text-current mt-7 mb-4">Son 2 Ay İçindeki Şüpheli Etkinlikler</div>

      <div className="overflow-hidden border border-[#edf0f4] rounded-[6px]">
        {profilePreferences.suspiciousEvents.length > 0 ? (
          profilePreferences.suspiciousEvents.map((event) => (
            <div key={event.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_150px] h-11 border-b last:border-b-0 border-[#edf0f4] items-center px-3 text-[10px] font-semibold text-[#394150]">
              <div>▱ {event.device}</div>
              <div>{event.os}</div>
              <div>{event.browser}</div>
              <div>{event.date}</div>
              <div>{event.location}</div>
              <div>{event.event}</div>
              <button
                type="button"
                onClick={() => markSuspiciousEventAsMine(event.id)}
                className="h-8 px-3 rounded-full bg-[#55ace8] text-white text-[9px] font-black"
              >
                Etkinlik Bana Ait
              </button>
            </div>
          ))
        ) : (
          <div className="h-16 flex items-center justify-center text-[10.5px] font-bold text-[#9aa3b1]">
            Şüpheli etkinlik yok.
          </div>
        )}
      </div>
    </div>
  );
}
