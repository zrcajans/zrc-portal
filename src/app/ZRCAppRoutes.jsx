import React from 'react';
import GorevlerScreen from '../features/gorevler/GorevlerScreen';
import TakvimScreen from '../features/takvim/TakvimScreen';
import DosyalarScreen from '../features/dosyalar/DosyalarScreen';
import RaporlarScreen from '../features/raporlar/RaporlarScreen';
import GanttCizelgesiScreen from '../features/gantt_cizelgesi/GanttCizelgesiScreen';
import ZamanCizelgesiScreen from '../features/zaman_cizelgesi/ZamanCizelgesiScreen';

// v536b: Feature screen router hazırlık dosyası.
// Bu dosya sonraki adımda Shell'deki aktif ekran yönlendirmesini merkezileştirmek için kullanılacak.
// Şimdilik Screen wrapper yapısı aktif, router hazır bekliyor.
export default function ZRCAppRoutes(props) {
  const { activeTab } = props;

  switch (activeTab) {
    case 'gorevler':
      return <GorevlerScreen {...props} />;
    case 'tasks':
      return <GorevlerScreen {...props} />;
    case 'Görevler':
      return <GorevlerScreen {...props} />;
    case 'takvim':
      return <TakvimScreen {...props} />;
    case 'calendar':
      return <TakvimScreen {...props} />;
    case 'Takvim':
      return <TakvimScreen {...props} />;
    case 'dosyalar':
      return <DosyalarScreen {...props} />;
    case 'files':
      return <DosyalarScreen {...props} />;
    case 'Dosyalar':
      return <DosyalarScreen {...props} />;
    case 'raporlar':
      return <RaporlarScreen {...props} />;
    case 'reports':
      return <RaporlarScreen {...props} />;
    case 'Raporlar':
      return <RaporlarScreen {...props} />;
    case 'gantt_cizelgesi':
      return <GanttCizelgesiScreen {...props} />;
    case 'gantt':
      return <GanttCizelgesiScreen {...props} />;
    case 'Gantt Çizelgesi':
      return <GanttCizelgesiScreen {...props} />;
    case 'zaman_cizelgesi':
      return <ZamanCizelgesiScreen {...props} />;
    case 'timeline':
      return <ZamanCizelgesiScreen {...props} />;
    case 'Zaman Çizelgesi':
      return <ZamanCizelgesiScreen {...props} />;
    default:
      return null;
  }
}
