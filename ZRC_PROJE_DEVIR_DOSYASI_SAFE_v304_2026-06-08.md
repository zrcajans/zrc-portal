# ZRC PROJE DEVİR DOSYASI — SAFE v304

Tarih: 2026-06-08  
Canlı portal: portal.zrcajans.com  
GitHub repo: zrcajans/zrc-portal  
Supabase proje: zrc-is-takip  
Doğru Storage bucket: project-files  
Kullanılmayacak bucket: zrc-files  
Son commit: aac1974

## Güncel durum

ZRC Portal; ZRC AJANS için geliştirilen iş takip, ekip yönetimi, görev, dosya, takvim, bildirim ve ileride mobil/masaüstü uygulamalara genişleyecek özel operasyon sistemidir.

## v270 sonrası yapılan ana işler

- Merkezi ekip hesabı sistemi çalışır hale getirildi.
- Ekip üyeleri kullanıcı adı + şifre ile giriş yapabiliyor.
- Ekip üyesi yetkili olduğu projede görev oluşturup başkasına görev atayabiliyor.
- Görev atama bildirimleri netleştirildi.
- Dosya indirme ve kalıcı silme akışı iyileştirildi.
- Mobil/PWA kurulum yönlendirmesi eklendi.
- Manifest, PWA ikonları ve service worker eklendi.
- PWA önbellek sistemi güvenli moda alındı.
- Yeni sürüm bannerı kaldırıldı.
- PWA kurtarma adresi eklendi: https://portal.zrcajans.com/?zrc-reset-pwa=1
- Mobil yatay taşma ve iPhone yükseklik sorunları düzeltildi.
- Sağ alttaki Supabase kutusu normal kullanımda gizlendi.
- Tarayıcı sekme logosu ZRC logosu yapıldı.
- Açılışta ZRC logolu yükleme ekranı eklendi.
- Açılış ekranı takılırsa Yenile / PWA Temizle butonları eklendi.

## Çalışma yöntemi

Bundan sonra tercih edilen yöntem:

1. Assistant tek parça Terminal kodu verir.
2. Kod dosyayı yedekler.
3. Gerekli düzenlemeyi yapar.
4. npm run build çalıştırır.
5. Git commit ve push yapar.
6. Vercel otomatik canlıya alır.

Yedekler local_backups klasöründe tutulur ve GitHub’a gönderilmez.

## Önemli kurallar

- SUPABASE_SERVICE_ROLE_KEY asla sohbete veya GitHub’a yazılmamalı.
- Doğru bucket: project-files
- zrc-files kullanılmamalı.
- Gerçek ana proje: Çalışma
- Demo proje geri gelmemeli.
- Müşteri listesi başlangıçta boş kabul edilmeli.
- Sidebar hassas; gerekmedikçe dokunulmamalı.
- Kullanıcı opak, temiz, premium tasarım istiyor; glass/camsı görünüm istenmiyor.

## Büyük yol haritası

Kısa vade:
- Web portalı kullanılabilir hale getirmek.
- Görev, ekip, dosya, takvim, bildirim akışını sağlamlaştırmak.
- Mobil/PWA kullanımını rahatlatmak.

Orta vade:
- Müşteri/misafir paneli.
- Daha güçlü bildirim sistemi.
- Daha profesyonel mobil arayüz.

Uzun vade:
- iOS uygulama.
- Android uygulama.
- macOS uygulama.
- Windows uygulama.
- zrcajans.com tanıtım sitesi.
- Tanıtım sitesinden portal.zrcajans.com giriş bağlantısı.
