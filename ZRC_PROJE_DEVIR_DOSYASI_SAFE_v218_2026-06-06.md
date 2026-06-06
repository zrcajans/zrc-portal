# ZRC PROJE DEVİR / YEDEK DOSYASI

**Tarih:** 2026-06-06  
**Durum etiketi:** `SAFE_POINT_v218_TASKMODAL_ESKI_TASARIM_KISI_FIX`  
**Önceki güvenli tag:** `zrc-safe-v209-site-aciliyor`  
**Yeni önerilen tag:** `zrc-safe-v218-taskmodal-kisi-fix`

---

## 1. Bu Yedek Ne Anlatıyor?

Bu dosya kodun kendisi değildir. Projenin o anki güvenli durumunu, hangi dosyaların kullanıldığını, hangi hedeflerin devam ettiğini ve sonraki adımda neye dikkat edilmesi gerektiğini anlatan devir/yedek notudur.

Gerçek kod yedeği Git commit ve Git tag ile alınır.

---

## 2. Son Durum Özeti

Şu an ZRC iş takip sistemi canlıda açılıyor ve kullanılabilir durumda.

Son çalışılan alan:

- Görev oluşturma paneli
- Takvimden güne tıklayınca görev oluşturma
- TaskModal tasarım/davranış düzenlemeleri
- Görevli ve takip eden kişi seçimi
- Tarihlerin Takvimim içinde doğru güne düşmesi

---

## 3. Son Kullanılması Gereken Dosyalar

### App.jsx

Son güvenli App referansı:

```txt
App_takvim_tarih_kayit_gercek_kisi_v216.txt
```

Bu dosyada:

- Takvimden görev oluşturma akışı korunur.
- Türkçe tarih formatı Supabase için `YYYY-MM-DD` formatına çevrilebilir.
- Takvimim içinde tarihli görevlerin doğru güne düşmesi hedeflenir.
- Görev kişi seçimi için gerçek kişi listesi App tarafından filtrelenir.
- `setSelectedColumnId`, `highlightedProject`, `projectList` kullanılmaz.

### TaskModal.jsx

Son güvenli TaskModal referansı:

```txt
TaskModal_gorev_kisi_enes_gizli_v218.txt
```

Bu dosyada:

- Tasarım eski/yumuşak hale geri alınmıştır.
- ESC ile modal kapanır.
- Modal dışına tıklayınca kapanır.
- Dış tıklama ile kapanırsa yazılan taslak hafızada kalır.
- Avatar/base64 yazı taşması sorunu çözülmüştür.
- Sahip alanı kaldırılmıştır.
- Demo kişiler gizlenmiştir.
- `Enes Zariç` seçeneği Görevliler ve Takip Edenler listesinden kaldırılmıştır.
- Görevliler/Takip Edenler listesinde sistem dışı demo kişiler görünmemelidir.

---

## 4. Çalışan ve Korunması Gereken Davranışlar

Aşağıdakiler korunmalı:

- Site açılıyor.
- Görev oluşturma modalı Projeler menüsünden açılıyor.
- Takvimden güne tıklayınca aynı TaskModal açılıyor.
- Takvimden açılan görevde başlangıç tarihi seçilen gün geliyor.
- Bitiş tarihi boş geliyor.
- Projeler menüsünden oluşturulursa proje seçimi kilitli kalıyor.
- Takvimden oluşturulursa proje seçimi yapılabiliyor.
- ESC ile kapatma çalışıyor.
- Modal dışına tıklayınca kapatma çalışıyor.
- Modal dışına tıklayınca yazılanlar kaybolmamalı.
- Sidebar ve TopNavbar’a dokunulmamalı.

---

## 5. Devam Eden Hedefler

Kısa vadeli hedef:

- Web portalı ajans içinde hızlıca kullanılabilir hale getirmek.
- Görev, proje, dosya, müşteri, ekip ve takvim akışlarını stabil yapmak.

Orta vadeli hedef:

- Paneli görsel olarak daha premium hale getirmek.
- iOS mobil uyumluluğunu iyileştirmek.
- Bildirimleri kullanılabilir hale getirmek.
- Takvim, görev ve bildirim sistemini daha bütünleşik hale getirmek.

Uzun vadeli hedef:

- iOS mobil uygulama
- Android mobil uygulama
- MacOS masaüstü uygulaması
- Windows masaüstü uygulaması
- `zrcajans.com` tanıtım sitesi
- Tanıtım sitesinden `portal.zrcajans.com` panel giriş butonu

---

## 6. Güncel Sistem Bilgileri

```txt
Canlı portal: portal.zrcajans.com
Vercel default: zrc-portal.vercel.app
GitHub repo: zrcajans/zrc-portal
Supabase proje: zrc-is-takip
Doğru Storage bucket: project-files
Kullanılmayacak bucket: zrc-files
```

---

## 7. Dikkat Edilecek Kritik Noktalar

Aşağıdaki değişkenler tekrar kullanılmamalı:

```txt
highlightedProject
projectList
setSelectedColumnId
```

Bu değişkenler önceki denemelerde beyaz ekran / çalışmama sorunlarına sebep oldu.

Görev oluşturma modalında gereksiz büyük tasarım değişikliği yapılmamalı. Kullanıcı eski/yumuşak TaskModal tasarımını daha iyi buldu.

---

## 8. Yeni Git Yedek Komutları

Kodlar commit/push edildikten sonra yeni tag alınabilir:

```bash
git tag zrc-safe-v218-taskmodal-kisi-fix
git push origin zrc-safe-v218-taskmodal-kisi-fix
```

Bu tag alındığında repo içindeki tüm dosyaların o anki hali yedeklenmiş olur.

---

## 9. Yeni Sohbet / Başka AI İçin Kısa Talimat

```txt
Bu ZRC iş takip sistemi devir dosyasıdır.
Son güvenli durum SAFE_POINT_v218_TASKMODAL_ESKI_TASARIM_KISI_FIX.
Canlı site açılıyor.
Son App referansı App_takvim_tarih_kayit_gercek_kisi_v216.txt.
Son TaskModal referansı TaskModal_gorev_kisi_enes_gizli_v218.txt.
Sidebar ve TopNavbar’a dokunma.
highlightedProject, projectList ve setSelectedColumnId kullanma.
TaskModal eski/yumuşak tasarımda kalmalı.
Görevli ve Takip Edenler listesinde demo kişiler ve Enes Zariç görünmemeli.
Kod verirken komple dosya ver, parça parça ekletme.
```
