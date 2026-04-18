import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const styleElement = document.createElement('style');
styleElement.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; height: 100%; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    background-color: #f8fafc;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(styleElement);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);