import React from 'react';
import GorevlerTabPanel from './GorevlerTabPanel';

// v536b: Feature screen wrapper.
// Panel dosyası korunur; üst seviye ekran dosyası buradan yönetilir.
export default function GorevlerScreen(props) {
  return <GorevlerTabPanel {...props} />;
}
