# ZRC PROJE DEVİR DOSYASI SAFE v398

Tarih: Fri Jun 12 11:36:22 +03 2026

## Güvenli Nokta
- Tag: zrc-safe-v398-mobile-final
- Mobil final kurulum sonrası güvenli nokta.

## Son Durum
- Web sol sidebar eski haline döndürüldü.
- Mobil proje ekranı sadeleştirildi.
- Mobilde proje seçimi, görev oluşturma ve görevleri Aktif kolonuna alma çalışıyor.
- Mobilde Aktif kolonundaki görevler gösterilmiyor.
- Mobilde sadece bilgilendirme / hızlı işlem mantığı benimsendi.
- Logo dosyası public/zrc-logo.png üzerinden kullanılacak şekilde ayarlandı.
- Seçili proje başlığı ortalandı.

## Kritik Kurallar
- Web sidebar / masaüstü sol menüye açık onay olmadan dokunulmayacak.
- Görev taşıma / görev kayıt / proje yükleme mantığına rastgele müdahale edilmeyecek.
- Mobil değişiklikler mümkün olduğunca sadece src/zrc-mobile.css ve mobil workspace alanında yapılacak.
- Terminal komutları otomatik yedek + build + commit + push yapacak şekilde verilecek.

## Son Commitler
8a224dd mobil final devir noktasi v398-safe
3de20d8 sadece mobil logo final v397-safe
79f7bdc web sol ust logo mudahalesini geri al v396-safe
3dc1d82 mevcut logo uygula ve secili proje ortala v395b-safe
d968b3e logo gorunurlugu ve secili proje ortalama v394-safe
3c92f70 logo kesin uygula ve seffaf renkleri kaldir v393b-safe
aaf392f mobil logo ve pastel secili proje v393-safe
062caa4 mobil proje secimi tasarim toparlama v392-safe
d91a14b mobil proje secimi ve aktif gorev gizleme v391-safe
26823ac mobil secili proje oku ve dogal scroll v390b-safe
fbc88e8 mobil kart ve yenileme duzeltmeleri v389-safe
4ed4e0c mobil aktife al butonu ve kopya engeli v388-safe

## Build Label
10:const ZRC_APP_BUILD_LABEL = 'v397-safe-mobile-logo-final';
34:      build: ZRC_APP_BUILD_LABEL,
47:      window.localStorage.setItem('zrc-last-error-build', ZRC_APP_BUILD_LABEL);
60:      `Build: ${ZRC_APP_BUILD_LABEL}`,
677:        `Build: ${ZRC_APP_BUILD_LABEL}`,
