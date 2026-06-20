import React from 'react';
import { getScopedStorageKey } from '../../app/utils/storageScopeHelpers.js';

class ZRCErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      errorStack: '',
      componentStack: '',
      copied: false
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || 'Bilinmeyen arayüz hatası',
      errorStack: error?.stack || ''
    };
  }

  componentDidCatch(error, errorInfo) {
    const errorPayload = {
      build: (this.props.buildLabel || 'unknown'),
      message: error?.message || 'Bilinmeyen arayüz hatası',
      stack: error?.stack || '',
      componentStack: errorInfo?.componentStack || '',
      createdAt: new Date().toISOString()
    };

    this.setState({
      componentStack: errorInfo?.componentStack || ''
    });

    try {
      window.localStorage.setItem(
        getScopedStorageKey('zrc-last-ui-error'),
        JSON.stringify(errorPayload, null, 2)
      );
      window.localStorage.setItem(
        getScopedStorageKey('zrc-last-error-build'),
        (this.props.buildLabel || 'unknown')
      );
    } catch (storageError) {
      // localStorage erişimi yoksa sessiz geç.
    }

    console.error('[ZRC UI ERROR]', error, errorInfo);
  }

  getErrorText = () => {
    const { errorMessage, errorStack, componentStack } = this.state;

    return [
      `ZRC UI Hatası`,
      `Build: ${(this.props.buildLabel || 'unknown')}`,
      `Mesaj: ${errorMessage}`,
      '',
      'Stack:',
      errorStack || 'Stack yok',
      '',
      'Component Stack:',
      componentStack || 'Component stack yok'
    ].join('\n');
  };

  copyError = async () => {
    const text = this.getErrorText();

    try {
      await navigator.clipboard.writeText(text);
      this.setState({ copied: true });
    } catch (error) {
      await window.zrcPrompt('Hata metnini kopyala:', text);
    }
  };

  clearNavigationAndReload = () => {
    try {
      [
        'zrcLastActiveMenu',
        'zrcLastActiveContentMenu',
        'zrcLastActiveTab'
      ].forEach((key) => window.localStorage.removeItem(getScopedStorageKey(key)));
    } catch (error) {
      // localStorage erişimi yoksa sessiz geç.
    }

    window.location.reload();
  };

  clearLocalCacheAndReload = async () => {
    const confirmed = await window.zrcConfirm(
      'Bu işlem sadece tarayıcıdaki yerel ZRC önbelleğini temizler. Supabase verilerine dokunmaz. Devam edilsin mi?'
    );

    if (!confirmed) return;

    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith('zrc-') || key.startsWith('zrcLast'))
        .forEach((key) => window.localStorage.removeItem(key));
    } catch (error) {
      // localStorage erişimi yoksa sessiz geç.
    }

    window.location.reload();
  };

  resetPwaCacheAndReload = async () => {
    const confirmed = await window.zrcConfirm(
      'Bu işlem ZRC Portal’ın tarayıcıdaki PWA/service worker önbelleğini temizler. Supabase verilerine dokunmaz. Devam edilsin mi?'
    );

    if (!confirmed) return;

    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith('zrc-portal-'))
            .map((cacheName) => caches.delete(cacheName))
        );
      }
    } catch (error) {
      console.warn('[ZRC PWA] Önbellek temizlenemedi:', error);
    }

    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-6 text-current">
        <div className="w-full max-w-[760px] rounded-[22px] border border-red-100 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.16)] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#edf0f4] bg-red-50">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-red-500">
              ZRC Kurtarma Ekranı
            </div>
            <div className="mt-1 text-[22px] font-black text-[#1f2937]">
              Beyaz ekran yerine hata yakalandı
            </div>
            <div className="mt-2 text-[12px] font-bold text-[#7c8798] leading-5">
              Uygulama tamamen boş ekrana düşmesin diye kurtarma ekranı eklendi. Aşağıdaki hata metnini bana gönderirsen direkt nokta atışı düzeltebilirim.
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 text-[12px] font-black text-red-600">
              {this.state.errorMessage}
            </div>

            <pre className="mt-4 max-h-[260px] overflow-auto rounded-[14px] border border-[#edf0f4] bg-[#0f172a] p-4 text-[10px] leading-5 text-slate-100 whitespace-pre-wrap">
              {this.getErrorText()}
            </pre>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="h-10 px-4 rounded-full bg-[#263244] text-white text-[11px] font-black hover:bg-[#111827] transition-all"
              >
                Sayfayı Yenile
              </button>

              <button
                type="button"
                onClick={this.copyError}
                className="h-10 px-4 rounded-full bg-[#ff3600] text-white text-[11px] font-black hover:bg-[#e03000] transition-all"
              >
                {this.state.copied ? 'Kopyalandı' : 'Hatayı Kopyala'}
              </button>

              <button
                type="button"
                onClick={this.clearNavigationAndReload}
                className="h-10 px-4 rounded-full bg-white border border-[#dfe4ec] text-[#394150] text-[11px] font-black hover:border-[#b7d4ff] transition-all"
              >
                Son Sayfa Kaydını Temizle
              </button>

              <button
                type="button"
                onClick={this.clearLocalCacheAndReload}
                className="h-10 px-4 rounded-full bg-white border border-red-100 text-red-600 text-[11px] font-black hover:bg-red-50 transition-all"
              >
                Yerel Önbelleği Temizle
              </button>

              <button
                type="button"
                onClick={this.resetPwaCacheAndReload}
                className="h-10 px-4 rounded-full bg-[#111827] border border-[#111827] text-white text-[11px] font-black hover:bg-black transition-all"
              >
                PWA Önbelleğini Temizle
              </button>
            </div>

            <div className="mt-4 rounded-[12px] bg-[#fafbfc] border border-[#edf0f4] px-4 py-3 text-[10.5px] font-bold text-[#7c8798] leading-5">
              Not: Supabase verileri silinmez. Bu ekran sadece tarayıcı tarafındaki arayüz hatalarını yakalar.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ZRCErrorBoundary;
