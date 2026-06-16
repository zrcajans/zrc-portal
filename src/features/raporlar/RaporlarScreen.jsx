import React from 'react';
import RaporlarTabPanel from './RaporlarTabPanel';

// v536b: Feature screen wrapper.
// Panel dosyası korunur; üst seviye ekran dosyası buradan yönetilir.
export default function RaporlarScreen(props) {
  return <RaporlarTabPanel {...props} />;
}
