# ZRC PROJE DEVİR DOSYASI — SAFE v520

Tarih: 2026-06-15 22:26:26
Amaç: ChatGPT sohbeti kapanırsa veya bağlam kaybolursa projeyi aynı yerden devam ettirmek.

## 1. Güncel Durum

- Proje klasörü: `~/Desktop/zrc-portal`
- Canlı adres: `portal.zrcajans.com`
- Git branch: `main`
- Son commit: `3c1e803`
- Build durumu: `npm run build` başarılı
- Son büyük işlem: **v519 mega shell + top-level split**
- Kritik not: `src/App.jsx` artık 19K satırlık ana dosya değil, mini entry dosyasıdır.

## 2. Yeni Dosya Yapısı

Artık ana akış şu şekildedir:

```txt
src/App.jsx
  ↓
src/app/ZRCAppShell.jsx
  ↓
src/app/ZRCAppTopLevel.jsx
```

### Dosya rolleri

- `src/App.jsx`
  - Mini giriş dosyası.
  - Büyük kod burada değildir.
  - Genelde şu mantıkta olmalı:
    ```jsx
    import ZRCAppShell from './app/ZRCAppShell';

    export default ZRCAppShell;
    ```

- `src/app/ZRCAppShell.jsx`
  - Ana çalışan uygulama kabuğu.
  - Eskiden App.jsx içinde olan büyük gövdenin büyük kısmı burada.
  - Bundan sonraki refactorlar esas olarak bu dosya üzerinden yapılmalı.

- `src/app/ZRCAppTopLevel.jsx`
  - App fonksiyonundan önceki sabitler/helperlar ayrılmıştır.
  - Top-level import/sabit/helper alanıdır.

## 3. Önemli Dosya Satır Sayıları

- `src/App.jsx`: 3 satır
- `src/app/ZRCAppShell.jsx`: 19195 satır
- `src/app/ZRCAppTopLevel.jsx`: 286 satır
- `src/components/mobile/MobileTaskMoveButtons.jsx`: 60 satır
- `src/utils/appSafeHelpers.js`: 60 satır
- `src/utils/browserEnhancements.js`: 896 satır
- `src/utils/dashboardHelpers.js`: 398 satır
- `src/utils/projectDefaults.js`: 58 satır
- `src/utils/projectFileHelpers.js`: 71 satır
- `src/utils/colorHelpers.js`: 92 satır
- `src/utils/customerDeletionHelpers.js`: 71 satır
- `src/utils/calendarQuickTaskHelper.js`: 59 satır
- `src/utils/teamHelpers.js`: 155 satır
- `src/utils/storageHelpers.js`: YOK satır
- `src/utils/avatarHelpers.jsx`: 34 satır

## 4. Son Refactor Geçmişi

Önemli dönüm noktaları:

- v499:
  - React error #310 düzeltildi.
  - Sebep: login ekranı erken return bloğu hook sırasını bozuyordu.
  - Çözüm: login return hooklardan sonra taşındı.

- v500:
  - Çalışan stabil checkpoint alındı.

- v501:
  - `TaskDetailModal` ayrıldı.

- v502:
  - Browser/PWA/Push/DueDate blokları ayrıldı.
  - Sonrasında eksik zrcV helper import problemi çıktı.

- v503:
  - Renk helperları ve proje dosya helperları ayrıldı.

- v504:
  - Dashboard/tarih/takvim/arama/not helperları ayrıldı.

- v505:
  - Project defaults, select controls, clipboard helper ayrıldı.

- v507:
  - `zrcV426bApplyDueDateColors` gibi undefined kalan helperlar için local fallback eklendi.
  - Canlıyı düşüren `zrcV426bApplyDueDateColors is not defined` hatası kapatıldı.

- v508:
  - v507 sonrası yeni stabil checkpoint alındı.

- v509:
  - Customer deletion helpers ayrıldı.

- v511/v512/v513:
  - Otomatik helper refactor denenmiş, güvenli olmayanlar build ile geri alınmıştı.
  - Sonuç: küçük helper refactoru artık verimsizleşti.

- v515:
  - `openCalendarQuickTaskCreator` helper dosyasına ayrıldı.

- v517d:
  - `MobileTaskMoveButtons` doğru satır bazlı kesimle component dosyasına ayrıldı.
  - Önceki v517/v517c denemeleri build’de durdu ve rollback yaptı.
  - Kritik ders: JSX marker bölümleri regex ile değil, bağlam/satır bazlı kesilmeli.

- v519:
  - Mega işlem yapıldı.
  - `App.jsx` mini entry oldu.
  - Büyük uygulama `src/app/ZRCAppShell.jsx` içine taşındı.
  - Top-level blok `src/app/ZRCAppTopLevel.jsx` içine ayrıldı.

## 5. Bilinen Riskler ve Kurallar

### Dokunurken dikkat edilecek alanlar

- Storage/navigation/login/auth hook sırası hassas.
- `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef` içeren alanlar taşınırken çok dikkat edilmeli.
- React error #310 tekrar çıkarsa ilk bakılacak şey hook sırasıdır.
- `savedNavigation.activeMenu` tipi doğrudan okumalardan kaçınılmalı.
- PWA/cache sebebiyle canlıda eski bundle görünebilir; PWA temizleme gerekebilir.

### Refactor prensibi

- Her işlemden önce:
  ```bash
  npm run build
  ```

- Her işlemden sonra:
  ```bash
  npm run build
  git add ...
  git commit -m "..."
  git push
  ```

- Hata çıkarsa:
  - Script rollback yapmalı.
  - Hata raporunu `pbcopy` ile panoya kopyalamalı.
  - Kullanıcı Command+V ile hatayı paylaşmalı.

### Kullanıcı tercihi

- Kullanıcı kısa ve net işlem ister.
- Terminal kodu tek seferde mümkün olduğunca büyük iş yapmalı.
- Her scriptte büyük `DUR` / `TAMAM` bannerları olmalı.
- Hata olursa rapor panoya kopyalanmalı.
- Kod ekletmek yerine script ile otomatik dosya düzenleme tercih edilir.

## 6. Rollback / Güvenli Noktalar

Stable branchler:

```txt
stable/v508-working-after-refactor-20260615-113648
  stable/v500-working-20260615-110243
```

Backup branchler:

```txt
backup/pre-v519-mega-shell-split-20260615-222118
  backup/pre-v518-mega-app-shell-split-20260615-221620
  backup/pre-v498-restore-v480-20260614-205136
  backup/pre-v492-restore-20260614-201617
  backup/before-task-bug-rollback-20260610-102421
```

Son tagler:

```txt
v508-working-after-refactor-20260615-113648
v500-working-site-20260615-110243
zrc-safe-v400-mobile-final-sync
zrc-safe-v398-mobile-final
zrc-safe-v368-mobile-devir
zrc-safe-v367-mobile-final
zrc-safe-v359-devir
zrc-safe-v355-final-pre-mobile
zrc-safe-v358-final-before-mobile
zrc-safe-v340-gorev-duzeldi
zrc-safe-v342-gorev-duzeldi
zrc-safe-v323-calisan-yayin
```

Acil rollback genel mantığı:

```bash
git log --oneline -20
git reset --hard <stabil_commit>
git push --force-with-lease
```

V519 öncesi backup branch terminalde şu formatta oluşturuldu:

```txt
backup/pre-v519-mega-shell-split-...
```

## 7. Son Commitler

```txt
3c1e803 mega shell ve top level helperlari ayir v519
c0fa68d mega app shell dosyasini ayir v518
c545f03 mobil task move buttons linebased component ayir v517d
badfd55 calendar quick task helper ayir v515
c756d3e guvenli saf helperlari otomatik ayir v511
a1c7e4b silinen musteri helperlarini ayir v509-safe
5e0e8b4 stabil refactor sonrasi checkpoint v508
e52eb26 eksik zrc helper fallbacklerini ekle v507
fdb8b84 common controls helperlarini ayir v505-safe
260d15d dashboard helperlarini ayir v504-safe
3f41e1d renk ve proje dosya helperlarini ayir v503-safe
7c046f3 browser pwa push bloklarini ayir v502-safe
```

## 8. Git Status

```txt
Temiz
```

## 9. Live Version

`public/zrc-live-version.json` içeriği:

```json
{
  "build": "v519-mega-shell-and-top-level-split",
  "note": "App.jsx mini entry dosyasına çevrildi; büyük uygulama src/app/ZRCAppShell.jsx içine taşındı; App fonksiyonu öncesi top-level sabit/helper bloğu src/app/ZRCAppTopLevel.jsx dosyasına ayrıldı.",
  "changed": [
    "App.jsx zaten mini entry idi; mevcut src/app/ZRCAppShell.jsx üzerinden devam edildi",
    "App fonksiyonu öncesi top-level blok ayrıldı: 178 satır",
    "src/app/ZRCAppTopLevel.jsx oluşturuldu; export sayısı: 13"
  ],
  "appJsxLinesBefore": 4,
  "appJsxLinesAfter": 4,
  "shellLinesBeforeTopSplit": 19359,
  "shellLinesAfter": 19196,
  "topLevelFileLines": 287,
  "commitBefore": "c0fa68d",
  "createdAt": "2026-06-15T19:21:20.248182+00:00"
}

```

## 10. Sonraki Mantıklı Adımlar

Bundan sonra küçük helper ayrımı yerine:

1. `src/app/ZRCAppShell.jsx` içinden büyük bölümler prop analiziyle ayrılmalı.
2. Önce en izole mobile/board parçası seçilmeli.
3. Marker bazlı JSX kesimlerinde kesinlikle bağlam raporu alınmalı.
4. Büyük ekranlar ayrı klasörlere bölünebilir:

```txt
src/features/board/
src/features/calendar/
src/features/customers/
src/features/team/
src/features/files/
src/features/reports/
src/features/settings/
```

Önerilen sonraki script tipi:

- Önce rapor:
  ```bash
  local_reports/vXXX_context_*.txt
  ```
- Sonra gerçek taşıma:
  - build öncesi
  - patch
  - build sonrası
  - commit/push
  - hata olursa pbcopy

## 11. Tam Kaynak Ağacı

```txt
src/.DS_Store
src/App.css
src/App.jsx
src/app/README.md
src/app/ZRCAppShell.jsx
src/app/ZRCAppTopLevel.jsx
src/assets/hero.png
src/assets/react.svg
src/assets/vite.svg
src/components/.DS_Store
src/components/common/SelectControls.jsx
src/components/common/ZRCErrorBoundary.jsx
src/components/Layout/Sidebar.jsx
src/components/Layout/TopNavbar.jsx
src/components/mobile/MobilePremiumHeader.jsx
src/components/mobile/MobileProjectPicker.jsx
src/components/mobile/MobileTaskCard.jsx
src/components/mobile/MobileTaskList.jsx
src/components/mobile/MobileTaskMoveButtons.jsx
src/components/mobile/MobileTaskSection.jsx
src/components/mobile/MobileTaskWizard.jsx
src/components/mobile/MobileWorkspace.jsx
src/components/Modals/StageModal.jsx
src/components/Modals/TaskDetailModal.jsx
src/components/Modals/TaskModal.jsx
src/index.css
src/main.jsx
src/pwaRegister.js
src/supabaseClient.js
src/utils/appSafeHelpers.js
src/utils/avatarHelpers.jsx
src/utils/browserEnhancements.js
src/utils/calendarQuickTaskHelper.js
src/utils/clipboardHelpers.js
src/utils/colorHelpers.js
src/utils/customerDeletionHelpers.js
src/utils/dashboardHelpers.js
src/utils/mobileProjectHelpers.js
src/utils/mobileTaskAssignees.js
src/utils/projectDefaults.js
src/utils/projectFileHelpers.js
src/utils/teamHelpers.js
src/zrc-mobile.css
```

## 12. Son Local Reports

```txt
v520_devir_backup_20260615-222624.log
v519_mega_shell_and_top_level_split_20260615-222118.log
v519_mega_shell_and_top_level_split_20260615-222120.txt
v518_mega_app_shell_split_20260615-221620.log
v518_mega_app_shell_split_20260615-221622.txt
v517d_extract_mobile_task_move_buttons_20260615-215951.log
v517c_error_capture_20260615-215643.txt
v517b_mobile_task_move_buttons_context_20260615-213935.txt
v516_next_refactor_plan_20260615-184430.txt
v514_jsx_component_map_20260615-124857.txt
v514_jsx_component_map_20260615-124816.txt
v514_jsx_component_map_20260615-124755.txt
v514_jsx_component_map_20260615-122256.txt
v513_no_safe_group_found_20260615-121933.txt
v510_refactor_map_20260615-115941.txt
v510_refactor_map_20260615-115352.txt
zrc_status_report_20260614-181415.txt
```

---

Bu dosya, sohbet bağlamı kaybolursa yeni ChatGPT oturumuna verilecek ana devir dosyasıdır.
