# ZRC PROJE DEVİR DOSYASI

Bu dosya, ZRC iş takip sistemi ve ZRC AJANS dijital altyapısının başka bir sohbet, başka bir ChatGPT hesabı, Claude/Gemini veya başka bir geliştirici tarafından kaldığı yerden devam ettirilebilmesi için hazırlanmıştır.

## Yeni yapay zekaya / geliştiriciye ilk talimat

Bu proje **ZRC AJANS iş takip sistemi** projesidir. Kullanıcı Enes Zariç, teknik detaylarda hızlı ve net yönlendirme ister.

Çalışma tarzı:
- Kod parçaları istemez; mümkünse ilgili dosyanın **tam halini** ister.
- Özellikle `src/App.jsx` değişeceğinde, dosyanın tamamını TXT olarak ver.
- Kullanıcı sonra VS Code içinde `src/App.jsx` içeriğini komple silip yeni içeriği yapıştırır.
- Her adımda işlemin nerede yapılacağını açık söyle: **VS Code**, **Chrome/Vercel**, **Chrome/Supabase**, **Squarespace**, **Terminal**.
- Gereksiz mikro test listeleriyle yavaşlatma. Sadece görünür kritik sorunlara odaklan.
- Kullanıcı hızlıca kullanılabilir sisteme gitmek istiyor; detaylı iyileştirmeler sonra yapılacak.
- Terminal komutları mümkün olduğunca az olmalı.

Güncelleme sonrası yayın için genelde tek komut kullanılır:

```bash
npm run build && git add src/App.jsx && git commit -m "KISA_COMMIT_MESAJI" && git push
```

Eğer Vercel deployment tetiklenmezse:

```bash
git commit --allow-empty -m "vercel yayini tetikle" && git push
```

---

## Mevcut ana karar

Şu an öncelik **tanıtım sitesi değil**, **iş takip sisteminin web tarafını kullanılabilir ve güzel hale getirmek**.

Tanıtım sitesi bütçe nedeniyle sonraya bırakıldı.

Şimdiki hedef:
1. Web portalı görsel olarak güzelleştirmek.
2. Web tarafını kullanılabilir hale getirmek.
3. Sonra iOS/mobil uyumluluk.
4. Sonra bildirim sistemi.
5. Daha sonra iOS/Android mobil uygulama.
6. Daha sonra macOS/Windows masaüstü uygulamaları.
7. En son veya bütçe uygun olunca ZRC AJANS tanıtım web sitesi.

---

## Canlı adresler ve servisler

### İş takip sistemi canlı adresi

```txt
https://portal.zrcajans.com
```

Eski Vercel adresi:

```txt
https://zrc-portal.vercel.app
```

Kullanıcıya ve müşterilere verilecek ana adres:

```txt
portal.zrcajans.com
```

### GitHub repo

```txt
zrcajans/zrc-portal
```

Repo public yapıldı. Bunun sebebi Vercel deployment engelini aşmaktı.

### Vercel projesi

```txt
zrc-portal
```

Vercel, iş takip sisteminin frontend yayın yeridir.

### Supabase projesi

```txt
zrc-is-takip
```

Supabase, iş takip sisteminin veritabanı, Auth ve Storage tarafıdır.

### Domain / DNS

Domain:

```txt
zrcajans.com
```

Domain yönetimi Squarespace üzerinden yapılıyor.

Alt alan adı:

```txt
portal.zrcajans.com
```

Squarespace DNS içinde CNAME kaydı:

```txt
Type: CNAME
Host/Name: portal
Value/Data: cname.vercel-dns.com
TTL: 30 dakika
```

Bu kayıt yapıldı ve kullanıcı `portal.zrcajans.com` yazınca iş takip sistemine yönlendiğini doğruladı.

### Supabase Storage

Doğru bucket:

```txt
project-files
```

Yanlışlıkla oluşturulan ama kullanılmaması gereken bucket:

```txt
zrc-files
```

Yeni kodlarda `zrc-files` kullanılmamalı.

---

## Mevcut çalışan durum

Aşağıdaki durumlar canlı sistemde doğrulandı:

```txt
Vercel yayını çalışıyor.
portal.zrcajans.com iş takip sistemine gidiyor.
Supabase bağlantısı çalışıyor.
Proje oluşturma/silme Supabase ile senkron çalışıyor.
Kolon oluşturma/silme/düzenleme kalıcı çalışıyor.
Görev oluşturma/okuma temel akışı çalışıyor.
Normal sekme ve gizli sekme senkron sorunu çözüldü.
Ekipte sadece kullanıcı görünüyor.
Müşteri listesi boş / kontrol edildi.
Dosya yükleme ve yenileme sonrası kalıcılık daha önce doğrulandı.
```

Artık normal/gizli sekme karşılaştırması yaptırılmamalı. Kullanıcı özellikle istemedikçe sadece normal canlı site testi yeterli.

---

## Son önemli düzeltmeler

### Deployment engeli

Vercel deployment "Engellendi" durumuna düşmüştü.

Çözüm:
1. GitHub repo public yapıldı.
2. Terminalde şu komutla yeni deployment tetiklendi:

```bash
git commit --allow-empty -m "vercel yayini tetikle" && git push
```

Sonra Vercel deployment "Hazır" oldu.

### Proje/kolon senkron sorunu

Önceden normal sekme, gizli sekme ve Supabase farklı projeleri gösteriyordu:
- Normal sekmede `Ödev`
- Gizli sekmede `E-Ticaret Arayüz Tasarımı`
- Gerçek proje `Çalışma`

Son düzeltme:

```txt
App_proje_supabase_sync_v158.txt
```

Bu düzeltmeden sonra:
- Proje oluşturma/silme Supabase’e gidiyor.
- Normal sekme ve gizli sekme aynı veriyi gösteriyor.
- Kolon silme yenilemeden sonra geri gelmiyor.

### Portal domain bağlantısı

Vercel’de `portal.zrcajans.com` eklendi.
Squarespace DNS içinde `portal` CNAME kaydı `cname.vercel-dns.com` değerine yönlendirildi.
Kullanıcı portal adresinin iş takip sistemine gittiğini doğruladı.

---

## Mevcut gerçek veri hedefleri

### Projeler

Gerçek ana proje:

```txt
Çalışma
```

Demo/test proje olarak görülüp silinen proje:

```txt
E-Ticaret Arayüz Tasarımı
```

Bu geri getirilmemeli.

### Kolonlar

Varsayılan gerçek kolonlar:

```txt
Yeni Görev
Aktif
Tamamlandı
Askıya Alındı
```

Eski `Bekliyor` adı kullanılmamalı. `Bekliyor` görülürse `Yeni Görev` olarak normalize edilmeli.

### Ekip

Şu an ekipte sadece kullanıcı kalmalı.

```txt
ZRC AJANS / Enes
Rol: Patron/Yönetici
E-posta: info@zrcajans.com veya kullanıcının aktif hesabı
```

Demo ekip üyeleri eklenmemeli:
- Ahmet
- Zeynep
- Can
- Demo Misafir
- Test kullanıcıları

### Müşteriler

Müşteri listesi başlangıçta boş olmalı.

```txt
Müşteri sayısı: 0
```

Demo müşteriler geri getirilmemeli.

---

## Kullanıcının proje tercihi

Kullanıcı bu projede:
- Hızlı ilerlemek istiyor.
- Kod parçalarıyla uğraşmak istemiyor.
- Gereksiz test listeleriyle zaman kaybetmek istemiyor.
- Önce web portalı bitirmek istiyor.
- Sonra mobil uyumluluk ve bildirimlere geçmek istiyor.
- Tanıtım sitesi bütçe nedeniyle sonraya bırakıldı.
- Mobil uygulama, masaüstü uygulama ve tanıtım sitesi hedefte ama şu an öncelik değil.

---

## Teknik yapı

### Frontend

React + Vite uygulaması.

Ana dosya genelde:

```txt
src/App.jsx
```

Bileşenler:

```txt
src/components/Layout/Sidebar
src/components/Layout/TopNavbar
src/components/Modals/TaskModal
src/components/Modals/StageModal
```

### Backend

Supabase kullanılıyor:
- Veritabanı
- Auth
- Storage
- İleride Realtime / bildirim altyapısı

### Yayın

Vercel kullanılıyor.

### Domain

Squarespace DNS kullanılıyor.

---

## Supabase tablo yapısı

Kurulu tablolar arasında şunlar var:

```txt
activity_logs
board_columns
chat_group_members
chat_groups
customers
files
messages
notifications
profiles
project_customers
project_members
projects
quick_notes
task_assignees
task_comments
task_followers
task_steps
tasks
user_preferences
workspace_members
workspaces
```

---

## Yapılmaması gerekenler

```txt
Kullanıcı istemedikçe tanıtım sitesine geçme.
Kullanıcı istemedikçe gizli sekme testi yaptırma.
`zrc-files` bucketını kullanma.
Demo proje/müşteri/ekip üyesi ekleme.
Kod parçaları verip “şunu şu satıra ekle” deme.
Vercel/Supabase/Squarespace rollerini karıştırma.
Klasik hosting üzerine iş takip sistemini taşımaya çalışma; gerekirse ileride ayrıca değerlendirilir.
```

---

## Şimdiki sıradaki iş

Sıradaki plan:

```txt
Web Görsel Final Paketi v159
```

Hedef:
- Ana sayfa daha profesyonel görünsün.
- Boş ekranlar temiz olsun.
- Sol menü / üst bar daha premium hale gelsin.
- Proje ve görev ekranları daha düzenli olsun.
- Kart/kolon aralıkları güzelleşsin.
- Butonlar modernleşsin.
- Portal hissi güçlensin.
- Mobil tarafına geçmeden önce web tarafı kullanılabilir ve şık hale gelsin.

Önerilen dosya adı:

```txt
App_web_gorsel_final_v159.txt
```

Uygulama yöntemi:
1. TXT dosyası ver.
2. Kullanıcı VS Code’da `src/App.jsx` içeriğini komple silip yapıştırır.
3. `Command + S`
4. Terminalde:

```bash
npm run build && git add src/App.jsx && git commit -m "web gorsel final v159" && git push
```

5. Vercel deployment `Hazır` olunca `portal.zrcajans.com` üzerinde normal sekmede kontrol edilir.

---

## Handoff güncelleme notu

Bu dosya her büyük aşamadan sonra güncellenmelidir.

Son güncelleme:

```txt
2026-06-04
```
