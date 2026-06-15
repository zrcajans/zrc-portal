import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { registerZrcPwa } from './pwaRegister';

import ZRCGlobalRuntimeBoundary from './components/ZRCGlobalRuntimeBoundary';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ZRCGlobalRuntimeBoundary>
      <App />
    </ZRCGlobalRuntimeBoundary>
  </React.StrictMode>
);

registerZrcPwa();
