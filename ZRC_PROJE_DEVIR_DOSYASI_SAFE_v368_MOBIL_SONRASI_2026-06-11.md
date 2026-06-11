# ZRC PROJE DEVİR DOSYASI SAFE v368 - MOBİL SONRASI

Tarih: Thu Jun 11 18:14:27 +03 2026

## Durum
- Mobil görünüm için ilk geçiş paketleri uygulandı.
- Ana sistem mobil öncesi güvenli noktadan sonra bozulmadan ilerledi.
- Görev oluşturma / eski görevin silinmesi hatası düzeltilmiş durumda.
- Ekip hesabı kullanıcı adı + şifre ile giriş çalışıyor.
- Müşteri ekranı sadeleştirildi.
- Debug / sürüm / demo kalıntıları temizlendi.
- Favicon ve sekme başlığı düzenlendi.
- Canlı sürüm kontrol dosyası eklendi.
- pbcopy rapor standardı benimsendi.

## Mobil Paketler
- v360: mobil temel rahatlatma
- v361: mobil alt menü
- v362: mobil görev panosu rahatlatma
- v364: mobil üst bar ve paneller
- v365: mobil form ve liste rahatlatma
- v366: iPhone güvenli alan
- v367: mobil sonrası güvenli kilit

## Güvenli Tag
- zrc-safe-v367-mobile-final
- zrc-safe-v368-mobile-devir

## Kritik Kural
- Görev oluşturma, board yükleme ve TaskModal ID üretimi alanlarına açık onay olmadan dokunulmayacak.
- Mobil düzenlemeler şimdilik CSS tarafında tutuldu; veri mantığına dokunulmadı.

## Son Commitler
d180c1c mobil sonrasi guvenli kilit v367-safe
56db158 mobil iphone guvenli alan v366-safe
ad0cb3b mobil iphone guvenli alan v366-safe
c545599 mobil form ve liste rahatlatma v365-safe
153b41a mobil ust bar ve paneller v364-safe
63736ec mobil ust bar ve paneller v364-safe
137aeef canli surum kontrol dosyasi v363-safe
2932a0f mobil gorev panosu rahatlatma v362-safe
ea5a941 mobil alt menu v361-safe
835692e mobil temel rahatlatma v360-safe
5c3a6b1 devir dosyasi v359 safe
3990862 gorunen demo yazilarini temizle v354-safe
eff0e40 favicon ve sekme marka duzeni v351-safe
555417d surum ve guncelleme uyarilarini temizle v350-safe
deb2180 teknik debug rozetlerini gizle v349-safe
7299b6c musteri listesinde kullanici adi goster v348-safe
192dd23 musteri formuna giris hesabi ekle v347-safe
bf2ca78 musteri ekranini sadelestir v346b-safe
392bd8c gorev sistemi guvenli nokta v340-safe
2f51ad4 kesin gorev olusturma duzeltmesi v339c
23ec096 acil gorev sistemi guvenli noktaya al 20260610-102421
eadbebf profil ayar api kapsam genisletme v329-safe
465241b profil scroll kesin fix v328-safe
3648efe profil scroll kesin fix v328-safe
8197d25 profil ic scroll fix v328-safe

## Build Label
10:const ZRC_APP_BUILD_LABEL = 'v367-mobile-final-lock';
34:      build: ZRC_APP_BUILD_LABEL,
47:      window.localStorage.setItem('zrc-last-error-build', ZRC_APP_BUILD_LABEL);
60:      `Build: ${ZRC_APP_BUILD_LABEL}`,
677:        `Build: ${ZRC_APP_BUILD_LABEL}`,
1110:    const zrcBuildShortLabel = ZRC_APP_BUILD_LABEL.match(/^v\d+/)?.[0] || ZRC_APP_BUILD_LABEL;
1280:      build: ZRC_APP_BUILD_LABEL,

## Mobil CSS
-rw-r--r--@ 1 enszrc  staff  12118 Jun 11 18:12 src/zrc-mobile.css

## Canlı Sürüm Dosyası
{
  "build": "v367-mobile-final-lock",
  "note": "Mobil paketleri sonrası güvenli sürüm.",
  "commit": "56db158",
  "createdAt": "2026-06-11T15:13:45.577Z"
}