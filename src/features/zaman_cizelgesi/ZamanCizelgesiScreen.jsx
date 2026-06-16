import React from 'react';
import ZamanCizelgesiTabPanel from './ZamanCizelgesiTabPanel';

// v536b: Feature screen wrapper.
// Panel dosyası korunur; üst seviye ekran dosyası buradan yönetilir.
export default function ZamanCizelgesiScreen(props) {
  return <ZamanCizelgesiTabPanel {...props} />;
}
