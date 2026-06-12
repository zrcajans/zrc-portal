# ZRC PROJE DEVİR DOSYASI SAFE v400

Tarih: Fri Jun 12 11:40:55 +03 2026

## Güvenli Nokta
- Tag: zrc-safe-v400-mobile-final-sync
- Mobil kurulum + bildirim senkron sonrası güvenli devir noktası.

## Tamamlanan Ana İşler
- Mobil ekran sade hale getirildi.
- Mobilde sadece proje/görev odaklı kullanım mantığı kuruldu.
- Mobilde görev oluşturma akışı oluşturuldu.
- Çoklu görevli seçimi eklendi.
- Mobil görev kartlarında Aktife Al fonksiyonu eklendi.
- Aktife alınan görevlerin kopya kalması düzeltildi.
- Mobilde Aktif görevler gizlendi.
- Proje yenileme / selectedProject karışması düzeltildi.
- Webden silinen görevlerin mobilde kalması düzeltildi.
- Mobil bildirim paneli taşma sorunu düzeltildi.
- Bildirim okundu/sayı senkronu için v399 düzeni eklendi.
- Web sol sidebar logo müdahalesi geri alındı.
- Mobil logo sadece mobil başlıkta kullanılacak şekilde ayrıldı.

## Kritik Kurallar
- Web sidebar / masaüstü sol menüye açık onay olmadan dokunulmayacak.
- Mobil değişiklikler mümkün olduğunca mobil workspace ve src/zrc-mobile.css üzerinden yapılacak.
- Görev kaydetme, proje değiştirme ve Supabase merge mantığına rastgele müdahale edilmeyecek.
- Terminal komutları yedek + build + commit + push akışıyla verilecek.

## Son Commitler
24205a6 bildirim okundu senkronu v399-safe
d5aeb52 mobil final devir noktasi v398-safe
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
1fe202e mobil gorevi aktif kolonuna aktar v387-safe

## Build Label
10:const ZRC_APP_BUILD_LABEL = 'v399-safe-notification-read-sync';
34:      build: ZRC_APP_BUILD_LABEL,
47:      window.localStorage.setItem('zrc-last-error-build', ZRC_APP_BUILD_LABEL);
60:      `Build: ${ZRC_APP_BUILD_LABEL}`,
677:        `Build: ${ZRC_APP_BUILD_LABEL}`,
