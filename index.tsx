import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Dev helpers (commented out for production)
// import './utils/testTranslation';
// import './utils/autoTranslate';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
