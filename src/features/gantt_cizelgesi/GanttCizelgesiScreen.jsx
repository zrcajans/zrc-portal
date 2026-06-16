import React from 'react';
import GanttCizelgesiTabPanel from './GanttCizelgesiTabPanel';

// v536b: Feature screen wrapper.
// Panel dosyası korunur; üst seviye ekran dosyası buradan yönetilir.
export default function GanttCizelgesiScreen(props) {
  return <GanttCizelgesiTabPanel {...props} />;
}
