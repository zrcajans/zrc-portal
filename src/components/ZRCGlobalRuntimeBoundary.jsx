import React from 'react';

export default class ZRCGlobalRuntimeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorText: '',
      source: '',
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorText: ZRCGlobalRuntimeBoundary.formatError(error),
      source: 'React render error',
    };
  }

  componentDidCatch(error, info) {
    const detail = [
      'ZRC RUNTIME ERROR',
      'Source: React componentDidCatch',
      '',
      ZRCGlobalRuntimeBoundary.formatError(error),
      '',
      'Component stack:',
      info?.componentStack || '',
      '',
      'URL:',
      typeof window !== 'undefined' ? window.location.href : '',
      '',
      'User agent:',
      typeof navigator !== 'undefined' ? navigator.userAgent : '',
      '',
      'Build time:',
      new Date().toISOString(),
    ].join('\n');

    this.setState({
      hasError: true,
      errorText: detail,
      source: 'React componentDidCatch',
    });

    console.error('[ZRC Runtime Boundary]', error, info);
  }

  componentDidMount() {
    this.handleWindowError = (event) => {
      const detail = [
        'ZRC RUNTIME ERROR',
        'Source: window.error',
        '',
        event?.message || 'Bilinmeyen window error',
        '',
        'File:',
        event?.filename || '',
        '',
        'Line/Column:',
        `${event?.lineno || ''}:${event?.colno || ''}`,
        '',
        'Error:',
        ZRCGlobalRuntimeBoundary.formatError(event?.error),
        '',
        'URL:',
        window.location.href,
        '',
        'User agent:',
        navigator.userAgent,
        '',
        'Time:',
        new Date().toISOString(),
      ].join('\n');

      this.setState({
        hasError: true,
        errorText: detail,
        source: 'window.error',
      });

      console.error('[ZRC window.error]', event?.error || event?.message);
    };

    this.handleUnhandledRejection = (event) => {
      const detail = [
        'ZRC RUNTIME ERROR',
        'Source: unhandledrejection',
        '',
        ZRCGlobalRuntimeBoundary.formatError(event?.reason),
        '',
        'URL:',
        window.location.href,
        '',
        'User agent:',
        navigator.userAgent,
        '',
        'Time:',
        new Date().toISOString(),
      ].join('\n');

      this.setState({
        hasError: true,
        errorText: detail,
        source: 'unhandledrejection',
      });

      console.error('[ZRC unhandledrejection]', event?.reason);
    };

    window.addEventListener('error', this.handleWindowError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    if (this.handleWindowError) {
      window.removeEventListener('error', this.handleWindowError);
    }
    if (this.handleUnhandledRejection) {
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
  }

  static formatError(error) {
    if (!error) return 'Bilinmeyen hata';
    if (typeof error === 'string') return error;

    const name = error?.name || 'Error';
    const message = error?.message || String(error);
    const stack = error?.stack || '';

    return [name + ': ' + message, stack].filter(Boolean).join('\n');
  }

  copyError = async () => {
    try {
      await navigator.clipboard.writeText(this.state.errorText || 'Hata metni boş.');
      this.setState((prev) => ({
        ...prev,
        copied: true,
      }));
    } catch (error) {
      console.error('[ZRC copy error failed]', error);
    }
  };

  reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#050505',
          color: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            width: 'min(960px, 100%)',
            border: '1px solid rgba(239,68,68,0.45)',
            borderRadius: 24,
            background: 'linear-gradient(180deg, rgba(24,24,27,0.96), rgba(9,9,11,0.98))',
            boxShadow: '0 24px 90px rgba(0,0,0,0.55)',
            padding: 24,
          }}
        >
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'rgba(239,68,68,0.18)',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 22,
              }}
            >
              !
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>ZRC çalışma hatası yakalandı</div>
              <div style={{ color: '#a1a1aa', fontSize: 13 }}>
                Siyah ekranda kalmaması için hata görünür hale getirildi.
              </div>
            </div>
          </div>

          <div style={{ color: '#d4d4d8', marginBottom: 12, fontSize: 14 }}>
            Kaynak: <b>{this.state.source || 'runtime'}</b>
          </div>

          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: 360,
              overflow: 'auto',
              background: 'rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: 16,
              color: '#fecaca',
              fontSize: 12,
              lineHeight: 1.55,
            }}
          >
            {this.state.errorText}
          </pre>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
            <button
              type="button"
              onClick={this.copyError}
              style={{
                border: 0,
                borderRadius: 14,
                padding: '11px 16px',
                fontWeight: 800,
                color: '#111827',
                background: '#ff5a1f',
                cursor: 'pointer',
              }}
            >
              {this.state.copied ? 'Hata kopyalandı' : 'Hatayı kopyala'}
            </button>

            <button
              type="button"
              onClick={this.reloadPage}
              style={{
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 14,
                padding: '11px 16px',
                fontWeight: 800,
                color: '#f5f5f5',
                background: 'rgba(255,255,255,0.06)',
                cursor: 'pointer',
              }}
            >
              Sayfayı yenile
            </button>
          </div>

          <div style={{ marginTop: 14, color: '#a1a1aa', fontSize: 12 }}>
            Bu ekran çıkarsa "Hatayı kopyala" butonuna basıp ChatGPT'ye yapıştır.
          </div>
        </div>
      </div>
    );
  }
}
