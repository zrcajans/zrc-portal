import { ZRCAppGlobalStyles } from '../styles/ZRCAppGlobalStyles';

export default function ZRCAppLoginScreen({
  renderSupabaseConnectionBadge,
  handleCredentialLogin,
  loginDraft,
  setLoginDraft,
  setLoginError,
  loginError,
  authLoginLoading,
  authSessionLoading
}) {
  return (<div className="relative min-h-screen overflow-hidden bg-[#f4f6fb] font-[Inter] flex items-center justify-center p-6">
        <ZRCAppGlobalStyles />
        {renderSupabaseConnectionBadge()}

        <style>{`
          @keyframes loginLightFastOne {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(58px, 34px, 0) scale(1.12); }
          }

          @keyframes loginLightFastTwo {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(-52px, 38px, 0) scale(1.10); }
          }

          @keyframes loginLightFastThree {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(42px, -38px, 0) scale(1.08); }
          }

          @keyframes loginPanelGlowOrbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes loginPanelGlowBreathe {
            0%, 100% { opacity: .78; filter: blur(32px); }
            50% { opacity: .95; filter: blur(38px); }
          }

          .login-input:focus,
          .login-input:focus-visible {
            outline: none !important;
            box-shadow: none !important;
          }
        `}</style>

        <div className="absolute inset-0">
          <div className="absolute -top-28 -left-24 w-[470px] h-[470px] rounded-full bg-[#ff3600]/34 blur-[82px]" style={{ animation: 'loginLightFastOne 4.2s ease-in-out infinite' }} />
          <div className="absolute top-[14%] -right-24 w-[520px] h-[520px] rounded-full bg-[#5b7cfa]/30 blur-[88px]" style={{ animation: 'loginLightFastTwo 4.8s ease-in-out infinite' }} />
          <div className="absolute -bottom-28 left-[28%] w-[560px] h-[560px] rounded-full bg-[#22c55e]/22 blur-[105px]" style={{ animation: 'loginLightFastThree 5.4s ease-in-out infinite' }} />
          <div className="absolute top-[46%] left-[8%] w-[310px] h-[310px] rounded-full bg-[#f59e0b]/18 blur-[78px]" style={{ animation: 'loginLightFastTwo 5.2s ease-in-out infinite reverse' }} />
          <div className="absolute inset-0 opacity-[0.46] bg-[linear-gradient(to_right,#c7cfdf_1px,transparent_1px),linear-gradient(to_bottom,#c7cfdf_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 opacity-[0.22] bg-[linear-gradient(to_right,#9ca8bd_1px,transparent_1px),linear-gradient(to_bottom,#9ca8bd_1px,transparent_1px)] bg-[size:160px_160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,rgba(244,246,251,0.42)_56%,rgba(244,246,251,0.90)_100%)]" />
        </div>

        <div className="relative w-full max-w-[380px]">
          <div className="pointer-events-none absolute -inset-10 rounded-[54px]" style={{ animation: 'loginPanelGlowOrbit 10s linear infinite' }}>
            <div className="absolute -top-3 left-10 w-44 h-44 rounded-full bg-[#ff3600]/48" style={{ animation: 'loginPanelGlowBreathe 4.8s ease-in-out infinite' }} />
            <div className="absolute -bottom-4 right-10 w-48 h-48 rounded-full bg-[#5b7cfa]/44" style={{ animation: 'loginPanelGlowBreathe 5.4s ease-in-out infinite reverse' }} />
          </div>
          <div className="pointer-events-none absolute -inset-8 rounded-[50px]" style={{ animation: 'loginPanelGlowOrbit 14s linear infinite reverse' }}>
            <div className="absolute top-12 -right-3 w-28 h-28 rounded-full bg-[#ff3600]/24 blur-[28px]" />
            <div className="absolute bottom-10 -left-2 w-32 h-32 rounded-full bg-[#5b7cfa]/24 blur-[30px]" />
          </div>
          <div className="absolute -inset-[1px] rounded-[31px] bg-gradient-to-br from-[#ff3600]/34 via-white/70 to-[#5b7cfa]/32" />

          <form
            onSubmit={handleCredentialLogin}
            noValidate
            className="relative rounded-[30px] border border-white/90 bg-white/90 backdrop-blur-2xl shadow-[0_30px_90px_rgba(15,23,42,0.18)] p-7"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[17px] bg-[#ff3600] text-white flex items-center justify-center text-[13px] font-black shadow-[0_14px_30px_rgba(255,54,0,0.25)]">
                ZRC
              </div>

              <div className="h-8 px-3 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-black text-zinc-500 flex items-center">
                Giriş Paneli
              </div>
            </div>

            <div className="mt-7">
              <h1 className="text-[26px] font-black text-zinc-950 tracking-[-0.06em]">
                Hoş geldin
              </h1>
              <p className="mt-1 text-[11px] font-bold text-zinc-400">
                Kullanıcı adı veya e-posta ile giriş yap.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <input
                type="text"
                value={loginDraft.username}
                onChange={(event) => {
                  setLoginDraft((prev) => ({ ...prev, username: event.target.value }));
                  setLoginError('');
                }}
                placeholder="Kullanıcı adı veya e-posta"
                autoComplete="username"
                className="login-input w-full h-12 rounded-[16px] border border-zinc-200 bg-zinc-50 px-4 text-[13px] font-bold text-zinc-800 placeholder:text-zinc-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-[#ff3600]/45 focus:bg-white transition-all"
              />

              <input
                type="password"
                value={loginDraft.password}
                onChange={(event) => {
                  setLoginDraft((prev) => ({ ...prev, password: event.target.value }));
                  setLoginError('');
                }}
                placeholder="Şifre"
                autoComplete="current-password"
                className="login-input w-full h-12 rounded-[16px] border border-zinc-200 bg-zinc-50 px-4 text-[13px] font-bold text-zinc-800 placeholder:text-zinc-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-[#ff3600]/45 focus:bg-white transition-all"
              />

              {loginError && (
                <div className="h-10 rounded-[14px] bg-red-50 border border-red-100 text-red-600 text-[11px] font-black flex items-center px-3">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoginLoading || authSessionLoading}
                className="w-full h-12 rounded-[16px] bg-[#ff3600] text-white text-[12px] font-black hover:bg-[#e03000] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_16px_32px_rgba(255,54,0,0.24)]"
              >
                {authSessionLoading ? 'Oturum kontrol ediliyor...' : authLoginLoading ? 'Giriş kontrol ediliyor...' : 'Giriş Yap'}
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between text-[10px] font-black text-zinc-400">
              <span>Ekip hesabı / Yönetici girişi</span>
              <span>Kullanıcı adı veya e-posta</span>
            </div>
          </form>
        </div>
      </div>);
}
