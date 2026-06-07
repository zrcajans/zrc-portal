# ZRC PROJE DEVİR DOSYASI — SAFE v270

Tarih: 2026-06-08  
Güvenli nokta etiketi: `zrc-safe-v270-aciklama-takvim-duzenleme`  
GitHub repo: `zrcajans/zrc-portal`  
Canlı adres: `portal.zrcajans.com`  
Supabase proje adı: `zrc-is-takip`  
Doğru Supabase Storage bucket: `project-files`  
Kullanılmayacak bucket: `zrc-files`

---

## 1. Güncel güvenli durum

Bu dosya, v270 sonrası güvenli proje durumunu anlatır. Bu noktada aşağıdaki işler çalışır kabul edilir:

- Vercel yayını aktif.
- Supabase bağlantısı aktif.
- Merkezi ekip hesabı sistemi aktif.
- Ekip üyesi kullanıcı adı + şifre ile giriş yapabiliyor.
- `api/create-team-member.js` Vercel API route üzerinden Supabase Auth kullanıcısı oluşturuyor.
- Vercel içinde `SUPABASE_SERVICE_ROLE_KEY` environment variable eklendi.
- Yeni ekip hesabı localStorage tabanlı değil, Supabase/Vercel API tabanlı merkezi sistem olarak ele alınmalı.
- Test merkezi ekip üyesi olarak Abdullah hesabı açıldı.
- Proje altındaki Takvim / Zaman Çizelgesi / Gantt Çizelgesi ekip üyesinde sadece kendisine atanmış görevleri gösteriyor.
- Ana Sayfa > Takvimim de ekip üyesinde sadece kendisine atanmış görevleri gösteriyor.
- Görev oluşturma/düzenleme ekranında “Takip Edenler” alanı kaldırıldı.
- Takvim görünürlüğü sadece “Görevliler” alanı üzerinden çalışıyor.
- Bitiş tarihi boş bırakılabiliyor; otomatik başlangıç tarihi bitişe yazılmıyor.
- Eski görev düzenleme kaydetme sorunu için v269 düzeltmesi yapıldı.
- Açıklama alanındaki `[object Object]` sorunu v270 ile temizlendi.
- Görev oluşturma/düzenleme ekranındaki tarih penceresi dışarı tıklayınca kapanıyor.
- Genel opak/minimal tasarım dili yönünde ilk temizlikler yapıldı.

---

## 2. Son güvenli commit ve tag

Son güvenli tag:

```bash
zrc-safe-v270-aciklama-takvim-duzenleme
```

Bu tag, sadece `App.jsx` veya `TaskModal.jsx` değil, o andaki tüm projeyi işaretler:

- `src/App.jsx`
- `src/components/Modals/TaskModal.jsx`
- `src/components/Layout/Sidebar.jsx`
- `src/components/Layout/TopNavbar.jsx`
- `api/create-team-member.js`
- diğer tüm proje dosyaları

---

## 3. Bu güvenli noktaya geri dönme

Eğer ileride proje bozulursa VS Code Terminal’de:

```bash
git checkout zrc-safe-v270-aciklama-takvim-duzenleme
```

Sadece kontrol amaçlı bakmak için bu yeterlidir.

Bu noktayı ana dala geri almak gerekirse dikkatli yapılmalıdır. Gerekirse önce yeni branch aç:

```bash
git checkout -b geri-donus-v270 zrc-safe-v270-aciklama-takvim-duzenleme
```

---

## 4. Önemli sistem bilgileri

### Canlı sistem

- Canlı adres: `portal.zrcajans.com`
- Vercel proje: `zrc-portal`
- GitHub repo: `zrcajans/zrc-portal`
- Supabase proje: `zrc-is-takip`

### Supabase Storage

Doğru bucket:

```txt
project-files
```

Yanlışlıkla oluşturulan ve kullanılmaması gereken bucket:

```txt
zrc-files
```

### Environment variables

Vercel içinde bulunması gerekenler:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

`SUPABASE_SERVICE_ROLE_KEY` sadece Vercel Environment Variables içine yazılmalı. Kod dosyalarına, GitHub’a veya sohbete yazılmamalı.

---

## 5. Ekip hesabı sistemi

v258 sonrası merkezi sistem aktif kabul edilir.

API dosyası:

```txt
api/create-team-member.js
```

Mantık:

- ZRC hesabı ekip üyesi oluşturur.
- API Supabase service role key ile Supabase Auth kullanıcısı açar.
- Kullanıcı adıyla giriş için gizli e-posta formatı kullanılır:

```txt
kullaniciadi@zrc.local
```

Örnek:

```txt
abdullah@zrc.local
```

Kullanıcı girişte sadece kullanıcı adı ve şifre yazar:

```txt
abdullah
12345
```

---

## 6. Abdullah / ekip üyesi görünürlük kuralları

Ekip üyesi için güncel doğru mantık:

- Proje ekibine eklenmişse projeyi görebilir.
- Takvimlerde sadece kendisine görevli olarak atanmış işleri görür.
- Sadece takipçi olduğu işler takvimlerde görünmez.
- ZRC AJANS’a atanmış görevler Abdullah’ın takvimlerinde görünmez.
- Abdullah’a atanmış görevler Abdullah’ın takvimlerinde görünür.

Bu görünürlük şu alanlarda düzeltilmiş kabul edilir:

```txt
Projeler > Takvim
Projeler > Zaman Çizelgesi
Projeler > Gantt Çizelgesi
Ana Sayfa > Takvimim
```

---

## 7. Görev oluşturma / düzenleme ekranı

Güncel durum:

- “Takip Edenler” alanı kaldırıldı.
- “Görevliler” alanı kaldı.
- Takvim görünürlüğü sadece görevlilere göre çalışır.
- Başlangıç tarihi girilebilir.
- Bitiş tarihi boş bırakılabilir.
- Bitiş tarihi boşsa sistem kendiliğinden başlangıç tarihini bitişe yazmamalı.
- Tarih penceresi dışarı tıklayınca kapanmalı.
- Açıklama alanında `[object Object]` görünmemeli.
- Eski görev düzenlenince kaydedilebilir olmalı.

---

## 8. ZRC AJANS özel kullanıcı mantığı

`ZRC AJANS` sistem sahibi / patron kimliğidir.

Kurallar:

- ZRC AJANS her şeyi yönetebilir.
- ZRC AJANS görevli olarak seçilebilir.
- Abdullah gibi ekip hesabı ZRC AJANS seçili görevi kendi takviminde görmemelidir.
- ZRC AJANS, Proje Ayarları > Proje Ekibi içinde normal ekip üyesi gibi gösterilmemelidir.
- Enes Zariç kişi seçimi içinde geri gelmemeli.

---

## 9. Kabul edilmiş çalışma yöntemi

Kullanıcı kod güncellemesi yaparken parça parça ekleme istemiyor. Tercih edilen yöntem:

1. Assistant komple TXT dosyası verir.
2. Kullanıcı ilgili dosyanın içini komple siler.
3. Yeni içeriği yapıştırır.
4. `Command + S`
5. Terminal:

```bash
npm run build && git add ... && git commit -m "..." && git push
```

Her adımda hangi programda işlem yapılacağı açıkça söylenmeli:

- VS Code
- Terminal
- Vercel
- Supabase
- Finder

---

## 10. Kullanıcının tasarım tercihleri

- Saydam / soluk turuncu / cam efekti sevilmiyor.
- Opak, temiz, minimal, düz ve premium tasarım tercih ediliyor.
- Gereksiz kontur, soluk renk ve yarı saydam chiplerden kaçınılmalı.
- “A şeridi” eski turuncu sol menü tasarımını ifade eder.
- Sidebar animasyonları daha önce hassas şekilde ayarlandı; gerekmedikçe Sidebar’a dokunulmamalı.
- Daha önce beğenilen çalışan davranışlar bozulmamalı.

---

## 11. Şu andan sonraki önerilen adım

Sıradaki mantıklı geliştirme:

```txt
Ekip üyesi görev yetki sistemi
```

Hedef:

- Abdullah kendisine atanan görevi düzenleyebilsin.
- Abdullah kendisine atanmayan görevi panoda görse bile düzenleyemesin.
- Abdullah kendisine atanmayan görevde dosya, yorum, durum değiştirme yapamasın.
- ZRC AJANS her şeyi yönetmeye devam etsin.

Bu adıma başlamadan önce mevcut v270 güvenli noktası korunmuştur.
