import React from 'react';
import DosyalarTabPanel from './DosyalarTabPanel';

// v536b: Feature screen wrapper.
// Panel dosyası korunur; üst seviye ekran dosyası buradan yönetilir.
export default function DosyalarScreen(props) {
  return <DosyalarTabPanel {...props} />;
}
