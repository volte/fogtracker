import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@/components/App';

import '@assets/css/index.css';
import '@assets/css/reset.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
