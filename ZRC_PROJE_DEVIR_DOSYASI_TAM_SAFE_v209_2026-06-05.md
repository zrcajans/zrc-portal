# ZRC PROJE DEVİR / TAM KAPSAMLI YEDEK NOTU

**Tarih:** 2026-06-05  
**Durum etiketi:** `SAFE_POINT_v209_SITE_ACILIYOR`  
**Git tag:** `zrc-safe-v209-site-aciliyor`  
**Amaç:** Bu dosya kod yedeği değil; projenin hedeflerini, mevcut güvenli durumunu, çalışma tarzını ve sonraki kişiye/AI’ye devir bilgisini anlatan rehber dosyadır.

---

## 1. Bu Dosya Ne İşe Yarar?

Bu `.md` dosyası bir **Markdown not / devir dosyasıdır**.

Şunları yapar:

- Projenin genel hedeflerini kayıt altında tutar.
- Son güvenli çalışan durumu açıklar.
- Hangi dosyaların son güvenli kabul edildiğini söyler.
- Hangi konuların henüz çözülmediğini belirtir.
- Yeni sohbette veya başka bir yazılımcıya/AI’ye projeyi anlatmak için kullanılır.
- “Bu projede nerede kalmıştık?” sorusuna cevap verir.

Şunları yapmaz:

- Siteyi çalıştırmaz.
- Kodların tamamını içinde taşımaz.
- `App.jsx`, `Sidebar.jsx`, `TopNavbar.jsx` gibi dosyaların tam kod yedeği değildir.
- GitHub/Vercel/Supabase yerine geçmez.

---

## 2. Asıl Kod Yedeği Nerede?

Asıl kod yedeği bu `.md` dosyası değil, Git/GitHub tarafındaki commit ve tag sistemidir.

Alınan güvenli tag:

```bash
zrc-safe-v209-site-aciliyor
```

Bu tag, sadece `App.jsx` veya `TopNavbar.jsx` değil, o an Git’te kayıtlı olan **tüm proje dosyalarını** kapsar:

- `src/App.jsx`
- `src/components/Layout/TopNavbar.jsx`
- `src/components/Layout/Sidebar.jsx`
- `src/components/Modals/...`
- `src/supabaseClient.js`
- `package.json`
- `vite.config.js`
- `vercel.json`
- Diğer tüm repo dosyaları

Yani `Sidebar.jsx` ayrıca bu dosyanın içinde kod olarak yazmıyor olabilir; ama Git tag alınan anda repo içinde hangi `Sidebar.jsx` varsa, o tag’in içine dahildir.

---

## 3. “Son Çalışan App.jsx” Ne Demek?

Son çalışan App dosyası:

```txt
App_beyaz_ekran_projectList_fix_v209.txt
```

Bunun anlamı:

- Bu TXT dosyasındaki içerik `src/App.jsx` içine yapıştırıldı.
- Commit/push sonrası canlı site tekrar açıldı.
- Bu yüzden `src/App.jsx` için güvenli referans bu dosyadır.

Önemli: Bu `.md` dosyasının içinde `App.jsx` kodlarının tamamı yoktur. Sadece hangi sürümün güvenli olduğu yazılıdır.

---

## 4. Son Güvenli Dosya Referansları

### App.jsx

```txt
Son güvenli App.jsx referansı:
App_beyaz_ekran_projectList_fix_v209.txt
```

Durum:

- Site beyaz ekrandan çıktı.
- `highlightedProject is not defined` hatası temizlendi.
- `projectList is not defined` hatası temizlendi.
- Takvimden görev oluşturma hâlâ çözülmüş sayılmıyor.

### TopNavbar.jsx

```txt
Son güvenli TopNavbar.jsx referansı:
TopNavbar_cikis_onayli_estetik_v203.txt
```

Durum:

- Mesajlar/Bildirimler üstte yatay buton olarak duruyor.
- Üst bar Projeler sayfası hariç biraz daha kalın.
- Çıkış butonu estetik hale getirildi.
- Çıkışa tıklayınca direkt çıkış yapmıyor, onay istiyor.

### Sidebar.jsx

Sidebar için ayrı son TXT kod yedeği bu dosyanın içinde yoktur.

Ama:

- `src/components/Layout/Sidebar.jsx`, Git tag içine dahildir.
- Tag alındığı anda repo içindeki çalışan Sidebar neyse, o kod yedeklenmiştir.
- Sidebar hassas dosyadır; gereksiz dokunulmamalıdır.
- Kullanıcı “A şeridi” derse eski/normal sol turuncu menü mantığı kastedilir.
- Kullanıcı camsı/glass görünümü şimdilik istemiyor.
- Opak, sade, sol turuncu şerit mantığı korunmalıdır.

---

## 5. Projenin Ana Hedefi

ZRC AJANS için Cubicl benzeri ama ZRC’ye özel bir iş takip sistemi yapmak.

Kısa vadeli hedef:

- Web portalı hızlıca kullanılabilir hale getirmek.
- Ajans içi iş takibi, görev, dosya, müşteri, proje ve ekip yönetimini minimum hatayla çalışır duruma getirmek.
- Sürekli mikro testlerle zaman kaybetmeden görünür kritik eksikleri çözmek.

Orta vadeli hedef:

- Paneli görsel olarak daha profesyonel ve ajansa yakışır hale getirmek.
- iOS mobil uyumluluğunu güçlendirmek.
- Bildirim sistemini kullanılabilir hale getirmek.
- Takvim, görev, bildirim ve dosya tarafını daha bütünleşik hale getirmek.

Uzun vadeli hedef:

- iOS mobil uygulama.
- Android mobil uygulama.
- MacOS masaüstü uygulaması.
- Windows masaüstü uygulaması.
- ZRC AJANS tanıtım web sitesi.
- Tanıtım sitesinden iş takip paneline giriş/panel butonu.

---

## 6. Web Sitesi / Domain Planı

### İş takip sistemi

Ana portal:

```txt
portal.zrcajans.com
```

Bu sistem yeni domain almayacak. ZRC domaini altında subdomain olarak devam edecek.

### Tanıtım web sitesi

Tanıtım sitesi şimdilik öncelik değildir.

Plan:

- `zrcajans.com` ana tanıtım sitesi olacak.
- Envato üyeliği ve hazır WordPress tema kullanılabilir.
- Tanıtım sitesinde sağ üstte “Giriş / Panel” butonu olacak.
- Bu buton `portal.zrcajans.com` adresine yönlendirecek.
- Kullanıcı şu an tanıtım web sitesi için bütçe ayırmak istemiyor; sonra yapılacak.

---

## 7. Mobil / Masaüstü Uygulama Planı

Hedefler:

- iOS uygulama.
- Android uygulama.
- MacOS masaüstü uygulaması.
- Windows masaüstü uygulaması.

Mobil uygulamada istenenler:

- Bildirim alabilmeli.
- Görevleri görebilmeli.
- Görev oluşturma/düzenleme yapılabilmeli.
- Dosya ve yorum akışı kullanılabilmeli.
- Paneldeki temel iş takip işlemleri yapılabilmeli.

Bu hedefler uzun vadeli hedeftir. Şu an öncelik web portalını düzgün kullanılabilir hale getirmektir.

---

## 8. Mevcut Teknik Sistem

### Frontend

- React
- Vite
- Tailwind CSS
- Vercel yayını

### Backend / Veritabanı

- Supabase Free
- Supabase Auth
- Supabase Database
- Supabase Storage

### Canlı sistem

```txt
Canlı portal: portal.zrcajans.com
Vercel default: zrc-portal.vercel.app
GitHub repo: zrcajans/zrc-portal
Supabase proje: zrc-is-takip
Doğru Storage bucket: project-files
Kullanılmayacak bucket: zrc-files
```

---

## 9. Supabase Durumu

Daha önce doğrulananlar:

- Supabase projesi oluşturuldu.
- SQL şeması çalıştırıldı.
- Auth kullanıcısı oluşturuldu.
- Kullanıcı `profiles`, `workspaces`, `workspace_members` tablolarına bağlandı.
- Supabase bağlantı testi canlıda çalıştı.
- Görev ekleme ve yenileme sonrası kalıcılık doğrulandı.
- Proje oluşturma/silme Supabase ile senkron çalıştı.
- Kolon silme/düzenleme kalıcı çalıştı.
- Dosya yükleme ve yenileme sonrası kalıcılık doğrulandı.

Doğru Storage bucket:

```txt
project-files
```

Yanlışlıkla oluşturulan ve kullanılmayacak bucket:

```txt
zrc-files
```

---

## 10. Mevcut Gerçek İş Verisi Mantığı

### Gerçek proje

```txt
Çalışma
```

### Demo/test proje

```txt
E-Ticaret Arayüz Tasarımı
```

Bu demo/test proje silinmiş kabul edilir.

### Müşteriler

Müşteri listesi boş olmalı. Hedef müşteri sayısı:

```txt
0
```

### Ekip

Şimdilik gerçek ekip yalnızca ZRC AJANS / kullanıcının kendi hesabı olmalı.

Test/dummy ekip üyeleri eklenmemeli.

---

## 11. Korunması Gereken Kullanıcı Tercihleri

Kullanıcı şunları özellikle istiyor:

- Kodlarda parça parça ekleme istemiyor.
- Dosyanın komple halini TXT olarak istiyor.
- Eskiyi silip yenisini yapıştırmayı tercih ediyor.
- Hangi işlemin hangi programda yapılacağı açık yazılmalı.
- Terminal komutu gerekiyorsa net verilmeli.
- Gereksiz uzun açıklama istemiyor.
- Görsel olarak konturları sevmiyor.
- Daha sade, yumuşak, premium ve dinamik arayüz istiyor.
- Daha önce çalışan/onaylanan davranışlar bozulmamalı.
- Özellikle Sidebar gibi hassas dosyalar gereksiz kurcalanmamalı.
- Tanıtım sitesi şimdilik sonraya bırakılmalı.
- Öncelik iş takip sisteminin kullanılabilir hale gelmesidir.

---

## 12. Ana Sayfa Son Durum

Ana Sayfa’da hedeflenen yapı:

- Sol üst: Size Atanan Görevler
- Sol alt: Yapışkan Notlar
- Sağ: Takvimim

Yapışkan Notlar tarafında hedeflenenler:

- + butonuyla başlık + detay alanı açılmalı.
- Not ekleme paneli küçük, estetik, dokulu, floating hissinde olmalı.
- Notlar listede başlık + kısa detay olarak görünmeli.
- Nota tıklanınca başlık ve detay düzenlenebilmeli.
- Silme direkt olmamalı, onay istemeli.

Ana Sayfa’daki üç panelde dış siyah kontur istenmiyor.

---

## 13. Üst Bar / TopNavbar Son Durum

TopNavbar son güvenli referans:

```txt
TopNavbar_cikis_onayli_estetik_v203.txt
```

Hedef görünüm:

- Mesajlar ve Bildirimler ortada yatay buton şeklinde.
- Konturları kaldırılmış.
- Sağda tema ve çıkış alanı.
- Çıkış butonu direkt çıkış yapmamalı; onay istemeli.
- Üst bar Projeler sayfası hariç biraz daha kalın olmalı.

---

## 14. Henüz Çözülmeyen Kritik Konu

### Takvimden görev oluşturma

Kullanıcının net istediği:

- Ana Sayfa takviminde herhangi bir güne tıklayınca görev oluşturma paneli açılsın.
- Takvimim menüsünde herhangi bir güne tıklayınca görev oluşturma paneli açılsın.
- Diğer takvim/zaman çizelgesi alanlarında da güne/periyoda tıklayınca görev oluşturma paneli açılsın.
- Açılan panel, Projeler menüsündeki mevcut Görev Oluştur paneliyle aynı algıda olmalı.
- Sadece genel takvimden açıldığı için proje seçimi sorulmalı.
- Görev oluşturulunca seçilen projedeki doğru yere kaydedilmeli.
- Kullanıcı Projeler sayfasına atılmamalı.
- Mevcut görev oluşturma mantığı bozulmamalı.

Önemli uyarı:

Aşağıdaki değişkenler daha önce beyaz ekran hatası verdi. Sonraki kodlarda kullanılmamalı:

```txt
highlightedProject
projectList
```

---

## 15. Son Beyaz Ekran Hataları

### Hata 1

```txt
highlightedProject is not defined
```

Temizlendi.

### Hata 2

```txt
projectList is not defined
```

Temizlendi.

Son güvenli App dosyası bu yüzden:

```txt
App_beyaz_ekran_projectList_fix_v209.txt
```

---

## 16. Geri Dönüş / Restore Mantığı

Eğer ileride site bozulursa güvenli noktaya dönmek için Git tag kullanılabilir.

Güvenli tag:

```bash
zrc-safe-v209-site-aciliyor
```

Bu tag, o anki tüm repo dosyalarını kapsar.

Yani bu sadece App veya TopNavbar değil, Sidebar dahil tüm projenin o anki kod durumudur.

---

## 17. Yeni Sohbete / Başka AI’ye Verilecek Kısa Talimat

Yeni sohbette şöyle denebilir:

```txt
Bu ZRC iş takip sistemi projemin devir dosyasıdır.
Önce bu dosyayı oku.
Son güvenli durum SAFE_POINT_v209_SITE_ACILIYOR.
Canlı site açılıyor.
Takvimden görev oluşturma henüz çözülmedi.
highlightedProject ve projectList değişkenlerini kullanma.
Mevcut Projeler > Görev Oluştur modal mantığını bozmadan takvim gün tıklamasına bağla.
Kod verirken komple dosya ver, parça parça ekletme.
```

---

## 18. Sonraki Teknik Yaklaşım Önerisi

Takvimden görev oluşturma tekrar ele alınırken:

1. Önce mevcut Projeler > Oluştur butonunun çalıştığı fonksiyon bulunmalı.
2. O fonksiyonun hangi state’leri açtığı tespit edilmeli.
3. Takvim gün tıklaması, aynı state akışına bağlanmalı.
4. Genel takvimden geldiği için sadece proje seçimi eklenmeli.
5. `selectedProject` dışında tanımsız değişken kullanılmamalı.
6. Sidebar, TopNavbar, Supabase okuma/yazma gibi çalışan alanlara dokunulmamalı.
7. Büyük refactor yapılmamalı.
8. Önce siteyi açan güvenli App baz alınmalı.

---

## 19. Dosya / Kod Yedeği Konusunda Net Ayrım

### `.md` dosyası

- Proje hafızasıdır.
- Hedefleri ve mevcut durumu anlatır.
- Kodların tamamını içermez.

### `.txt` dosyaları

- ChatGPT tarafından hazırlanan komple dosya içerikleridir.
- Kullanıcı bunları VS Code’a yapıştırırsa gerçek kod olur.

### Git commit / Git tag

- Gerçek kod yedeğidir.
- Tüm repo dosyalarını kapsar.
- Geri dönüş için en güvenli yöntemdir.

---

## 20. Bu Noktanın Özeti

```txt
Site açılıyor.
Son güvenli App.jsx: App_beyaz_ekran_projectList_fix_v209.txt
Son güvenli TopNavbar.jsx: TopNavbar_cikis_onayli_estetik_v203.txt
Sidebar.jsx ayrıca kod olarak bu MD içinde yok ama Git tag içinde var.
Takvimden görev oluşturma henüz çözülmedi.
Tanımsız değişkenlerden kaçınılmalı.
Geri dönüş tag’i: zrc-safe-v209-site-aciliyor
```
