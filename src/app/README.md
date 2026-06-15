# ZRC App Shell

Bu klasör v518 ile oluşturuldu.

`src/App.jsx` artık küçük giriş dosyasıdır. Büyük çalışan uygulama kabuğu bu dosyadadır:

- `src/app/ZRCAppShell.jsx`

Amaç:
- App.jsx dosyasını 19K satırdan mini entry dosyasına düşürmek
- sonraki refactorları daha kontrollü yapmak
- mevcut çalışan mantığa dokunmadan dosya yapısını büyütmek

Not:
- Bu adım davranış değiştirmez.
- Yalnızca dosya konumu ve import yolları düzenlenmiştir.
