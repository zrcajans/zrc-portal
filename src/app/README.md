# ZRC App

Bu klasör v519 mega dağıtma adımıyla oluşturuldu.

Dosya yapısı:

- `src/App.jsx`
  - Sadece küçük giriş dosyasıdır.
- `src/app/ZRCAppShell.jsx`
  - Ana uygulama kabuğudur.
- `src/app/ZRCAppTopLevel.jsx`
  - App fonksiyonu öncesindeki sabitler ve helperlar burada tutulur.

Amaç:
- App.jsx dosyasını devasa dosya olmaktan çıkarmak
- Sonraki büyük parçalamaları daha kontrollü yapmak
- Çalışan davranışı değiştirmeden dosya yapısını büyütmek

Not:
- Bu adım storage/navigation/login/auth akışına dokunmaz.
- Build geçmezse script rollback yapar.
