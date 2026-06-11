# ZRC PROJE DEVİR DOSYASI SAFE v359

Tarih: Thu Jun 11 17:44:15 +03 2026

## Ana Yedek Mantığı
- Asıl yedek GitHub commit + push + tag sistemidir.
- Lokal ZIP sadece ek güvenliktir, ana yedek değildir.
- Bu devir dosyası proje hafızasıdır; kodun asıl yedeği Git geçmişi ve tag içindedir.

## Son Güvenli Nokta
- Tag: zrc-safe-v359-devir
- Mobil düzenleme öncesi güvenli durum.

## Mevcut Durum
- Görev oluşturunca eski görevin silinmesi düzeldi.
- Ekip hesabı kullanıcı adı + şifre ile giriş çalışıyor.
- Müşteri ekranı sadeleştirildi.
- Favicon / sekme başlığı düzenlendi.
- Debug / sürüm rozetleri temizlendi.
- Görünen demo yazıları temizlendi.
- pbcopy otomatik rapor kopyalama standardı benimsendi.

## Kritik Koruma
- Görev oluşturma, board yükleme ve TaskModal ID üretimi alanlarına açık onay olmadan dokunulmayacak.
- Yeni görev kontrolünde taskData.id değil editingTask kullanılacak.

## Mobil
- Mobil görünüm sorunlu.
- Mobil düzenleme ayrıca, kullanıcının önereceği yapıya göre yapılacak.

## Son Commitler
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
510c6ae profil panel scroll fix v326-safe
8189ad8 profil panel scroll fix v326-safe
0b58533 profil safe api baglanti v325-safe
d2440d4 profil ayar guvenli api temeli v324-safe
3ced989 guvenli v323 yayini tekrar tetikle
e5e5538 masaustu tasarim temizlik v323

## Mevcut Güvenli Tagler
zrc-safe-v209-site-aciliyor
zrc-safe-v218-taskmodal-kisi-fix
zrc-safe-v270-aciklama-takvim-duzenleme
zrc-safe-v304-mobil-pwa-acilis-temizlik
zrc-safe-v323-calisan-yayin
zrc-safe-v340-gorev-duzeldi
zrc-safe-v342-gorev-duzeldi
zrc-safe-v355-final-pre-mobile
zrc-safe-v358-final-before-mobile

## Build Label
9:const ZRC_APP_BUILD_LABEL = 'v354-safe-demo-yazi-temizlik';
33:      build: ZRC_APP_BUILD_LABEL,
46:      window.localStorage.setItem('zrc-last-error-build', ZRC_APP_BUILD_LABEL);
59:      `Build: ${ZRC_APP_BUILD_LABEL}`,
676:        `Build: ${ZRC_APP_BUILD_LABEL}`,
1109:    const zrcBuildShortLabel = ZRC_APP_BUILD_LABEL.match(/^v\d+/)?.[0] || ZRC_APP_BUILD_LABEL;
1279:      build: ZRC_APP_BUILD_LABEL,
