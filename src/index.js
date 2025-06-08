import React from 'react';
import ReactDOM from 'react-dom/client'; // Importar de 'react-dom/client' para React 18+
import App from './App'; // Importar o componente principal
import './index.css'; // Importar os estilos Tailwind CSS

// Encontra o elemento 'root' no seu HTML para montar a aplicação React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza o componente App dentro do elemento 'root'
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
