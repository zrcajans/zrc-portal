import React from 'react';
import TakvimTabPanel from './TakvimTabPanel';

// v536b: Feature screen wrapper.
// Panel dosyası korunur; üst seviye ekran dosyası buradan yönetilir.
export default function TakvimScreen(props) {
  return <TakvimTabPanel {...props} />;
}
